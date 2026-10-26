// Weg a (D-E5-04): "CSS je Seite" mit hypothetischer app.css (Druck- und Kontraststile zusammengefuehrt).
// Nur Lesen und Rechnen. Schreibt ausschliesslich nach OUT (weg-a.json und hyp-dist mit Symlinks).
import { readFile, writeFile, mkdir, readdir, symlink, unlink, rmdir } from 'node:fs/promises';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const DIST = '/home/user/schluesseldienst/.cache/e5-final/dist';
const OUT = '/home/user/schluesseldienst/.cache/a1-vergleich/weg-a';
const HYP = join(OUT, 'hyp-dist');
const JSON_OUT = join(OUT, 'weg-a.json');
const BUDGETS = '/home/user/schluesseldienst/bau/pruefen/budgets.mjs';
const GRENZE = 14336; // budgets.mjs GRENZE.cssGz

const gz = (buf) => gzipSync(buf, { level: 9 }).length;
const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');
const enc = (s) => Buffer.from(s, 'utf8');

// Kopie von attribute() aus budgets.mjs (dort nicht exportiert), gleiche Regex
function attribute(tag) {
  const werte = {};
  for (const m of tag.matchAll(/\s([a-zA-Z-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g)) {
    werte[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4];
  }
  return werte;
}

async function dateienIn(dir, rel = '') {
  const out = [];
  for (const e of await readdir(join(dir, rel), { withFileTypes: true })) {
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...(await dateienIn(dir, r)));
    else if (e.isFile()) out.push(r);
  }
  return out;
}

// Nur fuer HYP: entfernt Symlinks und eigene Dateien, folgt keinen Symlinks
async function leeren(dir) {
  let ents;
  try { ents = await readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const e of ents) {
    const p = join(dir, e.name);
    if (e.isSymbolicLink() || e.isFile()) await unlink(p);
    else if (e.isDirectory()) { await leeren(p); await rmdir(p); }
  }
}

const gelesen = new Map();
async function lesen(href) {
  if (!gelesen.has(href)) {
    const buf = await readFile(join(DIST, href));
    gelesen.set(href, { href, buf, bytes: buf.length, gz: gz(buf), sha256: sha256(buf) });
  }
  return gelesen.get(href);
}

const zeitstempel = new Date().toISOString();
await mkdir(OUT, { recursive: true });

const { ohneSonderMedien, pruefe } = await import(pathToFileURL(BUDGETS).href);
const budgetsBuf = await readFile(BUDGETS);

const alle = (await dateienIn(DIST)).sort();
const htmlDateien = alle.filter((f) => f.endsWith('.html'));
const cssDateien = alle.filter((f) => f.startsWith('assets/') && f.endsWith('.css'));
const finde = (re) => {
  const t = cssDateien.filter((f) => re.test(f.slice('assets/'.length)));
  if (t.length !== 1) throw new Error(`${re}: ${t.length} Treffer`);
  return '/' + t[0];
};
const APP = finde(/^app\.[^/]+\.css$/);
const DRUCK = finde(/^druck\.[^/]+\.css$/);
const KONTRAST = finde(/^kontrast\.[^/]+\.css$/);
const APP_NAME = APP.slice('/assets/'.length);

// Seiten: alle HTML-Dateien in dist; Stylesheet-Links wie in budgets.mjs (rel exakt, href /assets/, Sonder-Medien ausgenommen)
const seiten = [];
for (const f of htmlDateien) {
  const datei = '/' + f;
  const html = (await readFile(join(DIST, f))).toString('utf8');
  const ansicht = [];
  const sonder = [];
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    const a = attribute(m[0]);
    if (a.rel !== 'stylesheet' || !a.href?.startsWith('/assets/')) continue;
    if (a.media === 'print' || /forced-colors/.test(a.media ?? '')) { sonder.push(`${a.href}|${a.media}`); continue; }
    ansicht.push(a.href);
    await lesen(a.href);
  }
  seiten.push({ datei, ansicht, sonder });
}

const app = await lesen(APP);
const druck = await lesen(DRUCK);
const kontrast = await lesen(KONTRAST);

