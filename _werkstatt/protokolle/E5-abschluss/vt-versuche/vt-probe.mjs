// Diagnose-Probe Seitenwechsel (nur lesen, Versuche des Abschlusses). Grundlage: n2-bestand/probe-seitenwechsel.mjs.
// Aufruf: node vt-probe.mjs --basis http://127.0.0.1:4251 --teil skript|links --geraet desktop|mobil --aus <datei.json>
//         [--laeufe 30] [--ketten 2] [--schritte 24] [--frueh]
// --frueh: Ein Init-Skript (läuft in jedem neuen Dokument vor allen Seitenskripten) fängt die Promises des
//          Seitenwechsel-Übergangs bei pageswap/pagereveal ab (Versuch X1). Ohne --frueh wird nur beobachtet.
// Diagnose in jedem Dokument: pageswap/pagereveal (mit/ohne viewTransition, readyState, ob das Modul schon lief =
// Klasse .js, Zahl der Stylesheets) und unhandledrejection mit Grund und Pfad des Dokuments, in dem sie entsteht.
import { writeFile } from 'node:fs/promises';
import { starteBrowser, blockiereExtern, mitMessSperre } from '/home/user/schluesseldienst/_werkstatt/werkzeuge/lib.mjs';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > 0 ? process.argv[i + 1] : d; };
const BASIS = arg('basis', 'http://127.0.0.1:4251');
const TEIL = arg('teil');
const GERAET = arg('geraet', 'desktop');
const AUS = arg('aus');
const LAEUFE = Number(arg('laeufe', '30'));
const KETTEN = Number(arg('ketten', '2'));
const SCHRITTE = Number(arg('schritte', '24'));
const FRUEH = process.argv.includes('--frueh');
if (!['skript', 'links'].includes(TEIL) || !['desktop', 'mobil'].includes(GERAET) || !AUS) {
  console.error('Aufruf: --teil skript|links --geraet desktop|mobil --aus <datei> [--basis URL] [--frueh]'); process.exit(2);
}

const HAUPT = ['/', '/einbruchschutz/', '/notoeffnung/tueroeffnung/', '/preise/', '/einsatzgebiet/',
  '/einsatzgebiet/hessen/limburg-weilburg/', '/schluesseldienst-loehnberg/', '/ratgeber/rauchmelderpflicht/',
  '/ueber-uns/', '/kontakt/', '/suche/', '/impressum/'];
const ERWARTET_404 = /Failed to load resource: the server responded with a status of 404/;

function diagnose(frueh) {
  const log = (o) => console.debug(`VTDIAG ${JSON.stringify({ pfad: location.pathname, t: Math.round(performance.now()), ...o })}`);
  const zustand = () => ({ bereit: document.readyState, js: document.documentElement?.classList.contains('js') ?? false, stile: document.styleSheets.length });
  const fange = (ev, v) => {
    if (!frueh || !v) return;
    for (const n of ['ready', 'finished', 'updateCallbackDone']) v[n].catch((err) => log({ ev: 'abgefangen', bei: ev, promise: n, grund: String(err?.message ?? err) }));
  };
  addEventListener('pageswap', (e) => { log({ ev: 'pageswap', vt: !!e.viewTransition, ...zustand() }); fange('pageswap', e.viewTransition); }, { capture: true });
  addEventListener('pagereveal', (e) => { log({ ev: 'pagereveal', vt: !!e.viewTransition, ...zustand() }); fange('pagereveal', e.viewTransition); }, { capture: true });
  addEventListener('unhandledrejection', (e) => log({ ev: 'unhandledrejection', grund: String(e.reason?.message ?? e.reason), ...zustand() }));
}

function haenge(seite, ereignisse, diag) {
  seite.on('pageerror', (e) => ereignisse.push({ art: 'pageerror', text: e.message.split('\n')[0], ort: '' }));
  seite.on('console', (m) => {
    if (m.type() === 'debug' && m.text().startsWith('VTDIAG ')) { diag.push(JSON.parse(m.text().slice(7))); return; }
    if (m.type() !== 'error') return;
    ereignisse.push({ art: 'console.error', text: m.text(), ort: m.location()?.url ?? '' });
  });
}

const neuerKontext = async (b) => {
  const opt = GERAET === 'mobil'
    ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }
    : { viewport: { width: 1440, height: 900 } };
  const k = await b.newContext(opt);
  await blockiereExtern(k);
  await k.addInitScript(diagnose, FRUEH);
  return k;
};

async function skriptSprung(b) {
  const k = await neuerKontext(b);
  const s = await k.newPage();
  const ereignisse = []; const diag = [];
  haenge(s, ereignisse, diag);
  let aktion = null;
  await s.goto(`${BASIS}/gibt-es-nicht/`, { waitUntil: 'load' });
  await s.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  try {
    await s.locator('#fehler-ort-eingabe').fill('Löhnberg');
    await s.locator('#fehler-ort-liste [role="option"]').first().waitFor({ state: 'visible', timeout: 9000 });
    await s.locator('#fehler-ort-eingabe').press('ArrowDown');
    await s.locator('#fehler-ort-eingabe').press('Enter');
    await s.waitForURL('**/schluesseldienst-loehnberg/', { timeout: 9000 });
  } catch (e) { aktion = e.message.split('\n')[0]; }
  await s.waitForTimeout(1500);
  const ziel = new URL(s.url()).pathname;
  await k.close();
  return { ziel, erfolg: aktion === null && ziel === '/schluesseldienst-loehnberg/', aktion, ereignisse, diag };
}

