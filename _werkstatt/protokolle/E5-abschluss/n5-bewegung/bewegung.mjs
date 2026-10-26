// N5-Bewegung (Haiku-Prüfer, Endmessung, Stand 72ed87c). Kopie von .cache/e5-abschluss/n2-bewegung/bewegung.mjs.
// Gegenüber der Vorlage: Ausgabe nur unter diesem Ordner; je Interaktion Messpunkte 40, 120, 200 und 400 ms nach dem Klick
// (Ist-Zeit je Punkt mitgeschrieben); currentTime jeder Animation/Übergangs je Punkt; Knopf und Rufknopf beim Drücken.
// Laden in drei Teilen (je unter 9 Minuten): laden-mobil, laden-desktop, laden-kontrolle.
// Aufruf: node bewegung.mjs interaktionen | laden-mobil | laden-desktop | laden-kontrolle
import { starteBrowser, blockiereExtern, mitMessSperre, schreibeJson } from '/home/user/schluesseldienst/_werkstatt/werkzeuge/lib.mjs';

const BASIS = 'http://127.0.0.1:4251';
const ORDNER = '/home/user/schluesseldienst/.cache/e5-final/n5-bewegung';
const GERAETE = { mobil: { width: 390, height: 844 }, desktop: { width: 1440, height: 900 } };
const modus = process.argv[2] ?? 'interaktionen';
const PUNKTE = [40, 120, 200, 400];
const SEITEN = ['/', '/einbruchschutz/', '/notoeffnung/tueroeffnung/', '/preise/', '/einsatzgebiet/', '/einsatzgebiet/hessen/limburg-weilburg/', '/schluesseldienst-loehnberg/', '/ratgeber/rauchmelderpflicht/', '/ueber-uns/', '/kontakt/', '/suche/', '/impressum/', '/gibt-es-nicht/'];

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
    elemente[name] = {
      ziel: beschr(el), transform: cs.transform, opacity: cs.opacity, sichtbar: cs.visibility, display: cs.display,
      oben: Math.round(r.top * 100) / 100, offen: el.tagName === 'DIALOG' ? el.open : null, aria_expanded: el.getAttribute('aria-expanded'),
    };
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
      zeit_ms: typeof a.currentTime === 'number' ? Math.round(a.currentTime) : null,
      transformiert: [...eig].some((p) => /transform|translate|scale|rotate/.test(p)) || /transform|translate|scale|rotate|^all$/.test(uebergang || ''),
      status: a.playState,
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

/** Eine Interaktion: Ausgangszustand, Auslösen, dann Messpunkte 40, 120, 200 und 400 ms ab dem Ende des Klicks. */
async function schritt(seite, label, ziele, aktion, neu = false) {
  const fehlend = await markiere(seite, ziele);
  const vorher = await snap(seite);
  await aktion();
  const tKlick = await seite.evaluate(() => performance.now());
  if (neu) await markiere(seite, ziele);
  const proben = [];
  for (const p of PUNKTE) {
    const jetzt = await seite.evaluate(() => performance.now());
    const warte = p - (jetzt - tKlick);
    if (warte > 0) await seite.waitForTimeout(warte);
    const s = await snap(seite);
    proben.push({ soll_ms: p, ist_ms: Math.round(s.zeit - tKlick), elemente: s.elemente, animationen: s.animationen });
  }
  return { schritt: label, fehlende_ziele: fehlend, t_klick: Math.round(tKlick), vorher: { elemente: vorher.elemente, animationen: vorher.animationen }, proben };
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
      }, () => seite.click('.faq-eintrag:not([open]) .faq-frage'))];
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
        await schritt(seite, 'b Leistungen aufklappen', ziele, () => seite.click('.hauptnav-aufklapper')),
        await schritt(seite, 'b Leistungen zuklappen', ziele, () => seite.click('.hauptnav-aufklapper')),
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
        await schritt(seite, 'c Menü-Blatt öffnen', { knopf: '[aria-controls="menue-blatt"]', blatt: '#menue-blatt' }, () => seite.click('[aria-controls="menue-blatt"]')),
        await schritt(seite, 'c Menü-Blatt schließen', { blatt: '#menue-blatt' }, () => seite.click('#menue-blatt [data-menue-zu]')),
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
        await schritt(seite, 'e Anliegen Notfall', ziele, () => seite.locator('input[name="anliegen"][value="notfall"]').check({ force: true }), true),
        await schritt(seite, 'e Anliegen planbar (Mail-Zweig)', ziele, () => seite.locator('input[name="anliegen"][value="planbar"]').check({ force: true }), true),
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

