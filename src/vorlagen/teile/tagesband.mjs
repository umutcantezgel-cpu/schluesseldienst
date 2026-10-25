// Tagesband (V04, K-009 „Spaltenmarke jetzt gültig“): zwei Zeilen 0–24 Uhr (werktags; Wochenende und Feiertag).
// Ein SVG ohne viewBox: x in Prozent der Breite, y in px. So bleiben Schrift und Striche auf jeder Breite gleich groß –
// die früheren skalierten Fassungen ließen die Beschriftung auf dem Tablet auf etwa 10 px schrumpfen.
// Positionen nur über SVG-Attribute (K-008). Die Legende als <dl> trägt die Aussage; das SVG ist dekorativ.
// Ohne konfigurierte Uhrzeiten: schraffierte Zeilen und eine Legende ohne Farbfelder statt erfundener Grenzen; die Marke
// „jetzt“ zeigt trotzdem Tagesart und Uhrzeit (setzt das Modul tagesband).
import { html } from '../../../bau/lib/html.mjs';
import { istPlatzhalter } from '../../../bau/lib/platzhalter.mjs';
import { bandPruefen, minutenVon, TAGESARTEN } from '../../assets/js/logik/preise.mjs';
import { fensterZeit } from './preisauszug.mjs';

// Senkrechte Maße einer Zeile in px: Titel, Spur für die Marke, Balken, Skala
const TITEL_Y = 14;
const MARKE_Y = 26;
const BALKEN_Y = 40;
const BALKEN_H = 36;
const SKALA_Y = BALKEN_Y + BALKEN_H;
const ZAHL_Y = SKALA_Y + 22;
const VERSATZ = { werktags: 0, wochenende: 120 };
const H = VERSATZ.wochenende + ZAHL_Y + 6;
const TITEL = { werktags: 'Montag bis Freitag', wochenende: 'Samstag, Sonntag und Feiertag' };

// Name im Balken nur, wenn er auch auf der kleinsten Breite des Bereichs hineinpasst (px des SVG je Breakpoint;
// geschätzt 8 px je Zeichen plus Rand). Die Klasse schaltet ihn ab dem Breakpoint ein; die Legende nennt ihn immer.
const BEREICHE = [['0', 240], ['30', 390], ['48', 660], ['64', 900]];
const nameAb = (name, anteil) => BEREICHE.find(([, breite]) => anteil * breite >= name.length * 8 + 20)?.[0] ?? null;

const pz = (wert) => `${Number(wert.toFixed(3))}%`;
const anteilVon = (hhmm) => minutenVon(hhmm) / (24 * 60);

function skala() {
  const stunden = Array.from({ length: 25 }, (_, h) => h);
  return html`<g class="tb-skala">${stunden.map((h) => html`<line class="${h % 6 ? 'tb-strich-klein' : 'tb-strich'}" x1="${pz((h / 24) * 100)}" x2="${pz((h / 24) * 100)}" y1="${SKALA_Y}" y2="${SKALA_Y + (h % 6 ? 3 : 6)}"/>`)}${[0, 6, 12, 18, 24].map((h) => {
    const anker = h === 0 ? 'start' : h === 24 ? 'end' : 'middle';
    const hh = String(h).padStart(2, '0');
    return html`<text class="tb-uhr" x="${pz((h / 24) * 100)}" y="${ZAHL_Y}" text-anchor="${anker}"><tspan class="tb-kurz">${hh}</tspan><tspan class="tb-lang">${hh}:00</tspan></text>`;
  })}</g>`;
}

function zeile({ art, band, offen, titel, praefix }) {
  const kopf = html`<text class="tb-zeile-titel" y="${TITEL_Y}">${TITEL[art]}</text>`;
  const balken = offen
    ? html`<rect class="tb-offen" x="0" y="${BALKEN_Y}" width="100%" height="${BALKEN_H}" rx="4" fill="url(#${praefix}-schraffur)"/>`
    : html`<g clip-path="url(#${praefix}-kappe)">${band[art].map(([id, von, bis]) => {
      const x0 = anteilVon(von);
      const breite = anteilVon(bis) - x0;
      const ab = nameAb(titel.get(id), breite);
      return html`<rect class="tb-teil tb-${id}" data-fenster="${id}" x="${pz(x0 * 100)}" y="${BALKEN_Y}" width="${pz(breite * 100)}" height="${BALKEN_H}"/>${ab ? html`<text class="tb-name tb-name-ab-${ab}" x="${pz(x0 * 100)}" dx="10" y="${BALKEN_Y + 23}">${titel.get(id)}</text>` : ''}`;
    })}</g>`;
  return html`<g class="tb-zeile" data-art="${art}" transform="translate(0 ${VERSATZ[art]})">${kopf}${balken}${skala()}</g>`;
}

export function tagesband(sk, { praefix = 'tb', jetztText = 'jetzt' } = {}) {
  const { preise } = sk.konfig;
  const band = preise.tagesband;
  const fenster = preise.zeitfenster;
  const titel = new Map(fenster.map((f) => [f.id, f.titel]));
  const offen = istPlatzhalter(band);
  if (!offen) {
    const fehler = bandPruefen(band, fenster.map((f) => f.id));
    if (fehler.length) throw new Error(`preise.tagesband ungültig: ${fehler.join('; ')}`);
  }
  const daten = JSON.stringify({ band: offen ? null : band, zeilen: VERSATZ });
  // Die Marke steht anfangs bei 0 % und ist verborgen, bis das Modul Zeile, Lage und Uhrzeit gesetzt hat.
  const marke = html`<g class="tb-jetzt" data-rolle="marke"><line x1="0" x2="0" y1="${MARKE_Y}" y2="${SKALA_Y + 6}"/><circle cx="0" cy="${MARKE_Y}" r="4"/><text class="tb-jetzt-text" x="0" dx="8" y="${MARKE_Y + 4}">${jetztText} <tspan class="tb-jetzt-zeit"></tspan></text></g>`;
  return html`<figure class="tagesband" data-modul="tagesband" data-band="${daten}"${offen ? html` data-zustand="offen"` : ''}>
<svg class="tagesband-svg" width="100%" height="${H}" aria-hidden="true" focusable="false"><defs>${offen
    ? html`<pattern id="${praefix}-schraffur" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path class="tb-schraffur" d="M0 0V6"/></pattern>`
    : html`<clipPath id="${praefix}-kappe"><rect x="0" y="${BALKEN_Y}" width="100%" height="${BALKEN_H}" rx="4"/></clipPath>`}</defs>${TAGESARTEN.map((art) => zeile({ art, band, offen, titel, praefix }))}${marke}</svg>
<dl class="tagesband-legende">${fenster.map((f) => html`<div class="tb-eintrag tb-eintrag-${f.id}" data-fenster="${f.id}"><dt>${f.titel}</dt><dd>${fensterZeit(preise, f)}</dd></div>`)}</dl>
</figure>`;
}
