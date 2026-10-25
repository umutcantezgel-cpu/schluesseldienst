// Tests für die vorkomprimierten Varianten (K-05): Rundreise, Determinismus, nur Textendungen, keine größeren
// Varianten, Aktualität, verwaiste Varianten (auch veraltete Quellen eines Laufs), Zusammenspiel mit dem Aufräumen
// des Schreibers und die Hoster-Konfiguration (Apache/nginx). Arbeitet nur in Temp-Ordnern.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, readdir, stat, utimes, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname, extname } from 'node:path';
import { gunzipSync, brotliDecompressSync } from 'node:zlib';
import { randomBytes } from 'node:crypto';
import { vorkomprimieren, TEXT_ENDUNGEN } from '../bau/lib/vorkomprimieren.mjs';
import { Schreiber } from '../bau/lib/schreiben.mjs';
import { htaccess, nginx } from '../bau/lib/hosting.mjs';
import { MIME } from '../src/konfig/sicherheit.mjs';

const HTML = '<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Notöffnung</title></head><body>'
  + '<p>Schlüsseldienst in Weilburg an der Lahn: Notöffnung, Einbruchschutz, Schließzylinder.</p>'.repeat(120)
  + '</body></html>\n';
const CSS = 'body{margin:0;font-family:sans-serif;color:#111}.kopf{display:grid;gap:1rem}'.repeat(60);

/** Temp-Ordner mit Dateien; wird nach dem Test wieder entfernt. */
async function temp(t, dateien = {}) {
  const dist = await mkdtemp(join(tmpdir(), 'vork-'));
  t.after(() => rm(dist, { recursive: true, force: true }));
  for (const [pfad, inhalt] of Object.entries(dateien)) {
    await mkdir(join(dist, dirname(pfad)), { recursive: true });
    await writeFile(join(dist, pfad), inhalt);
  }
  return dist;
}

/**
 * Ein Lauf wie der Generator: Er schreibt alle vorhandenen Textdateien neu (sie gelten damit als „in diesem Lauf
 * geschrieben“) und komprimiert. Mit { ohneAufraeumen: true } wie bei --nur: keine Schreiber-Liste, vorhandene Dateien zählen.
 */
async function lauf(dist, optionen = {}) {
  const s = new Schreiber(dist);
  for (const n of await readdir(dist)) {
    if (TEXT_ENDUNGEN.includes(extname(n))) await s.schreibe(n, await readFile(join(dist, n)));
  }
  return vorkomprimieren(s, optionen);
}
const varianten = async (dist) => (await readdir(dist)).filter((n) => /\.(br|gz)$/.test(n)).sort();
const existiert = (pfad) => stat(pfad).then(() => true, () => false);

