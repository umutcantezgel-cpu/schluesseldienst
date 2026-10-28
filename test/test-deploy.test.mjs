// Test-Deploy der Vorschau (Netlify, Vercel): eigene Adresse statt 127.0.0.1, alle Sicherheits-Header, noindex.
// Ziel: ein Test-Deploy ist nie indexierbar, trägt dieselben Header wie ein Release und vercel.json veraltet nicht still.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, existsSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { headersDatei, vercelVorschau, vercelText, vercelPruefen, weiterleitungenLesen } from '../bau/lib/hosting.mjs';
import { kopfzeilen, CACHE } from '../src/konfig/sicherheit.mjs';

const WURZEL = fileURLToPath(new URL('..', import.meta.url));
const BAUEN = join(WURZEL, 'bau/bauen.mjs');
const ok = { von: '/alt-seite', nach: '/notoeffnung/' };

function bauen(extra) {
  const tmp = mkdtempSync(join(tmpdir(), 'test-deploy-'));
  const aus = join(tmp, 'aus');
  const r = spawnSync(process.execPath, [BAUEN, `--aus=${aus}`, '--still', ...extra], { encoding: 'utf8', timeout: 120000 });
  const lies = (p) => (existsSync(join(aus, p)) ? readFileSync(join(aus, p), 'utf8') : null);
  const ergebnis = { ...r, angelegt: existsSync(aus), lies };
  return { ergebnis, aufraeumen: () => rmSync(tmp, { recursive: true, force: true }) };
}

describe('headersDatei mit noindex (Test-Deploy)', () => {
  test('noindex steht nur mit Option im /*-Block', () => {
    const ohne = headersDatei()._headers;
    const mit = headersDatei([], { noindex: true })._headers;
    const block = (t) => t.slice(0, t.indexOf('\n/', 1));
    assert.doesNotMatch(block(ohne), /X-Robots-Tag/);
    assert.match(block(mit), /^  X-Robots-Tag: noindex$/m);
    for (const [name, wert] of Object.entries(kopfzeilen())) assert.ok(block(mit).includes(`  ${name}: ${wert}`), name);
  });
});

