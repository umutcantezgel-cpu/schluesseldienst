#!/usr/bin/env node
// Stufe 50: reichert alle Orte an. Namen säubern, Typ, Dubletten, Kreis- und Land-Schlüssel, PLZ,
// Entfernung, Richtung, Zone, Nachbarn und Ortsteile.
// Eingaben: .cache/orte/{abgleich,umkreis,plz}.json · pipeline/orte/regeln.json · src/konfig/{zonen,betrieb}.mjs
// Ausgaben: .cache/orte/angereichert.json, .cache/orte/zaehlung-50.json
import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { schluessel, kern } from '../../src/assets/js/logik/normalisieren.mjs';
import { haversineKm, richtung8, schreibeObjektJson, schreibeZeilenJson, zusicherung } from './lib.mjs';
import { saeubern, SITZ_ID } from './40-umkreis.mjs';
import zonen from '../../src/konfig/zonen.mjs';
import betrieb from '../../src/konfig/betrieb.mjs';

const HIER = dirname(fileURLToPath(import.meta.url));
const WURZEL = resolve(HIER, '../..');
const CACHE = join(WURZEL, '.cache/orte');

export const GEMEINDE_FCODES = ['PPLA', 'PPLA2', 'PPLA3', 'PPLA4', 'PPLC', 'ADM4'];
export const GITTER = 0.25;
export const NACHBARN_ROH = 8;
export const NACHBARN_MAX = 10;
export const NACHBARN_MIN = 3;
export const PLZ_MAX = 12;
export const PLZ_RADIUS_KM = 5;
const KREIS_PRAEFIX = /^(landkreis|kreis|kreisfreie-stadt|stadtkreis|regionalverband|region|staedteregion)-/;

const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const DE = new Intl.Collator('de');
const nachPopUndId = (a, b) => (b.pop ?? 0) - (a.pop ?? 0) || cmp(a.id, b.id);
const nachKmUndId = (a, b) => a.km - b.km || cmp(a.id, b.id);
const gemKey = (e) => (e.gemeinde ? [e.cc, e.a1, e.a2, e.a3, e.a4].map((x) => x ?? '').join('.') : `ohne:${e.id}`);
const rawKey = (e) => [e.cc, e.a1, e.a2, e.a3, e.a4].map((x) => x ?? '').join('.');
const gemName = (e) => e.gemeinde ?? e.name;
const istPPL = (e) => String(e.fcode).startsWith('PPL');
const istStadt = (k, regeln) => /^(Kreisfreie Stadt|Stadtkreis) /.test(k) || regeln.stadtstaaten.includes(schluessel(k));

function gruppiere(liste, schl) {
  const m = new Map();
  for (const e of liste) {
    const k = schl(e);
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(e);
  }
  return m;
}

/** Gemeindename ohne Zusätze; in den Niederlanden ohne das Präfix „Gemeente “. */
export function gemeindeNamen(e) {
  let g = saeubern(e.gemeinde);
  if (g && e.cc === 'NL') g = g.replace(/^Gemeente\s+/, '');
  return g || null;
}

/** Kreisname; die Stadtstaaten Bremen, Berlin und Hamburg nur mit dem Stadtnamen. */
export function kreisNamen(e, regeln) {
  const k = saeubern(e.kreis);
  if (!k) return null;
  if (e.cc !== 'DE') return k;
  const ohne = k.replace(/^Kreisfreie Stadt\s+/, '');
  return regeln.stadtstaaten.includes(schluessel(ohne)) ? ohne : k;
}

/** Kreis-Schlüssel ohne führende Präfixe („Landkreis Kassel“ → kassel). */
export function kreisSlugVon(kreis) {
  return kreis ? schluessel(kreis).replace(KREIS_PRAEFIX, '') : null;
}

/** Schlüssel je Kreis (`cc|Kreis`). Kreisfreie Stadt mit gleichem Rest wie ein Landkreis bekommt „-stadt“. */
export function kreisSchluessel(paare, regeln) {
  const tabelle = new Map();
  const de = [...new Set(paare.filter((p) => p.cc === 'DE' && p.kreis).map((p) => p.kreis))].sort(cmp);
  const basen = new Map();
  for (const k of de) {
    const b = kreisSlugVon(k);
    if (!basen.has(b)) basen.set(b, { stadt: 0, land: 0 });
    basen.get(b)[istStadt(k, regeln) ? 'stadt' : 'land']++;
  }
  for (const k of de) {
    const b = kreisSlugVon(k);
    tabelle.set(`DE|${k}`, istStadt(k, regeln) && basen.get(b).land > 0 ? `${b}-stadt` : b);
  }
  for (const p of paare) if (p.cc === 'NL' && p.kreis) tabelle.set(`NL|${p.kreis}`, schluessel(p.kreis));
  return tabelle;
}

