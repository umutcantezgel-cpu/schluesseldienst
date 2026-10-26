// Tastaturprotokoll Z-07 (H1–H5) und Menü-Blatt: nur Tab/Umschalt+Tab/Enter/Eingabe, keine Mausklicks.
// Aufruf: node tastatur.mjs --basis http://127.0.0.1:4251 --geraet mobil|desktop --aus <json>
import { parseArgs } from 'node:util';
import { starteBrowser, blockiereExtern, schreibeJson, mitMessSperre } from '/home/user/schluesseldienst/_werkstatt/werkzeuge/lib.mjs';

const GERAETE = {
  mobil: { width: 390, height: 844, opts: { isMobile: true, hasTouch: true } },
  desktop: { width: 1440, height: 900, opts: {} },
};
const HAUPT = ['/', '/einbruchschutz/', '/notoeffnung/tueroeffnung/', '/preise/', '/einsatzgebiet/', '/einsatzgebiet/hessen/limburg-weilburg/', '/schluesseldienst-loehnberg/', '/ratgeber/rauchmelderpflicht/', '/ueber-uns/', '/kontakt/', '/suche/', '/impressum/', '/gibt-es-nicht/'];

// Läuft im Browser: woher kommt der sichtbare Fokusumriss? Eigenes Element, Pseudo-Element ::after oder ein
// Vorfahr mit :focus-within (Kartenrahmen, Auswahlfeld, Verzeichniseintrag). null = kein Umriss.
// Läuft im Browser: misst das fokussierte Element (Sichtbarkeit des Fokus, Lage, Umfeld).
const fokus = () => {
  const ringAuf = (n, pseudo) => { if (!n) return false; const c = pseudo ? getComputedStyle(n, pseudo) : getComputedStyle(n); return c.outlineStyle !== 'none' && (parseFloat(c.outlineWidth) || 0) >= 2; };
  const ringQuelle = (el) => {
    if (ringAuf(el)) return 'element';
    if (ringAuf(el, '::after')) return 'pseudo-after';
    for (let n = el.parentElement, k = 0; n && k < 4; n = n.parentElement, k++) if (ringAuf(n) && n.matches(':focus-within')) return 'vorfahr:' + n.tagName.toLowerCase() + (n.className && typeof n.className === 'string' ? '.' + n.className.trim().split(/\s+/)[0] : '');
    return null;
  };
  const el = document.activeElement;
  if (!el || el === document.body || el === document.documentElement) return null;
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  const text = (el.innerText || el.getAttribute('aria-label') || el.getAttribute('data-platzhalter') || el.placeholder || el.value || '').trim().replace(/\s+/g, ' ').slice(0, 60);
  return {
    tag: el.tagName.toLowerCase(), id: el.id || null, href: el.getAttribute('href'), typ: el.getAttribute('type'),
    rolle: el.getAttribute('data-rolle'), text,
    fokusSichtbar: el.matches(':focus-visible'),
    outlineStil: cs.outlineStyle, outlineBreite: parseFloat(cs.outlineWidth) || 0, outlineFarbe: cs.outlineColor, outlineVersatz: cs.outlineOffset,
    ringQuelle: ringQuelle(el),
    schatten: cs.boxShadow !== 'none',
    inDialog: !!el.closest('dialog[open]'), inHauptnav: !!el.closest('.hauptnav'), inRufleiste: !!el.closest('.rufleiste'),
    rect: [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)],
    imSichtfeld: r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth,
  };
};
const sichtbar = (f) => !!f && f.fokusSichtbar && (!!f.ringQuelle || f.schatten);

async function tabBis(seite, pruefen, { max = 150, rueckwaerts = false, protokoll, zweck }) {
  for (let i = 1; i <= max; i++) {
    await seite.keyboard.press(rueckwaerts ? 'Shift+Tab' : 'Tab');
    const f = await seite.evaluate(fokus);
    protokoll.push({ zweck, schritt: i, ...(f ?? { leer: true }) });
    if (f && pruefen(f)) return { n: i, f };
  }
  return null;
}
const enter = async (seite, ziel) => {
  await Promise.all([seite.waitForURL((u) => u.pathname === ziel, { timeout: 15000 }), seite.keyboard.press('Enter')]);
  await seite.waitForLoadState('load');
};

