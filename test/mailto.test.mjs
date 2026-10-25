// Tests der mailto-Logik (V10): Kopfzeilen-Einschleusung, Empfängerprüfung, Kodierung, Längengrenze, Pflichtfelder.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mailtoUrl, adresseGueltig, zeile, absatz, pruefen, MAX_LAENGE } from '../src/assets/js/logik/mailto.mjs';

const AN = 'anfrage@beispiel.de';
const param = (url, name) => new URL(url).searchParams.get(name);

test('Empfänger: nur eine schlichte Adresse; Parameter, Umbrüche und Listen werden abgelehnt', () => {
  assert.equal(adresseGueltig(AN), true);
  for (const schlecht of ['a@b.de?cc=x@y.de', 'a@b.de\r\nBcc: x@y.de', 'a@b.de,c@d.de', 'a b@c.de', 'a@b..de', '', null, `${'a'.repeat(250)}@b.de`]) {
    assert.equal(adresseGueltig(schlecht), false, String(schlecht));
  }
  assert.throws(() => mailtoUrl({ an: 'a@b.de?bcc=x@y.de', betreff: 'x' }));
});

test('Betreff ohne Zeilenumbrüche und Steuerzeichen: keine zusätzlichen Kopfzeilen möglich', () => {
  const { url } = mailtoUrl({ an: AN, betreff: 'Hallo\r\nBcc: boese@x.de\u0000', nachricht: 'Text' });
  assert.equal(param(url, 'subject'), 'Hallo Bcc: boese@x.de');
  assert.doesNotMatch(url.split('&body=')[0], /%0D|%0A|%00/i);
  assert.deepEqual([...new URL(url).searchParams.keys()], ['subject', 'body']);
});

test('Sonderzeichen in Feldern brechen die Parameter nicht auf (&, =, ?, #, Umlaute)', () => {
  const { url } = mailtoUrl({ an: AN, betreff: 'Frage & Antwort', felder: [{ titel: 'Ort', wert: 'Löhnberg & body=x?#' }], nachricht: 'Grüße\nZeile 2' });
  assert.deepEqual([...new URL(url).searchParams.keys()], ['subject', 'body']);
  assert.equal(param(url, 'subject'), 'Frage & Antwort');
  assert.equal(param(url, 'body'), 'Ort: Löhnberg & body=x?#\r\n\r\nGrüße\r\nZeile 2');
});

test('leere freiwillige Felder entfallen; Steuerzeichen und überzählige Leerzeilen werden entfernt', () => {
  assert.equal(zeile('  a \n b\t c  '), 'a b c');
  assert.equal(absatz('a\r\n\r\n\r\n\r\nb\u0007'), 'a\n\nb');
  const { url } = mailtoUrl({ an: AN, betreff: 'x', felder: [{ titel: 'Name', wert: '' }, { titel: 'Ort', wert: 'Weilburg' }], nachricht: 'Hallo' });
  assert.equal(param(url, 'body'), 'Ort: Weilburg\r\n\r\nHallo');
});

test(`kodierte Adresse ≤ ${MAX_LAENGE} Zeichen; zu lange Nachricht wird gekürzt und gemeldet`, () => {
  const kurz = mailtoUrl({ an: AN, betreff: 'x', nachricht: 'Hallo' });
  assert.equal(kurz.gekuerzt, false);
  const lang = mailtoUrl({ an: AN, betreff: 'x', nachricht: 'Schlösser über Türen '.repeat(400) });
  assert.equal(lang.gekuerzt, true);
  assert.ok(lang.url.length <= MAX_LAENGE, String(lang.url.length));
  assert.match(param(lang.url, 'body'), /\[gekürzt – bitte in der E-Mail ergänzen\]$/);
  assert.doesNotThrow(() => decodeURIComponent(lang.url.split('&body=')[1]));
});

test('Pflichtfelder und Mindestlänge in Formularreihenfolge', () => {
  const regeln = [{ id: 'ort', titel: 'Ort', pflicht: true }, { id: 'text', titel: 'Nachricht', pflicht: true, min: 10 }];
  assert.deepEqual(pruefen({ ort: ' ', text: 'kurz' }, regeln).map((f) => f.id), ['ort', 'text']);
  assert.deepEqual(pruefen({ ort: 'Weilburg', text: 'Zylinder tauschen bitte' }, regeln), []);
});
