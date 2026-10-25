// V05 Einsatzgebiet (Erzählansicht, großer Moment M-18 „Ringe um Weilburg“). Abschnittsfolge:
// Kopf mit Ortsprüfung (7/5) · Rasterkarte bis Zone C mit Ringen (Band) · Zonen als Karten · Länderverzeichnis ·
// Häufige Fragen · Schlussband. Zahlen (Radien, Ortszahlen) stammen aus Konfiguration und Daten.
import { html } from '../../../bau/lib/html.mjs';
import { text } from '../../../bau/lib/inhalt.mjs';
import { istPlatzhalter } from '../../../bau/lib/platzhalter.mjs';
import inhalt from '../../inhalte/einsatzgebiet.mjs';
import { abschnittKopf } from '../teile/abschnitt.mjs';
import { faq, faqLd } from '../teile/faq.mjs';
import { brotkrumenLd } from '../teile/brotkrumen.mjs';
import { betrag } from '../teile/preisauszug.mjs';
import { ortspruefung } from '../teile/ortspruefung.mjs';
import { gebietskarte, gebietsLegende } from '../teile/gebietskarte.mjs';

const ZEICHEN = new Intl.Collator('de');

function zaehlen(orte) {
  const zonen = {}; const laender = new Map();
  for (const o of orte) {
    if (!o.slug) continue;
    const z = o.staat === 'NL' ? 'NL' : o.zone;
    zonen[z] = (zonen[z] || 0) + 1;
    const l = laender.get(o.landSlug) || { titel: o.land, pfad: `/einsatzgebiet/${o.landSlug}/`, anzahl: 0, kreise: new Set(), kmMin: Infinity };
    l.anzahl += 1; l.kreise.add(o.kreisSlug); l.kmMin = Math.min(l.kmMin, o.km);
    laender.set(o.landSlug, l);
  }
  const liste = [...laender.values()].sort((a, b) => (a.titel === 'Niederlande') - (b.titel === 'Niederlande') || ZEICHEN.compare(a.titel, b.titel));
  return { zonen, laender: liste };
}

function kopf(sk) {
  return html`<section class="gebiet-kopf" aria-labelledby="gebiet-h1">
<div class="raster"><div class="gebiet-kopf-teilung">
<div>
<p class="gruppe-kicker">${inhalt.kicker}</p>
<h1 id="gebiet-h1">${inhalt.h1}</h1>
<p class="gruppe-einleitung">${text(inhalt.einleitung)}</p>
</div>
<div class="gebiet-pruefung">${ortspruefung(sk, { id: 'gebiet-ort', titel: inhalt.pruefTitel, hinweis: inhalt.pruefHinweis, ersatz: { pfad: '#laender-titel', text: 'Alle Orte nach Land und Kreis' } })}</div>
</div></div>
</section>`;
}

function karte(sk, ringe) {
  return html`<section class="sektion band" aria-labelledby="karte-titel">
<div class="raster">
${abschnittKopf({ id: 'karte-titel', titel: inhalt.karte.titel, einleitung: inhalt.karte.text })}
<figure class="gebiet-grosskarte" data-moment="ringe">${gebietskarte(sk, { praefix: 'gebiet-gk', radiusKm: ringe.at(-1) + 8, ringe, zelleKm: 5, beschriftet: 12, klasse: 'gebietskarte-gross', schrift: 1.6 })}${gebietsLegende(ringe)}</figure>
</div>
</section>`;
}

