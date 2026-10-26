// Kontrolle zu axe (Schema hell/dunkel): Greift die Farbschema-Emulation auf der Seite? Nur messen, Ausgabe in diesem Ordner.
import { starteBrowser, blockiereExtern, mitMessSperre, schreibeJson } from '/home/user/schluesseldienst/_werkstatt/werkzeuge/lib.mjs';
const BASIS = 'http://127.0.0.1:4251';
const ORDNER = '/home/user/schluesseldienst/.cache/e5-final/n5-bewegung';
await mitMessSperre('n5-schemapruefung', async () => {
  const browser = await starteBrowser();
  const ergebnisse = [];
  try {
    for (const schema of ['light', 'dark']) {
      const k = await browser.newContext({ bypassCSP: true, colorScheme: schema, viewport: { width: 1440, height: 900 } });
      await blockiereExtern(k);
      const seite = await k.newPage();
      await seite.goto(BASIS + '/', { waitUntil: 'load' });
      const r = await seite.evaluate(() => ({
        prefersDark: matchMedia('(prefers-color-scheme: dark)').matches,
        bodyHintergrund: getComputedStyle(document.body).backgroundColor,
        bodyFarbe: getComputedStyle(document.body).color,
        datenTheme: document.documentElement.getAttribute('data-theme'),
      }));
      ergebnisse.push({ schema, ...r });
      await k.close();
    }
  } finally { await browser.close(); }
  await schreibeJson(`${ORDNER}/schemapruefung.json`, { werkzeug: 'n5-schemapruefung', basis: BASIS, zeitpunkt: new Date().toISOString(), ergebnisse });
  for (const e of ergebnisse) process.stdout.write(`${e.schema}: prefers-color-scheme dark=${e.prefersDark} body-Hintergrund=${e.bodyHintergrund} Text=${e.bodyFarbe} data-theme=${e.datenTheme}\n`);
}).then(() => process.stdout.write('ENDE schemapruefung\n')).catch((e) => { process.stderr.write(`Fehler: ${e.message}\n`); process.exitCode = 2; });
