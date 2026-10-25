// Sachaussagen mit Quelle. Status „verifizieren“ = noch nicht vom Menschen geprüft
// → in Vorschau-Builds sichtbar markiert, im Release ein Fehler. Geprüfte Fakten werden
// mit data-fakt ausgezeichnet, damit der Fakten-Prüfer Zahlen/Normen/§ ihrer Quelle zuordnen kann.
export class Fakt {
  constructor({ id, text, quelle, status }) {
    if (!id || !text) throw new Error('Fakt braucht id und text');
    if (!/^[a-z0-9.-]+$/.test(id)) throw new Error(`Fakt-ID ungültig: ${id}`);
    if (!['verifizieren', 'geprueft'].includes(status)) throw new Error(`Fakt ${id}: status muss „verifizieren“ oder „geprueft“ sein`);
    Object.assign(this, { id, text, quelle, status });
  }
  markierung() {
    const esc = this.text.replace(/[&<>"']/g, (z) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[z]);
    return this.status === 'geprueft' ? `⟦F:${this.id}⟧${esc}⟦/F⟧` : `⟦V:${this.id}⟧${esc}⟦/V⟧`;
  }
}
export const fakt = (daten) => new Fakt(daten);
