// V12 Rechtsseiten (Arbeitsansicht, Entwürfe für die rechtliche Prüfung). Je Seite:
// Kopf (Freigabe-Hinweis, Kicker, H1, Einleitung, Stand) · Text mit Inhaltsverzeichnis in der Randspalte (ab 64em) ·
// Band „Weitere Rechtsseiten“. Texte und Fakten stehen in src/inhalte/recht/<id>.mjs; Angaben kommen aus
// sk.konfig.betrieb; externe Links nur für Hosts aus src/konfig/quellen.mjs. Platzhalter bleiben sichtbar.
import { html, attrUrl } from '../../../bau/lib/html.mjs';
import { text } from '../../../bau/lib/inhalt.mjs';
import { istPlatzhalter } from '../../../bau/lib/platzhalter.mjs';
import { abschnittKopf } from '../teile/abschnitt.mjs';
import { brotkrumenLd } from '../teile/brotkrumen.mjs';
import impressum from '../../inhalte/recht/impressum.mjs';
import datenschutz from '../../inhalte/recht/datenschutz.mjs';
import widerruf from '../../inhalte/recht/widerruf.mjs';
import barrierefreiheit from '../../inhalte/recht/barrierefreiheit.mjs';
import quellenLizenzen from '../../inhalte/recht/quellen-lizenzen.mjs';

const SEITEN = [impressum, datenschutz, widerruf, barrierefreiheit, quellenLizenzen];
const MAIL = /^[^\s@"'<>\\]+@[^\s@"'<>\\]+$/;
const TEL = /^\+\d{6,15}$/;

const datum = (iso) => new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));

// Wert eines Konfigurationspfads („a.b“); null, wenn er fehlt. Ein fehlender Wert lässt den Eintrag entfallen.
const wertVon = (objekt, pfad) => pfad.split('.').reduce((o, k) => (o == null ? null : o[k]), objekt) ?? null;

const hostVon = (url) => { try { return new URL(url).host; } catch { return null; } };

// Nur Hosts aus src/konfig/quellen.mjs werden verlinkt; alles andere erscheint als Text ohne Link.
function externerLink(sk, url, titel) {
  const host = hostVon(url);
  return host && sk.konfig.quellen.hosts.includes(host)
    ? html`<a href="${attrUrl(url)}" rel="noopener noreferrer">${titel}</a>`
    : html`${titel}`;
}

// Eine Angabe aus der Konfiguration. Anschrift, E-Mail und Telefon erhalten Links, wenn die Werte echt sind.
function angabe(sk, pfad) {
  const b = sk.konfig.betrieb;
  if (pfad === 'adresse') return html`<span>${b.adresse.strasse}</span><br><span>${b.adresse.plz} ${b.adresse.ort}</span>`;
  if (pfad === 'email') return istPlatzhalter(b.email) || !MAIL.test(b.email) ? b.email : html`<a href="${attrUrl(`mailto:${b.email}`)}">${b.email}</a>`;
  if (pfad === 'telefon') {
    const e164 = b.telefon.e164;
    return istPlatzhalter(e164) || !TEL.test(e164) ? b.telefon.anzeige : html`<a href="${attrUrl(`tel:${e164}`)}">${b.telefon.anzeige}</a>`;
  }
  return wertVon(b, pfad);
}

function angaben(sk, eintraege) {
  const zeilen = eintraege.map((e) => ({ e, wert: angabe(sk, e.pfad) })).filter((z) => z.wert !== null && z.wert !== '');
  if (!zeilen.length) return html``;
  return html`<dl class="recht-angaben">${zeilen.map(({ e, wert }) => html`<div><dt>${e.bezeichnung}</dt><dd>${wert}</dd></div>`)}</dl>`;
}

function muster(sk, m) {
  const an = m.an.map((p) => angabe(sk, p)).filter((w) => w !== null && w !== '');
  return html`<div class="recht-muster">
<p class="recht-muster-titel">${m.anTitel}</p>
${an.map((w) => html`<p class="recht-muster-zeile">${w}</p>`)}
${m.zeilen.map((z) => html`<p class="recht-muster-zeile">${text(z)}</p>`)}
</div>`;
}

