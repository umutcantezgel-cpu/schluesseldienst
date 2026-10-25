// V04 Preise (Arbeitsansicht). Abschnittsfolge nach Themenpass /preise/:
// Kopf mit Preisformel (7/5) · Preisliste mit Tagesband (Band) · Anfahrt nach Zone mit Ortsprüfung (7/5) ·
// Preisrechner (Band) · Material, Zahlarten, erfolglose Öffnung · FAQ (Band) · Weiterlesen · Schlussband.
// Beträge und Uhrzeiten nur aus src/konfig/preise.mjs; Offer-Daten im JSON-LD nur ohne Platzhalter.
import { html } from '../../../bau/lib/html.mjs';
import { text } from '../../../bau/lib/inhalt.mjs';
import { istPlatzhalter } from '../../../bau/lib/platzhalter.mjs';
import inhalt from '../../inhalte/preise.mjs';
import { abschnittKopf } from '../teile/abschnitt.mjs';
import { faq, faqLd } from '../teile/faq.mjs';
import { brotkrumenLd } from '../teile/brotkrumen.mjs';
import { preistabelle, betrag, fensterZeit } from '../teile/preisauszug.mjs';
import { ortspruefung } from '../teile/ortspruefung.mjs';
import { rufknopf } from '../teile/rufknopf.mjs';
import { zusage } from '../teile/zusage.mjs';
import { tagesband } from '../teile/tagesband.mjs';

const NOTFALL = (pos) => pos.leistung.startsWith('/notoeffnung/');

// Daten für den Rechner: Platzhalter werden null, „vollstaendig“ nur ohne jeden Platzhalter
function rechnerDaten(sk) {
  const { preise, zonen } = sk.konfig;
  let vollstaendig = true;
  const wert = (w) => { if (istPlatzhalter(w)) { vollstaendig = false; return null; } return w ?? null; };
  const positionen = Object.fromEntries(preise.positionen.map((p) => [p.id, Object.fromEntries(preise.zeitfenster.map((z) => [z.id, wert(p.preise[z.id])]))]));
  const anfahrt = Object.fromEntries(zonen.stufen.map((s) => [s.id, wert(preise.anfahrt[s.id])]));
  const nurAbsprache = Object.fromEntries(zonen.stufen.filter((s) => s.notoeffnung !== 'ja').map((s) => [s.id, preise.positionen.filter(NOTFALL).map((p) => p.id)]));
  return {
    vollstaendig, positionen, anfahrt, nurAbsprache,
    titel: {
      positionen: Object.fromEntries(preise.positionen.map((p) => [p.id, p.titel])),
      fenster: Object.fromEntries(preise.zeitfenster.map((z) => [z.id, z.titel])),
      zonen: Object.fromEntries(zonen.stufen.map((s) => [s.id, `Zone ${s.id}`])),
    },
    texte: { offen: inhalt.rechner.offen, absprache: inhalt.rechner.absprache },
  };
}

function ustSatz(sk) {
  const modus = sk.konfig.preise.ustModus;
  if (istPlatzhalter(modus)) return html`Zur Umsatzsteuer: ${modus}`;
  return modus === 'klein' ? 'Als Kleinunternehmer weisen wir keine Umsatzsteuer aus.' : 'Alle Preise enthalten die Umsatzsteuer.';
}

function kopf(sk) {
  const f = inhalt.formel;
  return html`<section class="preise-kopf" aria-labelledby="preise-h1">
<div class="raster"><div class="preise-kopf-teilung">
<div>
<p class="gruppe-kicker">${inhalt.kicker}</p>
<h1 id="preise-h1">${inhalt.h1}</h1>
<p class="gruppe-einleitung">${text(inhalt.einleitung)}</p>
<div class="preise-handlung">${rufknopf(sk, { variante: 'gross' })}</div>
</div>
<div class="preise-formel" aria-labelledby="formel-titel">
<h2 class="rand-titel" id="formel-titel">${f.titel}</h2>
<ol class="formel">${f.teile.map((t, i) => html`<li class="formel-teil${i === f.teile.length - 1 ? ' formel-summe' : ''}">${sk.icon(t.icon, { klasse: 'formel-icon' })}<span class="formel-titel">${t.titel}</span><span class="formel-text">${t.text}</span></li>`)}</ol>
<p class="formel-material">${text(f.material)}</p>
<p class="formel-ust">${ustSatz(sk)}</p>
</div>
</div></div>
</section>`;
}

