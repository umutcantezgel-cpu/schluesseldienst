// JS je Seite (D-JS-01): Bündel aus dem Einstieg mit nur den Modulen einer Seite.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { jsBuendeln } from '../bau/lib/assets.mjs';

const EINSTIEG = fileURLToPath(new URL('../src/assets/js/app.mjs', import.meta.url));
const dateien = (b) => b.module.map((d) => d.split('/').slice(-2).join('/'));

test('Teilbündel enthält nur die genannten Module und ihre Abhängigkeiten', async () => {
  const voll = await jsBuendeln(EINSTIEG);
  const teil = await jsBuendeln(EINSTIEG, { module: new Set(['menue', 'aufklapper', 'erreichbarkeit']) });
  assert.ok(teil.text.length < voll.text.length / 3, `${teil.text.length} von ${voll.text.length}`);
  const d = dateien(teil);
  for (const n of ['module/menue.mjs', 'module/aufklapper.mjs', 'module/erreichbarkeit.mjs', 'logik/erreichbarkeit.mjs']) assert.ok(d.includes(n), n);
  for (const n of ['module/ortssuche.mjs', 'module/composer.mjs', 'logik/mailto.mjs', 'module/gruppenfilter.mjs']) assert.ok(!d.includes(n), n);
  assert.match(teil.text, /const MODULE = \{ menue, aufklapper, erreichbarkeit \};/);
});

test('unbekannte Modulnamen werden übergangen; ohne Module bleibt ein leerer Start', async () => {
  const b = await jsBuendeln(EINSTIEG, { module: new Set(['gibt-es-nicht']) });
  assert.match(b.text, /const MODULE = \{  \};/);
  assert.match(b.text, /function starten\(\)/);
  assert.deepEqual(dateien(b), ['js/app.mjs']);
});

test('ohne Angabe bleibt das volle Bündel unverändert', async () => {
  const b = await jsBuendeln(EINSTIEG);
  assert.match(b.text, /const MODULE = \{ menue, aufklapper, erreichbarkeit, ortssuche, abspielen, szene, tagesband, preisrechner, composer, suche, gruppenfilter \};/);
});
