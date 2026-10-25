// V09 Über uns (Erzählansicht). Abschnittsfolge nach Themenpass /ueber-uns/:
// Kopf mit der Leitidee „Der gerade Weg“ (Leitsatz, Lahnbogen I-11 mit Fakt und M-20 als Blickfang des ersten
// Bildschirms) · Wer wir sind (Konfiguration; jede fehlende Angabe entfällt) · Wofür wir stehen (Band) ·
// Wie Sie uns erreichen (dunkles Band) · Weiterlesen. Locksmith-JSON-LD nur hier (Start, Über uns, Kontakt);
// keine Personen, keine Bewertungen.
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

// Die Leitidee steht im Kopf: Leitsatz links, der Lahnbogen rechts; der Fakt zum Tunnel erklärt das Bild in der
// Bildunterschrift (dort stört die Prüfmarke der Vorschau den Lead nicht). M-20 läuft hier einmal beim Laden
// (lahnbogen.css), weil die Figur von Anfang an im Bild ist – ein view()-Zeitstrahl wäre dort schon abgelaufen.
function kopf() {
  const w = inhalt.weg;
  return html`<section class="betrieb-kopf" aria-labelledby="ueber-h1">
<div class="raster"><div class="betrieb-kopf-teilung">
<div class="betrieb-kopf-text">
<span class="scherlinie scherlinie-leit kopf-linie" aria-hidden="true"></span>
<p class="gruppe-kicker">${inhalt.kicker}</p>
<h1 id="ueber-h1">${inhalt.h1}</h1>
<p class="betrieb-leitsatz">${text(w.text)}</p>
</div>
<figure class="betrieb-figur" data-moment="gerader-weg">${lahnbogen()}<figcaption>${w.bild} ${w.fakt}</figcaption></figure>
</div></div>
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
<ul class="ueber-gruppen">${l.GRUPPEN.map((g) => html`<li><a href="${g.pfad}">${sk.icon(g.icon, { klasse: 'ueber-gruppe-icon' })}<span class="ueber-gruppe-titel">${g.titel}</span><span class="ueber-gruppe-kurz">${g.kurz}</span></a></li>`)}</ul>
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
${ruf(sk)}
${weiter(sk)}`,
  }];
}
