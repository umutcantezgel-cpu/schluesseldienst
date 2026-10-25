// Token-Prüfer (KERN K-005): Werte in den Quelldateien nur über Designtokens aus src/assets/css/token.css.
// Geprüft werden src/assets/css/**/*.css außer token.css und schriften.css sowie src/vorlagen/**/*.mjs
// und src/inhalte/**/*.mjs. Jeder Befund trägt Datei:Zeile der Quelldatei.
import { readdir, readFile } from 'node:fs/promises';
import { basename, join, relative, sep } from 'node:path';

export const name = 'token';

const CSS_AUSGENOMMEN = new Set(['token.css', 'schriften.css']);
const BREAKPOINTS_EM = new Set([30, 48, 64, 80]);
const CSS_GLOBAL = /^\s*(inherit|initial|unset|revert|revert-layer)\s*$/i;

// Benannte CSS-Farben. Nicht enthalten sind transparent, currentColor, inherit und die Systemfarben
// (Canvas, ButtonText, Highlight …), die der Auftrag ausdrücklich erlaubt.
const BENANNTE_FARBEN = (
  'aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown ' +
  'burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan ' +
  'darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid ' +
  'darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet ' +
  'deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ' +
  'ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki ' +
  'lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow ' +
  'lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray ' +
  'lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine ' +
  'mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise ' +
  'mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab ' +
  'orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru ' +
  'pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen ' +
  'seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle ' +
  'tomato turquoise violet wheat white whitesmoke yellow yellowgreen'
).split(' ');
const BENANNT_ALLE = new RegExp(String.raw`(?<![\w-])(${BENANNTE_FARBEN.join('|')})(?![\w-])`, 'gi');
const BENANNT_EIN = new RegExp(BENANNT_ALLE.source, 'i');
const HEX = /#[0-9a-f]{3,8}(?![\w-])/gi;
const FARBFUNKTION = /(?<![\w-])(rgba?|hsla?|oklch|color-mix)\(/gi;
const KURVE = /(?<![\w-])(cubic-bezier|linear)\(/gi;
// Zahl mit Einheit; die Zahl darf nicht Teil eines Namens, einer Hex-Farbe oder eines Dezimalbruchs sein.
const EINHEIT = /(?<![\w.#-])(-?(?:\d+(?:\.\d+)?|\.\d+))(px|rem|em|pt|vmin|vmax|vw|vh|svw|svh|dvw|dvh|lvw|lvh|ch|ex|cm|mm|in|pc|q|ms|s)(?![\w%-])/gi;
const JS_TEILE = /\/\*[\s\S]*?\*\/|\/\/[^\n]*|'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\[\s\S])*`/g;

/** Ersetzt Kommentare, url()-Inhalte und Zeichenketten durch gleich lange Platzhalter; Zeilenumbrüche bleiben. */
function maskiereCss(quelle) {
  return quelle
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(?<![\w-])url\([^)]*\)/gi, (m) => m.replace(/[^\n]/g, '_'))
    .replace(/"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/g, (m) => m[0] + '_'.repeat(m.length - 2) + m[0]);
}

/** Liefert eine Funktion, die einen Zeichen-Offset in die Zeilennummer (1-basiert) umrechnet. */
function zeilenIndex(text) {
  const anfaenge = [0];
  for (let i = 0; i < text.length; i++) if (text[i] === '\n') anfaenge.push(i + 1);
  return (offset) => {
    let lo = 0;
    let hi = anfaenge.length - 1;
    while (lo < hi) {
      const mitte = (lo + hi + 1) >> 1;
      if (anfaenge[mitte] <= offset) lo = mitte; else hi = mitte - 1;
    }
    return lo + 1;
  };
}

/** Inhalt einer Klammer ab `start` (nach der öffnenden Klammer), tiefenbewusst. */
function klammerInhalt(text, start) {
  let tiefe = 1;
  for (let i = start; i < text.length; i++) {
    if (text[i] === '(') tiefe++;
    else if (text[i] === ')' && --tiefe === 0) return text.slice(start, i);
  }
  return text.slice(start);
}

/** Entfernt var(…)-Aufrufe (auch verschachtelt), damit nur Literale übrig bleiben. */
function ohneVar(text) {
  let t = text;
  let vorher;
  do {
    vorher = t;
    t = t.replace(/var\([^()]*\)/gi, (m) => ' '.repeat(m.length));
  } while (t !== vorher);
  return t;
}

function einheitBefund(zahl, einheit) {
  const e = einheit.toLowerCase();
  if (e === 'px') {
    return ['0px', '1px', '-1px'].includes(zahl + e)
      ? null
      : { regel: 'token/laenge', schwere: 'fehler', text: 'Pixelwert; erlaubt sind nur 0px, 1px, -1px – Abstands- oder Größentoken nutzen' };
  }
  if (e === 'em') return { regel: 'token/laenge', schwere: 'fehler', text: 'em in Deklarationen verboten – Token nutzen (em nur in @media/@container)' };
  if (e === 'rem' || e === 'pt') return { regel: 'token/laenge', schwere: 'fehler', text: `${e} verboten – Token nutzen` };
  if (e === 'vw' || e === 'vh' || e === 'svh' || e === 'dvh') {
    return zahl === '100' ? null : { regel: 'token/laenge', schwere: 'fehler', text: `nur 100${e} ist erlaubt` };
  }
  if (e === 'ms' || e === 's') return { regel: 'token/zeit', schwere: 'fehler', text: 'Zeit-Literal – Dauertoken nutzen (--dur-…)' };
  return { regel: 'token/einheit', schwere: 'warnung', text: `Einheit ${e} ist im Designsystem nicht vorgesehen` };
}

function pruefeDeklaration(eigenschaft, wertRoh, wertStart, eigenschaftStart, melde) {
  if (eigenschaft.startsWith('--')) {
    melde('token/neue-variable', 'warnung', eigenschaftStart, `eigene Variable ${eigenschaft} außerhalb token.css`);
  }
  // Namen von Variablen (--x) sind keine Werte; sie werden für die Literalprüfung ausgeblendet.
  const wert = wertRoh.replace(/--[\w-]+/g, (m) => '_'.repeat(m.length));
  const o = (i) => wertStart + i;

  for (const m of wert.matchAll(HEX)) melde('token/farbe', 'fehler', o(m.index), `Hex-Farbe ${m[0]} – Farbtoken nutzen`);
  for (const m of wert.matchAll(FARBFUNKTION)) {
    const rest = ohneVar(klammerInhalt(wert, m.index + m[0].length));
    if (/[0-9#]/.test(rest) || BENANNT_EIN.test(rest)) {
      melde('token/farbe', 'fehler', o(m.index), `${m[1]}() mit Literal – Farbtoken nutzen`);
    }
  }
  for (const m of wert.matchAll(BENANNT_ALLE)) melde('token/farbe', 'fehler', o(m.index), `benannte Farbe ${m[1]} – Farbtoken nutzen`);
  for (const m of wert.matchAll(KURVE)) melde('token/kurve', 'fehler', o(m.index), `${m[1]}() – Kurventoken nutzen (--ease-…)`);
  for (const m of wert.matchAll(EINHEIT)) {
    const befund = einheitBefund(m[1], m[2]);
    if (befund) melde(befund.regel, befund.schwere, o(m.index), `${m[1]}${m[2]}: ${befund.text}`);
  }
  if (eigenschaft === 'font-family' && !/var\(/i.test(wert) && !CSS_GLOBAL.test(wert)) {
    melde('token/schrift', 'fehler', eigenschaftStart, 'font-family ohne var() – Schriftfamilie über --ff-…-Token');
  }
}

function pruefeAtRegel(kopf, offset, melde) {
  const m = /^@(media|container)\b/i.exec(kopf);
  if (!m) return;
  const art = m[1].toLowerCase();
  for (const t of kopf.matchAll(EINHEIT)) {
    const zahl = t[1];
    const einheit = t[2].toLowerCase();
    if (einheit === 'em' && (art === 'container' || BREAKPOINTS_EM.has(Number(zahl)))) continue;
    melde('token/breakpoint', 'warnung', offset + t.index, `Wert ${zahl}${t[2]} in @${art} – Breakpoints aus K-005 nutzen (30em, 48em, 64em, 80em)`);
  }
}

/** Prüft den Text einer CSS-Quelldatei; `datei` ist der Pfad für die Befunde (relativ zur Wurzel). */
export function pruefeCss(quelle, datei) {
  const s = maskiereCss(String(quelle));
  const zeile = zeilenIndex(s);
  const befunde = [];
  const melde = (regel, schwere, offset, meldung) => befunde.push({ regel, schwere, datei: `${datei}:${zeile(offset)}`, meldung });

  // Der Text wird in Abschnitte zerlegt: "{" endet einen Kopf (Selektor oder @-Regel),
  // ";" und "}" enden eine Deklaration. Selektoren werden nicht als Deklaration gewertet.
  let start = 0;
  for (let i = 0; i <= s.length; i++) {
    const c = s[i];
    if (c !== '{' && c !== ';' && c !== '}' && i < s.length) continue;
    const seg = s.slice(start, i);
    const kopf = seg.search(/\S/);
    if (kopf >= 0) {
      if (c === '{') {
        if (seg[kopf] === '@') pruefeAtRegel(seg.slice(kopf).trim(), start + kopf, melde);
      } else if (seg[kopf] !== '@') {
        const doppelpunkt = seg.indexOf(':');
        if (doppelpunkt > kopf) {
          pruefeDeklaration(
            seg.slice(kopf, doppelpunkt).trim().toLowerCase(),
            s.slice(start + doppelpunkt + 1, i),
            start + doppelpunkt + 1,
            start + kopf,
            melde,
          );
        }
      }
    }
    start = i + 1;
  }
  return befunde;
}

/** Prüft den Quelltext einer Vorlage oder eines Inhaltsmoduls: nur Zeichenketten, nie Kommentare. */
export function pruefeVorlage(quelle, datei) {
  const text = String(quelle);
  const zeile = zeilenIndex(text);
  const befunde = [];
  for (const m of text.matchAll(JS_TEILE)) {
    if (m[0].startsWith('/*') || m[0].startsWith('//')) continue;
    const inhalt = m[0].slice(1, -1);
    const basis = m.index + 1;
    for (const h of inhalt.matchAll(HEX)) {
      befunde.push({ regel: 'token/farbe', schwere: 'fehler', datei: `${datei}:${zeile(basis + h.index)}`, meldung: `Hex-Farbe ${h[0]} in Vorlage – Farbtoken nutzen` });
    }
    if (/\sstyle\s*=/i.test(inhalt) || inhalt === 'style') {
      befunde.push({ regel: 'token/inline-style', schwere: 'fehler', datei: `${datei}:${zeile(m.index)}`, meldung: 'style-Attribut in Vorlage – Klassen aus dem Designsystem nutzen' });
    }
  }
  return befunde;
}

async function dateienIn(ordner, endung) {
  let eintraege;
  try {
    eintraege = await readdir(ordner, { withFileTypes: true });
  } catch (e) {
    if (e.code === 'ENOENT') return [];
    throw e;
  }
  const ergebnis = [];
  for (const e of eintraege) {
    const pfad = join(ordner, e.name);
    if (e.isDirectory()) ergebnis.push(...(await dateienIn(pfad, endung)));
    else if (e.name.endsWith(endung)) ergebnis.push(pfad);
  }
  return ergebnis.sort();
}

export async function pruefe(ctx) {
  const wurzel = ctx.wurzel;
  const relativ = (pfad) => relative(wurzel, pfad).split(sep).join('/');
  const befunde = [];
  for (const pfad of await dateienIn(join(wurzel, 'src/assets/css'), '.css')) {
    if (CSS_AUSGENOMMEN.has(basename(pfad))) continue;
    befunde.push(...pruefeCss(await readFile(pfad, 'utf8'), relativ(pfad)));
  }
  for (const ordner of ['src/vorlagen', 'src/inhalte']) {
    for (const pfad of await dateienIn(join(wurzel, ordner), '.mjs')) {
      befunde.push(...pruefeVorlage(await readFile(pfad, 'utf8'), relativ(pfad)));
    }
  }
  return befunde;
}