// Hypothetische app.css: app + druck + kontrast; keine doppelte Huelle, wenn druck/kontrast schon @media enthalten
const druckHuelle = /@media[^{]*\bprint\b[^{]*\{/.test(druck.buf.toString('utf8'));
const kontrastHuelle = /@media[^{]*forced-colors[^{]*\{/.test(kontrast.buf.toString('utf8'));
const appSonderBloecke = (app.buf.toString('utf8').match(/@media[^{]*\b(?:print|forced-colors)\b[^{]*\{/g) ?? []).length;
const hypBuf = Buffer.concat([
  app.buf,
  druckHuelle ? druck.buf : Buffer.concat([enc('@media print{'), druck.buf, enc('}')]),
  kontrastHuelle ? kontrast.buf : Buffer.concat([enc('@media (forced-colors: active){'), kontrast.buf, enc('}')]),
]);
// Literale Variante mit zusaetzlicher Huelle (nur zur Einordnung)
const hypDoppelBuf = Buffer.concat([
  app.buf, enc('@media print{'), druck.buf, enc('}'),
  enc('@media (forced-colors: active){'), kontrast.buf, enc('}'),
]);
const hypGz = gz(hypBuf);
const hypDoppelGz = gz(hypDoppelBuf);
const zuwachs = hypGz - app.gz;
const hypOhneSonderGz = gz(enc(ohneSonderMedien(hypBuf.toString('utf8'))));

// Summen je Seite
const vorherWerte = seiten.map((s) => ({ datei: s.datei, bytes: s.ansicht.reduce((a, h) => a + gelesen.get(h).gz, 0) }));
const nachherWerte = seiten.map((s) => ({ datei: s.datei, bytes: s.ansicht.reduce((a, h) => a + (h === APP ? hypGz : gelesen.get(h).gz), 0) }));
const sensWerte = seiten.map((s) => ({ datei: s.datei, bytes: s.ansicht.reduce((a, h) => a + (h === APP ? hypOhneSonderGz : gelesen.get(h).gz), 0) }));

function statistik(werte) {
  const max = werte.reduce((m, w) => (w.bytes > m.bytes ? w : m), werte[0]);
  return {
    seitenAnzahl: werte.length,
    maxPfad: max.datei,
    maxBytes: max.bytes,
    maxAnzahlGleich: werte.filter((w) => w.bytes === max.bytes).length,
    seitenUeberGrenze: werte.filter((w) => w.bytes > GRENZE).length,
    grenze: GRENZE,
  };
}
const top10 = (werte) => [...werte].sort((a, b) => b.bytes - a.bytes || (a.datei < b.datei ? -1 : 1)).slice(0, 10);

const abweichungen = nachherWerte.filter((w, i) => {
  const soll = seiten[i].ansicht.includes(APP) ? zuwachs : 0;
  return w.bytes - vorherWerte[i].bytes !== soll;
}).length;

// Kreuzpruefung: budgets.mjs pruefe() gegen dist (vorher) und gegen hyp-dist (nachher, mit hypothetischer app.css)
const ctxBasis = {
  seiten: seiten.map((s) => ({ datei: s.datei })),
  dateien: [],
  assets: { css: { pfad: APP }, ansichten: {} },
};
const messungText = (befunde) => befunde.find((b) => b.regel === 'budgets/messung')?.meldung ?? '';
const pVor = await pruefe({ ...ctxBasis, dist: DIST });
const mVor = messungText(pVor);

await leeren(HYP);
await mkdir(join(HYP, 'assets'), { recursive: true });
for (const e of await readdir(DIST, { withFileTypes: true })) {
  if (e.name === 'assets') continue;
  await symlink(join(DIST, e.name), join(HYP, e.name));
}
for (const e of await readdir(join(DIST, 'assets'), { withFileTypes: true })) {
  if (e.name === APP_NAME) continue;
  await symlink(join(DIST, 'assets', e.name), join(HYP, 'assets', e.name));
}
await writeFile(join(HYP, 'assets', APP_NAME), hypBuf);
const pNach = await pruefe({ ...ctxBasis, dist: HYP });
const mNach = messungText(pNach);

const kreuz = {
  vorher: {
    pruefeCssSeiteMax: Number(mVor.match(/je Seite max (\d+) B/)?.[1]),
    pruefeCssGemeinsamGz: Number(mVor.match(/CSS gz gemeinsam (\d+) B/)?.[1]),
    pruefeFindingsCssSeite: pVor.filter((b) => b.regel === 'budgets/css-seite').length,
  },
  nachher: {
    pruefeCssSeiteMax: Number(mNach.match(/je Seite max (\d+) B/)?.[1]),
    pruefeCssGemeinsamGz: Number(mNach.match(/CSS gz gemeinsam (\d+) B/)?.[1]),
    pruefeFindingsCssSeite: pNach.filter((b) => b.regel === 'budgets/css-seite').length,
  },
};
kreuz.vorher.abgleichReplik = kreuz.vorher.pruefeCssSeiteMax === statistik(vorherWerte).maxBytes;
kreuz.nachher.abgleichReplik = kreuz.nachher.pruefeCssSeiteMax === statistik(nachherWerte).maxBytes;
kreuz.nachher.gemeinsamGleichHyp = kreuz.nachher.pruefeCssGemeinsamGz === hypGz;

const ansichtenGelesen = [...gelesen.values()]
  .filter((x) => x.href !== APP && x.href !== DRUCK && x.href !== KONTRAST)
  .map((x) => ({ pfad: x.href, bytes: x.bytes, gz: x.gz, sha256: x.sha256 }));

const ergebnis = {
  methode: 'Replik der Summe aus budgets.mjs: je HTML-Seite in dist die <link rel="stylesheet" href="/assets/..."> ohne media print/forced-colors, je Datei gzip Stufe 9, Summe je Seite. Hypothetische app.css = app + druck + kontrast als Rohbytes; druck und kontrast enthalten bereits eigene @media-Huellen (print bzw. forced-colors, innerhalb @layer hilfen), daher keine zweite Huelle; die literale Variante mit zusaetzlicher Huelle ist separat als appMitSonderGzDoppelHuelle gemessen. Nachher: gleiche Summe mit gz(hypothetische app) statt gz(app); die Sonder-Links entfallen, sie wurden ohnehin nicht gezaehlt. Der Pruefer zaehlt die Datei app.css fuer "CSS je Seite" voll (ohne ohneSonderMedien), die Sonder-Bloecke bleiben also in der Summe. Kreuzpruefung: pruefe() aus budgets.mjs auf dist (vorher) und auf hyp-dist (nachher, Symlinks plus hypothetische app.css).',
  zeitstempel,
  skript: join(OUT, 'weg-a.mjs'),
  json: JSON_OUT,
  dist: DIST,
  budgets: { datei: BUDGETS, sha256: sha256(budgetsBuf), gzipStufe: 9, grenzeCssGz: GRENZE },
  dateien: {
    app: { pfad: APP, bytes: app.bytes, gz: app.gz, sha256: app.sha256 },
    druck: { pfad: DRUCK, bytes: druck.bytes, gz: druck.gz, sha256: druck.sha256 },
    kontrast: { pfad: KONTRAST, bytes: kontrast.bytes, gz: kontrast.gz, sha256: kontrast.sha256 },
    ansichten: ansichtenGelesen,
    hypothetischeApp: { bytes: hypBuf.length, gz: hypGz, sha256: sha256(hypBuf), geschrieben: join(HYP, 'assets', APP_NAME) },
    hypothetischeAppDoppelHuelle: { bytes: hypDoppelBuf.length, gz: hypDoppelGz, sha256: sha256(hypDoppelBuf) },
  },
  huellen: {
    druckHatEigeneMedienHuelle: druckHuelle,
    kontrastHatEigeneMedienHuelle: kontrastHuelle,
    appEnthaeltSonderBloecke: appSonderBloecke,
    zusaetzlicheHuelleGesetzt: false,
  },
  groessen: {
    appGz: app.gz,
    druckGz: druck.gz,
    kontrastGz: kontrast.gz,
    appMitSonderGz: hypGz,
    appMitSonderGzDoppelHuelle: hypDoppelGz,
    zuwachsGz: zuwachs,
    zuwachsGzDoppelHuelle: hypDoppelGz - app.gz,
  },
  seitenStruktur: {
    anzahl: seiten.length,
    ohneAppLink: seiten.filter((s) => !s.ansicht.includes(APP)).length,
    mitMehrAppLinks: seiten.filter((s) => s.ansicht.filter((h) => h === APP).length > 1).length,
    mitSonderPrintLink: seiten.filter((s) => s.sonder.some((x) => x.startsWith(DRUCK))).length,
    mitSonderKontrastLink: seiten.filter((s) => s.sonder.some((x) => x.startsWith(KONTRAST))).length,
    sonderLinksGesamt: seiten.reduce((a, s) => a + s.sonder.length, 0),
  },
  zuwachsKonstant: abweichungen === 0,
  abweichungenVonKonstantemZuwachs: abweichungen,
  vorher: statistik(vorherWerte),
  nachher: statistik(nachherWerte),
  sensitivitaet: {
    beschreibung: 'Nur Einordnung, nicht die Budgetregel: nachher, falls app.css ohne Sonder-Bloecke (ohneSonderMedien) gemessen wuerde.',
    appOhneSonderBloeckeGz: hypOhneSonderGz,
    ...statistik(sensWerte),
  },
  kreuzpruefung: kreuz,
  top10Vorher: top10(vorherWerte),
  top10Nachher: top10(nachherWerte),
  seitenDetail: seiten.map((s, i) => ({ datei: s.datei, vorher: vorherWerte[i].bytes, nachher: nachherWerte[i].bytes, sensitivitaet: sensWerte[i].bytes })),
};

await writeFile(JSON_OUT, JSON.stringify(ergebnis, null, 2) + '\n');

console.log(JSON.stringify({
  zeitstempel,
  appGz: app.gz, druckGz: druck.gz, kontrastGz: kontrast.gz,
  appMitSonderGz: hypGz, appMitSonderGzDoppelHuelle: hypDoppelGz, zuwachsGz: zuwachs,
  vorher: ergebnis.vorher, nachher: ergebnis.nachher, sensitivitaet: { appOhneSonderBloeckeGz: hypOhneSonderGz, maxBytes: ergebnis.sensitivitaet.maxBytes, seitenUeberGrenze: ergebnis.sensitivitaet.seitenUeberGrenze },
  kreuzpruefung: kreuz, zuwachsKonstant: ergebnis.zuwachsKonstant, seitenStruktur: ergebnis.seitenStruktur,
  huellen: ergebnis.huellen,
}, null, 2));