/** Zone nach zonen.mjs: NL immer „NL“; sonst die erste Stufe, deren Grenze gilt (Kreis-Regel über auchKreis). */
export function zoneFuer({ cc, km, kreis }, konfig = zonen) {
  if (cc === 'NL') return 'NL';
  for (const s of konfig.stufen) {
    if (km <= s.bisKm || (s.auchKreis && kreis === konfig.sitzKreis)) return s.id;
  }
  return konfig.stufen.at(-1).id;
}

/** Gemeinde-Typ je Gemeinde. Typ „gemeinde“: Name = Gemeindekern, sonst genau ein Ort mit Gemeinde-Fcode. */
export function bestimmeTypen(orte) {
  for (const mit of gruppiere(orte, gemKey).values()) {
    let gem = mit.filter((e) => kern(e.name) === kern(gemName(e)));
    if (gem.length === 0) {
      const kandidaten = mit.filter((e) => GEMEINDE_FCODES.includes(e.fcode)).sort(nachPopUndId);
      if (kandidaten.length) gem = [kandidaten[0]];
    }
    for (const e of gem) e.typ = 'gemeinde';
    for (const e of mit) e.typ ??= 'ortsteil';
  }
  return orte;
}

/** Entfernt Dubletten unter den Gemeinden (gleiches cc/a1-a4 und gleicher Kern); behält fc P, dann größte pop. */
export function entferneGemeindeDubletten(orte) {
  const entfernt = new Set();
  for (const g of gruppiere(orte.filter((e) => e.typ === 'gemeinde'), (e) => `${rawKey(e)}|${kern(e.name)}`).values()) {
    if (g.length < 2) continue;
    const [behalten, ...weg] = [...g].sort((a, b) => (Number(istPPL(b)) - Number(istPPL(a))) || nachPopUndId(a, b));
    behalten.quellen = [...new Set(g.flatMap((x) => x.quellen))].sort(cmp);
    for (const w of weg) entfernt.add(w.id);
  }
  return { orte: orte.filter((e) => !entfernt.has(e.id)), entfernt: entfernt.size };
}

/** PLZ-Index aus den Zeilen von .cache/orte/plz.json: Name-Schlüssel je cc und Mittelpunkte je PLZ. */
export function plzIndex(zeilen) {
  const nachOrt = new Map();
  const sammel = new Map();
  for (const z of zeilen) {
    const ok = `${z.cc}|${schluessel(z.ort)}`;
    if (!nachOrt.has(ok)) nachOrt.set(ok, []);
    nachOrt.get(ok).push(z);
    const pk = `${z.cc}|${z.plz}`;
    if (!sammel.has(pk)) sammel.set(pk, { cc: z.cc, plz: z.plz, lat: 0, lon: 0, n: 0 });
    const s = sammel.get(pk);
    s.lat += z.lat;
    s.lon += z.lon;
    s.n++;
  }
  const zentren = new Map();
  for (const s of sammel.values()) {
    if (!zentren.has(s.cc)) zentren.set(s.cc, []);
    zentren.get(s.cc).push({ plz: s.plz, lat: s.lat / s.n, lon: s.lon / s.n });
  }
  return { nachOrt, zentren };
}

/** PLZ eines Ortes: Zeilen mit gleichem Namen (DE zusätzlich gleicher Kreiscode), sonst gleiche Gemeinde, sonst nächste PLZ bis 5 km. */
export function plzFuer(e, index) {
  const passt = (r) => (e.cc === 'NL' ? true : Boolean(e.a3) && r.kreisCode === e.a3);
  let zeilen = (index.nachOrt.get(`${e.cc}|${schluessel(e.name)}`) || []).filter(passt);
  if (zeilen.length === 0 && e.gemeinde) {
    zeilen = (index.nachOrt.get(`${e.cc}|${schluessel(e.gemeinde)}`) || []).filter(passt);
  }
  if (zeilen.length) {
    const naechste = new Map();
    for (const r of zeilen) {
      const d = haversineKm(e.lat, e.lon, r.lat, r.lon);
      if (!naechste.has(r.plz) || d < naechste.get(r.plz)) naechste.set(r.plz, d);
    }
    const plz = [...naechste].sort((a, b) => a[1] - b[1] || cmp(a[0], b[0])).slice(0, PLZ_MAX).map((x) => x[0]);
    return { plz: plz.sort(cmp), unsicher: false };
  }
  let beste = null;
  for (const z of index.zentren.get(e.cc) || []) {
    const d = haversineKm(e.lat, e.lon, z.lat, z.lon);
    if (!beste || d < beste.d || (d === beste.d && cmp(z.plz, beste.plz) < 0)) beste = { plz: z.plz, d };
  }
  if (beste && beste.d <= PLZ_RADIUS_KM) return { plz: [beste.plz], unsicher: false };
  return { plz: [], unsicher: true };
}

