// Diagnose (nur Messung, schreibt nur in den Ordner n5-leistung): alle LCP-Einträge je Lauf,
// gleiche Drosselung wie zeit-probe.mjs (RTT 150 ms, 1,6 Mbit/s, CPU 4×, kalter Cache), Pfad /.
import { writeFile } from 'node:fs/promises';
import { starteBrowser, blockiereExtern, mitMessSperre } from '/home/user/schluesseldienst/_werkstatt/werkzeuge/lib.mjs';

const AUS = process.argv[2];
const URL_ZIEL = 'http://127.0.0.1:4251/';

async function lauf(b) {
  const k = await b.newContext({ viewport: { width: 412, height: 823 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1.75 });
  await blockiereExtern(k);
  await k.addInitScript(() => {
    window.__lcpAlle = [];
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) {
        window.__lcpAlle.push({
          t: e.startTime, groesse: e.size, tag: e.element?.tagName ?? null, id: e.element?.id ?? null,
          klasse: String(e.element?.className ?? '').slice(0, 80), url: e.url ? e.url.slice(0, 120) : null,
        });
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
  const s = await k.newPage();
  const cdp = await k.newCDPSession(s);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await s.goto(URL_ZIEL, { waitUntil: 'load', timeout: 60000 });
  await s.waitForTimeout(1500);
  const m = await s.evaluate(() => ({ fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null, alle: window.__lcpAlle }));
  await k.close();
  return m;
}

mitMessSperre('lcp-diagnose', async () => {
  const b = await starteBrowser();
  const ergebnis = [];
  try {
    for (let i = 0; i < 2; i++) ergebnis.push(await lauf(b));
  } finally {
    await b.close();
  }
  await writeFile(AUS, JSON.stringify(ergebnis, null, 2) + '\n');
  for (const [i, e] of ergebnis.entries()) {
    console.log(`Lauf ${i + 1}: FCP ${Math.round(e.fcp)} ms; LCP-Eintraege: ${e.alle.map((x) => `${Math.round(x.t)} ms ${x.tag}#${x.id} groesse ${x.groesse} url ${x.url}`).join(' | ')}`);
  }
  return 0;
}).then((c) => process.exit(c), (e) => { console.error(`Werkzeugfehler: ${e.message}`); process.exit(2); });
