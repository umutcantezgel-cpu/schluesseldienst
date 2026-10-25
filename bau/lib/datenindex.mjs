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
