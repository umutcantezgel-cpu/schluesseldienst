// Z-06 Prüfung (nur Lesen): auf allen Hauptansichten (1440×900, live-DOM nach dem Laden) jedes <svg> entweder
// aria-hidden="true" oder role="img" mit zugänglichem Namen (aria-label, aria-labelledby oder <title>); doppelte IDs im DOM.
import { writeFile } from 'node:fs/promises';
import { starteBrowser, blockiereExtern, mitMessSperre } from '/home/user/schluesseldienst/_werkstatt/werkzeuge/lib.mjs';
const BASIS = 'http://127.0.0.1:4251';
const ORDNER = '/home/user/schluesseldienst/.cache/e5-abschluss/z-pruefer';
const HAUPT = ['/', '/einbruchschutz/', '/notoeffnung/tueroeffnung/', '/preise/', '/einsatzgebiet/', '/einsatzgebiet/hessen/limburg-weilburg/', '/schluesseldienst-loehnberg/', '/ratgeber/rauchmelderpflicht/', '/ueber-uns/', '/kontakt/', '/suche/', '/impressum/', '/gibt-es-nicht/'];
mitMessSperre('z-pruefer-svg-ids', async () => {
  const b = await starteBrowser();
  const ergebnis = [];
  try {
    for (const p of HAUPT) {
      const k = await b.newContext({ viewport: { width: 1440, height: 900 } });
      await blockiereExtern(k);
      const s = await k.newPage();
      await s.goto(new URL(p, BASIS).href, { waitUntil: 'load' });
      await s.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
      const r = await s.evaluate(() => {
        const svgs = [...document.querySelectorAll('svg')];
        const namen = (e) => {
          if (e.getAttribute('aria-label')?.trim()) return e.getAttribute('aria-label').trim();
          const ids = (e.getAttribute('aria-labelledby') || '').split(/\s+/).filter(Boolean);
          const t = ids.map((i) => document.getElementById(i)?.textContent?.trim() ?? '').join(' ').trim();
          if (t) return t;
          return e.querySelector(':scope > title')?.textContent?.trim() ?? '';
        };
        const fehlend = [];
        let ok = 0;
        for (const e of svgs) {
          if (e.getAttribute('aria-hidden') === 'true') { ok += 1; continue; }
          if (e.getAttribute('role') === 'img' && namen(e)) { ok += 1; continue; }
          fehlend.push(`${e.getAttribute('class') ?? '(ohne class)'} role=${e.getAttribute('role')} aria-hidden=${e.getAttribute('aria-hidden')} ${e.outerHTML.slice(0, 110)}`);
        }
        const zaehl = {};
        for (const e of document.querySelectorAll('[id]')) zaehl[e.id] = (zaehl[e.id] || 0) + 1;
        const doppelt = Object.entries(zaehl).filter(([, n]) => n > 1).map(([id, n]) => `${id} ×${n}`);
        const verweise = [...document.querySelectorAll('use[href^="#"]')].map((u) => u.getAttribute('href').slice(1));
        const fehlendeZiele = [...new Set(verweise)].filter((id) => !document.getElementById(id));
        return { svg: svgs.length, ok, fehlend, doppelt, fehlendeZiele, ids: Object.keys(zaehl).length };
      });
      ergebnis.push({ pfad: p, ...r });
      console.log(`${p}: svg ${r.svg}, ok ${r.ok}, fehlend ${r.fehlend.length}, doppelte IDs ${r.doppelt.length}, fehlende use-Ziele ${r.fehlendeZiele.length}`);
      await k.close();
    }
  } finally { await b.close(); }
  await writeFile(`${ORDNER}/svg-ids.json`, JSON.stringify({ werkzeug: 'svg-ids', basis: BASIS, zeitpunkt: new Date().toISOString(), ergebnis }, null, 2) + '\n');
  const fehl = ergebnis.reduce((a, e) => a + e.fehlend.length, 0);
  const dopp = ergebnis.reduce((a, e) => a + e.doppelt.length, 0);
  const use = ergebnis.reduce((a, e) => a + e.fehlendeZiele.length, 0);
  console.log(`Summe: svg ${ergebnis.reduce((a, e) => a + e.svg, 0)}, ohne Name/verborgen ${fehl}, doppelte IDs ${dopp}, fehlende use-Ziele ${use}`);
  if (fehl || dopp) process.exitCode = 1;
}).then(() => process.exit(process.exitCode ?? 0), (e) => { console.error(e); process.exit(2); });
