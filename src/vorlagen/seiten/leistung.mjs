// V03 Leistungsdetail (Arbeitsansicht: statisch, dicht, keine Szene). Abschnittsfolge:
// Kopf 7/5 (H1, Kurzantwort, Handlung | Figur oder Gruppenbild) · „Auf einen Blick“ · Text 8/4 mit Randspalte
// (Preisauszug, weitere Leistungen der Gruppe) · Häufige Fragen · Weiterlesen.
// Inhalte: src/inhalte/<gruppe>/<leistung>.mjs (nur Leistungen mit Inhaltsmodul werden gebaut).
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
import { falleRiegel } from '../teile/illustrationen/falle-riegel.mjs';
import { notoeffnungObjekte } from '../teile/illustrationen/objekte.mjs';
import { tuerSchichten } from '../teile/illustrationen/tuerschichten.mjs';
import { grundriss } from '../teile/illustrationen/grundriss.mjs';
import { widerstandsStufen } from '../teile/illustrationen/stufen.mjs';
import { fensterSchichten } from '../teile/illustrationen/fensterschichten.mjs';
import { tuerschliesserFigur } from '../teile/illustrationen/tuerschliesser.mjs';
import { datenschrank } from '../teile/illustrationen/datenschrank.mjs';

// Figuren für den Kopf: eigene je Leistung (inhalt.figur: '<name>'), sonst die Gruppenfigur mit der Schicht,
// dem Objekt oder der Stufe der Leistung hervorgehoben (zustand/fokus), sonst das ganze Gruppenbild.
const FIGUREN = {
  'falle-riegel': () => falleRiegel({ praefix: 'kopf-fr' }),
};
const JE_LEISTUNG = {
  autooeffnung: () => notoeffnungObjekte('', { fokus: 'auto' }),
  garagenoeffnung: () => notoeffnungObjekte('', { fokus: 'garage' }),
  tresoroeffnung: () => notoeffnungObjekte('', { fokus: 'tresor' }),
  einbruchschaden: () => tuerSchichten({ praefix: 'kopf-ts' }),
  schliesszylinder: () => tuerSchichten({ praefix: 'kopf-ts', zustand: 1 }),
  schutzbeschlaege: () => tuerSchichten({ praefix: 'kopf-ts', zustand: 2 }),
  tuerschloesser: () => tuerSchichten({ praefix: 'kopf-ts', zustand: 3 }),
  tuersicherung: () => tuerSchichten({ praefix: 'kopf-ts', zustand: 4 }),
  zusatzschloesser: () => tuerSchichten({ praefix: 'kopf-ts', zustand: 5 }),
  alarmanlagen: () => grundriss({ praefix: 'kopf-gr', zustand: 4 }),
  rauchmelder: () => grundriss({ praefix: 'kopf-gr', zustand: 3 }),
  videoueberwachung: () => grundriss({ praefix: 'kopf-gr', zustand: 1, zusatz: 'kamera' }),
  nebelsysteme: () => grundriss({ praefix: 'kopf-gr', zustand: 4, zusatz: 'nebel' }),
  moebeltresore: () => widerstandsStufen({ praefix: 'kopf-ws', zustand: 1 }),
  sicherheitstueren: () => widerstandsStufen({ praefix: 'kopf-ws', zustand: 2 }),
  sicherheitsfenster: () => fensterSchichten({ praefix: 'kopf-fs' }),
  fenstersicherung: () => fensterSchichten({ praefix: 'kopf-fs', zustand: 2 }),
  tuerschliesser: () => tuerschliesserFigur({ praefix: 'kopf-tsl' }),
  wertschutzschraenke: () => widerstandsStufen({ praefix: 'kopf-ws', zustand: 3 }),
  waffenschraenke: () => widerstandsStufen({ praefix: 'kopf-ws', zustand: 4 }),
  datensicherungsschraenke: () => datenschrank({ praefix: 'kopf-ds' }),
};
const GRUPPENBILD = {
  notoeffnung: () => notoeffnungObjekte(),
  einbruchschutz: () => tuerSchichten({ praefix: 'kopf-ts' }),
  sicherheitstechnik: () => grundriss({ praefix: 'kopf-gr' }),
  'einbau-tresore': () => widerstandsStufen({ praefix: 'kopf-ws' }),
};

export function leistungLd(sk, g, l, inhalt) {
  const basis = sk.basisUrl;
  const kreise = [...new Set((sk.daten.orte || []).filter((o) => o.zone === 'A').map((o) => o.kreis).filter(Boolean))].sort();
  return {
    '@context': 'https://schema.org', '@type': 'Service', '@id': `${basis}${l.pfad}#leistung`,
    name: l.titel, serviceType: l.titel, description: inhalt.beschreibung, url: `${basis}${l.pfad}`,
    provider: { '@id': `${basis}/#betrieb` }, isRelatedTo: { '@id': `${basis}${g.pfad}#leistung` },
    areaServed: (kreise.length ? kreise : [sk.konfig.betrieb.sitz.kreis]).map((k) => ({ '@type': 'AdministrativeArea', name: k })),
  };
}