/**
 * Nachbarn: je Ort die 8 nächsten anderen Orte, dann symmetrisch vereinigt (Gitterindex 0,25°).
 * Obergrenze 10 je Ort; kürzere Kanten zuerst, damit die nächsten behalten werden. Ziel: mindestens 3.
 */
export function nachbarnBerechnen(punkte) {
  const gitter = new Map();
  let minI = Infinity; let maxI = -Infinity; let minJ = Infinity; let maxJ = -Infinity;
  for (const p of punkte) {
    const i = Math.floor(p.lat / GITTER);
    const j = Math.floor(p.lon / GITTER);
    minI = Math.min(minI, i); maxI = Math.max(maxI, i); minJ = Math.min(minJ, j); maxJ = Math.max(maxJ, j);
    const k = `${i}|${j}`;
    if (!gitter.has(k)) gitter.set(k, []);
    gitter.get(k).push(p);
  }
  const rMax = Math.max(maxI - minI, maxJ - minJ) + 1;
  // Untere Schranke je Ring: Ostwest-Zellbreite am nördlichsten Punkt, mit Sicherheitsabschlag.
  const ringKm = GITTER * 111.19 * Math.cos((55.2 * Math.PI) / 180) * 0.9;

  const naechste = (p, anzahl) => {
    const ci = Math.floor(p.lat / GITTER);
    const cj = Math.floor(p.lon / GITTER);
    const funde = [];
    for (let r = 0; r <= rMax; r++) {
      for (let di = -r; di <= r; di++) {
        for (let dj = -r; dj <= r; dj++) {
          if (Math.max(Math.abs(di), Math.abs(dj)) !== r) continue;
          for (const q of gitter.get(`${ci + di}|${cj + dj}`) ?? []) {
            if (q.id !== p.id) funde.push({ id: q.id, km: haversineKm(p.lat, p.lon, q.lat, q.lon) });
          }
        }
      }
      if (funde.length >= anzahl) {
        funde.sort(nachKmUndId);
        if (funde[anzahl - 1].km <= r * ringKm) break;
      }
    }
    return funde.sort(nachKmUndId).slice(0, anzahl);
  };

  const nb = new Map(punkte.map((p) => [p.id, new Map()]));
  const kanten = new Map();
  for (const p of punkte) {
    for (const { id, km } of naechste(p, NACHBARN_ROH)) {
      const [a, b] = p.id < id ? [p.id, id] : [id, p.id];
      kanten.set(`${a}|${b}`, { a, b, km });
    }
  }
  const verbinde = (a, b, km) => { nb.get(a).set(b, km); nb.get(b).set(a, km); };
  const sortiert = [...kanten.values()].sort((x, y) => x.km - y.km || cmp(x.a, y.a) || cmp(x.b, y.b));
  for (const k of sortiert) {
    if (nb.get(k.a).size < NACHBARN_MAX && nb.get(k.b).size < NACHBARN_MAX) verbinde(k.a, k.b, k.km);
  }
  const defizit = [];
  for (const p of punkte) {
    if (nb.get(p.id).size >= NACHBARN_MIN) continue;
    for (const { id, km } of naechste(p, 30)) {
      if (nb.get(p.id).size >= NACHBARN_MIN) break;
      if (nb.get(p.id).has(id) || nb.get(id).size >= NACHBARN_MAX) continue;
      verbinde(p.id, id, km);
    }
    if (nb.get(p.id).size < NACHBARN_MIN) defizit.push(p.id);
  }
  const nachbarn = new Map();
  for (const [id, m] of nb) {
    nachbarn.set(id, [...m].sort((x, y) => x[1] - y[1] || cmp(x[0], y[0])).map((x) => x[0]));
  }
  return { nachbarn, defizit };
}