async function main() {
  const { values: a } = parseArgs({ strict: true, options: { basis: { type: 'string' }, geraet: { type: 'string' }, aus: { type: 'string' } } });
  if (!a.basis || !a.geraet || !a.aus || !GERAETE[a.geraet]) throw new Error('--basis, --geraet mobil|desktop und --aus sind Pflicht');
  const basis = new URL(a.basis);
  const g = GERAETE[a.geraet];
  const mobil = a.geraet === 'mobil';
  const protokoll = [];
  const ergebnis = { h1: [], h2: null, h3: null, h4: null, h5: null, menueBlatt: null };
  const browser = await starteBrowser();
  const neu = async () => {
    const kontext = await browser.newContext({ viewport: { width: g.width, height: g.height }, deviceScaleFactor: 1, colorScheme: 'light', ...g.opts });
    const extern = await blockiereExtern(kontext, [basis.hostname, '127.0.0.1', 'localhost']);
    const seite = await kontext.newPage();
    return { kontext, seite, extern };
  };
  const url = (p) => new URL(p, basis).href;
  try {
    // H1: Tab-Schritte vom Seitenanfang bis zum Anrufknopf (Link tel:), je Hauptansicht.
    for (const pfad of HAUPT) {
      const { kontext, seite } = await neu();
      await seite.goto(url(pfad), { waitUntil: 'load' });
      const info = await seite.evaluate(() => ({
        telLinks: document.querySelectorAll('a[href^="tel:"]').length,
        rufknopfOhneLink: document.querySelectorAll('span.rufknopf').length,
      }));
      const t = await tabBis(seite, (f) => !!f.href && f.href.startsWith('tel:'), { max: 200, protokoll, zweck: `H1 ${pfad}` });
      ergebnis.h1.push({ pfad, ...info, tabSchritteBisAnruf: t ? t.n : null, anrufFokusSichtbar: t ? sichtbar(t.f) : null, anrufText: t ? t.f.text : null });
      await kontext.close();
    }

    // H2: Preis vor dem Anruf: Startseite -> Preise (mobil über das Menü-Blatt), dann Preistabelle.
    {
      const { kontext, seite } = await neu();
      await seite.goto(url('/'), { waitUntil: 'load' });
      let aktivierungen = 0; const schritte = [];
      if (mobil) {
        schritte.push(await tabBis(seite, (f) => f.inRufleiste && f.href === '#seitennavigation', { max: 150, protokoll, zweck: 'H2 Menü' }));
        await seite.keyboard.press('Enter'); aktivierungen++;
        await seite.waitForSelector('dialog.menue-blatt[open]', { timeout: 5000 });
        schritte.push(await tabBis(seite, (f) => f.inDialog && f.href === '/preise/', { max: 80, protokoll, zweck: 'H2 Preise im Blatt' }));
      } else {
        schritte.push(await tabBis(seite, (f) => f.inHauptnav && f.href === '/preise/', { max: 150, protokoll, zweck: 'H2 Preise Hauptnav' }));
      }
      const ziel = schritte.at(-1);
      if (ziel) { await enter(seite, '/preise/'); aktivierungen++; }
      const seitenInfo = ziel ? await seite.evaluate(() => ({
        pfad: location.pathname,
        tabellen: [...document.querySelectorAll('table')].map((t) => ({ beschriftung: (t.querySelector('caption')?.textContent || '(ohne Beschriftung)').trim().slice(0, 90), oberkanteImSichtfeld: t.getBoundingClientRect().top < innerHeight, zeilen: t.rows.length })),
        h1: document.querySelector('h1')?.textContent.trim().slice(0, 90),
      })) : null;
      ergebnis.h2 = { tabSchritte: schritte.map((s) => (s ? s.n : null)), aktivierungen, zielErreicht: !!ziel, seite: seitenInfo };
      await kontext.close();
    }

    // H3: Ort prüfen: Startseite -> Ortsfeld (Tab), Text eingeben, Vorschlag wählen (Pfeil ab, Enter).
    {
      const { kontext, seite } = await neu();
      await seite.goto(url('/'), { waitUntil: 'load' });
      const feld = await tabBis(seite, (f) => f.id === 'hero-ort-eingabe', { max: 150, protokoll, zweck: 'H3 Ortsfeld' });
      let sichtbaresFeld = false, vorschlaege = 0, ergebnisText = null;
      if (feld) {
        sichtbaresFeld = await seite.locator('#hero-ort-eingabe').isVisible();
        await seite.keyboard.type('Löhnberg', { delay: 40 }); // Eingabe 1
        try { await seite.waitForSelector('#hero-ort-liste [role="option"]', { timeout: 5000 }); } catch {}
        vorschlaege = await seite.locator('#hero-ort-liste [role="option"]').count();
        await seite.keyboard.press('ArrowDown');
        await seite.keyboard.press('Enter'); // Eingabe 2 (Auswahl)
        await seite.waitForTimeout(500);
        ergebnisText = await seite.evaluate(() => {
          const e = document.querySelector('.ortspruefung-ergebnis:not([hidden])');
          return e ? e.innerText.trim().replace(/\s+/g, ' ').slice(0, 300) : null;
        });
      }
      ergebnis.h3 = { tabSchritteBisFeld: feld ? feld.n : null, feldFokusSichtbar: feld ? sichtbar(feld.f) : null, feldSichtbar: sichtbaresFeld, vorschlaege, eingaben: feld ? 2 : 0, ergebnisText, url: await seite.evaluate(() => location.pathname) };
      await kontext.close();
    }

    // H4: seriösen Betrieb erkennen: Über uns -> Impressum, nur Tastatur; Platzhalter als Fakt festhalten.
    {
      const { kontext, seite } = await neu();
      await seite.goto(url('/'), { waitUntil: 'load' });
      let aktivierungen = 0; let zwischen = [];
      if (mobil) {
        zwischen.push(await tabBis(seite, (f) => f.inRufleiste && f.href === '#seitennavigation', { max: 150, protokoll, zweck: 'H4 Menü' }));
        await seite.keyboard.press('Enter'); aktivierungen++;
        await seite.waitForSelector('dialog.menue-blatt[open]', { timeout: 5000 });
        zwischen.push(await tabBis(seite, (f) => f.inDialog && f.href === '/ueber-uns/', { max: 80, protokoll, zweck: 'H4 Über uns im Blatt' }));
      } else {
        zwischen.push(await tabBis(seite, (f) => f.inHauptnav && f.href === '/ueber-uns/', { max: 150, protokoll, zweck: 'H4 Über uns Hauptnav' }));
      }
      if (zwischen.at(-1)) { await enter(seite, '/ueber-uns/'); aktivierungen++; }
      const ueber = await seite.evaluate(() => ({ pfad: location.pathname, weilburgImText: document.body.innerText.includes('Weilburg'), platzhalter: document.querySelectorAll('.platzhalter').length }));
      const imp = await tabBis(seite, (f) => f.href === '/impressum/', { max: 300, protokoll, zweck: 'H4 Impressum von Über uns' });
      if (imp) { await enter(seite, '/impressum/'); aktivierungen++; }
      const impressum = await seite.evaluate(() => ({ pfad: location.pathname, platzhalter: document.querySelectorAll('.platzhalter').length, h1: document.querySelector('h1')?.textContent.trim().slice(0, 80) }));
      ergebnis.h4 = { aktivierungen, ueberUns: ueber, impressumTabSchritte: imp ? imp.n : null, impressumFokusSichtbar: imp ? sichtbar(imp.f) : null, impressum };
      await kontext.close();
    }

    // H5: Anfrage per E-Mail vorbereiten: Kontakt -> Ort, Nachricht -> Absenden (Enter).
    {
      const { kontext, seite } = await neu();
      await seite.goto(url('/'), { waitUntil: 'load' });
      let aktivierungen = 0;
      if (mobil) {
        await tabBis(seite, (f) => f.inRufleiste && f.href === '#seitennavigation', { max: 150, protokoll, zweck: 'H5 Menü' });
        await seite.keyboard.press('Enter'); aktivierungen++;
        await seite.waitForSelector('dialog.menue-blatt[open]', { timeout: 5000 });
        await tabBis(seite, (f) => f.inDialog && f.href === '/kontakt/', { max: 80, protokoll, zweck: 'H5 Kontakt im Blatt' });
      } else {
        await tabBis(seite, (f) => f.inHauptnav && f.href === '/kontakt/', { max: 150, protokoll, zweck: 'H5 Kontakt Hauptnav' });
      }
      await enter(seite, '/kontakt/'); aktivierungen++;
      const ort = await tabBis(seite, (f) => f.id === 'k-ort', { max: 150, protokoll, zweck: 'H5 Ort-Feld' });
      if (ort) await seite.keyboard.type('Weilburg', { delay: 30 });
      const nach = await tabBis(seite, (f) => f.id === 'k-nachricht', { max: 150, protokoll, zweck: 'H5 Nachricht-Feld' });
      if (nach) await seite.keyboard.type('Bitte um ein Angebot fuer eine Schliessanlage.', { delay: 10 });
      const knopf = await tabBis(seite, (f) => f.rolle === 'absenden', { max: 150, protokoll, zweck: 'H5 Absenden' });
      let meldung = null, aktionUrl = null;
      if (knopf) {
        await seite.keyboard.press('Enter'); aktivierungen++;
        await seite.waitForTimeout(600);
        meldung = await seite.evaluate(() => {
          const m = document.querySelector('[data-rolle="ohne-adresse"]:not([hidden])');
          return m ? m.textContent.trim().replace(/\s+/g, ' ').slice(0, 200) : null;
        });
        aktionUrl = await seite.evaluate(() => ({ pfad: location.pathname, fokus: document.activeElement?.getAttribute('data-rolle') || document.activeElement?.id || document.activeElement?.tagName }));
      }
      ergebnis.h5 = { tabSchritte: { ort: ort?.n ?? null, nachricht: nach?.n ?? null, absenden: knopf?.n ?? null }, eingaben: 2, aktivierungen, absendenFokusSichtbar: knopf ? sichtbar(knopf.f) : null, hinweisNachAbsenden: meldung, nachAbsenden: aktionUrl };
      await kontext.close();
    }

    // Menü-Blatt (nur mobil): Anruf im geöffneten Blatt mit Tab erreichbar?
    if (mobil) {
      const { kontext, seite } = await neu();
      await seite.goto(url('/schluesseldienst-loehnberg/'), { waitUntil: 'load' });
      const menue = await tabBis(seite, (f) => f.inRufleiste && f.href === '#seitennavigation', { max: 150, protokoll, zweck: 'Blatt Menü' });
      await seite.keyboard.press('Enter');
      await seite.waitForSelector('dialog.menue-blatt[open]', { timeout: 5000 });
      const im = await tabBis(seite, (f) => f.inDialog && !!f.href && f.href.startsWith('tel:'), { max: 80, protokoll, zweck: 'Blatt Anruf' });
      const blatt = await seite.evaluate(() => {
        const r = document.querySelector('dialog.menue-blatt .menue-blatt-ruf');
        const b = r?.getBoundingClientRect();
        return { vorhanden: !!r, ueberSichtfeld: b ? b.bottom <= innerHeight : null, rufknopfAlsLink: !!r?.querySelector('a[href^="tel:"]') };
      });
      ergebnis.menueBlatt = { tabSchritteBisMenue: menue ? menue.n : null, tabSchritteBisAnruf: im ? im.n : null, anrufFokusSichtbar: im ? sichtbar(im.f) : null, blatt };
      await kontext.close();
    }
  } finally {
    await browser.close();
  }
  const fokusStopps = protokoll.filter((p) => !p.leer);
  const ohneSichtbar = fokusStopps.filter((p) => !sichtbar(p));
  const quellen = {}; for (const p of fokusStopps) { const k = p.ringQuelle ? p.ringQuelle.split(':')[0] + (p.ringQuelle.startsWith('vorfahr') ? ':' + p.ringQuelle.split(':')[1] : '') : 'kein'; quellen[k] = (quellen[k] || 0) + 1; }
  const zusammen = {
    werkzeug: 'tastatur-protokoll', basis: basis.href, geraet: a.geraet, breite: g.width, hoehe: g.height,
    zeitpunkt: new Date().toISOString(), fokusStopps: fokusStopps.length, fokusStoppsOhneSichtbarenFokus: ohneSichtbar.length, ringQuellen: quellen,
    beispieleOhneFokus: ohneSichtbar.slice(0, 12).map((p) => ({ zweck: p.zweck, schritt: p.schritt, tag: p.tag, text: p.text, outlineStil: p.outlineStil, outlineBreite: p.outlineBreite, fokusSichtbar: p.fokusSichtbar, ringQuelle: p.ringQuelle })),
    ergebnis, protokoll,
  };
  await schreibeJson(a.aus, zusammen);
  console.log(JSON.stringify({ geraet: a.geraet, basis: basis.href, fokusStopps: zusammen.fokusStopps, ohneSichtbarenFokus: zusammen.fokusStoppsOhneSichtbarenFokus, h1: ergebnis.h1.map((x) => `${x.pfad} ${x.tabSchritteBisAnruf ?? 'nein'} (tel ${x.telLinks})`), h2: ergebnis.h2 && { tabSchritte: ergebnis.h2.tabSchritte, aktivierungen: ergebnis.h2.aktivierungen, zielErreicht: ergebnis.h2.zielErreicht }, h3: ergebnis.h3 && { tabSchritteBisFeld: ergebnis.h3.tabSchritteBisFeld, vorschlaege: ergebnis.h3.vorschlaege, ergebnisText: ergebnis.h3.ergebnisText?.slice(0, 120) }, h4: ergebnis.h4 && { aktivierungen: ergebnis.h4.aktivierungen, impressumTabSchritte: ergebnis.h4.impressumTabSchritte, impressum: ergebnis.h4.impressum }, h5: ergebnis.h5, menueBlatt: ergebnis.menueBlatt }, null, 1));
  return 0;
}

mitMessSperre(`pruefer-tastatur-${process.argv.includes('--geraet') ? process.argv[process.argv.indexOf('--geraet') + 1] : 'x'}`, main).then(
  (code) => process.exit(code),
  (e) => { console.error(`Werkzeugfehler: ${e.stack || e.message}`); process.exit(2); },
);
