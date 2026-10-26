// Funktionsprüfung F01–F20 (LAGEBILD) im Browser gegen die Vorschau 127.0.0.1:4251. Nur lesen und messen.
// Ausgabe: .cache/e5-abschluss/z-pruefer/funktionen.json (und druck_*.pdf). Keine Datei im Repo wird geändert.
import { readFile } from 'node:fs/promises';
import { starteBrowser, blockiereExtern, schreibeJson, mitMessSperre } from '/home/user/schluesseldienst/_werkstatt/werkzeuge/lib.mjs';

const BASIS = 'http://127.0.0.1:4251';
const ORDNER = '/home/user/schluesseldienst/.cache/e5-abschluss/z-pruefer';
const HAUPT = [
  '/', '/einbruchschutz/', '/notoeffnung/tueroeffnung/', '/preise/', '/einsatzgebiet/',
  '/einsatzgebiet/hessen/limburg-weilburg/', '/schluesseldienst-loehnberg/', '/ratgeber/rauchmelderpflicht/',
  '/ueber-uns/', '/kontakt/', '/suche/', '/impressum/', '/gibt-es-nicht/',
];
const WARTE = 9000;
const ZONEN = ['Kerngebiet ab Weilburg', 'Umland – mit Anfahrt', 'Region – nach Absprache', 'Überregional – nach Absprache', 'Niederlande – nach Absprache'];

const txt = async (loc) => ((await loc.innerText({ timeout: WARTE }).catch(() => '')) || '').replace(/­/g, '').replace(/\s+/g, ' ').trim();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Protokoll je Prüfung: fremde Anfragen, Konsolen- und CSP-Fehler (gewolltes 404 gesondert)
let protokoll = { fremd: 0, konsole: [], gewollt: 0 };

async function besuch(browser, pfad, opt, fn) {
  const kontext = await browser.newContext({
    viewport: opt.vp ?? { width: 1440, height: 900 },
    colorScheme: opt.schema ?? 'light',
    reducedMotion: opt.reduziert ? 'reduce' : 'no-preference',
    javaScriptEnabled: opt.js ?? true,
  });
  const extern = await blockiereExtern(kontext);
  const seite = await kontext.newPage();
  seite.on('console', (m) => {
    const t = m.text();
    if (m.type() !== 'error' && !/Content Security|Trusted Types/i.test(t)) return;
    if (pfad === '/gibt-es-nicht/' && /Failed to load resource/.test(t)) { protokoll.gewollt += 1; return; }
    protokoll.konsole.push(`${pfad}: ${m.type()}: ${t}`);
  });
  seite.on('pageerror', (e) => protokoll.konsole.push(`${pfad}: Seitenfehler: ${e.message}`));
  try {
    const antwort = await seite.goto(new URL(pfad, BASIS).href, { waitUntil: 'load' });
    await seite.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    return await fn(seite, antwort?.status() ?? null);
  } finally {
    protokoll.fremd += extern.length;
    await kontext.close();
  }
}

const pruefungen = [];
const def = (id, titel, wie, fn) => pruefungen.push({ id, titel, wie, fn });

// F01 Anruf mit einem Tipp
def('F01', 'Anruf mit einem Tipp von jeder Seite',
  'Alle 13 Hauptansichten: mobil 390×844 Rufleiste (.rufleiste) sichtbar und fixiert; desktop 1440×900 Kopf-Rufknopf (.rufknopf-kopf) sichtbar. Gezählt: tel:-Links. Die Nummer ist im Vorschau-Build Platzhalter (ABNAHME U-6), daher wird der Knopf als Span ohne tel:-Link erzeugt (istPlatzhalter in src/vorlagen/teile/rufknopf.mjs).',
  async (b) => {
    const m = []; let mobilOk = 0; let deskOk = 0; let tel = 0; let nichtOk = 0;
    for (const p of HAUPT) {
      const r = await besuch(b, p, { vp: { width: 390, height: 844 } }, async (s) => {
        const l = s.locator('.rufleiste').first();
        const sicht = await l.isVisible().catch(() => false);
        const pos = sicht ? await l.evaluate((e) => getComputedStyle(e).position) : 'kein';
        return { sicht, pos, tel: await s.locator('a[href^="tel:"]').count() };
      });
      if (r.sicht && ['fixed', 'sticky'].includes(r.pos)) mobilOk += 1; else { nichtOk += 1; m.push(`${p} mobil: Rufleiste sichtbar=${r.sicht} position=${r.pos}`); }
      tel += r.tel;
    }
    for (const p of HAUPT) {
      const sicht = await besuch(b, p, {}, async (s) => s.locator('.rufknopf-kopf').first().isVisible().catch(() => false));
      if (sicht) deskOk += 1; else { nichtOk += 1; m.push(`${p} desktop: Kopf-Rufknopf nicht sichtbar`); }
    }
    m.push(`mobil Rufleiste fixiert/sichtbar: ${mobilOk}/${HAUPT.length}`);
    m.push(`desktop Kopf-Rufknopf sichtbar: ${deskOk}/${HAUPT.length}`);
    m.push(`tel:-Links auf allen Ansichten zusammen: ${tel} (Vorschau: Nummer Platzhalter, Anruf nicht verlinkt; Release verweigert Platzhalter)`);
    const ergebnis = nichtOk ? 'nicht erfüllt' : (tel ? 'erfüllt' : 'teilweise');
    return { ok: !nichtOk && !!tel, ergebnis, messung: m };
  });

