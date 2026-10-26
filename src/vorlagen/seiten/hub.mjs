// V06 Hub: Länderseite /einsatzgebiet/{landSlug}/ und Kreisseite /einsatzgebiet/{landSlug}/{kreisSlug}/.
// Alle Namen, Zahlen und Entfernungen stammen aus src/daten/orte.json (nur Einträge mit slug).
// Länder mit Kreisen: Kreisliste mit Ortszahl und Entfernungsspanne. Kreise und Stadtstaaten (kreisSlug === landSlug):
// A–Z-Verzeichnis aller Orte mit Buchstabenleiste; Gemeinden fett, Ortsteile eingerückt, je km (und Zone, wenn mehrere).
// Niederlande: die Kreise sind Provinzen. Hubs setzen k.hubs.aktiv und k.hubs.laender (Fußnavigation, Ortsseiten).
// Kreis-, Provinz- und Stadtstaatseiten beginnen mit „… in Zahlen“ (K-08): Zahlen nur aus den Daten, ohne Wertung.
// Der Kopf trägt die Gebietslage (Orte als Raster nach Zone um Weilburg), wie die Ortsseite ihre Lagekarte.
// Flächen wechseln je Abschnitt (Rhythmusregel K-006): Kopf Papier, dann Band, Papier, Band; jede Hub-Seite schließt
// wie die Einsatzgebiet-Übersicht mit dem dunklen Schlussband (Text von dort, Anruf nur bei Zonen mit Notöffnung).
import { html } from '../../../bau/lib/html.mjs';
import { text } from '../../../bau/lib/inhalt.mjs';
import gebiet from '../../inhalte/einsatzgebiet.mjs';
import { abschnittKopf } from '../teile/abschnitt.mjs';
import { brotkrumenLd } from '../teile/brotkrumen.mjs';
import { gebietslage } from '../teile/lagekarte.mjs';
import { rufknopf } from '../teile/rufknopf.mjs';

const ZEICHEN = new Intl.Collator('de');
const BUCHSTABEN = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
const TITEL_MAX = 60;
const BESCHREIBUNG_MIN = 70;
const BESCHREIBUNG_MAX = 155;
// Titel ohne Präposition („Schlüsseldienst Westerwaldkreis“): kein falscher Dativ, keine Behauptung eines Sitzes vor Ort.
// Kreisfreie Städte erscheinen als „Name (kreisfreie Stadt)“, im Titel nur mit Namen.
const KREISFREI = /^Kreisfreie Stadt\s+/;
export const kreisName = (titel) => (KREISFREI.test(titel) ? `${titel.replace(KREISFREI, '')} (kreisfreie Stadt)` : titel);
const kurzName = (titel) => titel.replace(KREISFREI, '');
const titelMit = (kern, zusatz) => (`Schlüsseldienst ${kern}: ${zusatz}`.length <= TITEL_MAX ? `Schlüsseldienst ${kern}: ${zusatz}` : `Schlüsseldienst ${kern}`);
const SITZ_ZEILE = 'Entfernung ab Weilburg und Zone je Ort; Sitz des Betriebs ist Weilburg.';

let H = null; // vorbereitete Daten je Build
const sektion = (band) => `sektion sektion-dicht${band ? ' band' : ''}`;

const zahl = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const kmText = (n) => `${zahl(n)} km`;
const orteText = (n) => (n === 1 ? '1 Ort' : `${zahl(n)} Orte`);
const sortiert = (liste) => [...liste].sort((a, b) => ZEICHEN.compare(a.name, b.name));
const anfang = (name) => name.normalize('NFD').replace(/\p{M}/gu, '').charAt(0).toUpperCase();

function spanne(orte) {
  const werte = orte.map((o) => o.km);
  const min = Math.min(...werte);
  const max = Math.max(...werte);
  return { min, max, text: min === max ? kmText(min) : `${zahl(min)}–${zahl(max)} km` };
}

