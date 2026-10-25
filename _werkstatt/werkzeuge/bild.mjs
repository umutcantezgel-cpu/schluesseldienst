// bild.mjs: Bildschirmfoto einer Seite als JPEG (Q70, Pixelverhältnis 1); fremde Anfragen werden blockiert und gezählt.
import { parseArgs } from 'node:util';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { starteBrowser, blockiereExtern, schreibeJson, mitMessSperre } from './lib.mjs';

const istFremd = (u, erlaubt) => {
  const x = new URL(u);
  return !['data:', 'blob:'].includes(x.protocol) && !erlaubt.includes(x.hostname);
};

async function main() {
  const { values: a } = parseArgs({
    options: {
      url: { type: 'string' }, aus: { type: 'string' },
      breite: { type: 'string', default: '390' }, hoehe: { type: 'string', default: '844' },
      schema: { type: 'string', default: 'light' }, bewegung: { type: 'string', default: 'no-preference' },
      voll: { type: 'boolean', default: false },
    },
    strict: true,
  });
  if (!a.url || !a.aus) throw new Error('--url und --aus sind Pflicht');
  if (!['light', 'dark'].includes(a.schema)) throw new Error('--schema light|dark');
  if (!['reduce', 'no-preference'].includes(a.bewegung)) throw new Error('--bewegung reduce|no-preference');
  const breite = Number(a.breite), hoehe = Number(a.hoehe);
  if (!(breite > 0 && hoehe > 0)) throw new Error('--breite und --hoehe müssen positiv sein');
  const url = new URL(a.url);
  const erlaubt = [url.hostname, '127.0.0.1', 'localhost'];

  const browser = await starteBrowser();
  let status = null;
  const fremd = [];
  try {
    const kontext = await browser.newContext({
      viewport: { width: breite, height: hoehe }, deviceScaleFactor: 1,
      colorScheme: a.schema, reducedMotion: a.bewegung,
    });
    await blockiereExtern(kontext, erlaubt);
    kontext.on('request', (r) => { if (istFremd(r.url(), erlaubt)) fremd.push(r.url()); });
    const seite = await kontext.newPage();
    status = (await seite.goto(url.href, { waitUntil: 'load' }))?.status() ?? null;
    await seite.evaluate(() => document.fonts.ready);
    await mkdir(dirname(a.aus), { recursive: true });
    await seite.screenshot({ path: a.aus, type: 'jpeg', quality: 70, fullPage: a.voll, animations: 'disabled' });
    await kontext.close();
  } finally {
    await browser.close();
  }
  const meta = {
    url: url.href, breite, hoehe, schema: a.schema, bewegung: a.bewegung, voll: a.voll,
    status, fremdeAnfragen: fremd, zeitpunkt: new Date().toISOString(),
  };
  await schreibeJson(`${a.aus}.json`, meta);
  console.log(`bild: ${url.href} ${breite}x${hoehe} ${a.schema} → ${a.aus} (Status ${status}, fremde Anfragen ${fremd.length})`);
  return 0;
}

mitMessSperre('bild', main).then(
  (code) => process.exit(code),
  (e) => { console.error(`Werkzeugfehler: ${e.message}`); process.exit(2); },
);
