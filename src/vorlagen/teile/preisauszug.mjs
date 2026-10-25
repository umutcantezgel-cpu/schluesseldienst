// Preistabelle (K-009): <table> mit caption, Zeitfenster als Spalten, Tabellenziffern.
// Unter 34em Containerbreite zeigt CSS jede Zeile als Block. Platzhalterpreise sind sichtbar markiert.
import { html } from '../../../bau/lib/html.mjs';
import { istPlatzhalter } from '../../../bau/lib/platzhalter.mjs';
import { zeitText } from '../../assets/js/logik/preise.mjs';

/** Uhrzeit eines Zeitfensters: aus dem Tagesband, solange es fehlt der Platzhalter des Fensters. */
export const fensterZeit = (preise, f) => (istPlatzhalter(preise.tagesband) ? f.zeit : zeitText(preise.tagesband, f.id));

const euro = (cent) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(cent / 100).replace(/\s/g, ' ');

export function betrag(wert) {
  if (istPlatzhalter(wert)) return html`<span class="preis preis-offen">${wert}</span>`;
  if (wert === null || wert === undefined) return html`<span class="preis preis-offen">nach Absprache</span>`;
  return html`<span class="preis" data-daten="">${euro(wert)}</span>`;
}

export function preistabelle(sk, { positionen, titel = 'Gesamtpreise in Zone A (Kerngebiet)', id = 'preistabelle' }) {
  const { preise } = sk.konfig;
  const zeilen = preise.positionen.filter((p) => !positionen || positionen.includes(p.id));
  return html`<div class="preis-tabelle-huelle">
<table class="preis-tabelle" id="${id}">
<caption>${titel}</caption>
<thead><tr><th scope="col">Leistung</th>${preise.zeitfenster.map((z) => html`<th scope="col" data-fenster="${z.id}"><span class="preis-fenster">${z.titel}</span><span class="preis-zeit">${fensterZeit(preise, z)}</span></th>`)}</tr></thead>
<tbody>
${zeilen.map((p) => html`<tr><th scope="row"><a href="${p.leistung}">${p.titel}</a>${p.hinweis ? html`<span class="preis-hinweis">${p.hinweis}</span>` : ''}</th>${preise.zeitfenster.map((z) => html`<td data-fenster="${z.id}" data-titel="${z.titel}">${betrag(p.preise[z.id])}</td>`)}</tr>`)}
</tbody>
</table>
</div>`;
}