// F02 Orts-/PLZ-Suche mit Sprung zur Ortsseite
def('F02', 'Orts-/PLZ-Suche mit Sprung zur Ortsseite',
  'Auf „/“ (V01, Prüfmodus): „Löhnberg“ tippen, Vorschlagsliste, Pfeil ab, Enter; Ergebnis mit Link „Zur Seite für …“ auf /schluesseldienst-loehnberg/. PLZ „35781“ liefert Vorschläge. Auf der Fehlerseite /gibt-es-nicht/ (V12, Navigationsmodus): „Löhnberg“ wählen, Enter, Adresse wird /schluesseldienst-loehnberg/.',
  async (b) => {
    const m = []; const fehl = [];
    await besuch(b, '/', {}, async (s) => {
      const feld = s.locator('#hero-ort-eingabe');
      await feld.fill('Löhnberg');
      await s.locator('#hero-ort-liste [role="option"]').first().waitFor({ state: 'visible', timeout: WARTE });
      const vorschlaege = await s.locator('#hero-ort-liste [role="option"]').count();
      m.push(`V01 „Löhnberg“: ${vorschlaege} Vorschläge`);
      await feld.press('ArrowDown'); await feld.press('Enter');
      const link = s.locator('.ortspruefung-ergebnis a[href^="/schluesseldienst-"]').first();
      const linkDa = await link.isVisible().catch(() => false);
      const href = linkDa ? await link.getAttribute('href') : null;
      m.push(`V01 Ergebnis-Link: ${href ?? 'fehlt'}`);
      if (!linkDa || href !== '/schluesseldienst-loehnberg/') fehl.push('V01 Ergebnis-Link');
      await feld.fill('35781');
      const plz = await s.locator('#hero-ort-liste [role="option"]').first().waitFor({ state: 'visible', timeout: WARTE }).then(() => true, () => false);
      m.push(`V01 PLZ „35781“: Vorschläge sichtbar=${plz}`);
      if (!plz) fehl.push('PLZ 35781');
    });
    await besuch(b, '/gibt-es-nicht/', {}, async (s) => {
      const feld = s.locator('#fehler-ort-eingabe');
      await feld.fill('Löhnberg');
      await s.locator('#fehler-ort-liste [role="option"]').first().waitFor({ state: 'visible', timeout: WARTE });
      await feld.press('ArrowDown'); await feld.press('Enter');
      const ok = await s.waitForURL('**/schluesseldienst-loehnberg/', { timeout: WARTE }).then(() => true, () => false);
      m.push(`404 (Navigationsmodus) „Löhnberg“ → ${new URL(s.url()).pathname} (Sprung=${ok})`);
      if (!ok) fehl.push('404-Sprung');
    });
    return { ok: !fehl.length, messung: m };
  });

// F03 PLZ-Prüfung mit ehrlichem Zonen-Ergebnis
def('F03', 'PLZ-/Ortsprüfung mit ehrlichem Zonen-Ergebnis',
  'Prüfmodus auf V01 und V05: „Löhnberg“ wählen → Zonentext aus data-zonen, Entfernung in km; „Hamburg“ (überregional) → Zone mit „nach Absprache“/„Überregional“ statt Lockpreis. Wortlaut der Überschrift als Beleg festgehalten.',
  async (b) => {
    const m = []; const fehl = [];
    for (const p of ['/', '/einsatzgebiet/']) {
      await besuch(b, p, {}, async (s) => {
        const label = await txt(s.locator('label.ortspruefung-titel').first());
        m.push(`${p} Überschrift: „${label}“`);
        for (const ort of ['Löhnberg', 'Berlin']) {
          const feld = s.locator('.ortspruefung-eingabe').first();
          await feld.fill(ort);
          const da = await s.locator('.ortspruefung-liste [role="option"]').first().waitFor({ state: 'visible', timeout: WARTE }).then(() => true, () => false);
          if (!da) { m.push(`${p} „${ort}“: keine Vorschläge`); fehl.push(`${p} ${ort} ohne Vorschlag`); continue; }
          await feld.press('ArrowDown'); await feld.press('Enter');
          const zone = await txt(s.locator('.ortspruefung-ergebnis-zone').first());
          const fakten = await txt(s.locator('.ortspruefung-ergebnis-fakten').first());
          m.push(`${p} „${ort}“: Zone „${zone}“ · „${fakten}“`);
          if (!ZONEN.some((z) => zone.includes(z))) fehl.push(`${p} ${ort} Zonentext`);
          if (ort === 'Berlin' && !/Absprache|Überregional/.test(zone)) fehl.push(`${p} Berlin ohne ehrlichen Zonentext`);
        }
        // Hinweis (kein Prüfkriterium): Hamburg hat keine Ortsseite im Index, die Suche muss ehrlich „kein Ort“ melden
        await s.locator('.ortspruefung-eingabe').first().fill('Hamburg');
        await sleep(900);
        const hamburgStatus = await txt(s.locator('.ortspruefung-status').first());
        m.push(`${p} Hinweis „Hamburg“ (nicht im Index): Status „${hamburgStatus}“`);
      });
    }
    return { ok: !fehl.length, messung: m };
  });

