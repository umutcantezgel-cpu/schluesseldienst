// Sachaussagen mit Quelle. Status „verifizieren“ = noch nicht vom Menschen geprüft
// → in Vorschau-Builds sichtbar markiert, im Release ein Fehler.
export class Fakt {
  constructor({ id, text, quelle, status }) {
    if (!id || !text) throw new Error('Fakt braucht id und text');
    if (!['verifizieren', 'geprueft'].includes(status)) throw new Error(`Fakt ${id}: status muss „verifizieren“ oder „geprueft“ sein`);
    Object.assign(this, { id, text, quelle, status });
  }
  markierung() {
    const esc = this.text.replace(/[&<>"']/g, (z) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[z]);
    return this.status === 'geprueft' ? esc : `\u27E6V:${this.id}\u27E7${esc}\u27E6/V\u27E7`;
  }
}
export const fakt = (daten) => new Fakt(daten);
