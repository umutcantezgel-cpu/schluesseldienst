// Reine Logik (testbar, Build und Browser): Zeitfenster zu einem Zeitpunkt, Tagesband und Gesamtpreis.
// Beträge in Cent. null = „nach Absprache“. Es gibt bewusst keine Eingabe für die Zahlart: Zuschläge je Zahlart
// sind ausgeschlossen (Test).
import { berlinZeit } from './erreichbarkeit.mjs';

export const TAGESARTEN = ['werktags', 'wochenende'];
const WOCHENENDE = new Set(['sa', 'so']);

export const tagArt = (tag) => (WOCHENENDE.has(tag) ? 'wochenende' : 'werktags');
export const minutenVon = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };

/**
 * Prüft ein Tagesband { werktags: [[fenster, 'HH:MM', 'HH:MM'], …], wochenende: […] }:
 * je Tagesart lückenlos von 00:00 bis 24:00, aufsteigend, nur bekannte Fenster. Liefert Fehlertexte.
 */
export function bandPruefen(band, fensterIds) {
  const fehler = [];
  for (const art of TAGESARTEN) {
    const liste = band?.[art];
    if (!Array.isArray(liste) || !liste.length) { fehler.push(`${art}: fehlt`); continue; }
    let ende = 0;
    for (const [id, von, bis] of liste) {
      if (!fensterIds.includes(id)) fehler.push(`${art}: unbekanntes Fenster ${id}`);
      if (!/^\d\d:\d\d$/.test(von) || !/^\d\d:\d\d$/.test(bis)) { fehler.push(`${art}: Uhrzeit ${von}–${bis}`); continue; }
      if (minutenVon(von) !== ende) fehler.push(`${art}: Lücke oder Überschneidung bei ${von}`);
      if (minutenVon(bis) <= minutenVon(von)) fehler.push(`${art}: ${von}–${bis} endet nicht nach dem Beginn`);
      ende = minutenVon(bis);
    }
    if (ende !== 24 * 60) fehler.push(`${art}: endet nicht um 24:00`);
  }
  return fehler;
}

const ART_KURZ = { werktags: 'Mo–Fr', wochenende: 'Sa, So, Feiertag' };

/** Uhrzeiten eines Fensters als Text aus dem Tagesband, z. B. „Mo–Fr 22:00–07:00“; über Mitternacht zusammengefasst. */
export function zeitText(band, id) {
  const teile = [];
  for (const art of TAGESARTEN) {
    let st = band[art].filter(([f]) => f === id).map(([, von, bis]) => [von, bis]);
    if (!st.length) continue;
    if (st.length === 1 && st[0][0] === '00:00' && st[0][1] === '24:00') { teile.push(`${ART_KURZ[art]} ganztags`); continue; }
    if (st.length > 1 && st[0][0] === '00:00' && st.at(-1)[1] === '24:00') st = [[st.at(-1)[0], st[0][1]], ...st.slice(1, -1)];
    teile.push(`${ART_KURZ[art]} ${st.map(([von, bis]) => `${von}–${bis}`).join(', ')}`);
  }
  return teile.join(' · ');
}

/** Fenster-ID für Tagesart und Minute des Tages. */
export function fensterBei(band, art, minute) {
  const treffer = band[art].find(([, von, bis]) => minute >= minutenVon(von) && minute < minutenVon(bis));
  return treffer ? treffer[0] : null;
}

/** Fenster und Position im Tag (0…1) zu einem Zeitpunkt in Europe/Berlin. Feiertage kennt die Logik nicht. */
export function jetzt(band, datum) {
  const { tag, minuten: m } = berlinZeit(datum);
  const art = tagArt(tag);
  return { art, fenster: fensterBei(band, art, m), anteil: m / (24 * 60) };
}

/**
 * Gesamtpreis: Leistung im Zeitfenster + Anfahrt der Zone.
 * daten = { vollstaendig, positionen: { id: { fenster: cent|null } }, anfahrt: { A: cent|null, … },
 *          nurAbsprache: { C: [positionId, …], … } }  – z. B. Notöffnungen in Zonen „nach Absprache“
 * Ergebnis: { status: 'betrag', cent, preis, anfahrt } | { status: 'absprache' } | { status: 'offen' }
 */
export function rechnen(daten, { position, fenster, zone }) {
  if (daten?.nurAbsprache?.[zone]?.includes(position)) return { status: 'absprache' };
  if (!daten?.vollstaendig) return { status: 'offen' };
  const preis = daten.positionen?.[position]?.[fenster];
  const anfahrt = daten.anfahrt?.[zone];
  if (preis === undefined || anfahrt === undefined) return { status: 'offen' };
  if (preis === null || anfahrt === null) return { status: 'absprache' };
  if (!Number.isInteger(preis) || !Number.isInteger(anfahrt) || preis < 0 || anfahrt < 0) return { status: 'offen' };
  return { status: 'betrag', cent: preis + anfahrt, preis, anfahrt };
}

export const euro = (cent) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(cent / 100).replace(/\s/g, '\u00A0');
