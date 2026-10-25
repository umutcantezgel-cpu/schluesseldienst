// V09 Karriere (Arbeitsansicht). Nur mit konfigurierten Stellen (betrieb.stellen): ohne Stellen liefert seiten()
// eine leere Liste, dann entsteht keine Seite (Routenregister: bedingung „stellen“).
// Je Stelle: Titel, Umfang, Ort, Aufgaben, Anforderungen, E-Mail-Kontakt. Fehlende Angaben entfallen.
// JSON-LD je Stelle: JobPosting nur mit konfigurierten Feldern, ohne Gehalt.
import { html, attrUrl } from '../../../bau/lib/html.mjs';
import { text } from '../../../bau/lib/inhalt.mjs';
import { istPlatzhalter } from '../../../bau/lib/platzhalter.mjs';
import inhalt from '../../inhalte/karriere.mjs';
import { abschnittKopf } from '../teile/abschnitt.mjs';
import { brotkrumenLd } from '../teile/brotkrumen.mjs';

const liste = (w) => (Array.isArray(w) ? w.filter(Boolean) : []);
const vorhanden = (w) => w !== undefined && w !== null && w !== '' && !(Array.isArray(w) && w.length === 0);

function kopf() {
  return html`<section class="betrieb-kopf" aria-labelledby="karriere-h1">
<div class="raster">
<span class="scherlinie scherlinie-leit kopf-linie" aria-hidden="true"></span>
<p class="gruppe-kicker">${inhalt.kicker}</p>
<h1 id="karriere-h1">${inhalt.h1}</h1>
<p class="gruppe-einleitung">${text(inhalt.einleitung)}</p>
</div>
</section>`;
}

function stelle(sk, s) {
  const email = sk.konfig.betrieb.email;
  const offen = istPlatzhalter(email);
  const angaben = [['Umfang', s.umfang], ['Ort', s.ort]].filter(([, w]) => vorhanden(w));
  return html`<article class="stelle" aria-labelledby="stelle-${s.id}-titel">
${abschnittKopf({ id: `stelle-${s.id}-titel`, titel: s.titel })}
${angaben.length ? html`<dl class="stelle-daten">${angaben.map(([t, w]) => html`<div><dt>${t}</dt><dd>${w}</dd></div>`)}</dl>` : ''}
${liste(s.aufgaben).length ? html`<h3 class="stelle-unter">Aufgaben</h3><ul class="stelle-liste">${liste(s.aufgaben).map((a) => html`<li>${a}</li>`)}</ul>` : ''}
${liste(s.anforderungen).length ? html`<h3 class="stelle-unter">Anforderungen</h3><ul class="stelle-liste">${liste(s.anforderungen).map((a) => html`<li>${a}</li>`)}</ul>` : ''}
<p class="stelle-kontakt">${inhalt.kontakt} ${offen ? email : html`<a href="${attrUrl(`mailto:${email}`)}">${email}</a>`}.</p>
</article>`;
}

// JobPosting je Stelle: nur konfigurierte Felder. Aufgaben und Anforderungen als responsibilities/qualifications.
function stelleLd(k, s) {
  const ld = { '@context': 'https://schema.org', '@type': 'JobPosting', '@id': `${k.basisUrl}/karriere/#${s.id}`, title: s.titel, hiringOrganization: { '@id': `${k.basisUrl}/#betrieb` } };
  if (vorhanden(s.umfang)) ld.employmentType = s.umfang;
  if (vorhanden(s.ort)) ld.jobLocation = { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: s.ort } };
  if (liste(s.aufgaben).length) ld.responsibilities = liste(s.aufgaben).join('; ');
  if (liste(s.anforderungen).length) ld.qualifications = liste(s.anforderungen).join('; ');
  return ld;
}

function weiter(sk) {
  return html`<section class="sektion sektion-dicht" aria-labelledby="weiter-titel">
<div class="raster">
${abschnittKopf({ id: 'weiter-titel', titel: 'Weiterlesen' })}
<ul class="weiter">${inhalt.weiter.map((w) => html`<li><a href="${w.pfad}"><span class="weiter-titel">${w.titel}</span><span class="weiter-text">${w.text}</span>${sk.icon('pfeil-rechts', { klasse: 'weiter-pfeil' })}</a></li>`)}</ul>
</div>
</section>`;
}

export function seiten(k) {
  const stellen = liste(k.konfig.betrieb.stellen);
  if (!stellen.length) return [];
  const stufen = [{ titel: 'Über uns', pfad: '/ueber-uns/' }, { titel: 'Karriere', pfad: '/karriere/' }];
  return [{
    pfad: '/karriere/', titel: inhalt.titel, beschreibung: inhalt.beschreibung, typ: 'arbeit', ansicht: 'V09', sitemap: 'seiten',
    koerperKlasse: 'seite-karriere', stile: ['betrieb'], brotkrumen: stufen,
    jsonld: [
      { '@context': 'https://schema.org', '@type': 'CollectionPage', '@id': `${k.basisUrl}/karriere/#seite`, url: `${k.basisUrl}/karriere/`, name: inhalt.titel, about: { '@id': `${k.basisUrl}/#betrieb` } },
      brotkrumenLd(k.basisUrl, stufen),
      ...stellen.map((s) => stelleLd(k, s)),
    ],
    inhalt: (sk) => html`${kopf()}
<section class="sektion band" aria-labelledby="stellen-titel">
<div class="raster"><h2 class="unsichtbar" id="stellen-titel">Offene Stellen</h2><div class="stellen">${stellen.map((s) => stelle(sk, s))}</div></div>
</section>
${weiter(sk)}`,
  }];
}
