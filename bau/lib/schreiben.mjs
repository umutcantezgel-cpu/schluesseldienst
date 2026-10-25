// Schreibt Dateien nur bei Änderung und entfernt verwaiste Dateien aus dem Ausgabeordner.
import { mkdir, readFile, writeFile, readdir, unlink, rmdir } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';

export class Schreiber {
  constructor(ziel) { this.ziel = ziel; this.geschrieben = new Set(); this.geaendert = 0; this.unveraendert = 0; }
  async schreibe(pfad, inhalt) {
    const datei = join(this.ziel, pfad);
    if (this.geschrieben.has(datei)) throw new Error(`Doppelt geschrieben: ${pfad}`);
    this.geschrieben.add(datei);
    const neu = typeof inhalt === 'string' ? Buffer.from(inhalt, 'utf8') : inhalt;
    try {
      const alt = await readFile(datei);
      if (alt.equals(neu)) { this.unveraendert++; return; }
    } catch { /* neu */ }
    await mkdir(dirname(datei), { recursive: true });
    await writeFile(datei, neu);
    this.geaendert++;
  }
  /** Entfernt alles im Ziel, was in diesem Lauf nicht geschrieben wurde. */
  async aufraeumen() {
    let entfernt = 0;
    const gehe = async (ordner) => {
      let eintraege;
      try { eintraege = await readdir(ordner, { withFileTypes: true }); } catch { return; }
      for (const e of eintraege) {
        const p = join(ordner, e.name);
        if (e.isDirectory()) { await gehe(p); try { await rmdir(p); } catch { /* nicht leer */ } }
        else if (!this.geschrieben.has(p)) { await unlink(p); entfernt++; }
      }
    };
    await gehe(this.ziel);
    return entfernt;
  }
  bericht() { return { geschrieben: this.geschrieben.size, geaendert: this.geaendert, unveraendert: this.unveraendert }; }
  relativ(datei) { return '/' + relative(this.ziel, datei); }
}