function liste(sk) {
  const l = inhalt.liste;
  const offen = istPlatzhalter(sk.konfig.preise.tagesband);
  return html`<section class="sektion band" aria-labelledby="liste-titel">
<div class="raster">
${abschnittKopf({ id: 'liste-titel', titel: l.titel, einleitung: l.einleitung })}
<div class="preise-liste">
${tagesband(sk, { praefix: 'preise-tb', jetztText: l.jetzt })}
<p class="preise-band-text">${offen ? l.bandOffen : l.band}</p>
${preistabelle(sk, { id: 'preisliste' })}
</div>
</div>
</section>`;
}

function anfahrt(sk) {
  const a = inhalt.anfahrt;
  const { stufen, nl } = sk.konfig.zonen;
  const preise = sk.konfig.preise.anfahrt;
  const radius = (s, i) => (s.bisKm === Infinity ? html`über <span data-daten="">${String(stufen[i - 1].bisKm)}</span>&nbsp;km` : html`bis <span data-daten="">${String(s.bisKm)}</span>&nbsp;km`);
  const kosten = (s) => (s.id === 'A' ? a.zeilen.A : preise[s.id] === null ? a.zeilen[s.id] : html`${betrag(preise[s.id])}`);
  const notfall = (s) => (s.notoeffnung === 'ja' ? 'ja' : 'nach Absprache');
  return html`<section class="sektion" aria-labelledby="anfahrt-titel">
<div class="raster"><div class="preise-anfahrt-teilung">
<div>
${abschnittKopf({ id: 'anfahrt-titel', titel: a.titel, einleitung: a.einleitung })}
<div class="preis-tabelle-huelle">
<table class="preis-tabelle anfahrt-tabelle">
<caption>Anfahrt je Zone ab Weilburg</caption>
<thead><tr><th scope="col">Zone</th><th scope="col">Entfernung</th><th scope="col">Anfahrt</th><th scope="col">Notöffnung</th></tr></thead>
<tbody>
${stufen.map((s, i) => html`<tr><th scope="row"><span class="zone-kurz">${s.id}</span> ${s.titel}</th><td data-titel="Entfernung">${radius(s, i)}</td><td data-titel="Anfahrt">${kosten(s)}</td><td data-titel="Notöffnung">${notfall(s)}</td></tr>`)}
<tr><th scope="row"><span class="zone-kurz">NL</span> ${nl.titel}</th><td data-titel="Entfernung">wie Zone ${nl.wieZone}</td><td data-titel="Anfahrt">${a.zeilen.NL}</td><td data-titel="Notöffnung">nach Absprache</td></tr>
</tbody>
</table>
</div>
</div>
<div class="preise-pruefung">${ortspruefung(sk, { id: 'preise-ort', titel: a.pruefTitel, hinweis: a.pruefHinweis })}</div>
</div></div>
</section>`;
}

function rechner(sk) {
  const r = inhalt.rechner;
  const { preise, zonen } = sk.konfig;
  const daten = JSON.stringify(rechnerDaten(sk));
  const band = istPlatzhalter(preise.tagesband) ? '' : JSON.stringify(preise.tagesband);
  const option = (name, wert, titel, zusatz, an) => html`<label class="rechner-option"><input type="radio" name="${name}" value="${wert}"${an ? html` checked` : ''}><span class="rechner-option-text"><span class="rechner-option-titel">${titel}</span>${zusatz ? html`<span class="rechner-option-zusatz">${zusatz}</span>` : ''}</span></label>`;
  return html`<section class="sektion band" aria-labelledby="rechner-titel">
<div class="raster">
${abschnittKopf({ id: 'rechner-titel', titel: r.titel, einleitung: r.einleitung })}
<div class="rechner" role="group" data-modul="preisrechner" data-preise="${daten}"${band ? html` data-band="${band}"` : ''} aria-labelledby="rechner-titel">
<fieldset class="rechner-feld rechner-feld-position"><legend>${r.fragen.position}</legend>
<div class="rechner-optionen">${preise.positionen.map((p, i) => option('position', p.id, p.titel, '', i === 0))}</div>
</fieldset>
<fieldset class="rechner-feld"><legend>${r.fragen.fenster}</legend>
<div class="rechner-optionen">${preise.zeitfenster.map((z, i) => option('fenster', z.id, z.titel, fensterZeit(preise, z), i === 0))}</div>
</fieldset>
<fieldset class="rechner-feld"><legend>${r.fragen.zone}</legend>
<div class="rechner-optionen">${zonen.stufen.map((s, i) => option('zone', s.id, `Zone ${s.id} · ${s.titel}`, '', i === 0))}</div>
<p class="rechner-zonen-link"><a href="#anfahrt-titel">Zone Ihres Orts prüfen</a></p>
</fieldset>
<div class="rechner-ergebnis">
<p class="rechner-ergebnis-titel">${r.ergebnis}</p>
<output class="rechner-summe" aria-live="polite">${r.ohneJs}</output>
<p class="rechner-aufschluesselung"></p>
<p class="rechner-hinweis">${r.hinweis}</p>
</div>
</div>
</div>
</section>`;
}

