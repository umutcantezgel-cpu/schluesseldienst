import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { haversineKm, richtung8 } from '../pipeline/orte/lib.mjs';
import {
  zoneFuer, kreisSlugVon, kreisSchluessel, kreisNamen, nachbarnBerechnen,
} from '../pipeline/orte/50-anreichern.mjs';
import zonen from '../src/konfig/zonen.mjs';

// Koordinaten wie in src/daten/orte.json (Stufe 50/60).
const WEILBURG = { lat: 50.4844, lon: 8.2625 };
const WETZLAR = { lat: 50.5611, lon: 8.5049 };
const LIMBURG = { lat: 50.3836, lon: 8.0503 };
const regeln = JSON.parse(await readFile(new URL('../pipeline/orte/regeln.json', import.meta.url), 'utf8'));

test('Entfernung Weilburg–Wetzlar liegt bei rund 19 km (±2)', () => {
  const km = haversineKm(WEILBURG.lat, WEILBURG.lon, WETZLAR.lat, WETZLAR.lon);
  assert.ok(km > 17 && km < 21, `Entfernung ${km.toFixed(1)} km`);
});

test('Richtung Weilburg → Limburg ist südwestlich', () => {
  assert.equal(richtung8(WEILBURG, LIMBURG), 'südwestlich');
});

test('Zonenregel an den Grenzen 20, 50 und 100 km', () => {
  const zone = (km) => zoneFuer({ cc: 'DE', km, kreis: 'Landkreis Gießen' }, zonen);
  assert.equal(zone(20), 'A');
  assert.equal(zone(21), 'B');
  assert.equal(zone(50), 'B');
  assert.equal(zone(51), 'C');
  assert.equal(zone(100), 'C');
  assert.equal(zone(101), 'D');
});

test('Kreis-Regel: der Sitzkreis gehört auch über 20 km zu Zone A', () => {
  assert.equal(zoneFuer({ cc: 'DE', km: 35, kreis: zonen.sitzKreis }, zonen), 'A');
  assert.equal(zoneFuer({ cc: 'DE', km: 35, kreis: 'Landkreis Gießen' }, zonen), 'B');
});

test('Niederlande haben immer die Zone NL', () => {
  assert.equal(zoneFuer({ cc: 'NL', km: 5, kreis: 'Utrecht' }, zonen), 'NL');
});

test('Kreis-Schlüssel: kreisfreie Stadt mit gleichem Rest wie ein Landkreis bekommt -stadt', () => {
  const t = kreisSchluessel([
    { cc: 'DE', kreis: 'Landkreis Kassel' },
    { cc: 'DE', kreis: 'Kreisfreie Stadt Kassel' },
    { cc: 'DE', kreis: 'Landkreis Offenbach' },
    { cc: 'DE', kreis: 'Kreisfreie Stadt Offenbach am Main' },
  ], regeln);
  assert.equal(t.get('DE|Landkreis Kassel'), 'kassel');
  assert.equal(t.get('DE|Kreisfreie Stadt Kassel'), 'kassel-stadt');
  assert.equal(t.get('DE|Landkreis Offenbach'), 'offenbach');
  // Kein Zusatz: „Offenbach am Main“ hat einen anderen Rest als „Offenbach“ (siehe offene Frage im Bericht).
  assert.equal(t.get('DE|Kreisfreie Stadt Offenbach am Main'), 'offenbach-am-main');
});

test('Präfixe werden entfernt; Stadtstaaten nur mit dem Stadtnamen', () => {
  assert.equal(kreisSlugVon('Landkreis Limburg-Weilburg'), 'limburg-weilburg');
  assert.equal(kreisSlugVon('Städteregion Aachen'), 'aachen');
  assert.equal(kreisNamen({ cc: 'DE', kreis: 'Kreisfreie Stadt Bremen' }, regeln), 'Bremen');
  assert.equal(kreisNamen({ cc: 'DE', kreis: 'Hamburg, Freie und Hansestadt' }, regeln), 'Hamburg');
  assert.equal(kreisNamen({ cc: 'DE', kreis: 'Berlin, Stadt' }, regeln), 'Berlin');
});

test('Nachbarn sind symmetrisch, je Ort höchstens 10 und mindestens 3', () => {
  const punkte = Array.from({ length: 40 }, (_, i) => ({
    id: `gn:${i + 1}`,
    lat: 50 + (i % 8) * 0.03,
    lon: 8 + Math.floor(i / 8) * 0.04,
  }));
  const { nachbarn, defizit } = nachbarnBerechnen(punkte);
  assert.deepEqual(defizit, []);
  for (const [id, liste] of nachbarn) {
    assert.ok(liste.length >= 3 && liste.length <= 10, `${id}: ${liste.length} Nachbarn`);
    for (const n of liste) assert.ok(nachbarn.get(n).includes(id), `${id} ↔ ${n} nicht symmetrisch`);
  }
});
