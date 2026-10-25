#!/usr/bin/env node
// Stufe 60: vergibt stabile Slugs, pflegt Register und Weiterleitungen und schreibt
// src/daten/{orte,plz,slug-register,weiterleitungen}.json.
// Eingaben: .cache/orte/{angereichert,plz}.json · src/daten/{slug-register,weiterleitungen}.json (falls vorhanden)
// Ausgaben: die vier Dateien unter src/daten/ · .cache/orte/zaehlung-60.json
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { schluessel, kern } from '../../src/assets/js/logik/normalisieren.mjs';
import { haversineKm, schreibeObjektJson, schreibeZeilenJson, zusicherung } from './lib.mjs';
import { saeubern, SITZ_ID } from './40-umkreis.mjs';
import { zoneFuer } from './50-anreichern.mjs';
import zonen from '../../src/konfig/zonen.mjs';

const HIER = dirname(fileURLToPath(import.meta.url));
const WURZEL = resolve(HIER, '../..');
const CACHE = join(WURZEL, '.cache/orte');
const DATEN = join(WURZEL, 'src/daten');

export const SLUG_MAX = 80;
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const gueltigerSlug = (s) => typeof s === 'string' && s.length <= SLUG_MAX && SLUG_RE.test(s);

const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const nachPopUndId = (a, b) => (b.pop ?? 0) - (a.pop ?? 0) || cmp(a.id, b.id);
const mittel = (werte) => werte.reduce((s, x) => s + x, 0) / werte.length;

/** Häufigster Wert; bei Gleichstand der alphabetisch kleinere. */
function haeufigster(werte) {
  const zaehl = new Map();
  for (const w of werte) zaehl.set(w, (zaehl.get(w) ?? 0) + 1);
  const sortiert = [...zaehl].sort((a, b) => b[1] - a[1] || cmp(String(a[0]), String(b[0])));
  return sortiert.length ? sortiert[0][0] : null;
}

/** Grund-Slug: Gemeinde → Name; Ortsteil → Gemeindekern-Name (ohne doppelten Kern). */
export function grundSlug(e) {
  if (e.typ === 'gemeinde') return schluessel(e.name);
  zusicherung(e.gemeinde, `Ortsteil ohne Gemeinde: ${e.id}`);
  const g = schluessel(kern(e.gemeinde));
  const n = schluessel(e.name);
  if (n === g || n.startsWith(`${g}-`)) return n;
  return `${g}-${n}`;
}

/**
 * Slug einer Kollisionsstufe, kumulativ auf dem Grund-Slug aufgebaut:
 * 1 Kreis (NL bei DE-Kollision: -nl) · 2 erste PLZ, sonst Ziffern der ID · 3 zusätzlich Ziffern der ID.
 */
function aufloesen(e, grund, stufe, mitDE) {
  const ziffern = e.id.replace(/\D/g, '');
  let s = grund;
  if (stufe >= 1) {
    if (e.cc === 'NL' && mitDE) s += '-nl';
    else if (e.kreisSlug) s += `-${e.kreisSlug}`;
  }
  if (stufe >= 2) s += e.plz?.[0] ? `-${e.plz[0]}` : `-${ziffern}`;
  if (stufe >= 3 && e.plz?.[0]) s += `-${ziffern}`;
  return s;
}

/**
 * Löst Slugs auf. Register-Slugs bleiben erhalten, solange sie nicht kollidieren.
 * Bei Kollision behält der Ort mit der größten Einwohnerzahl den Slug, alle anderen bekommen einen Zusatz.
 * Liefert Slugs, das neue Register, neue Weiterleitungen und die Zählung.
 */
