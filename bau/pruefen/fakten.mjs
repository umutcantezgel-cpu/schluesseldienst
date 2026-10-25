// Faktenprüfer: Zahlen, Normen, Paragrafen und Zeitdauern im sichtbaren Text von <main> brauchen einen
// Beleg. Belegt ist, was innerhalb von data-fakt, data-daten, <time>, class="preis" oder class="platzhalter"
// steht. Zusätzlich zählt er je Seite die ungeprüften Fakten (class="verifizieren").
import {
  hauptHtml, TOKEN, entitaeten, normal, fundstelle, trefferIn, hatAttr, klassen, WORT, INLINE, VOID,
} from './ehrlichkeit.mjs';

export const name = 'fakten';

// Zahl- und Buchstabenränder: Zahlen beginnen nicht direkt nach Buchstaben, Ziffern, Punkt oder Komma.
const BUCHSTABE = /\p{L}/u;
const ZIFFER = /\p{N}/u;
const ZAHL_VOR = /[\p{L}\p{N}.,]/u;

// Die Ränder (vor/nach) werden nach dem Treffer geprüft. Längere Alternativen stehen vor kürzeren.
// vorfilter: ein Literal, ohne das kein Treffer möglich ist; so bleiben Muster auf Seiten ohne Anlass aus.
const MUSTER = [
  { re: /§§?\s*\d+/gu, vorfilter: /§/ },
  { re: /art\.\s*\d+/giu, vor: BUCHSTABE, vorfilter: /art\./i },
  { re: /(?:DIN|EN|ISO|VdS|VDS)\s*(?:EN\s*)?\d{2,5}(?:-\d+)?/gu, vor: WORT, nach: ZIFFER, vorfilter: /DIN|EN|ISO|VdS|VDS/ },
  { re: /RC\s?\d/gu, vor: WORT, nach: ZIFFER, vorfilter: /RC/ },
  { re: /\d+(?:[.,]\d+)*\s*%/gu, vor: ZAHL_VOR, nach: ZIFFER, vorfilter: /%/ },
  { re: /\d+(?:[.,]\d+)*\s*prozent/giu, vor: ZAHL_VOR, nach: BUCHSTABE, vorfilter: /prozent/i },
  { re: /(?:19|20)\d{2}/gu, vor: WORT, nach: ZIFFER },
  { re: /\d+(?:[.,]\d+)?\s*(?:sekund|stund|jahr|monat)(?:en|e|n|s)?/giu, vor: WORT, nach: BUCHSTABE, vorfilter: /sekund|stund|jahr|monat/i },
  { re: /\d+(?:[.,]\d+)*\s*(?:€|eur(?:o)?)/giu, vor: ZAHL_VOR, nach: BUCHSTABE, vorfilter: /€|eur/i },
  { re: /€\s*\d+(?:[.,]\d+)*/gu, vorfilter: /€/ },
];

const VERIFIZIEREN = /<span\b[^>]*\sclass\s*=\s*["'][^"']*\bverifizieren\b[^"']*["']/giu;

// Vorfilter über den Attributtext, damit nicht jedes Element die Attribut-Regeln durchläuft.
const istBeleg = (element, attrs) => element === 'time'
  || (/data-|preis|platzhalter/.test(attrs) && (hatAttr(attrs, 'data-fakt') || hatAttr(attrs, 'data-daten')
    || klassen(attrs).some((k) => k === 'preis' || k === 'platzhalter')));

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
  for (const m of haupt.matchAll(TOKEN)) {
    if (m[4] !== undefined) {
      schreibe(m[4].includes('&') ? entitaeten(m[4]) : m[4], belegt > 0);
      continue;
    }
    if (m[2] === undefined) continue;
    const element = m[2].toLowerCase();
    if (m[1]) {
      const idx = stapel.findLastIndex((e) => e.element === element);
      if (idx >= 0) {
        while (stapel.length > idx) if (stapel.pop().beleg) belegt -= 1;
      }
      if (!INLINE.has(element)) text += ' ';
      continue;
    }
    if (!INLINE.has(element)) text += ' ';
    const attrs = m[3];
    if (VOID.has(element) || /\/\s*$/.test(attrs)) continue;
    const beleg = istBeleg(element, attrs);
    stapel.push({ element, beleg });
    if (beleg) belegt += 1;
  }
  return { text, unbelegt };
}

/** Überlappt der Treffer [s, e) einen unbelegten Bereich? Die Bereiche sind sortiert und überlappungsfrei (binär suchen). */
function trifftUnbelegt(unbelegt, s, e) {
  let lo = 0;
  let hi = unbelegt.length;
  while (lo < hi) {
    const mitte = (lo + hi) >> 1;
    if (unbelegt[mitte][1] <= s) lo = mitte + 1;
    else hi = mitte;
  }
  return lo < unbelegt.length && unbelegt[lo][0] < e;
}

export async function pruefe(ctx) {
  const befunde = [];
  for (const seite of ctx.seiten ?? []) {
    const haupt = hauptHtml(seite.html);
    if (haupt !== null) {
      const { text, unbelegt } = sichtbarMitBeleg(haupt);
      const aktiv = MUSTER.filter((eintrag) => !eintrag.vorfilter || eintrag.vorfilter.test(text));
      for (const t of trefferIn(aktiv, text)) {
        if (!trifftUnbelegt(unbelegt, t.s, t.e)) continue;
        befunde.push({
          regel: 'fakten/ohne-beleg',
          schwere: 'fehler',
          datei: seite.datei,
          meldung: `Seite ${seite.pfad}: „${normal(t.text)}“ ohne Faktenbeleg – Fundstelle „…${fundstelle(text, t.s, t.e)}…“`,
        });
      }
    }
    const html = String(seite.html ?? '');
    const anzahl = html.includes('verifizieren') ? (html.match(VERIFIZIEREN) ?? []).length : 0;
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
