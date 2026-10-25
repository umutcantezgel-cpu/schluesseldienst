// V08 Ratgeber-Artikel (Arbeitsansicht, Teilung 8/4). Abschnittsfolge:
// Kopf (Kategorie, H1, Kurzantwort, Stand) · „Das Wichtigste“ · Inhaltsverzeichnis · Text · Häufige Fragen ·
// Quellen (nur die der verwendeten Fakten, ohne Links) · Weiterlesen. Das Verzeichnis steht im Quelltext vor dem Text,
// damit es mobil vor dem ersten Abschnitt liegt; ab 64em klebt es in der Randspalte (Modul inhalt markiert den Abschnitt).
// Inhalte: src/inhalte/ratgeber/<id>.mjs (nur Artikel mit Inhaltsmodul werden gebaut; Reihenfolge aus RATGEBER).
import { access } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { html } from '../../../bau/lib/html.mjs';
import { Fakt } from '../../../bau/lib/fakten.mjs';
import { text } from '../../../bau/lib/inhalt.mjs';
import { RATGEBER } from '../../konfig/routen.mjs';
import { abschnittKopf } from '../teile/abschnitt.mjs';
import { faq, faqLd } from '../teile/faq.mjs';
import { brotkrumenLd } from '../teile/brotkrumen.mjs';
import { falleRiegel } from '../teile/illustrationen/falle-riegel.mjs';
import { tuerSchichten } from '../teile/illustrationen/tuerschichten.mjs';
import { grundriss } from '../teile/illustrationen/grundriss.mjs';
import { widerstandsStufen } from '../teile/illustrationen/stufen.mjs';
import { rechnungIllustration } from '../teile/illustrationen/rechnung.mjs';
import { fensterSchichten } from '../teile/illustrationen/fensterschichten.mjs';
import { notoeffnungObjekte } from '../teile/illustrationen/objekte.mjs';
import { zylinderSchnitt } from '../teile/illustrationen/zylinder.mjs';
import { schadensbilder } from '../teile/illustrationen/schadensbilder.mjs';

export const KATEGORIEN = {
  notfall: { titel: 'Im Notfall', kurz: 'Ausgesperrt, Schlüssel weg, Einbruch – was jetzt hilft.' },
  vorbeugen: { titel: 'Vorbeugen', kurz: 'Haus und Wohnung sicherer machen, Schritt für Schritt.' },
  technik: { titel: 'Technik verstehen', kurz: 'Klassen, Schlösser, Tresore und Anlagen einfach erklärt.' },
  recht: { titel: 'Recht und Kosten', kurz: 'Preise, Pflichten und Förderung – mit Quellen.' },
};

const FIGUREN = {
  'falle-riegel': (p) => falleRiegel({ praefix: p }),
  'tuer-schichten': (p) => tuerSchichten({ praefix: p }),
  grundriss: (p) => grundriss({ praefix: p }),
  rauchmelder: (p) => grundriss({ praefix: p, variante: 'rauchmelder' }),
  stufen: (p) => widerstandsStufen({ praefix: p }),
  rechnung: () => rechnungIllustration(),
  'fenster-schichten': (p) => fensterSchichten({ praefix: p }),
  objekte: () => notoeffnungObjekte(),
  zylinder: (p) => zylinderSchnitt({ praefix: p, dekorativ: true }),
  schadensbilder: (p) => schadensbilder({ praefix: p }),
};

const anker = (i) => `teil-${i + 1}`;
const datum = (iso) => new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));

export async function artikelLaden(wurzel) {
  const aus = [];
  for (const id of RATGEBER) {
    const datei = join(wurzel, 'src/inhalte/ratgeber', `${id}.mjs`);
    try { await access(datei); } catch { continue; }
    aus.push({ id, pfad: `/ratgeber/${id}/`, inhalt: (await import(pathToFileURL(datei).href)).default });
  }
  return aus;
}

// Alle Fakt-Objekte im Artikel (beliebig tief in Abschnitten, Listen, Hinweisen und FAQ)
function faktenIn(wert, aus = []) {
  if (wert instanceof Fakt) aus.push(wert);
  else if (Array.isArray(wert)) for (const w of wert) faktenIn(w, aus);
  else if (wert && typeof wert === 'object') for (const w of Object.values(wert)) faktenIn(w, aus);
  return aus;
}

// Quellen nur der tatsächlich verwendeten Fakten: Blatt aus der Fakt-ID („blatt.kurzname“), Quelle aus fakt.quelle
async function quellenLaden(wurzel, fakten) {
  const genutzt = new Map();
  for (const f of fakten) {
    const blatt = f.id.split('.')[0];
    if (!genutzt.has(blatt)) genutzt.set(blatt, new Set());
    genutzt.get(blatt).add(f.quelle);
  }
  const aus = [];
  for (const [id, qids] of genutzt) {
    const datei = join(wurzel, 'src/inhalte/fakten', `${id}.mjs`);
    try { await access(datei); } catch { continue; }
    const m = await import(pathToFileURL(datei).href);
    for (const q of (m.quellen || []).filter((x) => qids.has(x.id))) {
      let host = '';
      try { host = new URL(q.url).host.replace(/^www\./, ''); } catch { /* ohne Adresse */ }
      aus.push({ titel: q.titel, host, abgerufen: q.abgerufen });
    }
  }
  const gesehen = new Set();
  return aus.filter((q) => (gesehen.has(q.titel) ? false : gesehen.add(q.titel)));
}

