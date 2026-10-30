// Rufknopf: tel:-Link mit Nummer und Erreichbarkeitsstatus. Bei fehlender Nummer (Platzhalter)
// ein sichtbar markierter, nicht klickbarer Zustand – der Release-Build verweigert ihn ohnehin.
import { html, attrUrl } from '../../../bau/lib/html.mjs';
import { istPlatzhalter } from '../../../bau/lib/platzhalter.mjs';
import { icon } from './icons.mjs';
import { FOLGE } from '../../assets/js/logik/erreichbarkeit.mjs';

// Zeiten für data-zeiten in kompakter Form statt JSON (D-DATEN-01): Bis zu vier Rufknöpfe je Seite tragen sie, und
// im Attribut kostet jedes Anführungszeichen als &quot; sechs Zeichen – das Budget der Ortsseiten ist knapp.
// Beispiel Mo–Fr 08–18 Uhr, Sa 09–13 Uhr: „08:00-18:00|08:00-18:00|08:00-18:00|08:00-18:00|08:00-18:00|09:00-13:00|“.
// Gegenstück im Browser: zeitenAusText (src/assets/js/logik/erreichbarkeit.mjs).
export const zeitenAlsText = (zeiten) => FOLGE.map((t) => (zeiten[t] || []).map(([von, bis]) => `${von}-${bis}`).join(',')).join('|');

export function rufknopf(sk, { variante = 'standard', beschriftung = 'Jetzt anrufen' } = {}) {
  const { telefon, erreichbarkeit } = sk.konfig.betrieb;
  const zeiten = istPlatzhalter(erreichbarkeit.zeiten) ? '' : zeitenAlsText(erreichbarkeit.zeiten);
  const status = html`<span class="ruf-status" data-modul="erreichbarkeit" data-zeiten="${zeiten}" data-nacht="${istPlatzhalter(erreichbarkeit.nachtdienst) ? '' : String(erreichbarkeit.nachtdienst)}"></span>`;
  const innen = html`${icon(sk, 'telefon', { klasse: 'ruf-icon' })}<span class="ruf-text"><span class="ruf-beschriftung">${beschriftung}</span>${status}<span class="ruf-nummer">${telefon.anzeige}</span></span>`;
  if (istPlatzhalter(telefon.e164)) return html`<span class="rufknopf rufknopf-${variante}" data-zustand="platzhalter">${innen}</span>`;
  return html`<a class="rufknopf rufknopf-${variante}" href="${attrUrl('tel:' + telefon.e164)}">${innen}</a>`;
}