describe('vorkomprimieren', () => {
  test('Rundreise: entpackt ergibt das Original (.br mit Brotli, .gz mit gzip)', async (t) => {
    const dist = await temp(t, { 'index.html': HTML, 'app.css': CSS });
    const s = await lauf(dist);
    assert.equal(s.neu, 4);
    assert.ok(brotliDecompressSync(await readFile(join(dist, 'index.html.br'))).equals(Buffer.from(HTML)));
    assert.ok(gunzipSync(await readFile(join(dist, 'index.html.gz'))).equals(Buffer.from(HTML)));
    assert.ok(brotliDecompressSync(await readFile(join(dist, 'app.css.br'))).equals(Buffer.from(CSS)));
    assert.ok(gunzipSync(await readFile(join(dist, 'app.css.gz'))).equals(Buffer.from(CSS)));
  });

  test('Determinismus: gleiche Eingabe → gleiche Bytes; gzip ohne Zeitstempel, Dateiname und plattformabhängige OS-Kennung', async (t) => {
    const a = await temp(t, { 'index.html': HTML });
    const b = await temp(t, { 'index.html': HTML });
    await lauf(a);
    await lauf(b);
    for (const v of ['index.html.br', 'index.html.gz']) {
      assert.ok((await readFile(join(a, v))).equals(await readFile(join(b, v))), v);
    }
    const gz = await readFile(join(a, 'index.html.gz'));
    assert.deepEqual([...gz.subarray(4, 8)], [0, 0, 0, 0], 'MTIME');
    assert.equal(gz[3], 0, 'FLG: kein Dateiname');
    assert.equal(gz[9], 3, 'OS: Unix');
    // Neu erzeugt nach Löschen der Varianten: dieselben Bytes
    const erst = await readFile(join(a, 'index.html.br'));
    await rm(join(a, 'index.html.br'));
    await rm(join(a, 'index.html.gz'));
    await lauf(a);
    assert.ok((await readFile(join(a, 'index.html.br'))).equals(erst));
  });

  test('nur Textendungen: Bilder und Schriften bekommen keine Varianten', async (t) => {
    const dist = await temp(t, {
      'foto.png': Buffer.from(CSS), 'foto.jpg': Buffer.from(CSS), 'bild.webp': Buffer.from(CSS),
      'schrift.woff2': Buffer.from(CSS), 'icon.ico': Buffer.from(CSS), 'icon.svg': CSS,
    });
    const s = await lauf(dist);
    assert.equal(s.quellen, 1, 'nur icon.svg ist Textdatei');
    assert.deepEqual((await varianten(dist)), ['icon.svg.br', 'icon.svg.gz']);
  });

  test('keine größeren Varianten: nicht kleinere Ergebnisse werden verworfen', async (t) => {
    const dist = await temp(t, { 'zufall.txt': randomBytes(4096), 'kurz.css': 'a{}' });
    const s = await lauf(dist);
    assert.equal(s.neu, 0);
    assert.equal(s.zuGross, 4);
    assert.deepEqual(await varianten(dist), []);
  });

  test('unveränderte Dateien werden nicht neu komprimiert (Varianten bleiben unberührt)', async (t) => {
    const dist = await temp(t, { 'index.html': HTML });
    await lauf(dist);
    const zeit = new Date('2001-01-01T00:00:00Z');
    await utimes(join(dist, 'index.html.br'), zeit, zeit);
    await utimes(join(dist, 'index.html.gz'), zeit, zeit);
    const s = await lauf(dist);
    assert.equal(s.neu, 0);
    assert.equal(s.unveraendert, 2);
    assert.equal((await stat(join(dist, 'index.html.br'))).mtimeMs, zeit.getTime());
    assert.equal((await stat(join(dist, 'index.html.gz'))).mtimeMs, zeit.getTime());
  });

  test('geänderte Datei: Varianten werden aus dem neuen Inhalt erneuert', async (t) => {
    const neu = HTML.replace('Notöffnung', 'Türöffnung');
    const dist = await temp(t, { 'index.html': HTML });
    await lauf(dist);
    await writeFile(join(dist, 'index.html'), neu);
    const s = await lauf(dist);
    assert.equal(s.neu, 2);
    assert.ok(brotliDecompressSync(await readFile(join(dist, 'index.html.br'))).equals(Buffer.from(neu)));
    assert.ok(gunzipSync(await readFile(join(dist, 'index.html.gz'))).equals(Buffer.from(neu)));
  });

  test('verwaiste Varianten werden entfernt: gelöschte Quelle und Variante ohne Quelle', async (t) => {
    const dist = await temp(t, { 'alt.html': HTML });
    await lauf(dist);
    await rm(join(dist, 'alt.html'));
    await writeFile(join(dist, 'rest.css.br'), 'x');
    const s = await lauf(dist);
    assert.equal(s.entfernt, 3);
    assert.deepEqual(await varianten(dist), []);
  });

  test('Quelle wird zu nicht kleinerem Inhalt: die alte Variante verschwindet', async (t) => {
    const dist = await temp(t, { 'daten.txt': CSS });
    await lauf(dist);
    assert.equal((await varianten(dist)).length, 2);
    await writeFile(join(dist, 'daten.txt'), randomBytes(4096));
    const s = await lauf(dist);
    assert.equal(s.entfernt, 2);
    assert.deepEqual(await varianten(dist), []);
  });

  test('veraltete Quelle im Ordner (nicht Teil dieses Laufs): keine neuen Varianten, alte Varianten verschwinden', async (t) => {
    const dist = await temp(t, { 'index.html': HTML, 'alt.html': HTML });
    await lauf(dist); // Lauf 1: beide Seiten mit Varianten
    const s = new Schreiber(dist); // Lauf 2: alt.html wird nicht mehr geschrieben, liegt aber noch im Ordner
    await s.schreibe('index.html', HTML);
    const bericht = await vorkomprimieren(s);
    assert.equal(bericht.quellen, 1, 'nur die Quelle dieses Laufs');
    assert.equal(bericht.neu, 0);
    assert.equal(bericht.unveraendert, 2);
    assert.equal(bericht.entfernt, 2, 'alt.html.br und alt.html.gz');
    assert.equal(await s.aufraeumen(), 1, 'alt.html selbst');
    assert.deepEqual(await varianten(dist), ['index.html.br', 'index.html.gz']);
    assert.ok(!(await existiert(join(dist, 'alt.html'))));
  });

  test('Zusammenspiel mit dem Aufräumen: aufraeumen() löscht die Varianten des Laufs nicht', async (t) => {
    const dist = await temp(t);
    const s = new Schreiber(dist);
    await s.schreibe('index.html', HTML);
    await vorkomprimieren(s);
    assert.equal(await s.aufraeumen(), 0);
    assert.ok(await existiert(join(dist, 'index.html.br')));
    assert.ok(await existiert(join(dist, 'index.html.gz')));
  });

  test('ohne Aufräumen (--nur): Varianten vorhandener Quellen bleiben, nur echte Waisen fallen weg', async (t) => {
    const dist = await temp(t, { 'index.html': HTML, 'alt.html': HTML });
    await lauf(dist);
    await rm(join(dist, 'index.html')); // index.html-Varianten sind jetzt Waisen, alt.html bleibt als Quelle
    const s = await lauf(dist, { ohneAufraeumen: true });
    assert.equal(s.unveraendert, 2, 'alt.html.br und alt.html.gz');
    assert.equal(s.entfernt, 2, 'index.html.br und index.html.gz');
    assert.deepEqual(await varianten(dist), ['alt.html.br', 'alt.html.gz']);
  });

  test('Textendungen haben einen Content-Type im Sicherheits-Register (MIME)', () => {
    for (const e of TEXT_ENDUNGEN) assert.ok(MIME[e], e);
  });
});

