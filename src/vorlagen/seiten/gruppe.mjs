// V02 Leistungsgruppe (Erzählansicht). Abschnittsfolge:
// Kopf mit Register der Gruppe (7/5) · Szene M-17 (Band) · Nachweis (Teilung 4/8) · Wissen (alle Textabschnitte in
// einem Registerblatt) · Abschnitt für Betriebe (dicht) · Preisauszug als Tabelle über die volle Breite (falls Preise) ·
// Häufige Fragen · Weiterlesen · Schlussband (dunkel) mit Anruf. Nach der Szene wechseln Papier und Band ab
// (Rhythmusregel K-006).
// Inhalte: src/inhalte/<gruppe>/index.mjs (nur Gruppen mit Inhaltsmodul werden gebaut).
import { access } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { html } from '../../../bau/lib/html.mjs';
import { text } from '../../../bau/lib/inhalt.mjs';
import { GRUPPEN } from '../../konfig/leistungen.mjs';
import { abschnittKopf } from '../teile/abschnitt.mjs';
import { faq, faqLd } from '../teile/faq.mjs';
import { brotkrumenLd } from '../teile/brotkrumen.mjs';
import { preistabelle } from '../teile/preisauszug.mjs';
import { rufknopf } from '../teile/rufknopf.mjs';
import { szene } from '../teile/szene.mjs';
import { zylinderSchnitt } from '../teile/illustrationen/zylinder.mjs';
import { tuerSchichten } from '../teile/illustrationen/tuerschichten.mjs';
import { grundriss } from '../teile/illustrationen/grundriss.mjs';
import { widerstandsStufen } from '../teile/illustrationen/stufen.mjs';

// Szenenfigur je Gruppe (M-17); jede liefert dekoratives SVG mit Schrittzuständen. Der Zylinder ist querformatig
// und füllt die Bühne auf dem Telefon schon in voller Breite: Er bekommt keine Stückliste daneben (QUER).
const QUER = new Set(['notoeffnung']);
const FIGUREN = {
  notoeffnung: ({ praefix, zustand }) => zylinderSchnitt({ praefix, zustand, schluessel: false, stiftAb: [2, 2, 3, 3, 3], linieAb: 4, dekorativ: true }),
  einbruchschutz: tuerSchichten,
  sicherheitstechnik: grundriss,
  'einbau-tresore': widerstandsStufen,
};

export function gruppenLd(sk, g, inhalt) {
  const basis = sk.basisUrl;
  const kreise = [...new Set((sk.daten.orte || []).filter((o) => o.zone === 'A').map((o) => o.kreis).filter(Boolean))].sort();
  return {
    '@context': 'https://schema.org', '@type': 'Service', '@id': `${basis}${g.pfad}#leistung`,
    name: g.titel, serviceType: g.titel, description: inhalt.beschreibung, url: `${basis}${g.pfad}`,
    provider: { '@id': `${basis}/#betrieb` },
    areaServed: (kreise.length ? kreise : [sk.konfig.betrieb.sitz.kreis]).map((k) => ({ '@type': 'AdministrativeArea', name: k })),
  };
}

