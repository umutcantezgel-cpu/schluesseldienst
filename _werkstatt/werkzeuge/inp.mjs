// INP-Näherung: Eingabelatenz je Interaktion über die Event Timing API (CPU-gedrosselt).
// Aktionsdatei: JSON-Liste aus {typ:'klick'|'taste'|'tippen', selektor?, text?}.
// Je Aktion werden Ereignisse nach interactionId gruppiert; die Latenz ist die längste Dauer je Interaktion.
// Schwelle --max gilt für den Maximalwert (nicht p98). Ereignisse unter 16 ms werden vom Browser nicht gemeldet.
// Aufruf: node _werkstatt/werkzeuge/inp.mjs --url <u> --aktionen <json-datei> --aus <json> [--drossel 4] [--max 200]
// Exit: 0 ok · 1 Schwelle überschritten · 2 Werkzeugfehler
import { parseArgs } from 'node:util';
import { readFile } from 'node:fs/promises';
import { blockiereExtern, CHROMIUM, importiere, schreibeJson, mitMessSperre } from './lib.mjs';

const TYPEN = ['klick', 'taste', 'tippen'];

/** Startet Chromium wie lib.starteBrowser; lokal, weil playwright-core (CJS) den Export chromium nur unter default trägt. */
async function starteBrowser() {
  const pw = await importiere('playwright-core');
  return (pw.chromium ?? pw.default.chromium).launch({ executablePath: CHROMIUM, args: ['--no-sandbox'] });
}

/** Längste Dauer je interactionId (0 = keine Eingabe, z. B. Hover, wird nicht gezählt). */
function gruppiere(eintraege) {
  const je = new Map();
  for (const e of eintraege) {
    if (!e.interactionId) continue;
    je.set(e.interactionId, Math.max(je.get(e.interactionId) ?? 0, e.dauer));
  }
  return [...je.values()];
}

async function main() {
  const { values: a } = parseArgs({
    strict: true,
    options: {
      url: { type: 'string' }, aktionen: { type: 'string' }, aus: { type: 'string' },
      drossel: { type: 'string', default: '4' }, max: { type: 'string', default: '200' },
    },
  });
  if (!a.url || !a.aktionen || !a.aus) throw new Error('Pflicht: --url, --aktionen <json-datei>, --aus <json>');
  const drossel = Number(a.drossel); const max = Number(a.max);
  if (!(drossel >= 1) || !Number.isFinite(max)) throw new Error('--drossel ≥ 1, --max Zahl');
  const aktionen = JSON.parse(await readFile(a.aktionen, 'utf8'));
  if (!Array.isArray(aktionen) || !aktionen.length) throw new Error('Aktionsdatei: nicht-leere Liste erwartet');
  for (const [i, x] of aktionen.entries()) {
    if (!TYPEN.includes(x.typ)) throw new Error(`Aktion ${i + 1}: typ ${x.typ} unbekannt`);
    if ((x.typ === 'klick' || x.typ === 'tippen') && !x.selektor) throw new Error(`Aktion ${i + 1}: selektor fehlt`);
    if ((x.typ === 'taste' || x.typ === 'tippen') && !x.text) throw new Error(`Aktion ${i + 1}: text fehlt`);
  }

  const browser = await starteBrowser();
  try {
    const kontext = await browser.newContext({ viewport: { width: 390, height: 844 }, bypassCSP: true });
    const extern = await blockiereExtern(kontext);
    const seite = await kontext.newPage();
    const cdp = await kontext.newCDPSession(seite);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: drossel });
    await seite.goto(a.url, { waitUntil: 'load' });
    await seite.evaluate(() => {
      window.__inp = [];
      new PerformanceObserver((liste) => {
        for (const e of liste.getEntries()) window.__inp.push({ name: e.name, dauer: e.duration, interactionId: e.interactionId });
      }).observe({ type: 'event', durationThreshold: 16, buffered: true });
    });

    const interaktionen = [];
    for (const [i, x] of aktionen.entries()) {
      const vorher = await seite.evaluate(() => window.__inp.length);
      if (x.typ === 'klick') await seite.click(x.selektor);
      else if (x.typ === 'taste') await (x.selektor ? seite.locator(x.selektor).press(x.text) : seite.keyboard.press(x.text));
      else await seite.locator(x.selektor).pressSequentially(x.text);
      await seite.waitForTimeout(250);
      const neu = await seite.evaluate((n) => window.__inp.slice(n), vorher);
      const latenzen = gruppiere(neu);
      interaktionen.push({
        nr: i + 1, typ: x.typ, selektor: x.selektor ?? null, ereignisse: neu.length,
        latenzen_ms: latenzen.map((d) => Number(d.toFixed(1))),
        latenz_max_ms: latenzen.length ? Number(Math.max(...latenzen).toFixed(1)) : null,
        hinweis: latenzen.length ? null : 'keine Event-Timing-Meldung (Dauer unter 16 ms)',
      });
    }

    const werte = interaktionen.flatMap((i) => i.latenzen_ms).sort((x, y) => x - y);
    const maxMs = werte.length ? werte[werte.length - 1] : null;
    const p98 = werte.length ? werte[Math.ceil(0.98 * werte.length) - 1] : null;
    const verfehlt = maxMs !== null && maxMs > max;
    const daten = {
      werkzeug: 'inp', zeitpunkt: new Date().toISOString(), url: a.url, drossel, viewport: '390x844',
      aktionen: aktionen.length, interaktionen_gemeldet: werte.length, max_ms: maxMs, p98_ms: p98,
      schwelle_max_ms: max, blockierte_externe_anfragen: extern.length, interaktionen,
      ergebnis: verfehlt ? 'verfehlt' : 'ok',
    };
    await schreibeJson(a.aus, daten);

    console.log(`inp ${a.url} (Drossel ${drossel}x): ${aktionen.length} Aktionen, ${werte.length} gemeldet, max ${maxMs ?? 'n/a'} ms, p98 ${p98 ?? 'n/a'} ms (Schwelle ${max} ms)`);
    console.log(verfehlt ? `VERFEHLT: max ${maxMs} ms > ${max} ms` : 'ERGEBNIS: ok');
    process.exitCode = verfehlt ? 1 : 0;
  } finally {
    await browser.close();
  }
}

mitMessSperre('inp', main).catch((e) => {
  console.error(`inp: Werkzeugfehler: ${e.message}`);
  process.exitCode = 2;
});
