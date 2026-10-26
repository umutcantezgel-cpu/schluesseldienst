// Reine Logik (testbar, Build und Browser): Volltextsuche über den Seitenindex (Titel, Bereich, Kurztext).
// Jedes Wort der Anfrage muss vorkommen (UND); Treffer am Wortanfang im Titel zählen am meisten.
// Normalisierung wie bei der Ortssuche (Umlaute, ß, Diakritika), damit „turoffnung“ und „Türöffnung“ zusammenfinden.
import { schluessel } from './normalisieren.mjs';

// Zwei Formen je Wort. Flach: ae/oe/ue auf a/o/u eingeebnet, so findet „tur“ (ohne Umlaut getippt) auch „Tür“.
// Streng: ä = ae, für Anfragen mit Umlaut – „löhn“ findet „Löhnberg“, aber nicht „lohnt“.
const STRENG = (s) => schluessel(s).split(/[^a-z0-9]+/).filter(Boolean);
const WOERTER = (s) => schluessel(s).replace(/ae/g, 'a').replace(/oe/g, 'o').replace(/ue/g, 'u').split(/[^a-z0-9]+/).filter(Boolean);
const UMLAUT = /[äöü]/i;

/** Suchwörter einer Anfrage (ab zwei Zeichen): { w, streng } – streng, wenn das getippte Wort einen Umlaut enthält. */
function anfrageWoerter(anfrage) {
  const teile = [];
  for (const roh of String(anfrage ?? '').split(/[^\p{L}\p{N}]+/u)) {
    if (!roh) continue;
    const streng = UMLAUT.test(roh);
    for (const w of (streng ? STRENG : WOERTER)(roh)) if (w.length >= 2) teile.push({ w, streng });
  }
  return teile;
}

/** Index aus der Datei /daten/seiten.*.json: { v: 1, s: [[titel, pfad, bereich, text], …] } */
export function seitenIndex(daten) {
  return daten.s.map(([titel, pfad, bereich, text]) => ({
    titel, pfad, bereich, text,
    tw: WOERTER(titel), xw: WOERTER(`${bereich} ${text}`), tws: STRENG(titel), xws: STRENG(`${bereich} ${text}`),
  }));
}

function wertung(eintrag, { w: wort, streng }) {
  const tw = streng ? eintrag.tws : eintrag.tw;
  const xw = streng ? eintrag.xws : eintrag.xw;
  if (tw.some((w) => w === wort)) return 8;
  if (tw.some((w) => w.startsWith(wort))) return 6;
  if (tw.some((w) => w.includes(wort))) return 3;
  if (xw.some((w) => w.startsWith(wort))) return 2;
  if (xw.some((w) => w.includes(wort))) return 1;
  return 0;
}

/** Treffer sortiert nach Wertung, dann kürzerem Titel; Anfragen unter 2 Zeichen liefern nichts. */
export function seitenSuchen(index, anfrage, max = 20) {
  const woerter = anfrageWoerter(anfrage);
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
 *  Wort der Anfrage enthält – dieselben Formen wie bei der Wertung, „tur“ markiert also „Türöffnung“. */
export function hervorheben(text, anfrage) {
  const woerter = anfrageWoerter(anfrage);
  const teile = [];
  for (const stueck of String(text ?? '').split(/([\p{L}\p{N}]+)/u)) {
    if (!stueck) continue;
    const flach = WOERTER(stueck).join('');
    const streng = STRENG(stueck).join('');
    const treffer = Boolean(flach) && woerter.some((q) => (q.streng ? streng : flach).includes(q.w));
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

// Maßstab ab Weilburg (Ortstreffer und Legende der Suche): Die Achse reicht ein Fünftel über den äußersten Zonenring
// hinaus, damit ein Ort jenseits davon sichtbar weiter liegt als einer auf dem Ring. Gekappt wird erst am Achsende.
const UEBERSTAND = 1.2;

/** Lage einer Entfernung auf der Achse: Anteil 0…1 und ob sie über das Achsende hinausreicht (offenes Ende). */
export function massLage(km, ringe) {
  const ende = Math.max(...ringe) * UEBERSTAND;
  return { anteil: Math.min(1, Math.max(0, km) / ende), offen: km > ende };
}

/** Anteil als SVG-Koordinate in Prozent, auf eine Nachkommastelle („16.7%“). */
export const prozent = (anteil) => `${Math.round(anteil * 1000) / 10}%`;