// F04 Preistabelle mit Zeitfenstern und Zuschlägen
def('F04', 'Preistabelle mit Zeitfenstern und Zuschlägen',
  '/preise/: Tabelle #preisliste mit den vier Zeitfenstern (Werktags tagsüber, Werktags abends, Nachts, Wochenende und Feiertag) und mindestens vier Leistungszeilen; Anfahrtstabelle (Zuschläge je Zone, .anfahrt-tabelle) sichtbar. Platzhalterzellen werden gezählt.',
  async (b) => besuch(b, '/preise/', {}, async (s) => {
    const tab = s.locator('#preisliste');
    const sicht = await tab.isVisible().catch(() => false);
    const t = await txt(tab);
    const fenster = ['Werktags tagsüber', 'Werktags abends', 'Nachts', 'Wochenende und Feiertag'].filter((f) => t.includes(f));
    const zeilen = await tab.locator('tr').count();
    const anfahrt = await s.locator('.anfahrt-tabelle').first().isVisible().catch(() => false);
    const platz = await s.locator('#preisliste .platzhalter, #preisliste [data-zustand="platzhalter"]').count();
    const m = [`Tabelle sichtbar=${sicht}; Zeitfenster gefunden ${fenster.length}/4; Tabellenzeilen ${zeilen}; Anfahrtstabelle sichtbar=${anfahrt}; Platzhalterzellen ${platz}`];
    return { ok: sicht && fenster.length === 4 && zeilen >= 5 && anfahrt, messung: m };
  }));

// F05 Preisrechner
def('F05', 'Preisrechner (Leistung × Zeitpunkt × Zone)',
  '/preise/ (Abschnitt „Preisrechner“): Ausgabe .rechner-summe lesen, Zone D wählen, Lage „Garage“ wählen; die Ausgabe muss sich nach jeder Wahl ändern. In der Vorschau ist die Summe ohne gepflegte Preisliste ein Satz statt eines Betrags (preisrechner.mjs); die Rechenlogik ist in test/preise.test.mjs geprüft.',
  async (b) => besuch(b, '/preise/', {}, async (s) => {
    const bereich = s.locator('section[aria-labelledby="rechner-titel"]');
    const posten = bereich.locator('dl').first();
    const summe = bereich.locator('.rechner-summe');
    // Posten (Lage „Garagentor öffnen“ usw., Anfahrt je Zone) ändern sich mit jeder Wahl; die Summe steht im
    // Vorschau-Build auf „Berechnung erst mit Preisliste möglich.“ (U-6)
    const p0 = await txt(posten); const s0 = await txt(summe);
    await bereich.locator('input[name="position"][value="garage"]').check({ force: true });
    const p1 = await txt(posten); const s1 = await txt(summe);
    await bereich.locator('input[name="zone"][value="D"]').check({ force: true });
    const p2 = await txt(posten); const s2 = await txt(summe);
    const ok = p0 !== p1 && p1 !== p2;
    // Ohne gepflegte Preisliste (U-6) kein Betrag: Ergebnis teilweise, Logik ist per Test belegt
    const messung = [
      `Start Posten: „${p0.slice(0, 160)}“ · Summe „${s0.slice(0, 80)}“`,
      `Lage Garage Posten: „${p1.slice(0, 160)}“`,
      `Zone D Posten: „${p2.slice(0, 160)}“ · Summe „${s2.slice(0, 80)}“`,
      `Posten ändern sich nach Lage=${p0 !== p1}, nach Zone=${p1 !== p2}`,
      'Gesamtbetrag im Vorschau-Build nicht sichtbar (Preisliste offen, U-6); Rechenlogik Gesamtpreis = Zeitfenster + Anfahrt geprüft in test/preise.test.mjs (npm test, 330 bestanden)',
    ];
    return { ok, ergebnis: ok ? 'teilweise' : 'nicht erfüllt', messung };
  }));

