// M-17 Szene (Erzählansicht V02): Schritte links als Text, Figur rechts klebend; der Schritt in der
// Viewport-Mitte setzt den Zustand der Figur (JS-Modul „szene“). Ohne JS, bei reduzierter Bewegung oder
// geringer Höhe zeigt jeder Schritt sein eigenes kleines Einzelbild – die Grundregel ist immer lesbar.
// figur: ({ praefix, zustand }) => Roh-SVG (dekorativ); schritte: [{ titel, text }]
import { html } from '../../../bau/lib/html.mjs';
import { text } from '../../../bau/lib/inhalt.mjs';
import { abschnittKopf } from './abschnitt.mjs';

export function szene({ id, titel, einleitung = null, figur, schritte, klasse = '' }) {
  return html`<section class="sektion szene${klasse ? ' ' + klasse : ''}" aria-labelledby="${id}-titel" data-modul="szene">
<div class="raster"><div class="szene-teilung">
<div class="szene-kopf">${abschnittKopf({ id: `${id}-titel`, titel, einleitung })}</div>
<ol class="szene-schritte">
${schritte.map((s, i) => html`<li class="szene-schritt" data-schritt="${String(i + 1)}">
<span class="szene-nr" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
<h3 class="szene-titel">${s.titel}</h3>
<p>${text(s.text)}</p>
<div class="szene-einzelbild">${figur({ praefix: `${id}-e${i + 1}`, zustand: i + 1 })}</div>
</li>`)}
</ol>
<div class="szene-buehne"><div class="szene-figur">${figur({ praefix: `${id}-f` })}</div></div>
</div></div>
</section>`;
}
