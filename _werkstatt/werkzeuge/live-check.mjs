#!/usr/bin/env node
// Live-Prüfung einer ausgelieferten Website (Basis-URL) gegen die Soll-Werte aus src/konfig/sicherheit.mjs
// und gegen den Ausgabeordner des Builds (E4-PRUEF-12). Liest nur; geschrieben wird ausschließlich --aus.
// Prüft: Kopfzeilen · Zusatzkopfzeilen (Server, X-Powered-By) · Status · Cache · 404-Fehlerseite ·
// MIME-Typen je Endung · Weiterleitungen aus _redirects (falls vorhanden) · offene Weiterleitungen · HTTPS-Umleitung.
// Aufruf: node _werkstatt/werkzeuge/live-check.mjs --basis <url> --dist <ausgabeordner> --aus <json>
// Regeln: nur node:-Module und fetch; Weiterleitungen werden nie verfolgt; höchstens 4 Anfragen parallel;
// 10 s Zeitlimit je Anfrage; ein Netzwerkfehler ist FEHLER, nie „bestanden“.
// Rohe Pfade (//…, /\…, /%2F…) gehen über node:http: fetch löste „/\example.com“ vor dem Senden als Host
// example.com auf. Alle Anfragen gehen ausschließlich an Host und Port der Basis-URL.
// Exit: 0 ohne Fehler · 1 mindestens ein FEHLER · 2 Werkzeugfehler (Ergebnis unvollständig).

import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { randomBytes } from 'node:crypto';
import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';
import { parseArgs } from 'node:util';
import { kopfzeilen, CACHE, MIME, SICHERER_PFAD } from '../../src/konfig/sicherheit.mjs';

const ZEITLIMIT_MS = 10_000;
const PARALLEL = 4;
const AUFRUF = 'node _werkstatt/werkzeuge/live-check.mjs --basis <url> --dist <ausgabeordner> --aus <json>';

class WerkzeugFehler extends Error {}

// Werte aus main(), von allen Prüfungen gelesen.
let BASIS_URL = null; // Ursprung der Basis-URL, z. B. https://beispiel.de
let HTTPS = false;
let HOST = '';        // Host ohne eckige Klammern (für node:http)
let PORT = 0;
let DIST = '';
let AUS = null;

// --- Parallelität: höchstens PARALLEL Anfragen gleichzeitig -----------------------------
let frei = PARALLEL;
const wartend = [];
async function mitPlatz(aufgabe) {
  if (frei > 0) frei--;
  else await new Promise((weiter) => wartend.push(weiter));
  try {
    return await aufgabe();
  } finally {
    const naechste = wartend.shift();
    if (naechste) naechste();
    else frei++;
  }
}

// --- Anfragen ----------------------------------------------------------------------------
const kopfAusFetch = (h) => Object.fromEntries([...h].map(([k, v]) => [k.toLowerCase(), v]));
const kopfAusNode = (h) => Object.fromEntries(
  Object.entries(h).map(([k, v]) => [k.toLowerCase(), Array.isArray(v) ? v.join(', ') : String(v)]),
);
const fehlerText = (e) => `Netzwerkfehler: ${e.cause?.code ?? e.code ?? e.name} (${e.message})`;

// Normale Pfade über fetch. Weiterleitungen werden nicht verfolgt. Ziel ist immer der Ursprung der Basis-URL.
function holen(pfad, { text = false } = {}) {
  return mitPlatz(async () => {
    const res = await fetch(`${BASIS_URL.origin}${pfad}`, { redirect: 'manual', signal: AbortSignal.timeout(ZEITLIMIT_MS) });
    const kopf = kopfAusFetch(res.headers);
    let inhalt = null;
    if (text) inhalt = await res.text();
    else await res.body?.cancel().catch(() => {});
    return { status: res.status, kopf, inhalt };
  });
}

// Rohe Anfrage über node:http: der Pfad wird nicht umgeschrieben, nur Host und Port der Basis-URL.
function rohHolen(pfad) {
  return mitPlatz(() => new Promise((aufloesen, ablehnen) => {
    const modul = HTTPS ? httpsRequest : httpRequest;
    const req = modul({ hostname: HOST, port: PORT, path: pfad, method: 'GET', agent: false }, (res) => {
      clearTimeout(zeitlimit);
      res.resume();
      aufloesen({ status: res.statusCode, kopf: kopfAusNode(res.headers) });
    });
    const zeitlimit = setTimeout(() => req.destroy(new Error('Zeitlimit von 10 s überschritten')), ZEITLIMIT_MS);
    req.on('error', (e) => { clearTimeout(zeitlimit); ablehnen(e); });
    req.end();
  }));
}

