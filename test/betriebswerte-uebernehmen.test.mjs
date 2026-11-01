// Übernahme aus Supabase (pipeline/betriebswerte/uebernehmen.mjs, D-DATEN-01): Der Export wird mit denselben Regeln
// wie im Bau geprüft; geschrieben wird nur ein gültiger, geänderter Stand. Bericht und Commit-Text nennen die
// Änderungen, Log und Zusammenfassung nur Zahlen (keine Werte).
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, existsSync, readFileSync, readdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { zeilenZuWerten } from '../pipeline/betriebswerte/uebernehmen.mjs';
import { serialisieren } from '../bau/lib/betriebswerte.mjs';
import betrieb from '../src/konfig/betrieb.mjs';
import preise from '../src/konfig/preise.mjs';
import zonen from '../src/konfig/zonen.mjs';

const WURZEL = fileURLToPath(new URL('..', import.meta.url));
const SKRIPT = join(WURZEL, 'pipeline/betriebswerte/uebernehmen.mjs');
const FIXTURES = join(WURZEL, 'test/fixtures/betriebswerte');
const konfig = { betrieb, preise, zonen };

function ordner(t) {
  const tmp = mkdtempSync(join(tmpdir(), 'betriebswerte-uebernehmen-'));
  t.after(() => rmSync(tmp, { recursive: true, force: true }));
  return tmp;
}

function uebernehmen(tmp, roh, extra = []) {
  const p = (n) => join(tmp, n);
  writeFileSync(p('ausgabe.txt'), '');
  const r = spawnSync(process.execPath, [SKRIPT, '--roh', roh, '--ziel', p('werte.json'), '--bericht', p('bericht.md'), '--commit', p('commit.txt'),
    '--ausgabe', p('ausgabe.txt'), '--zusammenfassung', p('zusammenfassung.md'), ...extra], { cwd: WURZEL, encoding: 'utf8', timeout: 30000 });
  const lies = (n) => (existsSync(p(n)) ? readFileSync(p(n), 'utf8') : null);
  return { ...r, lies };
}

describe('Export übernehmen', () => {
  test('gültiger Export: kanonische Datei, Bericht mit Änderungen und Kontakt-Warnung, Log ohne Werte', (t) => {
    const tmp = ordner(t);
    const r = uebernehmen(tmp, join(FIXTURES, 'roh.json'));
    assert.equal(r.status, 0, r.stderr);
    assert.equal(r.lies('ausgabe.txt'), 'geaendert=ja\n');
    const text = r.lies('werte.json');
    const { werte } = JSON.parse(text);
    assert.equal(text, serialisieren(werte));
    assert.equal(werte['betrieb.inhaber'], 'Erika Müller', 'Text in NFC');
    assert.equal(werte['preise.tuer-zugefallen.werktag'], 12990);
    assert.equal(werte['impressum.register'], null);
    assert.equal(Object.keys(werte).length, 8);

    const bericht = r.lies('bericht.md');
    assert.match(bericht, /Bestätigt: \*\*8 von 54\*\* Werten\. Geändert: \*\*8\*\*\./);
    assert.match(bericht, /\*\*Achtung: Kontakt- oder Adressangaben geändert\*\* \(betrieb\.telefon, betrieb\.telefon-e164\)/);
    assert.match(bericht, /\| `preise\.tuer-zugefallen\.werktag` \| Tür zugefallen \(nicht abgeschlossen\) – Werktags tagsüber \| — \| 129,90 € \| 30\.10\.2026, 08:34 \|/);
    assert.match(bericht, /\| `impressum\.register` \| [^|]+ \| — \| entfällt \|/);
    assert.match(bericht, /<summary>Noch offen \(46\)<\/summary>/);
    assert.match(r.lies('commit.txt'), /^Betriebswerte aus Supabase übernehmen \(8 geändert, 46 offen\)\n\n- betrieb\.inhaber\n/);

    for (const log of [r.stdout, r.stderr, r.lies('zusammenfassung.md')]) {
      for (const wert of ['06471', '999999', 'Müller', '129,90']) assert.ok(!log.includes(wert), `Wert „${wert}“ im Log`);
    }
    assert.match(r.lies('zusammenfassung.md'), /Schnappschuss geändert: 8 Werte\. Offen: 46\./);
    assert.deepEqual(readdirSync(tmp).filter((n) => n.endsWith('.tmp')), [], 'keine Reste vom atomaren Schreiben');
  });

  test('zweiter Lauf mit demselben Export: keine Änderung, Datei unverändert', (t) => {
    const tmp = ordner(t);
    uebernehmen(tmp, join(FIXTURES, 'roh.json'));
    const vorher = readFileSync(join(tmp, 'werte.json'), 'utf8');
    const r = uebernehmen(tmp, join(FIXTURES, 'roh.json'));
    assert.equal(r.status, 0, r.stderr);
    assert.equal(r.lies('ausgabe.txt'), 'geaendert=nein\n');
    assert.equal(r.lies('werte.json'), vorher);
    assert.match(r.stdout, /0 geändert, 46 offen – keine Änderung/);
  });

  test('nur andere Form (gleiche Werte): neu geschrieben, Commit-Text sagt „nur Form“', (t) => {
    const tmp = ordner(t);
    uebernehmen(tmp, join(FIXTURES, 'roh.json'));
    const kanonisch = readFileSync(join(tmp, 'werte.json'), 'utf8');
    writeFileSync(join(tmp, 'werte.json'), JSON.stringify(JSON.parse(kanonisch)));
    const r = uebernehmen(tmp, join(FIXTURES, 'roh.json'));
    assert.equal(r.lies('ausgabe.txt'), 'geaendert=ja\n');
    assert.equal(r.lies('werte.json'), kanonisch);
    assert.match(r.lies('commit.txt'), /\(0 geändert, 46 offen\)\n\n- nur Form \(keine Wertänderung\)\n$/);
  });

  test('leerer Export (keine Zeile bestätigt): leerer Schnappschuss', (t) => {
    const tmp = ordner(t);
    writeFileSync(join(tmp, 'roh.json'), '[]\n');
    const r = uebernehmen(tmp, join(tmp, 'roh.json'));
    assert.equal(r.status, 0, r.stderr);
    assert.deepEqual(JSON.parse(r.lies('werte.json')).werte, {});
  });
});

