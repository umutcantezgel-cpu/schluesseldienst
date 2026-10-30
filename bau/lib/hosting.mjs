// Erzeugt Hoster-Konfigurationen aus src/konfig/sicherheit.mjs (eine Quelle, gleiche Header überall).
// Weiterleitungen: nur geprüfte Pfade, Ziele mit fest eingetragenem Host (Schutz vor offenen Weiterleitungen).
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { kopfzeilen, CACHE, MIME, SICHERER_PFAD } from '../../src/konfig/sicherheit.mjs';
import { TEXT_ENDUNGEN } from './vorkomprimieren.mjs';

// Vorkomprimierte Varianten (.br/.gz): Textendungen als Alternation; Annahme eines Kodierungs-Tokens im
// Accept-Encoding (q=0 zählt als „nicht angenommen“).
const TEXT = TEXT_ENDUNGEN.map((e) => e.slice(1)).join('|');
const annahme = (token) => `(^|,)\\s*${token}\\s*(;\\s*q=(0\\.\\d*[1-9]\\d*|1(\\.0*)?)\\s*)?(,|$)`;

export function pruefeWeiterleitungen(liste, existiert) {
  const quellen = new Set();
  for (const { von } of liste) {
    if (quellen.has(von)) throw new Error(`Weiterleitung doppelt: ${von}`);
    quellen.add(von);
  }
  for (const { von, nach } of liste) {
    if (!SICHERER_PFAD.test(von) || !SICHERER_PFAD.test(nach)) throw new Error(`Weiterleitung mit unsicherem Pfad: ${von} → ${nach}`);
    if (von === nach) throw new Error(`Weiterleitung auf sich selbst: ${von}`);
    // Keine Ketten und damit keine Schleifen: ein Ziel darf selbst keine Quelle sein (ein Sprung, SEO-sauber).
    if (quellen.has(nach)) throw new Error(`Weiterleitungskette: ${von} → ${nach} wird selbst weitergeleitet`);
    if (!existiert(nach)) throw new Error(`Weiterleitungsziel existiert nicht: ${nach}`);
  }
  return liste;
}

/** Weiterleitungen aus src/daten/weiterleitungen.json (fehlt die Datei, gibt es keine). */
export async function weiterleitungenLesen(wurzel) {
  try { return JSON.parse(await readFile(join(wurzel, 'src/daten/weiterleitungen.json'), 'utf8')); } catch { return []; }
}

