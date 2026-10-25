// V11 Suche (Arbeitsansicht, nicht indexiert): Suchfeld ohne <form> (CSP form-action mailto:), Ergebnisse in zwei
// Registern (Seiten, Orte), Statuszeile aria-live. Ab 64em 8/4: Suche links, „Andere Wege“ in der Randspalte, damit der
// Ausweg ohne Scrollen sichtbar ist. Ohne JS: Hinweis und Wege über Sitemap und Einsatzgebiet.
// Indizes: /daten/seiten.*.json (Build), /daten/orte.*.json und /daten/plz.*.json (Ortssuche), alle mit SRI.
import { html } from '../../../bau/lib/html.mjs';
import { text } from '../../../bau/lib/inhalt.mjs';
import inhalt from '../../inhalte/system.mjs';
import { brotkrumenLd } from '../teile/brotkrumen.mjs';

export function seiten(k) {
  const s = inhalt.suche;
  const stufen = [{ titel: 'Suche', pfad: '/suche/' }];
  return [{
    pfad: '/suche/', titel: s.titel, beschreibung: s.beschreibung, typ: 'system', ansicht: 'V11', indexierbar: false,
    koerperKlasse: 'seite-suche', stile: ['system'], brotkrumen: stufen, jsonld: [brotkrumenLd(k.basisUrl, stufen)],
    inhalt: (sk) => {
      const d = sk.assets.daten;
      const bereit = d.seiten && d.orte && d.plz;
      return html`<section class="system-kopf suche-kopf" aria-labelledby="suche-h1">
<div class="raster"><div class="suche-teilung">
<div class="suche-kopftext">
<span class="scherlinie scherlinie-leit kopf-linie" aria-hidden="true"></span>
<p class="gruppe-kicker">${s.kicker}</p>
<h1 id="suche-h1">${s.h1}</h1>
<p class="gruppe-einleitung">${text(s.einleitung)}</p>
</div>
<div class="suche" role="search"${bereit ? html` data-modul="suche" data-seiten="${d.seiten.pfad}" data-seiten-sri="${d.seiten.sri}" data-orte="${d.orte.pfad}" data-orte-sri="${d.orte.sri}" data-plz="${d.plz.pfad}" data-plz-sri="${d.plz.sri}"` : ''} data-kurz="${s.kurz}" data-leer="${s.leer}" data-fehler="${s.fehler}">
<div class="suche-feld" hidden>
<label class="suche-label" for="suche-eingabe">${s.label}</label>
<div class="suche-eingabe-huelle">${sk.icon('suche', { klasse: 'suche-icon' })}<input class="suche-eingabe" id="suche-eingabe" type="search" autocomplete="off" spellcheck="false" enterkeyhint="search" maxlength="80" placeholder="${s.platzhalter}"><button class="suche-leeren" type="button" aria-label="${s.leeren}" hidden>${sk.icon('schliessen')}</button></div>
</div>
<p class="suche-ohne-js">${s.ohneJs}</p>
<p class="suche-status" role="status" aria-live="polite"></p>
<div class="suche-ergebnis" hidden>
<section data-rolle="seiten-block" aria-labelledby="suche-seiten" hidden><h2 class="suche-block-titel" id="suche-seiten">${s.seiten}</h2><ul class="suche-liste" data-rolle="seiten"></ul></section>
<section data-rolle="orte-block" aria-labelledby="suche-orte" hidden><h2 class="suche-block-titel" id="suche-orte">${s.orte}</h2><ul class="suche-liste" data-rolle="orte"></ul></section>
</div>
</div>
<nav class="suche-rand" aria-labelledby="wege-titel">
<h2 class="rand-titel suche-block-titel" id="wege-titel">Andere Wege</h2>
<ul class="weiter suche-wege">${s.wege.map((w) => html`<li><a href="${w.pfad}"><span class="weiter-titel">${w.titel}</span><span class="weiter-text">${w.text}</span>${sk.icon('pfeil-rechts', { klasse: 'weiter-pfeil' })}</a></li>`)}</ul>
</nav>
</div></div>
</section>`;
    },
  }];
}
