// Zusagen zur Arbeitsweise: Text nur, wenn der Mensch die Zusage bestätigt hat (true).
// Platzhalter → Text mit sichtbarer Markierung (nur Vorschau, Release gesperrt); false → neutraler Text.
import { html } from '../../../bau/lib/html.mjs';
import { istPlatzhalter } from '../../../bau/lib/platzhalter.mjs';

export function zusage(sk, schluessel, textJa, textNein = '') {
  const wert = sk.konfig.betrieb.zusagen[schluessel];
  if (wert === true) return html`${textJa}`;
  if (istPlatzhalter(wert)) return html`${textJa} ${wert}`;
  return html`${textNein}`;
}
