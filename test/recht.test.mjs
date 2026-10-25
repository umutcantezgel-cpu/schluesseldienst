// Rechtsseiten: Freigabe-Hinweis nur solange ein Platzhalter (oder ein Vermerk) gesetzt ist; offene Rechtsfragen
// stehen als Platzhalter und sperren so den Release, nie als fester Text (Befunde der Release-Prüfung).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { seiten } from '../src/vorlagen/seiten/recht.mjs';
import { istPlatzhalter } from '../bau/lib/platzhalter.mjs';
import impressum from '../src/inhalte/recht/impressum.mjs';
import datenschutz from '../src/inhalte/recht/datenschutz.mjs';
import widerruf from '../src/inhalte/recht/widerruf.mjs';
import barrierefreiheit from '../src/inhalte/recht/barrierefreiheit.mjs';
import quellenLizenzen from '../src/inhalte/recht/quellen-lizenzen.mjs';
import betrieb from '../src/konfig/betrieb.mjs';
import quellen from '../src/konfig/quellen.mjs';

const BASIS = 'http://127.0.0.1:4173';
const sk = { basisUrl: BASIS, konfig: { betrieb, quellen }, icon: () => '' };
const impressumHtml = () => String(seiten({ basisUrl: BASIS }).find((s) => s.pfad === '/impressum/').inhalt(sk));

test('Entwurf: der Freigabe-Platzhalter steht als Hinweis mit Platzhalterfläche im Kopf', () => {
  assert.match(impressumHtml(), /<p class="recht-freigabe hinweis hinweis-platzhalter">⟦P:recht\.impressum\.freigabe⟧<\/p>/);
});

for (const [name, wert] of [['null', null], ['leer', ''], ['entfernt', undefined]]) {
  test(`nach der Freigabe (${name}) kein leerer Hinweis-Kasten`, (t) => {
    const alt = impressum.freigabe;
    t.after(() => { impressum.freigabe = alt; });
    impressum.freigabe = wert;
    assert.doesNotMatch(impressumHtml(), /recht-freigabe/);
  });
}

test('ein echter Freigabevermerk erscheint ohne Platzhalterfläche', (t) => {
  const alt = impressum.freigabe;
  t.after(() => { impressum.freigabe = alt; });
  impressum.freigabe = 'Geprüft am 1. Januar 2027';
  assert.match(impressumHtml(), /<p class="recht-freigabe hinweis">Geprüft am 1\. Januar 2027<\/p>/);
});

// feste Texte (Absätze, Listen) rekursiv; Platzhalter und Fakten werden übersprungen
function* festeTexte(w) {
  if (typeof w === 'string') yield w;
  else if (Array.isArray(w)) for (const x of w) yield* festeTexte(x);
}

for (const s of [impressum, datenschutz, widerruf, barrierefreiheit, quellenLizenzen]) {
  test(`${s.id}: offene Rechtsfragen nur als Platzhalter, nie als fester Text`, () => {
    for (const a of s.abschnitte) {
      for (const b of a.bloecke) {
        for (const t of festeTexte([b.absatz, b.liste])) assert.doesNotMatch(t, /nicht geprüft|ungeprüft|noch nicht/i, `${s.id}/${a.id}: fester Text „${t}“`);
      }
    }
  });
}

test('Barrierefreiheit: die Geltung des Gesetzes ist ein Platzhalter (sperrt den Release)', () => {
  const rechtslage = barrierefreiheit.abschnitte.find((a) => a.id === 'rechtslage');
  assert.ok(rechtslage.bloecke.some((b) => [b.absatz].flat().some(istPlatzhalter)));
});
