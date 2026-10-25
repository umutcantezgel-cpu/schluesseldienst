// Rufknopf: tel:-Link mit Nummer und Erreichbarkeitsstatus. Bei fehlender Nummer (Platzhalter)
// ein sichtbar markierter, nicht klickbarer Zustand – der Release-Build verweigert ihn ohnehin.
import { html, attrUrl } from '../../../bau/lib/html.mjs';
import { istPlatzhalter } from '../../../bau/lib/platzhalter.mjs';
import { icon } from './icons.mjs';

export function rufknopf(sk, { variante = 'standard', beschriftung = 'Jetzt anrufen' } = {}) {
  const { telefon, erreichbarkeit } = sk.konfig.betrieb;
  const zeiten = istPlatzhalter(erreichbarkeit.zeiten) ? '' : JSON.stringify(erreichbarkeit.zeiten);
  const status = html`<span class="ruf-status" data-modul="erreichbarkeit" data-zeiten="${zeiten}" data-nacht="${istPlatzhalter(erreichbarkeit.nachtdienst) ? '' : String(erreichbarkeit.nachtdienst)}"></span>`;
  const innen = html`${icon(sk, 'telefon', { klasse: 'ruf-icon' })}<span class="ruf-text"><span class="ruf-beschriftung">${beschriftung}</span>${status}<span class="ruf-nummer">${telefon.anzeige}</span></span>`;
  if (istPlatzhalter(telefon.e164)) return html`<span class="rufknopf rufknopf-${variante}" data-zustand="platzhalter">${innen}</span>`;
  return html`<a class="rufknopf rufknopf-${variante}" href="${attrUrl('tel:' + telefon.e164)}">${innen}</a>`;
}