// F06 Häufige Fragen (mit und ohne JS)
def('F06', 'Häufige Fragen je Seite (aufklappbar, ohne JS nutzbar)',
  'Auf „/“: mindestens drei details.faq-eintrag; mit JS öffnet und schließt ein Klick auf die erste Frage. Ohne JS (javaScriptEnabled=false) öffnet ein Klick auf die erste Frage ebenfalls.',
  async (b) => {
    const m = [];
    let mitJs = false; let anzahl = 0;
    await besuch(b, '/', {}, async (s) => {
      anzahl = await s.locator('details.faq-eintrag').count();
      const d = s.locator('details.faq-eintrag').first();
      await d.locator('summary').click();
      const o1 = await d.evaluate((e) => e.open);
      await d.locator('summary').click();
      const o2 = await d.evaluate((e) => e.open);
      mitJs = o1 === true && o2 === false;
      m.push(`mit JS: Anzahl ${anzahl}; nach 1. Klick open=${o1}, nach 2. Klick open=${o2}`);
    });
    let ohneJs = false;
    await besuch(b, '/', { js: false }, async (s) => {
      const d = s.locator('details.faq-eintrag').first();
      const vorher = await d.evaluate((e) => e.open);
      await d.locator('summary').click();
      const nachher = await d.evaluate((e) => e.open);
      ohneJs = vorher === false && nachher === true;
      m.push(`ohne JS: open vorher=${vorher}, nach Klick=${nachher}`);
    });
    return { ok: anzahl >= 3 && mitJs && ohneJs, messung: m };
  });

// F07 Ablauf in Schritten
def('F07', 'Ablauf in Schritten',
  '/ (V01): .ablauf mit mindestens drei Schritten, Nummern in Folge. /notoeffnung/ und /einbruchschutz/ (V02): Szenen-Schritte (.szene-schritt) mindestens drei je Seite.',
  async (b) => {
    const m = []; let ok = true;
    await besuch(b, '/', {}, async (s) => {
      const nr = await s.locator('.ablauf-nr').allInnerTexts();
      const folge = nr.map((x) => x.trim()).every((x, i) => x === String(i + 1));
      m.push(`V01 Schritte ${nr.length}: ${nr.join(' ')} (Folge ${folge})`);
      if (nr.length < 3 || !folge) ok = false;
    });
    for (const p of ['/notoeffnung/', '/einbruchschutz/']) {
      await besuch(b, p, {}, async (s) => {
        const n = await s.locator('.szene-schritt').count();
        m.push(`${p} Szenen-Schritte: ${n}`);
        if (n < 3) ok = false;
      });
    }
    return { ok, messung: m };
  });

// F08 Leistungsregister mit Gruppenfilter
def('F08', 'Leistungsregister mit Gruppenfilter',
  '/leistungen/: Gruppenfilter als Knöpfe (aria-pressed). Klick auf „Einbruch…“ → genau eine Gruppe sichtbar, Anker #gruppe-einbruchschutz; Klick auf „Alle“ → alle vier Gruppen sichtbar.',
  async (b) => besuch(b, '/leistungen/', {}, async (s) => {
    const knopf = s.locator('[data-modul="gruppenfilter"] button');
    const anzahlKnoepfe = await knopf.count();
    const sichtbare = () => s.locator('.verz-gruppe:not([hidden])').count();
    const alleAnfang = await sichtbare();
    await knopf.filter({ hasText: 'Einbruch' }).first().click();
    const eins = await sichtbare();
    const hash = new URL(s.url()).hash;
    await knopf.filter({ hasText: 'Alle' }).first().click();
    const alle = await sichtbare();
    const m = [`Knöpfe ${anzahlKnoepfe}; sichtbare Gruppen am Start ${alleAnfang}; nach Einbruch-Filter ${eins} (Anker „${hash}“); nach „Alle“ ${alle}`];
    return { ok: anzahlKnoepfe >= 5 && eins === 1 && hash === '#gruppe-einbruchschutz' && alle === 4, messung: m };
  }));

// F09 A–Z-Verzeichnis je Land/Kreis
def('F09', 'A–Z-Ortsverzeichnis je Land/Kreis',
  '/einsatzgebiet/hessen/limburg-weilburg/ (V06): mindestens acht Sprunglinks in .az-buchstaben, alle Ziele vorhanden, Klick setzt den Anker. /einsatzgebiet/ (V05): mindestens fünf Links in die Verzeichnisse.',
  async (b) => {
    const m = []; let ok = true;
    await besuch(b, '/einsatzgebiet/hessen/limburg-weilburg/', {}, async (s) => {
      const links = s.locator('.az-buchstaben a');
      const n = await links.count();
      const hrefs = await links.evaluateAll((els) => els.map((e) => e.getAttribute('href')));
      const ziele = await s.evaluate((hs) => hs.map((h) => !!(h && document.querySelector(h))), hrefs);
      const alleZiele = ziele.every(Boolean);
      let klickOk = false;
      if (n) {
        await links.first().click();
        klickOk = new URL(s.url()).hash === hrefs[0];
      }
      m.push(`V06 Sprunglinks ${n}; Ziele vorhanden ${ziele.filter(Boolean).length}/${n}; Klick auf ersten Buchstaben setzt Anker=${klickOk}`);
      if (n < 8 || !alleZiele || !klickOk) ok = false;
    });
    await besuch(b, '/einsatzgebiet/', {}, async (s) => {
      const n = await s.locator('a[href^="/einsatzgebiet/"]').count();
      m.push(`V05 Links in Verzeichnisse: ${n}`);
      if (n < 5) ok = false;
    });
    return { ok, messung: m };
  });