// --- Ausgabeordner -----------------------------------------------------------------------
async function dateienIn(ordner) {
  const eintraege = await readdir(ordner, { recursive: true, withFileTypes: true });
  return eintraege
    .filter((e) => e.isFile())
    .map((e) => relative(ordner, join(e.parentPath ?? e.path, e.name)).split(sep).join('/'))
    .sort();
}

// Datei im Ausgabeordner → Pfad, unter dem der Host sie ausliefert (index.html ist das Verzeichnis).
function urlFuer(rel) {
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + encodeURI(rel.slice(0, -'index.html'.length));
  return '/' + encodeURI(rel);
}

async function pfadAusSitemap(dateien, rel) {
  const xml = await readFile(join(DIST, rel), 'utf8');
  const loc = xml.match(/<loc>([^<]+)<\/loc>/)?.[1];
  if (!loc) throw new WerkzeugFehler(`Keine <loc> in ${rel}`);
  const pfad = new URL(loc).pathname;
  if (!dateien.includes(`${pfad.slice(1)}index.html`)) {
    throw new WerkzeugFehler(`${rel} nennt ${pfad}, dort liegt keine index.html im Ausgabeordner`);
  }
  return pfad;
}

// --- Soll-Werte: Cache nach CACHE (erste passende Regel gewinnt) --------------------------
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function passt(muster, pfad) {
  if (muster === '/*') return true;
  if (muster.endsWith('/*')) return pfad.startsWith(muster.slice(0, -1));
  if (muster.includes('*')) return new RegExp('^' + muster.split('*').map(escapeRe).join('.*') + '$').test(pfad);
  return pfad === muster;
}
const cacheRegel = (pfad) => CACHE.find((c) => passt(c.muster, pfad));

// --- Ergebniszeilen ----------------------------------------------------------------------
function zeile(rows, pruefung, ziel, { kopfzeile, soll, ist, ergebnis, hinweis } = {}) {
  rows.push({
    pruefung,
    ziel,
    ...(kopfzeile && { kopfzeile }),
    soll,
    ist,
    ergebnis,
    ...(hinweis && { hinweis }),
  });
}

// --- Prüfungen ---------------------------------------------------------------------------
function kopfPruefen(rows, ziel, r) {
  for (const [name, soll] of Object.entries(kopfzeilen())) {
    if (name === 'Strict-Transport-Security' && !HTTPS) {
      zeile(rows, 'Kopfzeile', ziel, {
        kopfzeile: name, soll, ist: '(nicht geprüft)', ergebnis: 'UEBERSPRUNGEN',
        hinweis: 'HSTS wirkt nur über https; vorschau.mjs setzt es über http bewusst nicht',
      });
      continue;
    }
    const ist = r.kopf[name.toLowerCase()] ?? '(fehlt)';
    zeile(rows, 'Kopfzeile', ziel, { kopfzeile: name, soll, ist, ergebnis: ist === soll ? 'OK' : 'FEHLER' });
  }
}

function zusatzPruefen(rows, ziel, r) {
  const funde = ['server', 'x-powered-by']
    .filter((n) => r.kopf[n] !== undefined)
    .map((n) => `${n}: ${r.kopf[n]}`);
  zeile(rows, 'Zusatzkopfzeilen', ziel, {
    soll: 'keine Server- oder Versionsangaben',
    ist: funde.join('; ') || '(keine)',
    ergebnis: funde.length ? 'WARNUNG' : 'OK',
  });
}

function cachePruefen(rows, ziel, r) {
  const regel = cacheRegel(ziel);
  const soll = { 'Cache-Control': regel.wert, ...(regel.extra ?? {}) };
  for (const [name, wert] of Object.entries(soll)) {
    const ist = r.kopf[name.toLowerCase()] ?? '(fehlt)';
    zeile(rows, 'Cache', ziel, { kopfzeile: name, soll: wert, ist, ergebnis: ist === wert ? 'OK' : 'FEHLER', hinweis: `Regel ${regel.muster}` });
  }
}

function fehlerseitePruefen(rows, ziel, r, titelSoll) {
  const ist = r.inhalt?.match(/<title>([^<]*)<\/title>/i)?.[1].trim() ?? '(kein <title>)';
  zeile(rows, '404-Fehlerseite', ziel, { soll: titelSoll, ist, ergebnis: ist === titelSoll ? 'OK' : 'FEHLER', hinweis: 'Titel aus dist/404.html' });
}

