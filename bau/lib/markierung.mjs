// Löst die Markierungen ⟦P:schluessel⟧ (Platzhalter) und ⟦V:id⟧…⟦/V⟧ (ungeprüfter Fakt)
// kontextabhängig auf: im Textinhalt als sichtbar markierte <span>, in Attributen
// und JSON-Datenblöcken als reine Beschriftung. Gezählt wird alles für den Bericht.
import { REGISTER } from './platzhalter.mjs';

const P = /⟦P:([a-z0-9.-]+)⟧/gi;
const V_AUF = /⟦V:([a-z0-9.-]+)⟧/gi;
const V_ZU = /⟦\/[VF]⟧/g;
const F_AUF = /⟦F:([a-z0-9.-]+)⟧/gi;
const esc = (s) => String(s).replace(/[&<>"']/g, (z) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[z]);
const beschriftung = (k) => `[${REGISTER.get(k) || k}]`;

/** Liefert { html, platzhalter:Set, fakten:Set }. */
export function aufloesen(text) {
  const platzhalter = new Set();
  const fakten = new Set();
  // 1. Datenblöcke (JSON-LD, JSON): nur reine Beschriftung, Fakten-Marken entfernen.
  let aus = text.replace(/(<script type="application\/(?:ld\+)?json"[^>]*>)([\s\S]*?)(<\/script>)/g, (_, a, inhalt, z) => {
    const neu = inhalt.replace(P, (m, k) => { platzhalter.add(k); return beschriftung(k).replace(/"/g, ''); })
      .replace(V_AUF, (m, id) => { fakten.add(id); return ''; }).replace(F_AUF, '').replace(V_ZU, '');
    return a + neu + z;
  });
  // 2. Übriges Dokument: Kontext je Fundstelle bestimmen (innerhalb eines Tags = Attribut).
  let ergebnis = '';
  let letzter = 0;
  const alle = /⟦(P|V|F|\/V|\/F)(?::([a-z0-9.-]+))?⟧/gi;
  let m;
  while ((m = alle.exec(aus))) {
    const davor = aus.slice(letzter, m.index);
    ergebnis += davor;
    const bisHier = ergebnis;
    const imTag = bisHier.lastIndexOf('<') > bisHier.lastIndexOf('>');
    if (m[1] === 'P') {
      platzhalter.add(m[2]);
      ergebnis += imTag ? esc(beschriftung(m[2])) : `<span class="platzhalter" data-platzhalter="${esc(m[2])}">${esc(beschriftung(m[2]))}</span>`;
    } else if (m[1] === 'V') {
      fakten.add(m[2]);
      ergebnis += imTag ? '' : `<span class="verifizieren" data-fakt="${esc(m[2])}">`;
    } else if (m[1] === 'F') {
      ergebnis += imTag ? '' : `<span data-fakt="${esc(m[2])}">`;
    } else {
      ergebnis += imTag ? '' : '</span>';
    }
    letzter = m.index + m[0].length;
  }
  ergebnis += aus.slice(letzter);
  return { html: ergebnis, platzhalter, fakten };
}
