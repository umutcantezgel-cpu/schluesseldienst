// Tests der Seitensuche (V11): UND-Verknüpfung, Wertung (Titel vor Text), Umlaute eingeebnet, Mindestlänge.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { seitenIndex, seitenSuchen } from '../src/assets/js/logik/suche.mjs';

const INDEX = seitenIndex({ v: 1, s: [
  ['Türöffnung in Weilburg', '/notoeffnung/tueroeffnung/', 'Leistung', 'Zugefallene oder abgeschlossene Türen öffnen.'],
  ['Schließzylinder wechseln', '/ratgeber/schliesszylinder-wechseln/', 'Ratgeber', 'Wann ein Tausch nötig ist und wie Sie messen.'],
  ['Preise', '/preise/', 'Preise', 'Gesamtpreise für Türöffnung nach Zeitfenster und Zone.'],
  ['Tresor kaufen', '/ratgeber/tresor-kaufen-widerstandsgrade/', 'Ratgeber', 'Grad, Schloss und Ort.'],
] });

test('Treffer im Titel stehen vor Treffern im Text', () => {
  assert.deepEqual(seitenSuchen(INDEX, 'türöffnung').map((e) => e.pfad), ['/notoeffnung/tueroeffnung/', '/preise/']);
});

test('Umlaute und ß: „tur“, „tuer“ und „Tür“ finden dasselbe; „schliess“ findet „Schließ…“', () => {
  for (const q of ['tur', 'tuer', 'Tür']) assert.equal(seitenSuchen(INDEX, q)[0].pfad, '/notoeffnung/tueroeffnung/', q);
  assert.equal(seitenSuchen(INDEX, 'schliess')[0].pfad, '/ratgeber/schliesszylinder-wechseln/');
});

test('alle Wörter müssen vorkommen; kurze Anfragen und Fremdwörter liefern nichts', () => {
  assert.deepEqual(seitenSuchen(INDEX, 'tresor ratgeber').map((e) => e.pfad), ['/ratgeber/tresor-kaufen-widerstandsgrade/']);
  assert.deepEqual(seitenSuchen(INDEX, 'tresor preise'), []);
  assert.deepEqual(seitenSuchen(INDEX, 't'), []);
  assert.deepEqual(seitenSuchen(INDEX, 'xyzq'), []);
});