describe('ungültiger Export: Exit 1, nichts geschrieben', () => {
  const FAELLE = [
    ['Typ passt nicht', null, /betrieb\.telefon: Typ in Supabase „text“, erwartet „telefon_anzeige“/],
    ['unbekannter Schlüssel', [{ schluessel: 'betrieb.fax', typ: 'text', wert: '06471 1234', geaendert_am: null }], /betrieb\.fax: unbekannter Schlüssel in Supabase/],
    ['abgeleiteter Schlüssel', [{ schluessel: 'preise.zeit-nacht', typ: 'text', wert: 'nachts', geaendert_am: null }], /preise\.zeit-nacht: wird aus preise\.tagesband abgeleitet/],
    ['doppelte Zeile', [{ schluessel: 'betrieb.nachtdienst', typ: 'ja_nein', wert: true }, { schluessel: 'betrieb.nachtdienst', typ: 'ja_nein', wert: false }], /betrieb\.nachtdienst: doppelt im Export/],
    ['Wert verletzt die Regeln', [{ schluessel: 'betrieb.telefon', typ: 'telefon_anzeige', wert: '06471 2024 99' }], /betrieb\.telefon: .*Jahreszahl/],
  ];
  for (const [name, zeilen, muster] of FAELLE) {
    test(name, (t) => {
      const tmp = ordner(t);
      const roh = zeilen ? join(tmp, 'roh.json') : join(FIXTURES, 'roh-typfehler.json');
      if (zeilen) writeFileSync(roh, JSON.stringify(zeilen));
      const r = uebernehmen(tmp, roh);
      assert.equal(r.status, 1, r.stderr);
      assert.match(r.stderr, /^Betriebswerte ungültig – nichts geschrieben:/);
      assert.match(r.stderr, muster);
      assert.equal(r.lies('werte.json'), null);
      assert.equal(r.lies('ausgabe.txt'), '');
    });
  }

  test('kein JSON: technischer Fehler, Exit 2', (t) => {
    const tmp = ordner(t);
    writeFileSync(join(tmp, 'roh.json'), 'psql: error: connection failed');
    const r = uebernehmen(tmp, join(tmp, 'roh.json'));
    assert.equal(r.status, 2);
    assert.match(r.stderr, /technischer Fehler – Export nicht lesbar/);
    assert.equal(r.lies('werte.json'), null);
  });
});

test('zeilenZuWerten: Werte je Schlüssel, Texte in NFC, Änderungszeit je Schlüssel', () => {
  const { werte, geaendert } = zeilenZuWerten([
    { schluessel: 'betrieb.inhaber', typ: 'text', wert: 'Erika Müller', geaendert_am: '2026-10-30T07:30:00+00:00' },
    { schluessel: 'betrieb.zeiten', typ: 'zeiten', wert: { mo: [['08:00', '18:00']], so: [] } },
  ], konfig);
  assert.deepEqual(werte, { 'betrieb.inhaber': 'Erika Müller', 'betrieb.zeiten': { mo: [['08:00', '18:00']], so: [] } });
  assert.deepEqual(geaendert, { 'betrieb.inhaber': '2026-10-30T07:30:00+00:00', 'betrieb.zeiten': null });
  assert.throws(() => zeilenZuWerten({}, konfig), /keine JSON-Liste/);
});

test('--liste und --startwerte', (t) => {
  const liste = spawnSync(process.execPath, [SKRIPT, '--liste', '--ziel', join(FIXTURES, 'voll.json')], { cwd: WURZEL, encoding: 'utf8' });
  assert.equal(liste.status, 0, liste.stderr);
  assert.match(liste.stdout, /^übernommen {2}betrieb\.name – Firmenname$/m);
  assert.match(liste.stdout, /^abgeleitet {2}preise\.zeit-werktag – /m);
  assert.match(liste.stdout, /\n54 übernommen, 4 abgeleitet, 0 offen\.\n$/);
  const leer = spawnSync(process.execPath, [SKRIPT, '--liste', '--ziel', join(FIXTURES, 'leer.json')], { cwd: WURZEL, encoding: 'utf8' });
  assert.match(leer.stdout, /\n0 übernommen, 0 abgeleitet, 58 offen\.\n$/);
  const sql = spawnSync(process.execPath, [SKRIPT, '--startwerte'], { cwd: WURZEL, encoding: 'utf8' });
  assert.equal(sql.stdout, readFileSync(join(WURZEL, 'pipeline/betriebswerte/startwerte.sql'), 'utf8'));
  const tmp = ordner(t);
  const ohne = spawnSync(process.execPath, [SKRIPT], { cwd: tmp, encoding: 'utf8' });
  assert.equal(ohne.status, 2);
  assert.match(ohne.stderr, /Aufruf: --roh/);
});
