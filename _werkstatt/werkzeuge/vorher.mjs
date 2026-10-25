// vorher.mjs: Vorher-Baseline der Wettbewerber (E0-PRUEF-03). Nur lesend, mit mindestens 5 s zwischen Seitenaufrufen.
// Je Paar und Gerät (nur Hellmodus) eine Seite laden, vor jedem Foto Firmennamen, Telefonnummern, E-Mail-Adressen
// und Logos maskieren, bis zu 6 Ausschnitte je Gerät als JPEG (Q70) nach <aus>/bilder schreiben.
// Gerät mobil zählt zusätzlich: Anfragen an fremde Hosts (nur Hostnamen), Cookies, Skripte, h1, Länge des title,
// Übertragungsgröße als Näherung. Ausgabe: <aus>/bilder/index.json, ohne Textinhalte.
// Aufruf: node _werkstatt/werkzeuge/vorher.mjs --aus .cache/vorher
// Exit: 0 alle Paare erfasst · 2 Werkzeugfehler oder Seite nicht erreichbar (Ergebnis unvollständig)
import { parseArgs } from 'node:util';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { starteBrowser, schreibeJson, GERAETE, mitMessSperre } from './lib.mjs';

const PAUSE_MS = 5000;
const MAX_AUSSCHNITTE = 6;

// Nur die sechs Paare aus dem Paket. Alternativen werden nur bei HTTP 404 probiert.
const SEITEN = [
  { paar: 'V01-R', urls: ['https://www.richter-sicherheitstechnik.de/'] },
  { paar: 'V01-A', urls: ['https://www.schluesseldienst-adam.de/'] },
  { paar: 'V03-A', urls: ['https://www.schluesseldienst-adam.de/tueroeffnung'] },
  { paar: 'V04-A', urls: ['https://www.schluesseldienst-adam.de/preise'] },
  { paar: 'V07-R', urls: [
    'https://www.richter-sicherheitstechnik.de/schluesseldienst-weilburg.html',
    'https://www.richter-sicherheitstechnik.de/schluesseldienst-ahausen-weilburg.html',
  ] },
  { paar: 'V07-A', urls: ['https://www.schluesseldienst-adam.de/weilburg'] },
];

const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));
let letzterStart = 0;

/** Mindestens PAUSE_MS zwischen dem Beginn zweier Seitenaufrufe. */
async function hoeflich() {
  const rest = letzterStart + PAUSE_MS - Date.now();
  if (rest > 0) await sleep(rest);
  letzterStart = Date.now();
}

/** Registrierbare Domain grob (letzte zwei Labels), damit www. und Subdomains der Seite als eigen gelten. */
const basisDomain = (host) => host.split('.').slice(-2).join('.');

/**
 * Läuft im Seitenkontext. Ersetzt Fundstellen durch ███ (E-Mail, Firmenname, Telefonnummer ≥ 6 Ziffern)
 * in Textknoten und in alt-Attributen von Bildern und blendet Bilder mit „logo“ in alt oder src aus.
 * Gibt nur Zählwerte zurück, keinen Text.
 */
