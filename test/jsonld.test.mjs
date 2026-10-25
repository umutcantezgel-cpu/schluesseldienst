// Tests für den JSON-LD-Prüfer: eine gültige Seite ohne Befund, dazu je ein Fixture pro Regel.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pruefe } from '../bau/pruefen/jsonld.mjs';

const FIXTUREN = join(dirname(fileURLToPath(import.meta.url)), 'fixtures/jsonld');
const BASIS = 'https://schluesseldienst.example';
const ROUTEN = ['/', '/kontakt/', '/ueber-uns/', '/preise/', '/schluesseldienst-weilburg/'];

/** Prüft die Seite `pfad` mit dem Fixture `fixture`; alle übrigen Routen sind leere Seiten. */
async function pruefeSeite(pfad, fixture, modus = 'release') {
  const seiten = [];
  for (const r of ROUTEN) {
    const html = r === pfad ? await readFile(join(FIXTUREN, fixture), 'utf8') : '<!doctype html><title>Ziel</title>';
    seiten.push({ pfad: r, datei: `${r}index.html`, html, typ: 'test', indexierbar: true });
  }
  return pruefe({ wurzel: '', dist: '', modus, basisUrl: BASIS, seiten, dateien: [], konfig: {}, assets: {}, daten: {} });
}

const regeln = (befunde) => befunde.map((b) => [b.regel, b.schwere]);

test('gültige Seite mit Locksmith, Brotkrumen, Preis und FAQ hat keinen Befund', async () => {
  assert.deepEqual(await pruefeSeite('/', 'gueltig.html'), []);
});

test('aggregateRating und review (Schlüssel und @type) sind Fehler', async () => {
  const befunde = await pruefeSeite('/', 'bewertung.html');
  assert.deepEqual(regeln(befunde), [
    ['jsonld/bewertung', 'fehler'],
    ['jsonld/bewertung', 'fehler'],
    ['jsonld/bewertung', 'fehler'],
  ]);
  assert.equal(befunde[0].datei, '/index.html');
});

test('Brotkrumen-Lücke (Position 3 statt 2) ist ein Fehler', async () => {
  const befunde = await pruefeSeite('/kontakt/', 'brotkrumen-luecke.html');
  assert.deepEqual(regeln(befunde), [['jsonld/brotkrumen', 'fehler']]);
  assert.match(befunde[0].meldung, /position 3 an Stelle 2/);
});

test('Locksmith auf einer Ortsseite ist ein Fehler, auf /kontakt/ nicht', async () => {
  assert.deepEqual(regeln(await pruefeSeite('/schluesseldienst-weilburg/', 'ortsseite-locksmith.html')), [
    ['jsonld/betrieb-je-ort', 'fehler'],
  ]);
  assert.deepEqual(await pruefeSeite('/kontakt/', 'ortsseite-locksmith.html'), []);
});

test('Offer ohne Zahl im price-Feld ist ein Fehler', async () => {
  assert.deepEqual(regeln(await pruefeSeite('/preise/', 'offer-ohne-zahl.html')), [['jsonld/angebot', 'fehler']]);
});

test('Platzhaltertext ist im Release ein Fehler und sonst eine Information', async () => {
  assert.deepEqual(regeln(await pruefeSeite('/', 'platzhalter.html', 'release')), [['jsonld/platzhalter', 'fehler']]);
  assert.deepEqual(regeln(await pruefeSeite('/', 'platzhalter.html', 'messen')), [['jsonld/platzhalter', 'info']]);
});

test('JSON-Syntaxfehler ist ein Fehler', async () => {
  assert.deepEqual(regeln(await pruefeSeite('/', 'syntax.html')), [['jsonld/syntax', 'fehler']]);
});
