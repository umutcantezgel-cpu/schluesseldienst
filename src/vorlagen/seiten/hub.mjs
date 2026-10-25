// V06 Hub: Länderseite /einsatzgebiet/{landSlug}/ und Kreisseite /einsatzgebiet/{landSlug}/{kreisSlug}/.
// Alle Namen, Zahlen und Entfernungen stammen aus src/daten/orte.json (nur Einträge mit slug).
// Länder mit Kreisen: Kreisliste mit Ortszahl und Entfernungsspanne. Kreise und Stadtstaaten (kreisSlug === landSlug):
// A–Z-Verzeichnis aller Orte mit klebender Buchstabenleiste; Gemeinden fett, Ortsteile eingerückt, je km und Zone.
// Niederlande: die Kreise sind Provinzen. Hubs setzen k.hubs.aktiv und k.hubs.laender (Fußnavigation, Ortsseiten).
import { html } from '../../../bau/lib/html.mjs';
import { abschnittKopf } from '../teile/abschnitt.mjs';
import { brotkrumenLd } from '../teile/brotkrumen.mjs';

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
  H = { laender };
  // Alphabetisch, Niederlande zuletzt (wie die Einsatzgebiet-Übersicht)
  const liste = [...laender.values()].map((l) => ({ titel: l.titel, pfad: `/einsatzgebiet/${l.landSlug}/` }))
    .sort((a, b) => (a.titel === 'Niederlande') - (b.titel === 'Niederlande') || ZEICHEN.compare(a.titel, b.titel));
  k.hubs = { aktiv: liste.length > 0, laender: liste };
  return H;
}

// Ein Eintrag der A–Z-Liste: Gemeinde mit ihren Ortsteilen, oder ein Ortsteil ohne Gemeindeseite in den Daten.
function zeile(o, zusatz = null) {
  const info = o.km === 0 ? 'Sitz des Betriebs' : kmText(o.km);
  return html`<div class="az-zeile"><span class="az-name"><a href="/schluesseldienst-${o.slug}/">${o.name}</a>${zusatz ? html` <span class="az-zusatz">${zusatz}</span>` : ''}</span><span class="az-meta" data-daten="">${info} · Zone ${o.zone}</span></div>`;
}

const gemeindeEintrag = (e) => html`<li class="az-gemeinde">${zeile(e.o)}${e.kinder.length ? html`<ul class="az-ortsteile">${e.kinder.map((t) => html`<li class="az-ortsteil">${zeile(t)}</li>`)}</ul>` : ''}</li>`;
const einzelEintrag = (e) => html`<li class="az-einzel">${zeile(e.o, e.zusatz)}</li>`;

function verzeichnis(orte) {
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
    return html`<section class="az-gruppe" id="${id}" aria-labelledby="${id}-titel">
<h3 class="az-buchstabe" id="${id}-titel">${b}</h3>
<ul class="az-liste">${eintraege.map((e) => (e.o.typ === 'gemeinde' ? gemeindeEintrag(e) : einzelEintrag(e)))}</ul>
</section>`;
  });
  return html`${leiste}<div class="az-verzeichnis">${gruppen}</div>`;
}

function azAbschnitt(orte) {
  return html`<section class="sektion sektion-dicht" aria-labelledby="az-titel"><div class="raster">
${abschnittKopf({ id: 'az-titel', titel: 'A–Z-Verzeichnis' })}
${verzeichnis(orte)}
</div></section>`;
}

// Der Kreis in Zahlen (K-08): vier feste Einträge, berechnet nur aus orte.json und den Zonen aus zonen.mjs.
// Keine Wertung, keine Fließtext-Varianten. Jede Zahl steht in data-daten. Niederlande: ohne PLZ (nur deutsche Kreise).
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
  return liste.map((z, i) => html`${i ? ', ' : ''}${zahlD(z.n)} ${ein(z.n, 'Ort', 'Orte')} in Zone ${z.id} (${z.titel})`);
}

