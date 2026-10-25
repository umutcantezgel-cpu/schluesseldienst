// iconbogen.mjs: Kontaktbogen der Icons aus src/assets/icons – je Icon 4×-Ansicht über dem 24er-Raster
// (aktive Fläche 2–22 markiert) und Originalgrößen 20/24/48, hell und dunkel. Ein PNG je Schema.
// Aufruf: node _werkstatt/werkzeuge/iconbogen.mjs --aus <ordner> [--namen a,b,c] [--port 4190]
import { parseArgs } from 'node:util';
import { readdir, readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { starteBrowser, blockiereExtern, statikServer, mitMessSperre } from './lib.mjs';

const WURZEL = resolve(new URL('../..', import.meta.url).pathname);
const esc = (s) => String(s).replace(/[&<>"]/g, (z) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[z]);

const CSS = `
:root { color-scheme: light dark; --papier: #F4F2ED; --tinte: #13202A; --raster: #d8d3c8; --flaeche: #e9c9b8; }
@media (prefers-color-scheme: dark) { :root { --papier: #0E161B; --tinte: #EDEAE3; --raster: #26343c; --flaeche: #4a2c1e; } }
body { margin: 0; padding: 16px; background: var(--papier); color: var(--tinte); font: 13px/1.3 system-ui, sans-serif; }
.bogen { display: grid; grid-template-columns: repeat(auto-fill, 220px); gap: 16px; }
figure { margin: 0; display: grid; gap: 6px; }
.gross { inline-size: 192px; block-size: 192px; }
.raster line { stroke: var(--raster); stroke-width: .05; }
.raster rect { fill: none; stroke: var(--flaeche); stroke-width: .1; }
.zeichen { fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.klein { display: flex; gap: 12px; align-items: center; }
.klein svg { fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.s20 { inline-size: 20px; block-size: 20px; } .s24 { inline-size: 24px; block-size: 24px; } .s48 { inline-size: 48px; block-size: 48px; }
figcaption { font-family: ui-monospace, monospace; }
`;

function rasterSvg() {
  const linien = [];
  for (let i = 0; i <= 24; i++) linien.push(`<line x1="${i}" y1="0" x2="${i}" y2="24"/><line x1="0" y1="${i}" x2="24" y2="${i}"/>`);
  return `<g class="raster">${linien.join('')}<rect x="2" y="2" width="20" height="20"/></g>`;
}

async function main() {
  const { values: a } = parseArgs({ options: { aus: { type: 'string' }, namen: { type: 'string' }, port: { type: 'string', default: '4190' } } });
  if (!a.aus) throw new Error('--aus fehlt');
  const ordner = join(WURZEL, 'src/assets/icons');
  const alle = (await readdir(ordner)).filter((n) => n.endsWith('.svg')).map((n) => n.slice(0, -4)).sort();
  const namen = a.namen ? a.namen.split(',').map((n) => n.trim()) : alle;
  const fehlend = namen.filter((n) => !alle.includes(n));
  const karten = [];
  for (const n of namen.filter((x) => alle.includes(x))) {
    const svg = await readFile(join(ordner, `${n}.svg`), 'utf8');
    const innen = svg.replace(/^[\s\S]*?<svg\b[^>]*>/, '').replace(/<\/svg>\s*$/, '');
    karten.push(`<figure><svg class="gross" viewBox="0 0 24 24">${rasterSvg()}<g class="zeichen">${innen}</g></svg>
<div class="klein"><svg class="s20" viewBox="0 0 24 24">${innen}</svg><svg class="s24" viewBox="0 0 24 24">${innen}</svg><svg class="s48" viewBox="0 0 24 24">${innen}</svg></div>
<figcaption>${esc(n)}</figcaption></figure>`);
  }
  const tmp = join(WURZEL, '.cache/iconbogen-' + process.pid);
  await mkdir(tmp, { recursive: true });
  await writeFile(join(tmp, 'bogen.css'), CSS);
  await writeFile(join(tmp, 'index.html'), `<!doctype html><html lang="de"><meta charset="utf-8"><title>Iconbogen</title><link rel="stylesheet" href="/bogen.css"><body><div class="bogen">${karten.join('\n')}</div></body></html>`);
  const port = Number(a.port);
  const server = await statikServer(tmp, port);
  const browser = await starteBrowser();
  const aus = resolve(a.aus);
  await mkdir(aus, { recursive: true });
  try {
    for (const schema of ['light', 'dark']) {
      const kontext = await browser.newContext({ viewport: { width: 1200, height: 800 }, colorScheme: schema, deviceScaleFactor: 1 });
      await blockiereExtern(kontext);
      const seite = await kontext.newPage();
      await seite.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'load' });
      await seite.screenshot({ path: join(aus, `iconbogen-${schema}.png`), fullPage: true });
      await kontext.close();
    }
  } finally {
    await browser.close();
    server.close();
    await rm(tmp, { recursive: true, force: true });
  }
  console.log(`iconbogen: ${karten.length} Icons → ${aus}/iconbogen-{light,dark}.png${fehlend.length ? ` · fehlen: ${fehlend.join(', ')}` : ''}`);
  if (fehlend.length) process.exitCode = 1;
}

mitMessSperre('iconbogen', main).catch((e) => { console.error(`iconbogen: Werkzeugfehler: ${e.message}`); process.exitCode = 2; });
