// V01 Startseite – Referenzansicht (Erzählansicht). Abschnittsfolge nach KERN K-006:
// Hero (7/5) · Was jetzt hilft (Band) · Preis vor Arbeit · Leistungen (Register) · Ablauf ·
// Einsatzgebiet · Seriös erkennen (dunkles Band) · Häufige Fragen.
import { html } from '../../../bau/lib/html.mjs';
import { text } from '../../../bau/lib/inhalt.mjs';
import { istPlatzhalter } from '../../../bau/lib/platzhalter.mjs';
import inhalt from '../../inhalte/start.mjs';
import { abschnittKopf } from '../teile/abschnitt.mjs';
import { faq, faqLd } from '../teile/faq.mjs';
import { preistabelle } from '../teile/preisauszug.mjs';
import { leistungsRegister } from '../teile/register.mjs';
import { ortspruefung } from '../teile/ortspruefung.mjs';
import { rufknopf } from '../teile/rufknopf.mjs';
import { zusage } from '../teile/zusage.mjs';
import { gebietskarte, gebietsLegende } from '../teile/gebietskarte.mjs';
import { zylinderSchnitt } from '../teile/illustrationen/zylinder.mjs';
import { rechnungIllustration } from '../teile/illustrationen/rechnung.mjs';

export function betriebLd(sk) {
  const { betrieb } = sk.konfig;
  const basis = sk.basisUrl;
  const kreise = [...new Set((sk.daten.orte || []).filter((o) => o.zone === 'A' || o.zone === 'B').map((o) => o.kreis).filter(Boolean))].sort();
  return {
    '@context': 'https://schema.org', '@type': 'Locksmith', '@id': `${basis}/#betrieb`,
    name: betrieb.name, url: `${basis}/`, telephone: betrieb.telefon.e164, email: betrieb.email,
    address: { '@type': 'PostalAddress', streetAddress: betrieb.adresse.strasse, postalCode: betrieb.adresse.plz, addressLocality: betrieb.adresse.ort, addressCountry: 'DE' },
    areaServed: (kreise.length ? kreise : [betrieb.sitz.kreis]).map((k) => ({ '@type': 'AdministrativeArea', name: k })),
  };
}

