// Systemseiten: 404 (V12). Ruhige Arbeitsansicht mit Ortssuche und den wichtigsten Wegen.
// M-21 (Charakter) folgt mit E4-BAU-21.
import { html } from '../../../bau/lib/html.mjs';
import { ortspruefung } from '../teile/ortspruefung.mjs';
import { rufknopf } from '../teile/rufknopf.mjs';

export function seiten() {
  return [{
    pfad: '/404.html', titel: 'Seite nicht gefunden', titelOhneMarke: true,
    beschreibung: 'Diese Seite gibt es nicht. Über die Ortssuche, die Leistungen oder die Startseite finden Sie weiter.',
    typ: 'system', ansicht: 'V12', indexierbar: false,
    inhalt: (sk) => html`<section class="sektion raster fehlerseite" aria-labelledby="fehler-titel">
<p class="hero-kicker">Fehler 404</p>
<h1 id="fehler-titel">Dieser Schlüssel passt nicht.</h1>
<p class="abschnitt-einleitung">Die Adresse führt zu keiner Seite. Vielleicht hilft einer dieser Wege weiter:</p>
<ul class="fehler-wege">
<li><a href="/">Zur Startseite</a></li>
<li><a href="/leistungen/">Alle Leistungen</a></li>
<li><a href="/preise/">Preise</a></li>
<li><a href="/kontakt/">Kontakt</a></li>
</ul>
${ortspruefung(sk, { id: 'fehler-ort', modus: 'navigieren', titel: 'Ort suchen', hinweis: 'Ort oder Postleitzahl eingeben und zur Ortsseite springen.' })}
<div class="fehler-ruf">${rufknopf(sk, { variante: 'gross' })}</div>
</section>`,
  }];
}
