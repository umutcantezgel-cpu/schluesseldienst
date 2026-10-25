// Tests für die Prüfer Ehrlichkeit, Fakten und Emoji mit Fixture-Seiten aus test/fixtures/ehrlichkeit/.
// Der Kontext wird pro Test mit einer Minimal-Konfiguration gebaut.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pruefe as pruefeEhrlichkeit, textfelder } from '../bau/pruefen/ehrlichkeit.mjs';
import { pruefe as pruefeFakten } from '../bau/pruefen/fakten.mjs';
import { pruefe as pruefeEmoji } from '../bau/pruefen/emoji.mjs';
import { platzhalter } from '../bau/lib/platzhalter.mjs';

const FIXTUREN = join(dirname(fileURLToPath(import.meta.url)), 'fixtures/ehrlichkeit');

async function fixture(datei, pfad = '/') {
  return { pfad, datei, html: await readFile(join(FIXTUREN, datei), 'utf8'), typ: 'test', indexierbar: true };
}

// Im echten Projekt sind Preise Platzhalter, solange die Preisliste nicht final ist.
const PLATZHALTER_PREISE = { werktag: platzhalter('preise.werktag', 'Preis werktags') };

function ctx(seiten, { betrieb = {}, preise = PLATZHALTER_PREISE, marken = {}, modus = 'vorschau' } = {}) {
  return {
    wurzel: '',
    modus,
    seiten,
    konfig: {
      betrieb: { anfahrtText: null, erreichbarkeit: { rundUmDieUhr: false }, qualifikationen: [], ...betrieb },
      preise,
      marken: { freigegeben: [], ...marken },
    },
  };
}

const regel = (befunde, id) => befunde.filter((b) => b.regel === id);
const meldungen = (befunde, id) => regel(befunde, id).map((b) => b.meldung);
const ehrlich = (c) => pruefeEhrlichkeit(c);

// ---------- Gesamtbild ----------

test('gut.html und negativ.html erzeugen in keinem Prüfer einen Befund', async () => {
  for (const datei of ['gut.html', 'negativ.html']) {
    const c = ctx([await fixture(datei)]);
    const befunde = [...await ehrlich(c), ...await pruefeFakten(c), ...await pruefeEmoji(c)];
    assert.deepEqual(befunde, [], datei);
  }
});

test('Seite ohne <main> crasht nicht und prüft nur Kopfdaten', async () => {
  const seite = { pfad: '/', datei: 'x.html', html: '<title>24/7 Notdienst</title><p>24/7</p>', typ: 'test' };
  const befunde = await ehrlich(ctx([seite]));
  assert.equal(befunde.length, 1);
  assert.equal(befunde[0].regel, 'ehrlichkeit/rund-um-die-uhr');
  assert.match(befunde[0].meldung, /, title:/);
  assert.deepEqual(await pruefeFakten(ctx([seite])), []);
});

// ---------- ehrlichkeit/* ----------

test('ehrlichkeit/minuten: Minutenangaben sind fehler, außer anfahrtText ist gesetzt', async () => {
  const seiten = [await fixture('minuten.html')];
  const treffer = regel(await ehrlich(ctx(seiten)), 'ehrlichkeit/minuten');
  assert.equal(treffer.length, 2);
  assert.ok(treffer.every((b) => b.schwere === 'fehler'));
  assert.ok(treffer.some((b) => b.meldung.includes('„10 bis 20 min“')));

  const gesetzt = await ehrlich(ctx(seiten, { betrieb: { anfahrtText: 'Anfahrt ab Weilburg' } }));
  assert.equal(regel(gesetzt, 'ehrlichkeit/minuten').length, 0);

  const platzhalterText = await ehrlich(ctx(seiten, { betrieb: { anfahrtText: platzhalter('betrieb.anfahrt', 'Anfahrt') } }));
  assert.equal(regel(platzhalterText, 'ehrlichkeit/minuten').length, 2, 'Platzhalter gilt nicht als gesetzt');
});

