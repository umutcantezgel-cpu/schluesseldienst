// N4-Bewegung (Haiku-Prüfer, letzte Nachprüfung, Stand b5a1ebd, Messbuild .cache/e5-final/dist).
// Kopie von .cache/e5-abschluss/n2-bewegung/bewegung.mjs (Original: bewegung-original.mjs in diesem Ordner).
// Änderungen: Basis und Ausgaben in diesen Ordner; Messpunkte bei 40, 120, 200 und 400 ms für Öffnen und
// Schließen von Hauptnavigation und Menü-Blatt; Laufzeit je Gerät getrennt; Animationsfortschritt (zeit_ms).
// Nur lesen und messen. Ausgabe nur unter .cache/e5-final/n4-bewegung/.
// Aufruf: node bewegung.mjs interaktionen | laden-mobil | laden-desktop | kontrolle
import { starteBrowser, blockiereExtern, mitMessSperre, schreibeJson } from '/home/user/schluesseldienst/_werkstatt/werkzeuge/lib.mjs';

const BASIS = 'http://127.0.0.1:4251';
const ORDNER = '/home/user/schluesseldienst/.cache/e5-final/n4-bewegung';
const GERAETE = { mobil: { width: 390, height: 844 }, desktop: { width: 1440, height: 900 } };
const modus = process.argv[2] ?? 'interaktionen';
const PUNKTE_AUF = [40, 120, 200, 400];
const PUNKTE_KURZ = [40, 400];

/** Läuft im Seitenkontext: Zustand der markierten Elemente (window.__n2) und aller Animationen/Übergänge. */
const erfassen = () => {
  const ref = window.__n2 || {};
  const beschr = (el) => {
    if (!el) return null;
    const kl = (el.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 3).map((c) => '.' + c).join('');
    return el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + kl;
  };
  const elemente = {};
  for (const [name, el] of Object.entries(ref)) {
    if (!el || !el.isConnected) { elemente[name] = null; continue; }
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    let rueck = null;
    try { rueck = getComputedStyle(el, '::backdrop').opacity; } catch { rueck = null; }
    elemente[name] = { ziel: beschr(el), transform: cs.transform, opacity: cs.opacity, sichtbar: cs.visibility, display: cs.display, oben: Math.round(r.top * 100) / 100, hoehe: Math.round(r.height * 100) / 100, backdrop_deckkraft: rueck };
  }
  const ohne = ['offset', 'easing', 'composite', 'computedOffset'];
  const animationen = document.getAnimations().map((a) => {
    const eff = a.effect;
    const tgt = eff && eff.target;
    const art = a.constructor.name;
    const eig = new Set();
    for (const k of (eff && eff.getKeyframes ? eff.getKeyframes() : [])) for (const p of Object.keys(k)) if (!ohne.includes(p)) eig.add(p);
    const timing = eff ? eff.getTiming() : {};
    const uebergang = art === 'CSSTransition' ? a.transitionProperty : null;
    const name = Object.keys(ref).find((k) => ref[k] === tgt) || null;
    return {
      art,
      element: name,
      ziel: beschr(tgt) + (eff && eff.pseudoElement ? eff.pseudoElement : ''),
      uebergang,
      animation: art === 'CSSAnimation' ? a.animationName : null,
      eigenschaften: [...eig],
      dauer_ms: typeof timing.duration === 'number' ? timing.duration : null,
      verzoegerung_ms: typeof timing.delay === 'number' ? timing.delay : 0,
      transformiert: [...eig].some((p) => /transform|translate|scale|rotate/.test(p)) || /transform|translate|scale|rotate|^all$/.test(uebergang || ''),
      status: a.playState,
      zeit_ms: typeof a.currentTime === 'number' ? Math.round(a.currentTime) : null,
    };
  });
  return { zeit: performance.now(), elemente, animationen };
};