/** g) Drücken (:active, Maus gedrückt halten, kein Klick vor der Messung): Zustand während der Taste gedrückt. */
async function druecken(browser, reduziert, pfad, sel, label) {
  const { k, seite, extern } = await kontext(browser, 'mobil', reduziert);
  try {
    await seite.goto(BASIS + pfad, { waitUntil: 'load' });
    await seite.waitForTimeout(5500);
    const ort = seite.locator(sel).first();
    const anzahl = await seite.locator(sel).count();
    if (!anzahl) return { id: 'g-druck', modus: reduziert ? 'reduce' : 'no-preference', pfad, ziel: sel, label, fehler: 'Ziel nicht gefunden' };
    await ort.scrollIntoViewIfNeeded();
    const box = await ort.boundingBox();
    const fehlend = await markiere(seite, { ziel: sel });
    await seite.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    const vorher = await snap(seite);
    await seite.mouse.down();
    const tDruck = await seite.evaluate(() => performance.now());
    const proben = [];
    for (const p of PUNKTE) {
      const jetzt = await seite.evaluate(() => performance.now());
      const warte = p - (jetzt - tDruck);
      if (warte > 0) await seite.waitForTimeout(warte);
      const s = await snap(seite);
      proben.push({ soll_ms: p, ist_ms: Math.round(s.zeit - tDruck), elemente: s.elemente, animationen: s.animationen });
    }
    await seite.mouse.up().catch(() => {});
    return { id: 'g-druck', modus: reduziert ? 'reduce' : 'no-preference', geraet: 'mobil 390x844', pfad, ziel: sel, label, anzahl_treffer: anzahl, fehlende_ziele: fehlend, t_klick: Math.round(tDruck), vorher: { elemente: vorher.elemente, animationen: vorher.animationen }, proben, externe_blockiert: extern.length };
  } finally { await k.close(); }
}

