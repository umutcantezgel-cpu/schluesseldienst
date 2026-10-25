#!/usr/bin/env node
// Generator: erzeugt die statische Website in dist/ (oder --aus=…).
// Modi: --vorschau (Standard, noindex) · --messen (indexierbar, lokaler Origin) · --release (strikt).
// Weitere Schalter: --pruefen · --aus=<ordner> · --port=<n> · --datum=JJJJ-MM-TT · --ziel=apache|nginx|netlify|cloudflare
//                   --stichprobe=<n> (nur n Ortsseiten) · --nur=<pfadpräfix>
import { parseArgs } from 'node:util';
import { execFileSync } from 'node:child_process';
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { cssBuendeln, ansichtenBuendeln, jsBuendeln, statischeAssets, hash10, sri } from './lib/assets.mjs';
import { Schreiber } from './lib/schreiben.mjs';
import { aufloesen } from './lib/markierung.mjs';
import { platzhalterIn, istPlatzhalter } from './lib/platzhalter.mjs';
import { setzeRoutenPruefer, fehlendeLinksHolen } from './lib/inhalt.mjs';
import { sitemaps, robots, securityTxt, manifest } from './lib/dateien.mjs';
import { headersDatei, htaccess, nginx, pruefeWeiterleitungen } from './lib/hosting.mjs';
import { pruefeAlles, auswerten } from './pruefen/index.mjs';
import { iconsLaden, icon as iconRoh } from '../src/vorlagen/teile/icons.mjs';
import { datenIndizes, seitenIndexSchreiben } from './lib/datenindex.mjs';
import { layout } from '../src/vorlagen/layout.mjs';
import { signet } from '../src/vorlagen/teile/signet.mjs';
import { istGeplant } from '../src/konfig/routen.mjs';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const { values: arg } = parseArgs({
  options: {
    vorschau: { type: 'boolean' }, messen: { type: 'boolean' }, release: { type: 'boolean' }, pruefen: { type: 'boolean' },
    aus: { type: 'string' }, port: { type: 'string' }, datum: { type: 'string' }, ziel: { type: 'string' },
    stichprobe: { type: 'string' }, nur: { type: 'string' }, still: { type: 'boolean' },
  },
});

const modus = arg.release ? 'release' : arg.messen ? 'messen' : 'vorschau';
const log = (...t) => { if (!arg.still) console.log(...t); };
const start = performance.now();

function commitDatum() {
  if (arg.datum) return `${arg.datum}T00:00:00Z`;
  try { return execFileSync('git', ['log', '-1', '--format=%cI'], { cwd: WURZEL, encoding: 'utf8' }).trim(); } catch { return '2026-01-01T00:00:00Z'; }
}

async function konfigLaden() {
  const lade = async (n) => (await import(pathToFileURL(join(WURZEL, 'src/konfig', n)).href));
  return {
    betrieb: (await lade('betrieb.mjs')).default,
    preise: (await lade('preise.mjs')).default,
    zonen: (await lade('zonen.mjs')).default,
    seo: (await lade('seo.mjs')).default,
    marken: (await lade('marken.mjs')).default,
    quellen: (await lade('quellen.mjs')).default,
    leistungen: await lade('leistungen.mjs'),
  };
}

async function datenLaden() {
  const daten = {};
  for (const n of ['orte.json', 'plz.json']) {
    try { daten[n.replace('.json', '')] = JSON.parse(await readFile(join(WURZEL, 'src/daten', n), 'utf8')); } catch { /* noch nicht erzeugt */ }
  }
  return daten;
}

async function seitenModule() {
  const ordner = join(WURZEL, 'src/vorlagen/seiten');
  const namen = (await readdir(ordner)).filter((n) => n.endsWith('.mjs')).sort();
  const liste = [];
  for (const n of namen) {
    const m = await import(pathToFileURL(join(ordner, n)).href);
    if (typeof m.seiten !== 'function') throw new Error(`Seitenmodul ${n} exportiert keine Funktion seiten()`);
    liste.push({ name: n, m });
  }
  return liste;
}

