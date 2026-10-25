// Plagiatsprüfer: gleicht die Fließtexte der gerenderten Seiten mit den Schindel-Hashes beider
// Wettbewerber ab (bau/pruefen/fingerabdruck.json, erzeugt von pipeline/fingerabdruck.mjs).
// Im Repo liegen nur Hashes, keine Wettbewerbertexte. Ein Lauf = zusammenhängende Treffer-Schindeln;
// Lauflänge in Wörtern = Treffer + (Schindellänge - 1).
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { SCHINDELLAENGE, schindelHash, woerter } from '../../pipeline/fingerabdruck.mjs';

export const name = 'plagiat';

const FEHLER_AB = 10; // Wörter in Folge
const WARNUNG_AB = 7;
const VORSCHAU_WOERTER = 6;
const AUSGESCHLOSSEN = new Set(['az-liste', 'nachbarorte', 'brotkrumen', 'ortsteile', 'plz-liste']);
const FLIESSTEXT = new Set(['p', 'li', 'dd', 'td', 'blockquote', 'figcaption', 'summary']);
const INLINE = new Set(['a', 'abbr', 'b', 'bdi', 'bdo', 'cite', 'code', 'data', 'del', 'dfn', 'em', 'font', 'i',
  'ins', 'kbd', 'label', 'mark', 'q', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr']);
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param',
  'source', 'track', 'wbr']);
const ENTITAETEN = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', shy: '',
  auml: 'ä', ouml: 'ö', uuml: 'ü', Auml: 'Ä', Ouml: 'Ö', Uuml: 'Ü', szlig: 'ß',
  ndash: '–', mdash: '—', bdquo: '„', ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’',
  hellip: '…', euro: '€', sect: '§',
};
const TAG = /^<(\/?)([A-Za-z][A-Za-z0-9-]*)([^>]*)>$/;

function entitaetenDekodieren(text) {
  return text.replace(/&(#[xX][0-9a-fA-F]+|#[0-9]+|[A-Za-z][A-Za-z0-9]*);/g, (ganz, schluessel) => {
    if (schluessel[0] === '#') {
      const code = schluessel[1] === 'x' || schluessel[1] === 'X'
        ? parseInt(schluessel.slice(2), 16)
        : parseInt(schluessel.slice(1), 10);
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : ganz;
    }
    return Object.hasOwn(ENTITAETEN, schluessel) ? ENTITAETEN[schluessel] : ganz;
  });
}

function tagAus(token) {
  const treffer = TAG.exec(token);
  if (!treffer) return null;
  const attribute = treffer[3];
  const klasse = /\sclass\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i.exec(attribute);
  const wert = klasse ? (klasse[1] ?? klasse[2] ?? klasse[3] ?? '') : '';
  return {
    schliessend: treffer[1] === '/',
    name: treffer[2].toLowerCase(),
    selbst: /\/\s*$/.test(attribute),
    ausgeschlossen: wert.split(/\s+/).some((k) => AUSGESCHLOSSEN.has(k)),
  };
}

/** Fließtextblöcke einer Seite: Inhalt von p/li/dd/td/blockquote/figcaption/summary innerhalb von main,
 *  ohne Elemente mit Ortslisten-Klassen. Ohne <main> gibt es keinen Fließtext. */