test('ehrlichkeit/rund-um-die-uhr: 24/7, 24 h, rund um die Uhr, 365 Tage sind fehler', async () => {
  const seiten = [await fixture('rund-um-die-uhr.html')];
  const treffer = regel(await ehrlich(ctx(seiten)), 'ehrlichkeit/rund-um-die-uhr');
  assert.equal(treffer.length, 4);
  for (const t of ['„24/7“', '„rund um die Uhr“', '„24 h“', '„365 Tage“']) {
    assert.ok(treffer.some((b) => b.meldung.includes(t)), t);
  }
  const erlaubt = await ehrlich(ctx(seiten, { betrieb: { erreichbarkeit: { rundUmDieUhr: true } } }));
  assert.equal(regel(erlaubt, 'ehrlichkeit/rund-um-die-uhr').length, 0);
});

test('ehrlichkeit/festpreis: Festpreis ist fehler, solange die Preisliste Platzhalter enthält', async () => {
  const seiten = [await fixture('festpreis.html')];
  assert.equal(regel(await ehrlich(ctx(seiten)), 'ehrlichkeit/festpreis').length, 2);
  const final = await ehrlich(ctx(seiten, { preise: { waehrung: 'EUR' } }));
  assert.equal(regel(final, 'ehrlichkeit/festpreis').length, 0);
});

test('ehrlichkeit/superlativ: Nr. 1, bester, günstigste, billigste, schnellste, Marktführer sind fehler', async () => {
  const treffer = meldungen(await ehrlich(ctx([await fixture('superlativ.html')])), 'ehrlichkeit/superlativ');
  assert.equal(treffer.length, 6);
  for (const t of ['„Nr. 1“', '„beste Schlüsseldienst“', '„Günstigste“', '„billigste“', '„schnellste“', '„Marktführer“']) {
    assert.ok(treffer.some((m) => m.includes(t)), t);
  }
});

test('ehrlichkeit/garantie: Garantie-Begriffe und 100 % sind fehler; „schadensfrei garantiert“ zählt einmal', async () => {
  const treffer = meldungen(await ehrlich(ctx([await fixture('garantie.html')])), 'ehrlichkeit/garantie');
  // Titel „Garantie“, Meta „Garantie“, im Text: Garantiert, 100 %, Garantie, Garantien, schadensfrei garantiert
  assert.equal(treffer.length, 7);
  assert.equal(treffer.filter((m) => m.includes('schadensfrei garantiert')).length, 1);
  assert.ok(treffer.some((m) => m.includes('„100 %“')));
});

test('ehrlichkeit/alter-zertifikat: Alter, Qualifikation und Prüfsiegel sind fehler; Qualifikationen befreien', async () => {
  const seiten = [await fixture('alter-zertifikat.html')];
  const treffer = meldungen(await ehrlich(ctx(seiten)), 'ehrlichkeit/alter-zertifikat');
  assert.equal(treffer.length, 9);
  for (const t of ['„Seit 2005“', '„20 Jahre Erfahrung“', '„Meisterbetrieb“', '„TÜV“', '„Polizeilich empfohlen“', '„ADAC“', '„VdS“']) {
    assert.ok(treffer.some((m) => m.includes(t)), t);
  }
  const belegt = meldungen(await ehrlich(ctx(seiten, { betrieb: { qualifikationen: ['Seit 2005 am Markt'] } })), 'ehrlichkeit/alter-zertifikat');
  assert.equal(belegt.length, 8);
  assert.ok(!belegt.some((m) => m.includes('„Seit 2005“')));
});

test('ehrlichkeit/bewertung: Sterne, Zahlen-Bewertungen, Kundenstimmen und Google-Bewertung sind fehler', async () => {
  const treffer = meldungen(await ehrlich(ctx([await fixture('bewertung.html')])), 'ehrlichkeit/bewertung');
  assert.equal(treffer.length, 10); // 5 × ★, 4,8/5, Sterne, 120 Bewertungen, Kundenstimmen, Google-Bewertung
  for (const t of ['„4,8/5“', '„Sterne“', '„120 Bewertungen“', '„Kundenstimmen“', '„Google-Bewertung“']) {
    assert.ok(treffer.some((m) => m.includes(t)), t);
  }
});

test('ehrlichkeit/kostenlos: kostenlos, gratis, umsonst sind nur warnungen', async () => {
  const befunde = regel(await ehrlich(ctx([await fixture('kostenlos.html')])), 'ehrlichkeit/kostenlos');
  assert.equal(befunde.length, 3);
  assert.ok(befunde.every((b) => b.schwere === 'warnung'));
});