export function vorbereiten(k) {
  const orte = (k.daten.orte || []).filter((o) => o.slug);
  const laender = new Map();
  for (const o of orte) {
    if (!laender.has(o.landSlug)) laender.set(o.landSlug, { titel: o.land, landSlug: o.landSlug, staat: o.staat, orte: [], kreise: new Map(), ohneKreis: [] });
    const l = laender.get(o.landSlug);
    l.orte.push(o);
    // Orte ohne Kreisangabe in den Daten bekommen keinen erfundenen Kreis: sie stehen auf der Länderseite
    if (!o.kreisSlug) { l.ohneKreis.push(o); continue; }
    if (!l.kreise.has(o.kreisSlug)) l.kreise.set(o.kreisSlug, { titel: o.kreis, kreisSlug: o.kreisSlug, orte: [] });
    l.kreise.get(o.kreisSlug).orte.push(o);
  }
  H = { laender, sitz: orte.find((o) => o.slug === 'weilburg') || { lat: 50.4844, lon: 8.2625, slug: 'weilburg', name: 'Weilburg' } };
  // Alphabetisch, Niederlande zuletzt (wie die Einsatzgebiet-Übersicht)
  const liste = [...laender.values()].map((l) => ({ titel: l.titel, pfad: `/einsatzgebiet/${l.landSlug}/` }))
    .sort((a, b) => (a.titel === 'Niederlande') - (b.titel === 'Niederlande') || ZEICHEN.compare(a.titel, b.titel));
  k.hubs = { aktiv: liste.length > 0, laender: liste };
  return H;
}

// Ein Eintrag der A–Z-Liste: Gemeinde mit ihren Ortsteilen, oder ein Ortsteil ohne Gemeindeseite in den Daten.
// Die Zone steht nur, wenn das Gebiet mehrere Zonen hat; sonst nennt sie der Kopfsatz einmal.
function zeile(o, mitZone, zusatz = null) {
  const info = o.km === 0 ? 'Sitz des Betriebs' : kmText(o.km);
  return html`<div class="az-zeile"><span class="az-name"><a href="/schluesseldienst-${o.slug}/">${o.name}</a>${zusatz ? html` <span class="az-zusatz">${zusatz}</span>` : ''}</span><span class="az-meta" data-daten="">${info}${mitZone ? ` · Zone\u00A0${o.zone}` : ''}</span></div>`;
}

const gemeindeEintrag = (e, z) => html`<li class="az-gemeinde">${zeile(e.o, z)}${e.kinder.length ? html`<ul class="az-ortsteile">${e.kinder.map((t) => html`<li class="az-ortsteil">${zeile(t, z)}</li>`)}</ul>` : ''}</li>`;
const einzelEintrag = (e, z) => html`<li class="az-einzel">${zeile(e.o, z, e.zusatz)}</li>`;
const zonenVon = (orte) => [...new Set(orte.map((o) => o.zone))];

function verzeichnis(orte) {
  const mitZone = zonenVon(orte).length > 1;
  const gemeinden = orte.filter((o) => o.typ === 'gemeinde');
  const gemeindeIds = new Set(gemeinden.map((g) => g.id));
  const kinder = new Map();
  const waisen = [];
  for (const o of orte) {
    if (o.typ === 'gemeinde') continue;
    if (o.gemeindeId && gemeindeIds.has(o.gemeindeId)) {
      if (!kinder.has(o.gemeindeId)) kinder.set(o.gemeindeId, []);
      kinder.get(o.gemeindeId).push(o);
    } else waisen.push(o);
  }
  const nachBuchstabe = new Map(BUCHSTABEN.map((b) => [b, []]));
  const einordnen = (e) => {
    const b = anfang(e.o.name);
    if (!nachBuchstabe.has(b)) throw new Error(`Hub: Name ohne Anfangsbuchstabe A–Z: ${e.o.name}`);
    nachBuchstabe.get(b).push(e);
  };
  for (const g of gemeinden) einordnen({ o: g, kinder: sortiert(kinder.get(g.id) || []) });
  for (const o of waisen) einordnen({ o, zusatz: o.gemeinde ? `Ortsteil von ${o.gemeinde}` : 'Ortsteil' });

  const vorhanden = BUCHSTABEN.filter((b) => nachBuchstabe.get(b).length);
  const leiste = html`<nav class="az-leiste" aria-label="Buchstaben im Verzeichnis">
<ul class="az-buchstaben">${BUCHSTABEN.map((b) => (nachBuchstabe.get(b).length
    ? html`<li><a href="#buchstabe-${b.toLowerCase()}">${b}</a></li>`
    : html`<li><span class="az-leer">${b}</span></li>`))}</ul>
</nav>`;
  const gruppen = vorhanden.map((b) => {
    const id = `buchstabe-${b.toLowerCase()}`;
    const eintraege = nachBuchstabe.get(b).sort((x, y) => ZEICHEN.compare(x.o.name, y.o.name));
    // Unter 64em klebt die Leiste nicht: jede Gruppe führt mit „A–Z“ zurück zu ihr (nur dort sichtbar, az.css)
    return html`<section class="az-gruppe" id="${id}" aria-labelledby="${id}-titel">
<div class="az-kopf"><h3 class="az-buchstabe" id="${id}-titel">${b}</h3><a class="az-hoch" href="#az-titel">A–Z</a></div>
<ul class="az-liste">${eintraege.map((e) => (e.o.typ === 'gemeinde' ? gemeindeEintrag(e, mitZone) : einzelEintrag(e, mitZone)))}</ul>
</section>`;
  });
  return html`${leiste}<div class="az-verzeichnis">${gruppen}</div>`;
}

