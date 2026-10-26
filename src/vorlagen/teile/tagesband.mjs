// Tagesband (V04, K-009 „Spaltenmarke jetzt gültig“): zwei Zeilen 0–24 Uhr (werktags; Wochenende und Feiertag).
// Ein SVG ohne viewBox: x in Prozent der Breite, y in px. So bleiben Schrift und Striche auf jeder Breite gleich groß –
// die früheren skalierten Fassungen ließen die Beschriftung auf dem Tablet auf etwa 10 px schrumpfen.
// Positionen nur über SVG-Attribute (K-008). Die Legende als <dl> trägt die Aussage; das SVG ist dekorativ.
// Ohne konfigurierte Uhrzeiten keine erfundenen Grenzen: eine einzige Zeile ohne Titel als Platzhalter (Kupfer-Schraffur
// wie .platzhalter) und keine Legende – die Fenster samt „[Uhrzeit folgt]“ nennt die Preistabelle direkt darunter.
// Die Marke „jetzt“ zeigt trotzdem die Uhrzeit (setzt das Modul tagesband).
import { html } from '../../../bau/lib/html.mjs';
import { istPlatzhalter } from '../../../bau/lib/platzhalter.mjs';
import { bandPruefen, minutenVon, TAGESARTEN } from '../../assets/js/logik/preise.mjs';
import { fensterZeit } from './preisauszug.mjs';

// Senkrechte Maße einer Zeile in px (Grundlinien). Die Marke „jetzt“ hat eine eigene Spur zwischen Titel und Balken:
// Morgens steht sie links unter dem Zeilentitel und darf ihn nicht berühren. Gemessen an den Textboxen (fs--1, bis 15 px):
// mindestens 8 px zum Titel, mindestens 4 px zum Balken. Beide Zeilen haben dieselbe Spur, mit oder ohne Marke.
// Der Abstand zwischen den Zeilen ist deutlich größer als der zwischen Titel und Balken, sonst gehörte der zweite
// Titel optisch zur Skala darüber.
// Offen (ohne Uhrzeiten) entfällt der Titel, die Marke rückt nach oben, der Balken ist flacher: Er trägt keine Namen.
function masse(offen) {
  const titelY = 14;
  const markeY = offen ? 14 : 40;
  const balkenY = markeY + 16;
  const balkenH = offen ? 24 : 36;
  const skalaY = balkenY + balkenH;
  const zahlY = skalaY + 22;
  const versatz = offen ? { werktags: 0, wochenende: 0 } : { werktags: 0, wochenende: zahlY + 60 };
  return { titelY, markeY, markeTextY: markeY + 5, balkenY, balkenH, skalaY, zahlY, versatz, h: versatz.wochenende + zahlY + 6 };
}
const TITEL = { werktags: 'Montag bis Freitag', wochenende: 'Samstag, Sonntag und Feiertag' };

// Name im Balken nur, wenn er auch auf der kleinsten Breite des Bereichs hineinpasst. Die Bereiche sind die
// Container-Abfragen in preise.css (24em, 36em, 46em, 56em bei mindestens 17 px Schrift); geschätzt 8 px je Zeichen
// plus Rand. Die Legende nennt jeden Namen immer.
const BEREICHE = [['0', 240], ['s', 408], ['m', 612], ['l', 782], ['xl', 952]];
const nameAb = (name, anteil) => BEREICHE.find(([, breite]) => anteil * breite >= name.length * 8 + 20)?.[0] ?? null;

const pz = (wert) => `${Number(wert.toFixed(3))}%`;
// Uhrzeit der Legende: jede Spanne („07:00–18:00“) bleibt beisammen, umbrochen wird nur zwischen Tagesart und Spanne
const legendenZeit = (zeit) => (typeof zeit === 'string'
  ? zeit.split(/(\d\d:\d\d–\d\d:\d\d)/).map((teil, i) => (i % 2 ? html`<span class="tb-spanne">${teil}</span>` : teil))
  : zeit);
const anteilVon = (hhmm) => minutenVon(hhmm) / (24 * 60);