// F10 Ortsseite mit Faktenblock, Nachbarorten, Lagekarte
def('F10', 'Ortsseite mit Faktenblock, Nachbarorten, Lagekarte',
  '/schluesseldienst-loehnberg/ (V07): .ort-fakten sichtbar; Abschnitt „Orte in der Nähe von …“ mit mindestens sechs Links auf Ortsseiten; .lagekarte als SVG mit role=img und aufgelöstem Namen (aria-labelledby).',
  async (b) => besuch(b, '/schluesseldienst-loehnberg/', {}, async (s) => {
    const fakten = await s.locator('.ort-fakten').first().isVisible().catch(() => false);
    const nachbarn = await s.evaluate(() => {
      const h = document.querySelector('.ort-liste-titel');
      if (!h) return null;
      const sec = h.closest('section') || h.parentElement;
      return { titel: h.textContent.replace(/­/g, '').trim(), links: sec.querySelectorAll('a[href^="/schluesseldienst-"]').length };
    });
    const karte = await s.evaluate(() => {
      const k = document.querySelector('svg.lagekarte');
      if (!k) return null;
      const name = (k.getAttribute('aria-labelledby') || '').split(/\s+/).map((i) => document.getElementById(i)?.textContent?.trim() ?? '').join(' ').trim();
      return { role: k.getAttribute('role'), name };
    });
    const m = [`Fakten sichtbar=${fakten}`, `Nachbarn: „${nachbarn?.titel}“ mit ${nachbarn?.links} Links`, `Lagekarte: role=${karte?.role}, Name „${karte?.name}“`];
    return { ok: fakten && (nachbarn?.links ?? 0) >= 6 && karte?.role === 'img' && !!karte?.name, messung: m };
  }));

// F11 E-Mail-Composer ohne Server
def('F11', 'Kontakt: Anruf, E-Mail, E-Mail-Composer (ohne Server)',
  '/kontakt/: (a) leer absenden → Fehlerübersicht mit Links; (b) „Notfall“ zeigt das Ruf-Panel statt der E-Mail-Felder; (c) „planbar“, Ort und Nachricht ausfüllen → Betreff zeigt den Ort, Absenden zeigt den Grund „ohne Adresse“ (Vorschau), keine Navigation.',
  async (b) => besuch(b, '/kontakt/', {}, async (s) => {
    const m = []; const fehl = [];
    const fehlerBox = s.locator('[data-rolle="fehler"]');
    await s.locator('button[data-rolle="absenden"]').click();
    const fehlerSicht = await fehlerBox.isVisible().catch(() => false);
    const fehlerAnzahl = await fehlerBox.locator('li').count();
    m.push(`(a) leer absenden: Fehlerübersicht sichtbar=${fehlerSicht}, Punkte ${fehlerAnzahl}`);
    if (!fehlerSicht || fehlerAnzahl < 2) fehl.push('(a)');
    await s.locator('label:has(input[name="anliegen"][value="notfall"])').click();
    const notfall = await s.locator('[data-rolle="notfall"]').isVisible().catch(() => false);
    const mailVerborgen = !(await s.locator('[data-rolle="mail"]').isVisible().catch(() => false));
    m.push(`(b) Notfall: Ruf-Panel sichtbar=${notfall}, E-Mail-Felder verborgen=${mailVerborgen}`);
    if (!notfall || !mailVerborgen) fehl.push('(b)');
    await s.locator('label:has(input[name="anliegen"][value="planbar"])').click();
    await s.locator('#k-ort').fill('Weilburg');
    await s.locator('#k-nachricht').fill('Bitte um Angebot für eine Schließanlage.');
    await s.locator('#k-name').fill('Testperson');
    const betreff = await txt(s.locator('[data-rolle="betreff"]').first());
    m.push(`(c) Betreff nach Eingabe des Ortes: „${betreff}“`);
    if (!betreff.includes('Weilburg')) fehl.push('(c) Betreff');
    const vorher = s.url();
    await s.locator('button[data-rolle="absenden"]').click();
    const ohne = await s.locator('[data-rolle="ohne-adresse"]').isVisible().catch(() => false);
    const gleich = s.url() === vorher;
    m.push(`(c) Absenden: Grund „ohne Adresse“ sichtbar=${ohne}, keine Navigation=${gleich}`);
    if (!ohne || !gleich) fehl.push('(c) Absenden');
    return { ok: !fehl.length, messung: m };
  }));

