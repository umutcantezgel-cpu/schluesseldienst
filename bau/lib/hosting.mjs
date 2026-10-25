// Erzeugt Hoster-Konfigurationen aus src/konfig/sicherheit.mjs (eine Quelle, gleiche Header überall).
// Weiterleitungen: nur geprüfte Pfade, Ziele mit fest eingetragenem Host (Schutz vor offenen Weiterleitungen).
import { kopfzeilen, CACHE, MIME, SICHERER_PFAD } from '../../src/konfig/sicherheit.mjs';

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

const apacheWert = (v) => v.replace(/"/g, '\\"');

export function headersDatei(weiterleitungen = []) {
  const k = kopfzeilen();
  const zeilen = ['/*', ...Object.entries(k).map(([n, v]) => `  ${n}: ${v}`)];
  for (const c of CACHE.filter((c) => c.muster !== '/*')) {
    zeilen.push(c.muster, `  Cache-Control: ${c.wert}`, ...Object.entries(c.extra || {}).map(([n, v]) => `  ${n}: ${v}`));
  }
  return { '_headers': zeilen.join('\n') + '\n', '_redirects': weiterleitungen.map((w) => `${w.von} ${w.nach} 301`).join('\n') + (weiterleitungen.length ? '\n' : '') };
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
    'AddCharset utf-8 .html .css .js .json .xml .txt .webmanifest .svg',
    '<IfModule mod_headers.c>',
    ...Object.entries(k).map(([n, v]) => `  Header always set ${n} "${apacheWert(v)}"`),
    '  Header always unset X-Powered-By',
    '  Header always set Cache-Control "no-cache" "expr=%{CONTENT_TYPE} =~ m#^text/html#"',
    ...cache.map((z) => z.split('\n').map((l) => '  ' + l).join('\n')),
    '</IfModule>',
    '<IfModule mod_rewrite.c>',
    '  RewriteEngine On',
    '  RewriteCond %{HTTPS} !=on',
    `  RewriteRule ^ https://${host}%{REQUEST_URI} [R=301,L,NE]`,
    `  RewriteCond %{HTTP_HOST} !^${host.replace(/\./g, '\\.')}$ [NC]`,
    `  RewriteRule ^ https://${host}%{REQUEST_URI} [R=301,L,NE]`,
    '  RewriteRule (^|/)\\.(?!well-known/) - [R=404,L]',
    ...weiterleitungen.map((w) => `  RewriteRule ^${w.von.slice(1).replace(/[.+?()[\]{}|^$\\]/g, '\\$&')}$ https://${host}${w.nach} [R=301,L]`),
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
    include snippets/sicherheit-header.conf;
    error_page 404 /404.html;
    location ~ /\\.(?!well-known/) { return 404; }
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