function zonen(sk, z, anzahl) {
  const { stufen, nl } = sk.konfig.zonen;
  const anfahrt = sk.konfig.preise.anfahrt;
  const radius = (s, i) => (s.bisKm === Infinity ? html`über <span data-daten="">${String(stufen[i - 1].bisKm)}</span>&nbsp;km` : html`bis <span data-daten="">${String(s.bisKm)}</span>&nbsp;km${s.auchKreis ? html` und der ganze ${sk.konfig.zonen.sitzKreis}` : ''}`);
  const anfahrtZeile = (id) => (id === 'B' && istPlatzhalter(anfahrt.B) ? html`${z.anfahrt.B}: ${betrag(anfahrt.B)}` : z.anfahrt[id]);
  return html`<section class="sektion" aria-labelledby="zonen-titel">
<div class="raster">
${abschnittKopf({ id: 'zonen-titel', titel: z.titel, einleitung: z.einleitung })}
<ol class="zonen">
${stufen.map((s, i) => html`<li class="zone zone-${s.id.toLowerCase()}">
<p class="zone-kennung"><span class="zone-buchstabe">${s.id}</span> ${s.titel}</p>
<p class="zone-radius">${radius(s, i)}</p>
<ul class="zone-merkmale">
<li>${z.notoeffnung[s.notoeffnung]}</li>
<li>${z.planbar}</li>
<li>${anfahrtZeile(s.id)}</li>
</ul>
<p class="zone-anzahl"><span data-daten="">${String(anzahl[s.id] || 0)}</span> ${z.orteZeile}</p>
</li>`)}
<li class="zone zone-nl">
<p class="zone-kennung"><span class="zone-buchstabe">NL</span> ${nl.titel}</p>
<p class="zone-radius">wie Zone ${nl.wieZone}, ohne Preisangaben</p>
<ul class="zone-merkmale"><li>${z.notoeffnung['nach-absprache']}</li><li>${z.planbar}</li></ul>
<p class="zone-anzahl"><span data-daten="">${String(anzahl.NL || 0)}</span> ${z.orteZeile}</p>
</li>
</ol>
</div>
</section>`;
}

function laender(sk, liste) {
  return html`<section class="sektion band" aria-labelledby="laender-titel">
<div class="raster">
${abschnittKopf({ id: 'laender-titel', titel: inhalt.laender.titel, einleitung: inhalt.laender.einleitung })}
<ul class="laender">${liste.map((l) => html`<li><a href="${l.pfad}"><span class="land-name">${l.titel}</span><span class="land-zahl"><span data-daten="">${String(l.anzahl)}</span> ${l.anzahl === 1 ? 'Ort' : 'Orte'} · ab <span data-daten="">${String(l.kmMin)}</span>&nbsp;km</span></a></li>`)}</ul>
</div>
</section>`;
}

export function seiten(k) {
  const { zonen: anzahl, laender: liste } = zaehlen(k.daten.orte || []);
  const ringe = k.konfig.zonen.stufen.filter((s) => s.bisKm !== Infinity).map((s) => s.bisKm);
  const stufen = [{ titel: 'Einsatzgebiet', pfad: '/einsatzgebiet/' }];
  return [{
    pfad: '/einsatzgebiet/', titel: inhalt.titel, beschreibung: inhalt.beschreibung, typ: 'erzaehlung', ansicht: 'V05',
    sitemap: 'hubs', koerperKlasse: 'seite-einsatzgebiet', stile: ['gebiet', 'einsatzgebiet'], brotkrumen: stufen,
    jsonld: [
      { '@context': 'https://schema.org', '@type': 'CollectionPage', '@id': `${k.basisUrl}/einsatzgebiet/#seite`, name: inhalt.titel, url: `${k.basisUrl}/einsatzgebiet/`, about: { '@id': `${k.basisUrl}/#betrieb` } },
      brotkrumenLd(k.basisUrl, stufen), faqLd(k.basisUrl, '/einsatzgebiet/', inhalt.faq),
    ],
    inhalt: (sk) => html`${kopf(sk)}
${karte(sk, ringe)}
${zonen(sk, inhalt.zonen, anzahl)}
${laender(sk, liste)}
<section class="sektion" aria-labelledby="faq-titel"><div class="raster"><div class="faq-teilung">
${abschnittKopf({ id: 'faq-titel', titel: 'Häufige Fragen' })}
${faq(sk, inhalt.faq)}
</div></div></section>
<section class="sektion band-dunkel schluss" aria-labelledby="schluss-titel">
<div class="raster"><div class="schluss-teilung">
<div><h2 id="schluss-titel">${inhalt.schluss.titel}</h2><p>${text(inhalt.schluss.text)}</p></div>
<div class="schluss-handlung"><a class="knopf knopf-sekundaer" href="${inhalt.schluss.link.pfad}">${inhalt.schluss.link.text}${sk.icon('pfeil-rechts')}</a></div>
</div></div>
</section>`,
  }];
}
