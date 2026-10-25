import { test } from 'node:test';
import assert from 'node:assert/strict';
import { schluessel, kern, suchVarianten } from '../src/assets/js/logik/normalisieren.mjs';

test('schluessel: Ortsname mit „im“ bleibt als Wort erhalten', () => {
  assert.equal(schluessel('Höchst im Odenwald'), 'hoechst-im-odenwald');
});

test('schluessel: Abkürzung „i.“ und ausgeschriebenes „im“ ergeben denselben Schlüssel', () => {
  assert.equal(schluessel('Aura i.Sinngrund'), schluessel('Aura im Sinngrund'));
  assert.equal(schluessel('Aura i.Sinngrund'), 'aura-im-sinngrund');
});

test('schluessel: Leerzeichen und Bindestrich ergeben denselben Schlüssel', () => {
  assert.equal(schluessel('Ober Ramstadt'), schluessel('Ober-Ramstadt'));
  assert.equal(schluessel('Ober-Ramstadt'), 'ober-ramstadt');
});

test('schluessel: „v.d.Höhe“ wird zu „vor der hoehe“', () => {
  assert.equal(schluessel('Bad Homburg v.d.Höhe'), 'bad-homburg-vor-der-hoehe');
  assert.equal(schluessel('Bad Homburg v. d. H.'), 'bad-homburg-vor-der-hoehe');
});

test('schluessel: „St.“ wird zu „sankt“', () => {
  assert.equal(schluessel('St. Leon-Rot'), 'sankt-leon-rot');
});

test('schluessel: Umlaut mit Trema und Akzente werden entfernt', () => {
  assert.equal(schluessel('Mariënburg'), 'marienburg');
  assert.equal(schluessel('Café Crème'), 'cafe-creme');
});

test('schluessel: Eszett und großes Eszett werden zu ss', () => {
  assert.equal(schluessel('Straße'), 'strasse');
  assert.equal(schluessel('STRAẞE'), 'strasse');
});

test('schluessel: Umlaute werden ae, oe, ue', () => {
  assert.equal(schluessel('Fürth'), 'fuerth');
  assert.equal(schluessel('Öhringen'), 'oehringen');
});

test('kern: Klammerzusatz wird entfernt', () => {
  assert.equal(kern('Fürth (Hessen)'), 'fuerth');
});

test('kern: alles ab Komma wird entfernt', () => {
  assert.equal(kern('Heppdiel, Eichenbühl'), 'heppdiel');
});

test('kern: Zusatz „im …“ wird entfernt', () => {
  assert.equal(kern('Aura im Sinngrund'), 'aura');
});

test('kern: alles ab Schrägstrich wird entfernt', () => {
  assert.equal(kern('Ober-Ramstadt/Dieburg'), 'ober-ramstadt');
});

test('suchVarianten: Umlaut-e und Variante ohne Umlaut-e, dedupliziert', () => {
  const v = suchVarianten('Mücke');
  assert.ok(v.includes('muecke'));
  assert.ok(v.includes('mucke'));
  assert.equal(new Set(v).size, v.length);
});

test('suchVarianten: ohne Umlaut nur ein Eintrag', () => {
  assert.deepEqual(suchVarianten('Weilburg'), ['weilburg']);
});
