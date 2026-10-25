// Seitenfuß: Kontakt (aus Konfiguration), Leistungen, Einsatzgebiet, Betrieb & Recht.
// Die Scherlinie endet unten in einem Punkt „Weilburg an der Lahn“. Rechtliche Links sind nie eingeklappt.
import { html, attrUrl } from '../../../bau/lib/html.mjs';
import { istPlatzhalter } from '../../../bau/lib/platzhalter.mjs';
import { FUSS } from '../../konfig/navigation.mjs';
import { wortmarke } from './kopf.mjs';

const liste = (eintraege) => html`<ul>${eintraege.map((e) => html`<li><a href="${e.pfad}">${e.titel}</a></li>`)}</ul>`;

export function fuss(sk) {
  const b = sk.konfig.betrieb;
  const mail = istPlatzhalter(b.email) ? html`${b.email}` : html`<a href="${attrUrl('mailto:' + b.email)}">${b.email}</a>`;
  const tel = istPlatzhalter(b.telefon.e164) ? html`${b.telefon.anzeige}` : html`<a href="${attrUrl('tel:' + b.telefon.e164)}">${b.telefon.anzeige}</a>`;
  const laender = sk.hubs?.laender || [];
  return html`<footer class="fuss" id="seitennavigation">
<div class="fuss-innen">
<section class="fuss-kontakt" aria-labelledby="fuss-kontakt-titel">
${wortmarke(sk)}
<h2 class="fuss-titel" id="fuss-kontakt-titel">Kontakt</h2>
<address>
<span>${b.adresse.strasse}</span><br>
<span>${b.adresse.plz} ${b.adresse.ort}</span><br>
<span>Telefon: ${tel}</span><br>
<span>E-Mail: ${mail}</span>
</address>
</section>
<nav class="fuss-spalte" aria-labelledby="fuss-leistungen-titel">
<h2 class="fuss-titel" id="fuss-leistungen-titel">Leistungen</h2>
${liste(FUSS.leistungen)}
</nav>
<nav class="fuss-spalte fuss-gebiet" aria-labelledby="fuss-gebiet-titel">
<h2 class="fuss-titel" id="fuss-gebiet-titel">Einsatzgebiet</h2>
${liste([{ titel: 'Übersicht und Ortssuche', pfad: '/einsatzgebiet/' }, ...laender])}
</nav>
<nav class="fuss-spalte" aria-labelledby="fuss-betrieb-titel">
<h2 class="fuss-titel" id="fuss-betrieb-titel">Betrieb und Recht</h2>
${liste(FUSS.betrieb)}
${liste(FUSS.recht)}
</nav>
</div>
<div class="fuss-linie"><span class="scherlinie scherlinie-fuss" aria-hidden="true"></span><span class="fuss-ort">Weilburg an der Lahn</span></div>
</footer>`;
}
