// Seitenkopf: Wortmarke, Offenlegungs-Navigation (Desktop), Suche, Rufknopf.
// Ohne JS: „Leistungen“ ist ein Link, der Aufklapp-Knopf bleibt verborgen.
import { html, attr } from '../../../bau/lib/html.mjs';
import { HAUPT } from '../../konfig/navigation.mjs';
import { signet } from './signet.mjs';
import { icon } from './icons.mjs';
import { rufknopf } from './rufknopf.mjs';

const aktiv = (sk, pfad) => (sk.seite.pfad === pfad ? 'page' : sk.seite.pfad.startsWith(pfad) && pfad !== '/' ? 'true' : false);

export function wortmarke(sk) {
  return html`<a class="wortmarke" href="/">${signet()}<span class="wortmarke-name">${sk.konfig.betrieb.name}</span><span class="unsichtbar"> – zur Startseite</span></a>`;
}

export function kopf(sk) {
  return html`<header class="kopf">
<div class="kopf-innen">
${wortmarke(sk)}
<nav class="hauptnav" aria-label="Hauptnavigation">
<ul class="hauptnav-liste">
${HAUPT.map((p) => p.untermenue ? html`<li class="hauptnav-punkt hat-untermenue">
<a href="${p.pfad}"${attr('aria-current', aktiv(sk, p.pfad))}>${p.titel}</a><button class="hauptnav-aufklapper" type="button" aria-expanded="false" aria-controls="untermenue-leistungen" data-modul="aufklapper" hidden><span class="unsichtbar">Untermenü ${p.titel}</span>${icon(sk, 'chevron')}</button>
<div class="hauptnav-panel" id="untermenue-leistungen">
${p.untermenue.map((g) => html`<div class="hauptnav-gruppe">
<a class="hauptnav-gruppe-titel" href="${g.pfad}">${g.titel}</a>
<ul>${g.kinder.map((k) => html`<li><a href="${k.pfad}">${k.titel}</a></li>`)}</ul>
</div>`)}
</div>
</li>` : html`<li class="hauptnav-punkt"><a href="${p.pfad}"${attr('aria-current', aktiv(sk, p.pfad))}>${p.titel}</a></li>`)}
</ul>
</nav>
<a class="kopf-suche" href="/suche/">${icon(sk, 'suche')}<span>Suche</span></a>
<div class="kopf-ruf">${rufknopf(sk, { variante: 'kopf' })}</div>
</div>
</header>`;
}
