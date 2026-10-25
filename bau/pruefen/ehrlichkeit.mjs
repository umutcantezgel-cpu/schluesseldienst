// Ehrlichkeitsprüfer (K-010): verbotene Behauptungen, Marken, Dark Patterns und Floskeln.
// Geprüft werden <title>, Meta-Beschreibung, og:title, og:description, alle alt-Attribute,
// die Stringwerte der JSON-LD-Blöcke und der sichtbare Text in <main> ohne .platzhalter-Inhalt.
// Die Textwerkzeuge unten nutzen auch fakten.mjs und emoji.mjs.
import { platzhalterIn, istPlatzhalter } from '../lib/platzhalter.mjs';

export const name = 'ehrlichkeit';

// ---------- Textwerkzeuge (gemeinsam genutzt) ----------

const ENTITAETEN = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', shy: '', copy: '©', reg: '®',
  ndash: '–', mdash: '—', bdquo: '„', ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’', hellip: '…',
  laquo: '«', raquo: '»', euro: '€', sect: '§', middot: '·', times: '×', deg: '°',
  auml: 'ä', ouml: 'ö', uuml: 'ü', Auml: 'Ä', Ouml: 'Ö', Uuml: 'Ü', szlig: 'ß',
};

/** Elemente ohne Abstand im Fließtext. */
export const INLINE = new Set(['a', 'abbr', 'b', 'bdi', 'bdo', 'cite', 'code', 'data', 'del', 'dfn', 'em', 'font', 'i',
  'ins', 'kbd', 'label', 'mark', 'q', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr']);
/** Elemente ohne Endtag. */
export const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param',
  'source', 'track', 'wbr']);

export function entitaeten(text) {
  const s = String(text);
  if (!s.includes('&')) return s;
  return s.replace(/&(#[xX][0-9a-fA-F]+|#\d+|[A-Za-z][A-Za-z0-9]*);/g, (ganz, schluessel) => {
    if (schluessel[0] === '#') {
      const code = schluessel[1] === 'x' || schluessel[1] === 'X'
        ? parseInt(schluessel.slice(2), 16)
        : parseInt(schluessel.slice(1), 10);
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : ganz;
    }
    return Object.hasOwn(ENTITAETEN, schluessel) ? ENTITAETEN[schluessel] : ganz;
  });
}

export const normal = (text) => String(text).replace(/\s+/g, ' ').trim();

/**
 * Tokenizer für HTML in einem Durchlauf. Gruppen: 1 = „/“ eines Endtags, 2 = Tagname, 3 = Attribute,
 * 4 = Text. Kommentare, Doctype und ein einzelnes „<“ im Text liefern keine Gruppe 2 bzw. 4.
 */
export const TOKEN = /<(\/?)([A-Za-z][A-Za-z0-9-]*)([^>]*)>|<!--[\s\S]*?-->|<![^>]*>|([^<]+)|</g;

// Attribut-Regeln werden einmal gebaut (sonst kostet jeder Aufruf einen neuen RegExp).
const wertRegeln = new Map();
const daRegeln = new Map();
/** Wert eines Attributs (nicht decodiert) oder null. */
export function attrWert(attrs, attr) {
  if (!wertRegeln.has(attr)) {
    wertRegeln.set(attr, new RegExp(`(?:^|\\s)${attr}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'=<>]+))`, 'i'));
  }
  const m = wertRegeln.get(attr).exec(attrs);
  return m ? (m[1] ?? m[2] ?? m[3] ?? '') : null;
}

export function hatAttr(attrs, attr) {
  if (!daRegeln.has(attr)) daRegeln.set(attr, new RegExp(`(?:^|\\s)${attr}(?=[\\s=/>]|$)`, 'i'));
  return daRegeln.get(attr).test(attrs);
}

export const klassen = (attrs) => (attrWert(attrs, 'class') ?? '').split(/\s+/).filter(Boolean);

/**
 * Inhalt von <main> ohne Skripte und Stile, oder null, wenn es kein <main> gibt.
 * Der Generator schreibt Tags kleingeschrieben; die Suche nach <main> folgt dieser Konvention (schneller als ein Regex).
 */
