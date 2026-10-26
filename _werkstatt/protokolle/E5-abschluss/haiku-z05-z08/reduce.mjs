// Z-05 Reduce-Prüfung (Messbuild, Port 4251, mobil 390x844; Interaktionen zusätzlich 1440x900).
// Methode je Hauptansicht: Kontext mit prefers-reduced-motion: reduce. Nach dem Laden (5,5 s Wartezeit) und nach
// ganzem Scrollen (weitere 5,5 s) werden document.getAnimations() ausgewertet (Transform-Änderung?) und alle sichtbaren
// Textelemente auf Deckkraft und visibility geprüft. Kontrolle: no-preference muss dort Transform-Animationen finden.
// Ausgabe nur unter .cache/e5-abschluss/haiku-z05-z08/. Die Sperre mitMessSperre schützt vor parallelen Messungen.
import { starteBrowser, blockiereExtern, mitMessSperre, schreibeJson } from '/home/user/schluesseldienst/_werkstatt/werkzeuge/lib.mjs';

const BASIS = 'http://127.0.0.1:4251';
const AUS = '/home/user/schluesseldienst/.cache/e5-abschluss/haiku-z05-z08/reduce.json';
const SEITEN = [
  '/', '/einbruchschutz/', '/notoeffnung/tueroeffnung/', '/preise/', '/einsatzgebiet/',
  '/einsatzgebiet/hessen/limburg-weilburg/', '/schluesseldienst-loehnberg/', '/ratgeber/rauchmelderpflicht/',
  '/ueber-uns/', '/kontakt/', '/suche/', '/impressum/', '/gibt-es-nicht/',
];

/** Läuft im Seitenkontext: alle Animationen und Übergänge mit Eigenschaften und Ziel. */
const erfasseAnimationen = () => {
  const beschr = (el) => {
    if (!el) return null;
    const kl = (el.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 3).map((c) => '.' + c).join('');
    const dm = el.getAttribute('data-moment');
    return el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + kl + (dm ? `[data-moment=${dm}]` : '');
  };
  const ohne = ['offset', 'easing', 'composite', 'computedOffset'];
  return document.getAnimations().map((a) => {
    const eff = a.effect;
    const art = a.constructor.name;
    const eig = new Set();
    for (const k of (eff && eff.getKeyframes ? eff.getKeyframes() : [])) {
      for (const p of Object.keys(k)) if (!ohne.includes(p)) eig.add(p);
    }
    const uebergang = art === 'CSSTransition' ? a.transitionProperty : null;
    const transformiert = [...eig].some((p) => /transform|translate|scale|rotate/.test(p))
      || /transform|translate|scale|rotate|^all$/.test(uebergang || '');
    const timing = eff ? eff.getTiming() : {};
    return {
      art,
      name: art === 'CSSAnimation' ? a.animationName : null,
      uebergang,
      ziel: beschr(eff && eff.target) + (eff && eff.pseudoElement ? eff.pseudoElement : ''),
      eigenschaften: [...eig],
      dauer_ms: typeof timing.duration === 'number' ? timing.duration : null,
      verzoegerung_ms: typeof timing.delay === 'number' ? timing.delay : 0,
      transformiert,
    };
  });
};

/** Läuft im Seitenkontext: sichtbare Textelemente mit Deckkraft unter 1 oder nicht sichtbar (Absicht ausgenommen). */
const pruefeSichtbar = () => {
  const absicht = 'details:not([open]) > :not(summary), dialog:not([open]), [hidden], .hauptnav-panel:not([data-zustand="offen"])';
  let geprueft = 0;
  const probleme = [];
  for (const el of document.body.querySelectorAll('*')) {
    if (el.closest(absicht)) continue;
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    if (!el.getClientRects().length) continue;
    geprueft++;
    let op = 1;
    let sichtbar = true;
    for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
      const cs = getComputedStyle(e);
      op *= parseFloat(cs.opacity);
      if (cs.visibility !== 'visible') sichtbar = false;
    }
    if (op < 0.999 || !sichtbar) {
      probleme.push({ ziel: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/)[0] : ''), deckkraft: Number(op.toFixed(3)), sichtbar, text: el.textContent.trim().slice(0, 60) });
    }
  }
  return { geprueft, anzahl_probleme: probleme.length, probleme: probleme.slice(0, 30) };
};

async function momentaufnahme(seite) {
  const animationen = await seite.evaluate(erfasseAnimationen);
  return {
    animationen,
    transformiert: animationen.filter((a) => a.transformiert),
    sichtbar: await seite.evaluate(pruefeSichtbar),
  };
}

async function scrolleGanz(seite) {
  const hoehe = await seite.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= hoehe; y += 300) {
    await seite.evaluate((yy) => window.scrollTo(0, yy), y);
    await seite.waitForTimeout(100);
  }
}