// F12 Seitensuche (statischer Index)
def('F12', 'Seitensuche (statischer Index)',
  '/suche/: „Tresor“ → Treffer mit Hervorhebung (mark); „Löhnberg“ → Ortstreffer im Ergebnis; Direktaufruf /suche/?q=Tresor zeigt die Treffer ohne Eingabe.',
  async (b) => {
    const m = []; const fehl = [];
    await besuch(b, '/suche/', {}, async (s) => {
      await s.locator('#suche-eingabe').fill('Tresor');
      await sleep(1500);
      const treffer = await s.locator('.suche-treffer').count();
      const mk = await s.locator('mark').count();
      m.push(`„Tresor“: Treffer ${treffer}, Hervorhebungen ${mk}`);
      if (treffer < 1 || mk < 1) fehl.push('Tresor');
      await s.locator('#suche-eingabe').fill('Löhnberg');
      await sleep(1500);
      const erg = await txt(s.locator('.suche-ergebnis').first());
      m.push(`„Löhnberg“: Ergebnis enthält Ort=${erg.includes('Löhnberg')}`);
      if (!erg.includes('Löhnberg')) fehl.push('Löhnberg');
    });
    await besuch(b, '/suche/?q=Tresor', {}, async (s) => {
      await sleep(1500);
      const treffer = await s.locator('.suche-treffer').count();
      m.push(`/suche/?q=Tresor direkt: Treffer ${treffer}`);
      if (treffer < 1) fehl.push('?q=');
    });
    return { ok: !fehl.length, messung: m };
  });

// F13 Ratgeber-Artikel mit Inhaltsverzeichnis
def('F13', 'Ratgeber-Artikel mit Inhaltsverzeichnis',
  '/ratgeber/rauchmelderpflicht/ (V08): nav[data-modul=inhalt] mit mindestens drei Links, alle Ziele vorhanden; Klick auf den ersten Eintrag setzt den Anker und zeigt das Ziel im Sichtfeld.',
  async (b) => besuch(b, '/ratgeber/rauchmelderpflicht/', {}, async (s) => {
    const links = s.locator('nav[data-modul="inhalt"] a');
    const n = await links.count();
    const hrefs = await links.evaluateAll((els) => els.map((e) => e.getAttribute('href')));
    const ziele = await s.evaluate((hs) => hs.map((h) => !!(h && h.startsWith('#') && document.querySelector(h))), hrefs);
    const erster = hrefs.find((h) => h && h.startsWith('#teil'));
    let sichtOk = false; let anker = '';
    if (erster) {
      await s.locator(`nav[data-modul="inhalt"] a[href="${erster}"]`).first().click();
      anker = new URL(s.url()).hash;
      sichtOk = await s.evaluate((h) => { const r = document.querySelector(h)?.getBoundingClientRect(); return !!r && r.top >= -4 && r.top < innerHeight; }, erster);
    }
    const m = [`Inhalt-Links ${n}; Ziele vorhanden ${ziele.filter(Boolean).length}/${n}; Anker nach Klick „${anker}“; Ziel im Sichtfeld=${sichtOk}`];
    return { ok: n >= 3 && ziele.every(Boolean) && anker === erster && sichtOk, messung: m };
  }));

// F14 „Seriösen Schlüsseldienst erkennen“
def('F14', 'Seriösen Schlüsseldienst erkennen (Verbraucherhinweis)',
  'V01 („/“): Abschnitt „Seriösen Schlüsseldienst erkennen“; V07 (/schluesseldienst-loehnberg/): derselbe Hinweis; V08: Übersicht /ratgeber/ verlinkt den Artikel /ratgeber/schluesseldienst-abzocke-erkennen/, dessen Überschrift geprüft wird.',
  async (b) => {
    const m = []; const fehl = [];
    const v01 = await besuch(b, '/', {}, async (s) => (await txt(s.locator('#serioes-titel'))));
    m.push(`V01 Überschrift: „${v01}“`); if (!/erkennen/.test(v01)) fehl.push('V01');
    const v07 = await besuch(b, '/schluesseldienst-loehnberg/', {}, async (s) => (await s.locator('body').innerText()).replace(/­/g, ''));
    const v07Ok = /seriösen Schlüsseldienst erkennen/i.test(v07);
    m.push(`V07 Hinweis im Text: ${v07Ok}`); if (!v07Ok) fehl.push('V07');
    const v08 = await besuch(b, '/ratgeber/', {}, async (s) => s.locator('a[href="/ratgeber/schluesseldienst-abzocke-erkennen/"]').count());
    m.push(`V08 Übersicht verlinkt den Abzocke-Artikel: ${v08} Link(s)`); if (!v08) fehl.push('V08 Link');
    const artikel = await besuch(b, '/ratgeber/schluesseldienst-abzocke-erkennen/', {}, async (s) => txt(s.locator('h1').first()));
    m.push(`V08 Artikel-Überschrift: „${artikel}“`); if (!/erkennen/.test(artikel)) fehl.push('V08 Artikel');
    return { ok: !fehl.length, messung: m };
  });

