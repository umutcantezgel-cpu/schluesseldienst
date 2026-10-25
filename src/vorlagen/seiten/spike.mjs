// E2-OPUS-03 Technik-Spike: prüft CSP, Trusted Types, COEP, Schrift, View Transition, Symbole, SVG-Animation.
// Wird nach dem Spike entfernt (PLAN E2-OPUS-03).
import { html } from '../../../bau/lib/html.mjs';
import { text } from '../../../bau/lib/inhalt.mjs';

export function seiten() {
  return [{
    pfad: '/spike/', titel: 'Technik-Spike', beschreibung: 'Interne Testseite des Generators: Sicherheitsrichtlinie, Schrift, Symbole und Bewegung im Zusammenspiel prüfen.',
    typ: 'system', ansicht: 'spike', indexierbar: false,
    inhalt: (sk) => html`<div class="raster sektion">
<h1>Technik-Spike</h1>
<p>${text('Prüftext mit Ziffern 0O 1lI 35781 und einem Link zur [Startseite](/spike/).')}</p>
<p>${sk.icon('telefon')} ${sk.icon('tresor')} ${sk.icon('standort', { titel: 'Standort' })}</p>
<span class="scherlinie scherlinie-leit" aria-hidden="true"></span>
<p>Telefon: ${sk.konfig.betrieb.telefon.anzeige}</p>
</div>`,
  }, {
    pfad: '/404.html', titel: 'Seite nicht gefunden', beschreibung: 'Diese Seite gibt es nicht. Über die Suche oder die Startseite finden Sie weiter.',
    typ: 'system', ansicht: 'V12', indexierbar: false,
    inhalt: () => html`<div class="raster sektion"><h1>Dieser Schlüssel passt nicht.</h1><p>Die Seite gibt es nicht (mehr).</p></div>`,
  }];
}
