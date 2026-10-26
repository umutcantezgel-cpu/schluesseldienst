// V11 Suche (Arbeitsansicht, nicht indexiert): Suchfeld ohne <form> (CSP form-action mailto:), Ergebnisse in zwei
// Registern (Seiten, Orte), Statuszeile aria-live. Ohne Anfrage (oder ohne Treffer) steht dort das Register
// „Hauptthemen“ im selben Stil, mit direkten Links – auch ohne JS. Ab 64em 8/4: Suche links, „Andere Wege“ in der
// Randspalte neben Kopf und Feld, damit der Ausweg ohne Scrollen sichtbar ist. Die Einleitung steht als Hinweis unter
// dem Feld (aria-describedby): Feld und Treffer rücken in den ersten Bildschirm. Unter den Wegen die Legende des
// Maßstabs, den jeder Ortstreffer trägt.
// Indizes: /daten/seiten.*.json (Build), /daten/orte.*.json und /daten/plz.*.json (Ortssuche), alle mit SRI.
import { html } from '../../../bau/lib/html.mjs';
import { text } from '../../../bau/lib/inhalt.mjs';
import inhalt from '../../inhalte/system.mjs';
import { brotkrumenLd } from '../teile/brotkrumen.mjs';
import { massLage, prozent } from '../../assets/js/logik/suche.mjs';
import { zusammen } from './recht.mjs';

// Registereintrag wie die Treffer aus dem Modul suche: Bereich links, Titel als gestreckter Link, Kurztext darunter
const eintrag = (e) => html`<li class="suche-treffer"><span class="suche-bereich">${e.bereich}</span><div class="suche-inhalt"><a class="suche-link" href="${e.pfad}">${zusammen(e.titel)}</a>${e.text ? html`<p class="suche-text">${zusammen(e.text)}</p>` : ''}</div></li>`;

function themen(sk, t) {
  const index = sk.assets.daten.seiten;
  if (!index?.eintrag) return '';
  const eintraege = t.pfade.map((p) => {
    const e = index.eintrag(p);
    if (!e) throw new Error(`Suche: Hauptthema ${p} fehlt im Seitenindex`);
    return e;
  });
  return html`<section class="suche-themen" data-rolle="themen" aria-labelledby="suche-themen-titel"><h2 class="suche-block-titel" id="suche-themen-titel">${t.titel}</h2><ul class="suche-liste">${eintraege.map(eintrag)}</ul></section>`;
}

// Legende des Maßstabs: dieselbe Achse wie unter den Ortstreffern (massLage), hier in Spaltenbreite und beschriftet.
// Ursprung als Kupferpunkt wie das Ende der Scherlinie im Fuß, Ringe als Striche mit ihrem Maß, hinter dem äußersten
// Ring gestrichelt. Ohne viewBox: x in Prozent, y in CSS-Pixeln, Schrift aus dem Stil. Die Grafik ist dekorativ, der
// Text darunter erklärt sie.
function legende(m, ringe) {
  if (!ringe.length) return '';
  const x = (km) => prozent(massLage(km, ringe).anteil);
  const aussen = ringe[ringe.length - 1];
  return html`<section class="suche-legende" aria-labelledby="mass-titel">
<h2 class="suche-block-titel" id="mass-titel">${m.titel}</h2>
<svg class="suche-mass-legende" aria-hidden="true" focusable="false">
<text class="suche-mass-ort" x="0" y="14">${m.ursprung}</text>
<line class="suche-mass-achse" x1="0" x2="${x(aussen)}" y1="26" y2="26"/><line class="suche-mass-achse suche-mass-weiter" x1="${x(aussen)}" x2="100%" y1="26" y2="26"/>
${ringe.map((r, i) => html`<line class="suche-mass-ring" x1="${x(r)}" x2="${x(r)}" y1="20" y2="32"/><text class="suche-mass-zahl" x="${x(r)}" y="50">${i === ringe.length - 1 ? `${r}\u00A0km` : r}</text>`)}
<circle class="suche-mass-ursprung" cx="0" cy="26" r="4"/>
</svg>
<p class="suche-legende-text">${m.text}</p>
</section>`;
}

