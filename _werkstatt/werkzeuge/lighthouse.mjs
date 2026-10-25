// Lighthouse-Median: je Pfad N Läufe, Median und Spanne je Kennzahl; Exit 1 bei Schwellenverletzung.
// Aufruf: node _werkstatt/werkzeuge/lighthouse.mjs --basis <url> --aus <json> [--pfade /,/x/] [--laeufe 3]
//   [--formfaktor mobile|desktop] [--min-perf N] [--min-a11y N] [--min-bp N] [--min-seo N]
//   [--max-lcp ms] [--max-cls x] [--max-tbt ms] [--max-fcp ms] [--max-si ms]
// Exit: 0 ok · 1 Schwelle verfehlt · 2 Werkzeugfehler
import { parseArgs } from 'node:util';
import { CHROMIUM, importiere, median, schreibeJson, mitMessSperre } from './lib.mjs';

const KATEGORIEN = { perf: 'performance', a11y: 'accessibility', bp: 'best-practices', seo: 'seo' };
const AUDITS = { lcp: 'largest-contentful-paint', cls: 'cumulative-layout-shift', tbt: 'total-blocking-time', fcp: 'first-contentful-paint', si: 'speed-index', bytes: 'total-byte-weight' };
const NAMEN = { perf: 'Performance', a11y: 'Accessibility', bp: 'Best-Practices', seo: 'SEO', lcp: 'LCP', cls: 'CLS', tbt: 'TBT', fcp: 'FCP', si: 'Speed Index', bytes: 'Bytes' };
const KZ = Object.keys(NAMEN);
const SCHWELLEN = [
  { kz: 'perf', art: 'min', opt: 'min-perf' }, { kz: 'a11y', art: 'min', opt: 'min-a11y' },
  { kz: 'bp', art: 'min', opt: 'min-bp' }, { kz: 'seo', art: 'min', opt: 'min-seo' },
  { kz: 'lcp', art: 'max', opt: 'max-lcp' }, { kz: 'cls', art: 'max', opt: 'max-cls' },
  { kz: 'tbt', art: 'max', opt: 'max-tbt' }, { kz: 'fcp', art: 'max', opt: 'max-fcp' }, { kz: 'si', art: 'max', opt: 'max-si' },
];

/** Kennzahlen eines Laufs: Scores 0–100, Zeiten in ms, CLS ohne Einheit. */
function messen(lhr) {
  const werte = {};
  for (const [kz, id] of Object.entries(KATEGORIEN)) werte[kz] = lhr.categories[id].score * 100;
  for (const [kz, id] of Object.entries(AUDITS)) werte[kz] = lhr.audits[id]?.numericValue ?? null;
  // Nicht bestandene, gewichtete Audits der Kategorien außer Performance (zeigt, was Punkte kostet).
  werte.mangel = Object.entries(KATEGORIEN).filter(([kz]) => kz !== 'perf').flatMap(([, id]) => lhr.categories[id].auditRefs
    .filter((r) => r.weight > 0 && lhr.audits[r.id]?.score !== null && lhr.audits[r.id]?.score < 1).map((r) => `${id}/${r.id}`));
  return werte;
}
const gemessen = (werte) => werte.filter(Number.isFinite);
const mediane = (werte) => (gemessen(werte).length ? median(gemessen(werte)) : null);
const spanne = (werte) => { const v = gemessen(werte); return v.length ? Math.max(...v) - Math.min(...v) : null; };
const fmt = (kz, v) => (v === null ? 'n/a' : v.toFixed(kz === 'cls' ? 3 : 0));