/** Läuft im Seitenkontext: sichtbare Textelemente mit Deckkraft unter 1 oder nicht sichtbar (Absicht ausgenommen, wie Z-05). */
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
    if (op < 0.999 || !sichtbar) probleme.push({ ziel: el.tagName.toLowerCase(), deckkraft: Number(op.toFixed(3)), sichtbar, text: el.textContent.trim().slice(0, 60) });
  }
  return { geprueft, anzahl_probleme: probleme.length, probleme: probleme.slice(0, 30) };
};

const snap = (seite) => seite.evaluate(erfassen);
const markiere = (seite, ziele) => seite.evaluate((z) => {
  const ref = {};
  for (const [name, sel] of Object.entries(z)) { const el = document.querySelector(sel); if (el) ref[name] = el; }
  window.__n2 = ref;
  return Object.keys(z).filter((k) => !ref[k]);
}, ziele);

async function kontext(browser, geraet, reduziert) {
  const k = await browser.newContext({ viewport: GERAETE[geraet], reducedMotion: reduziert ? 'reduce' : 'no-preference' });
  const extern = await blockiereExtern(k);
  const seite = await k.newPage();
  return { k, seite, extern };
}

/** Misst zu den Zeitpunkten (ms nach tStart, Seitenuhr); der Zeitpunkt der Messung wird mitgeschrieben. */
async function messePunkte(seite, tStart, punkte) {
  const messungen = [];
  for (const ziel of punkte) {
    const jetzt = await seite.evaluate(() => performance.now());
    const warte = ziel - (jetzt - tStart);
    if (warte > 0) await seite.waitForTimeout(warte);
    const s = await snap(seite);
    messungen.push({ soll_ms: ziel, ist_ms: Math.round(s.zeit - tStart), elemente: s.elemente, animationen: s.animationen });
  }
  return messungen;
}

/** Eine Interaktion: Ausgangszustand, Auslösen, danach Messungen zu den angegebenen Zeitpunkten (ab dem Ende des Klicks). */
async function schritt(seite, label, ziele, aktion, { neu = false, punkte = PUNKTE_KURZ } = {}) {
  const fehlend = await markiere(seite, ziele);
  const vorher = await snap(seite);
  await aktion();
  const tKlick = await seite.evaluate(() => performance.now());
  if (neu) await markiere(seite, ziele);
  const messungen = await messePunkte(seite, tKlick, punkte);
  return { schritt: label, fehlende_ziele: fehlend, t_klick: Math.round(tKlick), vorher: { elemente: vorher.elemente }, messungen };
}

