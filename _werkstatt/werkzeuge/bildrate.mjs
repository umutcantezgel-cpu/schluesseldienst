// Bildrate bei CPU-Drosselung: rAF-Intervalle während eines Auslösers (CDP Emulation.setCPUThrottlingRate).
// Verworfen gilt ein Bild mit Intervall > 1,5 × 16,7 ms. Headless ohne GPU: Ersatzmessung (UMGEBUNGSAUSNAHME).
// Aufruf: node _werkstatt/werkzeuge/bildrate.mjs --url <u> --aus <json> [--drossel 4] [--dauer 2000]
//   [--ausloeser laden|scroll|klick:<selektor>] [--max-verworfen 5]
// Exit: 0 ok · 1 Schwelle überschritten · 2 Werkzeugfehler
import { parseArgs } from 'node:util';
import { blockiereExtern, CHROMIUM, importiere, median, schreibeJson, mitMessSperre } from './lib.mjs';

const GRENZE_MS = 1.5 * 16.7;
const UMGEBUNG = 'UMGEBUNGSAUSNAHME: headless ohne GPU; Ersatzmessung über CPU-Drosselung (keine GPU-Bildrate)';

/** Startet Chromium wie lib.starteBrowser; lokal, weil playwright-core (CJS) den Export chromium nur unter default trägt. */
async function starteBrowser() {
  const pw = await importiere('playwright-core');
  return (pw.chromium ?? pw.default.chromium).launch({ executablePath: CHROMIUM, args: ['--no-sandbox'] });
}

/** Startet die rAF-Messschleife und, falls verfügbar, die Long-Animation-Frame-Beobachtung. */
const startMessung = () => {
  window.__bild = { zeiten: [], laufend: true, loaf: [], loafJa: false };
  const s = window.__bild;
  let letzte = null;
  const takt = (t) => { if (!s.laufend) return; if (letzte !== null) s.zeiten.push(t - letzte); letzte = t; requestAnimationFrame(takt); };
  requestAnimationFrame(takt);
  try {
    new PerformanceObserver((liste) => { for (const e of liste.getEntries()) s.loaf.push(e.duration); })
      .observe({ type: 'long-animation-frame', buffered: true });
    s.loafJa = true;
  } catch { s.loafJa = false; }
};
const stoppeMessung = () => { const s = window.__bild; s.laufend = false; return { zeiten: s.zeiten, loaf: s.loaf, loafJa: s.loafJa }; };

async function main() {
  const { values: a } = parseArgs({
    strict: true,
    options: {
      url: { type: 'string' }, aus: { type: 'string' }, drossel: { type: 'string', default: '4' },
      dauer: { type: 'string', default: '2000' }, ausloeser: { type: 'string', default: 'laden' },
      'max-verworfen': { type: 'string', default: '5' },
    },
  });
  if (!a.url || !a.aus) throw new Error('Pflicht: --url <u> und --aus <json>');
  if (!/^(laden|scroll|klick:.+)$/.test(a.ausloeser)) throw new Error('--ausloeser: laden | scroll | klick:<selektor>');
  const drossel = Number(a.drossel); const dauer = Number(a.dauer); const max = Number(a['max-verworfen']);
  if (!(drossel >= 1) || !(dauer > 0) || !Number.isFinite(max)) throw new Error('--drossel ≥ 1, --dauer > 0, --max-verworfen Zahl');

  const browser = await starteBrowser();
  try {
    const kontext = await browser.newContext({ viewport: { width: 390, height: 844 }, bypassCSP: true });
    const extern = await blockiereExtern(kontext);
    const seite = await kontext.newPage();
    const cdp = await kontext.newCDPSession(seite);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: drossel });

    if (a.ausloeser === 'laden') {
      await seite.goto(a.url, { waitUntil: 'commit' });
      await seite.evaluate(startMessung);
      await seite.waitForLoadState('load');
      await seite.waitForTimeout(dauer);
    } else {
      await seite.goto(a.url, { waitUntil: 'load' });
      await seite.evaluate(startMessung);
      if (a.ausloeser === 'scroll') {
        for (let t = 0; t < dauer; t += 100) { await seite.mouse.wheel(0, 100); await seite.waitForTimeout(100); }
      } else {
        await seite.click(a.ausloeser.slice('klick:'.length));
        await seite.waitForTimeout(dauer);
      }
    }
    const roh = await seite.evaluate(stoppeMessung);

    const intervalle = roh.zeiten;
    if (intervalle.length < 2) throw new Error('zu wenige Bilder gemessen');
    const verworfen = intervalle.filter((z) => z > GRENZE_MS).length;
    const anteil = (verworfen / intervalle.length) * 100;
    const loaf = roh.loafJa
      ? { anzahl: roh.loaf.length, dauer_summe_ms: roh.loaf.reduce((s, d) => s + d, 0) }
      : null;
    const daten = {
      werkzeug: 'bildrate', zeitpunkt: new Date().toISOString(), url: a.url, ausloeser: a.ausloeser,
      drossel, dauer_ms: dauer, viewport: '390x844', bilder: intervalle.length, verworfen,
      verworfen_prozent: Number(anteil.toFixed(2)), median_intervall_ms: Number(median(intervalle).toFixed(2)),
      grenze_intervall_ms: Number(GRENZE_MS.toFixed(2)), long_animation_frames: loaf,
      schwelle_max_verworfen: max, blockierte_externe_anfragen: extern.length, umgebungsausnahme: UMGEBUNG,
      ergebnis: anteil > max ? 'verfehlt' : 'ok',
    };
    await schreibeJson(a.aus, daten);

    console.log(`bildrate ${a.ausloeser} ${a.url} (Drossel ${drossel}x, ${daten.bilder} Bilder): verworfen ${anteil.toFixed(1)} % (Schwelle ${max} %), Median-Intervall ${daten.median_intervall_ms} ms`);
    console.log(UMGEBUNG);
    console.log(anteil > max ? `VERFEHLT: ${anteil.toFixed(1)} % > ${max} %` : 'ERGEBNIS: ok');
    process.exitCode = anteil > max ? 1 : 0;
  } finally {
    await browser.close();
  }
}

mitMessSperre('bildrate', main).catch((e) => {
  console.error(`bildrate: Werkzeugfehler: ${e.message}`);
  process.exitCode = 2;
});
