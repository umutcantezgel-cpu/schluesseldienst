// Tests der Preislogik (V04): Tagesband prüfen, Zeitfenster zu Uhrzeiten, Gesamtpreis mit Anfahrt, „nach Absprache“
// und die Regel „kein Zuschlag je Zahlart“ (weder in der Konfiguration noch im Rechner vorgesehen).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { bandPruefen, fensterBei, jetzt, rechnen, zeitText, tagArt, euro } from '../src/assets/js/logik/preise.mjs';
import preise from '../src/konfig/preise.mjs';

const IDS = ['werktag', 'abend', 'nacht', 'wochenende'];
const BAND = {
  werktags: [['nacht', '00:00', '07:00'], ['werktag', '07:00', '18:00'], ['abend', '18:00', '22:00'], ['nacht', '22:00', '24:00']],
  wochenende: [['wochenende', '00:00', '24:00']],
};
const DATEN = {
  vollstaendig: true,
  positionen: { tuer: { werktag: 9000, abend: 11000, nacht: 15000, wochenende: 13000 }, tresor: { werktag: null, abend: null, nacht: null, wochenende: null } },
  anfahrt: { A: 0, B: 2500, C: 6000, D: null },
  nurAbsprache: { C: ['tuer'], D: ['tuer'] },
};

test('gültiges Tagesband ohne Befund; Lücke, Überschneidung, falsches Ende und unbekanntes Fenster werden gemeldet', () => {
  assert.deepEqual(bandPruefen(BAND, IDS), []);
  const luecke = { ...BAND, werktags: [['nacht', '00:00', '07:00'], ['werktag', '08:00', '24:00']] };
  assert.match(bandPruefen(luecke, IDS).join(), /Lücke/);
  const kurz = { ...BAND, wochenende: [['wochenende', '00:00', '23:00']] };
  assert.match(bandPruefen(kurz, IDS).join(), /24:00/);
  const fremd = { ...BAND, wochenende: [['feiertag', '00:00', '24:00']] };
  assert.match(bandPruefen(fremd, IDS).join(), /unbekanntes Fenster/);
  assert.match(bandPruefen({ werktags: BAND.werktags }, IDS).join(), /wochenende: fehlt/);
});

test('Fenster je Uhrzeit, Tagesart und Zeitpunkt in Europe/Berlin', () => {
  assert.equal(fensterBei(BAND, 'werktags', 6 * 60 + 59), 'nacht');
  assert.equal(fensterBei(BAND, 'werktags', 7 * 60), 'werktag');
  assert.equal(fensterBei(BAND, 'werktags', 21 * 60 + 59), 'abend');
  assert.equal(fensterBei(BAND, 'werktags', 23 * 60), 'nacht');
  assert.equal(tagArt('sa'), 'wochenende');
  assert.equal(tagArt('mo'), 'werktags');
  // Dienstag 19:30 Ortszeit (UTC+1) → abends; Sonntag 10:00 → Wochenende
  assert.deepEqual({ ...jetzt(BAND, new Date('2026-10-27T18:30:00Z')), anteil: undefined }, { art: 'werktags', fenster: 'abend', anteil: undefined });
  assert.equal(jetzt(BAND, new Date('2026-11-01T09:00:00Z')).fenster, 'wochenende');
  // Ohne Tagesband (Uhrzeiten offen): Tagesart und Lage für die Marke, aber kein Fenster
  assert.deepEqual(jetzt(null, new Date('2026-10-27T18:30:00Z')), { art: 'werktags', fenster: null, anteil: (19 * 60 + 30) / (24 * 60) });
});

test('Uhrzeiten als Text, Nacht über Mitternacht zusammengefasst', () => {
  assert.equal(zeitText(BAND, 'nacht'), 'Mo–Fr 22:00–07:00');
  assert.equal(zeitText(BAND, 'werktag'), 'Mo–Fr 07:00–18:00');
  assert.equal(zeitText(BAND, 'wochenende'), 'Sa, So, Feiertag ganztags');
});

test('Gesamtpreis = Leistung im Zeitfenster + Anfahrt der Zone', () => {
  assert.deepEqual(rechnen(DATEN, { position: 'tuer', fenster: 'abend', zone: 'A' }), { status: 'betrag', cent: 11000, preis: 11000, anfahrt: 0 });
  assert.deepEqual(rechnen(DATEN, { position: 'tuer', fenster: 'nacht', zone: 'B' }), { status: 'betrag', cent: 17500, preis: 15000, anfahrt: 2500 });
  assert.equal(euro(17500), '175,00 €');
});

test('nach Absprache: Notöffnung in Zonen ohne Notdienst, Preis oder Anfahrt null; offen ohne vollständige Liste', () => {
  assert.equal(rechnen(DATEN, { position: 'tuer', fenster: 'werktag', zone: 'C' }).status, 'absprache');
  assert.equal(rechnen(DATEN, { position: 'tresor', fenster: 'werktag', zone: 'A' }).status, 'absprache');
  assert.equal(rechnen({ ...DATEN, nurAbsprache: {} }, { position: 'tuer', fenster: 'werktag', zone: 'D' }).status, 'absprache');
  assert.equal(rechnen({ ...DATEN, vollstaendig: false }, { position: 'tuer', fenster: 'werktag', zone: 'A' }).status, 'offen');
  assert.equal(rechnen(DATEN, { position: 'gibt-es-nicht', fenster: 'werktag', zone: 'A' }).status, 'offen');
  assert.equal(rechnen({ ...DATEN, positionen: { tuer: { werktag: 99.5 } } }, { position: 'tuer', fenster: 'werktag', zone: 'A' }).status, 'offen');
});

test('kein Zuschlag je Zahlart: weder Konfiguration noch Rechner kennen ihn', async () => {
  const schluessel = [...Object.keys(preise), ...preise.positionen.flatMap((p) => Object.keys(p)), ...preise.zeitfenster.flatMap((z) => Object.keys(z))];
  for (const k of schluessel) assert.doesNotMatch(k, /zuschlag|aufschlag|gebuehr/i, `Schlüssel ${k}`);
  assert.equal(typeof preise.zahlarten === 'object' && !Array.isArray(preise.zahlarten) && preise.zahlarten !== null && Object.values(preise.zahlarten).some((w) => typeof w === 'number'), false);
  const modul = await readFile(new URL('../src/assets/js/module/preisrechner.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(modul, /zahlart/i);
  const vorlage = await readFile(new URL('../src/vorlagen/seiten/preise.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(vorlage, /name="zahlart"/);
});
