// og.mjs: rendert die OG-Vorschaubilder (1200 × 630 PNG) je Seitentyp und Zone aus der HTML-Vorlage
// _werkstatt/werkzeuge/og/vorlage.html. Schrift (lokal, file-URL) und Farben kommen aus dem Repo;
// jede andere Anfrage wird blockiert und gezählt.
// Aufruf (aus dem Repo-Wurzelverzeichnis): node _werkstatt/werkzeuge/og.mjs [--nur <name>] [--aus src/assets/og] [--klein]
import { parseArgs } from 'node:util';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { starteBrowser, schreibeJson, mitMessSperre } from './lib.mjs';

const HIER = dirname(fileURLToPath(import.meta.url));
const WURZEL = resolve(HIER, '..', '..');
const VORLAGE = join(HIER, 'og', 'vorlage.html');
const SCHRIFT = join(WURZEL, 'src', 'assets', 'schriften', 'atkinson-next-latin-wght.woff2');
const CACHE = join(WURZEL, '.cache', 'E4-GRAF-04');
const BREITE = 1200;
const HOEHE = 630;
const ZIEL_KB = 60;

// Ein Eintrag je Bild: Dateiname (ohne .png), Titel, optionale Unterzeile. Nur diese Texte.
const BILDER = [
  { name: 'standard', titel: 'Schlüsseldienst in Weilburg an der Lahn' },
  { name: 'leistungen', titel: 'Leistungen', unter: 'Schlüsseldienst · Weilburg' },
  { name: 'notoeffnung', titel: 'Notöffnung', unter: 'Schlüsseldienst · Weilburg' },
  { name: 'einbruchschutz', titel: 'Einbruchschutz', unter: 'Schlüsseldienst · Weilburg' },
  { name: 'sicherheitstechnik', titel: 'Sicherheitstechnik', unter: 'Schlüsseldienst · Weilburg' },
  { name: 'einbau-tresore', titel: 'Einbau & Tresore', unter: 'Schlüsseldienst · Weilburg' },
  { name: 'preise', titel: 'Preise, die am Ende stimmen' },
  { name: 'ratgeber', titel: 'Ratgeber: Schloss, Schlüssel, Einbruchschutz' },
  { name: 'einsatzgebiet', titel: 'Einsatzgebiet ab Weilburg' },
  { name: 'ort-nah', titel: 'Schlüsseldienst für Ihren Ort – aus Weilburg' },
  { name: 'ort-fern', titel: 'Planbare Arbeiten nach Absprache – aus Weilburg' },
];

const escapen = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Setzt Schrift-URL, Titel und Unterzeile in die vorlage.html ein (Funktionsersatz: keine $-Sonderregeln). */
function seiteHtml(vorlage, bild) {
  const unter = bild.unter ? `<p class="unter">${escapen(bild.unter)}</p>` : '';
  return vorlage
    .replace('{{SCHRIFT}}', () => pathToFileURL(SCHRIFT).href)
    .replace('{{TITEL}}', () => escapen(bild.titel))
    .replace('{{UNTER}}', () => unter);
}

async function kleinVorschau(browser, ausDir, namen) {
  const ordner = join(CACHE, 'klein');
  await mkdir(ordner, { recursive: true });
  const kontext = await browser.newContext({ viewport: { width: 300, height: 158 }, deviceScaleFactor: 1 });
  await kontext.route('**/*', (route) => (route.request().url().startsWith('file:') ? route.continue() : route.abort()));
  const seite = await kontext.newPage();
  for (const name of namen) {
    const html = join(ordner, `${name}.html`);
    const png = pathToFileURL(join(ausDir, `${name}.png`)).href;
    await writeFile(html, `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>html,body{margin:0}img{display:block;width:300px;height:158px}</style></head><body><img src="${png}" alt=""></body></html>`);
    await seite.goto(pathToFileURL(html).href, { waitUntil: 'load' });
    await seite.evaluate(() => document.images[0].decode());
    await seite.screenshot({ path: join(ordner, `${name}.png`), type: 'png' });
  }
  await kontext.close();
  return ordner;
}

async function main() {
  const { values: a } = parseArgs({
    options: {
      nur: { type: 'string' },
      aus: { type: 'string', default: 'src/assets/og' },
      klein: { type: 'boolean', default: false },
    },
    strict: true,
  });
  const auswahl = a.nur ? BILDER.filter((b) => b.name === a.nur.replace(/\.png$/, '')) : BILDER;
  if (!auswahl.length) throw new Error(`--nur: unbekannter Name „${a.nur}“`);
  const ausDir = resolve(WURZEL, a.aus);
  await mkdir(ausDir, { recursive: true });
  await mkdir(join(CACHE, 'html'), { recursive: true });
  const vorlage = await readFile(VORLAGE, 'utf8');

  const browser = await starteBrowser();
  const fremd = [];
  const bericht = [];
  try {
    const kontext = await browser.newContext({
      viewport: { width: BREITE, height: HOEHE }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce',
    });
    await kontext.route('**/*', (route) => {
      const url = route.request().url();
      if (url.startsWith('file:') || url.startsWith('data:')) return route.continue();
      fremd.push(url);
      return route.abort();
    });
    const seite = await kontext.newPage();
    for (const bild of auswahl) {
      const datei = join(CACHE, 'html', `${bild.name}.html`);
      await writeFile(datei, seiteHtml(vorlage, bild));
      await seite.goto(pathToFileURL(datei).href, { waitUntil: 'load' });
      await seite.waitForFunction(() => window.og !== undefined);
      const info = await seite.evaluate(() => window.og);
      if (!info.ok) throw new Error(`${bild.name}: ${info.fehler}`);
      if (!info.schrift) throw new Error(`${bild.name}: Schrift Atkinson Hyperlegible Next nicht geladen`);
      await seite.evaluate(() => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok))));
      const pfad = join(ausDir, `${bild.name}.png`);
      await seite.screenshot({ path: pfad, type: 'png', animations: 'disabled' });
      const bytes = (await stat(pfad)).size;
      const eintrag = { datei: `${bild.name}.png`, bytes, kb: Math.round(bytes / 1024 * 10) / 10, titelPx: info.groesse, zeilen: info.zeilen, basisPx: info.basis, zielKbEingehalten: bytes <= ZIEL_KB * 1024 };
      bericht.push(eintrag);
      console.log(`og: ${eintrag.datei} · ${eintrag.kb} KB · Titel ${info.groesse} px · ${info.zeilen} Zeile(n)${eintrag.zielKbEingehalten ? '' : ' · ÜBER ZIEL 60 KB'}`);
    }
    await kontext.close();
    if (a.klein) {
      const ordner = await kleinVorschau(browser, ausDir, bericht.map((e) => e.datei.replace(/\.png$/, '')));
      console.log(`klein (300 px Breite): ${ordner}`);
    }
  } finally {
    await browser.close();
  }
  await schreibeJson(join(CACHE, 'og-bericht.json'), { zeitpunkt: new Date().toISOString(), ausgabe: ausDir, fremdeAnfragen: fremd, bilder: bericht });
  if (fremd.length) console.log(`fremde Anfragen blockiert: ${fremd.length}`);
  return 0;
}

mitMessSperre('og', main).then(
  (code) => process.exit(code),
  (e) => { console.error(`Werkzeugfehler: ${e.message}`); process.exit(2); },
);
