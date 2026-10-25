import { test } from 'node:test';
import assert from 'node:assert/strict';
import { trennstellen, textTrennen, ueberschriftenTrennen } from '../bau/lib/trennen.mjs';
import { TRENNSTELLEN } from '../src/inhalte/trennstellen.mjs';

test('Komposita brechen nur an den Fugen der Wortliste', () => {
  assert.equal(textTrennen('Seriösen Schlüsseldienst erkennen'), 'Seriösen Schlüssel&shy;dienst erkennen');
  assert.equal(textTrennen('Rauchmelderpflicht'), 'Rauch&shy;melder&shy;pflicht');
  assert.equal(textTrennen('Datensicherungsschränke'), 'Daten&shy;sicherungs&shy;schränke');
  assert.equal(textTrennen('Schlüsseldienstes'), 'Schlüssel&shy;dienstes');
});

test('Kreisnamen brechen vor „kreis“, kurze Wörter und Eigennamen bleiben ganz', () => {
  assert.equal(textTrennen('Westerwaldkreis'), 'Westerwald&shy;kreis');
  assert.equal(textTrennen('Landkreis'), 'Landkreis'); // unter 10 Buchstaben
  assert.equal(textTrennen('Mengerskirchen'), 'Mengerskirchen');
  assert.deepEqual(trennstellen('Notöffnung'), [3]);
});

test('Nur Text zwischen h1–h4, Tags, Attribute und Entitäten bleiben unberührt', () => {
  const ein = '<h2 id="a" title="Schlüsseldienst"><span class="x">Schlüsseldienst</span> &amp; Einbruchschutz</h2><p>Schlüsseldienst</p>';
  assert.equal(ueberschriftenTrennen(ein),
    '<h2 id="a" title="Schlüsseldienst"><span class="x">Schlüssel&shy;dienst</span> &amp; Einbruch&shy;schutz</h2><p>Schlüsseldienst</p>');
});

test('Wortliste: Kleinbuchstaben, mindestens eine Fuge, keine Doppel', () => {
  const gesehen = new Set();
  for (const e of TRENNSTELLEN) {
    assert.match(e, /^[a-zäöüß]+(\|[a-zäöüß]+)+$/, e);
    assert.ok(!gesehen.has(e), `doppelt: ${e}`);
    gesehen.add(e);
  }
});