// Kopf 7/5: Das Register rechts zeigt nur Icon und Name (zweispaltig ab 30em) und schließt damit neben dem Text in
// einer Bildschirmhöhe; der Kurzsatz je Leistung bleibt für Screenreader im Linknamen. Die Notöffnung ruft im Kopf
// erst ab 64em an – darunter trägt die Rufleiste den Anruf (wie V01), statt zweimal im ersten Bildschirm.
function kopf(sk, g, inh) {
  return html`<section class="gruppe-kopf" aria-labelledby="gruppe-titel">
<div class="raster"><div class="gruppe-kopf-teilung">
<div class="gruppe-kopf-text">
<span class="scherlinie scherlinie-leit kopf-linie" aria-hidden="true"></span>
<p class="gruppe-kicker"><span class="gruppe-nr">${g.nr}</span> ${inh.kicker}</p>
<h1 id="gruppe-titel">${inh.h1}</h1>
<p class="gruppe-einleitung">${text(inh.einleitung)}</p>
${g.id === 'notoeffnung'
    ? html`<div class="gruppe-handlung gruppe-handlung-ruf">${rufknopf(sk, { variante: 'gross' })}</div>`
    : html`<div class="gruppe-handlung"><a class="knopf knopf-primaer" href="/kontakt/">Beratung anfragen${sk.icon('pfeil-rechts')}</a></div>`}
</div>
<nav class="gruppe-register" aria-labelledby="gruppe-register-titel">
<h2 class="gruppe-register-titel" id="gruppe-register-titel">${inh.registerTitel}</h2>
<ul>${g.leistungen.map((l) => html`<li><a href="${l.pfad}">${sk.icon(l.icon, { klasse: 'gruppe-register-icon' })}<span class="gruppe-register-name">${l.titel}</span><span class="unsichtbar">: ${l.kurz}</span></a></li>`)}</ul>
</nav>
</div></div>
</section>`;
}

const flaeche = (band) => (band ? ' band' : '');
const absaetze = (a) => html`<div class="fliesstext">${a.absaetze.map((p) => html`<p>${text(p)}</p>`)}</div>`;

function nachweis(sk, n, band) {
  return html`<section class="sektion${flaeche(band)}" aria-labelledby="nachweis-titel">
<div class="raster"><div class="gruppe-teilung">
${abschnittKopf({ id: 'nachweis-titel', titel: n.titel, einleitung: n.einleitung })}
<dl class="nachweis">${n.eintraege.map((e) => html`<div class="nachweis-eintrag"><dt>${e.objekt}</dt><dd>${text(e.text)}</dd></div>`)}</dl>
</div></div>
</section>`;
}

// Wissen: Die Textabschnitte stehen als Registerblatt in einem Abschnitt statt als gleiche Teilungen hintereinander
// (die glichen sich in Fläche, Layout und Dichte). Bei ungerader Zahl führt der erste Abschnitt über die volle
// Breite, die übrigen stehen zweispaltig, jeder mit Haarlinie und Kupfermarke. Jeder Eintrag bleibt ein eigener
// Abschnitt mit H2 – es kommt keine erfundene Sammelüberschrift dazu.
function wissen(liste, band) {
  const mitLeit = liste.length % 2 === 1;
  return html`<div class="sektion gruppe-wissen${flaeche(band)}">
<div class="raster"><div class="gruppe-wissen-raster">
${liste.map((a, i) => {
    const id = `abschnitt-${i + 1}`;
    return mitLeit && i === 0
      ? html`<section class="gruppe-eintrag-leit" aria-labelledby="${id}">${abschnittKopf({ id, titel: a.titel })}${absaetze(a)}</section>`
      : html`<section class="gruppe-eintrag" aria-labelledby="${id}"><h2 class="gruppe-eintrag-titel" id="${id}">${text(a.titel)}</h2>${absaetze(a)}</section>`;
  })}
</div></div>
</div>`;
}

function textAbschnitt(id, a, { band = false, dicht = false } = {}) {
  return html`<section class="sektion${dicht ? ' sektion-dicht' : ''}${flaeche(band)}" aria-labelledby="${id}">
<div class="raster"><div class="gruppe-teilung">
${abschnittKopf({ id, titel: a.titel })}
${absaetze(a)}
</div></div>
</section>`;
}

// Preis als Tabelle über die volle Inhaltsbreite (Layout „Tabelle“ statt einer weiteren 4/8-Teilung, K-006): Die fünf
// Spalten bekommen Platz, und der Abschnitt hebt sich von Nachweis und Betrieben davor ab.
function preis(sk, p, band) {
  return html`<section class="sektion gruppe-preis${flaeche(band)}" aria-labelledby="gruppe-preis-titel">
<div class="raster">
${abschnittKopf({ id: 'gruppe-preis-titel', titel: p.titel, einleitung: p.text })}
<div class="preis-auszug">${preistabelle(sk, { positionen: p.positionen, id: 'gruppe-preise' })}</div>
</div>
</section>`;
}