export function websiteLd(sk) {
  return { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${sk.basisUrl}/#website`, url: `${sk.basisUrl}/`, name: sk.konfig.betrieb.name, inLanguage: 'de', publisher: { '@id': `${sk.basisUrl}/#betrieb` } };
}

function hero(sk) {
  const h = inhalt.hero;
  return html`<section class="hero" aria-labelledby="hero-titel">
<div class="hero-kopf">
<span class="scherlinie scherlinie-leit kopf-linie" aria-hidden="true"></span>
<p class="hero-kicker">${h.kicker}</p>
<h1 id="hero-titel">${h.h1.map((z, i) => html`${i ? ' ' : ''}<span class="h1-zeile">${z}</span>`)}</h1>
</div>
<figure class="hero-figur" id="hero-figur" data-moment="scherlinie">
${zylinderSchnitt({ praefix: 'hero-zy' })}
<figcaption class="hero-figur-text">Liegen alle Stifte auf der Scherlinie, dreht sich der Kern – ohne Gewalt.
<button class="knopf knopf-still hero-abspielen" type="button" data-modul="abspielen" aria-controls="hero-figur">${h.abspielen}</button></figcaption>
</figure>
<div class="hero-rest">
<p class="hero-einleitung">${text(h.text)}</p>
<div class="hero-handlung">${rufknopf(sk, { variante: 'gross' })}</div>
${ortspruefung(sk, { id: 'hero-ort', titel: h.pruefTitel, hinweis: h.pruefHinweis })}
</div>
</section>`;
}

function triage(sk) {
  const t = inhalt.triage;
  return html`<section class="sektion band" aria-labelledby="triage-titel">
<div class="raster">
${abschnittKopf({ id: 'triage-titel', titel: t.titel, einleitung: t.einleitung })}
<ol class="triage">
${t.faelle.map((f, i) => html`<li class="triage-fall">
<div class="triage-kopf">${sk.icon(f.icon, { klasse: 'triage-icon' })}<h3>${f.titel}</h3></div>
<ol class="triage-schritte">${f.schritte.map((s) => html`<li>${text(s)}</li>`)}</ol>
<p class="triage-link"><a href="${f.link.pfad}">${f.link.text}</a></p>
</li>`)}
</ol>
</div>
</section>`;
}

function preisAbschnitt(sk) {
  const p = inhalt.preis;
  const offen = istPlatzhalter(sk.konfig.preise.positionen[0].preise.werktag);
  return html`<section class="sektion" aria-labelledby="preis-titel">
<div class="raster"><div class="preis-teilung">
<div class="preis-aussage">
${abschnittKopf({ id: 'preis-titel', titel: p.titel })}
<p class="preis-aussage-text">${text(p.aussage)}</p>
<ul class="preis-faktoren">${p.faktoren.map((f) => html`<li>${sk.icon(f.icon, { klasse: 'preis-faktor-icon' })}<span>${f.text}</span></li>`)}</ul>
<p>${zusage(sk, 'preisVorAuftrag', p.zusageJa, p.zusageNein)}</p>
<p><a class="knopf knopf-sekundaer" href="/preise/">${p.link}${sk.icon('pfeil-rechts')}</a></p>
</div>
<div class="preis-auszug">
${preistabelle(sk, { positionen: p.positionen, id: 'start-preise' })}
${offen ? html`<p class="hinweis hinweis-platzhalter">Die Preisliste des Betriebs wird noch eingetragen; bis dahin stehen hier Platzhalter.</p>` : ''}
</div>
</div></div>
</section>`;
}

function leistungen(sk) {
  const l = inhalt.leistungen;
  return html`<section class="sektion band" aria-labelledby="leistungen-titel">
<div class="raster">
${abschnittKopf({ id: 'leistungen-titel', titel: l.titel, einleitung: l.einleitung })}
${leistungsRegister(sk)}
</div>
</section>`;
}

function ablauf(sk) {
  const a = inhalt.ablauf;
  return html`<section class="sektion" aria-labelledby="ablauf-titel">
<div class="raster">
${abschnittKopf({ id: 'ablauf-titel', titel: a.titel })}
<ol class="ablauf">
${a.schritte.map((s, i) => html`<li class="ablauf-schritt">
<span class="ablauf-nr" aria-hidden="true">${String(i + 1)}</span>
<h3 class="ablauf-titel">${s.titel}</h3>
<p>${s.zusage ? zusage(sk, s.zusage, s.ja, s.nein) : s.text}</p>
</li>`)}
</ol>
</div>
</section>`;
}

function gebiet(sk) {
  const g = inhalt.gebiet;
  const kern = (sk.daten.orte || []).filter((o) => o.zone === 'A' && o.typ === 'gemeinde' && o.staat === 'DE').sort((a, b) => a.km - b.km || a.name.localeCompare(b.name, 'de'));
  return html`<section class="sektion band" aria-labelledby="gebiet-titel">
<div class="raster"><div class="gebiet-teilung">
<div class="gebiet-text">
${abschnittKopf({ id: 'gebiet-titel', titel: g.titel, einleitung: g.text })}
${kern.length ? html`<h3 class="gebiet-liste-titel">Kerngebiet: ${String(kern.length)} Gemeinden</h3>
<ul class="gebiet-liste">${kern.slice(0, 18).map((o) => html`<li><a href="/schluesseldienst-${o.slug}/">${o.name}</a> <span class="gebiet-km" data-daten="">${String(o.km)}&nbsp;km</span></li>`)}</ul>` : ''}
<p><a class="knopf knopf-sekundaer" href="/einsatzgebiet/">${g.link}${sk.icon('pfeil-rechts')}</a></p>
</div>
<figure class="gebiet-figur">${gebietskarte(sk, { praefix: 'start-gk' })}${gebietsLegende()}</figure>
</div></div>
</section>`;
}

function serioes(sk) {
  const s = inhalt.serioes;
  return html`<section class="sektion band-dunkel" aria-labelledby="serioes-titel">
<div class="raster"><div class="serioes-teilung">
<figure class="serioes-figur">${rechnungIllustration()}</figure>
<div class="serioes-text">
${abschnittKopf({ id: 'serioes-titel', titel: s.titel, einleitung: s.einleitung })}
<ol class="checkliste">${s.punkte.map((p) => html`<li>${sk.icon('haken', { klasse: 'checkliste-icon' })}<span>${text(p)}</span></li>`)}</ol>
<p><a href="${s.link.pfad}">${s.link.text}</a></p>
</div>
</div></div>
</section>`;
}

function fragen(sk) {
  const f = inhalt.faq;
  return html`<section class="sektion" aria-labelledby="faq-titel">
<div class="raster"><div class="faq-teilung">
${abschnittKopf({ id: 'faq-titel', titel: f.titel })}
${faq(sk, f.fragen)}
</div></div>
</section>`;
}

export function seiten(k) {
  return [{
    pfad: '/', titel: inhalt.titel, titelOhneMarke: false, beschreibung: inhalt.beschreibung,
    typ: 'erzaehlung', ansicht: 'V01', sitemap: 'seiten', koerperKlasse: 'seite-start', stile: ['start', 'register', 'gebiet'],
    jsonld: [betriebLd({ ...k }), websiteLd(k), faqLd(k.basisUrl, '/', inhalt.faq.fragen)],
    inhalt: (sk) => html`${hero(sk)}
${triage(sk)}
${preisAbschnitt(sk)}
${leistungen(sk)}
${ablauf(sk)}
${gebiet(sk)}
${serioes(sk)}
${fragen(sk)}`,
  }];
}
