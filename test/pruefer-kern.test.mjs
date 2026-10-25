// Negativ- und Positivtests für die Kern-Prüfer (Sicherheit, SEO, Links): bewusst fehlerhafte
// Seiten müssen rot werden, eine saubere Seite grün.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import * as sicherheit from '../bau/pruefen/sicherheit.mjs';
import * as seo from '../bau/pruefen/seo.mjs';
import * as links from '../bau/pruefen/links.mjs';
import { cspText } from '../src/konfig/sicherheit.mjs';

const WURZEL = new URL('..', import.meta.url).pathname;
const DIST = join(WURZEL, '.cache/test-pruefer-dist');
const css = 'body{margin:0}';
const sri = 'sha384-' + createHash('sha384').update(css).digest('base64');
const meta = cspText({ meta: true }).replace(/'/g, '&#39;');
const seite = (pfad, main, extraKopf = '') => `<!doctype html>
<html lang="de" dir="ltr">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="${meta}">
<title>Titel ${pfad}</title>
<meta name="description" content="Eine ausreichend lange Beschreibung für die Seite ${pfad}, damit die Längenprüfung zufrieden ist.">
<link rel="canonical" href="http://127.0.0.1:4173${pfad}">
<meta name="robots" content="index, follow">
<link rel="stylesheet" href="/a.css" integrity="${sri}">
${extraKopf}</head>
<body><main id="inhalt"><h1>Überschrift</h1>${main}</main></body>
</html>
`;
const ctxMit = async (seiten) => {
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });
  await writeFile(join(DIST, 'a.css'), css);
  const dateien = ['/a.css'];
  for (const s of seiten) { await mkdir(join(DIST, s.pfad), { recursive: true }); await writeFile(join(DIST, s.pfad, 'index.html'), s.html); dateien.push(s.pfad + 'index.html'); }
  return {
    wurzel: WURZEL, dist: DIST, modus: 'messen', basisUrl: 'http://127.0.0.1:4173', dateien,
    seiten: seiten.map((s) => ({ ...s, datei: s.pfad + 'index.html', indexierbar: true })),
    konfig: { betrieb: { email: 'info@example.org' }, quellen: { hosts: ['www.geonames.org'] }, seo: { titelMax: 60, beschreibungMin: 70, beschreibungMax: 155 } },
  };
};
const regeln = (befunde) => befunde.filter((b) => b.schwere === 'fehler').map((b) => b.regel);

test('saubere Seiten: Sicherheit, SEO und Links grün', async () => {
  const ctx = await ctxMit([
    { pfad: '/', html: seite('/', '<p><a href="/b/">B</a> <a href="https://www.geonames.org/" rel="noopener noreferrer">GeoNames</a></p>') },
    { pfad: '/b/', html: seite('/b/', '<p><a href="/">Start</a></p>') },
  ]);
  assert.deepEqual(regeln(await sicherheit.pruefe(ctx)), []);
  assert.deepEqual(regeln(await seo.pruefe(ctx)), []);
  assert.deepEqual(regeln(await links.pruefe(ctx)), []);
});

test('Sicherheit: Inline-Skript, on*-Attribut, style, iframe, javascript:, fremde Ressource, Kommentar → rot', async () => {
  const boese = '<script>alert(1)</script><img src="https://evil.example/x.png" alt="" onerror="x()"><p style="color:red">x</p><iframe src="/x"></iframe><a href="javascript:alert(1)">x</a><!-- k --><a href="https://evil.example/">e</a>';
  const ctx = await ctxMit([{ pfad: '/', html: seite('/', boese) }]);
  const r = regeln(await sicherheit.pruefe(ctx));
  for (const erwartet of ['S01-inline-skript', 'S03-ereignis-attribut', 'S04-style-attribut', 'S07-einbettung', 'S05-gefaehrliches-schema', 'S06-fremde-ressource', 'S13-kommentar', 'S06-externer-link']) {
    assert.ok(r.includes(`sicherheit/${erwartet}`), `${erwartet} nicht erkannt`);
  }
});

test('Sicherheit: falsches SRI und abweichende Meta-CSP → rot', async () => {
  const html = seite('/', '<p>x</p>').replace(sri, 'sha384-falsch').replace("default-src &#39;none&#39;", 'default-src *');
  const ctx = await ctxMit([{ pfad: '/', html }]);
  const r = regeln(await sicherheit.pruefe(ctx));
  assert.ok(r.includes('sicherheit/S02-sri'));
  assert.ok(r.includes('sicherheit/S08-meta-csp'));
});

