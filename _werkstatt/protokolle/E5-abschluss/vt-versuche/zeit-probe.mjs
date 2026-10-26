// Beobachtete Ladezeiten (nicht simuliert): FCP und LCP im echten Chromium mit Netz- und CPU-Drosselung wie Lighthouse
// mobil (RTT 150 ms, 1,6 Mbit/s ab, 750 kbit/s auf, CPU 4×), kalter Cache je Lauf. Vergleicht Varianten auf denselben Pfaden.
// Aufruf: node zeit-probe.mjs --aus <datei.json> --laeufe 7 --pfade /,/preise/ --variante name=http://127.0.0.1:port [...]
import { writeFile } from 'node:fs/promises';
import { starteBrowser, blockiereExtern, mitMessSperre } from '/home/user/schluesseldienst/_werkstatt/werkzeuge/lib.mjs';

const args = process.argv.slice(2);
const wert = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };
const AUS = wert('aus');
const LAEUFE = Number(wert('laeufe', '7'));
const PFADE = wert('pfade', '/,/preise/').split(',');
const VARIANTEN = args.flatMap((a, i) => (a === '--variante' ? [args[i + 1]] : [])).map((v) => { const [name, basis] = v.split('='); return { name, basis }; });
if (!AUS || !VARIANTEN.length) { console.error('Aufruf: --aus <datei> --variante name=url [...] [--laeufe 7] [--pfade /,/preise/]'); process.exit(2); }

const median = (a) => { const s = [...a].sort((x, y) => x - y); return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2; };

async function einLauf(b, url) {
  const k = await b.newContext({ viewport: { width: 412, height: 823 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1.75 });
  await blockiereExtern(k);
  await k.addInitScript(() => {
    window.__lcp = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
  const s = await k.newPage();
  const cdp = await k.newCDPSession(s);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await s.goto(url, { waitUntil: 'load', timeout: 60000 });
  await s.waitForTimeout(1500);
  const m = await s.evaluate(() => ({ fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null, lcp: window.__lcp || null }));
  await k.close();
  return m;
}

mitMessSperre('zeit-probe', async () => {
  const b = await starteBrowser();
  const daten = [];
  try {
    // Abwechselnd je Lauf alle Varianten, damit Schwankungen der Umgebung alle gleich treffen
    for (const pfad of PFADE) {
      const reihen = Object.fromEntries(VARIANTEN.map((v) => [v.name, []]));
      for (let i = 0; i < LAEUFE; i++) for (const v of VARIANTEN) reihen[v.name].push(await einLauf(b, v.basis + pfad));
      for (const v of VARIANTEN) {
        const r = reihen[v.name];
        daten.push({ variante: v.name, basis: v.basis, pfad, fcpMedian: Math.round(median(r.map((x) => x.fcp))), lcpMedian: Math.round(median(r.map((x) => x.lcp))), einzel: r.map((x) => ({ fcp: Math.round(x.fcp), lcp: Math.round(x.lcp) })) });
      }
    }
  } finally { await b.close(); }
  await writeFile(AUS, JSON.stringify({ werkzeug: 'zeit-probe', zeitpunkt: new Date().toISOString(), drosselung: 'RTT 150 ms, 1,6 Mbit/s, CPU 4×, kalter Cache', laeufe: LAEUFE, daten }, null, 2) + '\n');
  for (const d of daten) console.log(`${d.pfad} ${d.variante}: FCP ${d.fcpMedian} ms · LCP ${d.lcpMedian} ms (Median aus ${LAEUFE})`);
  return 0;
}).then((c) => process.exit(c), (e) => { console.error(`Werkzeugfehler: ${e.message}`); process.exit(2); });