const apacheWert = (v) => v.replace(/"/g, '\\"');

// noindex: Test-Deploy der Vorschau (zusätzlich zu meta robots und robots.txt), nie im Release.
export function headersDatei(weiterleitungen = [], { noindex = false } = {}) {
  const k = { ...kopfzeilen(), ...(noindex ? { 'X-Robots-Tag': 'noindex' } : {}) };
  const zeilen = ['/*', ...Object.entries(k).map(([n, v]) => `  ${n}: ${v}`)];
  for (const c of CACHE.filter((c) => c.muster !== '/*')) {
    zeilen.push(c.muster, `  Cache-Control: ${c.wert}`, ...Object.entries(c.extra || {}).map(([n, v]) => `  ${n}: ${v}`));
  }
  return { '_headers': zeilen.join('\n') + '\n', '_redirects': weiterleitungen.map((w) => `${w.von} ${w.nach} 301`).join('\n') + (weiterleitungen.length ? '\n' : '') };
}

// Vercel (Test-Deploy der Vorschau): vercel.json liegt im Wurzelverzeichnis, weil Vercel sie vor dem Bau liest;
// erzeugt mit „npm run hoster“, der Bau mit --ziel=vercel prüft, dass sie zur Quelle passt. Gleiche Header und
// Cache-Regeln wie _headers (HTML behält den Hoster-Standard), Weiterleitungen mit 301 statt Vercels 308.
// Vercel wertet trailingSlash vor den redirects aus; die Quelle steht deshalb mit „/“ am Ende (sonst 308, dann 404).
export const VERCEL_BAU = 'node bau/bauen.mjs --ziel=vercel --basis=https://${VERCEL_PROJECT_PRODUCTION_URL:-$VERCEL_URL}';

export function vercelVorschau(weiterleitungen = []) {
  const paare = (o) => Object.entries(o).map(([key, value]) => ({ key, value }));
  return {
    $schema: 'https://openapi.vercel.sh/vercel.json',
    framework: null,
    buildCommand: VERCEL_BAU,
    outputDirectory: 'dist',
    trailingSlash: true,
    cleanUrls: false,
    headers: [
      { source: '/(.*)', headers: paare({ ...kopfzeilen(), 'X-Robots-Tag': 'noindex' }) },
      ...CACHE.filter((c) => c.muster !== '/*').map((c) => ({ source: c.muster.replace(/\*/g, '(.*)'), headers: paare({ 'Cache-Control': c.wert, ...(c.extra || {}) }) })),
    ],
    redirects: weiterleitungen.map((w) => ({ source: w.von.endsWith('/') ? w.von : `${w.von}/`, destination: w.nach, statusCode: 301 })),
  };
}

export const vercelText = (weiterleitungen = []) => JSON.stringify(vercelVorschau(weiterleitungen), null, 2) + '\n';

// Prüfung im Bau: verglichen wird der Inhalt, nicht die Schreibweise – der Bau-Container des Hosters darf Leerraum,
// Zeilenenden oder ein BOM ändern. Die genaue Textform der committeten Datei hält test/test-deploy.test.mjs fest.
// Liefert je abweichendem Schlüssel die erste Abweichung als Zeile (leer: passt).
const kurz = (v) => { const s = v === undefined ? 'nichts' : JSON.stringify(v); return s.length > 120 ? `${s.slice(0, 119)}…` : s; };
function ersteAbweichung(ist, soll, pfad) {
  if (isDeepStrictEqual(ist, soll)) return null;
  const objekt = (v) => v !== null && typeof v === 'object';
  if (objekt(ist) && objekt(soll) && Array.isArray(ist) === Array.isArray(soll)) {
    const schluessel = Array.isArray(soll) ? [...Array(Math.max(ist.length, soll.length)).keys()] : [...new Set([...Object.keys(soll), ...Object.keys(ist)])];
    for (const k of schluessel) {
      const p = Array.isArray(soll) ? `${pfad}[${k}]` : `${pfad}.${k}`;
      if (!Object.hasOwn(ist, k)) return `${p} fehlt (erwartet ${kurz(soll[k])})`;
      if (!Object.hasOwn(soll, k)) return `${p} ist zu viel (${kurz(ist[k])})`;
      const a = ersteAbweichung(ist[k], soll[k], p);
      if (a) return a;
    }
  }
  return `${pfad}: ${kurz(ist)} statt ${kurz(soll)}`;
}

export function vercelAbweichungen(text, weiterleitungen = []) {
  if (!text.trim()) return ['vercel.json fehlt oder ist leer'];
  let ist;
  try { ist = JSON.parse(text.replace(/^﻿/, '')); } catch (e) { return [`vercel.json ist kein gültiges JSON (${e.message})`]; }
  if (ist === null || typeof ist !== 'object' || Array.isArray(ist)) return ['vercel.json ist kein JSON-Objekt'];
  const soll = vercelVorschau(weiterleitungen);
  return [...new Set([...Object.keys(soll), ...Object.keys(ist)])]
    .map((k) => (Object.hasOwn(ist, k) ? (Object.hasOwn(soll, k) ? ersteAbweichung(ist[k], soll[k], k) : `${k} ist zu viel (${kurz(ist[k])})`) : `${k} fehlt (erwartet ${kurz(soll[k])})`))
    .filter(Boolean);
}

export function htaccess(host, weiterleitungen = []) {
  if (!/^[a-z0-9.-]+$/.test(host)) throw new Error(`Host ungültig: ${host}`);
  const k = kopfzeilen();
  const typen = Object.entries(MIME).map(([ext, typ]) => `AddType ${typ.split(';')[0]} ${ext}`);
  const cache = CACHE.filter((c) => c.muster.startsWith('/') && c.muster.endsWith('/*') && c.muster !== '/*').map((c) => {
    const pfad = c.muster.slice(0, -1);
    return [`<If "%{REQUEST_URI} =~ m#^${pfad}#">`, `  Header always set Cache-Control "${c.wert}"`, ...Object.entries(c.extra || {}).map(([n, v]) => `  Header always set ${n} "${v}"`), '</If>'].join('\n');
  });
  return [
    '# Erzeugt von bau/bauen.mjs aus src/konfig/sicherheit.mjs – nicht von Hand ändern.',
    'Options -Indexes -MultiViews',
    'DirectoryIndex index.html',
    'DirectorySlash On',
    'ErrorDocument 404 /404.html',
    'ServerSignature Off',
    ...typen,
    '<IfModule mod_mime.c>',
    '  # Vorkomprimierte Varianten: Typ und Kodierung kommen aus der Endung des Originals (index.html.gz → text/html),',
    '  # nicht aus .gz/.br. Serverstandards wie „AddType application/x-gzip .gz“ und „AddEncoding x-gzip .gz“ werden aufgehoben.',
    '  RemoveType .br .gz',
    '  RemoveEncoding .br .gz',
    '  # Debian/Ubuntu: „AddLanguage br .br“ (Bretonisch) – sonst trüge jede Brotli-Antwort Content-Language: br',
    '  RemoveLanguage .br .gz',
    '</IfModule>',
    'AddCharset utf-8 .html .css .js .json .xml .txt .webmanifest .svg',
    '<IfModule mod_headers.c>',
    ...Object.entries(k).map(([n, v]) => `  Header always set ${n} "${apacheWert(v)}"`),
    '  Header always unset X-Powered-By',
    '  Header always set Cache-Control "no-cache" "expr=%{CONTENT_TYPE} =~ m#^text/html#"',
    ...cache.map((z) => z.split('\n').map((l) => '  ' + l).join('\n')),
    '</IfModule>',
    '# Vorkomprimierte Varianten: Vary immer; Content-Encoding nur an .br bzw. .gz (der Typ kommt aus der Endung des Originals, s. o.).',
    '<IfModule mod_headers.c>',
    `  <FilesMatch "\\.(${TEXT})$">`,
    '    Header always merge Vary Accept-Encoding',
    '  </FilesMatch>',
    `  <FilesMatch "\\.(${TEXT})\\.br$">`,
    '    Header always set Content-Encoding br',
    '    Header always merge Vary Accept-Encoding',
    '  </FilesMatch>',
    `  <FilesMatch "\\.(${TEXT})\\.gz$">`,
    '    Header always set Content-Encoding gzip',
    '    Header always merge Vary Accept-Encoding',
    '  </FilesMatch>',
    '</IfModule>',
    '<IfModule mod_setenvif.c>',
    '  # Keine Doppelkompression durch mod_deflate oder mod_brotli: am Dateinamen der Variante (E=… an den Rewrite-Regeln',
    '  # hieße in .htaccess nach dem internen Umweg REDIRECT_… und wirkte nicht). mod_setenvif ist Apache-Standard.',
    '  SetEnvIfNoCase Request_URI \\.(br|gz)$ no-gzip no-brotli dont-vary',
    '</IfModule>',
    '<IfModule mod_rewrite.c>',
    '  RewriteEngine On',
    '  RewriteCond %{HTTPS} !=on',
    `  RewriteRule ^ https://${host}%{REQUEST_URI} [R=301,L,NE]`,
    `  RewriteCond %{HTTP_HOST} !^${host.replace(/\./g, '\\.')}$ [NC]`,
    `  RewriteRule ^ https://${host}%{REQUEST_URI} [R=301,L,NE]`,
    '  RewriteRule (^|/)\\.(?!well-known/) - [R=404,L]',
    ...weiterleitungen.map((w) => `  RewriteRule ^${w.von.slice(1).replace(/[.+?()[\]{}|^$\\]/g, '\\$&')}$ https://${host}${w.nach} [R=301,L]`),
    '  # Vorkomprimierte Varianten: .br/.gz nie direkt anfordern – ausgeliefert werden sie nur über die Regeln unten.',
    '  # Geprüft wird der dekodierte Pfad ohne Query; interne Umwege (eigene Rewrites, ErrorDocument) tragen REDIRECT_STATUS.',
    '  RewriteCond %{ENV:REDIRECT_STATUS} ^$',
    '  RewriteRule \\.(br|gz)$ - [R=404,L]',
    '  # Vorkomprimiert ausliefern, nur bei angenommener Kodierung und vorhandener Datei; br vor gzip',
    `  RewriteCond %{HTTP:Accept-Encoding} ${annahme('br')} [NC]`,
    '  RewriteCond %{REQUEST_FILENAME}.br -f',
    `  RewriteRule ^(.+\\.(${TEXT}))$ $1.br [L]`,
    `  RewriteCond %{HTTP:Accept-Encoding} ${annahme('gzip')} [NC]`,
    '  RewriteCond %{REQUEST_FILENAME}.gz -f',
    `  RewriteRule ^(.+\\.(${TEXT}))$ $1.gz [L]`,
    '  # Verzeichnis-Adressen (/pfad/ → index.html) ausdrücklich, statt sich auf die Unteranfrage von mod_dir zu verlassen',
    `  RewriteCond %{HTTP:Accept-Encoding} ${annahme('br')} [NC]`,
    '  RewriteCond %{REQUEST_FILENAME} -d',
    '  RewriteCond %{REQUEST_FILENAME}/index.html.br -f',
    '  RewriteRule ^(.*/)?$ $1index.html.br [L]',
    `  RewriteCond %{HTTP:Accept-Encoding} ${annahme('gzip')} [NC]`,
    '  RewriteCond %{REQUEST_FILENAME} -d',
    '  RewriteCond %{REQUEST_FILENAME}/index.html.gz -f',
    '  RewriteRule ^(.*/)?$ $1index.html.gz [L]',
    '</IfModule>',
  ].join('\n') + '\n';
}

export function nginx(host, weiterleitungen = []) {
  if (!/^[a-z0-9.-]+$/.test(host)) throw new Error(`Host ungültig: ${host}`);
  const k = kopfzeilen();
  const kopf = Object.entries(k).map(([n, v]) => `add_header ${n} "${v}" always;`).join('\n') + '\n';
  const cacheBloecke = CACHE.filter((c) => c.muster.endsWith('/*') && c.muster !== '/*').map((c) => {
    const pfad = c.muster.slice(0, -1);
    return `    location ${pfad} {\n        include snippets/sicherheit-header.conf;\n        add_header Cache-Control "${c.wert}" always;\n${Object.entries(c.extra || {}).map(([n, v]) => `        add_header ${n} "${v}" always;\n`).join('')}        try_files $uri =404;\n    }`;
  });
  const site = `# Erzeugt von bau/bauen.mjs – Vorlage, Zertifikatspfade ergänzen.
server {
    listen 80 default_server;
    listen 443 ssl default_server;
    ssl_reject_handshake on;
    return 444;
}
server {
    listen 80;
    server_name ${host};
    return 301 https://${host}$request_uri;
}
server {
    listen 443 ssl;
    http2 on;
    server_name ${host};
    root /var/www/${host};
    index index.html;
    server_tokens off;
    absolute_redirect off;
    charset utf-8;
    # Vorkomprimiert (vorkomprimieren): .gz wird ausgeliefert, wenn der Client gzip annimmt.
    # gzip_static braucht das Modul ngx_http_gzip_static_module (nginx -V prüfen); gzip_vary setzt Vary: Accept-Encoding.
    gzip_static on;
    gzip_vary on;
    # brotli_static on;  – nur mit dem Zusatzmodul ngx_brotli (nicht im Standard-nginx) und passenden brotli_types
    include snippets/sicherheit-header.conf;
    error_page 404 /404.html;
    location ~ /\\.(?!well-known/) { return 404; }
    # Vorkomprimierte Varianten nie direkt anfordern (wie Apache): ausgeliefert werden sie nur über gzip_static
    location ~ \\.(br|gz)$ { return 404; }
${cacheBloecke.join('\n')}
${weiterleitungen.map((w) => `    location = ${w.von} { return 301 https://${host}${w.nach}; }`).join('\n')}
    location / {
        include snippets/sicherheit-header.conf;
        add_header Cache-Control "no-cache" always;
        try_files $uri $uri/ =404;
    }
}
`;
  return { 'sicherheit-header.conf': kopf, 'site.conf': site };
}