function kopf(sk, g, l, inh) {
  const figur = (FIGUREN[inh.figur] || JE_LEISTUNG[l.id] || GRUPPENBILD[g.id])();
  return html`<section class="leistung-kopf" aria-labelledby="leistung-titel">
<div class="raster"><div class="leistung-kopf-teilung">
<div>
<p class="leistung-kicker"><a href="${g.pfad}">${g.titel}</a></p>
<h1 id="leistung-titel">${inh.h1}</h1>
<p class="leistung-kurz">${text(inh.kurz)}</p>
<div class="leistung-handlung">${g.id === 'notoeffnung' ? rufknopf(sk, { variante: 'gross' }) : html`<a class="knopf knopf-primaer" href="/kontakt/">Beratung anfragen${sk.icon('pfeil-rechts')}</a>`}</div>
</div>
<figure class="leistung-figur">${figur}${inh.figurText ? html`<figcaption>${inh.figurText}</figcaption>` : ''}</figure>
</div></div>
</section>`;
}

function blick(inh) {
  if (!inh.blick?.length) return '';
  return html`<section class="leistung-blick" aria-label="Auf einen Blick">
<div class="raster"><dl class="blick">${inh.blick.map((b) => html`<div class="blick-eintrag"><dt>${b.titel}</dt><dd>${text(b.text)}</dd></div>`)}</dl></div>
</section>`;
}

function hauptteil(sk, g, l, inh) {
  const geschwister = g.leistungen.filter((x) => x.id !== l.id);
  return html`<div class="sektion"><div class="raster"><div class="leistung-teilung">
<div class="leistung-text">
${inh.abschnitte.map((a, i) => html`<section class="leistung-abschnitt" aria-labelledby="abschnitt-${String(i + 1)}">
<h2 id="abschnitt-${String(i + 1)}">${text(a.titel)}</h2>
${a.absaetze.map((p) => html`<p>${text(p)}</p>`)}
${a.liste ? html`<ul class="leistung-liste">${a.liste.map((x) => html`<li>${text(x)}</li>`)}</ul>` : ''}
</section>`)}
</div>
<aside class="leistung-rand" aria-label="Preise und weitere Leistungen">
${inh.preis ? html`<section class="rand-block" aria-labelledby="rand-preis">
<h2 class="rand-titel" id="rand-preis">Was es kostet</h2>
${preistabelle(sk, { positionen: inh.preis.positionen, id: 'leistung-preise', titel: 'Gesamtpreise in Zone A' })}
<p class="rand-text">${text(inh.preis.text)}</p>
</section>` : ''}
<nav class="rand-block" aria-labelledby="rand-gruppe">
<h2 class="rand-titel" id="rand-gruppe">Mehr aus ${g.titel}</h2>
<ul class="rand-liste">${geschwister.map((x) => html`<li><a href="${x.pfad}">${sk.icon(x.icon, { klasse: 'rand-icon' })}<span>${x.titel}</span></a></li>`)}</ul>
</nav>
</aside>
</div></div></div>`;
}

function fragen(sk, liste) {
  return html`<section class="sektion band" aria-labelledby="faq-titel">
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

async function inhaltLaden(wurzel, gruppe, id) {
  const datei = join(wurzel, 'src/inhalte', gruppe, `${id}.mjs`);
  try { await access(datei); } catch { return null; }
  return (await import(pathToFileURL(datei).href)).default;
}

export async function seiten(k) {
  const aus = [];
  for (const g of GRUPPEN) {
    for (const l of g.leistungen) {
      const inh = await inhaltLaden(k.wurzel, g.id, l.id);
      if (!inh) continue;
      const stufen = [{ titel: g.titel, pfad: g.pfad }, { titel: l.titel, pfad: l.pfad }];
      aus.push({
        pfad: l.pfad, titel: inh.titel, beschreibung: inh.beschreibung, typ: 'arbeit', ansicht: 'V03',
        sitemap: 'leistungen', koerperKlasse: `seite-leistung seite-gruppe-${g.id}`, stile: ['leistung'], brotkrumen: stufen,
        jsonld: [leistungLd(k, g, l, inh), brotkrumenLd(k.basisUrl, stufen), faqLd(k.basisUrl, l.pfad, inh.faq)],
        inhalt: (sk) => html`${kopf(sk, g, l, inh)}
${blick(inh)}
${hauptteil(sk, g, l, inh)}
${fragen(sk, inh.faq)}
${weiter(sk, inh.weiter)}`,
      });
    }
  }
  return aus;
}
