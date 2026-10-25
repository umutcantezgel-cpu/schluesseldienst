// Reine Logik (testbar, Build und Browser): Volltextsuche über den Seitenindex (Titel, Bereich, Kurztext).
// Jedes Wort der Anfrage muss vorkommen (UND); Treffer am Wortanfang im Titel zählen am meisten.
// Normalisierung wie bei der Ortssuche (Umlaute, ß, Diakritika), damit „turoffnung“ und „Türöffnung“ zusammenfinden.
import { schluessel } from './normalisieren.mjs';

// ae/oe/ue werden auf a/o/u eingeebnet – in Index und Anfrage gleich, so findet „tur“ auch „Tür“
const WOERTER = (s) => schluessel(s).replace(/ae/g, 'a').replace(/oe/g, 'o').replace(/ue/g, 'u').split(/[^a-z0-9]+/).filter(Boolean);

/** Index aus der Datei /daten/seiten.*.json: { v: 1, s: [[titel, pfad, bereich, text], …] } */
export function seitenIndex(daten) {
  return daten.s.map(([titel, pfad, bereich, text]) => ({ titel, pfad, bereich, text, tw: WOERTER(titel), xw: WOERTER(`${bereich} ${text}`) }));
}

function wertung(eintrag, wort) {
  if (eintrag.tw.some((w) => w === wort)) return 8;
  if (eintrag.tw.some((w) => w.startsWith(wort))) return 6;
  if (eintrag.tw.some((w) => w.includes(wort))) return 3;
  if (eintrag.xw.some((w) => w.startsWith(wort))) return 2;
  if (eintrag.xw.some((w) => w.includes(wort))) return 1;
  return 0;
}

/** Treffer sortiert nach Wertung, dann kürzerem Titel; Anfragen unter 2 Zeichen liefern nichts. */
export function seitenSuchen(index, anfrage, max = 20) {
  const woerter = WOERTER(anfrage).filter((w) => w.length >= 2);
  if (!woerter.length) return [];
  const treffer = [];
  for (const e of index) {
    let summe = 0;
    for (const w of woerter) {
      const p = wertung(e, w);
      if (!p) { summe = 0; break; }
      summe += p;
    }
    if (summe) treffer.push({ e, summe });
  }
  treffer.sort((a, b) => b.summe - a.summe || a.e.titel.length - b.e.titel.length);
  return treffer.slice(0, max).map((t) => t.e);
}
