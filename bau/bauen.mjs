#!/usr/bin/env node
// Generator: erzeugt die statische Website in dist/ (oder --aus=…).
// Modi: --vorschau (Standard, noindex) · --messen (indexierbar, lokaler Origin) · --release (strikt).
// Weitere Schalter: --pruefen · --aus=<ordner> · --port=<n> · --datum=JJJJ-MM-TT · --ziel=apache|nginx|netlify|cloudflare
//                   --stichprobe=<n> (nur n Ortsseiten) · --nur=<pfadpräfix> · --vorkomprimieren (.br/.gz zu Textdateien)
import { parseArgs } from 'node:util';
import { execFileSync } from 'node:child_process';
import { readdir, readFile, writeFile, mkdir, rm, rename } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { cssBuendeln, ansichtenBuendeln, sonderstileBuendeln, jsBuendeln, statischeAssets, hash10, sri } from './lib/assets.mjs';
import { Schreiber } from './lib/schreiben.mjs';
import { vorkomprimieren, veralteteVariantenEntfernen } from './lib/vorkomprimieren.mjs';
import { aufloesen } from './lib/markierung.mjs';
import { ueberschriftenTrennen } from './lib/trennen.mjs';
import { platzhalterIn, istPlatzhalter } from './lib/platzhalter.mjs';
import { setzeRoutenPruefer, fehlendeLinksHolen } from './lib/inhalt.mjs';
import { sitemaps, robots, securityTxt, manifest } from './lib/dateien.mjs';
import { headersDatei, htaccess, nginx, pruefeWeiterleitungen } from './lib/hosting.mjs';
import { pruefeAlles, auswerten, RELEASE_STRENG } from './pruefen/index.mjs';
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
    stichprobe: { type: 'string' }, nur: { type: 'string' }, still: { type: 'boolean' }, vorkomprimieren: { type: 'boolean' },
  },
});

const modus = arg.release ? 'release' : arg.messen ? 'messen' : 'vorschau';
const log = (...t) => { if (!arg.still) console.log(...t); };
const start = performance.now();