function azAbschnitt(orte, band = false) {
  return html`<section class="${sektion(band)}" aria-labelledby="az-titel"><div class="raster">
${abschnittKopf({ id: 'az-titel', titel: 'A–Z-Verzeichnis' })}
${verzeichnis(orte)}
</div></section>`;
}

// Der Kreis in Zahlen (K-08): vier feste Einträge, berechnet nur aus orte.json und den Zonen aus zonen.mjs.
// Keine Wertung, keine Fließtext-Varianten. Jede Zahl steht in data-daten. Niederlande: vierstellige Postleitzahlen.
const zahlD = (n) => html`<span data-daten="">${zahl(n)}</span>`;
const kmD = (n) => html`<span data-daten="">${zahl(n)}</span>&nbsp;km`;
const ein = (n, eins, viele) => (n === 1 ? eins : viele);
const nachKm = (richtung) => (a, b) => (richtung * (a.km - b.km)) || ZEICHEN.compare(a.name, b.name);
const nachWeilburg = (o) => (o.km === 0 ? 'Sitz des Betriebs' : kmD(o.km));
const ortLink = (o) => html`<a href="/schluesseldienst-${o.slug}/">${o.name}</a>`;

function zonenZeile(orte, zonen) {
  const liste = [...zonen.stufen.map((s) => ({ id: s.id, titel: s.titel })), { id: 'NL', titel: zonen.nl.titel }]
    .map((z) => ({ ...z, n: orte.filter((o) => o.zone === z.id).length }))
    .filter((z) => z.n > 0);
  if (liste.reduce((a, z) => a + z.n, 0) !== orte.length) throw new Error(`Hub: Orte mit unbekannter Zone (${orte.length} Orte)`);
  return liste.map((z, i) => html`${i ? ', ' : ''}${zahlD(z.n)} ${ein(z.n, 'Ort', 'Orte')} in Zone\u00A0${z.id} (${z.titel})`);
}

// Deutsche Postleitzahlen fünfstellig, niederländische vierstellig (Ziffernteil, wie in den GeoNames-Daten)
const PLZ_FORM = { DE: /^\d{5}$/, NL: /^\d{4}$/ };
function plzZeile(orte, staat) {
  const form = PLZ_FORM[staat] ?? PLZ_FORM.DE;
  const plz = orte.filter((o) => o.staat === staat).flatMap((o) => o.plz || []).filter((p) => form.test(p)).sort();
  if (!plz.length) return 'Keine Postleitzahl in den Daten';
  const [kleinste, groesste] = [plz[0], plz[plz.length - 1]];
  // ausgeschrieben, weil die Spanne über mehrere Leitregionen reichen kann (kein lückenloser Bereich)
  return kleinste === groesste ? html`<span data-daten="">${kleinste}</span>` : html`kleinste <span data-daten="">${kleinste}</span>, größte <span data-daten="">${groesste}</span>`;
}

