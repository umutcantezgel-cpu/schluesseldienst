// Abschnittskopf mit Scherlinien-Marke (M-14): Kicker-Linie, Überschrift, optionale Einleitung.
import { html } from '../../../bau/lib/html.mjs';
import { text } from '../../../bau/lib/inhalt.mjs';

export function abschnittKopf({ id, titel, einleitung = null, nr = null, ebene = 2 }) {
  const h = ebene === 2 ? html`<h2 id="${id}">${titel}</h2>` : html`<h3 id="${id}">${titel}</h3>`;
  return html`<div class="abschnitt-kopf">
<span class="abschnitt-marke" aria-hidden="true">${nr ? html`<span class="abschnitt-nr">${nr}</span>` : ''}<span class="abschnitt-linie"></span></span>
${h}
${einleitung ? html`<p class="abschnitt-einleitung">${text(einleitung)}</p>` : ''}
</div>`;
}
