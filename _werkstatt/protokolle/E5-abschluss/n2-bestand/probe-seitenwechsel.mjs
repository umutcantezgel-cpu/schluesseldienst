// Eigene Probe (n2-bestand, nur lesen): Seitenwechsel mit Zählung von pageerror und console.error.
// Aufruf: node probe-seitenwechsel.mjs skript <aus.json>   → 30 Sprünge 404 → Ortssuche → Ortsseite (wie Vorlage F02)
//         node probe-seitenwechsel.mjs links  <aus.json>   → 2 Ketten zu je 24 Link-Navigationen zwischen Hauptansichten
// Basis http://127.0.0.1:4251, Gerät 1440x900, externe Anfragen blockiert.
// Der gewollte 404-Ladefehler auf /gibt-es-nicht/ wird getrennt ausgewiesen; alles andere zählt gegen die Schwelle 0.
import { writeFile } from 'node:fs/promises';
import { starteBrowser, blockiereExtern, mitMessSperre } from '/home/user/schluesseldienst/_werkstatt/werkzeuge/lib.mjs';

const BASIS = 'http://127.0.0.1:4251';
const [, , TEIL, AUS] = process.argv;
if (!['skript', 'links'].includes(TEIL) || !AUS) { console.error('Aufruf: skript|links <aus.json>'); process.exit(2); }

const HAUPT = ['/', '/einbruchschutz/', '/notoeffnung/tueroeffnung/', '/preise/', '/einsatzgebiet/',
  '/einsatzgebiet/hessen/limburg-weilburg/', '/schluesseldienst-loehnberg/', '/ratgeber/rauchmelderpflicht/',
  '/ueber-uns/', '/kontakt/', '/suche/', '/impressum/'];
const ERWARTET_404 = /Failed to load resource: the server responded with a status of 404/;

// Hängt pageerror- und console.error-Zähler an eine Seite; jedes Ereignis wird mit Art, Text und Ort festgehalten.
function haenge(seite, ereignisse) {
  seite.on('pageerror', (e) => ereignisse.push({ art: 'pageerror', text: e.message.split('\n')[0], ort: '' }));
  seite.on('console', (m) => {
    if (m.type() !== 'error') return;
    ereignisse.push({ art: 'console.error', text: m.text(), ort: m.location()?.url ?? '' });
  });
}

const neuerKontext = async (b) => {
  const k = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await blockiereExtern(k);
  return k;
};

// Teil 1: 404 → Ortssuche → Ortsseite, wie in probe-f02-wiederholung.mjs.
async function skriptSprung(b) {
  const k = await neuerKontext(b);
  const s = await k.newPage();
  const ereignisse = [];
  haenge(s, ereignisse);
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
  return { ziel, erfolg: aktion === null && ziel === '/schluesseldienst-loehnberg/', aktion, ereignisse };
}

// Teil 2: eine Kette von Link-Klicks; jedes Ziel ist ein sichtbarer Link auf der aktuellen Seite.
async function linkKette(b, schritte) {
  const k = await neuerKontext(b);
  const s = await k.newPage();
  const ereignisse = [];
  haenge(s, ereignisse);
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
        const pfad = new URL(a.href, location.href).pathname;
        if (haupt.includes(pfad) && pfad !== aktuell && !out.some((o) => o.pfad === pfad)) out.push({ pfad, attr: a.getAttribute('href') });
      }
      return out;
    }, HAUPT);
    if (!kandidaten.length) { wege.push({ schritt: i + 1, von, nach: null, erfolg: false, aktion: 'kein sichtbarer Link auf Hauptansicht' }); break; }
    const wahl = kandidaten.find((c) => !letzte.includes(c.pfad)) ?? kandidaten[0];
    letzte.push(wahl.pfad); if (letzte.length > 3) letzte.shift();
    const vorher = ereignisse.length;
    let aktion = null;
    try {
      await s.locator(`a[href="${wahl.attr}"]:visible`).first().click();
      await s.waitForURL((u) => new URL(u).pathname === wahl.pfad, { timeout: 9000 });
      await s.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    } catch (e) { aktion = e.message.split('\n')[0]; }
    await s.waitForTimeout(800);
    wege.push({ schritt: i + 1, von, nach: wahl.pfad, erfolg: aktion === null, aktion, ereignisse: ereignisse.slice(vorher) });
  }
  await k.close();
  return { wege, ereignisse };
}

// Klassifiziert: der gewollte 404 auf /gibt-es-nicht/ ist erwartet; alles übrige zählt.
const istErwartet = (e) => e.art === 'console.error' && ERWARTET_404.test(e.text) && e.ort.endsWith('/gibt-es-nicht/');

mitMessSperre('n2-bestand-seitenwechsel', async () => {
  const b = await starteBrowser();
  let daten;
  try {
    if (TEIL === 'skript') {
      const laeufe = [];
      for (let i = 1; i <= 30; i++) laeufe.push({ lauf: i, ...(await skriptSprung(b)) });
      daten = { laeufe };
    } else {
      const ketten = [];
      for (let i = 1; i <= 2; i++) ketten.push({ kette: i, ...(await linkKette(b, 24)) });
      daten = { ketten };
    }
  } finally { await b.close(); }

  const alle = TEIL === 'skript' ? daten.laeufe.flatMap((l) => l.ereignisse) : daten.ketten.flatMap((k) => k.ereignisse);
  const erwartet = alle.filter(istErwartet);
  const pageerrors = alle.filter((e) => e.art === 'pageerror');
  const consoleErrors = alle.filter((e) => e.art === 'console.error');
  const zaehlend = alle.filter((e) => !istErwartet(e));
  const vt = alle.filter((e) => /ViewTransition|Transition was aborted/i.test(e.text));
  const zusammen = {
    werkzeug: 'n2-bestand-seitenwechsel', teil: TEIL, basis: BASIS, zeitpunkt: new Date().toISOString(),
    ereignisseGesamt: alle.length, pageerror: pageerrors.length, consoleError: consoleErrors.length,
    erwarteterNotfound404: erwartet.length, zaehlendGesamt: zaehlend.length, viewTransitionMeldungen: vt.length,
    zaehlend, ...daten,
  };
  if (TEIL === 'skript') {
    zusammen.erfolgreich = daten.laeufe.filter((l) => l.erfolg).length; zusammen.laufAnzahl = daten.laeufe.length;
  } else {
    const wege = daten.ketten.flatMap((k) => k.wege);
    zusammen.navigationen = wege.length; zusammen.navigationenErfolgreich = wege.filter((w) => w.erfolg).length;
  }
  await writeFile(AUS, JSON.stringify(zusammen, null, 2) + '\n');
  if (TEIL === 'skript') console.log(`skript: ${zusammen.erfolgreich}/${zusammen.laufAnzahl} Sprünge erfolgreich`);
  else console.log(`links: ${zusammen.navigationenErfolgreich}/${zusammen.navigationen} Navigationen erfolgreich`);
  console.log(`pageerror ${zusammen.pageerror} · console.error ${zusammen.consoleError} (davon erwartete 404 ${zusammen.erwarteterNotfound404}) · zählend ${zusammen.zaehlendGesamt} · ViewTransition ${zusammen.viewTransitionMeldungen}`);
  for (const e of zaehlend) console.log(`  ${e.art}: ${e.text} @ ${e.ort}`);
  return zaehlend.length ? 1 : 0;
}).then(
  (code) => process.exit(code),
  (e) => { console.error(`Werkzeugfehler: ${e.message}`); process.exit(2); },
);
