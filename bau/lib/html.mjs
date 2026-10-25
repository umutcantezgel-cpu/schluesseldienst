// HTML-Erzeugung mit Pflicht-Escaping. Jeder Wert in html`…` wird escaped,
// außer er ist bereits ein Roh-Objekt (von html`…` selbst oder roh() erzeugt).
import { Platzhalter } from './platzhalter.mjs';
import { Fakt } from './fakten.mjs';

export class Roh {
  constructor(s) { this.s = String(s); }
  toString() { return this.s; }
}

const ZEICHEN = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const escape = (s) => String(s).replace(/[&<>"']/g, (z) => ZEICHEN[z]);

function wert(w) {
  if (w === null || w === undefined || w === false) return '';
  if (w instanceof Roh) return w.s;
  if (Array.isArray(w)) return w.map(wert).join('');
  if (w instanceof Platzhalter) return w.markierung();
  if (w instanceof Fakt) return w.markierung();
  if (typeof w === 'string' || typeof w === 'number') return escape(w);
  if (w === true) throw new TypeError('html: true ist kein darstellbarer Wert');
  throw new TypeError(`html: nicht darstellbarer Wert (${Object.prototype.toString.call(w)})`);
}

export function html(teile, ...werte) {
  let aus = teile[0];
  for (let i = 0; i < werte.length; i++) aus += wert(werte[i]) + teile[i + 1];
  return new Roh(aus);
}

/** Nur für bau/lib und das Icon-Modul: vertrauenswürdiges, bereits geprüftes Markup. */
export const roh = (s) => new Roh(s);

/** Fügt Teile mit Trenner zusammen (alles escaped). */
export const verbinden = (liste, trenner = '') => new Roh(liste.map(wert).join(wert(trenner)));

const URL_ERLAUBT = /^(\/(?!\/)[^\s"'<>\\]*|#[A-Za-z][\w-]*|https:\/\/[^\s"'<>\\]+|tel:\+\d{6,15}|mailto:[^\s"'<>\\]+)$/;
/** Prüft eine URL für href/src gegen eine Allowlist von Schemata. Wirft bei Verstoß. */
export function attrUrl(url) {
  if (url instanceof Platzhalter) return url;
  const s = String(url);
  if (!URL_ERLAUBT.test(s)) throw new Error(`attrUrl: unzulässige URL „${s}“`);
  return s;
}

/** JSON-LD/JSON-Datenblock: stabile Schlüsselreihenfolge, sicher gegen </script> und U+2028/2029. */
export function jsonBlock(objekt) {
  const sortiert = (w) => {
    if (w instanceof Platzhalter) return w.markierungJson();
    if (w instanceof Fakt) return w.text;
    if (Array.isArray(w)) return w.map(sortiert);
    if (w && typeof w === 'object') return Object.fromEntries(Object.keys(w).sort().map((k) => [k, sortiert(w[k])]).filter(([, v]) => v !== undefined));
    return w;
  };
  const text = JSON.stringify(sortiert(objekt))
    .replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  return new Roh(text);
}

/** Optionales Attribut: liefert ` name="wert"` oder nichts (null/undefined/false). */
export function attr(name, w) {
  if (!/^[a-z][a-z0-9-]*$/.test(name)) throw new Error(`attr: ungültiger Attributname ${name}`);
  if (w === null || w === undefined || w === false) return new Roh('');
  if (w === true) return new Roh(` ${name}`);
  return new Roh(` ${name}="${wert(w)}"`);
}