async function zielPruefen(z, titelSoll) {
  const rows = [];
  let r;
  try {
    r = await holen(z.pfad, { text: Boolean(z.fehlerseite) });
  } catch (e) {
    zeile(rows, 'Erreichbarkeit', z.pfad, { soll: 'Antwort des Servers', ist: fehlerText(e), ergebnis: 'FEHLER' });
    return rows;
  }
  zeile(rows, 'Status', z.pfad, { soll: z.status, ist: r.status, ergebnis: r.status === z.status ? 'OK' : 'FEHLER' });
  if (z.kopf) kopfPruefen(rows, z.pfad, r);
  zusatzPruefen(rows, z.pfad, r);
  cachePruefen(rows, z.pfad, r);
  if (z.fehlerseite) fehlerseitePruefen(rows, z.pfad, r, titelSoll);
  return rows;
}

async function mimePruefen(dateien) {
  const rows = [];
  const beispiel = new Map(); // Endung → erste Datei dieser Endung (ohne 404.html)
  for (const rel of dateien) {
    const endung = extname(rel);
    if (MIME[endung] && !beispiel.has(endung) && rel !== '404.html') beispiel.set(endung, rel);
  }
  for (const [endung, soll] of Object.entries(MIME)) {
    const rel = beispiel.get(endung);
    if (!rel) {
      zeile(rows, 'MIME', endung, { soll, ist: '(kein Beispiel)', ergebnis: 'UEBERSPRUNGEN', hinweis: 'keine Datei dieser Endung im Ausgabeordner' });
      continue;
    }
    const pfad = urlFuer(rel);
    try {
      const r = await holen(pfad);
      const ist = r.kopf['content-type'] ?? '(fehlt)';
      zeile(rows, 'MIME', pfad, {
        soll: `200, ${soll}`, ist: `${r.status}, ${ist}`,
        ergebnis: r.status === 200 && ist === soll ? 'OK' : 'FEHLER', hinweis: `Datei ${rel}`,
      });
    } catch (e) {
      zeile(rows, 'MIME', pfad, { soll: `200, ${soll}`, ist: fehlerText(e), ergebnis: 'FEHLER', hinweis: `Datei ${rel}` });
    }
  }
  return rows;
}

async function weiterleitungenPruefen() {
  const rows = [];
  let text;
  try {
    text = await readFile(join(DIST, '_redirects'), 'utf8');
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
    zeile(rows, 'Weiterleitung', '_redirects', {
      soll: 'Regeln „von nach 301“', ist: '(keine Datei)', ergebnis: 'UEBERSPRUNGEN',
      hinweis: 'keine _redirects im Ausgabeordner, nichts zu prüfen',
    });
    return rows;
  }
  let nr = 0;
  for (const roh of text.split('\n')) {
    nr++;
    const t = roh.trim();
    if (!t || t.startsWith('#')) continue;
    const m = t.match(/^(\S+)\s+(\S+)\s+(\d{3})$/);
    if (!m) {
      zeile(rows, 'Weiterleitung', `_redirects Zeile ${nr}`, { soll: 'von nach 301', ist: t, ergebnis: 'FEHLER' });
      continue;
    }
    const [, von, nach, code] = m;
    if (!SICHERER_PFAD.test(von) || !SICHERER_PFAD.test(nach)) {
      zeile(rows, 'Weiterleitung', von, { soll: 'sichere Pfade (SICHERER_PFAD)', ist: `${von} → ${nach}`, ergebnis: 'FEHLER' });
      continue;
    }
    if (code !== '301') {
      zeile(rows, 'Weiterleitung', von, { soll: '301', ist: `Regel mit ${code}`, ergebnis: 'FEHLER' });
      continue;
    }
    const erlaubt = [nach, new URL(nach, BASIS_URL).href];
    try {
      const r = await holen(von);
      const loc = r.kopf.location;
      zeile(rows, 'Weiterleitung', von, {
        soll: `301 → ${nach}`,
        ist: `${r.status} → ${loc ?? '(kein Location)'}`,
        ergebnis: r.status === 301 && loc !== undefined && erlaubt.includes(loc) ? 'OK' : 'FEHLER',
        hinweis: `Location exakt „${erlaubt[0]}“ oder „${erlaubt[1]}“`,
      });
    } catch (e) {
      zeile(rows, 'Weiterleitung', von, { soll: `301 → ${nach}`, ist: fehlerText(e), ergebnis: 'FEHLER' });
    }
  }
  return rows;
}