// Gebietsart für die Überschrift: Provinz (NL), Stadt (kreisfreie Städte, auch die drei, die GeoNames ohne Zusatz
// führt), Region (Kommunalverbände) oder Kreis
const STADT_OHNE_ZUSATZ = new Set(['Delmenhorst', 'Dessau-Roßlau', 'Frankfurt am Main']);
export function gebietsart(titel, nl) {
  if (nl) return 'Provinz';
  if (/^(Kreisfreie Stadt|Stadtkreis|Landeshauptstadt)\s/.test(titel) || STADT_OHNE_ZUSATZ.has(titel)) return 'Stadt';
  if (/^(Region|Städteregion|Regionalverband)\s/.test(titel)) return 'Region';
  return 'Kreis';
}

// art: 'Kreis' | 'Provinz' | 'Stadt' | 'Region' – nur für die Überschrift
export function kennzahlenAbschnitt(zonen, orte, staat, art, band = false) {
  const gemeinden = orte.filter((o) => o.typ === 'gemeinde').length;
  const ortsteile = orte.filter((o) => o.typ === 'ortsteil').length;
  const naechster = [...orte].sort(nachKm(1))[0];
  const entferntester = [...orte].sort(nachKm(-1))[0];
  const eintraege = [
    // Null-Werte entfallen (Stadtstaaten haben in den Daten nur Ortsteile)
    html`<dt>Gemeinden und Ortsteile</dt><dd>${[[gemeinden, 'Gemeinde', 'Gemeinden'], [ortsteile, 'Ortsteil', 'Ortsteile']].filter(([n]) => n > 0).map(([n, eins, viele], i) => html`${i ? ' · ' : ''}${zahlD(n)} ${ein(n, eins, viele)}`)}</dd>`,
    // ein Ort oder alle gleich weit: eine Zeile statt zweimal desselben Orts
    naechster.km === entferntester.km
      ? html`<dt>Entfernung ab Weilburg</dt><dd>${orte.length === 1 ? html`Einziger Ort: ${ortLink(naechster)}, ${nachWeilburg(naechster)}` : html`${orte.length === 2 ? 'Beide' : 'Alle'} Orte: ${nachWeilburg(naechster)}`}</dd>`
      : html`<dt>Nächster und entferntester Ort ab Weilburg</dt><dd><span class="kreis-zahlen-zeile">Nächster: ${ortLink(naechster)}, ${nachWeilburg(naechster)}</span><span class="kreis-zahlen-zeile">Entferntester: ${ortLink(entferntester)}, ${nachWeilburg(entferntester)}</span></dd>`,
    html`<dt>Verteilung auf die Zonen</dt><dd>${zonenZeile(orte, zonen)}</dd>`,
  ];
  eintraege.push(html`<dt>Postleitzahlen</dt><dd>${plzZeile(orte, staat)}</dd>`);
  return html`<section class="${sektion(band)}" aria-labelledby="hub-zahlen-titel"><div class="raster"><div class="hub-teilung">
${abschnittKopf({ id: 'hub-zahlen-titel', titel: `${art === 'Kreis' ? 'Der' : 'Die'} ${art} in Zahlen` })}
<dl class="kreis-zahlen">${eintraege}</dl>
</div></div></section>`;
}