// Ein Block eines Abschnitts. Jeder Block liefert Roh-HTML; leer heißt: nichts anzeigen.
function block(sk, b) {
  if (b.absatz !== undefined) return html`<p>${text(b.absatz)}</p>`;
  if (b.liste) return html`<ul class="recht-liste">${b.liste.map((x) => html`<li>${text(x)}</li>`)}</ul>`;
  if (b.angaben) return angaben(sk, b.angaben);
  if (b.wert) {
    const w = wertVon(sk.konfig.betrieb, b.wert);
    return w === null || w === '' ? html`` : html`<p>${w}</p>`;
  }
  if (b.muster) return muster(sk, b.muster);
  if (b.link) {
    const { titel, url } = b.link;
    return html`<p>${url.startsWith('/') ? html`<a href="${attrUrl(url)}">${titel}</a>` : externerLink(sk, url, titel)}</p>`;
  }
  if (b.quellen) {
    return html`<ul class="recht-quellen">${b.quellen.map((q) => html`<li>${externerLink(sk, q.url, q.titel)}${hostVon(q.url) ? html` <span class="recht-quelle-host">(${hostVon(q.url)})</span>` : ''}</li>`)}</ul>`;
  }
  throw new Error(`recht: unbekannter Block (${Object.keys(b).join(', ')})`);
}

// Abschnitte mit Inhalt; ein Abschnitt ohne sichtbare Blöcke entfällt samt Eintrag im Inhaltsverzeichnis.
function abschnitte(sk, liste) {
  return liste
    .map((a) => ({ a, bloecke: a.bloecke.map((b) => block(sk, b)).filter((r) => r.s !== '') }))
    .filter((t) => t.bloecke.length);
}

function inhalt(sk, inh) {
  const teile = abschnitte(sk, inh.abschnitte);
  const weiter = SEITEN.filter((x) => x.id !== inh.id);
  return html`<article class="recht" aria-labelledby="recht-titel">
<header class="recht-kopf"><div class="raster">
${inh.freigabe ? html`<p class="recht-freigabe hinweis${istPlatzhalter(inh.freigabe) ? ' hinweis-platzhalter' : ''}">${inh.freigabe}</p>` : ''}
<p class="gruppe-kicker">${inh.kicker}</p>
<h1 id="recht-titel">${inh.h1}</h1>
<p class="recht-einleitung">${text(inh.einleitung)}</p>
<p class="recht-stand">Stand: <time datetime="${inh.stand}">${datum(inh.stand)}</time></p>
</div></header>
<div class="sektion sektion-dicht"><div class="raster"><div class="recht-teilung">
<div class="recht-text">
${teile.map(({ a, bloecke }) => html`<section class="recht-teil" aria-labelledby="teil-${a.id}">
${abschnittKopf({ id: `teil-${a.id}`, titel: a.titel })}
${bloecke}
</section>`)}
</div>
<nav class="recht-rand" aria-labelledby="inhalt-titel">
<h2 class="rand-titel" id="inhalt-titel">Inhalt</h2>
<ol class="recht-toc">${teile.map(({ a }) => html`<li><a href="#teil-${a.id}">${a.titel}</a></li>`)}</ol>
</nav>
</div></div></div>
</article>
<section class="sektion band" aria-labelledby="weiter-titel"><div class="raster">
${abschnittKopf({ id: 'weiter-titel', titel: inh.weiterTitel })}
<ul class="weiter">${weiter.map((w) => html`<li><a href="${w.pfad}"><span class="weiter-titel">${w.titel}</span><span class="weiter-text">${w.kurz}</span>${sk.icon('pfeil-rechts', { klasse: 'weiter-pfeil' })}</a></li>`)}</ul>
</div></section>`;
}

function webseiteLd(k, inh) {
  const url = `${k.basisUrl}${inh.pfad}`;
  return {
    '@context': 'https://schema.org', '@type': 'WebPage', '@id': `${url}#seite`, name: inh.h1, url,
    inLanguage: 'de', dateModified: inh.stand, about: { '@id': `${k.basisUrl}/#betrieb` },
  };
}

export function seiten(k) {
  return SEITEN.map((inh) => {
    const stufen = [{ titel: inh.h1, pfad: inh.pfad }];
    return {
      pfad: inh.pfad, titel: inh.titel, beschreibung: inh.beschreibung, typ: 'arbeit', ansicht: 'V12', sitemap: 'seiten',
      koerperKlasse: 'seite-recht', stile: ['recht'], brotkrumen: stufen,
      jsonld: [webseiteLd(k, inh), brotkrumenLd(k.basisUrl, stufen)],
      inhalt: (sk) => inhalt(sk, inh),
    };
  });
}