async function interaktionen(browser, reduziert) {
  const laeufe = [];
  const modusName = reduziert ? 'reduce' : 'no-preference';
  // a) FAQ öffnen (mobil): Chevron, Antwort
  for (const pfad of ['/', '/preise/']) {
    const { k, seite, extern } = await kontext(browser, 'mobil', reduziert);
    try {
      await seite.goto(BASIS + pfad, { waitUntil: 'load' });
      await seite.waitForTimeout(5500);
      const s = [await schritt(seite, 'a FAQ öffnen', {
        chevron: '.faq-eintrag:not([open]) .faq-chevron',
        antwort: '.faq-eintrag:not([open]) .faq-antwort',
      }, () => seite.click('.faq-eintrag:not([open]) .faq-frage'), { punkte: PUNKTE_AUF })];
      laeufe.push({ id: 'a-faq', modus: modusName, geraet: 'mobil 390x844', pfad, schritte: s, externe_blockiert: extern.length });
    } finally { await k.close(); }
  }
  // b) Hauptnavigation „Leistungen“ auf- und zuklappen (Desktop 1440x900): Pfeil, Panel
  {
    const { k, seite, extern } = await kontext(browser, 'desktop', reduziert);
    try {
      await seite.goto(BASIS + '/', { waitUntil: 'load' });
      await seite.waitForTimeout(5500);
      const ziele = { knopf: '.hauptnav-aufklapper', pfeil: '.hauptnav-aufklapper .i', panel: '#untermenue-leistungen' };
      const s = [
        await schritt(seite, 'b Leistungen aufklappen', ziele, () => seite.click('.hauptnav-aufklapper'), { punkte: PUNKTE_AUF }),
        await schritt(seite, 'b Leistungen zuklappen', ziele, () => seite.click('.hauptnav-aufklapper'), { punkte: PUNKTE_AUF }),
      ];
      laeufe.push({ id: 'b-hauptnav', modus: modusName, geraet: 'desktop 1440x900', pfad: '/', schritte: s, externe_blockiert: extern.length });
    } finally { await k.close(); }
  }
  // c) Menü-Blatt öffnen und schließen (mobil 390x844): Blatt und ::backdrop
  {
    const { k, seite, extern } = await kontext(browser, 'mobil', reduziert);
    try {
      await seite.goto(BASIS + '/', { waitUntil: 'load' });
      await seite.waitForTimeout(5500);
      const s = [
        await schritt(seite, 'c Menü-Blatt öffnen', { knopf: '[aria-controls="menue-blatt"]', blatt: '#menue-blatt' }, () => seite.click('[aria-controls="menue-blatt"]'), { punkte: PUNKTE_AUF }),
        await schritt(seite, 'c Menü-Blatt schließen', { blatt: '#menue-blatt' }, () => seite.click('#menue-blatt [data-menue-zu]'), { punkte: PUNKTE_AUF }),
      ];
      laeufe.push({ id: 'c-menue-blatt', modus: modusName, geraet: 'mobil 390x844', pfad: '/', schritte: s, externe_blockiert: extern.length });
    } finally { await k.close(); }
  }
  // d) Ortsprüfung im Prüfmodus (/einsatzgebiet/, mobil): Vorschlagsliste, Ergebnis
  {
    const { k, seite, extern } = await kontext(browser, 'mobil', reduziert);
    try {
      await seite.goto(BASIS + '/einsatzgebiet/', { waitUntil: 'load' });
      await seite.waitForTimeout(5500);
      const ziele = { eingabe: '#gebiet-ort-eingabe', liste: '#gebiet-ort-liste', ergebnis: '.ortspruefung-ergebnis' };
      const s = [
        await schritt(seite, 'd Ort tippen (Löhnberg), Vorschlagsliste', ziele, async () => {
          await seite.fill('#gebiet-ort-eingabe', 'Löhnberg');
          await seite.waitForSelector('#gebiet-ort-liste li', { state: 'visible', timeout: 15000 });
        }),
        await schritt(seite, 'd Vorschlag wählen, Ergebnis', ziele, () => seite.click('#gebiet-ort-liste li >> nth=0')),
      ];
      laeufe.push({ id: 'd-ortspruefung', modus: modusName, geraet: 'mobil 390x844', pfad: '/einsatzgebiet/', schritte: s, externe_blockiert: extern.length });
    } finally { await k.close(); }
  }
  // e) Composer /kontakt/ (mobil): Anliegen Notfall, dann zurück auf Mail-Zweig (planbar)
  {
    const { k, seite, extern } = await kontext(browser, 'mobil', reduziert);
    try {
      await seite.goto(BASIS + '/kontakt/', { waitUntil: 'load' });
      await seite.waitForTimeout(5500);
      const ziele = { notfall: '.composer-notfall', mail: '.composer-mail', kopf: '.composer-kopf', betreff: '.composer-kopf [data-stand]' };
      const s = [
        await schritt(seite, 'e Anliegen Notfall', ziele, () => seite.locator('input[name="anliegen"][value="notfall"]').check({ force: true }), { neu: true }),
        await schritt(seite, 'e Anliegen planbar (Mail-Zweig)', ziele, () => seite.locator('input[name="anliegen"][value="planbar"]').check({ force: true }), { neu: true }),
      ];
      laeufe.push({ id: 'e-composer', modus: modusName, geraet: 'mobil 390x844', pfad: '/kontakt/', schritte: s, externe_blockiert: extern.length });
    } finally { await k.close(); }
  }
  // f) Gruppenfilter /leistungen/ (mobil): Einbruchschutz, Sicherheitstechnik, Alle
  {
    const { k, seite, extern } = await kontext(browser, 'mobil', reduziert);
    try {
      await seite.goto(BASIS + '/leistungen/', { waitUntil: 'load' });
      await seite.waitForTimeout(5500);
      const s = [
        await schritt(seite, 'f Gruppe Einbruchschutz', { gruppe: '#gruppe-einbruchschutz' }, () => seite.click('.verz-sprung button >> nth=1')),
        await schritt(seite, 'f Gruppe Sicherheitstechnik (eingeblendet)', { gruppe: '#gruppe-sicherheitstechnik' }, () => seite.click('.verz-sprung button >> nth=2')),
        await schritt(seite, 'f Alle Gruppen (eingeblendet)', { gruppe: '#gruppe-notoeffnung' }, () => seite.click('.verz-sprung button >> nth=4')),
      ];
      laeufe.push({ id: 'f-gruppenfilter', modus: modusName, geraet: 'mobil 390x844', pfad: '/leistungen/', schritte: s, externe_blockiert: extern.length });
    } finally { await k.close(); }
  }
  return laeufe;
}

