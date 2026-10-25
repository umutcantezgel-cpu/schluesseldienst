// Tests der Seitensuche (V11): UND-Verknüpfung, Wertung (Titel vor Text), Umlaute eingeebnet, Mindestlänge,
// Hervorhebung, Statuszeile und Kurztexte des Seitenindex.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { seitenIndex, seitenSuchen, hervorheben, statusText } from '../src/assets/js/logik/suche.mjs';
import { kurztext, seitenIndexSchreiben } from '../bau/lib/datenindex.mjs';

const INDEX = seitenIndex({ v: 1, s: [
  ['Türöffnung in Weilburg', '/notoeffnung/tueroeffnung/', 'Leistung', 'Zugefallene oder abgeschlossene Türen öffnen.'],
  ['Schließzylinder wechseln', '/ratgeber/schliesszylinder-wechseln/', 'Ratgeber', 'Wann ein Tausch nötig ist und wie Sie messen.'],
  ['Preise', '/preise/', 'Preise', 'Gesamtpreise für Türöffnung nach Zeitfenster und Zone.'],
  ['Tresor kaufen', '/ratgeber/tresor-kaufen-widerstandsgrade/', 'Ratgeber', 'Grad, Schloss und Ort.'],
  ['Elektronische Schließanlage: Wann sich der Umstieg lohnt', '/ratgeber/elektronische-schliessanlage/', 'Ratgeber', 'Verlust, Batterie, Notweg.'],
] });

test('Treffer im Titel stehen vor Treffern im Text', () => {
  assert.deepEqual(seitenSuchen(INDEX, 'türöffnung').map((e) => e.pfad), ['/notoeffnung/tueroeffnung/', '/preise/']);
});

test('Umlaute und ß: „tur“, „tuer“ und „Tür“ finden dasselbe; „schliess“ findet „Schließ…“', () => {
  for (const q of ['tur', 'tuer', 'Tür']) assert.equal(seitenSuchen(INDEX, q)[0].pfad, '/notoeffnung/tueroeffnung/', q);
  assert.equal(seitenSuchen(INDEX, 'schliess')[0].pfad, '/ratgeber/schliesszylinder-wechseln/');
});

test('alle Wörter müssen vorkommen; kurze Anfragen und Fremdwörter liefern nichts', () => {
  assert.deepEqual(seitenSuchen(INDEX, 'tresor ratgeber').map((e) => e.pfad), ['/ratgeber/tresor-kaufen-widerstandsgrade/']);
  assert.deepEqual(seitenSuchen(INDEX, 'tresor preise'), []);
  assert.deepEqual(seitenSuchen(INDEX, 't'), []);
  assert.deepEqual(seitenSuchen(INDEX, 'xyzq'), []);
});

test('mit Umlaut getippt wird streng verglichen: „löhn“ trifft nicht „lohnt“, „lohn“ ohne Umlaut schon', () => {
  assert.deepEqual(seitenSuchen(INDEX, 'löhn'), []);
  assert.deepEqual(seitenSuchen(INDEX, 'lohn').map((e) => e.pfad), ['/ratgeber/elektronische-schliessanlage/']);
  assert.equal(seitenSuchen(INDEX, 'Türöff')[0].pfad, '/notoeffnung/tueroeffnung/');
});

test('Hervorhebung: ganze Wörter, Umlaute wie bei der Wertung, Satzzeichen bleiben außerhalb', () => {
  assert.deepEqual(hervorheben('Türöffnung in Weilburg: Tür, Fenster', 'tur'), [
    { text: 'Türöffnung', treffer: true }, { text: ' in Weilburg: ', treffer: false }, { text: 'Tür', treffer: true }, { text: ', Fenster', treffer: false },
  ]);
  assert.deepEqual(hervorheben('Löhnberg · Limburg-Weilburg', 'löhn'), [{ text: 'Löhnberg', treffer: true }, { text: ' · Limburg-Weilburg', treffer: false }]);
  assert.deepEqual(hervorheben('Umstieg lohnt', 'löhn'), [{ text: 'Umstieg lohnt', treffer: false }]);
  assert.deepEqual(hervorheben('35781 · Limburg-Weilburg', '35781')[0], { text: '35781', treffer: true });
  assert.deepEqual(hervorheben('Text', 'x'), [{ text: 'Text', treffer: false }]);
});

