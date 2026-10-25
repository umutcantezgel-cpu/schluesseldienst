// Weiterleitungen, Hoster-Konfigurationen, Pfadregeln der Vorschau und die CSP-Gleichheit.
// Ziel: Open-Redirect-Muster und Lücken in Sicherheits-Headern werden rot, nicht übersehen.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { pruefeWeiterleitungen, headersDatei, htaccess, nginx } from '../bau/lib/hosting.mjs';
import { kopfzeilen, cspText } from '../src/konfig/sicherheit.mjs';

const HOST = 'schluessel.test';
const ok = { von: '/alt-seite', nach: '/notoeffnung/' };
const existiert = () => true;

describe('pruefeWeiterleitungen: gültige Eingabe', () => {
  test('eine saubere Weiterleitung kommt unverändert zurück', () => {
    assert.deepEqual(pruefeWeiterleitungen([ok], existiert), [ok]);
  });

  test('leere Liste ist gültig', () => {
    assert.deepEqual(pruefeWeiterleitungen([], existiert), []);
  });
});

describe('pruefeWeiterleitungen: unsichere Pfade werden abgewiesen', () => {
  const unsicher = [
    ['Ziel mit „//“ ohne Punkt', { von: '/alt-seite', nach: '//notoeffnung/' }],
    ['Ziel mit „//“ und Domain', { von: '/alt-seite', nach: '//evil.example' }],
    ['Quelle mit „//“', { von: '//alt-seite', nach: '/notoeffnung/' }],
    ['Ziel mit Backslash „/\\“', { von: '/alt-seite', nach: '/\\notoeffnung' }],
    ['Ziel mit kodiertem „%2F%2F“', { von: '/alt-seite', nach: '/%2F%2Fnotoeffnung' }],
    ['Ziel mit kodiertem „%5C“', { von: '/alt-seite', nach: '/%5Cnotoeffnung' }],
    ['Ziel mit kleingeschriebenem „%2f%2f“', { von: '/alt-seite', nach: '/%2f%2fnotoeffnung' }],
    ['Ziel mit kleingeschriebenem „%5c“', { von: '/alt-seite', nach: '/%5cnotoeffnung' }],
    ['Ziel mit Schema „https:“', { von: '/alt-seite', nach: 'https://evil.example/' }],
    ['Ziel mit Schema „javascript:“', { von: '/alt-seite', nach: 'javascript:alert(1)' }],
    ['Quelle mit Großbuchstaben', { von: '/Alt-Seite', nach: '/notoeffnung/' }],
    ['Ziel mit Leerzeichen', { von: '/alt-seite', nach: '/not oeffnung' }],
    ['Ziel mit ".."', { von: '/alt-seite', nach: '/a/../notoeffnung' }],
  ];
  for (const [name, eintrag] of unsicher) {
    test(name, () => {
      assert.throws(() => pruefeWeiterleitungen([eintrag], existiert), /unsicherem Pfad/);
    });
  }
});

describe('pruefeWeiterleitungen: Ziel und Eigenschaften', () => {
  test('Ziel ohne existierende Route wird abgewiesen', () => {
    assert.throws(() => pruefeWeiterleitungen([ok], () => false), /existiert nicht/);
  });

  test('Weiterleitung auf sich selbst wird abgewiesen', () => {
    assert.throws(() => pruefeWeiterleitungen([{ von: '/a', nach: '/a' }], existiert), /sich selbst/);
  });

  test('Schleife a→b→a wird abgewiesen', () => {
    assert.throws(() => pruefeWeiterleitungen([{ von: '/a', nach: '/b' }, { von: '/b', nach: '/a' }], existiert));
  });

  test('Kette a→b→c wird abgewiesen', () => {
    assert.throws(() => pruefeWeiterleitungen([{ von: '/a', nach: '/b' }, { von: '/b', nach: '/c' }], existiert));
  });
});

