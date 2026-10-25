// Tests für den Plagiatsprüfer: Fixture-Fingerabdruck aus erfundenen Absätzen, dazu der Plausibilitätstest
// "echte-daten" mit echtem Fingerabdruck. Den Rohabsatz aus den Wettbewerberdaten liest er zur Laufzeit
// über git show; er wird nie in diese Datei geschrieben.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { baueFingerabdruck, schindelHash, woerter } from '../pipeline/fingerabdruck.mjs';
import { pruefe, pruefeSeiten } from '../bau/pruefen/plagiat.mjs';

const ausfuehren = promisify(execFile);
const WURZEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const FIXTUREN = join(WURZEL, 'test/fixtures/plagiat');
const FINGERABDRUCK = join(WURZEL, 'bau/pruefen/fingerabdruck.json');

const quelleA = await readFile(join(FIXTUREN, 'quelle-a.md'), 'utf8');
const quelleB = await readFile(join(FIXTUREN, 'quelle-b.md'), 'utf8');
const fixtureFingerabdruck = baueFingerabdruck([quelleA, quelleB]);
const fixtureSatz = {
  schindeln: new Set(fixtureFingerabdruck.schindeln),
  haeufig: new Set(fixtureFingerabdruck.haeufig),
};

const ZWOELF = 'Wer abends vor einer verschlossenen Wohnungstür steht braucht schnell eine ruhige Lösung';
const ACHT = 'erfolgt am Vormittag in drei Schritten mit geprüftem';
const SECHS = 'Vormittag in drei Schritten mit geprüftem';

function seite(html, pfad = 'test/seite.html') {
  return { pfad, datei: 'seite.html', html, typ: 'test', indexierbar: false };
}

function befundeFuer(html) {
  return pruefeSeiten([seite(html)], fixtureSatz);
}

test('Fall 12 gleiche Wörter in Folge ergeben fehler', () => {
  const befunde = befundeFuer(`<main><p>${ZWOELF}</p></main>`);
  assert.equal(befunde.length, 1);
  assert.equal(befunde[0].schwere, 'fehler');
  assert.equal(befunde[0].regel, 'plagiat/lauf');
  assert.match(befunde[0].meldung, /12 Wörter in Folge/);
});

test('Fall 8 gleiche Wörter in Folge ergeben warnung', () => {
  const befunde = befundeFuer(`<main><p>${ACHT}</p></main>`);
  assert.equal(befunde.length, 1);
  assert.equal(befunde[0].schwere, 'warnung');
  assert.match(befunde[0].meldung, /8 Wörter in Folge/);
});

test('Fall 6 gleiche Wörter ergeben nichts', () => {
  assert.deepEqual(befundeFuer(`<main><p>${SECHS}</p></main>`), []);
});

test('Ortslisten mit Klasse az-liste oder nachbarorte werden ignoriert', () => {
  assert.deepEqual(
    befundeFuer(`<main><ul class="az-liste"><li>${ZWOELF}</li></ul><div class="nachbarorte"><p>${ZWOELF}</p></div></main>`),
    [],
  );
  // Gegenprobe: derselbe Text außerhalb der Ortsliste wird gemeldet
  assert.equal(befundeFuer(`<main><ul class="az-liste"><li>${ZWOELF}</li></ul><p>${ZWOELF}</p></main>`).length, 1);
});

test('Normalisierung: Groß/klein, Satzzeichen, Links, Inline-Tags und weiche Trennzeichen', () => {
  assert.deepEqual(
    woerter('**Die** [Montage](https://beispiel.example/x) erfolgt, am VORMITTAG!'),
    ['die', 'montage', 'erfolgt', 'am', 'vormittag'],
  );
  assert.deepEqual(woerter('![Bild](/a.jpg) Schlüsseldienst… Tür-Öffnung 24h'), ['schlüsseldienst', 'tür', 'öffnung', '24h']);
  assert.equal(schindelHash(woerter(ZWOELF).slice(0, 7)), schindelHash(woerter(ZWOELF.toUpperCase()).slice(0, 7)));
  const befunde = befundeFuer(
    '<main><p>WER abends, vor einer <a href="/x">verschlossenen</a> Wohnungs&shy;tür: steht braucht schnell eine ruhige Lösung!</p></main>',
  );
  assert.equal(befunde.length, 1);
  assert.equal(befunde[0].schwere, 'fehler');
});

test('ohne Fingerabdruck-Datei gibt es einen Befund, keinen Absturz', async () => {
  const befunde = await pruefe({ wurzel: join(WURZEL, 'test/fixtures/kein-ordner'), seiten: [] });
  assert.equal(befunde.length, 1);
  assert.equal(befunde[0].regel, 'plagiat/fingerabdruck-fehlt');
});

async function richterAbsatzWaehlen(schindeln, haeufig) {
  const liste = (await ausfuehren('git', ['-C', WURZEL, 'ls-tree', '-r', '-z', '--name-only', 'ad81157'],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })).stdout.split('\0');
  const ordner = 'Richter Schlüsseldienst/01a12b76-b326-7756-a303-8fa6e684874c 2/';
  for (const datei of liste.filter((p) => p.startsWith(ordner) && p.endsWith('.md')).sort()) {
    const text = (await ausfuehren('git', ['-C', WURZEL, 'show', `ad81157:${datei}`],
      { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })).stdout;
    for (const absatz of text.split(/\n\s*\n/)) {
      const worte = woerter(absatz);
      if (worte.length < 25) continue;
      const hashes = [];
      for (let i = 0; i + 7 <= worte.length; i++) hashes.push(schindelHash(worte.slice(i, i + 7)));
      if (hashes.every((h) => schindeln.has(h) && !haeufig.has(h))) return absatz;
    }
  }
  throw new Error('kein geeigneter Absatz gefunden');
}

const escape = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

test('echte-daten', { skip: existsSync(FINGERABDRUCK) ? false : 'bau/pruefen/fingerabdruck.json fehlt' }, async () => {
  const fp = JSON.parse(await readFile(FINGERABDRUCK, 'utf8'));
  const absatz = await richterAbsatzWaehlen(new Set(fp.schindeln), new Set(fp.haeufig));
  const kopie = await pruefe({
    wurzel: WURZEL,
    seiten: [{ pfad: 'test/echte-daten.html', datei: 'echte-daten.html', html: `<main><p>${escape(absatz)}</p></main>`, typ: 'test', indexierbar: false }],
  });
  assert.ok(kopie.some((b) => b.schwere === 'fehler'), 'Absatz aus einer Wettbewerberdatei muss fehler liefern');

  const eigen = 'Wenn die Wohnungstür ins Schloss gefallen ist, prüfen wir zuerst, ob sich die Tür ohne Schaden öffnen lässt. '
    + 'Danach besprechen wir mit Ihnen den nächsten Schritt.';
  const leer = await pruefe({
    wurzel: WURZEL,
    seiten: [{ pfad: 'test/eigen.html', datei: 'eigen.html', html: `<main><p>${eigen}</p></main>`, typ: 'test', indexierbar: false }],
  });
  assert.deepEqual(leer, []);
});
