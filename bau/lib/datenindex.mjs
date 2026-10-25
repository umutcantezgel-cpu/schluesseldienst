// Erzeugt die Such-Indizes für den Browser aus src/daten/orte.json und src/daten/plz.json
// (kompakte Formate siehe src/assets/js/logik/ortsindex.mjs). Beide mit SRI; geladen erst beim Fokus.
import { hash10, sri } from './assets.mjs';
import { slugAbleiten, RICHTUNGEN } from '../../src/assets/js/logik/ortsindex.mjs';

const kurzKreis = (k) => String(k || '').replace(/^(Landkreis|Kreisfreie Stadt|Stadtkreis|Kreis|Regionalverband)\s+/, '');

export async function datenIndizes(daten, schreiber) {
  const ergebnis = {};
  if (!daten.orte?.length) return ergebnis;
  const kol = new Intl.Collator('de');
  const orte = [...daten.orte].sort((a, b) => kol.compare(a.name, b.name) || kol.compare(a.slug, b.slug));
  const zeileVon = new Map(orte.map((o, i) => [o.slug, i]));
  const o = orte.map((x) => {
    const ortsteil = x.typ === 'ortsteil';
    const zusatz = ortsteil ? x.gemeinde : kurzKreis(x.kreis);
    const abgeleitet = slugAbleiten(x.name, zusatz, ortsteil);
    return [x.name, zusatz, ortsteil ? 1 : 0, abgeleitet === x.slug ? 0 : x.slug, x.km, x.zone, x.richtung ? RICHTUNGEN.indexOf(x.richtung) : -1];
  });
  const ortBuf = Buffer.from(JSON.stringify({ v: 1, o }));
  const ortPfad = `/daten/orte.${hash10(ortBuf)}.json`;
  await schreiber.schreibe(ortPfad, ortBuf);
  ergebnis.orte = { pfad: ortPfad, sri: sri(ortBuf), anzahl: o.length, bytes: ortBuf.length };
  if (daten.plz?.length) {
    let vorher = 0;
    const teile = [...daten.plz].sort((a, b) => a.plz.localeCompare(b.plz)).map((p) => {
      const n = Number(p.plz);
      const t = `${n - vorher},${p.km}${p.zone}${p.slug && zeileVon.has(p.slug) ? ',' + zeileVon.get(p.slug) : ''}`;
      vorher = n;
      return t;
    });
    const plzBuf = Buffer.from(JSON.stringify({ v: 1, p: teile.join(';') }));
    const plzPfad = `/daten/plz.${hash10(plzBuf)}.json`;
    await schreiber.schreibe(plzPfad, plzBuf);
    ergebnis.plz = { pfad: plzPfad, sri: sri(plzBuf), anzahl: teile.length, bytes: plzBuf.length };
  }
  return ergebnis;
}

// Seitenindex für /suche/: alle indexierbaren Seiten außer Ortsseiten (die findet die Ortssuche).
// Format { v: 1, s: [[titel, pfad, bereich, kurztext], …] }, Kurztext = Meta-Beschreibung, an einer Wortgrenze gekürzt.
// Eine Marke je Art: Leistungsgruppe und Leistungsdetail sind beide „Leistungen“.
const BEREICH = { V01: 'Start', V02: 'Leistungen', V03: 'Leistungen', V04: 'Preise', V05: 'Einsatzgebiet', V06: 'Einsatzgebiet', V08: 'Ratgeber', V09: 'Betrieb', V10: 'Kontakt', V11: 'Übersicht', V12: 'Rechtliches' };
const KURZ = 140;

// Satzende: Wort ab vier Buchstaben vor dem Punkt (keine Abkürzung wie „z. B.“, „bzw.“), danach ein Großbuchstabe
const SATZENDE = /\p{L}{4}[.?!](?= \p{Lu})/gu;

/** Kürzt auf höchstens `max` Zeichen: bevorzugt nach einem ganzen Satz (ohne Auslassungspunkte), sonst am Ende eines
 *  Satzteils in den letzten 40 % oder an der letzten Wortgrenze mit „…“ – nie mitten im Wort. */
export function kurztext(s, max = KURZ) {
  const t = String(s || '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const schnitt = t.slice(0, max + 1);
  const saetze = [...schnitt.matchAll(SATZENDE)].map((m) => m.index + m[0].length).filter((i) => i >= max * 0.5);
  if (saetze.length) return schnitt.slice(0, saetze[saetze.length - 1]);
  const satzteil = Math.max(...[', ', '; ', ': ', ' – '].map((z) => schnitt.lastIndexOf(z)));
  const ende = satzteil >= max * 0.6 ? satzteil : schnitt.lastIndexOf(' ');
  const kopf = (ende > 0 ? schnitt.slice(0, ende) : t.slice(0, max)).replace(/[\s,;:–—-]+$/u, '');
  return `${kopf}\u00A0…`;
}
const ORTSSEITE = /^\/schluesseldienst-[^/]+\/$/;

export async function seitenIndexSchreiben(seiten, schreiber) {
  const s = seiten
    .filter((x) => x.indexierbar !== false && x.pfad !== '/404.html' && !ORTSSEITE.test(x.pfad) && typeof x.titel === 'string')
    .map((x) => [x.titel, x.pfad, BEREICH[x.ansicht] || 'Seite', kurztext(x.beschreibung)]);
  const buf = Buffer.from(JSON.stringify({ v: 1, s }));
  const pfad = `/daten/seiten.${hash10(buf)}.json`;
  await schreiber.schreibe(pfad, buf);
  // eintrag(): derselbe Titel, Bereich und Kurztext für Verweise, die die Suchseite ohne Anfrage zeigt (Hauptthemen) –
  // so stimmen Leerzustand und Treffer überein, und ein entfallener Pfad fällt beim Bau auf
  const nachPfad = new Map(s.map(([titel, p, bereich, text]) => [p, { titel, pfad: p, bereich, text }]));
  return { pfad, sri: sri(buf), anzahl: s.length, bytes: buf.length, eintrag: (p) => nachPfad.get(p) ?? null };
}
