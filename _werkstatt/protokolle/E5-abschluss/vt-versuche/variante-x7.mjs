// X7: Opt-in zusätzlich in jeder Ansichts-CSS der Probe-Seiten (Hypothese: Wettlauf zweier blockierender Stylesheets –
// lädt die Ansichts-CSS vor app.css, sieht Chromium beim ersten Stil-Update keinen @view-transition und bricht ab).
import { readFile, writeFile, rm, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const QUELLE = '/home/user/schluesseldienst/.cache/e5-abschluss/dist';
const AUS = '/home/user/schluesseldienst/.cache/vt-exp/X7/dist';
const SEITEN = ['index.html', 'einbruchschutz/index.html', 'notoeffnung/tueroeffnung/index.html', 'preise/index.html',
  'einsatzgebiet/index.html', 'einsatzgebiet/hessen/limburg-weilburg/index.html', 'schluesseldienst-loehnberg/index.html',
  'ratgeber/rauchmelderpflicht/index.html', 'ueber-uns/index.html', 'kontakt/index.html', 'suche/index.html',
  'impressum/index.html', '404.html'];
const OPT_IN = '@media (prefers-reduced-motion: no-preference) { @view-transition { navigation: auto; } }\n';
const sri = (t) => `sha384-${createHash('sha384').update(t).digest('base64')}`;
const hash10 = (t) => createHash('sha256').update(t).digest('hex').slice(0, 10);

await rm(join(AUS, '..'), { recursive: true, force: true });
await mkdir(join(AUS, '..'), { recursive: true });
execFileSync('cp', ['-al', QUELLE, AUS]);
const neu = new Map();
for (const s of SEITEN) {
  const p = join(AUS, s);
  let html = await readFile(p, 'utf8');
  const links = [...html.matchAll(/<link rel="stylesheet" href="\/assets\/([^"]+\.css)" integrity="([^"]+)">/g)]
    .filter((m) => !m[1].startsWith('app.'));
  for (const [ganz, datei] of links) {
    if (!neu.has(datei)) {
      const text = OPT_IN + await readFile(join(AUS, 'assets', datei), 'utf8');
      const name = `${datei.replace(/\.[0-9a-f]{10}\.css$/, '')}.${hash10(text)}.css`;
      await writeFile(join(AUS, 'assets', name), text);
      neu.set(datei, { name, sri: sri(text) });
    }
    const n = neu.get(datei);
    html = html.replace(ganz, `<link rel="stylesheet" href="/assets/${n.name}" integrity="${n.sri}">`);
  }
  await rm(p); await writeFile(p, html);
  console.log(`${s}: ${links.length} Ansichts-CSS mit Opt-in`);
}