describe('Hoster-Konfiguration für vorkomprimierte Dateien', () => {
  const HOST = 'beispiel.test';
  const apache = htaccess(HOST);
  const zeilen = apache.split('\n');
  const { 'site.conf': site } = nginx(HOST);

  /** Zuordnung Endung → Typ aus den AddType-Zeilen der .htaccess. */
  const zuordnungAus = (text) => Object.fromEntries([...text.matchAll(/^AddType (\S+) \.(\S+)$/gm)].map((m) => [m[2], m[1]]));
  /** Endungen, die eine Richtlinie (RemoveType, RemoveEncoding …) aufhebt. */
  const aufgehoben = (text, richtlinie) => new Set(
    [...text.matchAll(new RegExp(`^\\s*${richtlinie} (.+)$`, 'gm'))].flatMap((m) => m[1].trim().split(/\s+/)).map((e) => e.replace(/^\./, '')),
  );
  /** Typ aus den Endungen: von rechts nach links die erste nicht aufgehobene Endung mit Zuordnung (Dateiname mit Endungen). */
  function typVon(dateiname, zuordnung, weg) {
    for (const e of dateiname.split('.').slice(1).reverse()) {
      if (weg.has(e)) continue;
      if (zuordnung[e]) return zuordnung[e];
    }
    return null;
  }

  test('Apache: Typ der Varianten ist der des Originals (index.html.gz → text/html, nicht Serverstandard x-gzip)', () => {
    assert.ok(apache.includes('AddType text/html .html'));
    assert.ok(apache.includes('AddCharset utf-8 .html .css .js .json .xml .txt .webmanifest .svg'));
    // Serverstandards (Debian mime.conf, Apache httpd.conf): .gz und .tgz als x-gzip
    const serverstandard = { gz: 'application/x-gzip', tgz: 'application/x-gzip' };
    const zuordnung = { ...serverstandard, ...zuordnungAus(apache) };
    const weg = aufgehoben(apache, 'RemoveType');
    assert.ok(weg.has('gz') && weg.has('br'), 'RemoveType für .gz und .br');
    for (const e of TEXT_ENDUNGEN) {
      const typ = MIME[e].split(';')[0];
      for (const v of ['br', 'gz']) assert.equal(typVon(`seite${e}.${v}`, zuordnung, weg), typ, `seite${e}.${v}`);
    }
  });

  test('Apache: die Kodierung kommt nur vom Header; der Serverstandard „AddEncoding x-gzip“ ist aufgehoben', () => {
    const weg = aufgehoben(apache, 'RemoveEncoding');
    assert.ok(weg.has('gz') && weg.has('br'));
    assert.ok(apache.includes('    Header always set Content-Encoding gzip'));
    assert.ok(apache.includes('    Header always set Content-Encoding br'));
  });

  test('Apache: Content-Encoding nur an .br bzw. .gz, Vary: Accept-Encoding immer', () => {
    assert.ok(apache.includes('    Header always set Content-Encoding br'));
    assert.ok(apache.includes('    Header always set Content-Encoding gzip'));
    assert.equal(apache.match(/Header always merge Vary Accept-Encoding/g).length, 3);
    assert.ok(apache.includes('  <FilesMatch "\\.(html|css|js|json|xml|svg|txt|webmanifest)$">'));
  });

  test('Apache: Cache-Regel für HTML prüft den Content-Type (gilt damit auch für die HTML-Varianten)', () => {
    assert.ok(apache.includes('  Header always set Cache-Control "no-cache" "expr=%{CONTENT_TYPE} =~ m#^text/html#"'));
  });

  test('Apache: Rewrite nur bei vorhandener Datei und für Textendungen; br vor gzip', () => {
    assert.ok(zeilen.includes('  RewriteCond %{REQUEST_FILENAME}.br -f'));
    assert.ok(zeilen.includes('  RewriteCond %{REQUEST_FILENAME}.gz -f'));
    assert.ok(apache.includes('  RewriteRule ^(.+\\.(html|css|js|json|xml|svg|txt|webmanifest))$ $1.br [L,E=no-gzip:1,E=no-brotli:1,E=dont-vary:1]'));
    assert.ok(apache.includes('  RewriteRule ^(.+\\.(html|css|js|json|xml|svg|txt|webmanifest))$ $1.gz [L,E=no-gzip:1,E=no-brotli:1,E=dont-vary:1]'));
    assert.ok(apache.indexOf('$1.br') < apache.indexOf('$1.gz'));
  });

  test('Apache: Accept-Encoding-Bedingung erkennt Listen und Qualitäten, q=0 zählt nicht', () => {
    const bedingung = (token) => {
      const zeile = zeilen.find((z) => z.includes(`%{HTTP:Accept-Encoding} `) && z.includes(`(^|,)\\s*${token}\\s*`));
      assert.ok(zeile, token);
      return new RegExp(zeile.trim().split(' ')[2], 'i');
    };
    const br = bedingung('br');
    for (const ja of ['br', 'gzip, deflate, br', 'gzip;q=1, br;q=0.5', 'br;q=1.0', 'deflate,br']) assert.ok(br.test(ja), ja);
    for (const nein of ['gzip, deflate', 'br;q=0', 'gzip, br;q=0', 'brotli', 'x-br', '']) assert.ok(!br.test(nein), nein);
    const gz = bedingung('gzip');
    assert.ok(gz.test('gzip, deflate, br'));
    assert.ok(!gz.test('br, deflate'));
  });

  test('Apache: keine Doppelkompression (mod_deflate für .br/.gz aus, auch bei direkter Anforderung)', () => {
    assert.ok(apache.includes('SetEnvIfNoCase Request_URI \\.(br|gz)$ no-gzip dont-vary'));
    assert.ok(apache.includes('<IfModule mod_deflate.c>'));
  });

  test('Apache: direkt angeforderte .br/.gz-Dateien werden mit 404 abgewiesen', () => {
    assert.ok(zeilen.includes('  RewriteCond %{THE_REQUEST} \\.(br|gz)[\\s?]'));
    assert.ok(zeilen.includes('  RewriteRule ^ - [R=404,L]'));
  });

  test('Apache: Cache-Regeln für Assets bleiben unverändert', () => {
    assert.ok(apache.includes('  Header always set Cache-Control "public, max-age=31536000, immutable"'));
  });

  test('nginx: gzip_static und gzip_vary sind eingeschaltet; brotli_static nur als Hinweis', () => {
    assert.ok(site.includes('    gzip_static on;'));
    assert.ok(site.includes('    gzip_vary on;'));
    assert.match(site, /^\s*# brotli_static on;/m);
    assert.doesNotMatch(site, /^\s*brotli_static on;/m);
  });

  test('nginx: direkt angeforderte .br/.gz-Dateien werden mit 404 abgewiesen (wie bei Apache)', () => {
    assert.ok(site.includes('location ~ \\.(br|gz)$ { return 404; }'));
  });
});

test('Apache: Verzeichnis-Adressen (/pfad/ → index.html) bekommen die Variante ausdrücklich, br vor gzip', () => {
  const apache = htaccess('www.example.org');
  const br = apache.indexOf('  RewriteRule ^(.*/)?$ $1index.html.br [L,E=no-gzip:1,E=no-brotli:1,E=dont-vary:1]');
  const gz = apache.indexOf('  RewriteRule ^(.*/)?$ $1index.html.gz [L,E=no-gzip:1,E=no-brotli:1,E=dont-vary:1]');
  assert.ok(br > 0 && gz > br, 'beide Regeln, br zuerst');
  assert.ok(apache.includes('  RewriteCond %{REQUEST_FILENAME}/index.html.br -f'));
  assert.ok(apache.includes('  RewriteCond %{REQUEST_FILENAME}/index.html.gz -f'));
  // Muster im Verzeichniskontext: Wurzel („“) und /pfad/ („pfad/“) ja, Datei-Adressen nein
  const muster = /^(.*\/)?$/;
  assert.deepEqual(['', 'pfad/', 'a/b/', 'pfad', 'a/index.html'].map((p) => muster.test(p)), [true, true, true, false, false]);
});

test('--vorkomprimieren nur mit --ziel=apache oder nginx: Netlify/Cloudflare brechen vor dem Schreiben ab', async () => {
  const { spawnSync } = await import('node:child_process');
  const { fileURLToPath } = await import('node:url');
  const bauen = fileURLToPath(new URL('../bau/bauen.mjs', import.meta.url));
  for (const ziel of ['netlify', 'cloudflare']) {
    const tmp = await mkdtemp(join(tmpdir(), 'vork-ziel-'));
    const aus = join(tmp, 'aus');
    const r = spawnSync(process.execPath, [bauen, '--messen', '--vorkomprimieren', `--ziel=${ziel}`, `--aus=${aus}`], { encoding: 'utf8', timeout: 60000 });
    const angelegt = await stat(aus).then(() => true, () => false);
    await rm(tmp, { recursive: true, force: true });
    assert.equal(r.status, 2, ziel);
    assert.match(r.stderr, /--vorkomprimieren nur mit --ziel=apache oder nginx/);
    assert.equal(angelegt, false);
  }
});