// Datum aus dem Commit (PLAN: Determinismus). Ohne eigenen Git-Checkout verweigert der Release, statt still
// ein festes Datum in Sitemap und security.txt (Expires) zu schreiben; Vorschau und Messen melden den Rückfall.
function commitDatum() {
  if (arg.datum) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(arg.datum) || Number.isNaN(Date.parse(`${arg.datum}T00:00:00Z`))) throw new Error(`--datum=${arg.datum} ist kein gültiges Datum (JJJJ-MM-TT).`);
    return `${arg.datum}T00:00:00Z`;
  }
  const opt = { cwd: WURZEL, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] };
  try {
    // nur der eigene Checkout zählt, nicht ein umgebendes fremdes Repo (Kopien unter .cache/)
    if (resolve(execFileSync('git', ['rev-parse', '--show-toplevel'], opt).trim()) === WURZEL) {
      const d = execFileSync('git', ['log', '-1', '--format=%cI'], opt).trim();
      if (d) return d;
    }
  } catch { /* kein Git-Checkout */ }
  if (modus === 'release') throw new Error('Release: kein Commit-Datum gefunden (Kopie ohne .git?). --datum=JJJJ-MM-TT angeben.');
  console.warn('Hinweis: kein Commit-Datum gefunden – Sitemap-lastmod und security.txt-Expires nutzen 2026-01-01. Mit --datum=JJJJ-MM-TT setzen.');
  return '2026-01-01T00:00:00Z';
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
  // Vorkomprimierte Varianten nutzen nur Apache und nginx; Netlify und Cloudflare komprimieren selbst und würden
  // die Dateien sonst als öffentliche Zusatzdateien ausliefern.
  if (arg.vorkomprimieren && arg.ziel && !['apache', 'nginx'].includes(arg.ziel)) throw new Error(`--vorkomprimieren nur mit --ziel=apache oder nginx (nicht ${arg.ziel}).`);
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
  // Ansichts-Stile: geschrieben wird erst nach dem Sammeln der Seiten, und nur, was eine Seite lädt (einzeln oder als
  // zusammengesetzte Datei „a+b“) – sonst lägen Bündel ohne Verweis im Auslieferungsordner
  const ansichten = {};
  const ansichtTexte = {};
  for (const a of await ansichtenBuendeln(WURZEL, karte)) ansichtTexte[a.name] = a.text;
  // Sonderstile (Druck, erzwungene Farben): eigene Dateien mit media-Angabe, nicht renderblockierend
  const sonderstile = [];
  for (const s of await sonderstileBuendeln(WURZEL, karte)) {
    const buf = Buffer.from(s.text, 'utf8');
    const eintrag = { name: s.name, media: s.media, pfad: `/assets/${s.name}.${hash10(buf)}.css`, sri: sri(buf), bytes: buf.length };
    await schreiber.schreibe(eintrag.pfad, buf);
    sonderstile.push(eintrag);
  }
  // JS je Seite (D-JS-01): Die Vorlage setzt eine Marke; nach dem Rendern bekommt jede Seite das Bündel genau der Module,
  // die sie über data-modul nutzt (gebaut und geschrieben beim ersten Bedarf, je Inhalt einmal).
  const JS_EINSTIEG = join(WURZEL, 'src/assets/js/app.mjs');
  const JS_MARKE = { pfad: '/assets/app.MODULE.js', sri: 'MODULE' };
  const jsJeSchluessel = new Map();
  const jsJePfad = new Map();
  async function jsFuer(namen) {
    const schluessel = [...namen].sort().join(',');
    if (!jsJeSchluessel.has(schluessel)) {
      const buf = Buffer.from((await jsBuendeln(JS_EINSTIEG, { module: new Set(namen) })).text, 'utf8');
      const pfad = `/assets/app.${hash10(buf)}.js`;
      if (!jsJePfad.has(pfad)) {
        await schreiber.schreibe(pfad, buf);
        jsJePfad.set(pfad, { pfad, sri: sri(buf), bytes: buf.length, module: schluessel });
      }
      jsJeSchluessel.set(schluessel, jsJePfad.get(pfad));
    }
    return jsJeSchluessel.get(schluessel);
  }
  const favSvg = String(signet('fav')).replace('<svg class="fav"', '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="#A84A22" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"').replace(' aria-hidden="true" focusable="false"', '');
  const favBuf = Buffer.from(favSvg, 'utf8');
  const favPfad = `/assets/favicon.${hash10(favBuf)}.svg`;
  await schreiber.schreibe(favPfad, favBuf);
  const schriftVorladen = [...karte.entries()].find(([q]) => /atkinson-next-latin-wght/.test(q))?.[1] || null;
  // Kopf-Skript (klassisch, nach den Stil-Links): hält den Parser bis zu den Stylesheets an, damit der Seitenwechsel-Opt-in
  // beim Einfügen von <body> feststeht (D-E5-03). Kommentare fallen weg, die Datei bleibt ein paar hundert Byte klein.
  const kopfText = (await readFile(join(WURZEL, 'src/assets/js/kopf.js'), 'utf8')).replace(/^\s*\/\/.*\n/gm, '');
  const kopfBuf = Buffer.from(kopfText, 'utf8');
  const kopfPfad = `/assets/kopf.${hash10(kopfBuf)}.js`;
  await schreiber.schreibe(kopfPfad, kopfBuf);
  const assets = {
    css: { pfad: cssPfad, sri: sri(cssBuf), bytes: cssBuf.length },
    ansichten,
    sonderstile,
    js: JS_MARKE, // nach dem Rendern: größtes Bündel; alle Bündel in jsBuendel
    favicon: favPfad,
    kopf: { pfad: kopfPfad, sri: sri(kopfBuf) },
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
  // Seiten mit mehreren Ansichts-Stilen laden sie als eine Datei (Name „a+b“), damit vor dem ersten Bild nur zwei
  // Stylesheets nötig sind (gemeinsam + Ansicht); die Bytes je Seite bleiben gleich (D-CSS-01, Nachtrag)
  for (const s of seiten) {
    const namen = s.stile || [];
    const schluessel = namen.join('+');
    if (!namen.length || assets.ansichten[schluessel]) continue;
    const fehlt = namen.find((n) => !(n in ansichtTexte));
    if (fehlt) throw new Error(`Seite ${s.pfad}: unbekannter Ansichts-Stil ${fehlt}`);
    const buf = Buffer.from(namen.map((n) => ansichtTexte[n]).join(''), 'utf8');
    const pfad = `/assets/${namen.join('-')}.${hash10(buf)}.css`;
    await schreiber.schreibe(pfad, buf);
    assets.ansichten[schluessel] = { pfad, sri: sri(buf), bytes: buf.length, ...(namen.length > 1 ? { teile: namen } : {}) };
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
    const aufgeloest = aufloesen(roh);
    const { platzhalter, fakten } = aufgeloest;
    const marke = `<script type="module" src="${JS_MARKE.pfad}" integrity="${JS_MARKE.sri}"></script>`;
    if (!aufgeloest.html.includes(marke)) throw new Error(`${s.pfad}: Skript-Marke der Vorlage fehlt`);
    const js = await jsFuer(new Set([...aufgeloest.html.matchAll(/\sdata-modul="([a-z][a-z0-9-]*)"/g)].map((m) => m[1])));
    const html = ueberschriftenTrennen(aufgeloest.html).replace(marke, `<script type="module" src="${js.pfad}" integrity="${js.sri}"></script>`);
    platzhalter.forEach((p) => alleP.add(p));
    fakten.forEach((f) => alleF.add(f));
    const datei = zielDatei(s.pfad);
    await schreiber.schreibe(datei, html);
    gerendert.push({ pfad: s.pfad, datei, html, typ: s.typ || 'seite', ansicht: s.ansicht, indexierbar: s.indexierbar !== false && s.pfad !== '/404.html', sitemap: s.sitemap || null });
  }
  // Alle JS-Bündel für Prüfer und Bericht; assets.js zeigt auf das größte
  assets.jsBuendel = [...jsJePfad.values()].sort((a, b) => b.bytes - a.bytes);
  if (assets.jsBuendel.length) assets.js = assets.jsBuendel[0];
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

  // Vorkomprimierte Varianten nach dem Schreiben aller Dateien, vor dem Aufräumen (der Schreiber meldet sie dafür als geschrieben)
  const vork = arg.vorkomprimieren ? await vorkomprimieren(schreiber, { ohneAufraeumen: Boolean(nur) }) : null;
  if (!vork) await veralteteVariantenEntfernen(schreiber);
  const entfernt = nur ? 0 : await schreiber.aufraeumen();

  // Platzhalter in der Konfiguration (auch ungerenderte)
  const konfigP = platzhalterIn({ betrieb: konfig.betrieb, preise: konfig.preise, zonen: konfig.zonen });
  const bericht = {
    modus, basisUrl, datum, seiten: gerendert.length, dateien: schreiber.bericht(), entfernt,
    css: assets.css.bytes, js: assets.js.bytes, jsBuendel: (assets.jsBuendel ?? []).map((b) => ({ module: b.module, bytes: b.bytes })), platzhalterAusgabe: alleP.size, platzhalterKonfig: konfigP.length,
    faktenUngeprueft: alleF.size, ms: Math.round(performance.now() - start),
    ...(vork && { vorkomprimiert: vork }),
  };
  log(`Build ${modus}: ${bericht.seiten} Seiten, ${bericht.dateien.geaendert} geändert, ${entfernt} entfernt, CSS ${bericht.css} B, JS ${bericht.jsBuendel.length} Bündel bis ${bericht.js} B, ${bericht.ms} ms`);
  if (vork) log(`Vorkomprimiert: ${vork.neu} neu, ${vork.unveraendert} unverändert, ${vork.zuGross} nicht kleiner, ${vork.entfernt} entfernt · .br ${vork.br} B · .gz ${vork.gz} B (Quellen ${vork.original} B) · ${vork.ms} ms`);
  log(`Platzhalter: ${alleP.size} in der Ausgabe, ${konfigP.length} in der Konfiguration · ungeprüfte Fakten: ${alleF.size}`);

  let fehler = 0;
  if (arg.pruefen || modus === 'release') {
    const dateien = [...schreiber.geschrieben].map((d) => schreiber.relativ(d));
    const ergebnisse = await pruefeAlles({ wurzel: WURZEL, dist: aus, modus, basisUrl, seiten: gerendert, dateien, konfig, assets, daten, geplant });
    const a = auswerten(ergebnisse, { streng: modus === 'release' ? RELEASE_STRENG : [] });
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
  // Ein verweigerter Release hinterlässt keinen hochladbaren Ordner: Die Ausgabe wird beiseitegelegt.
  if (fehler && modus === 'release') {
    const verworfen = `${aus}.verweigert`;
    await rm(verworfen, { recursive: true, force: true });
    await rename(aus, verworfen);
    console.error(`Release verweigert: Ausgabe nach ${verworfen} verschoben – nicht hochladen.`);
  }
}

main().catch((e) => { console.error(e.stack || String(e)); process.exitCode = 2; });