export function hauptHtml(html) {
  let ohne = String(html ?? '');
  if (ohne.includes('<!--')) ohne = ohne.replace(/<!--[\s\S]*?-->/g, ' ');
  if (ohne.includes('<script') || ohne.includes('<style')) {
    ohne = ohne.replace(/<(script|style)\b[\s\S]*?<\/\1\s*>/gi, ' ');
  }
  const anfang = ohne.indexOf('<main');
  if (anfang < 0) return null;
  const ende = ohne.lastIndexOf('</main');
  const oeffnen = ohne.indexOf('>', anfang);
  if (ende < 0 || oeffnen < 0 || oeffnen > ende) return null;
  return ohne.slice(oeffnen + 1, ende);
}

/** Sichtbarer Text eines <main>-Inhalts (HTML). Der Inhalt von .platzhalter-Elementen entfällt. */
export function sichtbarerText(haupt) {
  let aus = '';
  const stapel = [];
  let verborgen = 0;
  for (const m of haupt.matchAll(TOKEN)) {
    if (m[4] !== undefined) {
      if (verborgen === 0) aus += m[4].includes('&') ? entitaeten(m[4]) : m[4];
      continue;
    }
    if (m[2] === undefined) continue;
    const element = m[2].toLowerCase();
    if (m[1]) {
      const idx = stapel.findLastIndex((e) => e.element === element);
      if (idx >= 0) {
        while (stapel.length > idx) if (stapel.pop().verbirgt) verborgen -= 1;
      }
      if (!INLINE.has(element) && verborgen === 0) aus += ' ';
      continue;
    }
    if (!INLINE.has(element) && verborgen === 0) aus += ' ';
    const attrs = m[3];
    if (VOID.has(element) || /\/\s*$/.test(attrs)) continue;
    const verbirgt = attrs.includes('platzhalter') && klassen(attrs).includes('platzhalter');
    stapel.push({ element, verbirgt });
    if (verbirgt) verborgen += 1;
  }
  return aus;
}

function stringsIn(wert, aus = []) {
  if (typeof wert === 'string') aus.push(wert);
  else if (Array.isArray(wert)) for (const x of wert) stringsIn(x, aus);
  else if (wert && typeof wert === 'object') for (const v of Object.values(wert)) stringsIn(v, aus);
  return aus;
}

/** Titel, Meta-Beschreibung, og:title und og:description. */
export function titelUndMeta(html) {
  const felder = [];
  const titel = /<title\b[^>]*>([\s\S]*?)<\/title\s*>/i.exec(html);
  if (titel) felder.push({ feld: 'title', text: normal(entitaeten(titel[1])) });

  const meta = { description: 'meta description', 'og:title': 'og:title', 'og:description': 'og:description' };
  if (html.includes('<meta')) {
    for (const m of html.matchAll(/<meta\b([^>]*)>/gi)) {
      const schluessel = (attrWert(m[1], 'name') ?? attrWert(m[1], 'property') ?? '').toLowerCase();
      const inhalt = attrWert(m[1], 'content');
      if (Object.hasOwn(meta, schluessel) && inhalt !== null) felder.push({ feld: meta[schluessel], text: normal(entitaeten(inhalt)) });
    }
  }

  return felder;
}

/** alt-Attribute und JSON-LD-Stringwerte. */
export function altUndJsonLd(html) {
  const felder = [];
  if (html.includes('alt')) {
    for (const m of html.matchAll(/\salt\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)) {
      felder.push({ feld: 'alt', text: normal(entitaeten(m[1] ?? m[2] ?? '')) });
    }
  }

  if (html.includes('ld+json')) {
    for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
      if ((attrWert(m[1], 'type') ?? '').toLowerCase() !== 'application/ld+json') continue;
      let daten;
      try {
        daten = JSON.parse(m[2]);
      } catch {
        felder.push({ feld: 'json-ld', text: normal(m[2]) });
        continue;
      }
      for (const s of stringsIn(daten)) felder.push({ feld: 'json-ld', text: normal(s) });
    }
  }
  return felder;
}

