#!/usr/bin/env node
// Lokaler Vorschau-Server (nur 127.0.0.1) mit exakt den Produktions-Headern aus src/konfig/sicherheit.mjs.
// Schutz: Pfad-Ausbrüche, kodierte Schrägstriche und Doppel-Schrägstriche werden abgewiesen;
// Weiterleitungen nur auf feste Herkunft (nie aus dem Host-Header).
// --komprimieren: Textantworten gzip-komprimiert, wenn der Client gzip annimmt – wie ein Hoster mit Kompression
// (Messungen unter Produktionsbedingungen; ohne den Schalter unkomprimiert wie bisher, vergleichbar mit E2–E4).
import { createServer } from 'node:http';
import { gzipSync } from 'node:zlib';
import { readFile, stat } from 'node:fs/promises';
import { join, resolve, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { kopfzeilen, CACHE, MIME } from '../src/konfig/sicherheit.mjs';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// Server und Argumente nur bei direktem Aufruf (Import für Tests startet nichts).
const DIREKT = Boolean(process.argv[1]) && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const { values: arg } = DIREKT ? parseArgs({ options: { port: { type: 'string' }, aus: { type: 'string' }, still: { type: 'boolean' }, komprimieren: { type: 'boolean' } } }) : { values: {} };
const PORT = Number(arg.port || 4173);
const BASIS = resolve(WURZEL, arg.aus || 'dist');
const HERKUNFT = `http://127.0.0.1:${PORT}`;
const KOPF = kopfzeilen();
delete KOPF['Strict-Transport-Security']; // über http sinnlos und von Browsern ignoriert

function cacheFuer(pfad) {
  for (const c of CACHE) {
    const m = c.muster;
    const passt = m === '/*' || (m.endsWith('/*') ? pfad.startsWith(m.slice(0, -1)) : m.includes('*') ? new RegExp('^' + m.replace(/[.]/g, '\\.').replace('*', '.*') + '$').test(pfad) : pfad === m);
    if (passt) return { 'Cache-Control': c.wert, ...(c.extra || {}) };
  }
  return {};
}

export function pfadPruefen(roh) {
  if (!roh.startsWith('/') || roh.startsWith('//') || roh.includes('\\') || /%2f|%5c|%00/i.test(roh)) return null;
  let p;
  try { p = decodeURIComponent(roh.split('?')[0].split('#')[0]); } catch { return null; }
  if (p.includes('\0') || p.split('/').includes('..') || p.includes('//')) return null;
  return p;
}

async function datei(p) { try { const s = await stat(p); return s.isFile() ? p : null; } catch { return null; } }

const TEXT = /^(text\/|application\/(javascript|json|xml|manifest\+json)|image\/svg\+xml)/;
const nimmtGzip = (kopf) => /(^|,)\s*gzip\s*(;\s*q=(?!0(\.0*)?\s*(,|$))[\d.]+)?\s*(,|$)/i.test(kopf || '');

const server = createServer(async (anf, antw) => {
  const senden = (status, kopf, inhalt) => {
    if (arg.komprimieren && inhalt && TEXT.test(kopf['Content-Type'] || '')) {
      kopf = { ...kopf, Vary: 'Accept-Encoding' };
      if (nimmtGzip(anf.headers['accept-encoding'])) { inhalt = gzipSync(inhalt, { level: 6 }); kopf['Content-Encoding'] = 'gzip'; }
    }
    antw.writeHead(status, { ...KOPF, ...kopf });
    antw.end(anf.method === 'HEAD' ? undefined : inhalt);
  };
  if (anf.method !== 'GET' && anf.method !== 'HEAD') return senden(405, { Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' }, '405');
  const p = pfadPruefen(anf.url || '/');
  if (p === null) return senden(400, { 'Content-Type': 'text/plain; charset=utf-8' }, '400');
  let ziel = resolve(join(BASIS, p.endsWith('/') ? p + 'index.html' : p));
  if (!ziel.startsWith(BASIS + '/')) return senden(400, { 'Content-Type': 'text/plain; charset=utf-8' }, '400');
  let gefunden = await datei(ziel);
  if (!gefunden && !p.endsWith('/') && !extname(p) && await datei(resolve(join(BASIS, p, 'index.html')))) {
    return senden(301, { Location: HERKUNFT + p + '/', 'Content-Type': 'text/plain; charset=utf-8' }, '301');
  }
  if (!gefunden) {
    const fehler = await datei(join(BASIS, '404.html'));
    return senden(404, { 'Content-Type': MIME['.html'], ...cacheFuer('/404.html') }, fehler ? await readFile(fehler) : '404');
  }
  const typ = MIME[extname(gefunden)] || 'application/octet-stream';
  return senden(200, { 'Content-Type': typ, ...cacheFuer(p) }, await readFile(gefunden));
});

if (DIREKT) server.listen(PORT, '127.0.0.1', () => { if (!arg.still) console.log(`Vorschau: ${HERKUNFT}/  (Ordner ${BASIS})`); });
