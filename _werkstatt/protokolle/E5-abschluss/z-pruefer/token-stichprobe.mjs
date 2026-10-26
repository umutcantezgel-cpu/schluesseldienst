// Z-03 Stichprobe (nur Lesen): Werte außerhalb von var(--…) in den fünf gezogenen CSS-Dateien.
// Erlaubt: 0, 1, Prozent, Breakpoints in em innerhalb einer @media-Zeile, unitless SVG-Werte (keine in CSS-Dateien).
import { readFileSync, writeFileSync } from 'node:fs';
const WURZEL = '/home/user/schluesseldienst';
const dateien = readFileSync(`${WURZEL}/.cache/e5-abschluss/z-pruefer/css-stichprobe.txt`, 'utf8').split('\n').filter(Boolean);
const EINHEIT = /(?<![\w.#-])(-?(?:\d+(?:\.\d+)?|\.\d+))(px|rem|em|vmin|vmax|vw|vh|svw|svh|dvw|dvh|lvw|lvh|ch|ex|cm|mm|in|pc|pt|q|ms|s|deg)(?![\w%-])/gi;
const HEX = /#[0-9a-f]{3,8}(?![\w-])/gi;
const FARBFUNKTION = /(?<![\w-])(rgba?|hsla?|oklch|oklab|color-mix|light-dark)\(/gi;
const ZAHL_OHNE_EINHEIT = /(?<![\w.#-])(\.\d+|\d+\.\d+|\d+)(?![\w%.-])/g;
const bericht = { werkzeug: 'token-stichprobe', zeitpunkt: new Date().toISOString(), dateien: [] };
for (const datei of dateien) {
  const quelle = readFileSync(`${WURZEL}/${datei}`, 'utf8');
  const ohneKommentar = quelle.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  const befunde = [];
  ohneKommentar.split('\n').forEach((zeile, i) => {
    // Inhalt von var(…) ausblenden (auch Fallback), damit nur Werte außerhalb zählen
    let rest = zeile.replace(/var\((?:[^()]|\([^()]*\))*\)/g, (m) => ' '.repeat(m.length));
    if (/^\s*(\/\/|$)/.test(rest)) return;
    const imMedia = /@media/.test(zeile);
    for (const m of rest.matchAll(EINHEIT)) {
      const [, zahl, einheit] = m;
      if (parseFloat(zahl) === 0) continue;
      if (imMedia && einheit.toLowerCase() === 'em') continue; // Breakpoints
      befunde.push({ zeile: i + 1, wert: m[0], art: 'Maßeinheit' });
    }
    for (const m of rest.matchAll(HEX)) befunde.push({ zeile: i + 1, wert: m[0], art: 'Hex-Farbe' });
    for (const m of rest.matchAll(FARBFUNKTION)) befunde.push({ zeile: i + 1, wert: m[0], art: 'Farbfunktion' });
  });
  bericht.dateien.push({ datei, befunde: befunde.length, auszug: befunde.slice(0, 12) });
  console.log(`${datei}: ${befunde.length} Werte außerhalb von var()`);
  for (const b of befunde.slice(0, 12)) console.log(`   Zeile ${b.zeile}: ${b.wert} (${b.art})`);
}
writeFileSync(`${WURZEL}/.cache/e5-abschluss/z-pruefer/token-stichprobe.json`, JSON.stringify(bericht, null, 2) + '\n');