/** g) Drücken (:active) ohne Klick: Zustand während der Taste gedrückt, danach loslassen. */
async function druecken(browser, reduziert, pfad, sel, label) {
  const { k, seite, extern } = await kontext(browser, 'mobil', reduziert);
  try {
    await seite.goto(BASIS + pfad, { waitUntil: 'load' });
    await seite.waitForTimeout(5500);
    const ort = seite.locator(sel).first();
    await ort.scrollIntoViewIfNeeded();
    const box = await ort.boundingBox();
    const fehlend = await markiere(seite, { ziel: sel });
    await seite.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    const vorher = await snap(seite);
    await seite.mouse.down();
    const tDruck = await seite.evaluate(() => performance.now());
    const messungen = await messePunkte(seite, tDruck, PUNKTE_KURZ);
    await seite.mouse.up();
    return { id: 'g-druck', modus: reduziert ? 'reduce' : 'no-preference', geraet: 'mobil 390x844', pfad, ziel: sel, label, fehlende_ziele: fehlend, t_klick: Math.round(tDruck), vorher: { elemente: vorher.elemente }, messungen, externe_blockiert: extern.length };
  } finally { await k.close(); }
}

const SEITEN = ['/', '/einbruchschutz/', '/notoeffnung/tueroeffnung/', '/preise/', '/einsatzgebiet/', '/einsatzgebiet/hessen/limburg-weilburg/', '/schluesseldienst-loehnberg/', '/ratgeber/rauchmelderpflicht/', '/ueber-uns/', '/kontakt/', '/suche/', '/impressum/', '/gibt-es-nicht/'];

