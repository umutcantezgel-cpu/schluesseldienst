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

test('Druck- und Kontrastregeln im gemeinsamen Bündel verdecken einen fehlenden Ansichts-Stil nicht', async () => {
  const app = '.knopf{color:red}@layer hilfen{@media print{.preis-band{border:0}.x{color:#000}}}@media (forced-colors:active){.preis-band{color:CanvasText}}';
  const b = await lauf({ ...GRUND, 'assets/app.css': app, 'start/index.html': seite([], 'preis-band') });
  const f = b.filter((x) => x.regel === 'budgets/stil-fehlt');
  assert.equal(f.length, 1);
  assert.match(f[0].meldung, /\.preis-band/);
});

test('ohneSonderMedien: entfernt nur Druck- und forced-colors-Blöcke, verschachtelt', async () => {
  const { ohneSonderMedien } = await import('../bau/pruefen/budgets.mjs');
  assert.equal(ohneSonderMedien('.a{x:1}@media print{.b{y:2}@supports (z:1){.c{z:1}}}.d{w:1}'), '.a{x:1}.d{w:1}');
  assert.equal(ohneSonderMedien('@media (min-width:48em){.e{v:1}}@media (forced-colors: active){.f{u:1}}'), '@media (min-width:48em){.e{v:1}}');
});

test('Druckstile (media="print") zählen nicht zur Summe je Seite, haben aber ein eigenes Budget (D-CSS-02)', async () => {
  const { createHash } = await import('node:crypto');
  // schlecht komprimierbarer Inhalt: Kette von SHA-256-Werten
  const rauschen = (n) => Array.from({ length: n }, (_, i) => createHash('sha256').update(String(i)).digest('hex')).join('');
  const mitDruck = (stile, klassen) => seite(stile, klassen).replace('</head>', '<link rel="stylesheet" href="/assets/druck.css" media="print"></head>');
  // Bildschirm-Stile 12 KB gz, Druckstile 2,5 KB gz: einzeln im Budget, zusammen darüber – kein Befund
  const app = `.knopf{content:"${rauschen(350)}"}`;
  const druckKlein = `@media print{.kopf{content:"${rauschen(75)}"}}`;
  const b1 = await lauf({ ...GRUND, 'assets/app.css': app, 'assets/druck.css': druckKlein, 'preise/index.html': mitDruck(['preise'], 'knopf') });
  assert.deepEqual(b1.filter((x) => x.schwere === 'fehler').map((x) => x.regel), []);
  // Druckstile über ihrem Budget: Fehler budgets/css-druck
  const druckGross = `@media print{.b{content:"${rauschen(100)}"}}`;
  const b2 = await lauf({ ...GRUND, 'assets/druck.css': druckGross, 'preise/index.html': mitDruck(['preise'], 'knopf') });
  assert.deepEqual(b2.filter((x) => x.schwere === 'fehler').map((x) => x.regel), ['budgets/css-druck']);
});