// Offene Weiterleitungen: keine Antwort darf auf einen anderen Host zeigen.
const OFFEN = ['//example.com', '/\\example.com', '/%2F%2Fexample.com'];
async function offenePruefen() {
  const rows = [];
  const soll = `kein Location auf fremdem Host (erlaubt: ${BASIS_URL.host})`;
  for (const roh of OFFEN) {
    try {
      const r = await rohHolen(roh);
      const loc = r.kopf.location;
      if (loc === undefined) {
        zeile(rows, 'Offene Weiterleitung', roh, { soll, ist: `${r.status}, kein Location`, ergebnis: 'OK' });
        continue;
      }
      let host = null; // null = nicht lesbar; gilt als FEHLER, weil nicht sicher geprüft
      try { host = new URL(loc, BASIS_URL).host; } catch { /* bleibt null */ }
      zeile(rows, 'Offene Weiterleitung', roh, {
        soll, ist: `${r.status}, Location: ${loc}`,
        ergebnis: host === BASIS_URL.host ? 'OK' : 'FEHLER',
      });
    } catch (e) {
      zeile(rows, 'Offene Weiterleitung', roh, { soll, ist: fehlerText(e), ergebnis: 'FEHLER' });
    }
  }
  return rows;
}

async function httpsPruefen() {
  const rows = [];
  const ziel = `http://${BASIS_URL.hostname}/`; // Port 80 ist das http-Gegenstück zu https ohne Port
  const soll = `${BASIS_URL.origin}/`;
  if (!HTTPS || BASIS_URL.port) {
    zeile(rows, 'HTTPS-Umleitung', ziel, {
      soll: `301 → ${soll}`, ist: '(nicht geprüft)', ergebnis: 'UEBERSPRUNGEN',
      hinweis: !HTTPS
        ? 'Basis ist http://; nur bei https-Basis prüfbar'
        : 'Basis hat einen Port; das http-Gegenstück (Port 80) wird hier nicht geprüft',
    });
    return rows;
  }
  try {
    const r = await mitPlatz(async () => {
      const res = await fetch(ziel, { redirect: 'manual', signal: AbortSignal.timeout(ZEITLIMIT_MS) });
      await res.body?.cancel().catch(() => {});
      return { status: res.status, loc: res.headers.get('location') };
    });
    zeile(rows, 'HTTPS-Umleitung', ziel, {
      soll: `301 → ${soll}`, ist: `${r.status} → ${r.loc ?? '(kein Location)'}`,
      ergebnis: r.status === 301 && r.loc === soll ? 'OK' : 'FEHLER',
    });
  } catch (e) {
    zeile(rows, 'HTTPS-Umleitung', ziel, { soll: `301 → ${soll}`, ist: fehlerText(e), ergebnis: 'FEHLER' });
  }
  return rows;
}

// --- Ablauf ------------------------------------------------------------------------------
function basisPruefen(roh) {
  let u;
  try { u = new URL(roh); } catch { throw new WerkzeugFehler(`--basis ist keine gültige URL: ${roh}`); }
  if (!['http:', 'https:'].includes(u.protocol) || u.username || u.password || u.search || u.hash || u.pathname !== '/') {
    throw new WerkzeugFehler('--basis nur als Ursprung angeben, z. B. https://beispiel.de oder http://127.0.0.1:4203');
  }
  return u;
}

