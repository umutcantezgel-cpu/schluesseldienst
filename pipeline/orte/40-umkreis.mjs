#!/usr/bin/env node
// Stufe 40: ergänzt die Orte im Umkreis von 30 km um den Sitz Weilburg aus dem GeoNames-Gazetteer.
// Eingaben: .cache/orte/{gazetteer,abgleich,verwaltung}.json · pipeline/orte/regeln.json
// Ausgaben: .cache/orte/umkreis.json (Datensätze wie abgleich.json), .cache/orte/zaehlung-40.json,
// src/daten/orte-pruefliste.json (nicht veröffentlicht: ausgeschlossene Kandidaten mit Grund).
import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { schluessel, kern } from '../../src/assets/js/logik/normalisieren.mjs';
import { haversineKm, schreibeObjektJson, schreibeZeilenJson, zusicherung } from './lib.mjs';
import { verwaltungsnamen } from './30-abgleich.mjs';

const HIER = dirname(fileURLToPath(import.meta.url));
const WURZEL = resolve(HIER, '../..');
const CACHE = join(WURZEL, '.cache/orte');

/** Gazetteer-ID des Sitzes Weilburg (Bezugspunkt für Entfernungen, Richtungen und Zonen). */
export const SITZ_ID = 'gn:2812626';
export const RADIUS_KM = 30;
export const UMKREIS_FCODES = ['PPL', 'PPLA', 'PPLA2', 'PPLA3', 'PPLA4', 'PPLC', 'PPLX'];
// Endungen nach schluessel() (ü→ue, ö→oe, ä→ae): „Mühle“ → muehle, „Höfe“ → hoefe, „Hütte“ → huette.
const PRUEF_ENDUNG = /(muehle|hof|hoefe|forsthaus|huette|ziegelei|bahnhof|siedlung|gut)$/;

const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/** Entfernt Zusätze nach dem ersten Komma: „Großostheim, Markt“ → „Großostheim“. */
export const saeubern = (s) => (s == null ? null : String(s).replace(/,.*$/, '').trim());

/** Grund für die Prüfliste oder null. */
export function pruefGrund(e) {
  if ((e.pop ?? 0) === 0 && PRUEF_ENDUNG.test(schluessel(e.name))) {
    return 'Name endet auf Mühle/Hof/Forsthaus/Hütte/Ziegelei/Bahnhof/Siedlung/Gut, 0 Einwohner';
  }
  if (e.fcode === 'PPLX' && !e.a4) return 'PPLX ohne a4 (kein Verwaltungsbezug)';
  return null;
}

/** Dublette: gleicher kern(name) und gleiches a4, oder höchstens 2 km Abstand zu einem vorhandenen Ort. */
export function istDublette(kandidat, vorhandene) {
  return (vorhandene.get(kern(kandidat.name)) || []).some((o) => (kandidat.a4 && o.a4 === kandidat.a4)
    || haversineKm(kandidat.lat, kandidat.lon, o.lat, o.lon) <= 2);
}

/** Reine Auswahl der Umkreis-Orte. Liefert Datensätze, Prüfliste und Zählung. */
export function waehleUmkreis({ gazetteer, abgleich, verwaltung, regeln }) {
  const sitz = gazetteer.find((e) => e.id === SITZ_ID);
  zusicherung(sitz && sitz.cc === 'DE', `Sitz ${SITZ_ID} fehlt im Gazetteer`);

  const vorhandeneIds = new Set(abgleich.map((e) => e.id));
  const vorhandene = new Map();
  const merke = (o) => {
    const schl = kern(o.name);
    if (!vorhandene.has(schl)) vorhandene.set(schl, []);
    vorhandene.get(schl).push(o);
  };
  for (const o of abgleich) merke({ name: saeubern(o.name), lat: o.lat, lon: o.lon, a4: o.a4 });

  const kandidaten = gazetteer
    .filter((e) => e.cc === 'DE' && e.fc === 'P' && UMKREIS_FCODES.includes(e.fcode))
    .map((e) => ({ e, km: haversineKm(sitz.lat, sitz.lon, e.lat, e.lon) }))
    .filter((k) => k.km <= RADIUS_KM)
    .sort((a, b) => (b.e.pop ?? 0) - (a.e.pop ?? 0) || cmp(a.e.id, b.e.id));

  const zaehlung = {
    imRadius: kandidaten.length, bereitsVorhanden: 0, dubletten: 0, pruefliste: 0, pruefgruende: {}, aufgenommen: 0,
  };
  const umkreis = [];
  const pruefliste = [];
  for (const { e, km } of kandidaten) {
    if (vorhandeneIds.has(e.id)) { zaehlung.bereitsVorhanden++; continue; }
    const name = saeubern(e.name);
    const kand = { id: e.id, name, lat: e.lat, lon: e.lon, a4: e.a4 };
    if (istDublette(kand, vorhandene)) { zaehlung.dubletten++; continue; }
    const vn = verwaltungsnamen(e, verwaltung, regeln);
    const grund = pruefGrund({ ...e, name });
    if (grund) {
      zaehlung.pruefliste++;
      zaehlung.pruefgruende[grund] = (zaehlung.pruefgruende[grund] ?? 0) + 1;
      pruefliste.push({
        id: e.id, name, cc: e.cc, fcode: e.fcode, pop: e.pop, gemeinde: vn.gemeinde, kreis: vn.kreis,
        km: Math.round(km), grund,
      });
      continue;
    }
    umkreis.push({
      id: e.id, name, cc: e.cc, a1: e.a1, a2: e.a2, a3: e.a3, a4: e.a4, fcode: e.fcode, pop: e.pop,
      lat: e.lat, lon: e.lon, gemeinde: vn.gemeinde, kreis: vn.kreis, land: vn.land,
      quellen: ['U:umkreis'], punkte: null,
    });
    merke(kand);
    zaehlung.aufgenommen++;
  }
  umkreis.sort((a, b) => cmp(a.id, b.id));
  pruefliste.sort((a, b) => cmp(a.id, b.id));
  return { umkreis, pruefliste, zaehlung };
}

export async function main() {
  const regeln = JSON.parse(await readFile(join(HIER, 'regeln.json'), 'utf8'));
  const gazetteer = JSON.parse(await readFile(join(CACHE, 'gazetteer.json'), 'utf8'));
  const abgleich = JSON.parse(await readFile(join(CACHE, 'abgleich.json'), 'utf8'));
  const verwaltung = JSON.parse(await readFile(join(CACHE, 'verwaltung.json'), 'utf8'));
  const { umkreis, pruefliste, zaehlung } = waehleUmkreis({ gazetteer, abgleich, verwaltung, regeln });
  await schreibeZeilenJson(join(CACHE, 'umkreis.json'), umkreis);
  await schreibeZeilenJson(join(WURZEL, 'src/daten/orte-pruefliste.json'), pruefliste);
  await schreibeObjektJson(join(CACHE, 'zaehlung-40.json'), zaehlung);
  console.log(`Stufe 40: ${zaehlung.imRadius} Kandidaten im Radius ${RADIUS_KM} km; `
    + `${zaehlung.bereitsVorhanden} bereits vorhanden, ${zaehlung.dubletten} Dubletten, `
    + `${zaehlung.pruefliste} auf der Prüfliste, ${zaehlung.aufgenommen} aufgenommen.`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((f) => {
    console.error(f.stack || f);
    process.exitCode = 1;
  });
}