describe('htaccess', () => {
  const ausgabe = htaccess(HOST, [ok]);
  const zeilen = ausgabe.split('\n');

  test('Weiterleitungsziel trägt den festen Host', () => {
    assert.ok(ausgabe.includes(`RewriteRule ^alt-seite$ https://${HOST}/notoeffnung/ [R=301,L]`));
  });

  test('kanonische Umleitung auf den festen Host, nie auf den Host-Header', () => {
    assert.ok(ausgabe.includes(`RewriteRule ^ https://${HOST}%{REQUEST_URI} [R=301,L,NE]`));
    const ausserhalbBedingung = zeilen.filter((z) => z.includes('%{HTTP_HOST}') && !z.trimStart().startsWith('RewriteCond'));
    assert.deepEqual(ausserhalbBedingung, []);
  });

  test('alle Sicherheits-Header aus kopfzeilen() sind gesetzt', () => {
    for (const [name, wert] of Object.entries(kopfzeilen())) {
      assert.ok(ausgabe.includes(`Header always set ${name} "${wert}"`), name);
    }
  });

  test('Dotfile-Sperre ist gesetzt', () => {
    assert.ok(ausgabe.includes('RewriteRule (^|/)\\.(?!well-known/) - [R=404,L]'));
  });

  test('ungültiger Host wird abgelehnt', () => {
    for (const h of ['Schluessel.test', 'evil.test/x', 'a b', 'x"y', `evil.test\nRewriteRule ^ https://evil.example/`]) {
      assert.throws(() => htaccess(h), /Host ungültig/, JSON.stringify(h));
    }
  });
});

describe('nginx', () => {
  const { 'site.conf': site, 'sicherheit-header.conf': kopf } = nginx(HOST, [ok]);

  test('Weiterleitungsziel trägt den festen Host; keine Variablen $host oder $http_host', () => {
    assert.ok(site.includes(`location = /alt-seite { return 301 https://${HOST}/notoeffnung/; }`));
    assert.doesNotMatch(site, /\$host\b|\$http_host\b/);
  });

  test('alle Sicherheits-Header aus kopfzeilen() stehen im Snippet', () => {
    for (const [name, wert] of Object.entries(kopfzeilen())) {
      assert.ok(kopf.includes(`add_header ${name} "${wert}" always;`), name);
    }
  });

  test('TLS-Server bindet das Header-Snippet ein; server_tokens aus', () => {
    assert.ok(site.includes('include snippets/sicherheit-header.conf;'));
    assert.ok(site.includes('server_tokens off;'));
  });

  test('Dotfile-Sperre ist gesetzt', () => {
    assert.ok(site.includes('location ~ /\\.(?!well-known/) { return 404; }'));
  });

  test('default_server beantwortet HTTP und HTTPS mit 444', () => {
    const erster = site.slice(0, site.indexOf('}') + 1);
    assert.ok(erster.includes('listen 80 default_server;'));
    assert.ok(erster.includes('listen 443 ssl default_server;'));
    assert.ok(erster.includes('return 444;'));
  });

  test('ungültiger Host wird abgelehnt', () => {
    assert.throws(() => nginx('evil.test;'), /Host ungültig/);
  });
});

describe('headersDatei (Netlify/Cloudflare)', () => {
  test('_headers: Sicherheits-Header gelten für /* und enthalten jeden Header aus kopfzeilen()', () => {
    const { _headers } = headersDatei([ok]);
    assert.ok(_headers.startsWith('/*\n'));
    for (const [name, wert] of Object.entries(kopfzeilen())) {
      assert.ok(_headers.includes(`  ${name}: ${wert}`), name);
    }
  });

  test('_headers: Daten-Dateien unveränderlich gecacht und nicht indexierbar', () => {
    const { _headers } = headersDatei();
    assert.ok(_headers.includes('/daten/*\n  Cache-Control: public, max-age=31536000, immutable\n  X-Robots-Tag: noindex'));
  });

  test('_redirects: 301 mit relativem Ziel', () => {
    assert.equal(headersDatei([ok])._redirects, '/alt-seite /notoeffnung/ 301\n');
  });
});