test('ehrlichkeit/ortspraesenz: Ortsphrasen nur auf Ortsseiten außer Weilburg; Niederlassung und Filiale überall', async () => {
  const ort = await fixture('ortspraesenz-ort.html', '/schluesseldienst-limburg/');
  assert.equal(regel(await ehrlich(ctx([ort])), 'ehrlichkeit/ortspraesenz').length, 5);

  for (const pfad of ['/schluesseldienst-weilburg/', '/schluesseldienst-weilburg-hausen/', '/']) {
    const seite = await fixture('ortspraesenz-ort.html', pfad);
    assert.equal(regel(await ehrlich(ctx([seite])), 'ehrlichkeit/ortspraesenz').length, 0, pfad);
  }

  for (const pfad of ['/', '/schluesseldienst-limburg/', '/schluesseldienst-weilburg-hausen/']) {
    const seite = await fixture('ortspraesenz-allgemein.html', pfad);
    const treffer = regel(await ehrlich(ctx([seite])), 'ehrlichkeit/ortspraesenz');
    assert.equal(treffer.length, 2, pfad);
    assert.ok(treffer.every((b) => b.schwere === 'fehler'));
  }
});

test('ehrlichkeit/dark-pattern: Zeitdruck- und Verknappungsfloskeln sind fehler', async () => {
  // Eine Fundstelle in der Meta-Beschreibung, sieben im Text.
  const treffer = regel(await ehrlich(ctx([await fixture('dark-pattern.html')])), 'ehrlichkeit/dark-pattern');
  assert.equal(treffer.length, 8);
  for (const t of ['„Countdown“', '„Jetzt oder nie“', '„Angebot endet“', '„Begrenzte Anzahl“', '„Schnell sein“', '„Nur noch 3“']) {
    assert.ok(treffer.some((b) => b.meldung.includes(t)), t);
  }
});

test('ehrlichkeit/floskel: Floskeln sind nur warnungen', async () => {
  const befunde = regel(await ehrlich(ctx([await fixture('floskel.html')])), 'ehrlichkeit/floskel');
  assert.equal(befunde.length, 9);
  assert.ok(befunde.every((b) => b.schwere === 'warnung'));
});

test('ehrlichkeit/marke: Markennamen sind fehler, freigegebene Marken nicht; „Dom“ und „Basis“ sind kein Treffer', async () => {
  const seiten = [await fixture('marke.html')];
  const treffer = meldungen(await ehrlich(ctx(seiten)), 'ehrlichkeit/marke');
  assert.equal(treffer.length, 4);
  for (const t of ['„Winkhaus“', '„ABUS“', '„Burg-Wächter“', '„Simons Voss“']) {
    assert.ok(treffer.some((m) => m.includes(t)), t);
  }
  const freigegeben = meldungen(await ehrlich(ctx(seiten, { marken: { freigegeben: ['Winkhaus'] } })), 'ehrlichkeit/marke');
  assert.equal(freigegeben.length, 3);
  assert.ok(!freigegeben.some((m) => m.includes('Winkhaus')));

  const negativ = await ehrlich(ctx([await fixture('negativ.html')]));
  assert.equal(regel(negativ, 'ehrlichkeit/marke').length, 0);
});

test('Textfelder: JSON-LD-Strings ja, application/json und .platzhalter-Inhalt nein', async () => {
  const seite = await fixture('felder.html');
  const felder = textfelder(seite);
  assert.ok(felder.some((f) => f.feld === 'json-ld' && f.text === 'Seit 2005 Meisterbetrieb'));
  assert.ok(felder.some((f) => f.feld === 'og:title' && f.text === 'Yale-Schloss Notöffnung'));
  assert.ok(felder.some((f) => f.feld === 'alt' && f.text === 'Logo mit ★'));
  assert.ok(!felder.some((f) => f.text.includes('Festpreis garantiert')), 'application/json wird nicht geprüft');
  const haupt = felder.find((f) => f.feld === 'main');
  assert.ok(!haupt.text.includes('24/7'), '.platzhalter-Inhalt wird nicht geprüft');
});