test('Statuszeile: keine Nullmengen, Einzahl und Mehrzahl, gekürzte Listen als „n von m“', () => {
  assert.equal(statusText({ seiten: 0, orte: 1 }), '1 Ort');
  assert.equal(statusText({ seiten: 1, orte: 0 }), '1 Seite');
  assert.equal(statusText({ seiten: 3, orte: 2 }), '3 Seiten · 2 Orte');
  assert.equal(statusText({ seiten: 20, seitenGesamt: 34, orte: 8, orteGesamt: 23 }), '20 von 34 Seiten · 8 von 23 Orten');
  assert.equal(statusText({}), '');
});

test('Kurztext im Seitenindex: nie mitten im Wort; ganzer Satz ohne, Satzteil oder Wort mit Auslassungspunkten', () => {
  assert.equal(kurztext('Kurz und gut.'), 'Kurz und gut.');
  const satz = 'Tresor einbauen lassen aus Weilburg: Möbeltresor, Wertschrank, Sicherheitstür und -fenster. Entscheidend sind fachgerechter Einbau und Verankerung.';
  assert.equal(kurztext(satz), 'Tresor einbauen lassen aus Weilburg: Möbeltresor, Wertschrank, Sicherheitstür und -fenster.');
  const teil = 'Einbruchschutz für Mietwohnung und Eigentumswohnung: Wohnungstür, Fenster im Erdgeschoss, Abwesenheit nicht zeigen und Absprachen mit der Verwaltung.';
  assert.equal(kurztext(teil), 'Einbruchschutz für Mietwohnung und Eigentumswohnung: Wohnungstür, Fenster im Erdgeschoss\u00A0…');
  const wort = `${'Wort '.repeat(40)}Ende`;
  const k = kurztext(wort);
  assert.ok(k.length <= 142 && k.endsWith('Wort\u00A0…'), k);
  // Abkürzungen gelten nicht als Satzende
  assert.doesNotMatch(kurztext(`Hier steht z. B. Tresor ${'und noch mehr Text '.repeat(8)}`), /z\.$/);
});

test('Seitenindex: eintrag() liefert Titel, Bereich und Kurztext wie die Datei (Hauptthemen der Suchseite)', async () => {
  const geschrieben = [];
  const schreiber = { schreibe: async (pfad, buf) => { geschrieben.push([pfad, buf]); } };
  const lang = `Tür zugefallen oder abgeschlossen? ${'Wir öffnen Wohnungs- und Haustüren in Weilburg und Umgebung. '.repeat(3)}`;
  const index = await seitenIndexSchreiben([
    { pfad: '/notoeffnung/tueroeffnung/', titel: 'Türöffnung in Weilburg', ansicht: 'V03', beschreibung: lang },
    { pfad: '/preise/', titel: 'Preise', ansicht: 'V04', beschreibung: 'Gesamtpreise ab Weilburg.' },
    { pfad: '/schluesseldienst-loehnberg/', titel: 'Löhnberg', ansicht: 'V07', beschreibung: 'Ortsseite.' },
    { pfad: '/suche/', titel: 'Suche', ansicht: 'V11', indexierbar: false, beschreibung: 'Suche.' },
  ], schreiber);
  const datei = JSON.parse(geschrieben[0][1]);
  assert.deepEqual(index.eintrag('/notoeffnung/tueroeffnung/'), { titel: 'Türöffnung in Weilburg', pfad: '/notoeffnung/tueroeffnung/', bereich: 'Leistungen', text: datei.s[0][3] });
  assert.equal(index.eintrag('/preise/').bereich, 'Preise');
  assert.ok(index.eintrag('/notoeffnung/tueroeffnung/').text.length <= 142);
  // Ortsseiten und nicht indexierte Seiten stehen nicht im Index – die Vorlage bricht dann den Bau ab
  assert.equal(index.eintrag('/schluesseldienst-loehnberg/'), null);
  assert.equal(index.eintrag('/suche/'), null);
});