export function seiten(k) {
  const s = inhalt.suche;
  const stufen = [{ titel: 'Suche', pfad: '/suche/' }];
  return [{
    pfad: '/suche/', titel: s.titel, beschreibung: s.beschreibung, typ: 'system', ansicht: 'V11', indexierbar: false,
    koerperKlasse: 'seite-suche', stile: ['system'], brotkrumen: stufen, jsonld: [brotkrumenLd(k.basisUrl, stufen)],
    inhalt: (sk) => {
      const d = sk.assets.daten;
      const bereit = d.seiten && d.orte && d.plz;
      // Zonenringe für den Maßstab der Ortstreffer (die letzte Stufe reicht ins Unendliche und hat keinen Ring)
      const ringe = sk.konfig.zonen.stufen.map((z) => z.bisKm).filter(Number.isFinite);
      const sitemap = s.wege.find((w) => w.pfad === '/sitemap/')?.pfad ?? '';
      return html`<section class="system-kopf suche-kopf" aria-labelledby="suche-h1">
<div class="raster"><div class="suche-teilung">
<div class="suche-kopftext">
<span class="scherlinie scherlinie-leit kopf-linie" aria-hidden="true"></span>
<p class="gruppe-kicker">${s.kicker}</p>
<h1 id="suche-h1">${s.h1}</h1>
</div>
<div class="suche" role="search"${bereit ? html` data-modul="suche" data-seiten="${d.seiten.pfad}" data-seiten-sri="${d.seiten.sri}" data-orte="${d.orte.pfad}" data-orte-sri="${d.orte.sri}" data-plz="${d.plz.pfad}" data-plz-sri="${d.plz.sri}"` : ''} data-kurz="${s.kurz}" data-leer="${s.leer}" data-fehler="${s.fehler}" data-sitemap="${sitemap}" data-ringe="${ringe.join(',')}">
<div class="suche-feld" hidden>
<label class="suche-label" for="suche-eingabe">${s.label}</label>
<div class="suche-eingabe-huelle">${sk.icon('suche', { klasse: 'suche-icon' })}<input class="suche-eingabe" id="suche-eingabe" type="search" autocomplete="off" spellcheck="false" enterkeyhint="search" maxlength="80" placeholder="${s.platzhalter}" aria-describedby="suche-hinweis"><button class="suche-leeren" type="button" aria-label="${s.leeren}" hidden>${sk.icon('schliessen')}</button></div>
<p class="suche-hinweis" id="suche-hinweis">${text(s.einleitung)}</p>
</div>
<p class="suche-ohne-js">${s.ohneJs}</p>
<p class="suche-status" role="status" aria-live="polite"></p>
${themen(sk, s.themen)}
<div class="suche-ergebnis" hidden>
<section data-rolle="seiten-block" aria-labelledby="suche-seiten" hidden><h2 class="suche-block-titel" id="suche-seiten">${s.seiten}</h2><ul class="suche-liste" data-rolle="seiten"></ul></section>
<section data-rolle="orte-block" aria-labelledby="suche-orte" hidden><h2 class="suche-block-titel" id="suche-orte">${s.orte}</h2><ul class="suche-liste" data-rolle="orte"></ul></section>
</div>
</div>
<div class="suche-rand">
<nav class="suche-wege-block" aria-labelledby="wege-titel">
<h2 class="suche-block-titel" id="wege-titel">Andere Wege</h2>
<ul class="weiter suche-wege">${s.wege.map((w) => html`<li><a href="${w.pfad}"><span class="weiter-titel">${w.titel}</span><span class="weiter-text">${w.text}</span>${sk.icon('pfeil-rechts', { klasse: 'weiter-pfeil' })}</a></li>`)}</ul>
</nav>
${legende(s.massstab, ringe)}
</div>
</div></div>
</section>`;
    },
  }];
}