// Listen nach dem Namenskern sortiert („Limburg-Weilburg“ unter L, nicht alle Landkreise unter L)
const ART = /^(Landkreis|Kreis|Stadtkreis|Städteregion|Region|Kreisfreie Stadt)\s+(.+)$/;
// Die Art steht bei jedem Gebiet aus den Daten: Zusatz im Namen, sonst die Gebietsart (Frankfurt am Main ist
// kreisfreie Stadt, „Börde“ ein Kreis). Sie entfällt nur, wo der Name sie schon trägt (Lahn-Dill-Kreis,
// Regionalverband Saarbrücken) und bei den Provinzen (die Überschrift nennt sie).
const OHNE_ART = { Stadt: 'kreisfreie Stadt', Kreis: 'Kreis', Region: '' };
const kreisTeile = (titel, nl = false) => {
  const m = ART.exec(titel);
  if (m) return { kern: m[2], art: m[1] === 'Kreisfreie Stadt' ? 'kreisfreie Stadt' : m[1] };
  return { kern: titel, art: nl || /kreis/i.test(titel) ? '' : OHNE_ART[gebietsart(titel, false)] };
};
const nachKern = (a, b) => ZEICHEN.compare(kreisTeile(a.titel).kern, kreisTeile(b.titel).kern);
// Zwei Zeilen je Kreis, immer gleich hoch: Name (unterstrichen), darunter Ortszahl, Entfernung und Art. Die Zahlen
// stehen vorn, damit sie in jeder Zeile an derselben Stelle beginnen; die Art folgt leise (sie fehlt, wo der Name sie
// trägt). Die ganze Zeile ist der Link, damit „Kassel“ (Landkreis) und „Kassel“ (kreisfreie Stadt) unterscheidbar heißen.
const kreisZeile = (l, kr) => {
  const { kern, art } = kreisTeile(kr.titel, l.staat === 'NL');
  const s = spanne(kr.orte);
  return html`<li><a class="hub-zeile" href="/einsatzgebiet/${l.landSlug}/${kr.kreisSlug}/"><span class="hub-name">${kern}</span>${s.min === 0 ? html` <span class="hub-sitz">Sitz</span>` : ''}<span class="hub-meta"><span data-daten="">${orteText(kr.orte.length)} · ${s.text}</span>${art ? ` · ${art}` : ''}</span></a></li>`;
};

function kreiseAbschnitt(l, band = false) {
  const kreise = [...l.kreise.values()].sort(nachKern);
  return html`<section class="${sektion(band)}" aria-labelledby="hub-kreise-titel"><div class="raster">
${abschnittKopf({ id: 'hub-kreise-titel', titel: l.staat === 'NL' ? 'Provinzen' : 'Kreise' })}
<ul class="hub-kreise">${kreise.map((kr) => kreisZeile(l, kr))}</ul>
</div></section>`;
}

// Geschwisterkreise auf jeder Kreisseite: jede Kreisseite bekommt so eingehende Links von ihren Nachbarn
function weitereKreise(l, aktuell, band = false) {
  const andere = [...l.kreise.values()].filter((kr) => kr !== aktuell).sort(nachKern);
  if (!andere.length) return '';
  return html`<section class="${sektion(band)}" aria-labelledby="hub-weitere-kreise-titel"><div class="raster">
${abschnittKopf({ id: 'hub-weitere-kreise-titel', titel: l.staat === 'NL' ? 'Weitere Provinzen' : 'Weitere Kreise' })}
<ul class="hub-kreise">${andere.map((kr) => kreisZeile(l, kr))}</ul>
</div></section>`;
}

function weitereAbschnitt(l, band = false) {
  if (!l.ohneKreis.length) return '';
  return html`<section class="${sektion(band)}" aria-labelledby="hub-weitere-titel"><div class="raster">
${abschnittKopf({ id: 'hub-weitere-titel', titel: 'Weitere Orte' })}
<ul class="az-liste hub-weitere">${sortiert(l.ohneKreis).map((o) => html`<li class="az-einzel">${zeile(o, zonenVon(l.ohneKreis).length > 1)}</li>`)}</ul>
</div></section>`;
}

const entfernungSatz = (s) => (s.min === s.max
  ? html`<span data-daten="">${kmText(s.min)}</span> ab Weilburg`
  : html`zwischen <span data-daten="">${kmText(s.min)}</span> und <span data-daten="">${kmText(s.max)}</span> ab Weilburg`);

// Liegt das ganze Gebiet in einer Zone, steht sie einmal im Kopfsatz statt in jeder Zeile des Verzeichnisses.
// „Zone“ und Kennbuchstabe bleiben in einer Zeile (geschütztes Leerzeichen).
function zonenSatz(k, orte) {
  const ids = zonenVon(orte);
  if (ids.length > 1) return '. Die Zone steht bei jedem Ort.';
  const titel = ids[0] === 'NL' ? k.konfig.zonen.nl.titel : k.konfig.zonen.stufen.find((z) => z.id === ids[0])?.titel;
  return `, ${orte.length === 1 ? '' : orte.length === 2 ? 'beide ' : 'alle '}in Zone\u00A0${ids[0]}${titel ? ` (${titel})` : ''}.`;
}