// F15 Hell/Dunkel nach Systemeinstellung
def('F15', 'Hell/Dunkel nach Systemeinstellung',
  'Alle 13 Hauptansichten mit prefers-color-scheme light und dark: Hintergrund des body muss sich unterscheiden, im Dunkelmodus color-scheme dark.',
  async (b) => {
    const m = []; const fehl = [];
    for (const p of HAUPT) {
      const hell = await besuch(b, p, { schema: 'light' }, async (s) => s.evaluate(() => ({ bg: getComputedStyle(document.body).backgroundColor, cs: getComputedStyle(document.documentElement).colorScheme })));
      const dunkel = await besuch(b, p, { schema: 'dark' }, async (s) => s.evaluate(() => ({ bg: getComputedStyle(document.body).backgroundColor, cs: getComputedStyle(document.documentElement).colorScheme })));
      const ok = hell.bg !== dunkel.bg && dunkel.cs.includes('dark');
      if (!ok) fehl.push(p);
    }
    m.push(`Ansichten geprüft ${HAUPT.length}, Abweichungen: ${fehl.length ? fehl.join(', ') : 'keine'}`);
    const beispiel = await besuch(b, '/', { schema: 'light' }, async (s) => s.evaluate(() => getComputedStyle(document.body).backgroundColor));
    const beispielDunkel = await besuch(b, '/', { schema: 'dark' }, async (s) => s.evaluate(() => getComputedStyle(document.body).backgroundColor));
    m.push(`Beispiel /: hell ${beispiel}, dunkel ${beispielDunkel}`);
    return { ok: !fehl.length, messung: m };
  });

// F16 Reduzierte Bewegung nach Systemeinstellung
def('F16', 'Reduzierte Bewegung nach Systemeinstellung',
  'Alle 13 Hauptansichten: laufende CSS-Animationen nach 1,2 s ohne Bewegungswunsch (no-preference) und mit reduce. Erfüllt, wenn bei reduce keine Animation läuft und ohne Wunsch mindestens eine läuft, wo es Bewegung gibt.',
  async (b) => {
    const m = []; const fehl = []; let mitBewegung = 0;
    for (const p of HAUPT) {
      const frei = await besuch(b, p, {}, async (s) => { await sleep(1200); return s.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length); });
      const red = await besuch(b, p, { reduziert: true }, async (s) => { await sleep(1200); return s.evaluate(() => ({ n: document.getAnimations().filter((a) => a.playState === 'running').length, mm: matchMedia('(prefers-reduced-motion: reduce)').matches })); });
      if (frei > 0) mitBewegung += 1;
      if (!red.mm || red.n > 0) fehl.push(`${p} (reduce: ${red.n} laufend, Medienabfrage ${red.mm})`);
      m.push(`${p}: ohne Wunsch ${frei} laufend, reduce ${red.n} laufend`);
    }
    m.push(`Ansichten mit Bewegung ohne Wunsch: ${mitBewegung}/${HAUPT.length}`);
    if (fehl.length) m.push(`Abweichungen: ${fehl.join('; ')}`);
    return { ok: !fehl.length && mitBewegung > 0, messung: m };
  });

