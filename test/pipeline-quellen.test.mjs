import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dekodiere, liesStandorte, liesSitemapR, liesSitemapA } from '../pipeline/orte/10-quellen.mjs';

const kopf = (titel) => `<div class="toggler ui-accordion-header" role="tab" id="x"><span class="ui-accordion-header-icon"></span> ${titel}</div>`;
const link = (slug, text) => `<a href="https://www.richter-sicherheitstechnik.de/${slug}.html" title="x" role="menuitem">${text}</a>`;

test('dekodiere: benannte Entitäten', () => {
  assert.equal(dekodiere('Tom &amp; Jerry &quot;X&quot; &#39;y&#39; &lt;b&gt;'), 'Tom & Jerry "X" \'y\' <b>');
});

test('dekodiere: numerische Entitäten dezimal und hexadezimal', () => {
  assert.equal(dekodiere('&#8211; &#x2013; &#252;'), '– – ü');
});

test('dekodiere: kein doppeltes Dekodieren', () => {
  assert.equal(dekodiere('&amp;lt;'), '&lt;');
});

test('liesStandorte: Land aus Akkordeon, Präfix entfernt, Entitäten dekodiert', () => {
  const html = kopf('Schlüsseldienst - Hessen')
    + link('schluesseldienst-weilburg', 'Schlüsseldienst Weilburg &amp; Umgebung')
    + link('schluesseldienst-fuerth-hessen', 'Schlüsseldienst Fürth');
  const liste = liesStandorte(html);
  assert.deepEqual(liste, [
    { quelle: 'R', slug: 'schluesseldienst-weilburg', text: 'Weilburg & Umgebung', land: 'Hessen', url: 'https://www.richter-sicherheitstechnik.de/schluesseldienst-weilburg.html' },
    { quelle: 'R', slug: 'schluesseldienst-fuerth-hessen', text: 'Fürth', land: 'Hessen', url: 'https://www.richter-sicherheitstechnik.de/schluesseldienst-fuerth-hessen.html' },
  ]);
});

test('liesStandorte: Länderwechsel setzt das Land neu, NL wird Niederlande', () => {
  const html = kopf('Schlüsseldienst - Bayern')
    + link('schluesseldienst-ahorn', 'Schlüsseldienst Ahorn')
    + kopf('Schlüsseldienst - Berlin')
    + link('schluesseldienst-berlin-mitte', 'Schlüsseldienst Berlin-Mitte')
    + kopf('Slotenmaker – Nederland')
    + link('slotenmaker-mariaparochie', 'Sleutelservice Mariaparochie')
    + link('slotenmaker-amsterdam', 'Slotenmaker Amsterdam');
  const liste = liesStandorte(html);
  assert.deepEqual(liste.map((e) => [e.slug, e.text, e.land]), [
    ['schluesseldienst-ahorn', 'Ahorn', 'Bayern'],
    ['schluesseldienst-berlin-mitte', 'Berlin-Mitte', 'Berlin'],
    ['slotenmaker-mariaparochie', 'Mariaparochie', 'Niederlande'],
    ['slotenmaker-amsterdam', 'Amsterdam', 'Niederlande'],
  ]);
});

test('liesStandorte: Links vor dem ersten Akkordeon und Fremdlinks werden ignoriert', () => {
  const html = link('schluesseldienst-vorne', 'Schlüsseldienst Vorne')
    + kopf('Schlüsseldienst - Saarland')
    + '<a href="https://www.richter-sicherheitstechnik.de/impressum.html">Impressum</a>'
    + link('schluesseldienst-saarlouis', 'Schlüsseldienst Saarlouis');
  assert.deepEqual(liesStandorte(html).map((e) => e.slug), ['schluesseldienst-saarlouis']);
});

test('liesSitemapR: Richter-URLs aus aneinandergereihtem Markdown, Startseite eingeschlossen', () => {
  const md = 'https://www.richter-sicherheitstechnik.de/https://www.richter-sicherheitstechnik.de/kontakt.htmlhttps://www.richter-sicherheitstechnik.de/schluesseldienst-abstatt.html';
  assert.deepEqual(liesSitemapR(md), [
    'https://www.richter-sicherheitstechnik.de/',
    'https://www.richter-sicherheitstechnik.de/kontakt.html',
    'https://www.richter-sicherheitstechnik.de/schluesseldienst-abstatt.html',
  ]);
});

test('liesSitemapR: <loc>-Einträge und Dubletten', () => {
  const html = '<urlset><url><loc>https://www.richter-sicherheitstechnik.de/slotenmaker-a.html</loc></url><url><loc>https://www.richter-sicherheitstechnik.de/slotenmaker-a.html</loc></url></urlset>';
  assert.deepEqual(liesSitemapR(html), ['https://www.richter-sicherheitstechnik.de/slotenmaker-a.html']);
});

test('liesSitemapA: Region aus Gruppenkommentar, Nicht-Orte ausgeschlossen', () => {
  const html = '<!--?xml version="1.0"?--><html><body><urlset>'
    + '<!-- Hauptseiten -->'
    + '<url><loc>https://www.schluesseldienst-adam.de/</loc></url>'
    + '<url><loc>https://www.schluesseldienst-adam.de/preise</loc></url>'
    + '<url><loc>https://www.schluesseldienst-adam.de/blog/ausgesperrt-was-tun</loc></url>'
    + '<!-- === MAIN-TAUNUS-KREIS === -->'
    + '<url><loc>https://www.schluesseldienst-adam.de/hochheim</loc></url>'
    + '<!-- === HANAU &amp; MAIN-KINZIG === -->'
    + '<url><loc>https://www.schluesseldienst-adam.de/hanau</loc></url>'
    + '</urlset></body></html>';
  assert.deepEqual(liesSitemapA(html), [
    { quelle: 'A', slug: 'hochheim', text: 'hochheim', region: 'MAIN-TAUNUS-KREIS', url: 'https://www.schluesseldienst-adam.de/hochheim' },
    { quelle: 'A', slug: 'hanau', text: 'hanau', region: 'HANAU & MAIN-KINZIG', url: 'https://www.schluesseldienst-adam.de/hanau' },
  ]);
});

test('liesSitemapA: Ort ohne Gruppenkommentar bekommt region null', () => {
  const html = '<urlset><url><loc>https://www.schluesseldienst-adam.de/floersheim</loc></url></urlset>';
  assert.deepEqual(liesSitemapA(html), [
    { quelle: 'A', slug: 'floersheim', text: 'floersheim', region: null, url: 'https://www.schluesseldienst-adam.de/floersheim' },
  ]);
});