// Gebietslage im Kopf: Legende nur für die gezeigten Zonen und Ringe (Texte aus zonen.mjs)
const MARKE = { A: 'gk-marke-a', B: '', C: 'gk-marke-c', D: 'gk-marke-c', CD: 'gk-marke-c' };
function lageFigur(k, orte, name) {
  const { zonen } = k.konfig;
  const nl = orte.every((o) => o.staat === 'NL');
  const { svg, zonen: gezeigt, ringe } = gebietslage({
    orte, sitz: H.sitz, praefix: 'hub-lage',
    titel: `${name}: ${orteText(orte.length)} als Punkte nach Zone, mit der Lage zu Weilburg`,
  });
  const stufe = (id) => zonen.stufen.find((z) => z.id === id);
  // C und D teilen sich in der Karte eine Marke, also auch einen Legendeneintrag (Kurztexte aus zonen.mjs)
  const eintraege = gezeigt.includes('C') && gezeigt.includes('D') ? [...gezeigt.filter((id) => id !== 'C' && id !== 'D'), 'CD'] : gezeigt;
  const zonenText = (id) => (nl ? zonen.nl.kurz : id === 'CD' ? `Zonen C und D – ${stufe('C').kurz.split(' – ').at(-1)}` : `Zone ${id} – ${stufe(id)?.titel}`);
  return html`<figure class="hub-figur">${svg}<figcaption class="gk-legende">
${eintraege.map((id) => html`<span><span class="gk-marke${MARKE[id] ? ` ${MARKE[id]}` : ''}" aria-hidden="true"></span>${zonenText(id)}</span>`)}
${ringe.length ? html`<span><span class="gk-marke gk-marke-ring" aria-hidden="true"></span>Ringe bei ${ringe.length > 1 ? `${ringe.slice(0, -1).join(', ')} und ${ringe.at(-1)}` : ringe[0]} km Luftlinie</span>` : ''}
</figcaption></figure>`;
}

// Schlussband wie auf /einsatzgebiet/ (Text von dort): Kontakt immer, der Anruf nur, wenn im Gebiet Orte mit
// Notöffnung liegen (Zonen A und B); in fernen Gebieten wäre er ein Angebot, das dort nicht gilt
function schluss(sk, k, orte) {
  const notfall = k.konfig.zonen.stufen.some((z) => z.notoeffnung === 'ja' && orte.some((o) => o.zone === z.id));
  const s = gebiet.schluss;
  return html`<section class="sektion band-dunkel schluss" aria-labelledby="schluss-titel">
<div class="raster"><div class="schluss-teilung">
<div><h2 id="schluss-titel">${s.titel}</h2><p>${text(s.text)}</p></div>
<div class="schluss-handlung">${notfall ? rufknopf(sk, { variante: 'gross' }) : ''}<a class="knopf knopf-sekundaer" href="${s.link.pfad}">${s.link.text}${sk.icon('pfeil-rechts')}</a></div>
</div></div>
</section>`;
}

function seite(k, { pfad, stufen, h1, titel, beschreibung, kicker, satz, abschnitt, figur, orte }) {
  if (titel.length > TITEL_MAX) throw new Error(`Hub ${pfad}: Titel ${titel.length} Zeichen`);
  if (beschreibung.length < BESCHREIBUNG_MIN || beschreibung.length > BESCHREIBUNG_MAX) throw new Error(`Hub ${pfad}: Beschreibung ${beschreibung.length} Zeichen`);
  return {
    pfad, titel, beschreibung, typ: 'hub', ansicht: 'V06', sitemap: 'hubs', koerperKlasse: 'seite-hub', stile: ['gebiet', 'hubs'], ogBild: '/assets/og/einsatzgebiet.png', brotkrumen: stufen,
    jsonld: [brotkrumenLd(k.basisUrl, stufen), { '@context': 'https://schema.org', '@type': 'CollectionPage', name: h1, url: `${k.basisUrl}${pfad}` }],
    inhalt: (sk) => html`<section class="hub-kopf" aria-labelledby="hub-titel"><div class="raster"><div class="hub-kopf-teilung">
<div>
<span class="scherlinie scherlinie-leit kopf-linie" aria-hidden="true"></span>
<p class="hub-kicker">${kicker}</p>
<h1 id="hub-titel">${h1}</h1>
<p class="hub-satz">${satz}</p>
</div>
${figur}
</div></div></section>
${abschnitt}
${schluss(sk, k, orte)}`,
  };
}

