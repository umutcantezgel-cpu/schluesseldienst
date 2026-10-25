// bildsatz.mjs: je Pfad × Gerät × Schema bis zu 12 Ausschnitte (JPEG Q70, Breite ≤ 1440 px); index.json listet alle Bilder.
import { parseArgs } from 'node:util';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { starteBrowser, blockiereExtern, schreibeJson, GERAETE, mitMessSperre } from './lib.mjs';

const MAX_AUSSCHNITTE = 12;

const slug = (pfad) => pfad.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'start';
const nn = (n) => String(n).padStart(2, '0');

async function main() {
  const { values: a } = parseArgs({
    options: {
      basis: { type: 'string' }, pfade: { type: 'string' }, aus: { type: 'string' },
      schemata: { type: 'string', default: 'light,dark' },
    },
    strict: true,
  });
  if (!a.basis || !a.pfade || !a.aus) throw new Error('--basis, --pfade und --aus sind Pflicht');
  const basis = new URL(a.basis);
  const erlaubt = [basis.hostname, '127.0.0.1', 'localhost'];
  const pfade = a.pfade.split(',').map((p) => p.trim()).filter(Boolean);
  const schemata = a.schemata.split(',').map((s) => s.trim());
  if (!pfade.length || schemata.some((s) => !['light', 'dark'].includes(s))) throw new Error('--pfade leer oder --schemata ungültig');
  await mkdir(a.aus, { recursive: true });

  const bilder = [], seiten = [], namen = new Set();
  const browser = await starteBrowser();
  try {
    for (const pfad of pfade) {
      const url = new URL(pfad, basis);
      for (const geraet of GERAETE) {
        for (const schema of schemata) {
          const kontext = await browser.newContext({
            viewport: { width: geraet.width, height: geraet.height }, deviceScaleFactor: 1, colorScheme: schema,
          });
          await blockiereExtern(kontext, erlaubt);
          const seite = await kontext.newPage();
          const status = (await seite.goto(url.href, { waitUntil: 'load' }))?.status() ?? null;
          await seite.evaluate(() => document.fonts.ready);
          const hoeheGesamt = await seite.evaluate(() => document.documentElement.scrollHeight);
          const noetig = Math.ceil(hoeheGesamt / geraet.height);
          const anzahl = Math.min(MAX_AUSSCHNITTE, Math.max(1, noetig));
          seiten.push({ pfad, geraet: geraet.name, schema, status, hoeheGesamt, ausschnitte: anzahl, gekuerzt: noetig > MAX_AUSSCHNITTE });
          for (let k = 0; k < anzahl; k++) {
            await seite.evaluate((y) => window.scrollTo(0, y), k * geraet.height);
            await seite.evaluate(() => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok))));
            const datei = `${slug(pfad)}__${geraet.name}__${schema}__${nn(k + 1)}.jpg`;
            if (namen.has(datei)) throw new Error(`Dateiname doppelt: ${datei}`);
            namen.add(datei);
            await seite.screenshot({ path: join(a.aus, datei), type: 'jpeg', quality: 70, animations: 'disabled' });
            const scrollY = await seite.evaluate(() => Math.round(window.scrollY));
            bilder.push({ datei, pfad, geraet: geraet.name, schema, nr: k + 1, breite: geraet.width, hoehe: geraet.height, scrollY });
          }
          await kontext.close();
        }
      }
    }
  } finally {
    await browser.close();
  }
  await schreibeJson(join(a.aus, 'index.json'), {
    basis: basis.href, pfade, schemata, zeitpunkt: new Date().toISOString(), seiten, anzahl: bilder.length, bilder,
  });
  console.log(`bildsatz: ${pfade.length} Pfad(e) × ${GERAETE.length} Geräte × ${schemata.length} Schema(ta) → ${bilder.length} Bilder in ${a.aus}`);
  return 0;
}

mitMessSperre('bildsatz', main).then(
  (code) => process.exit(code),
  (e) => { console.error(`Werkzeugfehler: ${e.message}`); process.exit(2); },
);
