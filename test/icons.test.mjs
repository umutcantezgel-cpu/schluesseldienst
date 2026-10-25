// Tests für den Icon-Geometrie-Linter: je Regel ein Fixture, das rot wird, und ein gutes Icon, das grün bleibt.
// Fixtures stehen als Zeichenketten im Test; es werden keine Dateien angelegt.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pruefe, pruefeIcon, befehle, bogenPunkte, winkelOk } from '../bau/pruefen/icons.mjs';
import { VERTRAG } from '../src/konfig/icon-vertrag.mjs';

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const KOPF = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">';
const svg = (innen, kopf = KOPF) => `${kopf}${innen}</svg>\n`;
const GUT = 'tuer'; // Name aus dem Vertrag

const regeln = (befunde, schwere = 'fehler') => befunde.filter((b) => b.schwere === schwere).map((b) => b.regel);

test('gutes Icon bleibt ohne Befund (Diagonale 45°, Punkt r=.75, Bogen innerhalb der Fläche)', () => {
  const gut = svg('<path d="M3 21h18M6 21V3h12v18M9 9l3-3 3 3M4 12a8 8 0 0 1 16 0"/><circle cx="12" cy="16" r=".75" fill="currentColor"/>');
  assert.deepEqual(pruefeIcon(GUT, gut), []);
});