async function linkKette(b, schritte) {
  const k = await neuerKontext(b);
  const s = await k.newPage();
  const ereignisse = []; const diag = [];
  haenge(s, ereignisse, diag);
  const wege = [];
  await s.goto(`${BASIS}/`, { waitUntil: 'load' });
  await s.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  const letzte = [];
  for (let i = 0; i < schritte; i++) {
    const von = new URL(s.url()).pathname;
    const kandidaten = await s.evaluate((haupt) => {
      const aktuell = location.pathname;
      const out = [];
      for (const a of document.querySelectorAll('a[href]')) {
        if (!a.getClientRects().length) continue;
        const r = a.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const pfad = new URL(a.href, location.href).pathname;
        if (haupt.includes(pfad) && pfad !== aktuell && !out.some((o) => o.pfad === pfad)) out.push({ pfad, attr: a.getAttribute('href') });
      }
      return out;
    }, HAUPT);
    if (!kandidaten.length) { wege.push({ schritt: i + 1, von, nach: null, erfolg: false, aktion: 'kein sichtbarer Link auf Hauptansicht' }); break; }
    const wahl = kandidaten.find((c) => !letzte.includes(c.pfad)) ?? kandidaten[0];
    letzte.push(wahl.pfad); if (letzte.length > 3) letzte.shift();
    const vorE = ereignisse.length; const vorD = diag.length;
    let aktion = null;
    try {
      await s.locator(`a[href="${wahl.attr}"]:visible`).first().click();
      await s.waitForURL((u) => new URL(u).pathname === wahl.pfad, { timeout: 9000 });
      await s.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    } catch (e) { aktion = e.message.split('\n')[0]; }
    await s.waitForTimeout(800);
    wege.push({ schritt: i + 1, von, nach: wahl.pfad, erfolg: aktion === null, aktion, ereignisse: ereignisse.slice(vorE), diag: diag.slice(vorD) });
  }
  await k.close();
  return { wege, ereignisse, diag };
}

const istErwartet = (e) => e.art === 'console.error' && ERWARTET_404.test(e.text) && e.ort.endsWith('/gibt-es-nicht/');

mitMessSperre(`vt-probe-${TEIL}-${GERAET}`, async () => {
  const b = await starteBrowser();
  let daten;
  try {
    if (TEIL === 'skript') {
      const laeufe = [];
      for (let i = 1; i <= LAEUFE; i++) laeufe.push({ lauf: i, ...(await skriptSprung(b)) });
      daten = { laeufe };
    } else {
      const ketten = [];
      for (let i = 1; i <= KETTEN; i++) ketten.push({ kette: i, ...(await linkKette(b, SCHRITTE)) });
      daten = { ketten };
    }
  } finally { await b.close(); }

  const gruppen = TEIL === 'skript' ? daten.laeufe : daten.ketten;
  const alle = gruppen.flatMap((g) => g.ereignisse);
  const diag = gruppen.flatMap((g) => g.diag);
  const zaehlend = alle.filter((e) => !istErwartet(e));
  const wechsel = TEIL === 'skript' ? daten.laeufe.length : daten.ketten.flatMap((k) => k.wege).length;
  const erfolgreich = TEIL === 'skript' ? daten.laeufe.filter((l) => l.erfolg).length : daten.ketten.flatMap((k) => k.wege).filter((w) => w.erfolg).length;
  const reveal = diag.filter((d) => d.ev === 'pagereveal' && d.vt);
  const zusammen = {
    werkzeug: 'vt-probe', basis: BASIS, teil: TEIL, geraet: GERAET, frueh: FRUEH, zeitpunkt: new Date().toISOString(),
    wechsel, erfolgreich,
    zaehlend: zaehlend.length, pageerror: alle.filter((e) => e.art === 'pageerror').length,
    viewTransitionMeldungen: alle.filter((e) => /ViewTransition|Transition was aborted/i.test(e.text)).length,
    diagnose: {
      pageswapMitVt: diag.filter((d) => d.ev === 'pageswap' && d.vt).length,
      pagerevealMitVt: reveal.length,
      pagerevealMitVtModulSchonGelaufen: reveal.filter((d) => d.js).length,
      unhandledrejection: diag.filter((d) => d.ev === 'unhandledrejection'),
      abgefangen: diag.filter((d) => d.ev === 'abgefangen'),
    },
    zaehlendeEreignisse: zaehlend, ...daten,
  };
  await writeFile(AUS, JSON.stringify(zusammen, null, 2) + '\n');
  console.log(`${TEIL}/${GERAET}${FRUEH ? '/frueh' : ''} @ ${BASIS}: ${erfolgreich}/${wechsel} Wechsel erfolgreich · zählende Fehler ${zusammen.zaehlend} (ViewTransition ${zusammen.viewTransitionMeldungen}) · pagereveal mit VT ${reveal.length} (Modul schon gelaufen ${zusammen.diagnose.pagerevealMitVtModulSchonGelaufen}) · unhandledrejection ${zusammen.diagnose.unhandledrejection.length} · abgefangen ${zusammen.diagnose.abgefangen.length}`);
  return zusammen.zaehlend ? 1 : 0;
}).then((code) => process.exit(code), (e) => { console.error(`Werkzeugfehler: ${e.message}`); process.exit(2); });
