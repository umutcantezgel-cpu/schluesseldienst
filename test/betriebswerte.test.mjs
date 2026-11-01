// Betriebswerte (D-DATEN-01): Regeln je Schlüssel, Prüfen, Einsetzen und Ausgabe des Schnappschusses
// src/daten/betriebswerte.json. Ziel: Aus Supabase kommt nur Gültiges in den Bau, die Konfiguration bleibt unberührt,
// und Code, Schnappschuss und Datenbank (startwerte.sql, datenbank.sql) laufen nicht auseinander.
import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import betrieb from '../src/konfig/betrieb.mjs';
import preise from '../src/konfig/preise.mjs';
import zonen from '../src/konfig/zonen.mjs';
import {
  regelFuer, schluesselAusKonfig, betriebswerteLaden, betriebswertePruefen, betriebswerteAnwenden, serialisieren,
  anzeige, startwerteSql, nummerZiffern, gleicherWert, BetriebswerteFehler, TYPEN, KONTAKT, STANDARD_DATEI, QUELLE,
} from '../bau/lib/betriebswerte.mjs';
import { istPlatzhalter, platzhalterIn } from '../bau/lib/platzhalter.mjs';
import { attrUrl } from '../bau/lib/html.mjs';
import { zeitenAusText, zustandBerechnen } from '../src/assets/js/logik/erreichbarkeit.mjs';
import { zeitenAlsText } from '../src/vorlagen/teile/rufknopf.mjs';
import { scramVerifier, alterRole, passwortPruefen } from '../pipeline/betriebswerte/scram-verifier.mjs';

const WURZEL = fileURLToPath(new URL('..', import.meta.url));
const lies = (p) => readFileSync(join(WURZEL, p), 'utf8');
const konfig = { betrieb, preise, zonen };
const daten = { plz: JSON.parse(lies('src/daten/plz.json')) };
const voll = JSON.parse(lies('test/fixtures/betriebswerte/voll.json')).werte;
const pruefen = (werte) => betriebswertePruefen(werte, { konfig, daten });
const mit = (aenderung) => ({ ...voll, ...aenderung });
const ZEITEN = ['preise.zeit-abend', 'preise.zeit-nacht', 'preise.zeit-werktag', 'preise.zeit-wochenende'];

