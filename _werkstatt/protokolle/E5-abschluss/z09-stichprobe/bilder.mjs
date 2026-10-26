// Z-09 Sichtungsbilder: erster Bildschirm (nur sichtbarer Ausschnitt) je Stichprobenseite.
// Aufruf: node bilder.mjs --pfade-datei <liste> --aus-ordner <ordner> --index <json>
import { parseArgs } from 'node:util';
import { readFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { starteBrowser, blockiereExtern, schreibeJson, mitMessSperre } from '/home/user/schluesseldienst/_werkstatt/werkzeuge/lib.mjs';

const BASIS = 'http://127.0.0.1:4251';
const GERAETE = [
  { geraet: 'mobil', breite: 390, hoehe: 844, schema: 'hell' },
  { geraet: 'tablet', breite: 768, hoehe: 1024, schema: 'hell' },
  { geraet: 'desktop', breite: 1440, hoehe: 900, schema: 'hell' },
  { geraet: 'mobil', breite: 390, hoehe: 844, schema: 'dunkel' },
];
const istFremd = (u, erlaubt) => { const x = new URL(u); return !['data:', 'blob:'].includes(x.protocol) && !erlaubt.includes(x.hostname); };
const dateiname = (pfad) => pfad.replace(/^\/|\/$/g, '').replace(/\//g, '-');

async function main() {
  const { values: a } = parseArgs({ strict: true, options: { 'pfade-datei': { type: 'string' }, 'aus-ordner': { type: 'string' }, index: { type: 'string' } } });
  const pfade = (await readFile(a['pfade-datei'], 'utf8')).split('\n').map((s) => s.trim()).filter(Boolean);
  const erlaubt = ['127.0.0.1', 'localhost'];
  const eintraege = [];
  const browser = await starteBrowser();
  try {
    for (const pfad of pfade) {
      for (const g of GERAETE) {
        const kontext = await browser.newContext({ viewport: { width: g.breite, height: g.hoehe }, deviceScaleFactor: 1, colorScheme: g.schema === 'dunkel' ? 'dark' : 'light', reducedMotion: 'no-preference' });
        const blockiert = await blockiereExtern(kontext, erlaubt);
        const fremd = [];
        kontext.on('request', (r) => { if (istFremd(r.url(), erlaubt)) fremd.push(r.url()); });
        const seite = await kontext.newPage();
        const konsole = [];
        seite.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') konsole.push(`${m.type()}: ${m.text()}`); });
        const status = (await seite.goto(new URL(pfad, BASIS).href, { waitUntil: 'load' }))?.status() ?? null;
        await seite.evaluate(() => document.fonts.ready);
        const dunkelAktiv = await seite.evaluate(() => matchMedia('(prefers-color-scheme: dark)').matches);
        const datei = `${dateiname(pfad)}__${g.geraet}__${g.schema}.jpg`;
        await mkdir(a['aus-ordner'], { recursive: true });
        await seite.screenshot({ path: join(a['aus-ordner'], datei), type: 'jpeg', quality: 70, fullPage: false, animations: 'disabled' });
        await kontext.close();
        eintraege.push({ pfad, geraet: g.geraet, breite: g.breite, hoehe: g.hoehe, schema: g.schema, bild: join(a['aus-ordner'], datei), status, dunkelAktiv, fremdeAnfragen: fremd, konsole, blockiert: blockiert.length });
        console.log(`${datei} status=${status} dunkel=${dunkelAktiv} fremd=${fremd.length} konsole=${konsole.length}`);
      }
    }
  } finally {
    await browser.close();
  }
  await schreibeJson(a.index, { werkzeug: 'z09-bilder', basis: BASIS, zeitpunkt: new Date().toISOString(), anzahlBilder: eintraege.length, eintraege });
  return 0;
}

mitMessSperre('z09-bilder', main).then(
  (code) => process.exit(code),
  (e) => { console.error(`Werkzeugfehler: ${e.message}`); process.exit(2); },
);