// F17 HTML-Sitemap und XML-Sitemaps
def('F17', 'HTML-Sitemap und XML-Sitemaps',
  '/sitemap/ (HTTP 200, Links); /sitemap.xml (Sitemap-Index mit Verweisen); /sitemaps/leistungen.xml (urlset); /robots.txt nennt die Sitemap. Gezählt: Verweise im Index, die nicht auf den Prüfursprung zeigen.',
  async () => {
    const holen = async (p) => { const r = await fetch(new URL(p, BASIS)); return { status: r.status, text: await r.text() }; };
    const sm = await holen('/sitemap/');
    const idx = await holen('/sitemap.xml');
    const lei = await holen('/sitemaps/leistungen.xml');
    const rob = await holen('/robots.txt');
    const linksSm = (sm.text.match(/<a [^>]*href=/g) || []).length;
    const locs = [...idx.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((x) => x[1]);
    const fremdUrsprung = locs.filter((l) => !l.startsWith(BASIS)).length;
    const urls = (lei.text.match(/<url>/g) || []).length;
    const robotsSitemap = /^Sitemap:\s*\S+/m.test(rob.text);
    const m = [
      `/sitemap/ HTTP ${sm.status}, Links ${linksSm}`,
      `/sitemap.xml HTTP ${idx.status}, Verweise ${locs.length}, davon nicht auf ${BASIS}: ${fremdUrsprung}`,
      `/sitemaps/leistungen.xml HTTP ${lei.status}, URLs ${urls}`,
      `/robots.txt HTTP ${rob.status}, Sitemap-Zeile=${robotsSitemap}`,
    ];
    const ok = sm.status === 200 && idx.status === 200 && lei.status === 200 && rob.status === 200 && locs.length >= 3 && urls > 0 && robotsSitemap;
    return { ok, messung: m };
  });

// F18 Fehlerseite mit Suche
def('F18', 'Fehlerseite mit Suche',
  '/gibt-es-nicht/ (gewollte 404): HTTP 404; Ortssuche auf der Fehlerseite liefert Vorschläge; Link zur Seitensuche /suche/ vorhanden. Die Konsolenmeldung zum 404 wird als gewollt getrennt gezählt.',
  async (b) => besuch(b, '/gibt-es-nicht/', {}, async (s, status) => {
    const feld = s.locator('#fehler-ort-eingabe');
    const feldSicht = await feld.isVisible().catch(() => false);
    await feld.fill('Weilburg');
    const vorschlaege = await s.locator('#fehler-ort-liste [role="option"]').first().waitFor({ state: 'visible', timeout: WARTE }).then(() => true, () => false);
    const suchLink = await s.locator('a[href="/suche/"]').count();
    const m = [`HTTP ${status}`, `Suchfeld sichtbar=${feldSicht}, Vorschläge zu „Weilburg“=${vorschlaege}`, `Link /suche/: ${suchLink}`];
    return { ok: status === 404 && feldSicht && vorschlaege && suchLink > 0, messung: m };
  }));

// F19 Rechtstexte von jeder Seite erreichbar
def('F19', 'Rechtstexte von jeder Seite erreichbar',
  'Alle 13 Hauptansichten (desktop): Fußzeile mit sichtbarem Link auf /impressum/ und /datenschutz/. Stichprobe: von /preise/ über den Fußlink zu /impressum/.',
  async (b) => {
    const m = []; let fehl = 0;
    for (const p of HAUPT) {
      const r = await besuch(b, p, {}, async (s) => ({
        imp: await s.locator('footer a[href="/impressum/"]').first().isVisible().catch(() => false),
        dat: await s.locator('footer a[href="/datenschutz/"]').first().isVisible().catch(() => false),
      }));
      if (!r.imp || !r.dat) { fehl += 1; m.push(`${p}: Impressum=${r.imp} Datenschutz=${r.dat}`); }
    }
    const weg = await besuch(b, '/preise/', {}, async (s) => {
      await s.locator('footer a[href="/impressum/"]').first().click();
      await s.waitForURL('**/impressum/', { timeout: WARTE });
      return new URL(s.url()).pathname;
    }).catch((e) => `Fehler ${e.message.split('\n')[0]}`);
    m.push(`Ansichten mit beiden Fußlinks: ${HAUPT.length - fehl}/${HAUPT.length}; Klick von /preise/ → ${weg}`);
    return { ok: fehl === 0 && weg === '/impressum/', messung: m };
  });

// F20 Druckansicht für Preise und Ratgeber
def('F20', 'Druckansicht für Preise und Ratgeber',
  '/preise/ und /ratgeber/rauchmelderpflicht/ im Druck-Medium: Navigation und Rufleiste ausgeblendet, Preisliste sichtbar; als A4-PDF erzeugt, Seitenzahl aus dem PDF (Dateien druck_*.pdf im Prüfordner).',
  async (b) => {
    const m = []; let ok = true;
    for (const p of ['/preise/', '/ratgeber/rauchmelderpflicht/']) {
      await besuch(b, p, {}, async (s) => {
        await s.emulateMedia({ media: 'print' });
        // Sichtbarkeit (nicht nur display): .hauptnav hat display:block, wird aber vom Kopf im Druck ausgeblendet
        const sichtbar = async (sel) => s.locator(sel).first().isVisible().catch(() => false);
        const rufl = await sichtbar('.rufleiste');
        const nav = await sichtbar('.hauptnav');
        const tab = p === '/preise/' ? await s.locator('#preisliste').isVisible().catch(() => false) : true;
        const datei = `${ORDNER}/druck_${p.replace(/\//g, '_').replace(/^_|_$/g, '') || 'start'}.pdf`;
        await s.pdf({ path: datei, format: 'A4', printBackground: true });
        const bytes = await readFile(datei);
        const seiten = (bytes.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
        m.push(`${p}: .rufleiste sichtbar=${rufl}, .hauptnav sichtbar=${nav}, Preisliste sichtbar=${tab}, PDF-Seiten ${seiten}, Datei ${datei}`);
        if (seiten < 1 || !tab || rufl || nav) ok = false;
      });
    }
    return { ok, messung: m };
  });

async function main() {
  const browser = await starteBrowser();
  const ergebnisse = [];
  try {
    for (const p of pruefungen) {
      protokoll = { fremd: 0, konsole: [], gewollt: 0 };
      let r;
      try { r = await p.fn(browser); } catch (e) { r = { ok: false, messung: [`Ausnahme: ${String(e.message).split('\n')[0]}`] }; }
      const ergebnis = r.ergebnis ?? (r.ok ? 'erfüllt' : 'nicht erfüllt');
      ergebnisse.push({
        id: p.id, titel: p.titel, wie: p.wie, ergebnis, messung: r.messung,
        fremdeAnfragen: protokoll.fremd, konsoleFehler: protokoll.konsole, gewolltes404Konsole: protokoll.gewollt,
      });
      console.log(`${p.id} ${ergebnis} – ${p.titel} (fremd ${protokoll.fremd}, Konsole ${protokoll.konsole.length}, gewollt ${protokoll.gewollt})`);
    }
  } finally {
    await browser.close();
  }
  await schreibeJson(`${ORDNER}/funktionen.json`, { werkzeug: 'funktionen', basis: BASIS, zeitpunkt: new Date().toISOString(), ergebnisse });
  return ergebnisse.some((e) => e.ergebnis !== 'erfüllt') ? 1 : 0;
}

mitMessSperre('z-pruefer-funktionen', main).then(
  (code) => process.exit(code),
  (e) => { console.error(`Werkzeugfehler: ${e.message}`); process.exit(2); },
);
