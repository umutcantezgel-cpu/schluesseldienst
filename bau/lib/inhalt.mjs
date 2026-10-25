// Mini-Syntax für Fließtext in Inhaltsmodulen: [Text](/pfad/) und **fett**.
// Erst wird alles escaped, dann werden nur diese zwei Formen umgewandelt.
// Interne Links müssen in der Routentabelle existieren (sonst Build-Fehler).
import { Roh, escape } from './html.mjs';
import { Platzhalter } from './platzhalter.mjs';
import { Fakt } from './fakten.mjs';

let routenPruefer = null;
/** Wird vom Build gesetzt: (pfad) => boolean. */
export const setzeRoutenPruefer = (f) => { routenPruefer = f; };
const fehlendeLinks = [];
export const fehlendeLinksHolen = () => fehlendeLinks.splice(0);

function linkPruefen(ziel) {
  if (ziel.startsWith('/')) {
    const [pfad] = ziel.split('#');
    if (routenPruefer && !routenPruefer(pfad)) fehlendeLinks.push(pfad);
    return true;
  }
  if (ziel.startsWith('#')) return true;
  throw new Error(`Mini-Syntax: externe Links nur über quellen.mjs, nicht im Fließtext: ${ziel}`);
}

/** Wandelt einen Absatz (String oder Liste aus String/Platzhalter/Fakt) in Roh-HTML. */
export function text(eingabe) {
  const teile = Array.isArray(eingabe) ? eingabe : [eingabe];
  return new Roh(teile.map((t) => {
    if (t instanceof Platzhalter || t instanceof Fakt) return t.markierung();
    if (t instanceof Roh) return t.s;
    let s = escape(String(t));
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, ziel) => {
      linkPruefen(ziel.replace(/&amp;/g, '&'));
      return `<a href="${ziel}">${label}</a>`;
    });
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Gedankenstrich nie am Zeilenanfang: geschütztes Leerzeichen davor.
    s = s.replace(/ (–|—)/g, '\u00A0$1');
    return s;
  }).join(''));
}

/** Absatzliste → <p>…</p> */
export const absaetze = (liste) => new Roh(liste.map((a) => `<p>${text(a).s}</p>`).join(''));
