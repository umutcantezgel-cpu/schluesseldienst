// Menü-Blatt (mobil): Die Leistungsseiten je Gruppe übernimmt menue.mjs beim Öffnen aus der Desktop-Navigation.
// Dieser Test sichert den Vertrag dafür im gebauten HTML und hält das Blatt selbst schlank (Budget der Ortsseiten).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GRUPPEN } from '../src/konfig/leistungen.mjs';

const BAUEN = fileURLToPath(new URL('../bau/bauen.mjs', import.meta.url));

function seite() {
  const tmp = mkdtempSync(join(tmpdir(), 'menue-blatt-'));
  try {
    const r = spawnSync(process.execPath, [BAUEN, `--aus=${join(tmp, 'aus')}`, '--still', '--nur=/impressum/'], { encoding: 'utf8', timeout: 120000 });
    assert.equal(r.status, 0, r.stderr);
    return readFileSync(join(tmp, 'aus/impressum/index.html'), 'utf8');
  } finally { rmSync(tmp, { recursive: true, force: true }); }
}

const s = seite();
const ausschnitt = (a, b) => { const i = s.indexOf(a); const j = s.indexOf(b, i); assert.ok(i >= 0 && j > i, a); return s.slice(i, j); };
const panel = ausschnitt('<div class="hauptnav-panel" id="untermenue-leistungen">', '</nav>');
const blatt = ausschnitt('<dialog class="menue-blatt"', '</dialog>');
const hrefs = (t) => [...t.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);

test('Desktop-Navigation: jede Gruppe mit Titel-Link und direkt folgender Liste genau ihrer Leistungsseiten', () => {
  for (const g of GRUPPEN) {
    const m = panel.match(new RegExp(`<a class="hauptnav-gruppe-titel" href="${g.pfad}">[^<]*</a>\\s*<ul>(.*?)</ul>`, 's'));
    assert.ok(m, `Gruppe ${g.pfad} ohne direkt folgende <ul>`);
    assert.deepEqual(hrefs(m[1]), g.leistungen.map((l) => l.pfad), g.pfad);
  }
});

test('Menü-Blatt: jede Gruppe als Link ohne statische Unterliste (die übernimmt menue.mjs)', () => {
  for (const g of GRUPPEN) assert.match(blatt, new RegExp(`<li><a href="${g.pfad}">[^<]*</a></li>`), g.pfad);
  const kinder = GRUPPEN.flatMap((g) => g.leistungen.map((l) => l.pfad));
  assert.deepEqual(hrefs(blatt).filter((h) => kinder.includes(h)), []);
});

test('menue.mjs erwartet genau diese Selektoren', () => {
  const js = readFileSync(fileURLToPath(new URL('../src/assets/js/module/menue.mjs', import.meta.url)), 'utf8');
  assert.match(js, /#untermenue-leistungen \.hauptnav-gruppe-titel/);
  assert.match(js, /\.hauptnav-aufklapper svg/);
  assert.match(s, /<button class="hauptnav-aufklapper"[^>]*>.*?<svg /s);
});