/** Ein Ladelauf: Laden, dann (unter reduce) Scrollen über die ganze Seite; Animationen mit transform und sichtbare Textelemente. */
async function ladeLauf(browser, geraet, pfad, reduziert) {
  const { k, seite, extern } = await kontext(browser, geraet, reduziert);
  try {
    const antwort = await seite.goto(BASIS + pfad, { waitUntil: 'load' });
    const status = antwort ? antwort.status() : null;
    const aktiv = await seite.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
    await seite.evaluate(() => { window.__n2 = {}; });
    await seite.waitForTimeout(reduziert ? 5500 : 300);
    const vor = await snap(seite);
    const vorSichtbar = await seite.evaluate(pruefeSichtbar);
    if (reduziert) {
      const hoehe = await seite.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y <= hoehe; y += 300) { await seite.evaluate((yy) => window.scrollTo(0, yy), y); await seite.waitForTimeout(100); }
      await seite.waitForTimeout(5500);
    }
    const nach = await snap(seite);
    const nachSichtbar = await seite.evaluate(pruefeSichtbar);
    const transf = (s) => s.animationen.filter((a) => a.transformiert);
    return {
      geraet, pfad, modus: reduziert ? 'reduce' : 'no-preference (Kontrolle)', status, reduziert_aktiv: aktiv,
      transformierend_nach_laden: transf(vor).length, transformierend_nach_scrollen: transf(nach).length,
      transformierende_liste_nach_scrollen: transf(nach).map((a) => ({ art: a.art, element: a.ziel, uebergang: a.uebergang, animation: a.animation, eigenschaften: a.eigenschaften, dauer_ms: a.dauer_ms })),
      anzahl_animationen_nach_scrollen: nach.animationen.length,
      sichtbar_nach_laden: vorSichtbar.anzahl_probleme, sichtbar_nach_scrollen: nachSichtbar.anzahl_probleme,
      sichtbar_probleme: nachSichtbar.probleme, geprueft_textelemente: nachSichtbar.geprueft,
      externe_blockiert: extern.length,
    };
  } finally { await k.close(); }
}

const kurz = (t) => {
  if (t === undefined || t === null) return null;
  if (t === 'none') return 'none';
  const m = /matrix\(([^)]+)\)/.exec(t);
  if (!m) return t;
  const v = m[1].split(',').map((x) => Number(x.trim()));
  return { winkel_deg: Math.round(Math.atan2(v[1], v[0]) * 180 / Math.PI * 10) / 10, skalierung: Math.round(Math.hypot(v[0], v[1]) * 1000) / 1000, x_px: Math.round(v[4] * 100) / 100, y_px: Math.round(v[5] * 100) / 100 };
};

function zusammenfassung(laeufe) {
  const zeilen = [];
  for (const l of laeufe) {
    zeilen.push(`=== ${l.id} | ${l.modus} | ${l.geraet} | ${l.pfad}${l.ziel ? ' | ' + l.ziel : ''}`);
    const schritte = l.schritte ?? [l];
    for (const s of schritte) {
      const mess = s.messungen ?? [];
      zeilen.push(`-- ${s.schritt ?? s.label}  (fehlend: ${(s.fehlende_ziele || []).join(',') || '-'}; Messzeiten ms: ${mess.map((m) => m.ist_ms).join(' / ') || '-'})`);
      for (const name of Object.keys(s.vorher.elemente)) {
        const v = s.vorher.elemente[name];
        const teile = [`vorher t=${JSON.stringify(kurz(v?.transform))} op=${v?.opacity} disp=${v?.display} oben=${v?.oben} rueck=${v?.backdrop_deckkraft ?? '-'}`];
        for (const m of mess) {
          const a = m.elemente[name];
          teile.push(`${m.ist_ms}ms t=${JSON.stringify(kurz(a?.transform))} op=${a?.opacity} disp=${a?.display} oben=${a?.oben} rueck=${a?.backdrop_deckkraft ?? '-'}`);
        }
        zeilen.push(`   ${name}: ` + teile.join(' | '));
      }
      for (const m of mess) {
        const rel = m.animationen.filter((a) => a.element || a.transformiert);
        if (!rel.length) zeilen.push(`   Animationen/Übergänge bei ${m.ist_ms} ms: keine relevanten`);
        for (const a of rel) zeilen.push(`   Anim@${m.ist_ms}: ${a.art} ${a.uebergang ?? a.animation} [${a.eigenschaften.join(',')}] dauer=${a.dauer_ms} verz=${a.verzoegerung_ms} zeit=${a.zeit_ms} el=${a.element ?? a.ziel} transf=${a.transformiert} status=${a.status}`);
        zeilen.push(`   Anim@${m.ist_ms} gesamt: ${m.animationen.length} (transformiert: ${m.animationen.filter((a) => a.transformiert).length})`);
      }
    }
  }
  return zeilen.join('\n');
}

