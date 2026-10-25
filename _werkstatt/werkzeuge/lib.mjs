// Gemeinsame Helfer aller Prüfwerkzeuge des Werkstatt-Laufs.
// Abhängigkeiten liegen AUSSERHALB des Repos (Standard /home/user/werkzeuge-cache),
// Einrichtung siehe README.md. Nur der Orchestrator ändert diese Datei.
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { join, resolve, extname, dirname } from 'node:path';

export const MODULE = process.env.WERKZEUG_MODULE || '/home/user/werkzeuge-cache';
export const CHROMIUM = process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
const require = createRequire(join(MODULE, 'package.json'));

/** Lädt ein Werkzeug-Paket aus dem Cache außerhalb des Repos. */
export async function importiere(name) {
  const pfad = require.resolve(name);
  return import(pfad);
}
export const pfadVon = (name) => require.resolve(name);

/** Startet Chromium (installierte Version passend zu playwright-core 1.63.0). */
export async function starteBrowser(optionen = {}) {
  const pw = await importiere('playwright-core');
  const chromium = pw.chromium ?? pw.default.chromium;
  return chromium.launch({ executablePath: CHROMIUM, args: ['--no-sandbox'], ...optionen });
}

/** Blockiert jede Anfrage an fremde Hosts und zählt sie. */
export async function blockiereExtern(kontext, erlaubt = ['127.0.0.1', 'localhost']) {
  const blockiert = [];
  await kontext.route('**/*', (route) => {
    const url = new URL(route.request().url());
    if (url.protocol === 'data:' || url.protocol === 'blob:' || erlaubt.includes(url.hostname)) return route.continue();
    blockiert.push(url.href);
    return route.abort();
  });
  return blockiert;
}

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json',
};
export const STANDARD_CSP = "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; manifest-src 'self'; form-action mailto:; frame-ancestors 'none'; base-uri 'none'; object-src 'none'; require-trusted-types-for 'script'; trusted-types 'none'";

/** Minimaler statischer Server (nur 127.0.0.1) für Fixtures; die Website nutzt später bau/vorschau.mjs. */
export function statikServer(wurzel, port, kopfzeilen = { 'Content-Security-Policy': STANDARD_CSP, 'X-Content-Type-Options': 'nosniff' }) {
  const basis = resolve(wurzel);
  const server = createServer(async (anf, antw) => {
    try {
      let pfad = decodeURIComponent(new URL(anf.url, 'http://127.0.0.1').pathname);
      if (pfad.endsWith('/')) pfad += 'index.html';
      const datei = resolve(join(basis, pfad));
      if (!datei.startsWith(basis + '/') && datei !== basis) { antw.writeHead(403); return antw.end(); }
      const info = await stat(datei);
      if (!info.isFile()) throw new Error('kein Datei');
      antw.writeHead(200, { 'Content-Type': MIME[extname(datei)] || 'application/octet-stream', ...kopfzeilen });
      antw.end(await readFile(datei));
    } catch { antw.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); antw.end('404'); }
  });
  return new Promise((ok) => server.listen(port, '127.0.0.1', () => ok(server)));
}

export const median = (werte) => { const s = [...werte].sort((a, b) => a - b); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
export async function schreibeJson(pfad, daten) { await mkdir(dirname(pfad), { recursive: true }); await writeFile(pfad, JSON.stringify(daten, null, 2) + '\n'); }
export const GERAETE = [ { name: 'mobil', width: 390, height: 844 }, { name: 'tablet', width: 768, height: 1024 }, { name: 'desktop', width: 1440, height: 900 } ];

/** Mess-Sperre: rechenintensive Messungen laufen nie parallel (Datei .cache/mess.lock). */
export async function mitMessSperre(name, arbeit, sperre = '/home/user/schluesseldienst/.cache/mess.lock') {
  const { open, unlink } = await import('node:fs/promises');
  await mkdir(dirname(sperre), { recursive: true });
  for (let versuch = 0; ; versuch++) {
    try { const h = await open(sperre, 'wx'); await h.writeFile(`${name} ${process.pid}\n`); await h.close(); break; }
    catch (e) { if (e.code !== 'EEXIST' || versuch > 600) throw new Error(`Mess-Sperre belegt (${sperre})`); await new Promise((r) => setTimeout(r, 1000)); }
  }
  try { return await arbeit(); } finally { await unlink(sperre).catch(() => {}); }
}