function maskiereSeite() {
  const z = { namen: 0, telefon: 0, email: 0, logos: 0 };
  const EMAIL = /[\p{L}\d._%+-]+@[\p{L}\d-]+(?:\.[\p{L}\d-]+)*\.\p{L}{2,}/giu;
  const FIRMA = /(?<![\p{L}])(richter|adam)(?![\p{L}])([\s\-._&]*sicherheitstechnik)?/giu;
  const NEBEN = /(█{3}[\s\-._&]*sicherheitstechnik|sicherheitstechnik[\s\-._&]*█{3})/giu;
  const TELEFON = /(?<![\p{L}\d])[(+]?\d[\d\s\/()\-]*\d(?![\p{L}\d])/gu;
  const ersetze = (text) => text
    .replace(EMAIL, () => { z.email++; return '███'; })
    .replace(FIRMA, () => { z.namen++; return '███'; })
    .replace(NEBEN, () => { z.namen++; return '███'; })
    .replace(TELEFON, (m) => {
      if (m.replace(/\D/g, '').length < 6) return m;
      z.telefon++;
      return '███';
    });
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(n.parentElement?.tagName ?? '')
      ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  const knoten = [];
  while (w.nextNode()) knoten.push(w.currentNode);
  for (const k of knoten) {
    const alt = k.nodeValue;
    const neu = ersetze(alt);
    if (neu !== alt) k.nodeValue = neu;
  }
  for (const img of document.querySelectorAll('img')) {
    const alt = img.getAttribute('alt');
    if (alt) {
      const neu = ersetze(alt);
      if (neu !== alt) img.setAttribute('alt', neu);
    }
    const src = img.getAttribute('src') ?? '';
    if (/logo/i.test(`${alt ?? ''} ${src}`) && img.style.visibility !== 'hidden') {
      img.style.visibility = 'hidden';
      z.logos++;
    }
  }
  return z;
}

/** Zählwerte für Gerät mobil. Liefert keine Textinhalte, nur Hostnamen. */
async function zaehle(seite, kontext, eigenerHost, anfragen, beendet) {
  const hosts = anfragen
    .map((u) => { try { return new URL(u).hostname; } catch { return ''; } })
    .filter((h) => h && basisDomain(h) !== eigenerHost);
  const groessen = await Promise.all(beendet.map((r) => r.sizes()
    .then((s) => Math.max(0, s.responseBodySize) + Math.max(0, s.responseHeadersSize))
    .catch(() => 0)));
  return {
    anfragenGesamt: anfragen.length,
    fremdAnfragen: hosts.length,
    fremdHosts: [...new Set(hosts)].sort(),
    cookies: (await kontext.cookies()).length,
    skripte: await seite.evaluate(() => document.querySelectorAll('script').length),
    h1: await seite.evaluate(() => document.querySelectorAll('h1').length > 0),
    titelLaenge: await seite.evaluate(() => (document.title ?? '').length),
    bytesNaeherung: groessen.reduce((a, b) => a + b, 0),
  };
}

/** Lädt eine Seite für ein Gerät, maskiert und fotografiert sie. Gerät mobil zählt zusätzlich. */
async function aufnehmen(browser, paar, url, geraet, bilderOrdner, zaehlen) {
  const kontext = await browser.newContext({
    viewport: { width: geraet.width, height: geraet.height }, deviceScaleFactor: 1, colorScheme: 'light', bypassCSP: true,
  });
  try {
    const seite = await kontext.newPage();
    const anfragen = [], beendet = [];
    if (zaehlen) {
      seite.on('request', (r) => anfragen.push(r.url()));
      seite.on('requestfinished', (r) => beendet.push(r));
    }
    await hoeflich();
    const antwort = await seite.goto(url, { waitUntil: 'load', timeout: 30000 });
    const status = antwort?.status() ?? null;
    await seite.waitForTimeout(2000);
    if (status === null || status >= 400) return { ok: false, status, fehler: `HTTP ${status}` };

    const zaehlung = zaehlen ? await zaehle(seite, kontext, basisDomain(new URL(url).hostname), anfragen, beendet) : null;
    await seite.evaluate(() => document.fonts.ready);
    const hoeheGesamt = await seite.evaluate(() => document.documentElement.scrollHeight);
    const noetig = Math.ceil(hoeheGesamt / geraet.height);
    const anzahl = Math.min(MAX_AUSSCHNITTE, Math.max(1, noetig));
    const maskiert = { namen: 0, telefon: 0, email: 0, logos: 0 };
    const bilder = [];
    for (let k = 0; k < anzahl; k++) {
      await seite.evaluate((y) => window.scrollTo(0, y), k * geraet.height);
      await seite.evaluate(() => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok))));
      // Erneut maskieren: nachgeladene Inhalte (Lazy Loading, Skripte) erscheinen sonst ungeschwärzt.
      const m = await seite.evaluate(maskiereSeite);
      for (const key of Object.keys(maskiert)) maskiert[key] += m[key];
      const datei = `${paar}__${geraet.name}__${String(k + 1).padStart(2, '0')}.jpg`;
      await seite.screenshot({ path: join(bilderOrdner, datei), type: 'jpeg', quality: 70, animations: 'disabled' });
      const scrollY = await seite.evaluate(() => Math.round(window.scrollY));
      bilder.push({ datei, nr: k + 1, scrollY });
    }
    return {
      ok: true, status, hoeheGesamt, ausschnitte: anzahl, gekuerzt: noetig > MAX_AUSSCHNITTE,
      maskiert, bilder, zaehlung,
    };
  } finally {
    await kontext.close();
  }
}