await mitMessSperre(`n4-bewegung-${modus}`, async () => {
  const browser = await starteBrowser();
  const daten = { werkzeug: 'n4-bewegung', modus, zeitpunkt: new Date().toISOString(), basis: BASIS };
  try {
    if (modus === 'interaktionen') {
      const reduce = await interaktionen(browser, true);
      const kontrolle = await interaktionen(browser, false);
      const druck = [];
      druck.push(await druecken(browser, true, '/preise/', 'label.wahl-option', 'g Rechner-Option (wahl-option)'));
      druck.push(await druecken(browser, false, '/preise/', 'label.wahl-option', 'g Rechner-Option (wahl-option)'));
      druck.push(await druecken(browser, true, '/preise/', 'a.formel-titel', 'g Formelzeile (formel-titel)'));
      druck.push(await druecken(browser, false, '/preise/', 'a.formel-titel', 'g Formelzeile (formel-titel)'));
      druck.push(await druecken(browser, true, '/notoeffnung/tueroeffnung/', '.rand-liste a', 'g Listenlink (rand-liste)'));
      druck.push(await druecken(browser, false, '/notoeffnung/tueroeffnung/', '.rand-liste a', 'g Listenlink (rand-liste)'));
      druck.push(await druecken(browser, true, '/einbruchschutz/', '.gruppe-register a', 'g Registerlink (gruppe-register)'));
      druck.push(await druecken(browser, false, '/einbruchschutz/', '.gruppe-register a', 'g Registerlink (gruppe-register)'));
      daten.laeufe = [...reduce, ...kontrolle, ...druck];
      await schreibeJson(`${ORDNER}/interaktionen.json`, daten);
      process.stdout.write(zusammenfassung(daten.laeufe) + '\n');
    } else if (modus === 'laden-mobil' || modus === 'laden-desktop') {
      const geraet = modus === 'laden-mobil' ? 'mobil' : 'desktop';
      daten.laden = [];
      for (const pfad of SEITEN) {
        daten.laden.push(await ladeLauf(browser, geraet, pfad, true));
        process.stdout.write(`laden reduce ${geraet} ${pfad}\n`);
      }
      await schreibeJson(`${ORDNER}/laden-${geraet}.json`, daten);
      for (const r of daten.laden) process.stdout.write(`${r.modus} ${r.geraet} ${r.pfad} status=${r.status} reduziert_aktiv=${r.reduziert_aktiv} transf_laden=${r.transformierend_nach_laden} transf_scrollen=${r.transformierend_nach_scrollen} sichtbar_probleme=${r.sichtbar_nach_scrollen} geprueft=${r.geprueft_textelemente} externe=${r.externe_blockiert}\n`);
    } else if (modus === 'kontrolle') {
      daten.kontrolle = [];
      daten.kontrolle.push(await ladeLauf(browser, 'mobil', '/', false));
      daten.kontrolle.push(await ladeLauf(browser, 'mobil', '/ueber-uns/', false));
      await schreibeJson(`${ORDNER}/kontrolle.json`, daten);
      for (const r of daten.kontrolle) process.stdout.write(`${r.modus} ${r.geraet} ${r.pfad} status=${r.status} reduziert_aktiv=${r.reduziert_aktiv} transf_laden=${r.transformierend_nach_laden} transf_scrollen=${r.transformierend_nach_scrollen}\n`);
    } else {
      throw new Error(`unbekannter Modus ${modus}`);
    }
  } finally {
    await browser.close();
  }
}).then(() => process.stdout.write(`ENDE ${modus}\n`)).catch((e) => {
  process.stderr.write(`n4-bewegung: Fehler: ${e.message}\n${e.stack}\n`);
  process.exitCode = 2;
});
