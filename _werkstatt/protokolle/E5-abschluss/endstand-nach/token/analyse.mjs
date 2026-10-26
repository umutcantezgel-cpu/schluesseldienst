// Auswertung der Token-Stichprobe (Z-03): je Deklaration Literale außerhalb var(--…) nach K-004/K-005,
// zusätzlich token.mjs (pruefeCss, nur Lesen) als Gegenprobe. Schreibt nur in den Prüfordner.
import { readFile, writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import { pruefeCss } from '/home/user/schluesseldienst/bau/pruefen/token.mjs';

const CSS = '/home/user/schluesseldienst/src/assets/css/';
const ORD = '/home/user/schluesseldienst/.cache/endstand-nach/';
const proto = JSON.parse(await readFile(ORD + 'token/stichprobe-protokoll.json', 'utf8'));

const SVG = new Set(['stroke-width', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-miterlimit', 'opacity', 'fill-opacity', 'stroke-opacity', 'flood-opacity', 'stop-opacity']);
const FAKTOR = new Set(['flex', 'flex-grow', 'flex-shrink', 'scale', 'aspect-ratio']);
const MATHE = new Set(['calc', 'min', 'max', 'clamp', 'minmax']);
const FARBFN = new Set(['rgb', 'rgba', 'hsl', 'hsla', 'oklch', 'lab', 'lch', 'hwb', 'color-mix']);
const KURVEFN = new Set(['cubic-bezier', 'linear']);
const SKALA = new Set(['scale', 'scaleX', 'scaleY']);
const VH_VW = new Set(['vh', 'vw', 'svh', 'svw', 'dvh', 'dvw', 'lvh', 'lvw']);
const LAENGE_VERBOTEN = new Set(['em', 'rem', 'pt', 'ch', 'ex', 'cm', 'mm', 'in', 'pc', 'q', 'vmin', 'vmax']);
const TOK = /(#[0-9a-fA-F]{3,8}(?![\w-]))|("_*"|'_*')|(?<![\w.#-])(-?(?:\d+\.?\d*|\.\d+))(%|[a-zA-Z]+)?|(?<![\w-])([a-zA-Z][\w-]*)/g;

function maskiere(q) {
  return q
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(?<![\w-])url\([^)]*\)/gi, (m) => m.replace(/[^\n]/g, '_'))
    .replace(/"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/g, (m) => m[0] + '_'.repeat(m.length - 2) + m[0]);
}

function bloecke(masked) {
  const out = [];
  let start = 0;
  for (let i = 0; i <= masked.length; i++) {
    const c = masked[i];
    if (c !== '{' && c !== ';' && c !== '}' && i < masked.length) continue;
    const seg = masked.slice(start, i);
    const k = seg.search(/\S/);
    if (k >= 0) {
      if (c === '{') {
        if (seg[k] === '@') out.push({ art: 'kopf', text: seg.slice(k).trim(), offset: start + k });
      } else if (seg[k] !== '@') {
        const d = seg.indexOf(':');
        if (d > k) out.push({ art: 'dekl', eig: seg.slice(k, d).trim().toLowerCase(), wert: masked.slice(start + d + 1, i), offset: start + d + 1 });
      }
    }
    start = i + 1;
  }
  return out;
}

const zeileVon = (text, offset) => text.slice(0, offset).split('\n').length;

function kontext(w, pos) {
  const stapel = [];
  for (const m of w.slice(0, pos).matchAll(/([a-zA-Z][\w-]*)?\(|\)/g)) {
    if (m[0] === ')') stapel.pop(); else stapel.push(m[1] || '');
  }
  return stapel;
}

function pruefeWert(eig, wertM, offset0, voll) {
  let w = wertM.replace(/--[\w-]+/g, (m) => '_'.repeat(m.length));
  let vorher;
  do { vorher = w; w = w.replace(/var\([^()]*\)/gi, (m) => ' '.repeat(m.length)); } while (w !== vorher);
  const out = [];
  const add = (klasse, grund, text, pos) => out.push({ zeile: zeileVon(voll, offset0 + pos), eig, text, klasse, grund });
  for (const m of w.matchAll(TOK)) {
    const pos = m.index;
    const [ganz, hex, str, num, unit, ident] = m;
    if (hex) { add('unerlaubt', 'Hex-Farbe (Farbtoken nutzen)', ganz, pos); continue; }
    if (str) { add('erlaubt', 'Zeichenkette (content, Bereichsnamen)', ganz, pos); continue; }
    if (num !== undefined) {
      const stapel = kontext(w, pos);
      const inMath = stapel.some((f) => MATHE.has(f));
      const z = Number(num);
      if (!unit) {
        if (z === 0) add('erlaubt', '0 ohne Einheit', ganz, pos);
        else if (SVG.has(eig)) add('erlaubt', 'Zahl in SVG- oder Deckkraft-Eigenschaft', ganz, pos);
        else if (stapel.some((f) => SKALA.has(f))) add('erlaubt', 'Faktor in scale()', ganz, pos);
        else if (stapel.includes('repeat')) add('erlaubt', 'Spaltenanzahl in repeat()', ganz, pos);
        else if (FAKTOR.has(eig)) add('erlaubt', 'Faktor (flex/scale)', ganz, pos);
        else if (inMath) add('erlaubt', 'Faktor in Rechenausdruck (calc/minmax)', ganz, pos);
        else if (eig === 'z-index') add('grenzfall', 'z-index-Zahl (kein Token, kein Faktor)', ganz, pos);
        else add('unerlaubt', 'Zahl ohne Einheit außerhalb SVG/Deckkraft/Faktor', ganz, pos);
      } else {
        const u = unit.toLowerCase();
        if (u === '%') add('erlaubt', 'Prozent', ganz, pos);
        else if (u === 'px') {
          if (['0', '1', '-1'].includes(num)) add('erlaubt', 'Null bzw. Haarlinie (0px, 1px, -1px)', ganz, pos);
          else add('unerlaubt', 'px-Wert außer 0/1/-1 (Abstands- oder Größentoken nutzen)', ganz, pos);
        } else if (u === 'fr') {
          if (num === '1') add('erlaubt', '1fr (K-004)', ganz, pos);
          else add('grenzfall', 'Fraktion ungleich 1fr (K-004 nennt nur 1fr)', ganz, pos);
        } else if (VH_VW.has(u)) {
          if (num === '100') add('erlaubt', '100vh/100vw (token.mjs)', ganz, pos);
          else add('unerlaubt', 'Viewport-Einheit außer 100', ganz, pos);
        } else if (u === 'ms' || u === 's') add('unerlaubt', 'Zeit-Literal (Dauertoken nutzen)', ganz, pos);
        else if (u === 'em' || LAENGE_VERBOTEN.has(u)) add('unerlaubt', `${u} in Deklaration (Token nutzen; em nur in @media/@container)`, ganz, pos);
        else add('grenzfall', `Einheit ${u} ohne Regelbezug`, ganz, pos);
      }
      continue;
    }
    if (ident) {
      if (w[pos + ganz.length] === '(') {
        if (FARBFN.has(ident)) add('unerlaubt', 'Farbfunktion (Farbtoken nutzen)', ident, pos);
        else if (KURVEFN.has(ident)) add('unerlaubt', 'Kurvenfunktion (Kurventoken nutzen)', ident, pos);
        continue;
      }
      add('erlaubt', 'Schlüsselwort', ganz, pos);
    }
  }
  if (eig === 'font-family' && !/var\(/i.test(wertM)) add('unerlaubt', 'font-family ohne var()', wertM.trim(), 0);
  return out;
}

function kopfPruefen(text, offset0, voll) {
  const art = /^@(media|container)/i.exec(text)?.[1]?.toLowerCase();
  if (!art) return [];
  const out = [];
  for (const m of text.matchAll(/(-?\d+(?:\.\d+)?|\.\d+)(em|px|rem)/gi)) {
    const zahl = m[1];
    const einh = m[2].toLowerCase();
    const z = Number(zahl);
    const vorher = text.slice(0, m.index);
    let klasse; let grund;
    if (einh === 'em' && art === 'container') { klasse = 'erlaubt'; grund = 'em in @container (token.mjs: alle em erlaubt)'; }
    else if (einh === 'em' && art === 'media' && [30, 48, 64, 80].includes(z)) { klasse = 'erlaubt'; grund = 'em-Breakpoint in @media (K-005)'; }
    else if (einh === 'em' && art === 'media' && z === 40 && /(min|max)-height\s*:\s*$/i.test(vorher)) { klasse = 'erlaubt'; grund = 'Höhen-Breakpoint 40em für Szenen (K-005)'; }
    else { klasse = 'unerlaubt'; grund = `Wert ${zahl}${einh} in @${art} (kein Breakpoint aus K-005)`; }
    out.push({ zeile: zeileVon(voll, offset0 + m.index), ort: 'at-regel', eig: `@${art}`, text: zahl + einh, klasse, grund });
  }
  return out;
}

const gesamt = { deklarationen: 0, varVerweise: 0, varMitFallback: 0, erlaubteLiterale: 0, unerlaubteWerte: 0, grenzfaelle: 0, tokenJsBefunde: 0 };
const erlaubtNachGrund = {};
const jeDatei = [];
const unerlaubte = [];
const grenzfaelle = [];
const tokenJsListe = [];

for (const d of proto.gezogen) {
  const raw = await readFile(CSS + d, 'utf8');
  const voll = maskiere(raw);
  const lits = [];
  let dekl = 0; let varAnz = 0; let fb = 0;
  for (const b of bloecke(voll)) {
    if (b.art === 'kopf') { lits.push(...kopfPruefen(b.text, b.offset, voll)); continue; }
    dekl++;
    varAnz += (b.wert.match(/var\(/gi) || []).length;
    if (/var\([^()]*,/i.test(b.wert)) fb++;
    lits.push(...pruefeWert(b.eig, b.wert, b.offset, voll));
  }
  const tj = pruefeCss(raw, 'src/assets/css/' + d);
  const erl = lits.filter((l) => l.klasse === 'erlaubt');
  const unerl = lits.filter((l) => l.klasse === 'unerlaubt');
  const gr = lits.filter((l) => l.klasse === 'grenzfall');
  for (const l of erl) erlaubtNachGrund[l.grund] = (erlaubtNachGrund[l.grund] || 0) + 1;
  for (const l of unerl) unerlaubte.push({ beleg: CSS + d + ':' + l.zeile, eigenschaft: l.eig, literal: l.text, grund: l.grund });
  for (const l of gr) grenzfaelle.push({ beleg: CSS + d + ':' + l.zeile, eigenschaft: l.eig, literal: l.text, grund: l.grund });
  for (const t of tj) tokenJsListe.push({ beleg: CSS + d + ':' + t.datei.split(':').pop(), regel: t.regel, schwere: t.schwere, meldung: t.meldung });
  gesamt.deklarationen += dekl; gesamt.varVerweise += varAnz; gesamt.varMitFallback += fb;
  gesamt.erlaubteLiterale += erl.length; gesamt.unerlaubteWerte += unerl.length; gesamt.grenzfaelle += gr.length; gesamt.tokenJsBefunde += tj.length;
  jeDatei.push({
    datei: CSS + d,
    bytes: Buffer.byteLength(raw, 'utf8'),
    deklarationen: dekl,
    varVerweise: varAnz,
    erlaubteLiterale: erl.length,
    unerlaubteWerte: unerl.length,
    grenzfaelle: gr.length,
    tokenJsBefunde: tj.length,
    literale: lits.map((l) => ({ beleg: CSS + d + ':' + l.zeile, ort: l.ort || 'deklaration', eigenschaft: l.eig, literal: l.text, klasse: l.klasse, grund: l.grund })),
  });
}

const ausgabe = {
  werkzeug: 'token-stichprobe (eigene Deklarationsauswertung nach K-004/K-005; Gegenprobe token.mjs pruefeCss, nur gelesen)',
  stichprobe: { protokoll: ORD + 'token/stichprobe-protokoll.json', saat: proto.saat, grundgesamtheit: proto.anzahl_grundgesamtheit, gezogen: proto.gezogen.map((d) => CSS + d) },
  gesamt: { ...gesamt, erlaubteLiteraleNachGrund: erlaubtNachGrund },
  unerlaubteWerte: unerlaubte,
  grenzfaelle,
  tokenJsBefunde: tokenJsListe,
  jeDatei,
};
await writeFile(ORD + 'token-stichprobe.json', JSON.stringify(ausgabe, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ gesamt: ausgabe.gesamt, je: jeDatei.map((j) => ({ datei: j.datei.split('/css/')[1], dekl: j.deklarationen, erlaubt: j.erlaubteLiterale, unerlaubt: j.unerlaubteWerte, grenz: j.grenzfaelle, tokenJs: j.tokenJsBefunde })), unerlaubte, grenzfaelle, tokenJsListe }, null, 1));