function artikelLd(k, a, inh) {
  const url = `${k.basisUrl}${a.pfad}`;
  return {
    '@context': 'https://schema.org', '@type': 'Article', '@id': `${url}#artikel`, headline: inh.h1, description: inh.beschreibung,
    url, mainEntityOfPage: url, inLanguage: 'de', datePublished: inh.stand, dateModified: inh.stand,
    author: { '@id': `${k.basisUrl}/#betrieb` }, publisher: { '@id': `${k.basisUrl}/#betrieb` },
  };
}

function abschnitt(a, i) {
  return html`<section class="artikel-teil" aria-labelledby="${anker(i)}">
<h2 id="${anker(i)}">${text(a.titel)}</h2>
${a.absaetze.map((p) => html`<p>${text(p)}</p>`)}
${a.liste ? html`<ul class="artikel-liste">${a.liste.map((x) => html`<li>${text(x)}</li>`)}</ul>` : ''}
${a.schritte ? html`<ol class="artikel-schritte">${a.schritte.map((x) => html`<li>${text(x)}</li>`)}</ol>` : ''}
${a.hinweis ? html`<p class="hinweis${a.hinweis.art === 'warnung' ? ' hinweis-warnung' : ''}">${text(a.hinweis.text)}</p>` : ''}
</section>`;
}

export async function seiten(k) {
  const artikel = await artikelLaden(k.wurzel);
  const aus = [];
  for (const a of artikel) {
    const inh = a.inhalt;
    const stufen = [{ titel: 'Ratgeber', pfad: '/ratgeber/' }, { titel: inh.kurztitel || inh.h1, pfad: a.pfad }];
    const quellen = await quellenLaden(k.wurzel, faktenIn(inh));
    const kat = KATEGORIEN[inh.kategorie];
    aus.push({
      pfad: a.pfad, titel: inh.titel, beschreibung: inh.beschreibung, typ: 'arbeit', ansicht: 'V08', sitemap: 'ratgeber',
      ogTyp: 'article', koerperKlasse: 'seite-artikel', stile: ['ratgeber'], ogBild: '/assets/og/ratgeber.png', brotkrumen: stufen,
      jsonld: [artikelLd(k, a, inh), brotkrumenLd(k.basisUrl, stufen), faqLd(k.basisUrl, a.pfad, inh.faq)],
      inhalt: (sk) => html`<article class="artikel" aria-labelledby="artikel-titel">
<header class="artikel-kopf"><div class="raster"><div class="artikel-kopf-teilung"><div class="artikel-kopf-innen">
<span class="scherlinie scherlinie-leit kopf-linie" aria-hidden="true"></span>
<p class="artikel-kicker"><a href="/ratgeber/#${inh.kategorie}">${kat.titel}</a></p>
<h1 id="artikel-titel">${inh.h1}</h1>
<p class="artikel-kurz">${text(inh.kurz)}</p>
<p class="artikel-stand">Stand: <time datetime="${inh.stand}">${datum(inh.stand)}</time></p>
</div>${inh.figur && FIGUREN[inh.figur] ? html`<figure class="artikel-figur">${FIGUREN[inh.figur]('artikel-fig')}${inh.figurText ? html`<figcaption>${inh.figurText}</figcaption>` : ''}</figure>` : ''}</div></div></header>
<div class="sektion sektion-dicht"><div class="raster"><div class="artikel-teilung">
<aside class="artikel-wichtig" aria-labelledby="wichtig-titel">
<h2 class="artikel-wichtig-titel" id="wichtig-titel">Das Wichtigste</h2>
<ul>${inh.wichtig.map((w) => html`<li>${sk.icon('haken', { klasse: 'artikel-wichtig-icon' })}<span>${text(w)}</span></li>`)}</ul>
</aside>
<nav class="artikel-rand" aria-labelledby="inhalt-titel" data-modul="inhalt">
<h2 class="rand-titel" id="inhalt-titel">Inhalt</h2>
<ol class="artikel-toc">${inh.abschnitte.map((x, i) => html`<li><a href="#${anker(i)}">${x.titel}</a></li>`)}</ol>
</nav>
<div class="artikel-text">
${inh.abschnitte.map((x, i) => abschnitt(x, i))}
</div>
</div></div></div>
</article>
<section class="sektion band" aria-labelledby="faq-titel"><div class="raster"><div class="faq-teilung">
${abschnittKopf({ id: 'faq-titel', titel: 'Häufige Fragen' })}
${faq(sk, inh.faq)}
</div></div></section>
${quellen.length ? html`<section class="sektion sektion-dicht" aria-labelledby="quellen-titel"><div class="raster"><div class="faq-teilung">
${abschnittKopf({ id: 'quellen-titel', titel: 'Quellen' })}
<ul class="artikel-quellen">${quellen.map((q) => html`<li data-daten="" data-quelle="">${q.titel}${q.host ? html` <span class="artikel-quelle-host">(${q.host})</span>` : ''}</li>`)}</ul>
</div></div></section>` : ''}
<section class="sektion sektion-dicht" aria-labelledby="weiter-titel">
<div class="raster">
${abschnittKopf({ id: 'weiter-titel', titel: 'Weiterlesen' })}
<ul class="weiter">${inh.weiter.map((w) => html`<li><a href="${w.pfad}"><span class="weiter-titel">${w.titel}</span><span class="weiter-text">${w.text}</span>${sk.icon('pfeil-rechts', { klasse: 'weiter-pfeil' })}</a></li>`)}</ul>
</div>
</section>`,
    });
  }
  return aus;
}