/** Alle prüfbaren Textfelder einer Seite (ohne <main>-Vorlauf): { feld, text }. */
export function textfelder(seite) {
  const html = String(seite.html ?? '');
  const felder = [...titelUndMeta(html), ...altUndJsonLd(html)];
  const haupt = hauptHtml(html);
  if (haupt !== null) felder.push({ feld: 'main', text: sichtbarerText(haupt) });
  return felder;
}

/** Kontext ±30 Zeichen um einen Treffer, normalisiert. */
export function fundstelle(text, s, e) {
  return normal(text.slice(Math.max(0, s - 30), Math.min(text.length, e + 30)));
}

/**
 * Treffer in einem Text. muster: Einträge { re, vor?, nach?, kennung? }, re mit Flag g.
 * vor/nach sind Zeichenklassen (RegExp ohne Flag), die das Zeichen direkt vor bzw. nach dem Treffer nicht haben darf.
 * Die Ränder werden nach dem Treffer geprüft, nicht per Lookbehind (das wäre an jeder Textstelle teuer).
 * Überlappende Treffer werden zusammengefasst (der längere gewinnt).
 */
export function trefferIn(muster, text) {
  const liste = [];
  for (const eintrag of muster) {
    for (const m of text.matchAll(eintrag.re)) {
      const roh = m[0];
      const s = m.index;
      const e = s + roh.length;
      if (eintrag.vor && s > 0 && eintrag.vor.test(text[s - 1])) continue;
      if (eintrag.nach && e < text.length && eintrag.nach.test(text[e])) continue;
      liste.push({ s, e, text: normal(roh), kennung: eintrag.kennung ?? normal(roh) });
    }
  }
  liste.sort((a, b) => a.s - b.s || b.e - a.e);
  const ergebnis = [];
  let ende = -1;
  for (const t of liste) {
    if (t.s >= ende) {
      ergebnis.push(t);
      ende = t.e;
    }
  }
  return ergebnis;
}

// ---------- Regeln ----------

/** Unicode-Buchstaben und -Ziffern zählen als Wort. */
export const WORT = /[\p{L}\p{N}]/u;
/** Muster mit Wortgrenzen. */
const wort = (re) => ({ re: new RegExp(re.source, 'giu'), vor: WORT, nach: WORT });
/** Muster ohne Wortgrenzen, für Sonderzeichen. */
const frei = (re) => ({ re: new RegExp(re.source, 'giu') });
/** Zahl: Ziffern direkt davor oder danach ergeben keinen Treffer. */
const zahl = (re) => ({ re: new RegExp(re.source, 'giu'), vor: /\p{N}/u, nach: /\p{N}/u });

const norm = (text) => String(text).toLowerCase().replace(/[\s-]/g, '')
  .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
const liste = (wert) => (Array.isArray(wert) ? wert.filter((x) => typeof x === 'string') : []);
const istGesetzt = (wert) => wert !== undefined && wert !== null && wert !== '' && !istPlatzhalter(wert);
const qualifikationen = (ctx) => liste(ctx.konfig?.betrieb?.qualifikationen);
const freigegeben = (ctx) => liste(ctx.konfig?.marken?.freigegeben);

const ORTSSEITE = /^\/schluesseldienst-[^/]+\//;
const WEILBURG = /^\/schluesseldienst-weilburg(?:-|\/)/;
const istOrtsseite = (pfad) => ORTSSEITE.test(pfad) && !WEILBURG.test(pfad);

const umlaut = (teil) => teil.replace(/ä/g, '(?:ä|ae)').replace(/ö/g, '(?:ö|oe)').replace(/ü/g, '(?:ü|ue)');
const MARKEN = ['Jablotron', 'UR FOG', 'URFOG', 'GEZE', 'SimonsVoss', 'Simons Voss', 'ABUS', 'BKS', 'EVVA', 'ekey',
  'Yale', 'Wosta', 'ASSA ABLOY', 'IKON', 'effeff', 'Mediator', 'BASI', 'Secteo', 'KESO', 'Burg-Wächter', 'Burg Wächter',
  'Hörmann', 'Winkhaus', 'Gretsch-Unitas', 'Mul-T-Lock', 'Kaba', 'dormakaba', 'Dorma', 'Somfy', 'Hikvision', 'Dahua',
  'Daitem', 'Telenot', 'Lupus', 'Ajax Systems', 'Nuki', 'Bosch Sicherheit'];
