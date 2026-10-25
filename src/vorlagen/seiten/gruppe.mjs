// V02 Leistungsgruppe (Erzählansicht). Abschnittsfolge:
// Kopf mit Register der Gruppe (7/5) · Szene M-17 (Band) · Nachweis/Inhalt (Teilung 4/8) · Abschnitt für Betriebe ·
// Preisauszug (falls Preise) · Häufige Fragen · Weiterlesen · Schlussband (dunkel) mit Anruf.
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

// Szenenfigur je Gruppe (M-17); jede liefert dekoratives SVG mit Schrittzuständen.
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

function kopf(sk, g, inh) {
  return html`<section class="gruppe-kopf" aria-labelledby="gruppe-titel">
<div class="raster"><div class="gruppe-kopf-teilung">
<div class="gruppe-kopf-text">
<p class="gruppe-kicker"><span class="gruppe-nr">${g.nr}</span> ${inh.kicker}</p>
<h1 id="gruppe-titel">${inh.h1}</h1>
<p class="gruppe-einleitung">${text(inh.einleitung)}</p>
<div class="gruppe-handlung">${g.id === 'notoeffnung' ? rufknopf(sk, { variante: 'gross' }) : html`<a class="knopf knopf-primaer" href="/kontakt/">Beratung anfragen${sk.icon('pfeil-rechts')}</a>`}</div>
</div>
<nav class="gruppe-register" aria-labelledby="gruppe-register-titel">
<h2 class="gruppe-register-titel" id="gruppe-register-titel">${inh.registerTitel}</h2>
<ul>${g.leistungen.map((l) => html`<li><a href="${l.pfad}">${sk.icon(l.icon, { klasse: 'gruppe-register-icon' })}<span class="gruppe-register-name">${l.titel}</span><span class="gruppe-register-kurz">${l.kurz}</span></a></li>`)}</ul>
</nav>
</div></div>
</section>`;
}

function nachweis(sk, n) {
  return html`<section class="sektion" aria-labelledby="nachweis-titel">
<div class="raster"><div class="gruppe-teilung">
${abschnittKopf({ id: 'nachweis-titel', titel: n.titel, einleitung: n.einleitung })}
<dl class="nachweis">${n.eintraege.map((e) => html`<div class="nachweis-eintrag"><dt>${e.objekt}</dt><dd>${text(e.text)}</dd></div>`)}</dl>
</div></div>
</section>`;
}

function textAbschnitt(id, a, band = false) {
  return html`<section class="sektion${band ? ' band' : ''}" aria-labelledby="${id}">
<div class="raster"><div class="gruppe-teilung">
${abschnittKopf({ id, titel: a.titel })}
<div class="fliesstext">${a.absaetze.map((p) => html`<p>${text(p)}</p>`)}</div>
</div></div>
</section>`;
}

function preis(sk, p) {
  return html`<section class="sektion" aria-labelledby="gruppe-preis-titel">
<div class="raster"><div class="gruppe-teilung">
${abschnittKopf({ id: 'gruppe-preis-titel', titel: p.titel, einleitung: p.text })}
<div class="preis-auszug">${preistabelle(sk, { positionen: p.positionen, id: 'gruppe-preise' })}</div>
</div></div>
</section>`;
}

function fragen(sk, liste) {
  return html`<section class="sektion" aria-labelledby="faq-titel">
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

function schluss(sk, s, notfall) {
  return html`<section class="sektion band-dunkel schluss" aria-labelledby="schluss-titel">
<div class="raster"><div class="schluss-teilung">
<div>
<h2 id="schluss-titel">${s.titel}</h2>
<p>${text(s.text)}</p>
</div>
<div class="schluss-handlung">${notfall ? rufknopf(sk, { variante: 'gross' }) : ''}<a class="knopf knopf-sekundaer" href="${s.link.pfad}">${s.link.text}${sk.icon('pfeil-rechts')}</a></div>
</div></div>
</section>`;
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
      sitemap: 'leistungen', koerperKlasse: `seite-gruppe seite-gruppe-${g.id}`, brotkrumen: stufen,
      jsonld: [gruppenLd(k, g, inh), brotkrumenLd(k.basisUrl, stufen), faqLd(k.basisUrl, g.pfad, inh.faq)],
      inhalt: (sk) => html`${kopf(sk, g, inh)}
${szene({ id: 'szene', titel: inh.szene.titel, einleitung: inh.szene.einleitung, figur: FIGUREN[g.id], schritte: inh.szene.schritte, klasse: 'band' })}
${inh.nachweis ? nachweis(sk, inh.nachweis) : ''}
${(inh.abschnitte || []).map((a, i) => textAbschnitt(`abschnitt-${i + 1}`, a))}
${inh.betriebe ? textAbschnitt('betriebe-titel', inh.betriebe, true) : ''}
${inh.preis ? preis(sk, inh.preis) : ''}
${fragen(sk, inh.faq)}
${weiter(sk, inh.weiter)}
${schluss(sk, inh.schluss, g.id === 'notoeffnung')}`,
    });
  }
  return aus;
}