function plzZeile(orte) {
  const plz = orte.filter((o) => o.staat === 'DE').flatMap((o) => o.plz || []).filter((p) => /^\d{5}$/.test(p)).sort();
  if (!plz.length) return 'Keine Postleitzahl in den Daten';
  const [kleinste, groesste] = [plz[0], plz[plz.length - 1]];
  return kleinste === groesste ? html`<span data-daten="">${kleinste}</span>` : html`<span data-daten="">${kleinste}–${groesste}</span>`;
}

function kennzahlenAbschnitt(zonen, orte, staat) {
  const gemeinden = orte.filter((o) => o.typ === 'gemeinde').length;
  const ortsteile = orte.filter((o) => o.typ === 'ortsteil').length;
  const naechster = [...orte].sort(nachKm(1))[0];
  const entferntester = [...orte].sort(nachKm(-1))[0];
  const eintraege = [
    html`<dt>Gemeinden und Ortsteile</dt><dd>${zahlD(gemeinden)} ${ein(gemeinden, 'Gemeinde', 'Gemeinden')} · ${zahlD(ortsteile)} ${ein(ortsteile, 'Ortsteil', 'Ortsteile')}</dd>`,
    html`<dt>Nächster und entferntester Ort ab Weilburg</dt><dd><span class="kreis-zahlen-zeile">Nächster: ${ortLink(naechster)}, ${nachWeilburg(naechster)}</span><span class="kreis-zahlen-zeile">Entferntester: ${ortLink(entferntester)}, ${nachWeilburg(entferntester)}</span></dd>`,
    html`<dt>Verteilung auf die Zonen</dt><dd>${zonenZeile(orte, zonen)}</dd>`,
  ];
  if (staat === 'DE') eintraege.push(html`<dt>Postleitzahlen</dt><dd>${plzZeile(orte)}</dd>`);
  return html`<section class="sektion sektion-dicht" aria-labelledby="hub-zahlen-titel"><div class="raster">
${abschnittKopf({ id: 'hub-zahlen-titel', titel: 'Der Kreis in Zahlen' })}
<dl class="kreis-zahlen">${eintraege}</dl>
</div></section>`;
}

// Listen nach dem Namenskern sortiert („Limburg-Weilburg“ unter L, nicht alle Landkreise unter L); die Art steht leise dahinter
const ART = /^(Landkreis|Kreis|Stadtkreis|Städteregion|Region|Kreisfreie Stadt)\s+(.+)$/;
const kreisTeile = (titel) => { const m = ART.exec(titel); return m ? { kern: m[2], art: m[1] === 'Kreisfreie Stadt' ? 'kreisfreie Stadt' : m[1] } : { kern: titel, art: '' }; };
const nachKern = (a, b) => ZEICHEN.compare(kreisTeile(a.titel).kern, kreisTeile(b.titel).kern);
const kreisZeile = (l, kr) => {
  const { kern, art } = kreisTeile(kr.titel);
  const s = spanne(kr.orte);
  return html`<li${s.min === 0 ? html` class="hub-sitz"` : ''}><div class="hub-zeile"><a href="/einsatzgebiet/${l.landSlug}/${kr.kreisSlug}/">${kern}${art ? html` <span class="hub-art">${art}</span>` : ''}${s.min === 0 ? html` <span class="hub-art hub-art-sitz">Sitz</span>` : ''}</a><span class="hub-zahl" data-daten="">${orteText(kr.orte.length)} · ${s.text}</span></div></li>`;
};

function kreiseAbschnitt(l) {
  const kreise = [...l.kreise.values()].sort(nachKern);
  return html`<section class="sektion sektion-dicht" aria-labelledby="hub-kreise-titel"><div class="raster">
${abschnittKopf({ id: 'hub-kreise-titel', titel: l.staat === 'NL' ? 'Provinzen' : 'Kreise' })}
<ul class="hub-kreise">${kreise.map((kr) => kreisZeile(l, kr))}</ul>
</div></section>`;
}

