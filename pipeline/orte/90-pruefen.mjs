#!/usr/bin/env node
// Stufe 90: prüft die Ausgaben hart (Abbruch bei Verstoß) und schreibt den Bericht
// _werkstatt/berichte/orte-pipeline.md mit Zählungen, Stichprobe und Laufzeiten.
// Eingaben: src/daten/{orte,plz,slug-register,weiterleitungen,orte-pruefliste}.json · .cache/orte/*
import { readFile, stat, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { zusicherung } from './lib.mjs';
import { gueltigerSlug, SLUG_MAX } from './60-slugs.mjs';

const HIER = dirname(fileURLToPath(import.meta.url));
const WURZEL = resolve(HIER, '../..');
const CACHE = join(WURZEL, '.cache/orte');
const DATEN = join(WURZEL, 'src/daten');
const BERICHT = join(WURZEL, '_werkstatt/berichte/orte-pipeline.md');

const SITZ_ID = 'gn:2812626';
const FELDER = ['id', 'slug', 'name', 'gemeinde', 'gemeindeId', 'typ', 'kreis', 'kreisSlug', 'land', 'landSlug',
  'staat', 'plz', 'lat', 'lon', 'km', 'richtung', 'zone', 'pop', 'quellen', 'nachbarn'];
const BOX = { DE: { lat: [47.2, 55.1], lon: [5.8, 15.1] }, NL: { lat: [50.7, 53.6], lon: [3.3, 7.3] } };
const ZONEN = ['A', 'B', 'C', 'D', 'NL'];
const pfad = (slug) => `/schluesseldienst-${slug}/`;
const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

const liesJson = async (datei, ersatz = null) => {
  try {
    return JSON.parse(await readFile(datei, 'utf8'));
  } catch (f) {
    if (f.code === 'ENOENT') return ersatz;
    throw f;
  }
};
const dateiGroesse = async (datei) => (await stat(datei)).size;

/** Prüft alle Zusicherungen. Wirft beim ersten Verstoß. Liefert die Namen der bestandenen Prüfungen. */
export function pruefe({ orte, plz, register, weiterleitungen, pruefliste, plzRohdaten }) {
  const bestanden = [];
  const pruefung = (name, bedingung, meldung) => {
    zusicherung(bedingung, `${name}: ${meldung}`);
    bestanden.push(name);
  };

  pruefung('IDs eindeutig', new Set(orte.map((o) => o.id)).size === orte.length, 'doppelte ID');
  pruefung('Slugs eindeutig', new Set(orte.map((o) => o.slug)).size === orte.length, 'doppelter Slug');
  for (const o of orte) {
    const erlaubt = new Set([...FELDER, ...(o.typ === 'gemeinde' ? ['ortsteile'] : []), ...(o.plzUnsicher ? ['plzUnsicher'] : [])]);
    pruefung('Felder genau', FELDER.every((f) => f in o) && Object.keys(o).every((k) => erlaubt.has(k)), `${o.id} hat falsche Felder`);
    pruefung('Slug gültig', gueltigerSlug(o.slug) && o.slug.length <= SLUG_MAX, `${o.id}: "${o.slug}"`);
    pruefung('Typ gültig', o.typ === 'gemeinde' || o.typ === 'ortsteil', `${o.id}: ${o.typ}`);
    const kasten = BOX[o.staat];
    pruefung('Koordinaten im Land', Boolean(kasten) && o.lat >= kasten.lat[0] && o.lat <= kasten.lat[1]
      && o.lon >= kasten.lon[0] && o.lon <= kasten.lon[1], `${o.id} (${o.staat}) ${o.lat},${o.lon}`);
    pruefung('Quellen gültig', o.quellen.length > 0 && o.quellen.every((q) => ['R', 'A', 'U'].includes(q)), `${o.id}`);
    pruefung('Zone gültig', ZONEN.includes(o.zone) && (o.staat === 'NL') === (o.zone === 'NL'), `${o.id}: ${o.zone}`);
    pruefung('Nachbarn 3 bis 10', o.nachbarn.length >= 3 && o.nachbarn.length <= 10, `${o.id}: ${o.nachbarn.length}`);
    pruefung('Plz Liste', o.plz.every((p) => /^\d{4,5}$/.test(p)), `${o.id}`);
  }

  const nach = new Map(orte.map((o) => [o.id, o]));
  for (const o of orte) {
    for (const n of o.nachbarn) {
      pruefung('Nachbar existiert', nach.has(n), `${o.id} → ${n}`);
      pruefung('Nachbarschaft symmetrisch', nach.get(n).nachbarn.includes(o.id), `${o.id} ↔ ${n}`);
    }
    if (o.gemeindeId !== null) pruefung('gemeindeId existiert', nach.has(o.gemeindeId), `${o.id}`);
    for (const x of o.ortsteile ?? []) pruefung('ortsteile-ID existiert', nach.has(x), `${o.id} → ${x}`);
  }

  const w = nach.get(SITZ_ID);
  pruefung('Weilburg vorhanden', Boolean(w) && w.zone === 'A' && w.km === 0 && w.typ === 'gemeinde' && w.richtung === null,
    'Sitz muss Zone A, km 0, Typ gemeinde und keine Richtung haben');

  const ohnePlz = orte.filter((o) => o.plz.length === 0).length;
  pruefung('Anteil ohne PLZ unter 3 Prozent', ohnePlz / orte.length < 0.03, `${ohnePlz} von ${orte.length}`);

  const deRohPlz = new Set(plzRohdaten.filter((z) => z.cc === 'DE').map((z) => z.plz));
  pruefung('PLZ-Index vollständig', plz.length === deRohPlz.size && new Set(plz.map((p) => p.plz)).size === plz.length,
    `${plz.length} Einträge, ${deRohPlz.size} DE-PLZ`);
  const lebend = new Set(orte.map((o) => pfad(o.slug)));
  const slugMenge = new Set(orte.map((o) => o.slug));
  for (const p of plz) {
    pruefung('PLZ-Slug existiert', p.slug === null || slugMenge.has(p.slug), `${p.plz}`);
  }

  pruefung('Register vollständig', orte.every((o) => register[o.id] === o.slug), 'Register weicht von orte.json ab');
  pruefung('Register-Slugs gültig', Object.values(register).every(gueltigerSlug), 'ungültiger Registerslug');

  for (const x of weiterleitungen) {
    pruefung('Weiterleitung Format', /^\/schluesseldienst-[a-z0-9-]+\/$/.test(x.von) && /^\/schluesseldienst-[a-z0-9-]+\/$/.test(x.nach), JSON.stringify(x));
    pruefung('Weiterleitung nicht auf lebende Seite', !lebend.has(x.von), `${x.von} ist eine lebende Seite`);
    pruefung('Weiterleitung Ziel lebt', lebend.has(x.nach), `${x.nach} existiert nicht`);
  }

  const ids = new Set(orte.map((o) => o.id));
  for (const p of pruefliste) {
    pruefung('Prüfliste nicht veröffentlicht', !ids.has(p.id), `${p.id} steht auch in orte.json`);
    pruefung('Prüfliste mit Grund', typeof p.grund === 'string' && p.grund.length > 0, p.id);
  }
  return bestanden;
}

/** Stichprobe: 10 Orte, gleichmäßig über die nach Slug sortierte Liste verteilt. */
export function stichprobe(orte) {
  const sortiert = [...orte].sort((a, b) => cmp(a.slug, b.slug));
  return Array.from({ length: 10 }, (_, k) => sortiert[Math.floor(((k + 0.5) * sortiert.length) / 10)]);
}

const zaehl = (liste, f) => liste.reduce((m, x) => {
  const k = f(x);
  m[k] = (m[k] ?? 0) + 1;
  return m;
}, {});
const sortiertNachSchluessel = (obj) => Object.fromEntries(Object.entries(obj).sort(([a], [b]) => cmp(a, b)));

export function baueBericht({ orte, plz, bestanden, z40, z50, z60, laufzeiten, groessen, pruefliste }) {
  const typen = zaehl(orte, (o) => o.typ);
  const zonen = sortiertNachSchluessel(zaehl(orte, (o) => o.zone));
  const laender = sortiertNachSchluessel(zaehl(orte, (o) => o.land ?? 'ohne'));
  const quellen = { R: 0, A: 0, U: 0 };
  for (const o of orte) for (const q of o.quellen) quellen[q]++;
  const grade = orte.map((o) => o.nachbarn.length);
  const mittelNachbarn = (grade.reduce((s, x) => s + x, 0) / grade.length).toFixed(2);
  const ohnePlz = orte.filter((o) => o.plz.length === 0).length;
  const unsicher = orte.filter((o) => o.plzUnsicher).length;
  const plzMitSlug = plz.filter((p) => p.slug).length;
  const pruefgruende = Object.entries(z40.pruefgruende ?? {}).map(([g, n]) => `- ${g}: ${n}`).join('\n') || '- keine';
  const laufText = Object.entries(laufzeiten ?? {}).map(([s, ms]) => `- ${s}: ${(ms / 1000).toFixed(1)} s`).join('\n')
    || '- nicht verfügbar';
  const probe = stichprobe(orte).map((o) => `| ${o.name} | ${o.slug} | ${o.gemeinde} | ${o.kreis ?? '–'} | ${o.plz[0] ?? '–'} | ${o.km} | ${o.zone} |`);

  return `# Orts-Pipeline (Stufen 00–90)

Erzeugt von \`pipeline/orte/alle.mjs\`. Ausgaben: \`src/daten/orte.json\`, \`src/daten/plz.json\`, \`src/daten/slug-register.json\`, \`src/daten/weiterleitungen.json\`, \`src/daten/orte-pruefliste.json\` (nicht veröffentlicht).

## Umfang und Zählungen

- Orte gesamt: **${orte.length}** (Gemeinden ${typen.gemeinde ?? 0}, Ortsteile ${typen.ortsteil ?? 0})
- Je Zone: ${Object.entries(zonen).map(([k, v]) => `${k} ${v}`).join(', ')}
- Je Land: ${Object.entries(laender).map(([k, v]) => `${k} ${v}`).join(', ')}
- Je Quelle (Orte mit Quelle): R ${quellen.R}, A ${quellen.A}, U ${quellen.U}
- Umkreis (Stufe 40): ${z40.imRadius} Kandidaten im Radius, ${z40.bereitsVorhanden} schon vorhanden, ${z40.dubletten} Dubletten, ${z40.pruefliste} auf der Prüfliste, ${z40.aufgenommen} aufgenommen
- Gemeinde-Dubletten zusammengeführt (Stufe 50): ${z50.dubletten}
- Namen gesäubert (Stufe 50): ${z50.namenGesaeubert}; Orte ohne Gemeinde in der Quelle: ${z50.ohneGemeinde}
- Slugs (Stufe 60): Orte mit Slug abweichend vom Grund-Slug (Kollisionszusatz oder Register): ${z60.abweichendVomGrund}; in diesem Lauf neue Kollisionsgruppen: ${z60.konfliktGruppenErstrunde} (das Register hält bestehende Slugs fest); Stufen dieses Laufs 1/2/3: ${z60.stufen[1]}/${z60.stufen[2]}/${z60.stufen[3]}; übersprungene Weiterleitungen: ${z60.weiterleitungUebersprungen}
- Orte mit kreisSlug „-stadt“ (kreisfreie Stadt mit gleichem Rest wie ein Landkreis): ${z50.kreisStadtSuffix}

### Prüfliste (src/daten/orte-pruefliste.json, ${pruefliste.length} Einträge)

${pruefgruende}

## PLZ und Nachbarn

- Orte ohne PLZ: ${ohnePlz} (${((100 * ohnePlz) / orte.length).toFixed(2)} %); mit unsicherer PLZ (Fallback leer): ${unsicher}
- PLZ-Index: ${plz.length} Einträge, davon ${plzMitSlug} mit Slug
- Nachbarn je Ort: min ${Math.min(...grade)}, max ${Math.max(...grade)}, Mittel ${mittelNachbarn}; Orte unter 3 Nachbarn: ${z50.nachbarnDefizit.length}

## Prüfungen (Stufe 90)

${bestanden.length} Einzelprüfungen bestanden, keine Verletzung. Prüfarten: ${[...new Set(bestanden)].join('; ')}.

## Dateigrößen

- src/daten/orte.json: ${(groessen.orte / 1024 / 1024).toFixed(2)} MB (Ziel unter 4 MB)
- src/daten/plz.json: ${(groessen.plz / 1024 / 1024).toFixed(2)} MB

## Laufzeiten

${laufText}

## Stichprobe (10 Orte)

| Name | Slug | Gemeinde | Kreis | PLZ | km | Zone |
|---|---|---|---|---|---|---|
${probe.join('\n')}
`;
}

export async function main() {
  const orte = await liesJson(join(DATEN, 'orte.json'), []);
  const plz = await liesJson(join(DATEN, 'plz.json'), []);
  const register = await liesJson(join(DATEN, 'slug-register.json'), {});
  const weiterleitungen = await liesJson(join(DATEN, 'weiterleitungen.json'), []);
  const pruefliste = await liesJson(join(DATEN, 'orte-pruefliste.json'), []);
  const plzRohdaten = JSON.parse(await readFile(join(CACHE, 'plz.json'), 'utf8'));
  const z40 = await liesJson(join(CACHE, 'zaehlung-40.json'), {});
  const z50 = await liesJson(join(CACHE, 'zaehlung-50.json'), {});
  const z60 = await liesJson(join(CACHE, 'zaehlung-60.json'), {});
  const laufzeiten = await liesJson(join(CACHE, 'laufzeiten.json'), null);

  const bestanden = pruefe({ orte, plz, register, weiterleitungen, pruefliste, plzRohdaten });
  const groessen = {
    orte: await dateiGroesse(join(DATEN, 'orte.json')),
    plz: await dateiGroesse(join(DATEN, 'plz.json')),
  };
  const bericht = baueBericht({ orte, plz, bestanden, z40, z50, z60, laufzeiten, groessen, pruefliste });
  await mkdir(dirname(BERICHT), { recursive: true });
  await writeFile(BERICHT, bericht);
  console.log(`Stufe 90: ${bestanden.length} Prüfungen bestanden; ${orte.length} Orte; Bericht ${BERICHT}`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((f) => {
    console.error(f.stack || f);
    process.exitCode = 1;
  });
}
