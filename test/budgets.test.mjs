// Tests für den Budget-Prüfer, Teil CSS je Seite: Summe aus gemeinsamem Bündel und Ansichts-Stilen sowie
// Klassen, deren Regeln nur in einem Ansichts-Stil stehen, den die Seite nicht lädt. Kleiner Ausgabeordner im Temp.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pruefe } from '../bau/pruefen/budgets.mjs';

const seite = (stile, klassen) => `<!doctype html><html><head><link rel="stylesheet" href="/assets/app.css">${stile.map((s) => `<link rel="stylesheet" href="/assets/${s}.css">`).join('')}</head><body><main class="${klassen}"></main></body></html>`;

async function lauf(dateien, extra = {}) {
  const dist = await mkdtemp(join(tmpdir(), 'budgets-'));
  try {
    for (const [pfad, inhalt] of Object.entries(dateien)) {
      await mkdir(join(dist, pfad, '..'), { recursive: true });
      await writeFile(join(dist, pfad), inhalt);
    }
    const seiten = Object.keys(dateien).filter((p) => p.endsWith('.html')).map((p) => ({ datei: `/${p}` }));
    return await pruefe({
      dist,
      seiten,
      dateien: Object.keys(dateien).map((p) => `/${p}`),
      assets: { css: { pfad: '/assets/app.css' }, js: { pfad: '/assets/app.js' }, ansichten: { preise: { pfad: '/assets/preise.css' } } },
      ...extra,
    });
  } finally {
    await rm(dist, { recursive: true, force: true });
  }
}

const GRUND = {
  'assets/app.css': '.knopf{color:red}',
  'assets/app.js': 'void 0;',
  'assets/preise.css': '.preis-band{color:blue}.knopf{color:green}',
};

test('Seite mit geladenem Ansichts-Stil: kein Befund', async () => {
  const b = await lauf({ ...GRUND, 'preise/index.html': seite(['preise'], 'preis-band knopf') });
  assert.equal(b.filter((x) => x.schwere === 'fehler').length, 0);
});

test('Klasse nur im Ansichts-Stil, Seite lädt ihn nicht: Fehler budgets/stil-fehlt', async () => {
  const b = await lauf({ ...GRUND, 'start/index.html': seite([], 'preis-band') });
  const f = b.filter((x) => x.regel === 'budgets/stil-fehlt');
  assert.equal(f.length, 1);
  assert.match(f[0].meldung, /\.preis-band/);
});

test('Klasse auch im gemeinsamen Bündel: kein Befund, obwohl der Ansichts-Stil fehlt', async () => {
  const b = await lauf({ ...GRUND, 'start/index.html': seite([], 'knopf') });
  assert.equal(b.filter((x) => x.regel === 'budgets/stil-fehlt').length, 0);
});

test('CSS je Seite über der Grenze: Fehler budgets/css-seite', async () => {
  // zufallsarmer, aber schlecht komprimierbarer Inhalt (> 14 KB gz)
  let gross = '';
  let x = 7;
  for (let i = 0; i < 9000; i += 1) { x = (x * 48271) % 2147483647; gross += `.k${x.toString(36)}{color:#${(x % 4096).toString(16).padStart(3, '0')}}`; }
  const b = await lauf({ ...GRUND, 'assets/preise.css': gross, 'preise/index.html': seite(['preise'], 'knopf') });
  assert.equal(b.filter((x) => x.regel === 'budgets/css-seite').length, 1);
});