async function seitenlauf(browser, pfad, reduziert) {
  const kontext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: reduziert ? 'reduce' : 'no-preference' });
  const extern = await blockiereExtern(kontext);
  try {
    const seite = await kontext.newPage();
    const antwort = await seite.goto(BASIS + pfad, { waitUntil: 'load' });
    const status = antwort ? antwort.status() : null;
    const aktiv = await seite.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (!reduziert) {
      await seite.waitForTimeout(300);
      return { pfad, status, reduziert_aktiv: aktiv, frueh_300ms: await momentaufnahme(seite), blockierte_externe_anfragen: extern.length };
    }
    await seite.waitForTimeout(5500);
    const vor = await momentaufnahme(seite);
    await scrolleGanz(seite);
    await seite.waitForTimeout(5500);
    const nach = await momentaufnahme(seite);
    return { pfad, status, reduziert_aktiv: aktiv, nach_laden: vor, nach_scrollen: nach, blockierte_externe_anfragen: extern.length };
  } finally {
    await kontext.close();
  }
}

async function interaktionen(browser) {
  const ergebnis = [];
  // Mobil: FAQ öffnen (M-07 reduziert: „sofort“) und Ortssuche tippen (M-08/M-12 reduziert)
  const mobil = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await blockiereExtern(mobil);
  try {
    const seite = await mobil.newPage();
    await seite.goto(BASIS + '/', { waitUntil: 'load' });
    await seite.waitForTimeout(5500);
    await seite.click('.faq-frage >> nth=0');
    await seite.waitForTimeout(40);
    const faq40 = await seite.evaluate(erfasseAnimationen);
    await seite.waitForTimeout(600);
    ergebnis.push({ name: 'FAQ öffnen (mobil, reduziert)', nach_40ms: faq40, nach_640ms: await seite.evaluate(erfasseAnimationen) });
    await seite.fill('#hero-ort-eingabe', 'weil');
    await seite.waitForTimeout(40);
    const ort40 = await seite.evaluate(erfasseAnimationen);
    await seite.waitForTimeout(900);
    ergebnis.push({ name: 'Ortssuche tippen (mobil, reduziert)', nach_40ms: ort40, nach_940ms: await seite.evaluate(erfasseAnimationen), sichtbar_nach: await seite.evaluate(pruefeSichtbar) });
  } finally {
    await mobil.close();
  }
  // Desktop: Hauptnavigation öffnen (M-05 reduziert: „Deckkraft, feedback“; Aufklapper-Pfeil)
  const desk = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await blockiereExtern(desk);
  try {
    const seite = await desk.newPage();
    await seite.goto(BASIS + '/', { waitUntil: 'load' });
    await seite.waitForTimeout(5500);
    await seite.click('.hauptnav-aufklapper >> nth=0');
    await seite.waitForTimeout(40);
    const nav40 = await seite.evaluate(erfasseAnimationen);
    await seite.waitForTimeout(600);
    ergebnis.push({ name: 'Hauptnavigation öffnen (1440, reduziert)', nach_40ms: nav40, nach_640ms: await seite.evaluate(erfasseAnimationen), sichtbar_nach: await seite.evaluate(pruefeSichtbar) });
  } finally {
    await desk.close();
  }
  return ergebnis;
}

await mitMessSperre('haiku-z05-reduce', async () => {
  const browser = await starteBrowser();
  const daten = { werkzeug: 'haiku-z05-reduce', zeitpunkt: new Date().toISOString(), basis: BASIS, geraet: '390x844 (Interaktion Hauptnav 1440x900)', seiten: [], kontrolle: [], interaktionen: [] };
  try {
    for (const pfad of SEITEN) {
      daten.seiten.push(await seitenlauf(browser, pfad, true));
      process.stdout.write(`reduziert ${pfad}\n`);
    }
    for (const pfad of ['/', '/ueber-uns/', '/einsatzgebiet/']) {
      daten.kontrolle.push(await seitenlauf(browser, pfad, false));
      process.stdout.write(`Kontrolle no-preference ${pfad}\n`);
    }
    daten.interaktionen = await interaktionen(browser);
  } finally {
    await browser.close();
  }
  await schreibeJson(AUS, daten);
  const zusammen = daten.seiten.map((s) => `${s.pfad} status ${s.status} aktiv ${s.reduziert_aktiv} transf.(Laden) ${s.nach_laden.transformiert.length} transf.(Scrollen) ${s.nach_scrollen.transformiert.length} sichtb.-Probleme(Scrollen) ${s.nach_scrollen.sichtbar.anzahl_probleme}`);
  process.stdout.write(zusammen.join('\n') + '\n');
  process.stdout.write('Kontrolle: ' + daten.kontrolle.map((k) => `${k.pfad} transf. ${k.frueh_300ms.transformiert.length}`).join(' · ') + '\n');
}).catch((e) => {
  process.stderr.write(`reduce: Fehler: ${e.message}\n`);
  process.exitCode = 2;
});
