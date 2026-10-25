// Faktenprüfer: Zahlen, Normen, Paragrafen und Zeitdauern im sichtbaren Text von <main> brauchen einen
// Beleg. Belegt ist, was innerhalb von data-fakt, data-daten, <time>, class="preis" oder class="platzhalter"
// steht. Zusätzlich zählt er je Seite die ungeprüften Fakten (class="verifizieren").
import {
  hauptHtml, zerlegen, entitaeten, normal, fundstelle, trefferIn, hatAttr, klassen, INLINE, VOID,
} from './ehrlichkeit.mjs';

export const name = 'fakten';

// Zahlen beginnen nicht direkt nach Buchstaben, Ziffern, Punkt oder Komma (sonst greift z. B. „1.234,50“ doppelt).
const MUSTER = [
  { re: /§§?\s*\d+/gu },
  { re: /(?<!\p{L})art\.\s*\d+/giu },
  { re: /(?<![\p{L}\p{N}])(?:DIN|EN|ISO|VdS|VDS)\s*(?:EN\s*)?\d{2,5}(?:-\d+)?(?!\p{N})/gu },
  { re: /(?<![\p{L}\p{N}])RC\s?\d(?!\p{N})/gu },
  { re: /(?<![\p{L}\p{N}.,])\d+(?:[.,]\d+)*\s*(?:%(?!\p{N})|prozent(?!\p{L}))/giu },
  { re: /(?<![\p{L}\p{N}])(?:19|20)\d{2}(?!\p{N})/gu },
  { re: /(?<![\p{L}\p{N}])\d+(?:[.,]\d+)?\s*(?:sekund|stund|jahr|monat)(?:e|en|n|s)?(?!\p{L})/giu },
  { re: /(?<![\p{L}\p{N}.,])\d+(?:[.,]\d+)*\s*(?:€|eur(?:o)?(?!\p{L}))/giu },
  { re: /€\s*\d+(?:[.,]\d+)*/gu },
];

const VERIFIZIEREN = /<span\b[^>]*\sclass\s*=\s*["'][^"']*\bverifizieren\b[^"']*["']/giu;

const istBeleg = (t) => hatAttr(t.attrs, 'data-fakt') || hatAttr(t.attrs, 'data-daten') || t.element === 'time'
  || klassen(t.attrs).some((k) => k === 'preis' || k === 'platzhalter');

/**
 * Sichtbarer Text eines <main>-Inhalts plus die Bereiche ohne Beleg als Intervalle [start, ende).
 * Trennzeichen zwischen Blöcken gelten als neutral und zählen nie als unbelegt.
 */
function sichtbarMitBeleg(haupt) {
  let text = '';
  const unbelegt = [];
  const schreibe = (s, belegt) => {
    if (!s) return;
    const start = text.length;
    text += s;
    if (belegt) return;
    const letzter = unbelegt[unbelegt.length - 1];
    if (letzter && letzter[1] === start) letzter[1] = text.length;
    else unbelegt.push([start, text.length]);
  };
  const stapel = [];
  let belegt = 0;
  for (const t of zerlegen(haupt)) {
    if (t.typ === 'text') {
      schreibe(entitaeten(t.text), belegt > 0);
      continue;
    }
    if (t.typ === 'zu') {
      const idx = stapel.findLastIndex((e) => e.element === t.element);
      if (idx >= 0) {
        while (stapel.length > idx) if (stapel.pop().beleg) belegt -= 1;
      }
      if (!INLINE.has(t.element)) text += ' ';
      continue;
    }
    if (!INLINE.has(t.element)) text += ' ';
    if (VOID.has(t.element) || t.selbst) continue;
    const beleg = istBeleg(t);
    stapel.push({ element: t.element, beleg });
    if (beleg) belegt += 1;
  }
  return { text, unbelegt };
}

export async function pruefe(ctx) {
  const befunde = [];
  for (const seite of ctx.seiten ?? []) {
    const haupt = hauptHtml(seite.html);
    if (haupt !== null) {
      const { text, unbelegt } = sichtbarMitBeleg(haupt);
      for (const t of trefferIn(MUSTER, text)) {
        if (!unbelegt.some(([a, e]) => a < t.e && e > t.s)) continue;
        befunde.push({
          regel: 'fakten/ohne-beleg',
          schwere: 'fehler',
          datei: seite.datei,
          meldung: `Seite ${seite.pfad}: „${normal(t.text)}“ ohne Faktenbeleg – Fundstelle „…${fundstelle(text, t.s, t.e)}…“`,
        });
      }
    }
    const anzahl = (String(seite.html ?? '').match(VERIFIZIEREN) ?? []).length;
    if (anzahl > 0) {
      befunde.push({
        regel: 'fakten/verifizieren',
        schwere: ctx.modus === 'release' ? 'fehler' : 'info',
        datei: seite.datei,
        meldung: `Seite ${seite.pfad}: ${anzahl} ungeprüfte Fakt(en) (class="verifizieren")`,
      });
    }
  }
  return befunde;
}