test('SEO: doppelter Titel, zwei H1, Überschriftensprung → rot', async () => {
  const a = seite('/', '<h1>Zweite</h1><h4>Sprung</h4>');
  const b = seite('/b/', '<p>x</p>').replace('Titel /b/', 'Titel /');
  const ctx = await ctxMit([{ pfad: '/', html: a }, { pfad: '/b/', html: b }]);
  const r = regeln(await seo.pruefe(ctx));
  assert.ok(r.includes('seo/h1-anzahl'));
  assert.ok(r.includes('seo/ueberschrift-sprung'));
  assert.ok(r.includes('seo/titel-doppelt'));
});

test('Links: fehlendes Ziel, fehlender Anker, Waise → rot', async () => {
  const ctx = await ctxMit([
    { pfad: '/', html: seite('/', '<p><a href="/gibtsnicht/">x</a> <a href="#fehlt">y</a></p>') },
    { pfad: '/waise/', html: seite('/waise/', '<p>allein</p>') },
  ]);
  const r = regeln(await links.pruefe(ctx));
  assert.ok(r.includes('links/ziel-fehlt'));
  assert.ok(r.includes('links/anker'));
  assert.ok(r.includes('links/waise'));
});

test('S20-navigation: eigene Pfade und mailto: als Literal erlaubt, alles andere nicht', () => {
  const ok = ["location.href = '/preise/'", 'location.href = `mailto:${a}`', 'location.assign(`/schluesseldienst-${s}/`)', "location.replace('/x')"];
  const fremd = ['location.href = url', "location.href = 'https://x.de'", "location.href = '//boese.de'", 'location.replace( ziel )', 'location.assign(`${basis}/x`)'];
  for (const js of ok) assert.equal(sicherheit.navigationFremd(js), false, js);
  for (const js of fremd) assert.equal(sicherheit.navigationFremd(js), true, js);
});

test('SEO: Titel > 60 bei Ortsseiten nur Warnung, auch im Release; andere Seiten bleiben im Release Fehler (D-SEO-04)', async () => {
  const { auswerten, RELEASE_STRENG } = await import('../bau/pruefen/index.mjs');
  const lang = 'Schlüsseldienst Sulzbach (Regionalverband Saarbrücken), 158 km ab Weilburg';
  const mit = (pfad) => seite(pfad, '<p>x</p>').replace(/<title>[^<]*<\/title>/, `<title>${lang} ${pfad}</title>`);
  const ctx = await ctxMit([
    { pfad: '/schluesseldienst-sulzbach/', typ: 'ort', html: mit('/schluesseldienst-sulzbach/') },
    { pfad: '/b/', typ: 'seite', html: mit('/b/') },
  ]);
  const befunde = (await seo.pruefe(ctx)).filter((b) => b.regel.startsWith('seo/titel-laenge'));
  assert.deepEqual(befunde.map((b) => [b.regel, b.datei]).sort(), [['seo/titel-laenge', '/b/index.html'], ['seo/titel-laenge-ort', '/schluesseldienst-sulzbach/index.html']]);
  const a = auswerten([{ name: 'seo', ms: 0, befunde }], { streng: RELEASE_STRENG });
  assert.equal(a.fehler, 1);
  assert.equal(a.warnungen, 1);
});

test('S14-variante: .br/.gz nur mit Quelldatei und gleichem Inhalt; andere Archive bleiben verboten', async () => {
  const { brotliCompressSync, gzipSync } = await import('node:zlib');
  const html = seite('/', '<p>x</p>');
  const ctx = await ctxMit([{ pfad: '/', html }]);
  const extra = {
    '/index.html.br': brotliCompressSync(Buffer.from(html)),
    '/index.html.gz': gzipSync(Buffer.from(html.replace('<p>x</p>', '<p>y</p>'))),
    '/weg.html.gz': gzipSync(Buffer.from('<p>alt</p>')),
    '/sicherung.tar.gz': gzipSync(Buffer.from('x')),
  };
  for (const [p, b] of Object.entries(extra)) { await writeFile(join(DIST, p), b); ctx.dateien.push(p); }
  const befunde = (await sicherheit.pruefe(ctx)).filter((b) => b.regel.startsWith('sicherheit/S14'));
  assert.deepEqual(befunde.map((b) => [b.regel, b.datei]).sort(), [
    ['sicherheit/S14-datei', '/sicherung.tar.gz'],
    ['sicherheit/S14-variante', '/index.html.gz'],
    ['sicherheit/S14-variante', '/weg.html.gz'],
  ]);
});
