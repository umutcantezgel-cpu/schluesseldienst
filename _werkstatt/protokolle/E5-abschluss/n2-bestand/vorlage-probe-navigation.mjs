// Probe (nur Lesen): Seitenfehler je Navigationsart, je 3 Läufe. Zeigt, ob der View-Transition-Abbruch nur beim Sprung per Skript auftritt.
import { starteBrowser, blockiereExtern, mitMessSperre } from '/home/user/schluesseldienst/_werkstatt/werkzeuge/lib.mjs';
const FALLE = {
  'gibt-es-nicht → Link /suche/': async (s) => { await s.locator('a[href="/suche/"]').first().click(); await s.waitForURL('**/suche/', { timeout: 9000 }); },
  '/ → Fußlink /impressum/': async (s) => { await s.locator('footer a[href="/impressum/"]').first().click(); await s.waitForURL('**/impressum/', { timeout: 9000 }); },
  'gibt-es-nicht → Ortssuche (Skript-Sprung)': async (s) => { await s.locator('#fehler-ort-eingabe').fill('Löhnberg'); await s.locator('#fehler-ort-liste [role="option"]').first().waitFor({ state: 'visible', timeout: 9000 }); await s.locator('#fehler-ort-eingabe').press('ArrowDown'); await s.locator('#fehler-ort-eingabe').press('Enter'); await s.waitForURL('**/schluesseldienst-loehnberg/', { timeout: 9000 }); },
};
const START = { 'gibt-es-nicht → Link /suche/': '/gibt-es-nicht/', '/ → Fußlink /impressum/': '/', 'gibt-es-nicht → Ortssuche (Skript-Sprung)': '/gibt-es-nicht/' };
mitMessSperre('z-pruefer-probe-nav', async () => {
  const b = await starteBrowser();
  const out = {};
  try {
    for (const [name, aktion] of Object.entries(FALLE)) {
      out[name] = [];
      for (let i = 0; i < 3; i++) {
        const k = await b.newContext({ viewport: { width: 1440, height: 900 } });
        await blockiereExtern(k);
        const s = await k.newPage();
        const fehler = [];
        s.on('pageerror', (e) => fehler.push(e.message.split('\n')[0]));
        await s.goto(`http://127.0.0.1:4251${START[name]}`, { waitUntil: 'load' });
        await s.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
        await aktion(s).catch((e) => fehler.push(`Aktion: ${e.message.split('\n')[0]}`));
        await s.waitForTimeout(1500);
        out[name].push({ ziel: new URL(s.url()).pathname, fehler: fehler.length });
        await k.close();
      }
    }
  } finally { await b.close(); }
  console.log(JSON.stringify(out, null, 1));
}).then(() => process.exit(0), (e) => { console.error(e); process.exit(2); });
