// Sicherheits-Linter über die gesamte Ausgabe (S01–S21). Jede Verletzung ist ein Fehler.
// Arbeitet mit regulären Ausdrücken auf dem eigenen, wohlgeformten HTML des Generators.
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { cspText } from '../../src/konfig/sicherheit.mjs';
import { istPlatzhalter } from '../lib/platzhalter.mjs';

export const name = 'sicherheit';

const sha384 = (buf) => 'sha384-' + createHash('sha384').update(buf).digest('base64');
const sha256 = (s) => createHash('sha256').update(s).digest('hex');
const ERLAUBTE_ENDUNGEN = /\.(html|css|js|json|xml|txt|woff2|png|jpg|webp|avif|svg|webmanifest|ico)$/;
const GEHEIM = [
  ['google-api-schluessel', /AIza[0-9A-Za-z_-]{35}/],
  ['site-verification', /google-site-verification/i],
  ['analytics-kennung', /\b(G-[A-Z0-9]{6,}|UA-\d{4,}-\d+|GTM-[A-Z0-9]{4,})\b/],
  ['aws-schluessel', /AKIA[0-9A-Z]{16}/],
  ['privater-schluessel', /-----BEGIN [A-Z ]*PRIVATE KEY/],
  ['github-token', /gh[pousr]_[A-Za-z0-9]{30,}/],
  ['jwt', /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\./],
];
const JS_VERBOTEN = [/\binnerHTML\b/, /\bouterHTML\b/, /insertAdjacentHTML/, /document\.write/, /\beval\s*\(/, /new\s+Function\s*\(/, /\bimport\s*\(/, /setTimeout\s*\(\s*['"`]/, /setInterval\s*\(\s*['"`]/];

let kennungen = null;
async function kennungenLaden(wurzel) {
  if (kennungen) return kennungen;
  try {
    const fp = JSON.parse(await readFile(join(wurzel, 'bau/pruefen/fingerabdruck.json'), 'utf8'));
    const k = fp.kennungen || {};
    kennungen = { alle: new Set([...(k.domains || []), ...(k.namen || []), ...(k.telefon || []), ...(k.schluessel || [])]) };
  } catch { kennungen = { alle: new Set() }; }
  return kennungen;
}

function sichtbarerText(html) {
  return html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ');
}

/** Prüft Text auf Wettbewerber-Kennungen (nur Hash-Vergleich, keine Klartexte im Repo). */
function kennungsTreffer(text, set) {
  if (!set.size) return [];
  const treffer = [];
  const klein = text.toLocaleLowerCase('de');
  for (const m of klein.matchAll(/\b(?:www\.)?[a-z0-9-]+\.(?:de|com|net|eu)\b/g)) if (set.has(sha256(m[0])) || set.has(sha256(m[0].replace(/^www\./, '')))) treffer.push('domain');
  const ziffern = text.replace(/\+49/g, '0').replace(/[\s\-/()]/g, '');
  for (const m of ziffern.matchAll(/\d{9,}/g)) if (set.has(sha256(m[0]))) treffer.push('telefon');
  const woerter = klein.split(/[^a-zäöüß0-9.]+/).filter(Boolean);
  for (let i = 0; i < woerter.length; i++) {
    for (const n of [1, 2, 3]) {
      if (i + n > woerter.length) break;
      const phrase = woerter.slice(i, i + n).join(' ');
      if (phrase.length >= 5 && set.has(sha256(phrase))) treffer.push('name');
    }
  }
  return treffer;
}

export async function pruefe(ctx) {
  const befunde = [];
  const f = (regel, datei, meldung, schwere = 'fehler') => befunde.push({ regel: `sicherheit/${regel}`, schwere, datei, meldung });
  const metaCsp = cspText({ meta: true });
  const { quellen } = ctx.konfig;
  const erlaubteHosts = new Set(quellen?.hosts || []);
  const email = istPlatzhalter(ctx.konfig.betrieb.email) ? null : ctx.konfig.betrieb.email;
  const { alle: kennungSet } = await kennungenLaden(ctx.wurzel);
  const sriCache = new Map();
  const sriVon = async (pfad) => {
    if (!sriCache.has(pfad)) { try { sriCache.set(pfad, sha384(await readFile(join(ctx.dist, pfad)))); } catch { sriCache.set(pfad, null); } }
    return sriCache.get(pfad);
  };
  const istOrt = (p) => p.startsWith('/schluesseldienst-');
  let ortZaehler = 0;

  for (const s of ctx.seiten) {
    const h = s.html;
    const d = s.datei;
    // S11 Dokumentkopf
    if (!/^<!doctype html>\s*<html lang="de"/i.test(h)) f('S11-lang', d, 'Dokument beginnt nicht mit <!doctype html><html lang="de">');
    const kopf = h.slice(0, h.indexOf('</head>'));
    if (!/^<!doctype html>\s*<html[^>]*>\s*<head>\s*<meta charset="utf-8">/i.test(h)) f('S11-charset', d, 'meta charset ist nicht das erste Element im <head>');
    if (/maximum-scale|user-scalable\s*=\s*no/i.test(kopf)) f('S11-zoom', d, 'Viewport verhindert Zoom');
    // S08 Meta-CSP direkt nach charset und identisch
    const m = kopf.match(/<meta charset="utf-8">\s*<meta http-equiv="Content-Security-Policy" content="([^"]*)">/i);
    if (!m) f('S08-meta-csp', d, 'Meta-CSP fehlt oder steht nicht direkt nach charset');
    else if (m[1].replace(/&#39;/g, "'") !== metaCsp) f('S08-meta-csp', d, 'Meta-CSP weicht von src/konfig/sicherheit.mjs ab');
    // S01 Skripte
    for (const t of h.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
      const attr = t[1];
      const typ = (attr.match(/\btype="([^"]+)"/) || [])[1];
      if (typ === 'application/ld+json' || typ === 'application/json') {
        if (/<\/|<!--/.test(t[2])) f('S01-datenblock', d, 'Datenblock enthält „</“ oder „<!--“');
        continue;
      }
      if (!/\bsrc="/.test(attr)) { f('S01-inline-skript', d, 'Inline-Skript gefunden'); continue; }
      const src = attr.match(/\bsrc="([^"]+)"/)[1];
      const integ = (attr.match(/\bintegrity="([^"]+)"/) || [])[1];
      if (!integ) f('S02-sri', d, `Skript ohne integrity: ${src}`);
      else if (src.startsWith('/') && (await sriVon(src)) !== integ) f('S02-sri', d, `SRI passt nicht zu ${src}`);
    }
    for (const l of h.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)) {
      const href = (l[0].match(/href="([^"]+)"/) || [])[1];
      const integ = (l[0].match(/integrity="([^"]+)"/) || [])[1];
      if (!integ) f('S02-sri', d, `Stylesheet ohne integrity: ${href}`);
      else if (href?.startsWith('/') && (await sriVon(href)) !== integ) f('S02-sri', d, `SRI passt nicht zu ${href}`);
    }
    // S03/S04/S07/S13
    for (const t of h.matchAll(/<[a-z][a-z0-9-]*\b[^>]*>/gi)) {
      const tag = t[0];
      if (/\son[a-z]+\s*=/i.test(tag)) f('S03-ereignis-attribut', d, `on*-Attribut: ${tag.slice(0, 80)}`);
      if (/\sstyle\s*=/i.test(tag)) f('S04-style-attribut', d, `style-Attribut: ${tag.slice(0, 80)}`);
      if (/\s(href|src|action|formaction|srcset|xlink:href|poster|data)\s*=\s*"\s*(javascript|data|vbscript):/i.test(tag)) f('S05-gefaehrliches-schema', d, tag.slice(0, 80));
      if (/^<(iframe|object|embed|frame|frameset|base|applet)\b/i.test(tag)) f('S07-einbettung', d, tag.slice(0, 60));
      if (/^<meta\b[^>]*http-equiv="refresh"/i.test(tag)) f('S07-meta-refresh', d, tag.slice(0, 60));
      if (/\btarget="_blank"/.test(tag) && !/\brel="[^"]*noopener/.test(tag)) f('S17-blank-ohne-noopener', d, tag.slice(0, 80));
    }
    if (/<style\b/i.test(h)) f('S04-style-element', d, '<style>-Element gefunden');
    if (/<!--/.test(h.replace(/<script type="application\/(ld\+)?json"[\s\S]*?<\/script>/g, ''))) f('S13-kommentar', d, 'HTML-Kommentar in der Ausgabe');
    // S06 Ressourcen und externe Links
    for (const r of h.matchAll(/<(?:img|source|script|link|video|audio|track|use)\b[^>]*\s(?:src|href|srcset)="([^"]+)"[^>]*>/g)) {
      if (/^<link\b[^>]*rel="(canonical|alternate)"/.test(r[0])) continue;
      const u = r[1];
      if (!(u.startsWith('/') || u.startsWith('#')) || u.startsWith('//')) f('S06-fremde-ressource', d, `Ressource nicht gleicher Herkunft: ${u}`);
    }
    for (const a of h.matchAll(/<a\b[^>]*\shref="([^"]+)"[^>]*>/g)) {
      const u = a[1];
      if (/^https?:\/\//.test(u) && !u.startsWith(ctx.basisUrl)) {
        let host = null;
        try { host = new URL(u).host; } catch { /* ungültig */ }
        if (!host || !erlaubteHosts.has(host)) f('S06-externer-link', d, `Externer Link nicht in quellen.mjs: ${u}`);
        if (!/\brel="[^"]*noopener[^"]*noreferrer|\brel="[^"]*noreferrer[^"]*noopener/.test(a[0])) f('S06-externer-link-rel', d, `Externer Link ohne rel="noopener noreferrer": ${u}`);
        if (u.startsWith('http://')) f('S19-http', d, `Unverschlüsselter Link: ${u}`);
      }
      if (u.startsWith('tel:') && !/^tel:\+49\d{6,13}$/.test(u)) f('S18-tel', d, `tel:-Link im falschen Format: ${u}`);
      if (u.startsWith('mailto:') && email && !u.startsWith(`mailto:${email}`)) f('S18-mailto', d, `mailto: an fremde Adresse: ${u}`);
    }
    // S12 Formulare
    for (const fo of h.matchAll(/<form\b[^>]*>/g)) {
      if (!/\saction="mailto:/.test(fo[0]) || !/\smethod="get"/i.test(fo[0])) f('S12-formular', d, `Formular nicht mailto/get: ${fo[0]}`);
    }
    // S19 http:// (außer XML-Namensräume und lokaler Basis-URL in Vorschau/Messung)
    for (const u of h.matchAll(/http:\/\/[^\s"'<>]+/g)) if (!u[0].startsWith(ctx.basisUrl) && !/^http:\/\/www\.w3\.org\//.test(u[0])) f('S19-http', d, `http:// gefunden: ${u[0].slice(0, 60)}`);
    // S09 Geheimnisse und Wettbewerber-Kennungen
    for (const [regel, re] of GEHEIM) if (re.test(h)) f(`S09-${regel}`, d, 'Geheimnis-Muster in der Ausgabe');
    if (!istOrt(s.pfad) || ctx.modus === 'release' || ortZaehler++ < 300) {
      const t = kennungsTreffer(sichtbarerText(h) + ' ' + (h.match(/href="[^"]*"/g) || []).join(' '), kennungSet);
      if (t.length) f('S09-wettbewerber', d, `Wettbewerber-Kennung gefunden (${[...new Set(t)].join(', ')})`);
    }
    // S10 Platzhalter / S21 noindex im Release
    const p = (h.match(/class="platzhalter"/g) || []).length;
    if (p) befunde.push({ regel: 'sicherheit/S10-platzhalter', schwere: ctx.modus === 'release' ? 'fehler' : 'info', datei: d, meldung: `${p} Platzhalter` });
    if (ctx.modus === 'release' && s.indexierbar && /<meta name="robots" content="noindex/.test(h)) f('S21-noindex', d, 'Indexierbare Seite trägt noindex');
  }

  // S14 Datei-Allowlist, S15 Daten, S20 JS-Regeln, CSS ohne data:-URLs
  for (const datei of ctx.dateien) {
    const basis = datei.split('/').pop();
    const erlaubtePunkt = ['.htaccess', '_headers', '_redirects'].includes(basis) || datei.startsWith('/.well-known/');
    if (!erlaubtePunkt && (basis.startsWith('.') || !ERLAUBTE_ENDUNGEN.test(basis)) && basis !== 'OFL.txt') f('S14-datei', datei, 'Datei nicht auf der Allowlist');
    if (/_werkstatt|richter|adam|\/src\/|\.map$|\.mjs$|\.md$/i.test(datei)) f('S14-datei', datei, 'Unzulässiger Pfad in der Ausgabe');
    if (datei.startsWith('/daten/') && datei.endsWith('.json')) {
      try { JSON.parse(await readFile(join(ctx.dist, datei), 'utf8')); } catch { f('S15-daten', datei, 'JSON nicht lesbar'); }
    }
    if (datei.endsWith('.js')) {
      const js = await readFile(join(ctx.dist, datei), 'utf8');
      for (const re of JS_VERBOTEN) if (re.test(js)) f('S20-js', datei, `Verbotenes Muster ${re}`);
      for (const fe of js.matchAll(/fetch\(\s*(['"`])([^'"`]*)/g)) if (!fe[2].startsWith('/daten/')) f('S20-fetch', datei, `fetch auf ${fe[2]}`);
      if (/location\.(assign|replace|href\s*=)/.test(js) && !/mailto/.test(js)) f('S20-navigation', datei, 'Navigation per location außerhalb des Mailto-Moduls');
    }
    if (datei.endsWith('.css')) {
      const css = await readFile(join(ctx.dist, datei), 'utf8');
      if (/url\(\s*["']?data:/i.test(css)) f('S04-css-data', datei, 'data:-URL in CSS');
      if (/@import\s/.test(css)) f('S04-css-import', datei, '@import in CSS');
    }
    if (/\.(html|css|js|json|xml|txt|svg|webmanifest)$/.test(datei) || ['_headers', '_redirects', '.htaccess'].includes(basis)) {
      const text = await readFile(join(ctx.dist, datei), 'utf8');
      for (const [regel, re] of GEHEIM) if (re.test(text)) f(`S09-${regel}`, datei, 'Geheimnis-Muster in der Ausgabe');
    }
  }
  return befunde;
}
