// V12 Systemseite 404 (Arbeitsansicht, nicht indexiert): Text 7/5 mit dem Zylinder eines falschen Schlüssels (M-21,
// Charakter: Stifte wackeln, die Linienhälften finden nicht zusammen; ohne Bewegung der gebrochene Zustand).
// Darunter drei Wege, Ortssuche und Anruf.
import { html } from '../../../bau/lib/html.mjs';
import { text } from '../../../bau/lib/inhalt.mjs';
import inhalt from '../../inhalte/system.mjs';
import { ortspruefung } from '../teile/ortspruefung.mjs';
import { rufknopf } from '../teile/rufknopf.mjs';
import { zylinderSchnitt } from '../teile/illustrationen/zylinder.mjs';

export function seiten() {
  const f = inhalt.fehler;
  return [{
    pfad: '/404.html', titel: f.titel, titelOhneMarke: true, beschreibung: f.beschreibung,
    typ: 'system', ansicht: 'V12', indexierbar: false, koerperKlasse: 'seite-fehler', stile: ['system'],
    inhalt: (sk) => html`<section class="system-kopf" aria-labelledby="fehler-titel">
<div class="raster"><div class="fehler-teilung">
<div>
<span class="scherlinie scherlinie-leit kopf-linie" aria-hidden="true"></span>
<p class="gruppe-kicker">${f.kicker}</p>
<h1 id="fehler-titel">${f.h1}</h1>
<p class="gruppe-einleitung">${text(f.text)}</p>
<ul class="weiter fehler-wege">${f.wege.map((w) => html`<li><a href="${w.pfad}"><span class="weiter-titel">${w.titel}</span><span class="weiter-text">${w.text}</span>${sk.icon('pfeil-rechts', { klasse: 'weiter-pfeil' })}</a></li>`)}</ul>
</div>
<figure class="fehler-figur" data-moment="falsch">${zylinderSchnitt({ praefix: 'fehler-zy', falsch: true, dekorativ: true })}<figcaption>${f.figur}</figcaption></figure>
</div></div>
</section>
<section class="sektion band sektion-dicht" aria-label="Ort suchen oder anrufen">
<div class="raster"><div class="fehler-unten">
${ortspruefung(sk, { id: 'fehler-ort', modus: 'navigieren', titel: f.ortTitel, hinweis: f.ortHinweis })}
<div class="fehler-ruf">${rufknopf(sk, { variante: 'gross' })}</div>
</div></div>
</section>`,
  }];
}