test('Felder in Kopf und Attributen werden geprüft (JSON-LD, og, Meta, Titel, alt)', async () => {
  const befunde = await ehrlich(ctx([await fixture('felder.html')]));
  assert.equal(regel(befunde, 'ehrlichkeit/festpreis').length, 1);
  const rund = regel(befunde, 'ehrlichkeit/rund-um-die-uhr');
  assert.equal(rund.length, 1);
  assert.match(rund[0].meldung, /og:description/);
  assert.equal(regel(befunde, 'ehrlichkeit/marke').length, 1);
  assert.match(meldungen(befunde, 'ehrlichkeit/superlativ').join(' '), /title/);
});

// ---------- fakten/* ----------

test('fakten: Zahlen, Normen, Paragrafen und Zeitdauern innerhalb eines Belegs sind in Ordnung', async () => {
  const befunde = await pruefeFakten(ctx([await fixture('fakten-belegt.html')]));
  assert.deepEqual(befunde, []);
});

test('fakten/ohne-beleg: Paragrafen, Normen, Prozente, Jahre, Zeitdauern, Beträge, RC und EN ohne Beleg sind fehler', async () => {
  const befunde = await pruefeFakten(ctx([await fixture('fakten-unbelegt.html')]));
  const treffer = regel(befunde, 'fakten/ohne-beleg');
  assert.equal(treffer.length, 14);
  assert.ok(treffer.every((b) => b.schwere === 'fehler'));
  for (const t of ['„§ 18“', '„DIN 18252“', '„Art. 6“', '„15 %“', '„2019“', '„2005“', '„30 Sekunden“', '„2 Stunden“',
    '„5 Jahre“', '„49,00 €“', '„€ 49“', '„1.234,50 EUR“', '„RC 3“', '„EN 1303“']) {
    assert.ok(treffer.some((b) => b.meldung.includes(t)), t);
  }
});

test('fakten/ohne-beleg: DIN 18252 im Fließtext ohne Beleg ist fehler', async () => {
  const seite = { pfad: '/', datei: 'x.html', html: '<main><p>Nach DIN 18252 geprüft.</p></main>', typ: 'test' };
  const befunde = regel(await pruefeFakten(ctx([seite])), 'fakten/ohne-beleg');
  assert.equal(befunde.length, 1);
  assert.match(befunde[0].meldung, /„DIN 18252“/);
});

test('fakten/verifizieren: Anzahl der ungeprüften Fakten je Seite, im Vorschau-Modus info, im Release-Modus fehler', async () => {
  const seiten = [await fixture('fakten-verifizieren.html')];
  const vorschau = regel(await pruefeFakten(ctx(seiten)), 'fakten/verifizieren');
  assert.equal(vorschau.length, 1);
  assert.equal(vorschau[0].schwere, 'info');
  assert.match(vorschau[0].meldung, /2 ungeprüfte/);
  const release = regel(await pruefeFakten(ctx(seiten, { modus: 'release' })), 'fakten/verifizieren');
  assert.equal(release[0].schwere, 'fehler');
});

// ---------- emoji/* ----------

test('emoji/zeichen: Emoji in alt-Attributen sind fehler', async () => {
  const befunde = regel(await pruefeEmoji(ctx([await fixture('emoji-alt.html')])), 'emoji/zeichen');
  assert.equal(befunde.length, 1);
  assert.match(befunde[0].meldung, /U\+1F511/);
});

test('emoji/zeichen: Symbolzeichen im Text und im Fuß zählen; Ausnahmen gelten nur für Pfeile', async () => {
  const befunde = regel(await pruefeEmoji(ctx([await fixture('emoji-text.html')])), 'emoji/zeichen');
  assert.equal(befunde.length, 4); // ✔ ⚠ ★ im Text, ⏰ im Fuß
  assert.ok(befunde.some((b) => b.meldung.includes('U+23F0')), 'Fuß wird geprüft');
});

test('emoji/zeichen: Pfeile im Textinhalt sind erlaubt', async () => {
  const befunde = await pruefeEmoji(ctx([await fixture('pfeil.html')]));
  assert.deepEqual(befunde, []);
});

test('emoji/zeichen: Pfeile sind in <title> und meta description fehler', async () => {
  const befunde = regel(await pruefeEmoji(ctx([await fixture('pfeil-titel.html')])), 'emoji/zeichen');
  assert.equal(befunde.length, 2);
  assert.ok(befunde.some((b) => b.meldung.includes('title')));
  assert.ok(befunde.some((b) => b.meldung.includes('meta description')));
});