const zielDatei = (pfad) => (pfad.endsWith('.html') ? pfad : pfad + 'index.html');

async function main() {
  const datum = commitDatum();
  const tag = datum.slice(0, 10);
  const konfig = await konfigLaden();
  const port = Number(arg.port || 4173);
  let basisUrl = `http://127.0.0.1:${port}`;
  if (modus === 'release') {
    if (istPlatzhalter(konfig.betrieb.basisUrl)) throw new Error('Release: betrieb.basisUrl ist ein Platzhalter.');
    if (!/^https:\/\/[a-z0-9.-]+$/.test(konfig.betrieb.basisUrl)) throw new Error('Release: basisUrl muss https://host ohne Pfad sein.');
    basisUrl = konfig.betrieb.basisUrl;
    if (!arg.ziel || !['apache', 'nginx', 'netlify', 'cloudflare'].includes(arg.ziel)) throw new Error('Release: --ziel=apache|nginx|netlify|cloudflare angeben.');
  }
  const aus = resolve(WURZEL, arg.aus || 'dist');
  // Berichte neben dem Ausgabeordner (parallele Builds mit --aus überschreiben sich nicht gegenseitig)
  const berichtVon = (name) => (arg.aus ? `${aus}.${name}` : join(WURZEL, '.cache', name));
  const schreiber = new Schreiber(aus);

  // Assets
  const statisch = await statischeAssets(WURZEL);
  const karte = new Map(statisch.map((a) => [a.quelle, a.pfad]));
  for (const a of statisch) await schreiber.schreibe(a.pfad, a.inhalt);
  const css = await cssBuendeln(WURZEL, karte);
  const cssBuf = Buffer.from(css.text, 'utf8');
  const cssPfad = `/assets/app.${hash10(cssBuf)}.css`;
  await schreiber.schreibe(cssPfad, cssBuf);
  const ansichten = {};
  for (const a of await ansichtenBuendeln(WURZEL, karte)) {
    const buf = Buffer.from(a.text, 'utf8');
    const pfad = `/assets/${a.name}.${hash10(buf)}.css`;
    await schreiber.schreibe(pfad, buf);
    ansichten[a.name] = { pfad, sri: sri(buf), bytes: buf.length };
  }
  const js = await jsBuendeln(join(WURZEL, 'src/assets/js/app.mjs'));
  const jsBuf = Buffer.from(js.text, 'utf8');
  const jsPfad = `/assets/app.${hash10(jsBuf)}.js`;
  await schreiber.schreibe(jsPfad, jsBuf);
  const favSvg = String(signet('fav')).replace('<svg class="fav"', '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="#A84A22" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"').replace(' aria-hidden="true" focusable="false"', '');
  const favBuf = Buffer.from(favSvg, 'utf8');
  const favPfad = `/assets/favicon.${hash10(favBuf)}.svg`;
  await schreiber.schreibe(favPfad, favBuf);
  const schriftVorladen = [...karte.entries()].find(([q]) => /atkinson-next-latin-wght/.test(q))?.[1] || null;
  const assets = {
    css: { pfad: cssPfad, sri: sri(cssBuf), bytes: cssBuf.length },
    ansichten,
    js: { pfad: jsPfad, sri: sri(jsBuf), bytes: jsBuf.length },
    favicon: favPfad,
    schriftVorladen,
    pfad(quelle, { optional = false } = {}) {
      if (karte.has(quelle)) return karte.get(quelle);
      if (optional) return null;
      throw new Error(`Unbekanntes Asset ${quelle}`);
    },
    daten: {},
  };

  await iconsLaden(WURZEL);
  const daten = await datenLaden();
  assets.daten = await datenIndizes(daten, schreiber);

  // Kontext und Seiten sammeln
  const k = { wurzel: WURZEL, modus, basisUrl, datum, tag, konfig, assets, daten, stichprobe: arg.stichprobe ? Number(arg.stichprobe) : null, hubs: { laender: [] } };
  const module = await seitenModule();
  // Vorbereitende Hooks (z. B. Datenblöcke schreiben, Hub-Listen bereitstellen)
  for (const { m } of module) if (typeof m.vorbereiten === 'function') await m.vorbereiten(k, schreiber);
  const seiten = [];
  for (const { name, m } of module) {
    for (const s of await m.seiten(k)) {
      if (!s.pfad || !s.titel || !s.beschreibung || typeof s.inhalt !== 'function') throw new Error(`${name}: Seite unvollständig (${s.pfad || '?'})`);
      if (!/^\/([a-z0-9-]+\/)*$|^\/404\.html$/.test(s.pfad)) throw new Error(`${name}: unzulässiger Pfad ${s.pfad}`);
      seiten.push({ ...s, modul: name });
    }
  }
  const routen = new Set();
  for (const s of seiten) {
    if (routen.has(s.pfad)) throw new Error(`Doppelte Route ${s.pfad}`);
    routen.add(s.pfad);
  }
  k.routen = routen;
  // Seitenindex für /suche/ (vor dem Rendern, damit die Suchseite Pfad und SRI kennt)
  assets.daten.seiten = await seitenIndexSchreiben(seiten, schreiber);
  setzeRoutenPruefer((p) => routen.has(p));
  // Geplant = im Routenregister (src/konfig/routen.mjs) oder Ortsslug aus den Daten; alles andere ist ein Tippfehler.
  const slugs = new Set((daten.orte || []).map((o) => o.slug).filter(Boolean));
  const geplant = (p) => istGeplant(p, { slugs });

  // Rendern
  const alleP = new Set();
  const alleF = new Set();
  const gerendert = [];
  const nur = arg.nur || null;
  for (const s of seiten) {
    if (nur && !s.pfad.startsWith(nur) && s.pfad !== '/404.html') continue;
    const sk = Object.assign(Object.create(k), { seite: s, icons: new Set() });
    sk.icon = (name, opt) => iconRoh(sk, name, opt);
    const roh = String(layout(sk));
    const { html, platzhalter, fakten } = aufloesen(roh);
    platzhalter.forEach((p) => alleP.add(p));
    fakten.forEach((f) => alleF.add(f));
    const datei = zielDatei(s.pfad);
    await schreiber.schreibe(datei, html);
    gerendert.push({ pfad: s.pfad, datei, html, typ: s.typ || 'seite', ansicht: s.ansicht, indexierbar: s.indexierbar !== false && s.pfad !== '/404.html', sitemap: s.sitemap || null });
  }
  const fehlend = [...new Set(fehlendeLinksHolen())];
  const unbekannt = fehlend.filter((p) => !geplant(p));
  if (unbekannt.length) throw new Error(`Interne Links auf unbekannte Routen (nicht im Routenregister): ${unbekannt.join(', ')}`);
  if (fehlend.length) {
    if (modus !== 'release') log(`Hinweis: ${fehlend.length} interne Links auf geplante, noch nicht gebaute Seiten`);
    else throw new Error(`Interne Links ohne Ziel: ${fehlend.join(', ')}`);
  }

  // Begleitdateien
  const gruppen = new Map();
  for (const g of gerendert) {
    if (!g.indexierbar || !g.sitemap) continue;
    if (!gruppen.has(g.sitemap)) gruppen.set(g.sitemap, []);
    gruppen.get(g.sitemap).push({ loc: g.pfad, lastmod: tag });
  }
  for (const [pfad, inhalt] of Object.entries(sitemaps(basisUrl, gruppen))) await schreiber.schreibe(pfad, inhalt);
  await schreiber.schreibe('/robots.txt', robots(basisUrl, modus !== 'vorschau'));
  const kontaktMail = istPlatzhalter(konfig.betrieb.email) ? 'sicherheit@example.invalid' : konfig.betrieb.email;
  await schreiber.schreibe('/.well-known/security.txt', securityTxt(basisUrl, kontaktMail, datum));
  const markenName = istPlatzhalter(konfig.betrieb.name) ? 'Schlüsseldienst Weilburg' : konfig.betrieb.name;
  await schreiber.schreibe('/site.webmanifest', manifest({ name: markenName, kurz: markenName.slice(0, 12), farbe: konfig.seo.themeColor.hell, hintergrund: konfig.seo.themeColor.hell, icon: favPfad }));

  // Hoster-Konfiguration (nur Release mit Ziel)
  let weiterleitungen = [];
  try { weiterleitungen = JSON.parse(await readFile(join(WURZEL, 'src/daten/weiterleitungen.json'), 'utf8')); } catch { /* keine */ }
  pruefeWeiterleitungen(weiterleitungen, (p) => routen.has(p));
  if (modus === 'release') {
    const host = new URL(basisUrl).host;
    if (arg.ziel === 'apache') await schreiber.schreibe('/.htaccess', htaccess(host, weiterleitungen));
    if (arg.ziel === 'netlify' || arg.ziel === 'cloudflare') for (const [n, t] of Object.entries(headersDatei(weiterleitungen))) if (t) await schreiber.schreibe('/' + n, t);
    if (arg.ziel === 'nginx') {
      const ordner = resolve(WURZEL, 'release/nginx');
      await mkdir(ordner, { recursive: true });
      for (const [n, t] of Object.entries(nginx(host, weiterleitungen))) await writeFile(join(ordner, n), t);
    }
  }

  const entfernt = nur ? 0 : await schreiber.aufraeumen();

  // Platzhalter in der Konfiguration (auch ungerenderte)
  const konfigP = platzhalterIn({ betrieb: konfig.betrieb, preise: konfig.preise, zonen: konfig.zonen });
  const bericht = {
    modus, basisUrl, datum, seiten: gerendert.length, dateien: schreiber.bericht(), entfernt,
    css: assets.css.bytes, js: assets.js.bytes, platzhalterAusgabe: alleP.size, platzhalterKonfig: konfigP.length,
    faktenUngeprueft: alleF.size, ms: Math.round(performance.now() - start),
  };
  log(`Build ${modus}: ${bericht.seiten} Seiten, ${bericht.dateien.geaendert} geändert, ${entfernt} entfernt, CSS ${bericht.css} B, JS ${bericht.js} B, ${bericht.ms} ms`);
  log(`Platzhalter: ${alleP.size} in der Ausgabe, ${konfigP.length} in der Konfiguration · ungeprüfte Fakten: ${alleF.size}`);

  let fehler = 0;
  if (arg.pruefen || modus === 'release') {
    const dateien = [...schreiber.geschrieben].map((d) => schreiber.relativ(d));
    const ergebnisse = await pruefeAlles({ wurzel: WURZEL, dist: aus, modus, basisUrl, seiten: gerendert, dateien, konfig, assets, daten, geplant });
    const a = auswerten(ergebnisse, { streng: modus === 'release' ? ['seo/titel-laenge', 'seo/beschreibung-laenge'] : [] });
    log(a.text);
    bericht.pruefung = { fehler: a.fehler, warnungen: a.warnungen, je: ergebnisse.map((e) => ({ name: e.name, fehler: e.befunde.filter((b) => b.schwere === 'fehler').length, warnungen: e.befunde.filter((b) => b.schwere === 'warnung').length })) };
    fehler += a.fehler;
    await mkdir(join(WURZEL, '.cache'), { recursive: true });
    await writeFile(berichtVon('pruefbefunde.json'), JSON.stringify(ergebnisse, null, 1));
  }
  if (modus === 'release') {
    if (alleP.size || konfigP.length) { console.error(`Release verweigert: ${konfigP.length} Platzhalter in der Konfiguration:\n  ` + konfigP.map((p) => `${p.pfad} (${p.beschriftung})`).join('\n  ')); fehler++; }
    if (alleF.size) { console.error(`Release verweigert: ${alleF.size} ungeprüfte Fakten: ${[...alleF].join(', ')}`); fehler++; }
  }
  await mkdir(join(WURZEL, '.cache'), { recursive: true });
  await writeFile(berichtVon('bau-bericht.json'), JSON.stringify(bericht, null, 2));
  if (fehler) { console.error(`Build mit ${fehler} Fehler(n) beendet.`); process.exitCode = 1; }
}

main().catch((e) => { console.error(e.stack || String(e)); process.exitCode = 2; });