/** Ein zweiter Versuch bei Fehler oder HTTP-Fehler außer 404 (Bot-Schutz, Zeitüberschreitung). */
async function versuche(arbeit) {
  let letzter = null;
  for (let n = 0; n < 2; n++) {
    try {
      letzter = await arbeit();
      if (letzter.ok || letzter.status === 404) return letzter;
    } catch (e) {
      letzter = { ok: false, status: null, fehler: String(e.message).split('\n')[0].slice(0, 200) };
    }
  }
  return letzter;
}

const zusammenfassung = (r) => ({
  ok: r.ok, status: r.status ?? null, fehler: r.fehler ?? null, ausschnitte: r.ausschnitte ?? 0,
  gekuerzt: r.gekuerzt ?? false, hoeheGesamt: r.hoeheGesamt ?? null, maskiert: r.maskiert ?? null,
});

async function main() {
  const { values: a } = parseArgs({ options: { aus: { type: 'string' } }, strict: true });
  if (!a.aus) throw new Error('--aus ist Pflicht (z. B. .cache/vorher)');
  const bilderOrdner = join(a.aus, 'bilder');
  await mkdir(bilderOrdner, { recursive: true });

  const [mobil, ...weitere] = GERAETE;
  const seiten = [], alleBilder = [];
  const browser = await starteBrowser();
  try {
    for (const s of SEITEN) {
      const eintrag = { paar: s.paar, url: null, pfad: null, geraete: {}, zaehlung: null, versuche: [] };
      seiten.push(eintrag);
      // Gerät mobil zuerst: legt die Adresse fest (404 → nächste Alternative) und liefert die Zählwerte.
      let gewaehlt = null, mobilErgebnis = null;
      for (const url of s.urls) {
        const r = await versuche(() => aufnehmen(browser, s.paar, url, mobil, bilderOrdner, true));
        eintrag.versuche.push({ pfad: new URL(url).pathname, status: r.status ?? null, fehler: r.fehler ?? null });
        if (r.ok) { gewaehlt = url; mobilErgebnis = r; break; }
        if (r.status !== 404) break;
      }
      if (!gewaehlt) {
        eintrag.geraete[mobil.name] = { ok: false, fehler: 'nicht erreichbar' };
        continue;
      }
      eintrag.url = gewaehlt;
      eintrag.pfad = new URL(gewaehlt).pathname;
      eintrag.geraete[mobil.name] = zusammenfassung(mobilErgebnis);
      eintrag.zaehlung = mobilErgebnis.zaehlung;
      alleBilder.push(...mobilErgebnis.bilder.map((b) => ({ paar: s.paar, geraet: mobil.name, ...b })));
      for (const geraet of weitere) {
        const r = await versuche(() => aufnehmen(browser, s.paar, gewaehlt, geraet, bilderOrdner, false));
        eintrag.geraete[geraet.name] = zusammenfassung(r);
        if (r.ok) alleBilder.push(...r.bilder.map((b) => ({ paar: s.paar, geraet: geraet.name, ...b })));
      }
    }
    await schreibeJson(join(bilderOrdner, 'index.json'), {
      werkzeug: 'vorher', zeitpunkt: new Date().toISOString(), pauseMs: PAUSE_MS, schema: 'light',
      geraete: GERAETE, hinweis: 'Keine Textinhalte gespeichert. Zählungen stammen aus Gerät mobil.',
      seiten, anzahl: alleBilder.length, bilder: alleBilder,
    });
  } finally {
    await browser.close();
  }

  // Ausgabe ohne Adressen und ohne Textinhalte.
  const unvollstaendig = seiten.filter((e) => Object.values(e.geraete).some((g) => !g.ok));
  console.log(`vorher: ${seiten.length} Paare, ${alleBilder.length} Bilder in ${bilderOrdner}`);
  for (const e of seiten) {
    const stand = Object.entries(e.geraete).map(([k, g]) => `${k}:${g.ok ? 'ok' : 'nein'}`).join(' ');
    console.log(`${e.paar}: ${e.pfad ?? 'keine Adresse'} · ${stand}`);
  }
  return unvollstaendig.length ? 2 : 0;
}

mitMessSperre('vorher', main).then(
  (code) => process.exit(code),
  (e) => { console.error(`Werkzeugfehler: ${e.message}`); process.exit(2); },
);
