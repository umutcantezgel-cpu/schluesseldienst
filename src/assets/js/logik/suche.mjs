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

/** Teile eines Textes für die Hervorhebung: [{ text, treffer }]. Markiert werden ganze Wörter, deren Normalform ein
 *  Wort der Anfrage enthält – dieselbe Einebnung wie bei der Wertung, „tur“ markiert also „Türöffnung“. */
export function hervorheben(text, anfrage) {
  const woerter = WOERTER(anfrage).filter((w) => w.length >= 2);
  const teile = [];
  for (const stueck of String(text ?? '').split(/([\p{L}\p{N}]+)/u)) {
    if (!stueck) continue;
    const form = WOERTER(stueck).join('');
    const treffer = Boolean(form) && woerter.some((w) => form.includes(w));
    const letztes = teile[teile.length - 1];
    if (letztes && letztes.treffer === treffer) letztes.text += stueck; else teile.push({ text: stueck, treffer });
  }
  return teile;
}

const anzahl = (n, gesamt, eins, viele, vieleDativ) => (n < gesamt ? `${n} von ${gesamt} ${vieleDativ}` : `${n} ${n === 1 ? eins : viele}`);

/** Statuszeile der Suche: nur Teile mit Treffern („1 Ort“, nicht „0 Seiten, 1 Ort“); gekürzte Listen als „20 von 34“. */
export function statusText({ seiten = 0, seitenGesamt = seiten, orte = 0, orteGesamt = orte }) {
  const teile = [];
  if (seiten) teile.push(anzahl(seiten, seitenGesamt, 'Seite', 'Seiten', 'Seiten'));
  if (orte) teile.push(anzahl(orte, orteGesamt, 'Ort', 'Orte', 'Orten'));
  return teile.join(' · ');
}
