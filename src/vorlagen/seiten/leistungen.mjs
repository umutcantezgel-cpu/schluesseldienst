// V11 Verzeichnis: Register aller Leistungen (Themenpass /leistungen/). Abschnittsfolge:
// Kopf mit Sprungleiste zu den vier Gruppen und „Alle“ (Anker; mit JavaScript Filter, K-07) · je Gruppe ein Abschnitt mit der Liste
// (abwechselnd Band und Dichte) · Schlussband mit Preisen und Kontakt. Texte in src/inhalte/leistungen.mjs,
// Gruppen und Leistungen aus src/konfig/leistungen.mjs.
import { html } from '../../../bau/lib/html.mjs';
import { text } from '../../../bau/lib/inhalt.mjs';
import inhalt from '../../inhalte/leistungen.mjs';
import { GRUPPEN } from '../../konfig/leistungen.mjs';
import { abschnittKopf } from '../teile/abschnitt.mjs';
import { brotkrumenLd } from '../teile/brotkrumen.mjs';

const anker = (g) => `gruppe-${g.id}`;

function kopf() {
  return html`<section class="verz-kopf" aria-labelledby="verz-h1">
<div class="raster">
<p class="gruppe-kicker">${inhalt.kicker}</p>
<h1 id="verz-h1">${inhalt.h1}</h1>
<p class="gruppe-einleitung">${text(inhalt.einleitung)}</p>
<nav class="verz-sprung" aria-label="${inhalt.sprungTitel}" data-modul="gruppenfilter" data-filter-titel="${inhalt.filterTitel}">
<ul>${GRUPPEN.map((g) => html`<li><a href="#${anker(g)}" data-gruppe="${g.id}"><span class="verz-nr" aria-hidden="true">${g.nr}</span>${g.titel}</a></li>`)}<li><a href="#${anker(GRUPPEN[0])}" data-gruppe="" aria-label="${inhalt.sprungAlleName}">${inhalt.sprungAlle}</a></li></ul>
</nav>
</div>
</section>`;
}

// Rhythmus: Fläche (Band) und Dichte wechseln von Gruppe zu Gruppe
function gruppe(sk, g, i) {
  const klasse = i % 2 === 0 ? 'sektion band' : 'sektion-dicht';
  return html`<section class="${klasse} verz-gruppe" id="${anker(g)}" data-gruppe="${g.id}" aria-labelledby="${anker(g)}-titel">
<div class="raster">
${abschnittKopf({ id: `${anker(g)}-titel`, titel: `[${g.titel}](${g.pfad})`, nr: g.nr })}
<ul class="verz-liste">${g.leistungen.map((l) => html`<li class="verz-eintrag">${sk.icon(l.icon, { klasse: 'verz-icon' })}<div class="verz-text"><h3 class="verz-titel"><a href="${l.pfad}">${l.titel}</a></h3><p class="verz-kurz">${l.kurz}</p></div></li>`)}</ul>
</div>
</section>`;
}

function schluss(sk) {
  const s = inhalt.schluss;
  return html`<section class="sektion band-dunkel schluss" aria-labelledby="schluss-titel">
<div class="raster"><div class="schluss-teilung">
<div><h2 id="schluss-titel">${s.titel}</h2><p>${text(s.text)}</p></div>
<div class="schluss-handlung">${s.links.map((l, i) => html`<a class="knopf ${i === 0 ? 'knopf-primaer' : 'knopf-sekundaer'}" href="${l.pfad}">${l.text}${sk.icon('pfeil-rechts')}</a>`)}</div>
</div></div>
</section>`;
}

export async function seiten(k) {
  const stufen = [{ titel: 'Leistungen', pfad: '/leistungen/' }];
  const url = `${k.basisUrl}/leistungen/`;
  const eintraege = GRUPPEN.flatMap((g) => g.leistungen);
  return [{
    pfad: '/leistungen/', titel: inhalt.titel, beschreibung: inhalt.beschreibung, typ: 'arbeit', ansicht: 'V11', sitemap: 'leistungen',
    koerperKlasse: 'seite-leistungen', stile: ['verzeichnis'], ogBild: '/assets/og/leistungen.png', brotkrumen: stufen,
    jsonld: [
      { '@context': 'https://schema.org', '@type': 'CollectionPage', '@id': `${url}#seite`, name: inhalt.titel, url, inLanguage: 'de', about: { '@id': `${k.basisUrl}/#betrieb` },
        mainEntity: { '@type': 'ItemList', itemListElement: eintraege.map((l, i) => ({ '@type': 'ListItem', position: i + 1, name: l.titel, url: `${k.basisUrl}${l.pfad}` })) } },
      brotkrumenLd(k.basisUrl, stufen),
    ],
    inhalt: (sk) => html`${kopf()}
${GRUPPEN.map((g, i) => gruppe(sk, g, i))}
${schluss(sk)}`,
  }];
}