export function loeseSlugs(recs, register = {}) {
  const grund = new Map(recs.map((e) => [e.id, grundSlug(e)]));
  for (const e of recs) {
    zusicherung(gueltigerSlug(grund.get(e.id)), `Grund-Slug ungültig: ${e.id} "${grund.get(e.id)}"`);
  }
  const zustand = new Map(recs.map((e) => {
    const alt = register[e.id];
    return [e.id, gueltigerSlug(alt)
      ? { slug: alt, reg: true, stufe: 0 }
      : { slug: grund.get(e.id), reg: false, stufe: 0 }];
  }));

  let konfliktErstrunde = 0;
  const betroffen = new Set();
  for (let runde = 0; runde < 100000; runde++) {
    const gruppen = new Map();
    for (const e of recs) {
      const s = zustand.get(e.id).slug;
      if (!gruppen.has(s)) gruppen.set(s, []);
      gruppen.get(s).push(e);
    }
    const konflikte = [...gruppen.values()].filter((g) => g.length > 1);
    if (runde === 0) konfliktErstrunde = konflikte.length;
    if (konflikte.length === 0) break;
    for (const g of konflikte) {
      const mitDE = g.some((e) => e.cc === 'DE');
      const [, ...verlierer] = [...g].sort(nachPopUndId);
      for (const e of verlierer) {
        const z = zustand.get(e.id);
        betroffen.add(e.id);
        if (z.reg) { z.reg = false; z.stufe = 1; } else z.stufe += 1;
        zusicherung(z.stufe <= 3, `Slug-Kollision nicht auflösbar: ${e.id} (${grund.get(e.id)})`);
        z.slug = aufloesen(e, grund.get(e.id), z.stufe, mitDE);
      }
    }
  }
  zusicherung(recs.every((e) => gueltigerSlug(zustand.get(e.id).slug)), 'Ungültiger Slug nach Auflösung');

  const slugs = new Map([...zustand].map(([id, z]) => [id, z.slug]));
  const live = new Set(slugs.values());
  const neuesRegister = {};
  const weiterleitungen = [];
  let uebersprungen = 0;
  for (const e of recs) {
    const s = slugs.get(e.id);
    const alt = register[e.id];
    if (gueltigerSlug(alt) && alt !== s) {
      // Der alte Pfad gehört jetzt einem anderen Ort: eine Weiterleitung dorthin würde dessen Seite umleiten.
      if (live.has(alt)) uebersprungen++;
      else weiterleitungen.push({ von: `/schluesseldienst-${alt}/`, nach: `/schluesseldienst-${s}/` });
    }
    neuesRegister[e.id] = s;
  }
  // Register ist anhängend: IDs ohne aktuellen Ort bleiben erhalten.
  for (const [id, alt] of Object.entries(register)) if (!(id in neuesRegister)) neuesRegister[id] = alt;

  const stufen = { 1: 0, 2: 0, 3: 0 };
  for (const z of zustand.values()) if (z.stufe > 0) stufen[z.stufe]++;
  return {
    slugs,
    register: neuesRegister,
    weiterleitungen,
    zaehlung: {
      konfliktGruppenErstrunde: konfliktErstrunde,
      betroffen: betroffen.size,
      stufen,
      weiterleitungUebersprungen: uebersprungen,
      abweichendVomGrund: recs.filter((e) => slugs.get(e.id) !== grund.get(e.id)).length,
    },
  };
}

/** Ortsdatensatz von orte.json (genau diese Felder). */
export function baueOrt(e, slug) {
  const o = {
    id: e.id,
    slug,
    name: e.name,
    gemeinde: e.gemeinde,
    gemeindeId: e.gemeindeId,
    typ: e.typ,
    kreis: e.kreis,
    kreisSlug: e.kreisSlug,
    land: e.land,
    landSlug: e.landSlug,
    staat: e.cc,
    plz: e.plz,
  };
  if (e.plzUnsicher) o.plzUnsicher = true;
  o.lat = Number(e.lat.toFixed(4));
  o.lon = Number(e.lon.toFixed(4));
  o.km = e.km;
  o.richtung = e.richtung;
  o.zone = e.zone;
  o.pop = e.pop;
  o.quellen = [...new Set(e.quellen.map((q) => q.split(':')[0]))].sort(cmp);
  o.nachbarn = e.nachbarn;
  if (e.typ === 'gemeinde') o.ortsteile = e.ortsteile;
  return o;
}

