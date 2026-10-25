// Weiche Trennstellen in Überschriften (KERN K-006): Überschriften trennen nie automatisch (basis.css hyphens: manual),
// lange Komposita nur an ihren Fugen aus der Wortliste src/inhalte/trennstellen.mjs. Dazu kommt eine Regel für
// Kreisnamen („Westerwald|kreis“). Bearbeitet wird nur Text zwischen den Tags von h1–h4 – nie Attribute, Titel,
// JSON-LD oder Fließtext. Die Prüfer lesen &shy; als leeres Zeichen (ehrlichkeit/plagiat: ENTITAETEN.shy).
import { TRENNSTELLEN } from '../../src/inhalte/trennstellen.mjs';

const SHY = '&shy;';
const RAND = 3; // mindestens drei Buchstaben vor und nach jeder Trennstelle (wie hyphenate-limit-chars 10 4 4, nur milder)
const MIN_WORT = 10; // kürzere Wörter passen in jede Überschriftenspalte

const EINTRAEGE = TRENNSTELLEN.map((e) => {
  const teile = e.split('|');
  const stellen = [];
  let n = 0;
  for (const t of teile.slice(0, -1)) stellen.push((n += t.length));
  return { muster: teile.join(''), stellen };
});

/** Trennstellen (Indizes im Wort) für ein einzelnes Wort aus Buchstaben. */
export function trennstellen(wort) {
  if (wort.length < MIN_WORT) return [];
  const klein = wort.toLocaleLowerCase('de');
  if (klein.length !== wort.length) return [];
  const stellen = new Set();
  for (const { muster, stellen: rel } of EINTRAEGE) {
    for (let i = klein.indexOf(muster); i >= 0; i = klein.indexOf(muster, i + 1)) for (const r of rel) stellen.add(i + r);
  }
  if (klein.endsWith('kreis')) stellen.add(klein.length - 5);
  return [...stellen].filter((s) => s >= RAND && wort.length - s >= RAND).sort((a, b) => a - b);
}

/** Setzt &shy; in einen Textabschnitt (bereits escaptes HTML ohne Tags; Entitäten bleiben unberührt). */
export function textTrennen(text) {
  return text.replace(/&[#A-Za-z0-9]+;|[\p{L}]+/gu, (wort) => {
    if (wort[0] === '&') return wort;
    const stellen = trennstellen(wort);
    if (!stellen.length) return wort;
    let aus = '';
    let von = 0;
    for (const s of stellen) { aus += wort.slice(von, s) + SHY; von = s; }
    return aus + wort.slice(von);
  });
}

/** Wendet die Wortliste auf den Text aller h1–h4 einer Seite an. */
export function ueberschriftenTrennen(seite) {
  return seite.replace(/(<(h[1-4])\b[^>]*>)([\s\S]*?)(<\/\2>)/g, (_, auf, _tag, innen, zu) =>
    auf + innen.split(/(<[^>]*>)/).map((t) => (t.startsWith('<') ? t : textTrennen(t))).join('') + zu);
}
