// Tests für den Token-Prüfer: Fixture-CSS mit erlaubten und verbotenen Werten, Vorlagen-Zeichenketten und
// ein kleiner Quellbaum, in dem token.css und schriften.css ausgenommen sind.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pruefe, pruefeCss, pruefeVorlage } from '../bau/pruefen/token.mjs';

const FIXTUREN = join(dirname(fileURLToPath(import.meta.url)), 'fixtures/token');
const lies = (rel) => readFile(join(FIXTUREN, rel), 'utf8');
// Regel, Schwere und Zeile je Befund (Zeile = Teil nach dem letzten Doppelpunkt)
const kurz = (befunde) => befunde.map((b) => [b.regel, b.schwere, Number(b.datei.split(':').pop())]);

test('erlaubte Werte ergeben keine Befunde', async () => {
  assert.deepEqual(pruefeCss(await lies('erlaubt.css'), 'erlaubt.css'), []);
});

test('verbotene Werte: Regel, Schwere und Zeile je Fund; Kommentare bleiben ohne Befund', async () => {
  const befunde = pruefeCss(await lies('verboten.css'), 'verboten.css');
  assert.deepEqual(kurz(befunde), [
    ['token/farbe', 'fehler', 2],
    ['token/zeit', 'fehler', 3],
    ['token/laenge', 'fehler', 4],
    ['token/farbe', 'fehler', 5],
    ['token/laenge', 'fehler', 6],
    ['token/laenge', 'fehler', 7],
    ['token/kurve', 'fehler', 8],
    ['token/schrift', 'fehler', 9],
    ['token/farbe', 'fehler', 10],
    ['token/zeit', 'fehler', 11],
    ['token/laenge', 'fehler', 12],
    ['token/neue-variable', 'warnung', 13],
    ['token/breakpoint', 'warnung', 14],
  ]);
  assert.equal(befunde[0].datei, 'verboten.css:2');
  assert.match(befunde[0].meldung, /#fff/);
});

test('Quellbaum: token.css und schriften.css sind ausgenommen, Befund trägt Datei:Zeile', async () => {
  const befunde = await pruefe({ wurzel: join(FIXTUREN, 'wurzel') });
  assert.deepEqual(befunde.map((b) => [b.regel, b.schwere, b.datei]), [
    ['token/farbe', 'fehler', 'src/assets/css/komponenten/beispiel.css:3'],
  ]);
});

test('Vorlagen: style-Attribut und Hex-Farbe sind Fehler; Kommentare und Code nicht', () => {
  const quelle = [
    'export const v = html`<div style="color: red">`;',
    "const farbe = '#A84A22';",
    '// Kommentar mit #fff',
    "const style = 'x';",
    'class A { #abc = 1; }',
  ].join('\n');
  assert.deepEqual(kurz(pruefeVorlage(quelle, 'src/vorlagen/beispiel.mjs')), [
    ['token/inline-style', 'fehler', 1],
    ['token/farbe', 'fehler', 2],
  ]);
});