function regeln(sk) {
  const { material: m, zahlung: z, erfolglos: e } = inhalt;
  return html`<section class="sektion" aria-label="Material, Zahlung und erfolglose Öffnung">
<div class="raster"><div class="preise-regeln">
<section class="preise-regel" aria-labelledby="material-titel">
${sk.icon('zylinder', { klasse: 'preise-regel-icon' })}
<h2 id="material-titel">${m.titel}</h2>
<p>${text(m.text)}</p>
<ul class="preise-regel-liste">${m.beispiele.map((b) => html`<li>${b}</li>`)}</ul>
<p><a href="${m.link.pfad}">${m.link.text}</a></p>
</section>
<section class="preise-regel" aria-labelledby="zahlung-titel">
${sk.icon('zahlung-karte', { klasse: 'preise-regel-icon' })}
<h2 id="zahlung-titel">${z.titel}</h2>
<p>${z.aufschlag}</p>
<p>${zusage(sk, 'rechnungMitPositionen', z.rechnung, '')}</p>
<p class="preise-zahlarten">Zahlarten: ${sk.konfig.preise.zahlarten}</p>
<p>${zusage(sk, 'kartenzahlung', z.karte, '')}</p>
</section>
<section class="preise-regel" aria-labelledby="erfolglos-titel">
${sk.icon('tuer', { klasse: 'preise-regel-icon' })}
<h2 id="erfolglos-titel">${e.titel}</h2>
<p>${text(e.text)}</p>
<p>${zusage(sk, 'erfolglos', e.ja, '')}</p>
</section>
</div></div>
</section>`;
}

function preiseLd(k) {
  const url = `${k.basisUrl}/preise/`;
  return { '@context': 'https://schema.org', '@type': 'WebPage', '@id': `${url}#seite`, name: inhalt.titel, url, about: { '@id': `${k.basisUrl}/#betrieb` }, inLanguage: 'de' };
}

export function seiten(k) {
  const stufen = [{ titel: 'Preise', pfad: '/preise/' }];
  return [{
    pfad: '/preise/', titel: inhalt.titel, beschreibung: inhalt.beschreibung, typ: 'arbeit', ansicht: 'V04', sitemap: 'seiten',
    koerperKlasse: 'seite-preise', stile: ['preise'], brotkrumen: stufen,
    jsonld: [preiseLd(k), brotkrumenLd(k.basisUrl, stufen), faqLd(k.basisUrl, '/preise/', inhalt.faq)],
    inhalt: (sk) => html`${kopf(sk)}
${liste(sk)}
${anfahrt(sk)}
${rechner(sk)}
${regeln(sk)}
<section class="sektion band" aria-labelledby="faq-titel"><div class="raster"><div class="faq-teilung">
${abschnittKopf({ id: 'faq-titel', titel: 'Häufige Fragen' })}
${faq(sk, inhalt.faq)}
</div></div></section>
<section class="sektion sektion-dicht" aria-labelledby="weiter-titel">
<div class="raster">
${abschnittKopf({ id: 'weiter-titel', titel: 'Weiterlesen' })}
<ul class="weiter">${inhalt.weiter.map((w) => html`<li><a href="${w.pfad}"><span class="weiter-titel">${w.titel}</span><span class="weiter-text">${w.text}</span>${sk.icon('pfeil-rechts', { klasse: 'weiter-pfeil' })}</a></li>`)}</ul>
</div>
</section>
<section class="sektion band-dunkel schluss" aria-labelledby="schluss-titel">
<div class="raster"><div class="schluss-teilung">
<div><h2 id="schluss-titel">${inhalt.schluss.titel}</h2><p>${inhalt.schluss.text} ${zusage(sk, 'preisVorAuftrag', inhalt.schluss.zusage, '')}</p></div>
<div class="schluss-handlung">${rufknopf(sk, { variante: 'gross' })}</div>
</div></div>
</section>`,
  }];
}