/** Reichert alle Orte an. Liefert Orte (sortiert nach id) und die Zählung. */
export function reichere({ abgleich, umkreis, plzZeilen, regeln }) {
  const roh = [...abgleich, ...umkreis];
  const zaehlung = {
    eingang: roh.length, namenGesaeubert: 0, ohneGemeinde: 0, dubletten: 0, typen: {}, plzUnsicher: 0,
    kreisStadtSuffix: 0, nachbarn: {}, nachbarnDefizit: [],
  };

  let liste = roh.map((e) => {
    const name = saeubern(e.name);
    if (name !== e.name) zaehlung.namenGesaeubert++;
    if (!e.gemeinde) zaehlung.ohneGemeinde++;
    return {
      id: e.id, name, cc: e.cc, a1: e.a1, a2: e.a2, a3: e.a3, a4: e.a4, fcode: e.fcode, pop: e.pop,
      lat: e.lat, lon: e.lon, gemeinde: gemeindeNamen(e), kreis: kreisNamen(e, regeln),
      land: e.land ?? null, quellen: [...e.quellen], typ: null,
    };
  });

  for (const e of liste) e.gkey = gemKey(e);
  bestimmeTypen(liste);
  const dub = entferneGemeindeDubletten(liste);
  liste = dub.orte;
  zaehlung.dubletten = dub.entfernt;

  const gemeindeIdNach = new Map();
  const ortsteileNach = new Map();
  for (const e of liste) {
    if (e.typ === 'gemeinde' && e.gemeinde) gemeindeIdNach.set(e.gkey, e.id);
    if (e.typ === 'ortsteil') {
      if (!ortsteileNach.has(e.gkey)) ortsteileNach.set(e.gkey, []);
      ortsteileNach.get(e.gkey).push(e);
    }
  }

  const kreise = kreisSchluessel(liste.map((e) => ({ cc: e.cc, kreis: e.kreis })), regeln);
  const sitz = liste.find((e) => e.id === SITZ_ID);
  zusicherung(sitz, `Sitz ${SITZ_ID} fehlt`);
  zusicherung(sitz.gemeinde === betrieb.sitz.gemeinde, `Sitz-Gemeinde ${sitz.gemeinde} weicht von betrieb.sitz ab`);

  const plzIdx = plzIndex(plzZeilen);
  for (const e of liste) {
    e.kreisSlug = e.kreis ? kreise.get(`${e.cc}|${e.kreis}`) : null;
    e.landSlug = e.land ? schluessel(e.land) : null;
    e.km = Math.round(haversineKm(sitz.lat, sitz.lon, e.lat, e.lon));
    e.richtung = e.id === SITZ_ID ? null : richtung8(sitz, e);
    e.zone = zoneFuer({ cc: e.cc, km: e.km, kreis: e.kreis });
    const p = plzFuer(e, plzIdx);
    e.plz = p.plz;
    e.plzUnsicher = p.unsicher;
    if (p.unsicher) zaehlung.plzUnsicher++;
    e.gemeindeId = e.typ === 'gemeinde' ? e.id : (gemeindeIdNach.get(e.gkey) ?? null);
    e.gemeinde = e.gemeinde ?? e.name;
    if (e.kreisSlug && e.kreisSlug.endsWith('-stadt')) zaehlung.kreisStadtSuffix++;
    zaehlung.typen[e.typ] = (zaehlung.typen[e.typ] ?? 0) + 1;
  }

  const { nachbarn, defizit } = nachbarnBerechnen(liste);
  zaehlung.nachbarnDefizit = defizit;
  const grade = [...nachbarn.values()].map((x) => x.length);
  zaehlung.nachbarn = {
    min: Math.min(...grade), max: Math.max(...grade),
    mittel: Math.round((grade.reduce((s, x) => s + x, 0) / grade.length) * 100) / 100,
  };
  for (const e of liste) {
    e.nachbarn = nachbarn.get(e.id) ?? [];
    if (e.typ === 'gemeinde') {
      const teile = [...(ortsteileNach.get(e.gkey) ?? [])];
      e.ortsteile = teile.sort((a, b) => DE.compare(a.name, b.name)).map((o) => o.id);
    }
  }

  return { orte: liste.sort((a, b) => cmp(a.id, b.id)), zaehlung };
}

export async function main() {
  const regeln = JSON.parse(await readFile(join(HIER, 'regeln.json'), 'utf8'));
  const abgleich = JSON.parse(await readFile(join(CACHE, 'abgleich.json'), 'utf8'));
  const umkreis = JSON.parse(await readFile(join(CACHE, 'umkreis.json'), 'utf8'));
  const plzZeilen = JSON.parse(await readFile(join(CACHE, 'plz.json'), 'utf8'));
  const { orte, zaehlung } = reichere({ abgleich, umkreis, plzZeilen, regeln });
  await schreibeZeilenJson(join(CACHE, 'angereichert.json'), orte);
  await schreibeObjektJson(join(CACHE, 'zaehlung-50.json'), zaehlung);
  console.log(`Stufe 50: ${orte.length} Orte angereichert; ${zaehlung.dubletten} Gemeinde-Dubletten zusammengeführt; `
    + `Nachbarn ${zaehlung.nachbarn.min}–${zaehlung.nachbarn.max} (Mittel ${zaehlung.nachbarn.mittel}); `
    + `Defizite ${zaehlung.nachbarnDefizit.length}.`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((f) => {
    console.error(f.stack || f);
    process.exitCode = 1;
  });
}
