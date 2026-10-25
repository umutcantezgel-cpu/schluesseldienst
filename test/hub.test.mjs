// Hub-Seiten, Abschnitt „… in Zahlen“ (K-08): Gebietsart der Überschrift, ein Ort bzw. gleiche Entfernung, PLZ-Angabe.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gebietsart, kennzahlenAbschnitt } from '../src/vorlagen/seiten/hub.mjs';
import zonen from '../src/konfig/zonen.mjs';

const ort = (name, km, typ = 'gemeinde', plz = []) => ({ name, slug: name.toLowerCase().replace(/\W+/g, '-'), km, typ, zone: 'D', staat: 'DE', plz });
const text = (h) => String(h).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');

test('Gebietsart: Kreis, kreisfreie Stadt (auch ohne Zusatz), Region, Provinz', () => {
  assert.equal(gebietsart('Landkreis Limburg-Weilburg', false), 'Kreis');
  assert.equal(gebietsart('Westerwaldkreis', false), 'Kreis');
  assert.equal(gebietsart('Rotenburg (Wümme)', false), 'Kreis');
  assert.equal(gebietsart('Kreisfreie Stadt Wiesbaden', false), 'Stadt');
  assert.equal(gebietsart('Stadtkreis Heidelberg', false), 'Stadt');
  assert.equal(gebietsart('Landeshauptstadt Magdeburg', false), 'Stadt');
  assert.equal(gebietsart('Frankfurt am Main', false), 'Stadt');
  assert.equal(gebietsart('Region Hannover', false), 'Region');
  assert.equal(gebietsart('Städteregion Aachen', false), 'Region');
  assert.equal(gebietsart('Regionalverband Saarbrücken', false), 'Region');
  assert.equal(gebietsart('Gelderland', true), 'Provinz');
});

test('Überschrift folgt der Gebietsart', () => {
  const orte = [ort('A', 10), ort('B', 20)];
  assert.match(text(kennzahlenAbschnitt(zonen, orte, 'DE', 'Kreis')), /Der Kreis in Zahlen/);
  assert.match(text(kennzahlenAbschnitt(zonen, orte, 'DE', 'Stadt')), /Die Stadt in Zahlen/);
  assert.match(text(kennzahlenAbschnitt(zonen, orte, 'NL', 'Provinz')), /Die Provinz in Zahlen/);
});

test('ein Ort bzw. gleiche Entfernung: eine Zeile statt zweimal desselben Orts', () => {
  const einer = text(kennzahlenAbschnitt(zonen, [ort('Kempten (Allgäu)', 341)], 'DE', 'Stadt'));
  assert.match(einer, /Einziger Ort: Kempten \(Allgäu\), 341 km/);
  assert.doesNotMatch(einer, /Entferntester/);
  const zwei = text(kennzahlenAbschnitt(zonen, [ort('Düsseldorf', 133), ort('Pempelfort', 133, 'ortsteil')], 'DE', 'Stadt'));
  assert.match(zwei, /Beide Orte: 133 km/);
  const drei = text(kennzahlenAbschnitt(zonen, [ort('A', 5), ort('B', 9), ort('C', 30)], 'DE', 'Kreis'));
  assert.match(drei, /Nächster: A, 5 km/);
  assert.match(drei, /Entferntester: C, 30 km/);
});

test('Null-Werte entfallen; PLZ ausgeschrieben; NL mit vierstelligen PLZ', () => {
  const nurOrtsteile = text(kennzahlenAbschnitt(zonen, [ort('X', 3, 'ortsteil', ['35781']), ort('Y', 4, 'ortsteil', ['65627'])], 'DE', 'Stadt'));
  assert.match(nurOrtsteile, /2 Ortsteile/);
  assert.doesNotMatch(nurOrtsteile, /\d Gemeinde/);
  assert.match(nurOrtsteile, /kleinste 35781, größte 65627/);
  const nl = { ...ort('Z', 300, 'gemeinde', ['7601', '7611']), staat: 'NL', zone: 'NL' };
  assert.match(text(kennzahlenAbschnitt(zonen, [nl], 'NL', 'Provinz')), /Postleitzahlen.*kleinste 7601, größte 7611/s);
});
