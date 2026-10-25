// Platzhalter für Werte, die nur der Mensch kennt (Name, Telefon, Preise …).
// Sie werden in der Ausgabe als Markierung ⟦P:schluessel⟧ geschrieben und in
// bau/lib/markierung.mjs kontextabhängig aufgelöst. Release-Builds verweigern sie.
export class Platzhalter {
  constructor(schluessel, beschriftung) {
    if (!/^[a-z][a-z0-9.-]*$/i.test(schluessel)) throw new Error(`Platzhalter-Schlüssel ungültig: ${schluessel}`);
    this.schluessel = schluessel;
    this.beschriftung = beschriftung;
    REGISTER.set(schluessel, beschriftung);
  }
  markierung() { return `\u27E6P:${this.schluessel}\u27E7`; }
  markierungJson() { return `\u27E6P:${this.schluessel}\u27E7`; }
  toString() { return this.markierung(); }
}
export const REGISTER = new Map();
export const platzhalter = (schluessel, beschriftung) => new Platzhalter(schluessel, beschriftung);
export const istPlatzhalter = (w) => w instanceof Platzhalter;
/** Liefert den Wert oder den Ersatz, wenn er ein Platzhalter ist. */
export const wertOder = (w, ersatz) => (w instanceof Platzhalter ? ersatz : w);

/** Sammelt alle Platzhalter in einem (verschachtelten) Konfigurationsobjekt. */
export function platzhalterIn(objekt, pfad = '') {
  const funde = [];
  const gehe = (w, p) => {
    if (w instanceof Platzhalter) funde.push({ pfad: p, schluessel: w.schluessel, beschriftung: w.beschriftung });
    else if (Array.isArray(w)) w.forEach((x, i) => gehe(x, `${p}[${i}]`));
    else if (w && typeof w === 'object' && Object.getPrototypeOf(w) === Object.prototype) for (const [k, v] of Object.entries(w)) gehe(v, p ? `${p}.${k}` : k);
  };
  gehe(objekt, pfad);
  return funde;
}
