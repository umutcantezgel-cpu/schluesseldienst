// V10 Kontakt (Arbeitsansicht). Abschnittsfolge nach Themenpass /kontakt/:
// Kopf mit zwei Wegen (Notfall anrufen | Planbares schreiben) · Composer (Band) · Erreichbarkeit und Anschrift (6/6) ·
// FAQ (Band) · Weiterlesen. Der Composer ist ein <form method="get" action="mailto:…"> (S12): ohne JS sendet er nur
// subject und body, mit JS baut das Modul composer eine geprüfte mailto:-Adresse aus allen Feldern.
import { html, attrUrl } from '../../../bau/lib/html.mjs';
import { text } from '../../../bau/lib/inhalt.mjs';
import { istPlatzhalter } from '../../../bau/lib/platzhalter.mjs';
import inhalt from '../../inhalte/kontakt.mjs';
import { abschnittKopf } from '../teile/abschnitt.mjs';
import { faq, faqLd } from '../teile/faq.mjs';
import { brotkrumenLd } from '../teile/brotkrumen.mjs';
import { rufknopf } from '../teile/rufknopf.mjs';
import { betriebLd } from './start.mjs';

const TAGE = [['mo', 'Montag'], ['di', 'Dienstag'], ['mi', 'Mittwoch'], ['do', 'Donnerstag'], ['fr', 'Freitag'], ['sa', 'Samstag'], ['so', 'Sonntag']];
const REGELN = [
  { id: 'k-ort', titel: 'Ort oder Postleitzahl', pflicht: true },
  { id: 'k-nachricht', titel: 'Ihre Nachricht', pflicht: true, min: 10 },
];

function kopf(sk) {
  const { notfall: n, planbar: p } = inhalt;
  return html`<section class="kontakt-kopf" aria-labelledby="kontakt-h1">
<div class="raster">
<p class="gruppe-kicker">${inhalt.kicker}</p>
<h1 id="kontakt-h1">${inhalt.h1}</h1>
<p class="gruppe-einleitung">${text(inhalt.einleitung)}</p>
<div class="kontakt-wege">
<section class="kontakt-weg kontakt-weg-notfall" aria-labelledby="weg-notfall">
${sk.icon('telefon-nacht', { klasse: 'kontakt-weg-icon' })}
<h2 id="weg-notfall">${n.titel}</h2>
<p>${text(n.text)}</p>
${rufknopf(sk, { variante: 'gross' })}
</section>
<section class="kontakt-weg" aria-labelledby="weg-planbar">
${sk.icon('mail', { klasse: 'kontakt-weg-icon' })}
<h2 id="weg-planbar">${p.titel}</h2>
<p>${text(p.text)}</p>
<p><a class="knopf knopf-sekundaer" href="#anfrage-titel">${p.link}${sk.icon('pfeil-rechts')}</a></p>
</section>
</div>
</div>
</section>`;
}

function feld(sk, id, f, { pflicht = false, mehrzeilig = false, typ = 'text', autocomplete = 'off', nurJs = true, name = null } = {}) {
  const beschreibung = f.hilfe ? `${id}-hilfe ${id}-fehler` : `${id}-fehler`;
  const eingabe = mehrzeilig
    ? html`<textarea class="composer-eingabe" id="${id}" rows="6"${name ? html` name="${name}"` : ''} data-feld-nachricht="" aria-describedby="${beschreibung}"${pflicht ? html` required` : ''}></textarea>`
    : html`<input class="composer-eingabe" id="${id}" type="${typ}" autocomplete="${autocomplete}" data-feld="${f.titel}" aria-describedby="${beschreibung}"${pflicht ? html` required` : ''}>`;
  return html`<div class="composer-feld"${nurJs ? html` data-nur-js="" hidden` : ''}>
<label for="${id}">${f.titel}${pflicht ? '' : html` <span class="composer-frei">(freiwillig)</span>`}</label>
${f.hilfe ? html`<p class="composer-hilfe" id="${id}-hilfe">${f.hilfe}</p>` : ''}
<p class="composer-fehler" id="${id}-fehler" hidden></p>
${eingabe}
</div>`;
}

function composer(sk) {
  const c = inhalt.composer;
  const email = sk.konfig.betrieb.email;
  const offen = istPlatzhalter(email);
  const f = c.felder;
  const felder = html`<fieldset class="composer-anliegen"><legend>${c.anliegenTitel}</legend>
<div class="composer-optionen">${c.anliegen.map((a, i) => html`<label class="wahl-option"><input type="radio" name="anliegen" value="${a.wert}" data-betreff="${a.betreff}"${i === 1 ? html` checked` : ''}><span class="wahl-option-text"><span class="wahl-option-titel">${a.titel}</span>${a.text ? html`<span class="wahl-option-zusatz">${a.text}</span>` : ''}</span></label>`)}</div>
</fieldset>
<div class="composer-notfall" data-rolle="notfall" hidden>
<p>${c.notfallText}</p>
${rufknopf(sk, { variante: 'gross' })}
</div>
<div class="composer-mail" data-rolle="mail">
<div class="composer-fehlerliste" data-rolle="fehler" tabindex="-1" role="alert" hidden>
<p class="composer-fehler-titel">${c.fehlerTitel}</p>
<ul></ul>
</div>
<div class="composer-felder">
${feld(sk, 'k-ort', f.ort, { pflicht: true, autocomplete: 'address-level2' })}
${feld(sk, 'k-name', f.name, { autocomplete: 'name' })}
${feld(sk, 'k-rueckruf', f.rueckruf, { typ: 'tel', autocomplete: 'tel' })}
${feld(sk, 'k-zeitraum', f.zeitraum)}
</div>
${feld(sk, 'k-nachricht', f.nachricht, { pflicht: true, mehrzeilig: true, nurJs: false, name: 'body' })}
<p class="composer-warnung">${sk.icon('warnung', { klasse: 'composer-warnung-icon' })}<span>${c.warnung}</span></p>
<p class="composer-gekuerzt" data-rolle="gekuerzt" hidden>${c.gekuerzt}</p>
<div class="composer-handlung">
<button class="knopf knopf-primaer" type="submit">${c.knopf}${sk.icon('mail')}</button>
<p class="composer-direkt">${c.ohneProgramm} ${offen ? email : html`<a href="${attrUrl(`mailto:${email}`)}">${email}</a>`}.</p>
</div>
</div>`;
  // Ohne konfigurierte Adresse gibt es kein Ziel: Gruppe statt Formular, Platzhalter sichtbar (Release gesperrt)
  if (offen) return html`<div class="composer" data-zustand="platzhalter">${felder}</div>`;
  return html`<form class="composer" method="get" action="${attrUrl(`mailto:${email}`)}" data-modul="composer" data-an="${email}" data-regeln="${JSON.stringify(REGELN)}" novalidate>
<input type="hidden" name="subject" value="Anfrage über die Website">
${felder}
</form>`;
}