/** PLZ-Index: je DE-PLZ ein Eintrag; Slug des Ortes mit größter Einwohnerzahl, der die PLZ führt. */
export function plzEintraege(zeilen, orte, sitz) {
  const nachPlz = new Map();
  for (const z of zeilen) {
    if (z.cc !== 'DE') continue;
    if (!nachPlz.has(z.plz)) nachPlz.set(z.plz, []);
    nachPlz.get(z.plz).push(z);
  }
  const bester = new Map();
  for (const o of orte) {
    if (o.staat !== 'DE') continue;
    for (const p of o.plz) {
      const alt = bester.get(p);
      if (!alt || o.pop > alt.pop || (o.pop === alt.pop && o.slug < alt.slug)) bester.set(p, { pop: o.pop, slug: o.slug });
    }
  }
  return [...nachPlz.keys()].sort(cmp).map((plz) => {
    const z = nachPlz.get(plz);
    const lat = mittel(z.map((x) => x.lat));
    const lon = mittel(z.map((x) => x.lon));
    const km = Math.round(haversineKm(sitz.lat, sitz.lon, lat, lon));
    const ort = haeufigster(z.map((x) => saeubern(x.ort)).filter(Boolean));
    const kreisCode = haeufigster(z.map((x) => x.kreisCode));
    // Kreis-Regel über kreisCode = a3 des Sitzes (Weilburg).
    const kreis = kreisCode === sitz.a3 ? zonen.sitzKreis : null;
    return { plz, ort, km, zone: zoneFuer({ cc: 'DE', km, kreis }, zonen), slug: bester.get(plz)?.slug ?? null };
  });
}

async function liesJson(datei, ersatz) {
  try {
    return JSON.parse(await readFile(datei, 'utf8'));
  } catch (f) {
    if (f.code === 'ENOENT') return ersatz;
    throw f;
  }
}

/** Register als JSON-Objekt mit einem Eintrag pro Zeile. */
async function schreibeRegister(datei, reg) {
  const ids = Object.keys(reg).sort(cmp);
  const inhalt = ids.length === 0
    ? '{}\n'
    : '{\n' + ids.map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(reg[k])}`).join(',\n') + '\n}\n';
  await mkdir(dirname(datei), { recursive: true });
  await writeFile(datei, inhalt);
}

export async function main() {
  const angereichert = JSON.parse(await readFile(join(CACHE, 'angereichert.json'), 'utf8'));
  const register = await liesJson(join(DATEN, 'slug-register.json'), {});
  const weiterAlt = await liesJson(join(DATEN, 'weiterleitungen.json'), []);
  const plzZeilen = JSON.parse(await readFile(join(CACHE, 'plz.json'), 'utf8'));
  const sitz = angereichert.find((e) => e.id === SITZ_ID);
  zusicherung(sitz, `Sitz ${SITZ_ID} fehlt`);

  const { slugs, register: neuesRegister, weiterleitungen, zaehlung } = loeseSlugs(angereichert, register);
  const orte = angereichert.map((e) => baueOrt(e, slugs.get(e.id))).sort((a, b) => cmp(a.slug, b.slug));
  const weiter = [...weiterAlt];
  for (const w of weiterleitungen) if (!weiter.some((x) => x.von === w.von)) weiter.push(w);
  const plz = plzEintraege(plzZeilen, orte, sitz);

  await schreibeZeilenJson(join(DATEN, 'orte.json'), orte);
  await schreibeRegister(join(DATEN, 'slug-register.json'), neuesRegister);
  await schreibeZeilenJson(join(DATEN, 'weiterleitungen.json'), weiter);
  await schreibeZeilenJson(join(DATEN, 'plz.json'), plz);
  await schreibeObjektJson(join(CACHE, 'zaehlung-60.json'), {
    ...zaehlung,
    orte: orte.length,
    registerEintraege: Object.keys(neuesRegister).length,
    weiterleitungen: weiter.length,
    plzEintraege: plz.length,
    plzMitSlug: plz.filter((p) => p.slug).length,
  });
  console.log(`Stufe 60: ${orte.length} Orte mit Slug; ${zaehlung.konfliktGruppenErstrunde} Kollisionsgruppen, `
    + `${zaehlung.betroffen} Orte mit Zusatz; ${weiter.length} Weiterleitungen; ${plz.length} PLZ im Index.`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((f) => {
    console.error(f.stack || f);
    process.exitCode = 1;
  });
}
