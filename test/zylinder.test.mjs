import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zylinderSchnitt } from '../src/vorlagen/teile/illustrationen/zylinder.mjs';

const federn = (svg) => [...String(svg).matchAll(/class="zy-feder" d="([^"]+)"/g)].map((m) => m[1]);
const ywerte = (d) => [...d.matchAll(/[ML]-?[\d.]+ (-?[\d.]+)/g)].map((m) => Number(m[1]));

test('Falscher Schlüssel (404, M-21): jede Feder bleibt im Kanal zwischen Gehäusekante und Scherlinie', () => {
  const svg = zylinderSchnitt({ praefix: 't', falsch: true });
  const f = federn(svg);
  assert.equal(f.length, 5);
  for (const d of f) for (const y of ywerte(d)) assert.ok(y >= 48 && y <= 120, `Feder ragt heraus: y ${y} in ${d}`);
  assert.match(String(svg), /translate\(0 -?\d+\)/); // Stifte versetzt, kein Stift trifft die Linie
});

test('Grundzustand (Hero M-16): Federn 56–88, Stiftpaare ohne Versatz', () => {
  const svg = String(zylinderSchnitt({ praefix: 'h' }));
  for (const d of federn(svg)) { const y = ywerte(d); assert.equal(Math.min(...y), 56); assert.equal(Math.max(...y), 88); }
  assert.doesNotMatch(svg, /translate\(0 /);
});
