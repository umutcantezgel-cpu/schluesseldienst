// Tests für den Orts-Abgleich (Stufe 30) mit einem kleinen, erfundenen Gazetteer.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { lesarten, baueIndex, gleicheAb } from '../pipeline/orte/30-abgleich.mjs';

const regeln = JSON.parse(await readFile(new URL('../pipeline/orte/regeln.json', import.meta.url), 'utf8'));
const g = (id, name, lat, lon, a1, a3, a4, fcode = 'PPL', pop = 0, alt = []) => ({ id, name, alt, lat, lon, fc: fcode === 'ADM4' ? 'A' : 'P', fcode, cc: 'DE', a1, a2: '064', a3, a4, pop });
const gazetteer = [
  g('gn:1', 'Weilburg', 50.4844, 8.2625, '05', '06533', '06533016', 'PPL', 13000),
  g('gn:2', 'Kubach', 50.4706, 8.2864, '05', '06533', '06533016'),
  g('gn:3', 'Hausen', 50.30, 8.40, '05', '06533', '06533001'),
  g('gn:4', 'Hausen', 50.70, 8.90, '05', '06531', '06531002'),
  g('gn:5', 'Holzhausen', 50.80, 8.70, '05', '06534', '06534005'),
  g('gn:6', 'Holzhausen', 50.70, 8.69, '05', '06534', '06534009'),
  g('gn:7', 'Fronhausen', 50.70, 8.70, '05', '06534', '06534009', 'PPL', 4000),
  g('gn:8', 'Weilburg', 50.48, 8.27, '05', '06533', '06533016', 'ADM4'),
];
const verwaltung = { gemeinde: {
  'DE.05.064.06533': 'Landkreis Limburg-Weilburg', 'DE.05.064.06533.06533016': 'Weilburg', 'DE.05.064.06533.06533001': 'Beselich',
  'DE.05.064.06531': 'Landkreis Gießen', 'DE.05.064.06531.06531002': 'Buseck', 'DE.05.064.06534': 'Landkreis Marburg-Biedenkopf',
  'DE.05.064.06534.06534005': 'Dautphetal', 'DE.05.064.06534.06534009': 'Fronhausen' }, kreis: {}, land: {} };
const kontext = { index: baueIndex(gazetteer), verwaltung, regeln };

test('Lesarten: „Ortsteil, Gemeinde“ zuerst, umgekehrt mit Abzug', () => {
  const l = lesarten({ quelle: 'R', text: 'Kubach, Weilburg', land: 'Hessen' }, regeln);
  assert.deepEqual(l[0], { name: 'Kubach', gemeinde: 'Weilburg', klammer: null, abzug: 0 });
  assert.ok(l.some((x) => x.name === 'Weilburg' && x.abzug === 8));
});

test('Lesarten: Adam-Slug stadt-stadtteil', () => {
  const l = lesarten({ quelle: 'A', slug: 'weilburg-kubach' }, regeln);
  assert.ok(l.some((x) => x.name === 'kubach' && x.gemeinde === 'weilburg' && x.abzug === 0));
});

test('Ortsteil mit passender Gemeinde wird zugeordnet', () => {
  const r = gleicheAb({ quelle: 'R', text: 'Kubach, Weilburg', land: 'Hessen' }, kontext);
  assert.equal(r.status, 'zugeordnet');
  assert.equal(r.wahl.e.id, 'gn:2');
});

test('Gemeinde-Hinweis entscheidet zwischen gleichnamigen Orten', () => {
  const r = gleicheAb({ quelle: 'R', text: 'Holzhausen, Fronhausen', land: 'Hessen' }, kontext);
  assert.equal(r.status, 'zugeordnet');
  assert.equal(r.wahl.e.id, 'gn:6');
});

test('ADM4 und PPL derselben Siedlung gelten als eins; PPL wird bevorzugt', () => {
  const r = gleicheAb({ quelle: 'R', text: 'Weilburg', land: 'Hessen' }, kontext);
  assert.equal(r.status, 'zugeordnet');
  assert.equal(r.wahl.e.id, 'gn:1');
});

test('Falsches Land der Quelle: Rückfall bundesweit', () => {
  const r = gleicheAb({ quelle: 'R', text: 'Kubach, Weilburg', land: 'NRW' }, kontext);
  assert.equal(r.status, 'zugeordnet');
  assert.equal(r.landKorrigiert, true);
});
