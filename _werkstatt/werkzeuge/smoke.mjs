// smoke.mjs: Smoke-Prüfung je Pfad bei 390x844 und 1440x900: fremde Anfragen, Konsole, CSP, HTTP-Status, Titel, genau eine h1, optional ein Seitenskript.
import { parseArgs } from 'node:util';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { starteBrowser, blockiereExtern, schreibeJson, mitMessSperre } from './lib.mjs';

const VIEWPORTS = [{ name: 'mobil', breite: 390, hoehe: 844 }, { name: 'desktop', breite: 1440, hoehe: 900 }];
const CSP_MUSTER = /Content Security Policy|Trusted ?Type/i;
const LOKAL = ['127.0.0.1', 'localhost'];

const istFremd = (u, erlaubt) => {
  const x = new URL(u);
  return !['data:', 'blob:'].includes(x.protocol) && !erlaubt.includes(x.hostname);
};

// Lädt das Seitenskript; liefert eine Funktion, die Ergebnisse als [{name, ok, detail}] prüft.
async function ladeSkript(pfad) {
  const modul = await import(pathToFileURL(resolve(pfad)).href);
  if (typeof modul.default !== 'function') throw new Error('--skript exportiert keine default-Funktion');
  return async (seite) => {
    const r = await modul.default(seite);
    if (!Array.isArray(r) || r.some((x) => typeof x?.name !== 'string' || typeof x?.ok !== 'boolean')) {
      throw new Error('Skript liefert kein Array aus {name, ok, detail}');
    }
    return r.map((x) => ({ name: x.name, ok: x.ok, detail: String(x.detail ?? '') }));
  };
}

async function pruefe(browser, url, pfad, vp, erlaubt, skript) {
  const kontext = await browser.newContext({ viewport: { width: vp.breite, height: vp.hoehe }, deviceScaleFactor: 1 });
  await blockiereExtern(kontext, erlaubt);
  // Zählung über request-Events: CSP blockiert fremde Ressourcen, bevor der Route-Handler greift.
  const fremd = [];
  kontext.on('request', (r) => { if (istFremd(r.url(), erlaubt)) fremd.push(r.url()); });
  const seite = await kontext.newPage();
  const fehler = [], warnungen = [], cspKonsole = [], unter = [];
  seite.on('console', (m) => {
    const t = m.text();
    if (CSP_MUSTER.test(t)) cspKonsole.push(t);
    else if (m.type() === 'error') fehler.push(t);
    else if (m.type() === 'warning') warnungen.push(t);
  });
  seite.on('pageerror', (e) => fehler.push(`Seitenfehler: ${e.message}`));
  seite.on('response', (r) => { if (r.status() >= 400) unter.push(`${r.status()} ${r.url()}`); });
  seite.on('requestfailed', (r) => { if (!istFremd(r.url(), erlaubt)) unter.push(`fehlgeschlagen ${r.url()} (${r.failure()?.errorText})`); });
  await seite.addInitScript(() => {
    window.__cspEreignisse = [];
    document.addEventListener('securitypolicyviolation', (e) => window.__cspEreignisse.push(`${e.violatedDirective} ${e.blockedURI}`));
  });
  const antwort = await seite.goto(url.href, { waitUntil: 'load' });
  // Fehlschlag = Seite lädt noch weiter; die Messung läuft trotzdem mit dem Stand bis dahin.
  await seite.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  const skriptErgebnisse = skript ? await skript(seite) : [];
  const status = antwort?.status() ?? null;
  const titel = (await seite.title()).trim();
  const h1 = await seite.locator('h1').count();
  const cspEreignisse = await seite.evaluate(() => window.__cspEreignisse ?? []);
  await kontext.close();

  const befunde = [];
  if (fremd.length) befunde.push(`${fremd.length} fremde Anfragen`);
  if (status === null || status >= 400) befunde.push(`Hauptdokument Status ${status}`);
  for (const u of unter) befunde.push(`Unterressource: ${u}`);
  for (const f of fehler) befunde.push(`Konsolenfehler: ${f}`);
  for (const w of warnungen) befunde.push(`Konsolenwarnung: ${w}`);
  if (cspKonsole.length || cspEreignisse.length) befunde.push(`CSP-Verstöße: Konsole ${cspKonsole.length}, Ereignis ${cspEreignisse.length}`);
  if (!titel) befunde.push('<title> fehlt oder ist leer');
  if (h1 !== 1) befunde.push(`${h1} h1-Elemente statt genau einem`);
  for (const s of skriptErgebnisse) if (!s.ok) befunde.push(`Skript ${s.name}: ${s.detail}`);

  return {
    pfad, viewport: vp.name, breite: vp.breite, hoehe: vp.hoehe, status,
    fremdeAnfragen: fremd, unterressourcen: unter,
    konsole: { fehler, warnungen }, csp: { konsole: cspKonsole, ereignis: cspEreignisse },
    titel, h1Anzahl: h1, skript: skriptErgebnisse, befunde,
  };
}

async function main() {
  const { values: a } = parseArgs({
    options: { basis: { type: 'string' }, pfade: { type: 'string' }, aus: { type: 'string' }, skript: { type: 'string' } },
    strict: true,
  });
  if (!a.basis || !a.pfade || !a.aus) throw new Error('--basis, --pfade und --aus sind Pflicht');
  const basis = new URL(a.basis);
  const erlaubt = [basis.hostname, ...LOKAL];
  const pfade = a.pfade.split(',').map((p) => p.trim()).filter(Boolean);
  if (!pfade.length) throw new Error('--pfade leer');
  const skript = a.skript ? await ladeSkript(a.skript) : null;

  const ergebnisse = [];
  const browser = await starteBrowser();
  try {
    for (const pfad of pfade) {
      for (const vp of VIEWPORTS) {
        ergebnisse.push(await pruefe(browser, new URL(pfad, basis), pfad, vp, erlaubt, skript));
      }
    }
  } finally {
    await browser.close();
  }
  const befunde = ergebnisse.reduce((s, e) => s + e.befunde.length, 0);
  await schreibeJson(a.aus, { werkzeug: 'smoke', basis: basis.href, zeitpunkt: new Date().toISOString(), befundeGesamt: befunde, ergebnisse });
  for (const e of ergebnisse) console.log(`smoke ${e.pfad} ${e.viewport} (${e.breite}x${e.hoehe}): ${e.befunde.length} Befunde`);
  console.log(`→ ${a.aus}`);
  return befunde ? 1 : 0;
}

mitMessSperre('smoke', main).then(
  (code) => process.exit(code),
  (e) => { console.error(`Werkzeugfehler: ${e.message}`); process.exit(2); },
);
