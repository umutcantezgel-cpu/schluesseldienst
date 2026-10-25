// Karriere (V09): ohne konfigurierte Stellen keine Seite; mit einer Stelle genau eine Seite /karriere/ mit Titel und
// Aufgaben; JSON-LD je Stelle als JobPosting ohne Gehalt. Die Stelle ist ein Fixture dieses Tests, nie Konfiguration.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { seiten } from '../src/vorlagen/seiten/karriere.mjs';
import betrieb from '../src/konfig/betrieb.mjs';
import * as leistungen from '../src/konfig/leistungen.mjs';

const BASIS = 'http://127.0.0.1:4173';
const FIXTURE = {
  id: 'fixture-monteur', titel: 'Fixture-Monteur', umfang: 'Teilzeit', ort: 'Fixture-Ort',
  aufgaben: ['Fixture-Aufgabe eins', 'Fixture-Aufgabe zwei'], anforderungen: ['Fixture-Anforderung'],
};
const kontext = (stellen) => ({ basisUrl: BASIS, konfig: { betrieb: { ...betrieb, email: 'bewerbung@beispiel.de', stellen }, leistungen } });
// Einfacher sk-Stub: nur, was der Inhalt braucht (Konfiguration, Icons als leere Zeichenkette)
const sk = (stellen) => ({ ...kontext(stellen), icon: () => '' });

test('ohne konfigurierte Stellen entsteht keine Karriere-Seite', () => {
  assert.deepEqual(seiten({ basisUrl: BASIS, konfig: { betrieb, leistungen } }), []);
  assert.deepEqual(seiten(kontext([])), []);
});

test('mit einer Stelle genau eine Seite /karriere/, deren HTML Titel und Aufgaben enthält', () => {
  const liste = seiten(kontext([FIXTURE]));
  assert.equal(liste.length, 1);
  assert.equal(liste[0].pfad, '/karriere/');
  const html = String(liste[0].inhalt(sk([FIXTURE])));
  assert.match(html, /Fixture-Monteur/);
  assert.match(html, /<li>Fixture-Aufgabe eins<\/li>/);
  assert.match(html, /<li>Fixture-Aufgabe zwei<\/li>/);
  assert.match(html, /mailto:bewerbung@beispiel\.de/);
});

test('JSON-LD je Stelle: JobPosting ohne Gehalt', () => {
  const [seite] = seiten(kontext([FIXTURE]));
  const stellen = seite.jsonld.filter((o) => o['@type'] === 'JobPosting');
  assert.equal(stellen.length, 1);
  assert.equal(stellen[0]['@type'], 'JobPosting');
  assert.equal('baseSalary' in stellen[0], false);
  assert.equal(JSON.stringify(seite.jsonld).includes('baseSalary'), false);
});
