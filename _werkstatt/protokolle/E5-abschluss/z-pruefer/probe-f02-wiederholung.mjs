// Probe (nur Lesen): derselbe Ablauf wie F02 (404 → Ortssuche → Ortsseite), fünfmal, Seitenfehler zählen.
import { starteBrowser, blockiereExtern, mitMessSperre } from '/home/user/schluesseldienst/_werkstatt/werkzeuge/lib.mjs';
mitMessSperre('z-pruefer-probe-f02', async () => {
  const b = await starteBrowser();
  const ergebnisse = [];
  try {
    for (let i = 1; i <= 5; i++) {
      const k = await b.newContext({ viewport: { width: 1440, height: 900 } });
      await blockiereExtern(k);
      const s = await k.newPage();
      const fehler = [];
      s.on('pageerror', (e) => fehler.push(e.message.split('\n')[0]));
      s.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) fehler.push(`console: ${m.text()}`); });
      await s.goto('http://127.0.0.1:4251/gibt-es-nicht/', { waitUntil: 'load' });
      await s.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
      await s.locator('#fehler-ort-eingabe').fill('Löhnberg');
      await s.locator('#fehler-ort-liste [role="option"]').first().waitFor({ state: 'visible', timeout: 9000 });
      await s.locator('#fehler-ort-eingabe').press('ArrowDown');
      await s.locator('#fehler-ort-eingabe').press('Enter');
      await s.waitForURL('**/schluesseldienst-loehnberg/', { timeout: 9000 }).catch(() => {});
      await s.waitForTimeout(1500);
      ergebnisse.push({ lauf: i, ziel: new URL(s.url()).pathname, fehler });
      await k.close();
    }
  } finally { await b.close(); }
  console.log(JSON.stringify(ergebnisse, null, 1));
}).then(() => process.exit(0), (e) => { console.error(e); process.exit(2); });
