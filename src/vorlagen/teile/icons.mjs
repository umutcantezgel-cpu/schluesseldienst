// Icons als inline <symbol> je Seite (nur benutzte). Quelle: src/assets/icons/<name>.svg
// mit genau einem <svg viewBox="0 0 24 24" …>…</svg>. Dieses Modul darf roh() verwenden.
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { roh, html } from '../../../bau/lib/html.mjs';

const ICONS = new Map();

export async function iconsLaden(wurzel) {
  const ordner = join(wurzel, 'src/assets/icons');
  let namen = [];
  try { namen = (await readdir(ordner)).filter((n) => n.endsWith('.svg')).sort(); } catch { /* noch keine Icons */ }
  for (const n of namen) {
    const svg = await readFile(join(ordner, n), 'utf8');
    const m = svg.match(/<svg\b[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*)<\/svg>/);
    if (!m) throw new Error(`Icon ${n}: kein <svg viewBox> gefunden`);
    if (/<(script|style|foreignObject|image)\b|\son\w+=|style=|href="(?!#)/i.test(m[2])) throw new Error(`Icon ${n}: unzulässiger Inhalt`);
    ICONS.set(n.replace(/\.svg$/, ''), { viewBox: m[1], inhalt: m[2].trim() });
  }
  return ICONS.size;
}

export const iconVorhanden = (name) => ICONS.has(name);

/** Verwendung im Text: registriert das Icon für die Seite und liefert <svg><use></svg>. */
export function icon(sk, name, { titel = null, klasse = '' } = {}) {
  if (!ICONS.has(name)) throw new Error(`Unbekanntes Icon „${name}“`);
  sk.icons.add(name);
  const k = `i i-${name}${klasse ? ' ' + klasse : ''}`;
  if (titel) return html`<svg class="${k}" role="img" aria-label="${titel}" focusable="false"><use href="#i-${name}"></use></svg>`;
  return html`<svg class="${k}" aria-hidden="true" focusable="false"><use href="#i-${name}"></use></svg>`;
}

/** Symbolblock am Ende des <body>. */
export function symbole(sk) {
  const namen = [...sk.icons].sort();
  if (!namen.length) return roh('');
  const teile = namen.map((n) => { const i = ICONS.get(n); return `<symbol id="i-${n}" viewBox="${i.viewBox}">${i.inhalt}</symbol>`; });
  return roh(`<svg class="symbole" aria-hidden="true" focusable="false">${teile.join('')}</svg>`);
}
