import { test } from 'node:test';
import assert from 'node:assert/strict';
import { grundSlug, gueltigerSlug, loeseSlugs } from '../pipeline/orte/60-slugs.mjs';

const ort = (o) => ({ cc: 'DE', pop: 0, kreisSlug: null, plz: [], typ: 'gemeinde', ...o });

test('Gemeinde-Slug ist der Name', () => {
  assert.equal(grundSlug(ort({ id: 'gn:1', name: 'Weilburg', gemeinde: 'Weilburg' })), 'weilburg');
});

test('Ortsteil-Slug: Gemeindekern vorn (Kubach in Weilburg → weilburg-kubach)', () => {
  assert.equal(grundSlug(ort({ id: 'gn:2', name: 'Kubach', gemeinde: 'Weilburg', typ: 'ortsteil' })), 'weilburg-kubach');
});

test('Ortsteil-Slug verdoppelt den Gemeindekern nicht (Weilburg-Kubach → weilburg-kubach)', () => {
  assert.equal(grundSlug(ort({ id: 'gn:3', name: 'Weilburg-Kubach', gemeinde: 'Weilburg', typ: 'ortsteil' })), 'weilburg-kubach');
});

test('Gültigkeit: Kleinbuchstaben, Ziffern, Bindestrich, höchstens 80 Zeichen', () => {
  assert.ok(gueltigerSlug('weilburg-kubach'));
  assert.ok(!gueltigerSlug('Weilburg'));
  assert.ok(!gueltigerSlug('a--b'));
  assert.ok(!gueltigerSlug('a'.repeat(81)));
});

test('Kollision mit Kreis: größte Einwohnerzahl behält den Slug, der andere bekommt -{kreisSlug}', () => {
  const r = loeseSlugs([
    ort({ id: 'gn:1', name: 'Hof', gemeinde: 'Hof', pop: 500, kreisSlug: 'alpha' }),
    ort({ id: 'gn:2', name: 'Hof', gemeinde: 'Hof', pop: 50, kreisSlug: 'beta' }),
  ]);
  assert.equal(r.slugs.get('gn:1'), 'hof');
  assert.equal(r.slugs.get('gn:2'), 'hof-beta');
});

test('Kollision NL gegen DE: der NL-Ort bekommt -nl', () => {
  const r = loeseSlugs([
    ort({ id: 'gn:1', name: 'Hof', pop: 500, kreisSlug: 'alpha' }),
    ort({ id: 'gn:2', name: 'Hof', pop: 50, cc: 'NL', kreisSlug: 'utrecht' }),
  ]);
  assert.equal(r.slugs.get('gn:2'), 'hof-nl');
});

test('Kollision bleibt nach dem Kreis: erste PLZ, dann Ziffern der ID', () => {
  const r = loeseSlugs([
    ort({ id: 'gn:1', name: 'Hof', pop: 500, kreisSlug: 'alpha' }),
    ort({ id: 'gn:2', name: 'Hof', pop: 40, kreisSlug: 'beta', plz: ['11111'] }),
    ort({ id: 'gn:3', name: 'Hof', pop: 30, kreisSlug: 'beta', plz: ['22222'] }),
    ort({ id: 'gn:4', name: 'Hof', pop: 20, kreisSlug: 'beta', plz: [] }),
  ]);
  assert.equal(r.slugs.get('gn:2'), 'hof-beta');
  assert.equal(r.slugs.get('gn:3'), 'hof-beta-22222');
  assert.equal(r.slugs.get('gn:4'), 'hof-beta-4');
});

test('Register behält den alten Slug, solange er nicht kollidiert, ohne Weiterleitung', () => {
  const r = loeseSlugs([ort({ id: 'gn:9', name: 'Neu', pop: 5 })], { 'gn:9': 'alt' });
  assert.equal(r.slugs.get('gn:9'), 'alt');
  assert.deepEqual(r.weiterleitungen, []);
});

test('Register bei Kollision: der Ort mit größerer Einwohnerzahl behält den Pfad, keine Weiterleitung auf eine lebende Seite', () => {
  const r = loeseSlugs([
    ort({ id: 'gn:1', name: 'Hof', pop: 10, kreisSlug: 'alpha' }),
    ort({ id: 'gn:2', name: 'Hof', pop: 900, kreisSlug: 'beta' }),
  ], { 'gn:1': 'hof' });
  assert.equal(r.slugs.get('gn:2'), 'hof');
  assert.equal(r.slugs.get('gn:1'), 'hof-alpha');
  assert.deepEqual(r.weiterleitungen, []);
  assert.equal(r.register['gn:1'], 'hof-alpha');
  assert.equal(r.zaehlung.weiterleitungUebersprungen, 1);
});

test('Register ist anhängend: IDs ohne aktuellen Ort bleiben erhalten', () => {
  const r = loeseSlugs([], { 'gn:5': 'frueher' });
  assert.deepEqual(r.register, { 'gn:5': 'frueher' });
});
