// N5-Tastatur (Haiku-Prüfer, Endmessung, Stand 72ed87c): Menü-Blatt nur per Tastatur, mobil 390x844.
// Ablauf: Tab bis zum Menü-Knopf (.rufleiste-menue), Enter öffnet das Blatt, Tab-Schleife im offenen Blatt,
// Escape schließt, Fokus muss auf dem Menü-Knopf liegen. Zweiter Durchlauf mit Enter und Escape zur Kontrolle.
// Nur messen; Ausgabe ausschließlich in diesem Ordner. Aufruf: node tastatur.mjs
import { starteBrowser, blockiereExtern, mitMessSperre, schreibeJson } from '/home/user/schluesseldienst/_werkstatt/werkzeuge/lib.mjs';

const BASIS = 'http://127.0.0.1:4251';
const ORDNER = '/home/user/schluesseldienst/.cache/e5-final/n5-bewegung';
const MAX_TAB = 300;

/** Läuft im Seitenkontext: Zustand von Fokus, Blatt und Menü-Knopf. */
const zustand = () => {
  const a = document.activeElement;
  const blatt = document.getElementById('menue-blatt');
  const knopf = document.querySelector('.rufleiste-menue');
  const beschr = (el) => {
    if (!el) return null;
    const kl = typeof el.className === 'string' ? el.className.trim().split(/\s+/).filter(Boolean).slice(0, 3).map((c) => '.' + c).join('') : '';
    const txt = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30);
    return el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + kl + (txt ? ' "' + txt + '"' : '');
  };
  return {
    fokus: beschr(a),
    fokusImBlatt: !!(blatt && a && blatt.contains(a)),
    fokusIstMenueKnopf: a === knopf,
    menueKnopfFokusSichtbar: knopf ? knopf.matches(':focus-visible') : null,
    blattOffen: blatt ? blatt.open : null,
    blattDisplay: blatt ? getComputedStyle(blatt).display : null,
    menueKnopfAriaExpanded: knopf ? knopf.getAttribute('aria-expanded') : null,
    menueKnopfAriaHaspopup: knopf ? knopf.getAttribute('aria-haspopup') : null,
    menueKnopfHref: knopf ? knopf.getAttribute('href') : null,
    menueKnopfVorhanden: !!knopf,
  };
};

const warte = (seite, ms) => seite.waitForTimeout(ms);

async function durchlauf(browser, reduziert) {
  const k = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: reduziert ? 'reduce' : 'no-preference' });
  const extern = await blockiereExtern(k);
  const seite = await k.newPage();
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push(`pageerror: ${e.message}`));
  seite.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fehler.push(`${m.type()}: ${m.text()}`); });
  try {
    await seite.goto(BASIS + '/', { waitUntil: 'load' });
    await seite.waitForSelector('.rufleiste-menue[aria-haspopup="dialog"]', { timeout: 15000 });
    await warte(seite, 800);
    const start = await seite.evaluate(zustand);

    // 1) Tab bis zum Menü-Knopf
    let tabs = null;
    const tabFolge = [];
    for (let i = 1; i <= MAX_TAB; i++) {
      await seite.keyboard.press('Tab');
      const z = await seite.evaluate(zustand);
      tabFolge.push(z.fokus);
      if (z.fokusIstMenueKnopf) { tabs = i; break; }
    }
    const beimKnopf = await seite.evaluate(zustand);

    // 2) Enter öffnet das Blatt
    await seite.keyboard.press('Enter');
    await warte(seite, 40);
    const nachEnter40 = await seite.evaluate(zustand);
    await warte(seite, 460);
    const nachEnter500 = await seite.evaluate(zustand);

    // 3) Tab-Schleife im offenen Blatt: Fokus muss im Blatt bleiben
    let ausserhalbBlatt = 0;
    const blattFolge = [];
    for (let i = 0; i < 25; i++) {
      await seite.keyboard.press('Tab');
      const z = await seite.evaluate(zustand);
      blattFolge.push(z.fokus);
      if (!z.fokusImBlatt) ausserhalbBlatt++;
    }
    // zurück zum ersten Element des Blatts, damit Escape wie bei einem Nutzer ankommt
    const vorEscape = await seite.evaluate(zustand);

    // 4) Escape schließt; Fokus muss auf dem Menü-Knopf liegen
    await seite.keyboard.press('Escape');
    await warte(seite, 30);
    const nachEscape30 = await seite.evaluate(zustand);
    await warte(seite, 600);
    const nachEscape630 = await seite.evaluate(zustand);

    // 5) Kontrolle: zweiter Durchlauf (Enter, Escape) vom Menü-Knopf aus
    await seite.keyboard.press('Enter');
    await warte(seite, 500);
    const zweitesOffen = await seite.evaluate(zustand);
    await seite.keyboard.press('Escape');
    await warte(seite, 600);
    const zweitesZu = await seite.evaluate(zustand);

    return {
      modus: reduziert ? 'reduce' : 'no-preference', geraet: 'mobil 390x844', pfad: '/',
      start, tab_bis_menue_knopf: tabs, tab_folge_letzte_5: tabFolge.slice(-5), beim_knopf: beimKnopf,
      enter: { nach_40ms: nachEnter40, nach_500ms: nachEnter500 },
      tab_im_blatt: { schritte: blattFolge.length, ausserhalb_des_blatts: ausserhalbBlatt, folge_alle: blattFolge, vor_escape: vorEscape },
      escape: { nach_30ms: nachEscape30, nach_630ms: nachEscape630 },
      kontrolle_zweiter_durchlauf: { offen: zweitesOffen, zu: zweitesZu },
      externe_blockiert: extern.length,
      konsole_und_seitenfehler: fehler,
    };
  } finally {
    await k.close();
  }
}

