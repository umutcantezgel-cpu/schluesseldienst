// Probe (nur Lesen): Preisrechner-Ausgabe je Lage in Zone A, um den Test F05 richtig aufzusetzen.
import { starteBrowser, blockiereExtern, mitMessSperre } from '/home/user/schluesseldienst/_werkstatt/werkzeuge/lib.mjs';
const txt = async (l) => ((await l.innerText()) || '').replace(/­/g, '').replace(/\s+/g, ' ').trim();
mitMessSperre('z-pruefer-probe-f05', async () => {
  const b = await starteBrowser();
  try {
    const k = await b.newContext({ viewport: { width: 1440, height: 900 } });
    await blockiereExtern(k);
    const s = await k.newPage();
    await s.goto('http://127.0.0.1:4251/preise/', { waitUntil: 'load' });
    const bereich = s.locator('section[aria-labelledby="rechner-titel"]');
    const zeige = async (name) => { const dl = await txt(bereich.locator("dl").first()); const sum = await txt(bereich.locator(".rechner-summe")); console.log(name, "|| DL:", dl.slice(0, 300), "|| SUMME:", sum.slice(0, 200)); };
    await zeige('A tuer-zugefallen werktag');
    for (const pos of ['garage', 'tresor', 'auto', 'zylinder']) {
      await bereich.locator(`input[name="position"][value="${pos}"]`).check({ force: true });
      await zeige(`A ${pos}`);
    }
    await bereich.locator('input[name="zone"][value="D"]').check({ force: true });
    await zeige('D tresor');
    await bereich.locator('input[name="zone"][value="B"]').check({ force: true });
    await bereich.locator('input[name="position"][value="tuer-zugefallen"]').check({ force: true });
    await bereich.locator('input[name="fenster"][value="nacht"]').check({ force: true });
    await zeige('B tuer-zugefallen nacht');
  } finally { await b.close(); }
}).then(() => process.exit(0), (e) => { console.error(e); process.exit(2); });