describe('Regeln', () => {
  test('jeder Platzhalter von betrieb, preise und zonen hat eine Regel: 54 aus Supabase, 4 abgeleitet', () => {
    const alle = schluesselAusKonfig(konfig);
    assert.equal(alle.length, 58);
    assert.equal(new Set(alle.map((s) => s.schluessel)).size, 58);
    assert.equal(alle.filter((s) => s.quelle === 'supabase').length, 54);
    assert.deepEqual(alle.filter((s) => s.quelle === 'abgeleitet').map((s) => s.schluessel).sort(), ZEITEN);
    for (const s of alle.filter((x) => x.quelle === 'supabase')) assert.ok(TYPEN.includes(s.typ), s.schluessel);
    for (const k of KONTAKT) assert.ok(regelFuer(k, konfig)?.typ, k);
    assert.equal(regelFuer('preise.tuer-zugefallen.nacht', konfig).titel, 'Tür zugefallen (nicht abgeschlossen) – Nachts');
    assert.equal(regelFuer('betrieb.fax', konfig), null);
  });

  test('voll.json (Testdaten) belegt alle 54 Schlüssel und ist bis auf die Test-Domain ohne Befund', () => {
    const supabase = schluesselAusKonfig(konfig).filter((s) => s.quelle === 'supabase').map((s) => s.schluessel).sort();
    assert.deepEqual(Object.keys(voll).sort(), supabase);
    const { fehler, warnungen } = pruefen(voll);
    assert.deepEqual(fehler, []);
    assert.deepEqual(warnungen, ['betrieb.basis-url: https://schluesseldienst.example ist eine Test-Adresse – für den Release die echte Domain eintragen']);
  });

  test('Typen der Datenbank (datenbank.sql) und des Validators stimmen überein', () => {
    const sql = lies('pipeline/betriebswerte/datenbank.sql');
    const liste = sql.match(/typ text not null check \(typ in \(([^)]*)\)\)/)[1];
    assert.deepEqual([...liste.matchAll(/'([a-z0-9_]+)'/g)].map((m) => m[1]), TYPEN);
    assert.doesNotMatch(sql, /\bpassword\s+'/i, 'datenbank.sql setzt nie ein Passwort');
  });

  test('SCRAM-Verifier für sd_export wie von Postgres (bekannte Antwort aus PostgreSQL 16)', () => {
    const salz = Buffer.from('eHsHpqqwtRZBaGYjhK7Nag==', 'base64');
    assert.equal(scramVerifier('Pruef-Passwort-0123456789-Abc', { salz }),
      'SCRAM-SHA-256$4096:eHsHpqqwtRZBaGYjhK7Nag==$h9SykpEPlkS7gn6VL+Uqvyk4KfJrGJVNBp5rnNeP0zs=:RVF5KaNNYovVqICy0wzGKtyfm8Zy9qKiH1sCnFB1mTs=');
    assert.notEqual(scramVerifier('Pruef-Passwort-0123456789-Abc'), scramVerifier('Pruef-Passwort-0123456789-Abc'), 'Salz zufällig');
    assert.equal(alterRole('sd_export', 'V'), "alter role sd_export password 'V';");
    assert.throws(() => alterRole('sd_export; drop role x', 'V'), /Rollenname/);
    assert.equal(passwortPruefen('Pruef-Passwort-0123456789-Abc'), null);
    assert.equal(passwortPruefen('kurz-0123'), 'Mindestens 24 Zeichen.');
    assert.match(passwortPruefen('mit Leerzeichen-0123456789-abc'), /ASCII/);
  });

  test('startwerte.sql entspricht der Konfiguration (neu erzeugen mit „npm run betriebswerte -- --startwerte“)', () => {
    const sql = startwerteSql(konfig);
    assert.equal(lies('pipeline/betriebswerte/startwerte.sql'), sql);
    assert.equal(sql.match(/^ {2}\('/gm).length, 54);
    assert.doesNotMatch(sql, /preise\.zeit-/);
  });
});

describe('Prüfen je Typ', () => {
  const UNGUELTIG = [
    ['betrieb.name', ' Beispiel', /Leerraum/],
    ['betrieb.name', 'B', /2–80 Zeichen, gefunden 1/],
    ['betrieb.name', 'Beispiel ⭐', /Emoji oder Symbolzeichen/],
    ['betrieb.name', 'Beispiel → Weilburg', /Emoji oder Symbolzeichen/],
    ['betrieb.name', 'Beispiel [GmbH]', /\[ \] < >/],
    ['betrieb.name', 'Beispiel\nZwei', /Zeilenumbruch/],
    ['betrieb.name', 'Bei​spiel', /unsichtbare Zeichen/],
    ['betrieb.name', 'Müller', /NFC/],
    ['betrieb.name', 'siehe https://example.org', /„:\/\/“/],
    ['betrieb.name', 42, /erwartet Text/],
    ['betrieb.strasse', 'Musterstraße', /Hausnummer fehlt/],
    ['betrieb.plz', 35781, /fünf Ziffern/],
    ['betrieb.plz', '3578', /fünf Ziffern/],
    ['betrieb.telefon', '06471 abc', /erlaubt sind Ziffern/],
    ['betrieb.telefon', '6471 999999', /beginnt mit 0 oder \+49/],
    ['betrieb.telefon', '0647', /6–15 Ziffern, gefunden 4/],
    ['betrieb.telefon', '06471 2024 99', /Jahreszahl/],
    ['betrieb.telefon', '06471  999999', /doppelten oder äußeren Leerraum/],
    ['betrieb.telefon-e164', '+49 6471 999999', /ohne Leerzeichen/],
    ['betrieb.telefon-e164', '+4906471999999', /ohne Leerzeichen/],
    ['betrieb.telefon-e164', '+499001234567', /Mehrwertdienst/],
    ['betrieb.email', 'info@', /E-Mail-Adresse/],
    ['betrieb.basis-url', 'https://Example.org', /Kleinbuchstaben/],
    ['betrieb.basis-url', 'https://example.org/', /ohne Schrägstrich/],
    ['betrieb.basis-url', 'http://example.org', /https:\/\//],
    ['impressum.ust-id', 'DE12345678', /USt-IdNr/],
    ['preise.ust-modus', 'Regel', /„regel“ oder „klein“/],
    ['preise.zahlarten', 'Bar, Karte (+2 %)', /keine Beträge/],
    ['preise.zahlarten', 'Bar, Karte mit Aufschlag', /§ 270a BGB/],
    ['zonen.a.leistungen', 'ja', /true oder false/],
    ['preise.tuer-zugefallen.werktag', 999, /erwartet 10,00 €–3\.000,00 €, gefunden 9,99 €/],
    ['preise.tuer-zugefallen.werktag', 300100, /gefunden 3\.001,00 €/],
    ['preise.tuer-zugefallen.werktag', 129.9, /ganze Zahl/],
    ['preise.tuer-zugefallen.werktag', '12990', /ganze Zahl/],
    ['preise.anfahrt-b', 50, /erwartet 0,00 € oder 1,00 €–500,00 €/],
    ['betrieb.zeiten', Object.fromEntries(Object.entries(voll['betrieb.zeiten']).filter(([t]) => t !== 'so')), /Tag „so“ fehlt/],
    ['betrieb.zeiten', { ...voll['betrieb.zeiten'], xx: [] }, /unbekannter Tag „xx“/],
    ['betrieb.zeiten', { ...voll['betrieb.zeiten'], mo: [['18:00', '08:00']] }, /endet nicht nach dem Beginn/],
    ['betrieb.zeiten', { ...voll['betrieb.zeiten'], mo: [['08:00', '12:00'], ['12:00', '18:00']] }, /berührt den vorigen Zeitraum/],
    ['betrieb.zeiten', { ...voll['betrieb.zeiten'], mo: [['06:00', '07:00'], ['08:00', '09:00'], ['10:00', '11:00'], ['12:00', '13:00']] }, /höchstens drei/],
    ['betrieb.zeiten', { ...voll['betrieb.zeiten'], mo: [['24:00', '24:00']] }, /erwartet HH:MM/],
    ['betrieb.zeiten', { ...voll['betrieb.zeiten'], mo: [['8:00', '18:00']] }, /erwartet HH:MM/],
    ['betrieb.zeiten', [], /erwartet ein Objekt/],
    ['preise.tagesband', { werktags: [['werktag', '00:00', '24:00']], wochenende: [['wochenende', '00:00', '24:00']] }, /„abend“ kommt im Tagesband nicht vor/],
    ['preise.tagesband', { werktags: [['nacht', '00:00', '07:00'], ['werktag', '08:00', '24:00']], wochenende: [['wochenende', '00:00', '24:00']] }, /Lücke oder Überschneidung/],
    ['preise.tagesband', { werktags: [['mittag', '00:00', '24:00']], wochenende: [['wochenende', '00:00', '24:00']] }, /unbekanntes Fenster mittag/],
    ['preise.tagesband', { werktags: [['nacht', '00:00']], wochenende: [] }, /kein \[Fenster/],
    ['preise.tagesband', { werktags: [['nacht', '00:00', '25:00']], wochenende: [['wochenende', '00:00', '24:00']] }, /erwartet HH:MM, Ende bis 24:00/],
    ['preise.tagesband', { werktags: [], wochenende: [], feiertag: [] }, /unbekannte Tagesart „feiertag“/],
  ];
  for (const [schluessel, wert, muster] of UNGUELTIG) {
    test(`${schluessel} = ${JSON.stringify(wert)?.slice(0, 60)} ist ungültig`, () => {
      const { fehler } = pruefen(mit({ [schluessel]: wert }));
      assert.ok(fehler.length && fehler.every((f) => f.startsWith(`${schluessel}: `)), fehler.join('\n'));
      assert.ok(fehler.some((f) => muster.test(f)), fehler.join('\n'));
    });
  }

  const GUELTIG = [
    ['betrieb.telefon', '+49 6471 999999'],
    ['betrieb.telefon', '06471 / 99 99 99'],
    ['betrieb.telefon', '06471 999-999'],
    ['impressum.ust-id', 'DE999999999-00001'],
    ['impressum.ust-id', null],
    ['impressum.register', null],
    ['impressum.register', 'HRB 2017, Amtsgericht Limburg'],
    ['preise.anfahrt-b', 0],
    ['preise.tuer-zugefallen.werktag', 1000],
    ['preise.tuer-zugefallen.werktag', 300000],
    ['preise.tuer-zugefallen.werktag', null],
    ['preise.ust-modus', 'klein'],
    ['betrieb.basis-url', 'https://www.schluesseldienst-muster.de'],
    ['betrieb.zeiten', { ...voll['betrieb.zeiten'], so: [['00:00', '24:00']] }],
  ];
  for (const [schluessel, wert] of GUELTIG) {
    test(`${schluessel} = ${JSON.stringify(wert)} ist gültig`, () => {
      assert.deepEqual(pruefen(mit({ [schluessel]: wert })).fehler, []);
    });
  }
});

describe('Prüfen über mehrere Schlüssel', () => {
  test('Anzeige und +49-Form müssen dieselbe Nummer nennen', () => {
    assert.deepEqual(pruefen(mit({ 'betrieb.telefon-e164': '+496471999998' })).fehler,
      ['betrieb.telefon / betrieb.telefon-e164: Anzeige und +49-Form nennen verschiedene Nummern']);
    assert.equal(nummerZiffern('06471 999999'), '496471999999');
    assert.equal(nummerZiffern('+49 6471 999999'), '496471999999');
    assert.equal(nummerZiffern('06471 / 99 99 99'), nummerZiffern('+496471999999'));
  });

  test('PLZ muss laut plz.json zu Weilburg gehören; ohne plz.json nur ein Hinweis', () => {
    assert.deepEqual(pruefen(mit({ 'betrieb.plz': '35789' })).fehler, ['betrieb.plz: 35789 gehört laut src/daten/plz.json nicht zu Weilburg']);
    const ohne = betriebswertePruefen(voll, { konfig });
    assert.deepEqual(ohne.fehler, []);
    assert.ok(ohne.warnungen.some((w) => w.startsWith('betrieb.plz: src/daten/plz.json fehlt')));
  });

  test('0180-Nummer ist erlaubt, aber ein Hinweis', () => {
    const r = pruefen(mit({ 'betrieb.telefon': '0180 5999999', 'betrieb.telefon-e164': '+491805999999' }));
    assert.deepEqual(r.fehler, []);
    assert.ok(r.warnungen.some((w) => w.startsWith('betrieb.telefon-e164: 0180-Nummer')));
  });

  test('Hinweise: Anfahrt, Nachtdienst und Kartenzahlung passen nicht zu den Texten oder zueinander', () => {
    const hinweise = (aenderung) => pruefen(mit(aenderung)).warnungen;
    assert.ok(hinweise({ 'preise.anfahrt-b': null }).some((w) => w.startsWith('preise.anfahrt-b: „nach Absprache“')));
    assert.ok(hinweise({ 'preise.anfahrt-c': 3000 }).some((w) => w.startsWith('preise.anfahrt-c: fester Betrag')));
    assert.ok(hinweise({ 'betrieb.nachtdienst': false }).some((w) => w.startsWith('betrieb.nachtdienst: kein Nachtdienst')));
    const ohneNachtpreise = Object.fromEntries(Object.keys(voll).filter((k) => k.endsWith('.nacht')).map((k) => [k, null]));
    assert.ok(!hinweise({ 'betrieb.nachtdienst': false, ...ohneNachtpreise }).some((w) => w.startsWith('betrieb.nachtdienst')));
    assert.ok(hinweise({ 'preise.zahlarten': 'Bar' }).some((w) => w.startsWith('zusagen.kartenzahlung: Zusage Kartenzahlung')));
    assert.ok(hinweise({ 'zusagen.kartenzahlung': false }).some((w) => w.startsWith('zusagen.kartenzahlung: keine Zusage')));
  });

  test('unbekannte und abgeleitete Schlüssel sind Fehler, ebenso Werte für schon feste Angaben', () => {
    assert.deepEqual(pruefen({ 'betrieb.fax': '06471 1234' }).fehler, ['betrieb.fax: unbekannter Schlüssel (nicht in der Konfiguration)']);
    assert.deepEqual(pruefen({ 'preise.zeit-nacht': 'immer' }).fehler, ['preise.zeit-nacht: wird aus preise.tagesband abgeleitet und gehört nicht in die Betriebswerte']);
    const fest = { ...konfig, betrieb: { ...betrieb, name: 'Schon Fest GmbH' } };
    assert.deepEqual(betriebswertePruefen({ 'betrieb.name': 'Beispiel GmbH' }, { konfig: fest, daten }).fehler,
      ['betrieb.name: steht in der Konfiguration bereits fest (kein Platzhalter mehr) – einen der beiden Werte entfernen']);
    assert.deepEqual(pruefen([]).fehler, ['werte ist kein Objekt']);
  });

  test('Geheimnis-Muster werden abgewiesen, ohne den Wert zu wiederholen', () => {
    const geheim = ['AKIA', 'Q'.repeat(16)].join('');
    const { fehler } = pruefen(mit({ 'impressum.vsbg': `Schlüssel ${geheim}` }));
    assert.deepEqual(fehler, ['impressum.vsbg: enthält ein Geheimnis-Muster (aws-schluessel) – Wert nicht übernommen']);
    assert.ok(!fehler.join('\n').includes(geheim));
    const verschachtelt = pruefen(mit({ 'betrieb.zeiten': { ...voll['betrieb.zeiten'], so: [['google-site-verification', '10:00']] } }));
    assert.deepEqual(verschachtelt.fehler, ['betrieb.zeiten: enthält ein Geheimnis-Muster (site-verification) – Wert nicht übernommen']);
  });
});

describe('Schnappschuss laden', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'betriebswerte-'));
  after(() => rmSync(tmp, { recursive: true, force: true }));
  const datei = (name, text) => { writeFileSync(join(tmp, name), text); return name; };

  test('fehlende Datei: nichts bestätigt', async () => {
    assert.deepEqual(await betriebswerteLaden(tmp, 'fehlt.json'), { vorhanden: false, datei: 'fehlt.json', werte: {} });
  });

  test('ein BOM am Anfang stört nicht', async () => {
    const r = await betriebswerteLaden(tmp, datei('bom.json', `﻿${serialisieren({ 'betrieb.nachtdienst': true })}`));
    assert.deepEqual(r, { vorhanden: true, datei: 'bom.json', werte: { 'betrieb.nachtdienst': true } });
  });

  for (const [name, text, muster] of [
    ['kaputt.json', '{"format":1,', /kein gültiges JSON/],
    ['format2.json', '{"format":2,"quelle":"x","werte":{}}', /format 2 – dieser Bau versteht format 1/],
    ['feld.json', '{"format":1,"quelle":"x","werte":{},"stand":"2026-10-30"}', /unbekanntes Feld „stand“/],
    ['liste.json', '{"format":1,"quelle":"x","werte":[]}', /werte fehlt oder ist kein Objekt/],
    ['null.json', 'null', /erwartet ein Objekt/],
  ]) {
    test(`Aufbaufehler (${name}) wirft BetriebswerteFehler`, async () => {
      await assert.rejects(betriebswerteLaden(tmp, datei(name, text)), (e) => e instanceof BetriebswerteFehler && muster.test(e.message));
    });
  }

  test('der committete Schnappschuss ist gültig und kanonisch', async () => {
    const { vorhanden, werte } = await betriebswerteLaden(WURZEL);
    assert.equal(vorhanden, true);
    assert.deepEqual(pruefen(werte).fehler, []);
    const text = lies(STANDARD_DATEI);
    assert.equal(text, serialisieren(werte));
    assert.equal(JSON.parse(text).quelle, QUELLE);
  });
});

describe('Werte einsetzen', () => {
  test('nur in eine Kopie; die Module der Konfiguration und die übrigen Platzhalter bleiben unberührt', () => {
    const { konfig: neu, uebernommen, abgeleitet } = betriebswerteAnwenden(konfig, { 'betrieb.telefon': '06471 999999', 'betrieb.telefon-e164': '+496471999999' });
    assert.equal(neu.betrieb.telefon.anzeige, '06471 999999');
    assert.ok(istPlatzhalter(betrieb.telefon.anzeige), 'Modul src/konfig/betrieb.mjs verändert');
    assert.equal(neu.betrieb.email, betrieb.email, 'Platzhalter bleibt dieselbe Instanz (Markierung in der Vorschau)');
    assert.notEqual(neu.zonen, zonen);
    assert.equal(neu.zonen.stufen.at(-1).bisKm, Infinity);
    assert.deepEqual(uebernommen, ['betrieb.telefon', 'betrieb.telefon-e164']);
    assert.deepEqual(abgeleitet, []);
    assert.ok(istPlatzhalter(neu.preise.zeitfenster[0].zeit), 'ohne Tagesband keine Uhrzeiten');
  });

  test('alle Werte: kein Platzhalter mehr in betrieb, preise und zonen; Uhrzeiten aus dem Tagesband', () => {
    const { konfig: neu, uebernommen, abgeleitet } = betriebswerteAnwenden(konfig, voll);
    assert.deepEqual(platzhalterIn({ betrieb: neu.betrieb, preise: neu.preise, zonen: neu.zonen }), []);
    assert.equal(uebernommen.length, 54);
    assert.deepEqual(abgeleitet, ZEITEN);
    assert.deepEqual(Object.fromEntries(neu.preise.zeitfenster.map((z) => [z.id, z.zeit])), {
      werktag: 'Mo–Fr 07:00–18:00', abend: 'Mo–Fr 18:00–22:00', nacht: 'Mo–Fr 22:00–07:00', wochenende: 'Sa, So, Feiertag ganztags',
    });
    assert.equal(neu.preise.positionen.find((p) => p.id === 'tuer-zugefallen').preise.werktag, 9900);
    assert.equal(neu.preise.anfahrt.C, null);
    assert.equal(neu.zonen.stufen[0].leistungenBestaetigt, true);
    assert.equal(neu.betrieb.impressum.ustId, 'DE999999999');
    assert.equal(neu.betrieb.adresse.ort, 'Weilburg');
  });

  test('der Tel-Link aus den Werten besteht attrUrl und die Prüfregel S18', () => {
    const { konfig: neu } = betriebswerteAnwenden(konfig, voll);
    const tel = `tel:${neu.betrieb.telefon.e164}`;
    assert.equal(attrUrl(tel), tel);
    assert.match(tel, /^tel:\+49\d{6,13}$/);
  });
});

describe('Ausgabe', () => {
  test('serialisieren: unabhängig von der Reihenfolge, Schlüssel sortiert, LF am Ende', () => {
    const umgedreht = (w) => (w && typeof w === 'object' && !Array.isArray(w) ? Object.fromEntries(Object.entries(w).reverse().map(([k, v]) => [k, umgedreht(v)])) : w);
    const text = serialisieren(voll);
    assert.equal(serialisieren(umgedreht(voll)), text);
    assert.equal(text, lies('test/fixtures/betriebswerte/voll.json'));
    assert.ok(text.endsWith('}\n') && !text.includes('\r'));
  });

  test('gleicherWert: die Reihenfolge der Schlüssel zählt nicht, die der Listen schon', () => {
    assert.ok(gleicherWert({ mo: [['08:00', '18:00']], di: [] }, { di: [], mo: [['08:00', '18:00']] }));
    assert.ok(!gleicherWert({ mo: [['08:00', '12:00'], ['13:00', '18:00']] }, { mo: [['13:00', '18:00'], ['08:00', '12:00']] }));
    assert.ok(!gleicherWert(null, undefined));
    assert.ok(gleicherWert(undefined, undefined));
  });

  test('anzeige: lesbare Werte für den Pull Request', () => {
    assert.equal(anzeige('preise.tuer-zugefallen.werktag', 12990, konfig), '129,90 €');
    assert.equal(anzeige('preise.anfahrt-c', null, konfig), 'nach Absprache');
    assert.equal(anzeige('impressum.register', null, konfig), 'entfällt');
    assert.equal(anzeige('betrieb.nachtdienst', true, konfig), 'ja');
    assert.equal(anzeige('betrieb.name', undefined, konfig), '—');
    assert.equal(anzeige('betrieb.zeiten', voll['betrieb.zeiten'], konfig),
      'Mo 07:00–12:30, 13:30–19:00; Di 07:00–12:30, 13:30–19:00; Mi 07:00–12:30, 13:30–19:00; Do 07:00–12:30, 13:30–19:00; Fr 07:00–12:30, 13:30–19:00; Sa 08:00–12:00, 13:00–16:00; So nicht erreichbar');
    assert.equal(anzeige('preise.tagesband', voll['preise.tagesband'], konfig),
      'werktags: nacht 00:00–07:00, werktag 07:00–18:00, abend 18:00–22:00, nacht 22:00–24:00; wochenende: wochenende 00:00–24:00');
  });
});

describe('Erreichbarkeit: kompakte Form für data-zeiten', () => {
  const zeiten = voll['betrieb.zeiten'];

  test('Hin- und Rückweg ergeben dieselben Zeiten', () => {
    const text = zeitenAlsText(zeiten);
    assert.equal(text, `${'07:00-12:30,13:30-19:00|'.repeat(5)}08:00-12:00,13:00-16:00|`);
    assert.deepEqual(zeitenAusText(text), zeiten);
    assert.deepEqual(zeitenAusText('||||||'), { mo: [], di: [], mi: [], do: [], fr: [], sa: [], so: [] });
  });

  test('falsche Form ergibt null', () => {
    for (const t of ['', '08:00-18:00', '|||||', '8:00-18:00||||||', '08:00–18:00||||||', '08:00-18:00,||||||', '{"mo":[]}']) {
      assert.equal(zeitenAusText(t), null, t);
    }
  });

  // Zeitumstellung 2026: 29. März (MEZ → MESZ) und 25. Oktober (MESZ → MEZ). Gerechnet wird in Europe/Berlin.
  const zustand = (iso, nacht = false) => zustandBerechnen(zeitenAusText(zeitenAlsText(zeiten)), nacht, new Date(iso)).zustand;
  test('Zustand in Ortszeit Berlin, auch über die Zeitumstellung', () => {
    assert.equal(zustand('2026-03-23T06:15:00Z'), 'erreichbar', 'Mo 07:15 MEZ');
    assert.equal(zustand('2026-03-30T05:15:00Z'), 'erreichbar', 'Mo 07:15 MESZ');
    assert.equal(zustand('2026-03-30T04:45:00Z'), 'ausserhalb', 'Mo 06:45 MESZ');
    assert.equal(zustand('2026-03-30T04:45:00Z', true), 'nacht', 'Mo 06:45 MESZ mit Nachtdienst');
    assert.equal(zustand('2026-03-30T10:45:00Z'), 'ausserhalb', 'Mo 12:45 MESZ (Mittagspause)');
    assert.equal(zustand('2026-03-29T10:00:00Z'), 'ausserhalb', 'So 12:00 MESZ');
    assert.equal(zustand('2026-10-23T16:59:00Z'), 'erreichbar', 'Fr 18:59 MESZ');
    assert.equal(zustand('2026-10-23T17:00:00Z'), 'ausserhalb', 'Fr 19:00 MESZ');
    assert.equal(zustand('2026-10-26T06:15:00Z'), 'erreichbar', 'Mo 07:15 MEZ');
  });
});