test('datei: zusätzliches Attribut am svg, Name außerhalb des Vertrags, mehrere Zeilen → rot', () => {
  const mitClass = svg('<path d="M4 4h16"/>', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="x">');
  assert.deepEqual(regeln(pruefeIcon(GUT, mitClass)), ['icons/datei']);
  assert.deepEqual(regeln(pruefeIcon('unbekannt', svg('<path d="M4 4h16"/>'))), ['icons/datei']);
  assert.deepEqual(regeln(pruefeIcon(GUT, svg('<path d="M4 4h16"/>').replace('>', '>\n'))), ['icons/datei']);
});

test('element: fremde Elemente, Strich-Attribute und Füllung auf großem Kreis → rot', () => {
  assert.deepEqual(regeln(pruefeIcon(GUT, svg('<ellipse cx="12" cy="12" rx="4" ry="3"/>'))), ['icons/element']);
  assert.deepEqual(regeln(pruefeIcon(GUT, svg('<path d="M4 4h16" stroke="#000"/>'))), ['icons/element']);
  assert.deepEqual(regeln(pruefeIcon(GUT, svg('<circle cx="12" cy="12" r="2" fill="currentColor"/>'))), ['icons/element']);
});

test('bezier: C, S, Q, T und relative Formen → rot', () => {
  for (const d of ['M4 12C4 6 20 6 20 12', 'M4 12s4 6 8 0', 'M4 12Q12 4 20 12', 'M4 12T20 12', 'M4 12c0-6 16-6 16 0']) {
    assert.deepEqual(regeln(pruefeIcon(GUT, svg(`<path d="${d}"/>`))), ['icons/bezier'], d);
  }
});

test('flaeche: Linie und Kreis über 22 → rot; Punkt bei 2 ist erlaubt', () => {
  assert.deepEqual(regeln(pruefeIcon(GUT, svg('<path d="M1 12h22"/>'))), ['icons/flaeche']);
  assert.deepEqual(regeln(pruefeIcon(GUT, svg('<circle cx="12" cy="12" r="11"/>'))), ['icons/flaeche']);
  assert.deepEqual(regeln(pruefeIcon(GUT, svg('<path d="M2 12h20"/>'))), []);
});

test('flaeche: Bogenscheitel wird berechnet (M20.5 7a6 6 0 0 1 0 10 meldet außerhalb)', () => {
  assert.deepEqual(regeln(pruefeIcon(GUT, svg('<path d="M20.5 7a6 6 0 0 1 0 10"/>'))), ['icons/flaeche']);
  const apex = bogenPunkte(20.5, 7, 6, 6, 0, 0, 1, 20.5, 17);
  const maxX = Math.max(...apex.map(([x]) => x));
  assert.ok(Math.abs(maxX - (20.5 - Math.sqrt(11) + 6)) < 1e-6, `Scheitel bei ${maxX}`);
});

test('winkel: 30°-Linie und 30°-Polylinie → rot; 0°, 45°, 90° bleiben grün', () => {
  assert.deepEqual(regeln(pruefeIcon(GUT, svg('<path d="M4 4L12 9"/>'))), ['icons/winkel']);
  assert.deepEqual(regeln(pruefeIcon(GUT, svg('<polyline points="4,4 12,9 20,4"/>'))), ['icons/winkel', 'icons/winkel']);
  assert.deepEqual(regeln(pruefeIcon(GUT, svg('<path d="M4 4l8 8h8v8M4 20L20 4"/>'))), []);
  assert.equal(winkelOk(0, 0, 10, 10.005), true);
  assert.equal(winkelOk(0, 0, 10, 8), false);
});

test('bogen: rx ≠ ry, Radius 3,25 und Kreis-r 1,1 → rot; Radius 2 bleibt grün', () => {
  assert.deepEqual(regeln(pruefeIcon(GUT, svg('<path d="M4 12a8 4 0 0 1 16 0"/>'))), ['icons/bogen']);
  assert.deepEqual(regeln(pruefeIcon(GUT, svg('<path d="M4 8a3.25 3.25 0 0 1 0 6"/>'))), ['icons/bogen']);
  assert.deepEqual(regeln(pruefeIcon(GUT, svg('<circle cx="12" cy="12" r="1.1"/>'))), ['icons/bogen']);
  assert.deepEqual(regeln(pruefeIcon(GUT, svg('<path d="M4 8a2 2 0 0 1 4 0"/>'))), []);
});

test('raster: Stützkoordinate 4,1 → Warnung, keine Fehler', () => {
  const befunde = pruefeIcon(GUT, svg('<path d="M4.1 4h16"/>'));
  assert.deepEqual(regeln(befunde), []);
  assert.deepEqual(regeln(befunde, 'warnung'), ['icons/raster']);
});

test('groesse: Datei über 1.024 Byte → Warnung', () => {
  const lang = svg('<path d="' + 'M4 4h16 '.repeat(140) + '"/>');
  assert.ok(Buffer.byteLength(lang) > 1024);
  assert.deepEqual(regeln(pruefeIcon(GUT, lang), 'warnung'), ['icons/groesse']);
});

test('befehle: kompakte Bogen-Flags (a8 8 0 1116 0) werden einzeln gelesen', () => {
  assert.deepEqual(befehle('M4 12a8 8 0 1116 0'), [{ cmd: 'M', args: [4, 12] }, { cmd: 'a', args: [8, 8, 0, 1, 1, 16, 0] }]);
  assert.equal(befehle('M4 4 x'), null);
});

test('vollstaendig: fehlende Vertragsnamen → Sammel-Warnung (vorschau) bzw. Fehler (release)', async () => {
  const dateien = (await readdir(join(WURZEL, 'src/assets/icons'))).map((n) => n.replace(/\.svg$/, ''));
  const fehlend = VERTRAG.filter((n) => !dateien.includes(n));
  const vor = (await pruefe({ wurzel: WURZEL, modus: 'vorschau' })).filter((b) => b.regel === 'icons/vollstaendig');
  const rel = (await pruefe({ wurzel: WURZEL, modus: 'release' })).filter((b) => b.regel === 'icons/vollstaendig');
  if (fehlend.length === 0) {
    assert.equal(vor.length + rel.length, 0);
    return;
  }
  assert.equal(vor.length, 1);
  assert.equal(vor[0].schwere, 'warnung');
  for (const n of fehlend) assert.match(vor[0].meldung, new RegExp(`\\b${n}\\b`));
  assert.equal(rel.length, 1);
  assert.equal(rel[0].schwere, 'fehler');
});

test('alle vorhandenen Dateien werden eingelesen (info zählt jede Datei)', async () => {
  const anzahl = (await readdir(join(WURZEL, 'src/assets/icons'))).filter((n) => n.endsWith('.svg')).length;
  const befunde = await pruefe({ wurzel: WURZEL, modus: 'vorschau' });
  const info = befunde.filter((b) => b.schwere === 'info');
  assert.deepEqual(info.map((b) => b.meldung), [`${anzahl} Icons geprüft`]);
  assert.ok(anzahl >= 31, `erwartet mindestens 31 Icons, gefunden ${anzahl}`);
});
