// Führt alle Prüfer in bau/pruefen/*.mjs aus (außer index.mjs).
// Schnittstelle je Prüfer-Modul:
//   export const name = 'kurzname';
//   export async function pruefe(ctx) → Array<{ regel, schwere: 'fehler'|'warnung'|'info', datei?, meldung }>
// ctx = { wurzel, dist, modus: 'vorschau'|'messen'|'release', basisUrl,
//         seiten: [{ pfad, datei, html, typ, indexierbar }],   // gerenderte HTML-Seiten (Ausgabe)
//         dateien: [relativer Pfad aller Ausgabedateien], konfig: { betrieb, preise, zonen, … } }
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export async function pruefeAlles(ctx, { nur = null } = {}) {
  const ordner = join(ctx.wurzel, 'bau/pruefen');
  const module = (await readdir(ordner)).filter((n) => n.endsWith('.mjs') && n !== 'index.mjs').sort();
  const ergebnisse = [];
  for (const n of module) {
    const m = await import(pathToFileURL(join(ordner, n)).href);
    if (typeof m.pruefe !== 'function') throw new Error(`Prüfer ${n} exportiert keine Funktion pruefe()`);
    const name = m.name || n.replace(/\.mjs$/, '');
    if (nur && !nur.includes(name)) continue;
    const start = performance.now();
    let befunde;
    try { befunde = await m.pruefe(ctx); } catch (e) { befunde = [{ regel: `${name}/absturz`, schwere: 'fehler', meldung: e.stack || String(e) }]; }
    ergebnisse.push({ name, ms: Math.round(performance.now() - start), befunde });
  }
  return ergebnisse;
}

/** Zusammenfassung; im Release-Modus zählen Warnungen der Regeln in `streng` als Fehler. */
export function auswerten(ergebnisse, { streng = [] } = {}) {
  let fehler = 0; let warnungen = 0;
  const zeilen = [];
  for (const e of ergebnisse) {
    const f = e.befunde.filter((b) => b.schwere === 'fehler' || (b.schwere === 'warnung' && streng.includes(b.regel)));
    const w = e.befunde.filter((b) => b.schwere === 'warnung' && !streng.includes(b.regel));
    fehler += f.length; warnungen += w.length;
    zeilen.push(`${f.length ? '✗' : '✓'} ${e.name.padEnd(14)} ${String(f.length).padStart(4)} Fehler ${String(w.length).padStart(5)} Warnungen  (${e.ms} ms)`);
    for (const b of f.slice(0, 15)) zeilen.push(`    ${b.regel}: ${b.datei ? b.datei + ' – ' : ''}${b.meldung}`);
    if (f.length > 15) zeilen.push(`    … ${f.length - 15} weitere`);
  }
  return { fehler, warnungen, text: zeilen.join('\n') };
}