function zeitenTabelle(sk) {
  const z = sk.konfig.betrieb.erreichbarkeit;
  if (istPlatzhalter(z.zeiten)) return html`<p class="kontakt-zeiten-offen">${z.zeiten}</p>`;
  const zeile = (tag) => (z.zeiten[tag]?.length ? z.zeiten[tag].map(([von, bis]) => `${von}–${bis}`).join(', ') : 'nicht erreichbar');
  return html`<table class="preis-tabelle kontakt-zeiten"><caption>Telefon</caption>
<tbody>${TAGE.map(([id, name]) => html`<tr><th scope="row">${name}</th><td data-titel="${name}"><span data-daten="">${zeile(id)}</span></td></tr>`)}</tbody></table>
${istPlatzhalter(z.nachtdienst) ? html`<p>${z.nachtdienst}</p>` : html`<p>${z.nachtdienst ? 'Außerhalb dieser Zeiten: Nachtdienst mit Zuschlag laut Preisliste.' : 'Außerhalb dieser Zeiten gibt es keinen Nachtdienst.'}</p>`}`;
}

function zeitenUndAnschrift(sk) {
  const { adresse, name } = sk.konfig.betrieb;
  return html`<section class="sektion" aria-label="Erreichbarkeit und Anschrift">
<div class="raster"><div class="kontakt-teilung">
<section aria-labelledby="zeiten-titel">
${abschnittKopf({ id: 'zeiten-titel', titel: inhalt.zeiten.titel, einleitung: inhalt.zeiten.text })}
${zeitenTabelle(sk)}
<p><a href="/preise/">Preise je Zeitfenster</a></p>
</section>
<section aria-labelledby="anschrift-titel">
${abschnittKopf({ id: 'anschrift-titel', titel: inhalt.anschrift.titel, einleitung: inhalt.anschrift.text })}
<address class="kontakt-anschrift">${name}<br>${adresse.strasse}<br>${adresse.plz} ${adresse.ort}</address>
<p><a href="/einsatzgebiet/">Einsatzgebiet und Zonen</a></p>
</section>
</div></div>
</section>`;
}

export function seiten(k) {
  const stufen = [{ titel: 'Kontakt', pfad: '/kontakt/' }];
  return [{
    pfad: '/kontakt/', titel: inhalt.titel, beschreibung: inhalt.beschreibung, typ: 'arbeit', ansicht: 'V10', sitemap: 'seiten',
    koerperKlasse: 'seite-kontakt', stile: ['kontakt'], brotkrumen: stufen,
    jsonld: [
      { '@context': 'https://schema.org', '@type': 'ContactPage', '@id': `${k.basisUrl}/kontakt/#seite`, url: `${k.basisUrl}/kontakt/`, name: inhalt.titel, about: { '@id': `${k.basisUrl}/#betrieb` } },
      // Locksmith nur auf Start, Über uns und Kontakt (PLAN SEO)
      betriebLd({ ...k }), brotkrumenLd(k.basisUrl, stufen), faqLd(k.basisUrl, '/kontakt/', inhalt.faq),
    ],
    inhalt: (sk) => html`${kopf(sk)}
<section class="sektion band" aria-labelledby="anfrage-titel">
<div class="raster"><div class="kontakt-composer-teilung">
${abschnittKopf({ id: 'anfrage-titel', titel: inhalt.composer.titel, einleitung: inhalt.composer.einleitung })}
${composer(sk)}
</div></div>
</section>
${zeitenUndAnschrift(sk)}
<section class="sektion band" aria-labelledby="faq-titel"><div class="raster"><div class="faq-teilung">
${abschnittKopf({ id: 'faq-titel', titel: 'Häufige Fragen' })}
${faq(sk, inhalt.faq)}
</div></div></section>
<section class="sektion sektion-dicht" aria-labelledby="weiter-titel">
<div class="raster">
${abschnittKopf({ id: 'weiter-titel', titel: 'Weiterlesen' })}
<ul class="weiter">${inhalt.weiter.map((w) => html`<li><a href="${w.pfad}"><span class="weiter-titel">${w.titel}</span><span class="weiter-text">${w.text}</span>${sk.icon('pfeil-rechts', { klasse: 'weiter-pfeil' })}</a></li>`)}</ul>
</div>
</section>`,
  }];
}
