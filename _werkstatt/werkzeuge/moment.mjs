// moment.mjs: Großer Moment M-16. Bildschirmfotos eines Elements zu festen Zeitpunkten nach domcontentloaded,
// ohne CPU-Drosselung (CDP-Rate 1). Fremde Anfragen werden blockiert und gezählt.
// Aufruf: node _werkstatt/werkzeuge/moment.mjs --url <u> --selektor <css> --aus <ordner>
//   [--zeiten 0,300,600,900,1300] [--breite 1440] [--hoehe 900]
// Ausgabe: <ordner>/moment-<nn>.jpg (JPEG Q80, locator.screenshot) und <ordner>/moment.json (Ist-Zeiten, Fehler).
// Exit: 0 ok · 2 Werkzeugfehler (Ergebnis unvollständig)
import { parseArgs } from 'node:util';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { starteBrowser, blockiereExtern, schreibeJson, mitMessSperre } from './lib.mjs';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const nn = (n) => String(n).padStart(2, '0');

async function main() {
  const { values: a } = parseArgs({
    strict: true,
    options: {
      url: { type: 'string' }, selektor: { type: 'string' }, aus: { type: 'string' },
      zeiten: { type: 'string', default: '0,300,600,900,1300' },
      breite: { type: 'string', default: '1440' }, hoehe: { type: 'string', default: '900' },
    },
  });
  if (!a.url || !a.selektor || !a.aus) throw new Error('Pflicht: --url, --selektor und --aus <ordner>');
  const zeiten = a.zeiten.split(',').map((z) => Number(z.trim()));
  if (!zeiten.length || zeiten.some((z) => !Number.isFinite(z) || z < 0)) throw new Error('--zeiten: nicht-negative Zahlen in ms');
  zeiten.sort((x, y) => x - y);
  const breite = Number(a.breite), hoehe = Number(a.hoehe);
  if (!(breite > 0 && hoehe > 0)) throw new Error('--breite und --hoehe müssen positiv sein');
  const url = new URL(a.url);
  const erlaubt = [url.hostname, '127.0.0.1', 'localhost'];
  await mkdir(a.aus, { recursive: true });

  const browser = await starteBrowser();
  const fotos = [];
  let extern = [];
  let anzahl = null;
  let ladeZeit = null;
  try {
    const kontext = await browser.newContext({ viewport: { width: breite, height: hoehe }, deviceScaleFactor: 1 });
    extern = await blockiereExtern(kontext, erlaubt);
    const seite = await kontext.newPage();
    const cdp = await kontext.newCDPSession(seite);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    await seite.goto(url.href, { waitUntil: 'domcontentloaded' });
    const t0 = Date.now();
    ladeZeit = new Date(t0).toISOString();
    const ziel = seite.locator(a.selektor);
    anzahl = await ziel.count();

    for (const [i, soll] of zeiten.entries()) {
      const warte = soll - (Date.now() - t0);
      if (warte > 0) await sleep(warte);
      const beginn = Date.now() - t0;
      const datei = `moment-${nn(i + 1)}.jpg`;
      try {
        const bild = await ziel.first().screenshot({ type: 'jpeg', quality: 80, timeout: 10000 });
        await writeFile(join(a.aus, datei), bild);
        fotos.push({ datei, sollMs: soll, istMs: beginn, dauerMs: Date.now() - t0 - beginn, bytes: bild.length });
      } catch (e) {
        fotos.push({ datei, sollMs: soll, istMs: beginn, fehler: String(e.message).split('\n')[0] });
      }
    }
    await kontext.close();
  } finally {
    await browser.close();
  }
  const fehler = fotos.filter((f) => f.fehler).length;
  await schreibeJson(join(a.aus, 'moment.json'), {
    werkzeug: 'moment', url: url.href, selektor: a.selektor, anzahlElemente: anzahl, viewport: `${breite}x${hoehe}`,
    drosselung: 'aus (CDP-Rate 1)', domcontentloaded: ladeZeit, blockierteExterneAnfragen: extern.length, fotos,
    fehler, zeitpunkt: new Date().toISOString(),
  });
  console.log(`moment: ${url.href} ${breite}x${hoehe} "${a.selektor}" (${anzahl} Elemente): ${fotos.length - fehler} Fotos → ${a.aus}, Fehler ${fehler}`);
  return fehler ? 2 : 0;
}

mitMessSperre('moment', main).then(
  (code) => process.exit(code),
  (e) => { console.error(`Werkzeugfehler: ${e.message}`); process.exit(2); },
);
