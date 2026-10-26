// Haiku-Prüfer N2, Teilschritt 3: :active (M-03) unter reduce und no-preference (Kontrolle).
// Maus drücken und gedrückt halten (down, ohne up während der Messung), Transform und Übergänge lesen, dann up.
// Nur lesen und messen. Ausgabe: rest-active.json. Sperre über mitMessSperre (nie gelöscht).
import { starteBrowser, blockiereExtern, mitMessSperre, schreibeJson } from '/home/user/schluesseldienst/_werkstatt/werkzeuge/lib.mjs';

const BASIS = 'http://127.0.0.1:4251';
const AUS = '/home/user/schluesseldienst/.cache/e5-abschluss/n2-bewegung/rest-active.json';
const GERAET = { width: 390, height: 844 };

/** Läuft im Seitenkontext: Transform, Übergänge und ::before-Deckkraft des markierten Elements. */
const lesen = (sel) => {
  const el = [...document.querySelectorAll(sel.replace(/:visible$/, ''))].find((e) => e.getClientRects().length > 0);
  if (!el) return null;
  const cs = getComputedStyle(el);
  const vor = getComputedStyle(el, '::before');
  return {
    transform: cs.transform,
    uebergang_eigenschaft: cs.transitionProperty,
    uebergang_dauer: cs.transitionDuration,
    before_deckkraft: vor.opacity,
    animationen: el.getAnimations().map((a) => ({
      art: a.constructor.name,
      eigenschaft: a.transitionProperty || null,
      name: a.animationName || null,
      dauer_ms: a.effect && a.effect.getTiming ? a.effect.getTiming().duration : null,
    })),
  };
};

/** Läuft im Seitenkontext: liegt an der Mitte des Elements ein Treffer auf dem Element selbst? */
const trifft = ([sel, x, y]) => {
  const el = [...document.querySelectorAll(sel.replace(/:visible$/, ''))].find((e) => e.getClientRects().length > 0);
  const hit = document.elementFromPoint(x, y);
  return !!(el && hit && (el === hit || el.contains(hit)));
};

const ziele = [
  { pfad: '/preise/', sel: 'label.wahl-option:visible', name: 'Rechner-Option (.wahl-option)' },
  { pfad: '/', sel: '.knopf:not([aria-disabled="true"]):visible', name: 'Knopf (.knopf)' },
  { pfad: '/', sel: '.rufknopf:visible', name: 'Rufknopf (.rufknopf)' },
];

async function lauf(browser, ziel, reduziert) {
  const k = await browser.newContext({ viewport: GERAET, reducedMotion: reduziert ? 'reduce' : 'no-preference' });
  const extern = await blockiereExtern(k);
  const seite = await k.newPage();
  try {
    await seite.goto(BASIS + ziel.pfad, { waitUntil: 'load' });
    await seite.waitForTimeout(3000);
    const aktiv = await seite.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
    const loc = seite.locator(ziel.sel).first();
    const vorhanden = await loc.count();
    if (!vorhanden) return { ziel: ziel.name, pfad: ziel.pfad, modus: reduziert ? 'reduce' : 'no-preference', fehler: `Element nicht gefunden: ${ziel.sel}` };
    await loc.scrollIntoViewIfNeeded();
    const box = await loc.boundingBox();
    const x = box.x + box.width / 2, y = box.y + box.height / 2;
    const treffer = await seite.evaluate(trifft, [ziel.sel, x, y]);
    await seite.mouse.move(x, y);
    const vorher = await seite.evaluate(lesen, ziel.sel);
    await seite.mouse.down();
    const sofort = await seite.evaluate(lesen, ziel.sel);
    await seite.waitForTimeout(40);
    const nach40 = await seite.evaluate(lesen, ziel.sel);
    await seite.waitForTimeout(360);
    const nach400 = await seite.evaluate(lesen, ziel.sel);
    await seite.mouse.up();
    return {
      ziel: ziel.name, pfad: ziel.pfad, sel: ziel.sel, geraet: 'mobil 390x844', modus: reduziert ? 'reduce' : 'no-preference',
      reduziert_aktiv: aktiv, treffer_auf_element: treffer, externe_blockiert: extern.length,
      vorher, gedrueckt_sofort: sofort, gedrueckt_40ms: nach40, gedrueckt_400ms: nach400,
    };
  } finally {
    await k.close();
  }
}

await mitMessSperre('n2-bewegung-active-rest', async () => {
  const browser = await starteBrowser();
  const daten = { werkzeug: 'n2-active-rest', zeitpunkt: new Date().toISOString(), basis: BASIS, laeufe: [] };
  try {
    for (const ziel of ziele) {
      for (const reduziert of [true, false]) {
        daten.laeufe.push(await lauf(browser, ziel, reduziert));
        process.stdout.write(`lauf ${ziel.name} ${reduziert ? 'reduce' : 'no-preference'} fertig\n`);
      }
    }
  } finally {
    await browser.close();
  }
  await schreibeJson(AUS, daten);
  for (const l of daten.laeufe) {
    if (l.fehler) { process.stdout.write(`${l.ziel} ${l.modus}: ${l.fehler}\n`); continue; }
    process.stdout.write(`${l.ziel} | ${l.modus} | aktiv=${l.reduziert_aktiv} | treffer=${l.treffer_auf_element} | vorher=${l.vorher?.transform} | sofort=${l.gedrueckt_sofort?.transform} | 40=${l.gedrueckt_40ms?.transform} | 400=${l.gedrueckt_400ms?.transform} | Animationen400=${JSON.stringify(l.gedrueckt_400ms?.animationen)}\n`);
  }
}).then(() => process.stdout.write('ENDE rest-active\n')).catch((e) => { process.stderr.write(`rest-active: Fehler: ${e.message}\n${e.stack}\n`); process.exitCode = 2; });
