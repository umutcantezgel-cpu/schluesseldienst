// N4 Tastatur (Haiku-Prüfer): Menü-Blatt mobil 390x844 nur per Tastatur.
// Tab bis zum Menü-Knopf, Enter öffnet, Escape schließt, Fokus muss auf den Menü-Knopf zurück.
// Nur lesen und messen. Basis 127.0.0.1:4251. Ausgabe nur in diesen Ordner.
import { writeFile } from 'node:fs/promises';
import { starteBrowser, blockiereExtern, mitMessSperre, schreibeJson } from '/home/user/schluesseldienst/_werkstatt/werkzeuge/lib.mjs';

const BASIS = 'http://127.0.0.1:4251';
const ORDNER = '/home/user/schluesseldienst/.cache/e5-final/n4-bewegung';
const KNOPF = '[aria-controls="menue-blatt"]';

const beschreibeFokus = () => {
  const el = document.activeElement;
  if (!el || el === document.body) return { tag: 'body' };
  const r = el.getBoundingClientRect();
  const kl = typeof el.className === 'string' ? el.className.trim().split(/\s+/).filter(Boolean).slice(0, 2).join('.') : '';
  return {
    tag: el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (kl ? '.' + kl : ''),
    aria_controls: el.getAttribute('aria-controls'),
    text: (el.innerText || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 40),
    im_viewport: r.width > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth,
    oben: Math.round(r.top), unten: Math.round(r.bottom),
  };
};

const zustandBlatt = () => {
  const d = document.getElementById('menue-blatt');
  const cs = d ? getComputedStyle(d) : null;
  const knopf = document.querySelector('[aria-controls="menue-blatt"]');
  return {
    dialog_open: d ? d.open : null,
    display: cs ? cs.display : null,
    opacity: cs ? cs.opacity : null,
    knopf_aria_expanded: knopf ? knopf.getAttribute('aria-expanded') : null,
    hash: location.hash,
    fokus_im_blatt: d ? d.contains(document.activeElement) : null,
  };
};

await mitMessSperre('n4-tastatur', async () => {
  const browser = await starteBrowser();
  const ergebnis = { werkzeug: 'n4-tastatur', basis: BASIS, geraet: 'mobil 390x844', zeitpunkt: new Date().toISOString(), schritte: [] };
  try {
    const kontext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const extern = await blockiereExtern(kontext);
    const seite = await kontext.newPage();
    const antwort = await seite.goto(BASIS + '/', { waitUntil: 'load' });
    ergebnis.status = antwort ? antwort.status() : null;
    await seite.waitForTimeout(5500);
    await seite.evaluate(() => document.activeElement && document.activeElement.blur());

    // 1) Tab bis zum Menü-Knopf
    const tabs = [];
    let erreicht = -1;
    for (let i = 1; i <= 80; i++) {
      await seite.keyboard.press('Tab');
      const f = await seite.evaluate(beschreibeFokus);
      tabs.push({ n: i, ...f });
      if (f.aria_controls === 'menue-blatt') { erreicht = i; break; }
    }
    ergebnis.tab_anzahl_bis_knopf = erreicht;
    ergebnis.tab_folge_letzte = tabs.slice(-4);
    ergebnis.knopf_fokus = erreicht > 0 ? tabs[tabs.length - 1] : null;
    ergebnis.vor_enter = await seite.evaluate(zustandBlatt);

    if (erreicht > 0) {
      // 2) Enter öffnet
      await seite.keyboard.press('Enter');
      await seite.waitForTimeout(40);
      ergebnis.nach_enter_40ms = await seite.evaluate(zustandBlatt);
      await seite.waitForTimeout(460);
      ergebnis.nach_enter_500ms = await seite.evaluate(zustandBlatt);
      ergebnis.fokus_nach_enter = await seite.evaluate(beschreibeFokus);
      // 3) Escape schließt
      await seite.keyboard.press('Escape');
      await seite.waitForTimeout(40);
      ergebnis.nach_escape_40ms = await seite.evaluate(zustandBlatt);
      ergebnis.fokus_nach_escape_40ms = await seite.evaluate(beschreibeFokus);
      await seite.waitForTimeout(560);
      ergebnis.nach_escape_600ms = await seite.evaluate(zustandBlatt);
      ergebnis.fokus_nach_escape = await seite.evaluate(beschreibeFokus);
      ergebnis.fokus_ist_knopf = ergebnis.fokus_nach_escape.aria_controls === 'menue-blatt';
      // Wiederholung: zweiter Lauf Enter/Escape, Fokus bleibt am Knopf
      await seite.keyboard.press('Enter');
      await seite.waitForTimeout(500);
      ergebnis.zweiter_lauf_nach_enter = await seite.evaluate(zustandBlatt);
      await seite.keyboard.press('Escape');
      await seite.waitForTimeout(600);
      ergebnis.zweiter_lauf_nach_escape = await seite.evaluate(zustandBlatt);
      ergebnis.zweiter_lauf_fokus = await seite.evaluate(beschreibeFokus);
    }
    ergebnis.externe_blockiert = extern.length;
    await kontext.close();
  } finally {
    await browser.close();
  }
  await schreibeJson(`${ORDNER}/tastatur.json`, ergebnis);
  const k = ergebnis;
  process.stdout.write(JSON.stringify({
    status: k.status, tab_anzahl_bis_knopf: k.tab_anzahl_bis_knopf, knopf_fokus: k.knopf_fokus,
    vor_enter: k.vor_enter, nach_enter_40ms: k.nach_enter_40ms, nach_enter_500ms: k.nach_enter_500ms, fokus_nach_enter: k.fokus_nach_enter,
    nach_escape_40ms: k.nach_escape_40ms, fokus_nach_escape_40ms: k.fokus_nach_escape_40ms, nach_escape_600ms: k.nach_escape_600ms, fokus_nach_escape: k.fokus_nach_escape,
    fokus_ist_knopf: k.fokus_ist_knopf, zweiter_lauf_nach_enter: k.zweiter_lauf_nach_enter, zweiter_lauf_nach_escape: k.zweiter_lauf_nach_escape, zweiter_lauf_fokus: k.zweiter_lauf_fokus,
    externe_blockiert: k.externe_blockiert, tab_folge_letzte: k.tab_folge_letzte,
  }, null, 2) + '\n');
}).catch((e) => { process.stderr.write(`n4-tastatur: Fehler: ${e.message}\n`); process.exitCode = 2; });