async function laufe(browser, geraet, pfad, reduziert) {
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
      transformierende_liste_nach_scrollen: transf(nach).map((a) => ({ art: a.art, element: a.ziel, uebergang: a.uebergang, animation: a.animation, eigenschaften: a.eigenschaften, dauer_ms: a.dauer_ms, status: a.status })),
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

/** Kurzfassung: je Element Werte an allen Messpunkten; je Animation (gruppiert) die currentTime je Punkt. */
function zusammenfassung(laeufe) {
  const zeilen = [];
  for (const l of laeufe) {
    zeilen.push(`=== ${l.id} | ${l.modus} | ${l.geraet} | ${l.pfad}${l.ziel ? ' | ' + l.ziel : ''}${l.fehler ? ' | FEHLER ' + l.fehler : ''}`);
    const schritte = l.schritte ?? [l];
    for (const s of schritte) {
      if (!s.proben) continue;
      zeilen.push(`-- ${s.schritt ?? s.label}  (fehlend: ${(s.fehlende_ziele || []).join(',') || '-'}; Klick t=${s.t_klick})`);
      const v = s.vorher.elemente;
      for (const name of Object.keys(s.proben[0].elemente)) {
        const vv = v[name];
        let txt = `   ${name}: vorher t=${JSON.stringify(kurz(vv?.transform))} op=${vv?.opacity} oben=${vv?.oben}${vv?.offen !== null && vv?.offen !== undefined ? ' offen=' + vv.offen : ''}`;
        for (const p of s.proben) {
          const a = p.elemente[name];
          txt += ` | ${p.ist_ms}ms t=${JSON.stringify(kurz(a?.transform))} op=${a?.opacity} oben=${a?.oben}${a?.offen !== null && a?.offen !== undefined ? ' offen=' + a.offen : ''}`;
        }
        zeilen.push(txt);
      }
      const gruppen = new Map();
      s.proben.forEach((p, i) => {
        for (const a of p.animationen.filter((x) => x.element || x.transformiert)) {
          const schl = `${a.art}|${a.ziel}|${a.uebergang ?? a.animation}|${a.eigenschaften.join(',')}|dauer=${a.dauer_ms}|verz=${a.verzoegerung_ms}`;
          if (!gruppen.has(schl)) gruppen.set(schl, Array(s.proben.length).fill('-'));
          gruppen.get(schl)[i] = `${a.status}:${a.zeit_ms}`;
        }
      });
      if (!gruppen.size) zeilen.push('   Animationen/Übergänge: keine (transformierend oder mit Element)');
      for (const [schl, werte] of gruppen) zeilen.push(`   ANIM ${schl} | Zeit je Punkt (${s.proben.map((p) => p.ist_ms).join('/')} ms): ${werte.join(' ')}`);
      zeilen.push(`   transformierende Animationen je Punkt: ${s.proben.map((p) => p.animationen.filter((a) => a.transformiert).length).join('/')}`);
    }
  }
  return zeilen.join('\n');
}

await mitMessSperre(`n5-bewegung-${modus}`, async () => {
  const browser = await starteBrowser();
  const daten = { werkzeug: 'n5-bewegung', modus, zeitpunkt: new Date().toISOString(), basis: BASIS, stand: '72ed87c' };
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
      druck.push(await druecken(browser, true, '/', '.knopf-sekundaer', 'g Knopf (knopf-sekundaer)'));
      druck.push(await druecken(browser, false, '/', '.knopf-sekundaer', 'g Knopf (knopf-sekundaer)'));
      druck.push(await druecken(browser, true, '/', '.rufknopf-leiste', 'g Rufknopf (rufknopf-leiste)'));
      druck.push(await druecken(browser, false, '/', '.rufknopf-leiste', 'g Rufknopf (rufknopf-leiste)'));
      daten.laeufe = [...reduce, ...kontrolle, ...druck];
      await schreibeJson(`${ORDNER}/interaktionen.json`, daten);
      process.stdout.write(zusammenfassung(daten.laeufe) + '\n');
    } else if (modus === 'laden-mobil') {
      daten.laden = [];
      for (const pfad of SEITEN) { daten.laden.push(await laufe(browser, 'mobil', pfad, true)); process.stdout.write(`reduce mobil ${pfad}\n`); }
      await schreibeJson(`${ORDNER}/laden-mobil.json`, daten);
    } else if (modus === 'laden-desktop') {
      daten.laden = [];
      for (const pfad of SEITEN) { daten.laden.push(await laufe(browser, 'desktop', pfad, true)); process.stdout.write(`reduce desktop ${pfad}\n`); }
      await schreibeJson(`${ORDNER}/laden-desktop.json`, daten);
    } else if (modus === 'laden-kontrolle') {
      daten.laden = [await laufe(browser, 'mobil', '/', false), await laufe(browser, 'mobil', '/ueber-uns/', false)];
      await schreibeJson(`${ORDNER}/laden-kontrolle.json`, daten);
    } else {
      throw new Error(`unbekannter Modus ${modus}`);
    }
    for (const r of daten.laden ?? []) process.stdout.write(`${r.modus} ${r.geraet} ${r.pfad} status=${r.status} reduziert_aktiv=${r.reduziert_aktiv} transf_laden=${r.transformierend_nach_laden} transf_scrollen=${r.transformierend_nach_scrollen} anim_scrollen=${r.anzahl_animationen_nach_scrollen} sichtbar_laden=${r.sichtbar_nach_laden} sichtbar_scrollen=${r.sichtbar_nach_scrollen} geprueft=${r.geprueft_textelemente} externe=${r.externe_blockiert}\n`);
  } finally {
    await browser.close();
  }
}).then(() => process.stdout.write(`ENDE ${modus}\n`)).catch((e) => {
  process.stderr.write(`n5-bewegung: Fehler: ${e.message}\n${e.stack}\n`);
  process.exitCode = 2;
});