function skala(m) {
  const stunden = Array.from({ length: 25 }, (_, h) => h);
  return html`<g class="tb-skala">${stunden.map((h) => html`<line class="${h % 6 ? 'tb-strich-klein' : 'tb-strich'}" x1="${pz((h / 24) * 100)}" x2="${pz((h / 24) * 100)}" y1="${m.skalaY}" y2="${m.skalaY + (h % 6 ? 3 : 6)}"/>`)}${[0, 6, 12, 18, 24].map((h) => {
    const anker = h === 0 ? 'start' : h === 24 ? 'end' : 'middle';
    const hh = String(h).padStart(2, '0');
    return html`<text class="tb-uhr" x="${pz((h / 24) * 100)}" y="${m.zahlY}" text-anchor="${anker}"><tspan class="tb-kurz">${hh}</tspan><tspan class="tb-lang">${hh}:00</tspan></text>`;
  })}</g>`;
}

function zeile({ art, band, offen, titel, praefix, m }) {
  const kopf = offen ? '' : html`<text class="tb-zeile-titel" y="${m.titelY}">${TITEL[art]}</text>`;
  // Platzhalter: Fläche und gestrichelte Kante wie .platzhalter (basis.css), Radius r-s
  const balken = offen
    ? html`<rect class="tb-offen" x="0" y="${m.balkenY}" width="100%" height="${m.balkenH}" rx="2" fill="url(#${praefix}-schraffur)"/>`
    : html`<g class="tb-teile">${band[art].map(([id, von, bis]) => {
      const x0 = anteilVon(von);
      const breite = anteilVon(bis) - x0;
      const ab = nameAb(titel.get(id), breite);
      return html`<rect class="tb-teil tb-${id}" data-fenster="${id}" x="${pz(x0 * 100)}" y="${m.balkenY}" width="${pz(breite * 100)}" height="${m.balkenH}"/>${ab ? html`<text class="tb-name tb-name-ab-${ab}" x="${pz(x0 * 100)}" dx="10" y="${m.balkenY + 23}">${titel.get(id)}</text>` : ''}`;
    })}</g>`;
  return html`<g class="tb-zeile" data-art="${art}" transform="translate(0 ${m.versatz[art]})">${kopf}${balken}${skala(m)}</g>`;
}

export function tagesband(sk, { praefix = 'tb', jetztText = 'jetzt', hinweis = '' } = {}) {
  const { preise } = sk.konfig;
  const band = preise.tagesband;
  const fenster = preise.zeitfenster;
  const titel = new Map(fenster.map((f) => [f.id, f.titel]));
  const offen = istPlatzhalter(band);
  if (!offen) {
    const fehler = bandPruefen(band, fenster.map((f) => f.id));
    if (fehler.length) throw new Error(`preise.tagesband ungültig: ${fehler.join('; ')}`);
  }
  const m = masse(offen);
  const daten = JSON.stringify({ band: offen ? null : band, zeilen: m.versatz });
  // Die Marke steht anfangs bei 0 % und ist verborgen, bis das Modul Zeile, Lage und Uhrzeit gesetzt hat.
  const marke = html`<g class="tb-jetzt" data-rolle="marke"><line x1="0" x2="0" y1="${m.markeY}" y2="${m.skalaY + 6}"/><circle cx="0" cy="${m.markeY}" r="4"/><text class="tb-jetzt-text" x="0" dx="8" y="${m.markeTextY}">${jetztText} <tspan class="tb-jetzt-zeit"></tspan></text></g>`;
  // Schraffur im Maß von .platzhalter: Streifen 4 breit im Abstand 8, steigend wie --winkel-schraffur
  const muster = html`<defs><pattern id="${praefix}-schraffur" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect class="tb-schraffur" width="4" height="8"/></pattern></defs>`;
  return html`<figure class="tagesband" data-modul="tagesband" data-band="${daten}"${offen ? html` data-zustand="offen"` : ''}>
<svg class="tagesband-svg" width="100%" height="${m.h}" aria-hidden="true" focusable="false">${offen ? muster : ''}${(offen ? TAGESARTEN.slice(0, 1) : TAGESARTEN).map((art) => zeile({ art, band, offen, titel, praefix, m }))}${marke}</svg>
${offen ? '' : html`<dl class="tagesband-legende">${fenster.map((f) => html`<div class="tb-eintrag tb-eintrag-${f.id}" data-fenster="${f.id}"><dt>${f.titel}</dt><dd>${legendenZeit(fensterZeit(preise, f))}</dd></div>`)}</dl>`}
${hinweis ? html`<figcaption class="tb-hinweis">${hinweis}</figcaption>` : ''}
</figure>`;
}