describe('vercel.json (Test-Deploy der Vorschau)', () => {
  test('alle Sicherheits-Header und noindex gelten für jede Adresse', () => {
    const [alle] = vercelVorschau().headers;
    assert.equal(alle.source, '/(.*)');
    const k = Object.fromEntries(alle.headers.map((h) => [h.key, h.value]));
    for (const [name, wert] of Object.entries(kopfzeilen())) assert.equal(k[name], wert, name);
    assert.equal(k['X-Robots-Tag'], 'noindex');
  });

  test('Cache-Regeln wie _headers, HTML ohne eigene Regel', () => {
    const regeln = vercelVorschau().headers.slice(1);
    const erwartet = CACHE.filter((c) => c.muster !== '/*');
    assert.deepEqual(regeln.map((r) => r.source), erwartet.map((c) => c.muster.replace(/\*/g, '(.*)')));
    const daten = regeln.find((r) => r.source === '/daten/(.*)');
    assert.deepEqual(daten.headers, [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }, { key: 'X-Robots-Tag', value: 'noindex' }]);
  });

  test('Bau nur dist/, Vorschau mit eigener Adresse; Weiterleitungen mit 301, Quelle mit „/“ (trailingSlash greift vorher)', () => {
    const v = vercelVorschau([ok]);
    assert.equal(v.outputDirectory, 'dist');
    assert.equal(v.framework, null);
    assert.equal(v.trailingSlash, true);
    assert.match(v.buildCommand, /^node bau\/bauen\.mjs --ziel=vercel --basis=https:\/\//);
    assert.doesNotMatch(v.buildCommand, /--release|--messen/);
    assert.deepEqual(v.redirects, [{ source: '/alt-seite/', destination: '/notoeffnung/', statusCode: 301 }]);
    assert.equal(vercelVorschau([{ von: '/alt/', nach: '/' }]).redirects[0].source, '/alt/');
  });

  test('das committete vercel.json ist aktuell (sonst: npm run hoster)', async () => {
    const ist = readFileSync(join(WURZEL, 'vercel.json'), 'utf8');
    assert.equal(ist, vercelText(await weiterleitungenLesen(WURZEL)));
  });

  test('Bau-Prüfung nach Inhalt: Formatierung, Schlüsselreihenfolge und git-Schlüssel egal, jede Header-Änderung und fremde Routen nicht', () => {
    const soll = vercelVorschau();
    assert.deepEqual(vercelPruefen(vercelText()), { fehler: null, fremd: [] });
    // ohne Einrückung und Zeilenende, Schlüssel umgekehrt, ohne $schema, mit einem harmlosen ergänzten Schlüssel
    const { $schema, ...rest } = soll;
    const umgestellt = Object.fromEntries(Object.entries({ ...rest, git: { deploymentEnabled: true } }).reverse());
    assert.deepEqual(vercelPruefen(JSON.stringify(umgestellt)), { fehler: null, fremd: ['git'] });
    // „routes“ greift vor den Header-Regeln (eine Route ohne „continue“ schaltet sie ab)
    assert.deepEqual(vercelPruefen(JSON.stringify({ ...soll, routes: [{ src: '/(.*)', dest: '/$1' }] })), { fehler: 'fremde Schlüssel routes (schreibt der Generator nicht)', fremd: ['routes'] });
    const alt = structuredClone(soll);
    alt.headers[0].headers[3].value = 'SAMEORIGIN';
    assert.equal(vercelPruefen(JSON.stringify(alt)).fehler, 'headers[0].headers[3].value: ist "SAMEORIGIN", soll "DENY"');
    // lange Werte: Ausschnitt ab der Abweichung statt gleicher Anfänge
    const pp = structuredClone(soll);
    pp.headers[0].headers[11].value = pp.headers[0].headers[11].value.replace(', xr-spatial-tracking=()', '');
    const [, istTeil, sollTeil] = vercelPruefen(JSON.stringify(pp)).fehler.match(/^headers\[0\]\.headers\[11\]\.value \(ab Zeichen \d+\): ist (.*), soll (.*)$/);
    assert.ok(istTeil !== sollTeil && sollTeil.includes('xr-spatial-tracking') && istTeil.startsWith('…'), `${istTeil} / ${sollTeil}`);
    assert.equal(vercelPruefen(JSON.stringify({ ...soll, headers: [{ ...soll.headers[0], constructor: 'x' }, ...soll.headers.slice(1)] })).fehler, 'headers[0].constructor: ist "x", soll fehlt');
    assert.match(vercelPruefen(JSON.stringify({ ...soll, headers: soll.headers.slice(1) })).fehler, /^headers\[0\]\.source: ist "\/assets\/\(\.\*\)", soll "\/\(\.\*\)"$/);
    assert.match(vercelPruefen(vercelText(), [ok]).fehler, /^redirects\[0\]: ist fehlt, soll \{"source":"\/alt-seite\/"/);
    assert.match(vercelPruefen('').fehler, /^kein gültiges JSON/);
    assert.equal(vercelPruefen('[]').fehler, 'kein JSON-Objekt');
  });

  test('netlify.toml baut die Vorschau mit Ziel netlify und liefert nur dist/ aus', () => {
    const toml = readFileSync(join(WURZEL, 'netlify.toml'), 'utf8');
    assert.match(toml, /^\s*command = "node bau\/bauen\.mjs --ziel=netlify --basis=\$URL"$/m);
    assert.match(toml, /^\s*publish = "dist"$/m);
    assert.doesNotMatch(toml, /--release|--messen/);
    // Netlifys Geheimnis-Scan: nur die Rohdaten-Ordner ausgenommen, nicht die eigenen Quellen
    const omit = toml.match(/^\s*SECRETS_SCAN_OMIT_PATHS = "(.*)"$/m)?.[1].split(',');
    assert.deepEqual(omit, ['Richter Schlüsseldienst/', 'Schlüsseldienst Adam/']);
  });
});

describe('Bau: --basis und --ziel in der Vorschau', () => {
  const abbruch = [
    ['--basis mit http', ['--basis=http://test.example']],
    ['--basis mit Pfad', ['--basis=https://test.example/pfad']],
    ['--basis im Messbau', ['--messen', '--basis=https://test.example']],
    ['--basis im Release', ['--release', '--ziel=netlify', '--basis=https://test.example']],
    ['Vorschau mit --ziel=apache', ['--ziel=apache']],
    ['Vorschau mit --ziel=nginx', ['--ziel=nginx']],
  ];
  for (const [name, extra] of abbruch) {
    test(`${name} bricht vor dem Schreiben ab`, () => {
      const { ergebnis: r, aufraeumen } = bauen(extra);
      aufraeumen();
      assert.equal(r.status, 2, r.stderr);
      assert.equal(r.angelegt, false);
    });
  }

  test('Netlify: _headers mit noindex, Canonical auf die Test-Adresse, robots gesperrt', () => {
    const { ergebnis: r, aufraeumen } = bauen(['--ziel=netlify', '--basis=https://test.example', '--nur=/impressum/']);
    try {
      assert.equal(r.status, 0, r.stderr);
      const headers = r.lies('_headers');
      assert.ok(headers?.startsWith('/*\n'));
      assert.match(headers, /^  X-Robots-Tag: noindex$/m);
      assert.match(headers, /^  Content-Security-Policy: default-src 'none'/m);
      assert.match(r.lies('impressum/index.html'), /<link rel="canonical" href="https:\/\/test\.example\/impressum\/">/);
      assert.match(r.lies('impressum/index.html'), /<meta name="robots" content="noindex/);
      assert.match(r.lies('robots.txt'), /^Disallow: \/$/m);
      assert.doesNotMatch(r.lies('robots.txt'), /127\.0\.0\.1/);
    } finally { aufraeumen(); }
  });

  test('Vercel: prüft vercel.json und legt keine Hoster-Datei nach dist/', () => {
    const { ergebnis: r, aufraeumen } = bauen(['--ziel=vercel', '--basis=https://test.example', '--nur=/impressum/']);
    try {
      assert.equal(r.status, 0, r.stderr);
      assert.doesNotMatch(r.stderr, /vercel\.json/);
      assert.equal(r.lies('_headers'), null);
      assert.equal(r.lies('vercel.json'), null);
      assert.match(r.lies('impressum/index.html'), /href="https:\/\/test\.example\/impressum\/"/);
    } finally { aufraeumen(); }
  });
});