export function fliesstexteAus(html) {
  const ohne = String(html ?? '')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style)\b[\s\S]*?<\/\1\s*>/gi, ' ');
  const haupt = /<main\b[^>]*>([\s\S]*?)<\/main\s*>/i.exec(ohne);
  if (!haupt) return [];

  const ergebnis = [];
  const stapel = [];
  const offen = []; // offene Textblöcke, innerster zuletzt
  let ausgeschlossen = 0;
  const trenne = () => {
    if (offen.length && ausgeschlossen === 0) offen[offen.length - 1].text += ' ';
  };

  for (const token of haupt[1].match(/<\/?[A-Za-z][^>]*>|[^<]+|</g) ?? []) {
    const tag = token.length > 1 && token[0] === '<' ? tagAus(token) : null;
    if (!tag) {
      if (ausgeschlossen === 0 && offen.length) offen[offen.length - 1].text += entitaetenDekodieren(token);
      continue;
    }
    if (tag.schliessend) {
      const idx = stapel.findLastIndex((e) => e.name === tag.name);
      if (idx >= 0) {
        while (stapel.length > idx) {
          const e = stapel.pop();
          if (e.ausgeschlossen) ausgeschlossen -= 1;
          if (e.block) {
            offen.pop();
            if (e.block.text.trim()) ergebnis.push(e.block.text);
          }
        }
      }
      if (!INLINE.has(tag.name)) trenne();
      continue;
    }
    if (!INLINE.has(tag.name)) trenne();
    if (VOID.has(tag.name) || tag.selbst) continue;
    const e = { name: tag.name, ausgeschlossen: tag.ausgeschlossen, block: null };
    if (FLIESSTEXT.has(tag.name)) {
      e.block = { text: '' };
      offen.push(e.block);
    }
    if (tag.ausgeschlossen) ausgeschlossen += 1;
    stapel.push(e);
  }
  for (const block of offen) {
    if (block.text.trim()) ergebnis.push(block.text);
  }
  return ergebnis;
}

/** Zusammenhängende Treffer-Läufe in einer Wortliste; wortLaenge = Treffer + (Schindellänge - 1). */
export function trefferlaeufe(worte, fingerabdruck) {
  const schindeln = fingerabdruck.schindeln;
  const haeufig = fingerabdruck.haeufig;
  const treffer = [];
  for (let i = 0; i + SCHINDELLAENGE <= worte.length; i++) {
    const h = schindelHash(worte.slice(i, i + SCHINDELLAENGE));
    treffer.push(schindeln.has(h) && !haeufig.has(h));
  }
  const laeufe = [];
  for (let i = 0; i < treffer.length;) {
    if (!treffer[i]) {
      i += 1;
      continue;
    }
    let j = i;
    while (j + 1 < treffer.length && treffer[j + 1]) j += 1;
    laeufe.push({ start: i, wortLaenge: j - i + SCHINDELLAENGE });
    i = j + 1;
  }
  return laeufe;
}

/** Reine Prüfung ohne Dateizugriff; fingerabdruck = { schindeln: Set, haeufig: Set }. */
export function pruefeSeiten(seiten, fingerabdruck) {
  const befunde = [];
  for (const seite of seiten) {
    for (const block of fliesstexteAus(seite.html)) {
      const worte = woerter(block);
      for (const lauf of trefferlaeufe(worte, fingerabdruck)) {
        const eigene = worte.slice(lauf.start, lauf.start + VORSCHAU_WOERTER).join(' ');
        befunde.push({
          regel: 'plagiat/lauf',
          schwere: lauf.wortLaenge >= FEHLER_AB ? 'fehler' : 'warnung',
          datei: seite.datei,
          meldung: `Seite ${seite.pfad}: ${lauf.wortLaenge} Wörter in Folge decken sich mit Wettbewerbertexten `
            + `(erste eigene Wörter des Laufs: „${eigene}“)`,
        });
      }
    }
  }
  return befunde;
}

const cache = new Map();

async function fingerabdruckLaden(wurzel) {
  const pfad = join(wurzel, 'bau/pruefen/fingerabdruck.json');
  if (!cache.has(pfad)) {
    const laden = readFile(pfad, 'utf8').then((text) => {
      const fp = JSON.parse(text);
      if (fp.version !== 1 || fp.schindelLaenge !== SCHINDELLAENGE) {
        throw new Error('fingerabdruck.json: Version oder Schindellänge passt nicht');
      }
      return { schindeln: new Set(fp.schindeln), haeufig: new Set(fp.haeufig) };
    });
    cache.set(pfad, laden);
    laden.catch(() => cache.delete(pfad));
  }
  return cache.get(pfad);
}

export async function pruefe(ctx) {
  let fingerabdruck;
  try {
    fingerabdruck = await fingerabdruckLaden(ctx.wurzel);
  } catch (e) {
    if (e.code === 'ENOENT') {
      return [{
        regel: 'plagiat/fingerabdruck-fehlt',
        schwere: 'fehler',
        meldung: 'bau/pruefen/fingerabdruck.json fehlt; Erzeugung mit node pipeline/fingerabdruck.mjs',
      }];
    }
    throw e;
  }
  return pruefeSeiten(ctx.seiten ?? [], fingerabdruck);
}