await mitMessSperre('n5-tastatur', async () => {
  const browser = await starteBrowser();
  const ergebnisse = [];
  try {
    ergebnisse.push(await durchlauf(browser, false));
    ergebnisse.push(await durchlauf(browser, true));
  } finally {
    await browser.close();
  }
  await schreibeJson(`${ORDNER}/tastatur.json`, { werkzeug: 'n5-tastatur', basis: BASIS, stand: '72ed87c', zeitpunkt: new Date().toISOString(), ergebnisse });
  for (const e of ergebnisse) {
    const s = e.start, n = e.nach_500ms ?? e.enter.nach_500ms;
    process.stdout.write(`${e.modus}: Tabs bis Menü-Knopf=${e.tab_bis_menue_knopf} (Knopf sichtbar fokussiert=${e.beim_knopf.menueKnopfFokusSichtbar}, ${e.beim_knopf.fokus})\n`);
    process.stdout.write(`  Enter 40 ms: offen=${e.enter.nach_40ms.blattOffen} Fokus=${e.enter.nach_40ms.fokus} | 500 ms: offen=${e.enter.nach_500ms.blattOffen} fokusImBlatt=${e.enter.nach_500ms.fokusImBlatt} expanded=${e.enter.nach_500ms.menueKnopfAriaExpanded}\n`);
    process.stdout.write(`  Tab im Blatt: ${e.tab_im_blatt.schritte} Schritte, ausserhalb=${e.tab_im_blatt.ausserhalb_des_blatts}\n`);
    process.stdout.write(`  Escape 30 ms: offen=${e.escape.nach_30ms.blattOffen} Fokus=${e.escape.nach_30ms.fokus} istKnopf=${e.escape.nach_30ms.fokusIstMenueKnopf} | 630 ms: offen=${e.escape.nach_630ms.blattOffen} istKnopf=${e.escape.nach_630ms.fokusIstMenueKnopf} expanded=${e.escape.nach_630ms.menueKnopfAriaExpanded} display=${e.escape.nach_630ms.blattDisplay}\n`);
    process.stdout.write(`  Kontrolle: offen=${e.kontrolle_geduld_fehler ?? e.kontrolle_zweiter_durchlauf.offen.blattOffen} zu=${e.kontrolle_zweiter_durchlauf.zu.blattOffen} istKnopf=${e.kontrolle_zweiter_durchlauf.zu.fokusIstMenueKnopf}\n`);
    process.stdout.write(`  Konsole/Seitenfehler: ${e.konsole_und_seitenfehler.length ? e.konsole_und_seitenfehler.join(' || ') : 'keine'}\n`);
  }
}).then(() => process.stdout.write('ENDE tastatur\n')).catch((e) => {
  process.stderr.write(`n5-tastatur: Fehler: ${e.message}\n${e.stack}\n`);
  process.exitCode = 2;
});