async function main() {
  const { values: a } = parseArgs({
    strict: true,
    options: {
      basis: { type: 'string' }, aus: { type: 'string' }, pfade: { type: 'string', default: '/' },
      laeufe: { type: 'string', default: '3' }, formfaktor: { type: 'string', default: 'mobile' },
      ...Object.fromEntries(SCHWELLEN.map((s) => [s.opt, { type: 'string' }])),
    },
  });
  if (!a.basis || !a.aus) throw new Error('Pflicht: --basis <url> und --aus <json>');
  const laeufe = Number(a.laeufe);
  if (!Number.isInteger(laeufe) || laeufe < 1) throw new Error('--laeufe: ganze Zahl ≥ 1');
  if (!['mobile', 'desktop'].includes(a.formfaktor)) throw new Error('--formfaktor: mobile oder desktop');
  const schwellen = {};
  for (const s of SCHWELLEN) {
    if (a[s.opt] === undefined) continue;
    schwellen[s.opt] = Number(a[s.opt]);
    if (!Number.isFinite(schwellen[s.opt])) throw new Error(`--${s.opt} ist keine Zahl`);
  }
  const pfade = a.pfade.split(',').map((p) => p.trim()).filter(Boolean);

  const { default: lighthouse, desktopConfig } = await importiere('lighthouse');
  const { launch } = await importiere('chrome-launcher');
  const chrome = await launch({ chromePath: CHROMIUM, chromeFlags: ['--headless=new', '--no-sandbox'] });
  const seiten = [];
  try {
    for (const pfad of pfade) {
      const url = new URL(pfad, a.basis).href;
      const einzel = [];
      for (let i = 0; i < laeufe; i++) {
        const { lhr } = await lighthouse(url, {
          port: chrome.port, logLevel: 'error', formFactor: a.formfaktor,
          onlyCategories: Object.values(KATEGORIEN),
        }, a.formfaktor === 'desktop' ? desktopConfig : undefined) ?? {};
        if (!lhr || lhr.runtimeError) throw new Error(`${url}: ${lhr?.runtimeError?.code ?? 'kein Ergebnis'}`);
        einzel.push(messen(lhr));
      }
      const med = {}; const spannen = {};
      for (const kz of KZ) {
        const werte = einzel.map((e) => e[kz]);
        med[kz] = mediane(werte);
        spannen[kz] = spanne(werte);
      }
      seiten.push({ pfad, url, median: med, spanne: spannen, einzel });
    }
  } finally {
    await chrome.kill();
  }

  const verfehlt = [];
  for (const seite of seiten) {
    for (const s of SCHWELLEN) {
      if (schwellen[s.opt] === undefined) continue;
      const wert = seite.median[s.kz];
      const ok = wert !== null && (s.art === 'min' ? wert >= schwellen[s.opt] : wert <= schwellen[s.opt]);
      if (!ok) verfehlt.push({ pfad: seite.pfad, kz: s.kz, kennzahl: NAMEN[s.kz], wert, grenze: schwellen[s.opt], art: s.art });
    }
  }
  const daten = {
    werkzeug: 'lighthouse', zeitpunkt: new Date().toISOString(), basis: a.basis, formfaktor: a.formfaktor,
    laeufe, schwellen, seiten, verfehlt, ergebnis: verfehlt.length ? 'verfehlt' : 'ok',
  };
  await schreibeJson(a.aus, daten);

  for (const seite of seiten) {
    const label = laeufe === 1 ? 'Lauf' : 'Läufe';
    console.log(`${seite.pfad} (${laeufe} ${label}, Median): ${KZ.map((kz) => `${NAMEN[kz]} ${fmt(kz, seite.median[kz])}`).join(' · ')}`);
  }
  if (verfehlt.length) {
    console.log(`VERFEHLT: ${verfehlt.map((v) => `${v.pfad} ${v.kennzahl} ${fmt(v.kz, v.wert)} (${v.art === 'min' ? '≥' : '≤'} ${v.grenze})`).join('; ')}`);
    process.exitCode = 1;
  } else {
    console.log('ERGEBNIS: ok');
  }
}

mitMessSperre('lighthouse', main).catch((e) => {
  console.error(`lighthouse: Werkzeugfehler: ${e.message}`);
  process.exitCode = 2;
});
