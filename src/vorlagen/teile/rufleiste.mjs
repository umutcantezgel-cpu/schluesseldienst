// Rufleiste (mobil, fest unten, nie versteckt): Menü + Anruf. Das Menü ist ohne JS ein Sprung
// zur Fußnavigation; mit JS öffnet es ein <dialog> als Blatt von unten (M-06).
import { html } from '../../../bau/lib/html.mjs';
import { HAUPT } from '../../konfig/navigation.mjs';
import { icon } from './icons.mjs';
import { rufknopf } from './rufknopf.mjs';

export function rufleiste(sk) {
  return html`<div class="rufleiste" role="region" aria-label="Schnellzugriff">
<a class="rufleiste-menue" href="#seitennavigation" data-modul="menue" aria-controls="menue-blatt">${icon(sk, 'menue')}<span>Menü</span></a>
${rufknopf(sk, { variante: 'leiste' })}
</div>
<dialog class="menue-blatt" id="menue-blatt" aria-labelledby="menue-blatt-titel">
<div class="menue-blatt-kopf">
<h2 class="menue-blatt-titel" id="menue-blatt-titel">Menü</h2>
<button class="menue-blatt-zu" type="button" data-menue-zu>${icon(sk, 'schliessen')}<span class="unsichtbar">Menü schließen</span></button>
</div>
<nav aria-label="Menü">
<ul class="menue-blatt-liste">
${HAUPT.map((p) => html`<li><a href="${p.pfad}">${p.titel}</a>${p.untermenue ? html`<ul>${p.untermenue.map((g) => html`<li><a href="${g.pfad}">${g.titel}</a></li>`)}</ul>` : ''}</li>`)}
<li><a href="/suche/">Suche</a></li>
</ul>
</nav>
</dialog>`;
}