describe('CSP-Gleichheit über alle Ausgaben', () => {
  const csp = cspText();

  test('kopfzeilen() liefert dieselbe CSP wie cspText()', () => {
    assert.equal(kopfzeilen()['Content-Security-Policy'], csp);
  });

  test('headersDatei, htaccess und nginx tragen exakt dieselbe CSP-Zeichenkette', () => {
    const gefunden = {
      headersDatei: headersDatei()._headers.match(/^  Content-Security-Policy: (.*)$/m)?.[1],
      htaccess: htaccess(HOST).match(/^  Header always set Content-Security-Policy "(.*)"$/m)?.[1],
      nginx: nginx(HOST)['sicherheit-header.conf'].match(/^add_header Content-Security-Policy "(.*)" always;$/m)?.[1],
    };
    for (const [quelle, wert] of Object.entries(gefunden)) assert.equal(wert, csp, quelle);
  });

  test('CSP enthält Trusted Types, Rahmen- und Objektsperre und keine unsafe-Quellen', () => {
    assert.match(csp, /require-trusted-types-for 'script'/);
    assert.match(csp, /trusted-types 'none'/);
    assert.match(csp, /frame-ancestors 'none'/);
    assert.match(csp, /object-src 'none'/);
    assert.match(csp, /default-src 'none'/);
    assert.doesNotMatch(csp, /unsafe-(inline|eval)/);
  });
});

// bau/vorschau.mjs startet beim Import einen Server (server.listen auf Modulebene). Der Test
// läuft deshalb in einem Kindprozess mit --port 0 (freier Port) und beendet sich selbst.
const VORSCHAU = pathToFileURL(new URL('../bau/vorschau.mjs', import.meta.url).pathname).href;

function pfadePruefen(eingaben) {
  const skript = `
    process.argv = [process.argv[0], 'vorschau', '--port', '0', '--still'];
    const { pfadPruefen } = await import(${JSON.stringify(VORSCHAU)});
    const eingaben = ${JSON.stringify(eingaben)};
    console.log(JSON.stringify(eingaben.map((e) => pfadPruefen(e))));
    process.exit(0);
  `;
  const r = spawnSync(process.execPath, ['--input-type=module'], { input: skript, encoding: 'utf8', timeout: 20000 });
  assert.equal(r.status, 0, r.stderr);
  return JSON.parse(r.stdout.trim().split('\n').pop());
}

const annehmen = [
  ['/', '/'],
  ['/notoeffnung/', '/notoeffnung/'],
  ['/daten/orte.abc123.json', '/daten/orte.abc123.json'],
  ['/notoeffnung/?q=../x', '/notoeffnung/'],
  ['/notoeffnung/#../x', '/notoeffnung/'],
  ['/a%20b', '/a b'],
];
const ablehnen = [
  '//evil.example',
  '/a//b',
  '/\\evil.example',
  '/a\\b',
  '/a%5Cb',
  '/a%5cb',
  '/%2F%2Fevil.example',
  '/%2f',
  '/a%2fb',
  '/notoeffnung%2Forte.json',
  '/%00',
  '/a%00.html',
  '/a\u0000b',
  '/..',
  '/a/../b',
  '/daten/..',
  '/%2e%2e/geheim',
  '/%2E%2E/geheim',
  '/.%2e/geheim',
  '/%2e%2e%2fgeheim',
  'https://evil.example/',
  'evil.example',
  '',
];
const ergebnisse = pfadePruefen([...annehmen.map(([e]) => e), ...ablehnen]);
const ergebnisAn = new Map(annehmen.map(([e], i) => [e, ergebnisse[i]]));

describe('pfadPruefen (bau/vorschau.mjs)', () => {
  for (const [eingabe, erwartet] of annehmen) {
    test(`akzeptiert „${eingabe}“ als „${erwartet}“`, () => {
      assert.equal(ergebnisAn.get(eingabe), erwartet);
    });
  }

  ablehnen.forEach((eingabe, i) => {
    test(`lehnt „${eingabe.replace(/\u0000/g, '\\0')}“ ab`, () => {
      assert.equal(ergebnisse[annehmen.length + i], null);
    });
  });
});

test('Import von bau/vorschau.mjs startet keinen Server', () => {
  const skript = `
    process.argv = [process.argv[0], 'vorschau', '--port', '0', '--still'];
    await import(${JSON.stringify(VORSCHAU)});
  `;
  const r = spawnSync(process.execPath, ['--input-type=module'], { input: skript, encoding: 'utf8', timeout: 2500 });
  assert.equal(r.status, 0, 'Kindprozess blieb wegen eines offenen Servers hängen');
});
