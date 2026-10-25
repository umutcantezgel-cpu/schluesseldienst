// Stufe 3: Gazetteer, PLZ-Index und Verwaltungsnamen aus .cache/geonames/ nach .cache/orte/.
// Ausgaben: gazetteer.json, plz.json (je 1 Datensatz pro Zeile), verwaltung.json.
import { stat, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { liesTsv, schreibeZeilenJson, schreibeObjektJson, unzipEintrag, zusicherung } from './lib.mjs';

const WURZEL = fileURLToPath(new URL('../../', import.meta.url));
const GEO = join(WURZEL, '.cache', 'geonames');
const ORTE = join(WURZEL, '.cache', 'orte');
const LAENDER = ['DE', 'NL'];
const ZIFFER = /\d/;

const vergleiche = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const istVerwaltung = (fc, fcode) => fc === 'A' && (fcode === 'ADM3' || fcode === 'ADM4');

/** Alternativnamen: ohne Ziffern, dedupliziert, höchstens 12, in Quellreihenfolge. */
export function alternativNamen(text) {
  const namen = String(text ?? '').split(',').map((z) => z.trim()).filter((z) => z && !ZIFFER.test(z));
  return [...new Set(namen)].slice(0, 12);
}

/** Gazetteer-Datensatz aus einer GeoNames-Zeile (19 Spalten). */
export function gazetteerDatensatz(s) {
  const [geonameid, name, , alternatenames, lat, lon, fc, fcode, cc, , a1, a2, a3, a4, pop] = s;
  return {
    id: `gn:${geonameid}`,
    name,
    alt: alternativNamen(alternatenames),
    lat: Number(Number(lat).toFixed(4)),
    lon: Number(Number(lon).toFixed(4)),
    fc,
    fcode,
    cc,
    a1,
    a2,
    a3,
    a4,
    pop: Number(pop),
  };
}

/** PLZ-Datensatz aus einer Zeile von zip/XX.txt (12 Spalten). */
export function plzDatensatz(s) {
  return {
    cc: s[0],
    plz: s[1],
    ort: s[2],
    land: s[3],
    kreis: s[7],
    kreisCode: s[8],
    lat: Number(s[9]),
    lon: Number(s[10]),
  };
}

async function existiert(datei) {
  try { await stat(datei); return true; } catch { return false; }
}

export async function hauptlauf() {
  const gazetteer = [];
  const verwaltung = { land: {}, kreis: {}, gemeinde: {} };
  const zaehlP = {};
  const zaehlVerw = {};

  // Gazetteer aus dump/DE.txt und dump/NL.txt, Verwaltungsnamen aus den ADM3/ADM4-Datensätzen
  for (const land of LAENDER) {
    const text = (await unzipEintrag(join(GEO, 'dump', `${land}.zip`), `${land}.txt`)).toString('utf8');
    for (const s of liesTsv(text)) {
      const [, , , , , , fc, fcode, cc, , a1, a2, a3, a4] = s;
      if (fc === 'P') zaehlP[cc] = (zaehlP[cc] ?? 0) + 1;
      if (istVerwaltung(fc, fcode)) {
        const schl = [cc, a1, a2, a3, a4].filter((x) => x).join('.');
        verwaltung.gemeinde[schl] = s[1];
        zaehlVerw[cc] = (zaehlVerw[cc] ?? 0) + 1;
      }
      if (fc === 'P' || istVerwaltung(fc, fcode)) gazetteer.push(gazetteerDatensatz(s));
    }
  }
  gazetteer.sort((a, b) => Number(a.id.slice(3)) - Number(b.id.slice(3)));

  // Bundesländer (admin1) und Kreise (admin2) für DE und NL
  const admin1 = liesTsv((await readFile(join(GEO, 'dump', 'admin1CodesASCII.txt'), 'utf8')));
  for (const [code, name] of admin1) {
    if (LAENDER.some((l) => code.startsWith(`${l}.`))) verwaltung.land[code] = name;
  }
  const admin2 = liesTsv((await readFile(join(GEO, 'dump', 'admin2Codes.txt'), 'utf8')));
  for (const [code, name] of admin2) {
    if (LAENDER.some((l) => code.startsWith(`${l}.`))) verwaltung.kreis[code] = name;
  }

  // PLZ: DE immer, NL falls das Archiv vorhanden ist
  const plz = [];
  const plzJeLand = {};
  for (const land of LAENDER) {
    const archiv = join(GEO, 'zip', `${land}.zip`);
    if (!(await existiert(archiv))) {
      console.log(`Hinweis: ${archiv} fehlt, PLZ für ${land} entfallen.`);
      continue;
    }
    const text = (await unzipEintrag(archiv, `${land}.txt`)).toString('utf8');
    const zeilen = liesTsv(text).map(plzDatensatz);
    plzJeLand[land] = zeilen.length;
    plz.push(...zeilen);
  }
  plz.sort((a, b) => vergleiche(a.cc, b.cc) || vergleiche(a.plz, b.plz) || vergleiche(a.ort, b.ort));

  // Zusicherungen
  const pDE = gazetteer.filter((e) => e.cc === 'DE' && e.fc === 'P').length;
  zusicherung(pDE >= 50000, `Gazetteer DE: ${pDE} P-Einträge (mindestens 50.000 erwartet)`);
  const plzDE = new Set(plz.filter((e) => e.cc === 'DE').map((e) => e.plz)).size;
  zusicherung(plzDE >= 8000, `PLZ DE: ${plzDE} verschiedene Postleitzahlen (mindestens 8.000 erwartet)`);
  const weilburg = gazetteer.filter((e) => e.cc === 'DE' && e.fc === 'P' && e.name === 'Weilburg' && e.a1 === '05');
  zusicherung(weilburg.length > 0, 'Hessen: kein P-Eintrag „Weilburg“ mit admin1 05');
  const wb = weilburg[0];
  zusicherung(wb.lat >= 50.4 && wb.lat <= 50.6 && wb.lon >= 8.2 && wb.lon <= 8.4,
    `Weilburg liegt bei ${wb.lat}, ${wb.lon} (erwartet lat 50.4–50.6, lon 8.2–8.4)`);

  // Ausgabe
  await schreibeZeilenJson(join(ORTE, 'gazetteer.json'), gazetteer);
  await schreibeZeilenJson(join(ORTE, 'plz.json'), plz);
  await schreibeObjektJson(join(ORTE, 'verwaltung.json'), verwaltung);

  console.log(`Gazetteer: ${gazetteer.length} Datensätze (P je Land ${JSON.stringify(zaehlP)}, ADM3/ADM4 je Land ${JSON.stringify(zaehlVerw)})`);
  console.log(`  DE P-Einträge: ${pDE} (mindestens 50.000)`);
  console.log(`PLZ: ${plz.length} Zeilen (je Land ${JSON.stringify(plzJeLand)}), verschiedene PLZ DE: ${plzDE} (mindestens 8.000)`);
  console.log(`Weilburg: ${wb.id} lat ${wb.lat} lon ${wb.lon} admin1 ${wb.a1} admin2 ${wb.a2}`);
  console.log(`Verwaltung: ${Object.keys(verwaltung.land).length} Bundesländer/Provinzen, ${Object.keys(verwaltung.kreis).length} Kreise, ${Object.keys(verwaltung.gemeinde).length} Gemeinden (ADM3/ADM4)`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  hauptlauf().catch((f) => {
    console.error(`Fehler: ${f.message}`);
    process.exitCode = 1;
  });
}