const markenMuster = MARKEN.map((marke) => ({
  kennung: marke,
  re: new RegExp(marke.split(/[\s-]+/).map(umlaut).join('[\\s-]*'), 'giu'),
  vor: WORT,
  nach: WORT,
}));

// Ortspräsenz: ALLE_ORTE gilt überall; NUR_ORTSSEITEN zusätzlich auf Ortsseiten außer Weilburg.
const ALLE_ORTE = [wort(/niederlassung\p{L}*/u), wort(/filiale\p{L}*/u)];
const NUR_ORTSSEITEN = [
  wort(/vor\s+ort\s+in/u),
  wort(/ihr\s+schl(?:ü|ue)sseldienst\s+(?:in|aus)\s+\p{L}+/u),
  wort(/standort\s+in/u),
  wort(/unser\s+b(?:ü|ue)ro\s+in/u),
  wort(/in\s+ihrer\s+n(?:ä|ae)he/u),
];

const REGELN = [
  {
    id: 'minuten',
    schwere: 'fehler',
    vorfilter: /min/i,
    gilt: (ctx) => !istGesetzt(ctx.konfig?.betrieb?.anfahrtText),
    muster: [wort(/\d+\s*(?:–|-|bis)?\s*\d*\s*(?:minuten|min)/u)],
  },
  {
    id: 'rund-um-die-uhr',
    schwere: 'fehler',
    vorfilter: /24|365|rund/i,
    gilt: (ctx) => ctx.konfig?.betrieb?.erreichbarkeit?.rundUmDieUhr !== true,
    muster: [wort(/24\s*\/\s*7/u), wort(/24\s*h/u), wort(/rund\s+um\s+die\s+uhr/u), wort(/365\s*tage\p{L}*/u)],
  },
  {
    id: 'festpreis',
    schwere: 'fehler',
    vorfilter: /festpreis/i,
    gilt: (ctx) => !ctx.konfig?.preise || platzhalterIn(ctx.konfig.preise).length > 0,
    muster: [wort(/festpreis\p{L}*/u)],
  },
  {
    id: 'superlativ',
    schwere: 'fehler',
    vorfilter: /nr|nummer|bester|beste|günstig|billig|schnell|marktf/i,
    muster: [
      // „Nr. 1“ als Werbung, nicht als Fundstelle („§ 14 Abs. 2 Satz 1 Nr. 1 HBO“)
      wort(/(?<!(?:satz|abs\.|absatz|ziff\.|ziffer)\s+\d+[a-z]?\s+)nr\.?\s*1/u), wort(/nummer\s*1/u), wort(/bester/u),
      wort(/beste[mnrs]?\s+schl(?:ü|ue)sseldienst/u), wort(/günstigste[mnrs]?/u), wort(/billigste[mnrs]?/u),
      wort(/schnellste[mnrs]?/u), wort(/marktf(?:ü|ue)hrer\p{L}*/u),
    ],
  },
  {
    id: 'garantie',
    schwere: 'fehler',
    vorfilter: /garantie|100|schadensfrei/i,
    muster: [wort(/garantie\p{L}*/u), zahl(/100\s*(?:%|prozent)/u), wort(/schadensfrei\s+garantiert/u)],
  },
  {
    id: 'alter-zertifikat',
    schwere: 'fehler',
    vorfilter: /seit|jahre|meisterbetrieb|zertifizier|gepr|t(?:ü|ue)v|vds|polizeilich|adac/i,
    ausnahme: (ctx, t) => qualifikationen(ctx).some((q) => norm(q).includes(norm(t.text))),
    muster: [
      wort(/seit\s+(?:19|20)\d{2}/u), wort(/\d+\s+jahre(?:n)?\s+erfahrung/u), wort(/meisterbetrieb\p{L}*/u),
      wort(/zertifizier\p{L}*/u), wort(/gepr(?:ü|ue)fter\s+betrieb/u), wort(/t(?:ü|ue)v/u), wort(/vds/u),
      wort(/polizeilich\s+empfohlen/u), wort(/adac/u),
    ],
  },
  {
    id: 'bewertung',
    schwere: 'fehler',
    vorfilter: /stern|[★☆]|\/\s*5|bewertung|kundenstimm/i,
    muster: [
      wort(/sterne(?:n)?/u), frei(/[★☆]/u), zahl(/\d(?:[.,]\d)?\s*\/\s*5/u),
      wort(/\d+\s+bewertung\p{L}*/u), wort(/kundenstimme\p{L}*/u), wort(/google[\s-]*bewertung\p{L}*/u),
    ],
  },
  {
    id: 'kostenlos',
    schwere: 'warnung',
    vorfilter: /kostenlos|gratis|umsonst/i,
    muster: [wort(/kostenlos\p{L}*/u), wort(/gratis\p{L}*/u), wort(/umsonst/u)],
  },
  {
    id: 'ortspraesenz',
    schwere: 'fehler',
    vorfilter: /niederlassung|filiale|vor\s+ort|schl(?:ü|ue)sseldienst|standort|b(?:ü|ue)ro|n(?:ä|ae)he/i,
    muster: (seite) => (istOrtsseite(seite.pfad) ? [...ALLE_ORTE, ...NUR_ORTSSEITEN] : ALLE_ORTE),
  },
  {
    id: 'dark-pattern',
    schwere: 'fehler',
    vorfilter: /nur|countdown|jetzt|angebot|begrenzt|schnell/i,
    muster: [
      wort(/nur\s+heute/u), wort(/nur\s+noch\s+\d+/u), wort(/countdown\p{L}*/u), wort(/jetzt\s+oder\s+nie/u),
      wort(/angebot\s+endet/u), wort(/begrenzte?\s+(?:anzahl|pl(?:ä|ae)tze|zeit)\p{L}*/u), wort(/schnell\s+sein/u),
    ],
  },
  {
    id: 'floskel',
    schwere: 'warnung',
    vorfilter: /nahtlos|innovativ|ganzheitlich|entdecken|kompetent|partner|panik|handschlag|zugeht/i,
    muster: [
      wort(/nahtlos\p{L}*/u), wort(/innovativ\p{L}*/u), wort(/ganzheitlich\p{L}*/u), wort(/entdecken\s+sie/u),
      wort(/kompetent\s+und\s+zuverl(?:ä|ae)ssig/u), wort(/ihr\s+partner\s+in\s+sachen/u), wort(/keine\s+panik/u),
      wort(/handschlag\s*qualit(?:ä|ae)t/u), wort(/alles,?\s+was\s+zugeht/u),
    ],
  },
  {
    id: 'marke',
    schwere: 'fehler',
    ausnahme: (ctx, t) => freigegeben(ctx).some((f) => norm(f) === norm(t.kennung)),
    muster: markenMuster,
  },
];

export async function pruefe(ctx) {
  const befunde = [];
  for (const seite of ctx.seiten ?? []) {
    const felder = textfelder(seite);
    for (const regel of REGELN) {
      if (regel.gilt && !regel.gilt(ctx)) continue;
      const muster = typeof regel.muster === 'function' ? regel.muster(seite) : regel.muster;
      for (const { feld, text } of felder) {
        if (regel.vorfilter && !regel.vorfilter.test(text)) continue; // Literalwort fehlt: kein Treffer möglich
        for (const t of trefferIn(muster, text)) {
          if (regel.ausnahme?.(ctx, t)) continue;
          befunde.push({
            regel: `ehrlichkeit/${regel.id}`,
            schwere: regel.schwere,
            datei: seite.datei,
            meldung: `Seite ${seite.pfad}, ${feld}: „${t.text}“ – Fundstelle „…${fundstelle(text, t.s, t.e)}…“`,
          });
        }
      }
    }
  }
  return befunde;
}