function fragen(sk, liste, band) {
  return html`<section class="sektion${flaeche(band)}" aria-labelledby="faq-titel">
<div class="raster"><div class="faq-teilung">
${abschnittKopf({ id: 'faq-titel', titel: 'Häufige Fragen' })}
${faq(sk, liste)}
</div></div>
</section>`;
}

function weiter(sk, liste) {
  return html`<section class="sektion sektion-dicht" aria-labelledby="weiter-titel">
<div class="raster">
${abschnittKopf({ id: 'weiter-titel', titel: 'Weiterlesen' })}
<ul class="weiter">${liste.map((w) => html`<li><a href="${w.pfad}"><span class="weiter-titel">${w.titel}</span><span class="weiter-text">${w.text}</span>${sk.icon('pfeil-rechts', { klasse: 'weiter-pfeil' })}</a></li>`)}</ul>
</div>
</section>`;
}

// Schlussband mit Abschnittsmarke wie jeder Abschnittskopf: Die Kupferlinie (P1) reißt nicht vor der Handlung ab,
// die zur nächsten Seite führt.
function schluss(sk, s, notfall) {
  return html`<section class="sektion band-dunkel schluss" aria-labelledby="schluss-titel">
<div class="raster"><div class="schluss-teilung">
${abschnittKopf({ id: 'schluss-titel', titel: s.titel, einleitung: s.text })}
<div class="schluss-handlung">${notfall ? rufknopf(sk, { variante: 'gross' }) : ''}<a class="knopf knopf-sekundaer" href="${s.link.pfad}">${s.link.text}${sk.icon('pfeil-rechts')}</a></div>
</div></div>
</section>`;
}

// Abschnitte zwischen Szene (Band) und Weiterlesen (Papier, dicht): Die Fläche wechselt ab Papier, damit sich
// Nachbarn immer in der Fläche und zusätzlich in Layout oder Dichte unterscheiden (K-006).
function mittelteil(sk, inh) {
  const folge = [
    inh.nachweis && ((band) => nachweis(sk, inh.nachweis, band)),
    inh.abschnitte?.length && ((band) => wissen(inh.abschnitte, band)),
    inh.betriebe && ((band) => textAbschnitt('betriebe-titel', inh.betriebe, { band, dicht: true })),
    inh.preis && ((band) => preis(sk, inh.preis, band)),
    (band) => fragen(sk, inh.faq, band),
  ].filter(Boolean);
  return folge.map((abschnitt, i) => abschnitt(i % 2 === 1));
}

async function inhaltLaden(wurzel, id) {
  const datei = join(wurzel, 'src/inhalte', id, 'index.mjs');
  try { await access(datei); } catch { return null; }
  return (await import(pathToFileURL(datei).href)).default;
}

export async function seiten(k) {
  const aus = [];
  for (const g of GRUPPEN) {
    const inh = await inhaltLaden(k.wurzel, g.id);
    if (!inh) continue;
    const stufen = [{ titel: g.titel, pfad: g.pfad }];
    aus.push({
      pfad: g.pfad, titel: inh.titel, beschreibung: inh.beschreibung, typ: 'erzaehlung', ansicht: 'V02',
      sitemap: 'leistungen', koerperKlasse: `seite-gruppe seite-gruppe-${g.id}`, stile: ['register', 'gruppe'], ogBild: `/assets/og/${g.id}.png`, brotkrumen: stufen,
      jsonld: [gruppenLd(k, g, inh), brotkrumenLd(k.basisUrl, stufen), faqLd(k.basisUrl, g.pfad, inh.faq)],
      inhalt: (sk) => html`${kopf(sk, g, inh)}
${szene({ id: 'szene', titel: inh.szene.titel, einleitung: inh.szene.einleitung, figur: FIGUREN[g.id], schritte: inh.szene.schritte, klasse: 'band', liste: !QUER.has(g.id) })}
${mittelteil(sk, inh)}
${weiter(sk, inh.weiter)}
${schluss(sk, inh.schluss, g.id === 'notoeffnung')}`,
    });
  }
  return aus;
}
