// V09 Über uns (Erzählansicht). Abschnittsfolge nach Themenpass /ueber-uns/:
// Kopf · Wer wir sind (Konfiguration; jede fehlende Angabe entfällt) · Wofür wir stehen (Band, drei Karten) ·
// Der gerade Weg (Leitidee mit Fakt und leerem Figurplatz für E4-OPUS-05) · Wie Sie uns erreichen (dunkles Band) ·
// Weiterlesen. Locksmith-JSON-LD nur hier (Start, Über uns, Kontakt); keine Personen, keine Bewertungen.
import { html } from '../../../bau/lib/html.mjs';
import { text } from '../../../bau/lib/inhalt.mjs';
import inhalt from '../../inhalte/ueber-uns.mjs';
import { abschnittKopf } from '../teile/abschnitt.mjs';
import { brotkrumenLd } from '../teile/brotkrumen.mjs';
import { rufknopf } from '../teile/rufknopf.mjs';
import { betriebLd } from './start.mjs';
import { lahnbogen } from '../teile/illustrationen/lahnbogen.mjs';

const liste = (w) => (Array.isArray(w) ? w.filter(Boolean) : []);
const eintrag = (m) => (typeof m === 'string' ? m : [m.name, m.rolle].filter(Boolean).join(', '));

function kopf() {
  return html`<section class="betrieb-kopf" aria-labelledby="ueber-h1">
<div class="raster">
<span class="scherlinie scherlinie-leit kopf-linie" aria-hidden="true"></span>
<p class="gruppe-kicker">${inhalt.kicker}</p>
<h1 id="ueber-h1">${inhalt.h1}</h1>
<p class="gruppe-einleitung">${text(inhalt.einleitung)}</p>
</div>
</section>`;
}

// Jeder Satz über eine Angabe steht nur, wenn die Angabe gesetzt ist (Gründung, Qualifikationen, Team, Stellen).
function wer(sk) {
  const { betrieb: b, leistungen: l } = sk.konfig;
  const { sitz } = b;
  const qualifikationen = liste(b.qualifikationen);
  const team = liste(b.team);
  return html`<section class="sektion" aria-labelledby="wer-titel">
<div class="raster"><div class="ueber-teilung">
${abschnittKopf({ id: 'wer-titel', titel: inhalt.wer.titel })}
<div class="fliesstext ueber-wer">
<p>${b.name} hat seinen Sitz in ${sitz.gemeinde} (${sitz.kreis}, ${sitz.land}).</p>
<p>Unsere Leistungen sind in Gruppen gegliedert:</p>
<ul class="ueber-gruppen">${l.GRUPPEN.map((g) => html`<li><a href="${g.pfad}">${g.titel}</a></li>`)}</ul>
${b.gruendungsjahr ? html`<p>Der Betrieb wurde <span data-daten="">${String(b.gruendungsjahr)}</span> gegründet.</p>` : ''}
${qualifikationen.length ? html`<h3 class="ueber-unter">Qualifikationen</h3><ul class="ueber-liste">${qualifikationen.map((q) => html`<li>${q}</li>`)}</ul>` : ''}
${team.length ? html`<h3 class="ueber-unter">Team</h3><ul class="ueber-liste">${team.map((m) => html`<li>${eintrag(m)}</li>`)}</ul>` : ''}
${liste(b.stellen).length ? html`<p>Offene Stellen stehen auf der <a href="/karriere/">Karriereseite</a>.</p>` : ''}
</div>
</div></div>
</section>`;
}

function werte() {
  const w = inhalt.werte;
  return html`<section class="sektion-dicht band" aria-labelledby="werte-titel">
<div class="raster">
${abschnittKopf({ id: 'werte-titel', titel: w.titel })}
<ul class="ueber-werte">${w.eintraege.map((e) => html`<li class="ueber-wert"><h3>${e.titel}</h3><p>${text(e.text)}</p></li>`)}</ul>
</div>
</section>`;
}

// Leitidee: der Fakt aus dem Faktenblatt steht als Satz, daneben der stilisierte Lahnbogen (I-11) mit M-20 „Der gerade Weg“.
function weg() {
  const w = inhalt.weg;
  return html`<section class="sektion" aria-labelledby="weg-titel">
<div class="raster"><div class="ueber-weg">
<div class="fliesstext">
${abschnittKopf({ id: 'weg-titel', titel: w.titel })}
<p>${w.fakt}</p>
<p>${text(w.text)}</p>
</div>
<figure class="betrieb-figur" data-moment="gerader-weg">${lahnbogen()}<figcaption>Stilisiert, ohne Maßstab: die Lahnschleife bei Weilburg und der Schiffstunnel als gerader Weg.</figcaption></figure>
</div></div>
</section>`;
}

function ruf(sk) {
  const r = inhalt.ruf;
  return html`<section class="sektion band-dunkel" aria-labelledby="ruf-titel">
<div class="raster"><div class="ueber-ruf">
${abschnittKopf({ id: 'ruf-titel', titel: r.titel, einleitung: r.text })}
<div class="ueber-ruf-handlung">
${rufknopf(sk, { variante: 'gross' })}
<p><a class="knopf knopf-sekundaer" href="${r.link.pfad}">${r.link.text}${sk.icon('pfeil-rechts')}</a></p>
</div>
</div></div>
</section>`;
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
  const stufen = [{ titel: 'Über uns', pfad: '/ueber-uns/' }];
  return [{
    pfad: '/ueber-uns/', titel: inhalt.titel, beschreibung: inhalt.beschreibung, typ: 'erzaehlung', ansicht: 'V09', sitemap: 'seiten',
    koerperKlasse: 'seite-ueber-uns', stile: ['betrieb', 'lahnbogen'], brotkrumen: stufen,
    jsonld: [
      { '@context': 'https://schema.org', '@type': 'AboutPage', '@id': `${k.basisUrl}/ueber-uns/#seite`, url: `${k.basisUrl}/ueber-uns/`, name: inhalt.titel, about: { '@id': `${k.basisUrl}/#betrieb` } },
      // Locksmith nur auf Start, Über uns und Kontakt (PLAN SEO)
      betriebLd({ ...k }), brotkrumenLd(k.basisUrl, stufen),
    ],
    inhalt: (sk) => html`${kopf()}
${wer(sk)}
${werte()}
${weg()}
${ruf(sk)}
${weiter(sk)}`,
  }];
}
