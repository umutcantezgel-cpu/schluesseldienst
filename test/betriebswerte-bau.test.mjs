// Betriebswerte im Bau (D-DATEN-01): Ein Schnappschuss ersetzt nur bestätigte Platzhalter, ein ungültiger bricht vor
// dem Schreiben ab, der Release liest nur die committete Datei, und ein leerer Schnappschuss ändert nichts an der
// Ausgabe. Echte Angaben auf den Rechtsseiten stehen als Daten der Firma (data-daten), Platzhalter nicht.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, existsSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { seiten } from '../src/vorlagen/seiten/recht.mjs';
import { betriebswerteAnwenden } from '../bau/lib/betriebswerte.mjs';
import { pruefe as pruefeFakten } from '../bau/pruefen/fakten.mjs';
import betrieb from '../src/konfig/betrieb.mjs';
import preise from '../src/konfig/preise.mjs';
import zonen from '../src/konfig/zonen.mjs';
import quellen from '../src/konfig/quellen.mjs';

const WURZEL = fileURLToPath(new URL('..', import.meta.url));
const BAUEN = join(WURZEL, 'bau/bauen.mjs');
const FIXTURES = 'test/fixtures/betriebswerte';

function bauen(t, extra) {
  const tmp = mkdtempSync(join(tmpdir(), 'betriebswerte-bau-'));
  t.after(() => rmSync(tmp, { recursive: true, force: true }));
  const aus = join(tmp, 'aus');
  const r = spawnSync(process.execPath, [BAUEN, `--aus=${aus}`, '--still', ...extra], { cwd: WURZEL, encoding: 'utf8', timeout: 120000 });
  const lies = (p) => (existsSync(join(aus, p)) ? readFileSync(join(aus, p), 'utf8') : null);
  return { ...r, aus, angelegt: existsSync(aus), lies };
}

// Alle Dateien eines Ausgabeordners als { pfad: Inhalt }
function inhalt(ordner) {
  const dateien = {};
  for (const e of readdirSync(ordner, { recursive: true, withFileTypes: true })) {
    if (e.isFile()) dateien[relative(ordner, join(e.parentPath, e.name))] = readFileSync(join(e.parentPath, e.name));
  }
  return dateien;
}

test('Teil-Schnappschuss: bestätigte Werte erscheinen, alles andere bleibt Platzhalter', (t) => {
  const r = bauen(t, ['--nur=/kontakt/', `--werte=${FIXTURES}/teil.json`]);
  assert.equal(r.status, 0, r.stderr);
  const html = r.lies('kontakt/index.html');
  assert.match(html, /href="tel:\+496471999999"/);
  assert.match(html, /href="mailto:info@example\.org/);
  assert.match(html, /data-nacht="true"/);
  assert.match(html, /data-platzhalter="betrieb\.zeiten"/);
  assert.match(html, /data-platzhalter="betrieb\.name"/);
  assert.doesNotMatch(html, /data-platzhalter="betrieb\.(telefon|email)/);
  assert.doesNotMatch(html, /tel:⟦|⟦P:betrieb\.telefon/);
});

test('ungültiger Schnappschuss bricht vor dem Schreiben ab und nennt jeden Befund ohne Stacktrace', (t) => {
  const r = bauen(t, ['--nur=/kontakt/', `--werte=${FIXTURES}/ungueltig.json`]);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /^Betriebswerte ungültig – test\/fixtures\/betriebswerte\/ungueltig\.json \(Bau abgebrochen\):/);
  assert.match(r.stderr, /• betrieb\.fax: unbekannter Schlüssel/);
  assert.match(r.stderr, /• betrieb\.telefon: .*Jahreszahl/);
  assert.match(r.stderr, /• preise\.tuer-zugefallen\.werktag: erwartet 10,00 €–3\.000,00 €/);
  assert.match(r.stderr, /Tabelle betrieb\.werte/);
  assert.doesNotMatch(r.stderr, /\n\s+at /);
  assert.equal(r.angelegt, false);
});

test('Release mit --werte wird abgewiesen (der Release liest nur die committete Datei)', (t) => {
  const r = bauen(t, ['--release', '--ziel=apache', '--datum=2026-10-30', `--werte=${FIXTURES}/voll.json`]);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /--werte gibt es nur für Vorschau und Messbau/);
  assert.equal(r.angelegt, false);
});

test('leerer Schnappschuss und --werte=keine ergeben dieselbe Ausgabe', (t) => {
  const leer = bauen(t, ['--nur=/impressum/', `--werte=${FIXTURES}/leer.json`]);
  const keine = bauen(t, ['--nur=/impressum/', '--werte=keine']);
  assert.equal(leer.status, 0, leer.stderr);
  assert.equal(keine.status, 0, keine.stderr);
  const a = inhalt(leer.aus);
  const b = inhalt(keine.aus);
  assert.ok(Object.hasOwn(a, join('impressum', 'index.html')));
  assert.deepEqual(Object.keys(a).sort(), Object.keys(b).sort());
  for (const pfad of Object.keys(a)) assert.ok(a[pfad].equals(b[pfad]), pfad);
});

// Rechtsseiten direkt gerendert: „HRB 2017“ wäre ohne data-daten eine Jahreszahl ohne Beleg (Prüfer fakten).
const BASIS = 'http://127.0.0.1:4173';
function impressum(werte) {
  const { konfig } = betriebswerteAnwenden({ betrieb, preise, zonen }, werte);
  const sk = { basisUrl: BASIS, konfig: { betrieb: konfig.betrieb, quellen }, icon: () => '' };
  return `<main>${seiten({ basisUrl: BASIS }).find((s) => s.pfad === '/impressum/').inhalt(sk)}</main>`;
}
const fakten = async (html) => (await pruefeFakten({
  wurzel: '', modus: 'vorschau', seiten: [{ pfad: '/impressum/', datei: 'impressum/index.html', html, typ: 'test' }],
  konfig: { betrieb: { erreichbarkeit: { rundUmDieUhr: false }, qualifikationen: [] }, preise: {}, marken: { freigegeben: [] } },
})).filter((b) => b.regel === 'fakten/ohne-beleg');

test('Rechtsseiten: echte Angaben als data-daten, damit fakten „HRB 2017“ nicht als Jahreszahl wertet', async () => {
  const html = impressum({ 'impressum.register': 'HRB 2017, Amtsgericht Limburg', 'betrieb.name': 'Beispiel GmbH' });
  assert.match(html, /<dd data-daten="">HRB 2017, Amtsgericht Limburg<\/dd>/);
  assert.match(html, /<dd data-daten="">Beispiel GmbH<\/dd>/);
  assert.deepEqual(await fakten(html), []);
  const ohneAttribut = html.replaceAll(' data-daten=""', '');
  assert.ok((await fakten(ohneAttribut)).some((b) => b.meldung.includes('„2017“')), 'Gegenprobe: ohne data-daten ist 2017 unbelegt');
});

test('Rechtsseiten: Platzhalter bleiben ohne data-daten', () => {
  const html = impressum({});
  assert.doesNotMatch(html, /data-daten/);
  const teil = impressum({ 'betrieb.strasse': 'Musterstraße 12' });
  assert.doesNotMatch(teil, /data-daten/, 'Adresse erst mit Straße und PLZ echt');
});