// Geschwisterkreise auf jeder Kreisseite: jede Kreisseite bekommt so eingehende Links von ihren Nachbarn
function weitereKreise(l, aktuell) {
  const andere = [...l.kreise.values()].filter((kr) => kr !== aktuell).sort(nachKern);
  if (!andere.length) return '';
  return html`<section class="sektion sektion-dicht" aria-labelledby="hub-weitere-kreise-titel"><div class="raster">
${abschnittKopf({ id: 'hub-weitere-kreise-titel', titel: l.staat === 'NL' ? 'Weitere Provinzen' : 'Weitere Kreise' })}
<ul class="hub-kreise">${andere.map((kr) => kreisZeile(l, kr))}</ul>
</div></section>`;
}

function weitereAbschnitt(l) {
  if (!l.ohneKreis.length) return '';
  return html`<section class="sektion sektion-dicht" aria-labelledby="hub-weitere-titel"><div class="raster">
${abschnittKopf({ id: 'hub-weitere-titel', titel: 'Weitere Orte' })}
<ul class="az-liste hub-weitere">${sortiert(l.ohneKreis).map((o) => html`<li class="az-einzel">${zeile(o)}</li>`)}</ul>
</div></section>`;
}

const entfernungSatz = (s) => (s.min === s.max
  ? html`<span data-daten="">${kmText(s.min)}</span> ab Weilburg`
  : html`zwischen <span data-daten="">${kmText(s.min)}</span> und <span data-daten="">${kmText(s.max)}</span> ab Weilburg`);

function seite(k, { pfad, stufen, h1, titel, beschreibung, kicker, satz, abschnitt }) {
  if (titel.length > TITEL_MAX) throw new Error(`Hub ${pfad}: Titel ${titel.length} Zeichen`);
  if (beschreibung.length < BESCHREIBUNG_MIN || beschreibung.length > BESCHREIBUNG_MAX) throw new Error(`Hub ${pfad}: Beschreibung ${beschreibung.length} Zeichen`);
  return {
    pfad, titel, beschreibung, typ: 'hub', ansicht: 'V06', sitemap: 'hubs', koerperKlasse: 'seite-hub', stile: ['hubs'], ogBild: '/assets/og/einsatzgebiet.png', brotkrumen: stufen,
    jsonld: [brotkrumenLd(k.basisUrl, stufen), { '@context': 'https://schema.org', '@type': 'CollectionPage', name: h1, url: `${k.basisUrl}${pfad}` }],
    inhalt: () => html`<section class="hub-kopf" aria-labelledby="hub-titel"><div class="raster">
<p class="hub-kicker">${kicker}</p>
<h1 id="hub-titel">${h1}</h1>
<p class="hub-satz">${satz}</p>
</div></section>
${abschnitt}`,
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
        satz: html`<span data-daten="">${orteText(n)}</span>, ${entfernungSatz(s)}. Die Zone steht bei jedem Ort.`,
        abschnitt: html`${kennzahlenAbschnitt(k.konfig.zonen, l.orte, l.staat)}${azAbschnitt(l.orte)}`,
      }));
      continue;
    }
    aus.push(seite(k, {
      pfad: pfadLand, stufen: stufenLand, h1: h1Land, titel: titelMit(l.titel, nl ? 'Orte nach Provinzen' : 'Orte nach Kreisen'), kicker: 'Einsatzgebiet',
      beschreibung: `${orteText(n)} im Verzeichnis: ${l.titel}, nach ${nl ? 'Provinzen' : 'Kreisen'} geordnet. ${SITZ_ZEILE}`,
      satz: html`<span data-daten="">${orteText(n)}</span>, ${entfernungSatz(s)}. ${nl ? 'Die Provinzen' : 'Die Kreise'} stehen unten mit Ortszahl und Entfernung.`,
      abschnitt: html`${kreiseAbschnitt(l)}${weitereAbschnitt(l)}`,
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
        satz: html`<span data-daten="">${orteText(kr.orte.length)}</span>, ${entfernungSatz(sk)}. Die Zone steht bei jedem Ort.`,
        abschnitt: html`${kennzahlenAbschnitt(k.konfig.zonen, kr.orte, l.staat)}${azAbschnitt(kr.orte)}${weitereKreise(l, kr)}`,
      }));
    }
  }
  return aus;
}
