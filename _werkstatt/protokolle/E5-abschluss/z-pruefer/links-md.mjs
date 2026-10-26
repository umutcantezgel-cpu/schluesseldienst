// Z-10 (nur Lesen): tote relative Links und Anker in den Übergabe-Dokumenten.
import { readFileSync, existsSync, statSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
const W = '/home/user/schluesseldienst';
const DATEIEN = ['_werkstatt/BERICHT.md', '_werkstatt/KERN.md', '_werkstatt/MENSCHEN.md', 'README.md',
  'docs/BETRIEB.md', 'docs/OFFENE-PUNKTE.md', 'docs/HOSTER-CHECKLISTE.md', 'docs/ENTSCHEIDUNGEN.md',
  'docs/ORTE-ABGLEICH.md', 'docs/ZUSAMMENFUEHREN.md'];
// GitHub-artige Slugs: Kleinbuchstaben, Umlaute bleiben, Satzzeichen weg, Leerzeichen zu Bindestrich
const slug = (t) => t.replace(/<[^>]+>/g, '').replace(/[`*_]/g, '').trim().toLowerCase()
  .replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s/g, '-');
const anker = (text) => new Set(text.split('\n').filter((z) => /^#{1,6}\s/.test(z)).map((z) => slug(z.replace(/^#{1,6}\s+/, ''))));
const ergebnis = { werkzeug: 'links-md', zeitpunkt: new Date().toISOString(), dateien: [], tot: [] };
let geprueft = 0;
for (const d of DATEIEN) {
  const pfad = resolve(W, d);
  const text = readFileSync(pfad, 'utf8');
  const ohneCode = text.replace(/```[\s\S]*?```/g, (m) => m.replace(/[^\n]/g, ' ')).replace(/`[^`\n]*`/g, (m) => ' '.repeat(m.length));
  const zeilen = ohneCode.split('\n');
  let n = 0;
  zeilen.forEach((zeile, i) => {
    for (const m of zeile.matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      const ziel = m[1];
      if (/^(https?:|mailto:|tel:)/i.test(ziel)) continue;
      n += 1; geprueft += 1;
      const [pfadTeil, anchor] = ziel.split('#');
      const zielDatei = pfadTeil ? resolve(dirname(pfad), decodeURIComponent(pfadTeil)) : pfad;
      let grund = null;
      if (!existsSync(zielDatei)) grund = 'Ziel fehlt';
      else if (anchor && zielDatei.endsWith('.md') && statSync(zielDatei).isFile()) {
        const ziels = anker(readFileSync(zielDatei, 'utf8'));
        if (!ziels.has(decodeURIComponent(anchor))) grund = `Anker #${anchor} fehlt`;
      }
      if (grund) ergebnis.tot.push({ datei: d, zeile: i + 1, link: ziel, grund });
    }
  });
  ergebnis.dateien.push({ datei: d, links: n });
}
ergebnis.geprueft = geprueft;
writeFileSync(`${W}/.cache/e5-abschluss/z-pruefer/links-md.json`, JSON.stringify(ergebnis, null, 2) + '\n');
console.log(`geprüfte relative Links: ${geprueft}`);
for (const t of ergebnis.tot) console.log(`TOT ${t.datei}:${t.zeile} → ${t.link} (${t.grund})`);
console.log(`tote Links: ${ergebnis.tot.length}`);