export function seiten(k) {
  if (!H) vorbereiten(k);
  const aus = [];
  for (const l of H.laender.values()) {
    const stadt = l.kreise.has(l.landSlug);
    if (stadt && l.kreise.size > 1) throw new Error(`Hub ${l.landSlug}: Stadtstaat mit weiteren Kreisen`);
    const nl = l.staat === 'NL';
    const pfadLand = `/einsatzgebiet/${l.landSlug}/`;
    const stufenLand = [{ titel: 'Einsatzgebiet', pfad: '/einsatzgebiet/' }, { titel: l.titel, pfad: pfadLand }];
    const s = spanne(l.orte);
    const n = l.orte.length;
    const h1Land = `Schlüsseldienst ${l.titel}`;
    if (stadt) {
      aus.push(seite(k, {
        pfad: pfadLand, stufen: stufenLand, h1: h1Land, titel: titelMit(l.titel, 'Orte A–Z'), kicker: 'Einsatzgebiet',
        beschreibung: `${orteText(n)} im Verzeichnis: ${l.titel}, A–Z geordnet. ${SITZ_ZEILE}`,
        satz: html`<span data-daten="">${orteText(n)}</span>, ${entfernungSatz(s)}${zonenSatz(k, l.orte)}`,
        figur: lageFigur(k, l.orte, l.titel), orte: l.orte,
        abschnitt: html`${kennzahlenAbschnitt(k.konfig.zonen, l.orte, l.staat, 'Stadt', true)}${azAbschnitt(l.orte)}`,
      }));
      continue;
    }
    aus.push(seite(k, {
      pfad: pfadLand, stufen: stufenLand, h1: h1Land, titel: titelMit(l.titel, nl ? 'Orte nach Provinzen' : 'Orte nach Kreisen'), kicker: 'Einsatzgebiet',
      beschreibung: `${orteText(n)} im Verzeichnis: ${l.titel}, nach ${nl ? 'Provinzen' : 'Kreisen'} geordnet. ${SITZ_ZEILE}`,
      satz: html`<span data-daten="">${orteText(n)}</span>, ${entfernungSatz(s)}. ${nl ? 'Die Provinzen' : 'Die Kreise'} stehen unten mit Ortszahl und Entfernung.`,
      figur: lageFigur(k, l.orte, l.titel), orte: l.orte,
      abschnitt: html`${kreiseAbschnitt(l, true)}${weitereAbschnitt(l)}`,
    }));
    for (const kr of l.kreise.values()) {
      const pfad = `/einsatzgebiet/${l.landSlug}/${kr.kreisSlug}/`;
      const name = kreisName(kr.titel);
      const stufen = [...stufenLand, { titel: name, pfad }];
      const h1 = `Schlüsseldienst ${name}`;
      const titel = titelMit(kurzName(kr.titel), 'Orte A–Z');
      const sk = spanne(kr.orte);
      aus.push(seite(k, {
        pfad, stufen, h1, titel, kicker: `Einsatzgebiet · ${l.titel}`,
        beschreibung: `${orteText(kr.orte.length)} im Verzeichnis: ${name}. ${SITZ_ZEILE}`,
        satz: html`<span data-daten="">${orteText(kr.orte.length)}</span>, ${entfernungSatz(sk)}${zonenSatz(k, kr.orte)}`,
        figur: lageFigur(k, kr.orte, name), orte: kr.orte,
        abschnitt: html`${kennzahlenAbschnitt(k.konfig.zonen, kr.orte, l.staat, gebietsart(kr.titel, nl), true)}${azAbschnitt(kr.orte)}${weitereKreise(l, kr, true)}`,
      }));
    }
  }
  return aus;
}