async function main() {
  const { values: arg } = parseArgs({
    options: { basis: { type: 'string' }, dist: { type: 'string' }, aus: { type: 'string' } },
    strict: true,
  });
  if (!arg.basis || !arg.dist || !arg.aus) throw new WerkzeugFehler(`Aufruf: ${AUFRUF}`);

  BASIS_URL = basisPruefen(arg.basis);
  HTTPS = BASIS_URL.protocol === 'https:';
  HOST = BASIS_URL.hostname.replace(/^\[|\]$/g, '');
  PORT = Number(BASIS_URL.port || (HTTPS ? 443 : 80));
  DIST = resolve(arg.dist);
  AUS = resolve(arg.aus);

  let dateien;
  try {
    dateien = await dateienIn(DIST);
  } catch (e) {
    throw new WerkzeugFehler(`Ausgabeordner nicht lesbar: ${DIST} (${e.code ?? e.message})`);
  }
  const hat = (rel) => dateien.includes(rel);
  const finde = (re) => dateien.find((r) => re.test(r));

  for (const pflicht of ['index.html', '404.html']) {
    if (!hat(pflicht)) throw new WerkzeugFehler(`Pflichtdatei fehlt im Ausgabeordner: ${pflicht}`);
  }
  const titelSoll = (await readFile(join(DIST, '404.html'), 'utf8')).match(/<title>([^<]*)<\/title>/i)?.[1].trim();
  if (!titelSoll) throw new WerkzeugFehler('404.html hat keinen <title>');

  const css = finde(/^assets\/app\.[^/]+\.css$/);
  if (!css) throw new WerkzeugFehler('Kein Stylesheet assets/app.<hash>.css im Ausgabeordner');
  const leistung = await pfadAusSitemap(dateien, 'sitemaps/leistungen.xml');
  const ortsDatei = hat('sitemaps/orte-hessen.xml') ? 'sitemaps/orte-hessen.xml' : finde(/^sitemaps\/orte-[^/]+\.xml$/);
  if (!ortsDatei) throw new WerkzeugFehler('Keine Ortssitemap sitemaps/orte-*.xml im Ausgabeordner');
  const ort = await pfadAusSitemap(dateien, ortsDatei);

  // Stichproben: Startseite, Leistung, Ort, zufälliger 404-Pfad, Asset (Kopfzeilen); Cache für alle.
  const zufall = `/nicht-vorhanden-${randomBytes(6).toString('hex')}`;
  const ziele = [
    { pfad: '/', status: 200, kopf: true },
    { pfad: leistung, status: 200, kopf: true },
    { pfad: ort, status: 200, kopf: true },
    { pfad: zufall, status: 404, kopf: true, fehlerseite: true },
    { pfad: urlFuer(css), status: 200, kopf: true },
  ];
  const vorab = [];
  const datenDatei = finde(/^daten\/[^/]+\.json$/);
  if (datenDatei) ziele.push({ pfad: urlFuer(datenDatei), status: 200, kopf: false });
  else zeile(vorab, 'Cache', '/daten/*', { soll: 'immutable + noindex', ist: '(kein Beispiel)', ergebnis: 'UEBERSPRUNGEN', hinweis: 'keine daten/*.json im Ausgabeordner' });
  if (hat('robots.txt')) ziele.push({ pfad: '/robots.txt', status: 200, kopf: false });
  if (hat('sitemap.xml')) ziele.push({ pfad: '/sitemap.xml', status: 200, kopf: false });

  const teile = await Promise.all([
    ...ziele.map((z) => zielPruefen(z, titelSoll)),
    mimePruefen(dateien),
    weiterleitungenPruefen(),
    offenePruefen(),
    httpsPruefen(),
  ]);
  const pruefungen = [...vorab, ...teile.flat()];

  const zaehl = { OK: 0, FEHLER: 0, WARNUNG: 0, UEBERSPRUNGEN: 0 };
  for (const r of pruefungen) zaehl[r.ergebnis]++;
  const ausgabe = {
    werkzeug: 'live-check (E4-PRUEF-12)',
    status: 'vollstaendig',
    basis: BASIS_URL.origin,
    dist: DIST,
    zeitpunkt: new Date().toISOString(),
    soll: 'src/konfig/sicherheit.mjs (kopfzeilen, CACHE, MIME, SICHERER_PFAD) · <dist>/404.html · <dist>/_redirects',
    zusammenfassung: zaehl,
    pruefungen,
  };
  await mkdir(dirname(AUS), { recursive: true });
  await writeFile(AUS, JSON.stringify(ausgabe, null, 2) + '\n');

  // Konsole gekürzt; die vollständigen Werte stehen in --aus.
  const kuerzen = (s) => (String(s).length > 90 ? String(s).slice(0, 87) + '...' : String(s));
  for (const r of pruefungen.filter((x) => x.ergebnis === 'FEHLER')) {
    console.log(`FEHLER  ${r.pruefung}${r.kopfzeile ? ' ' + r.kopfzeile : ''}  ${r.ziel}  soll: ${kuerzen(r.soll)}  ist: ${kuerzen(r.ist)}`);
  }
  console.log(`live-check ${BASIS_URL.origin}: OK ${zaehl.OK} · FEHLER ${zaehl.FEHLER} · WARNUNG ${zaehl.WARNUNG} · übersprungen ${zaehl.UEBERSPRUNGEN} → ${AUS}`);
  process.exitCode = zaehl.FEHLER ? 1 : 0;
}

main().catch(async (e) => {
  console.error(`live-check: Werkzeugfehler: ${e.message}`);
  if (AUS) {
    try {
      await mkdir(dirname(AUS), { recursive: true });
      await writeFile(AUS, JSON.stringify({ werkzeug: 'live-check (E4-PRUEF-12)', status: 'werkzeugfehler', fehler: e.message }, null, 2) + '\n');
    } catch { /* Ausgabe nicht schreibbar: Meldung oben genügt */ }
  }
  process.exitCode = 2;
});
