// Kontrolle zu bildrate (Scroll-Auslöser): Hat das Scrollen die Seite tatsächlich bewegt? Nur messen, Ausgabe in diesem Ordner.
import { starteBrowser, blockiereExtern, mitMessSperre, schreibeJson } from '/home/user/schluesseldienst/_werkstatt/werkzeuge/lib.mjs';
const BASIS = 'http://127.0.0.1:4251';
const ORDNER = '/home/user/schluesseldienst/.cache/e5-final/n5-bewegung';
await mitMessSperre('n5-scrollpruefung', async () => {
  const browser = await starteBrowser();
  const ergebnisse = [];
  try {
    for (const pfad of ['/einbruchschutz/', '/einsatzgebiet/']) {
      const k = await browser.newContext({ viewport: { width: 390, height: 844 }, bypassCSP: true });
      await blockiereExtern(k);
      const seite = await k.newPage();
      await seite.goto(BASIS + pfad, { waitUntil: 'load' });
      const start = await seite.evaluate(() => ({ y: scrollY, hoehe: document.documentElement.scrollHeight, fenster: innerHeight }));
      for (let t = 0; t < 2000; t += 100) { await seite.mouse.wheel(0, 100); await seite.waitForTimeout(100); }
      const ende = await seite.evaluate(() => ({ y: scrollY }));
      ergebnisse.push({ pfad, vorher: start, nachher: ende, bewegt: ende.y > start.y });
      await k.close();
    }
  } finally { await browser.close(); }
  await schreibeJson(`${ORDNER}/scrollpruefung.json`, { werkzeug: 'n5-scrollpruefung', basis: BASIS, zeitpunkt: new Date().toISOString(), ergebnisse });
  for (const e of ergebnisse) process.stdout.write(`${e.pfad}: scrollY ${e.vorher.y} -> ${e.nachher.y} (Seitenhöhe ${e.vorher.hoehe}, Fenster ${e.vorher.fenster}) bewegt=${e.bewegt}\n`);
}).then(() => process.stdout.write('ENDE scrollpruefung\n')).catch((e) => { process.stderr.write(`Fehler: ${e.message}\n`); process.exitCode = 2; });
