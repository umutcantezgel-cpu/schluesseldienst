// Tagesband (V04, K-009 „Spaltenmarke jetzt gültig“): zwei Zeilen 0–24 Uhr (werktags, Wochenende und Feiertag),
// Abschnitte je Zeitfenster als SVG-Rechtecke mit Attributen (keine Inline-Stile). Die Legende als <dl> trägt die
// Aussage; das SVG ist dekorativ. Die Marke „jetzt“ setzt das Modul tagesband per transform-Attribut.
// Ohne konfigurierte Uhrzeiten: schraffierte Zeilen und ein Hinweis statt erfundener Grenzen.
import { html, roh } from '../../../bau/lib/html.mjs';
import { istPlatzhalter } from '../../../bau/lib/platzhalter.mjs';
import { bandPruefen, minutenVon, TAGESARTEN } from '../../assets/js/logik/preise.mjs';
import { fensterZeit } from './preisauszug.mjs';

// Zwei Fassungen: breit (ab 48em) und schmal (Handy), damit die Beschriftung in beiden lesbar bleibt
const BREITEN = { breit: 960, schmal: 480 };
const NAME_MIN = { breit: 150, schmal: 260 }; // Mindestbreite eines Abschnitts für seine Beschriftung
const ZEILE = 40;
const ZEILEN = { werktags: { y: 28, titel: 'Montag bis Freitag' }, wochenende: { y: 136, titel: 'Samstag, Sonntag und Feiertag' } };
const H = 196;
const esc = (s) => String(s).replace(/[&<>"']/g, (z) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[z]);

function skala(y, B) {
  return [0, 6, 12, 18, 24].map((h) => {
    const px = Math.round((h / 24) * B);
    const anker = h === 0 ? 'start' : h === 24 ? 'end' : 'middle';
    return `<path class="tb-strich" d="M${px} ${y + ZEILE}V${y + ZEILE + 6}"/><text class="tb-uhr" x="${px}" y="${y + ZEILE + 22}" text-anchor="${anker}">${String(h).padStart(2, '0')}:00</text>`;
  }).join('');
}

function bandSvg({ fassung, B, band, offen, titel, praefix, jetztText }) {
  const x = (hhmm) => Math.round((minutenVon(hhmm) / (24 * 60)) * B);
  const zeilen = TAGESARTEN.map((art) => {
    const { y, titel: t } = ZEILEN[art];
    const kopf = `<text class="tb-zeile-titel" x="0" y="${y - 10}">${esc(t)}</text>`;
    if (offen) return `${kopf}<rect class="tb-offen" x="0" y="${y}" width="${B}" height="${ZEILE}" rx="4" fill="url(#${praefix}-${fassung}-schraffur)"/>${skala(y, B)}`;
    const teile = band[art].map(([id, von, bis]) => {
      const x0 = x(von); const w = x(bis) - x0;
      const name = w >= NAME_MIN[fassung] ? `<text class="tb-name" x="${x0 + 12}" y="${y + 26}">${esc(titel.get(id))}</text>` : '';
      return `<rect class="tb-teil tb-${id}" data-fenster="${id}" x="${x0}" y="${y}" width="${w}" height="${ZEILE}"/>${name}`;
    }).join('');
    return `${kopf}<g class="tb-zeile" data-art="${art}">${teile}</g>${skala(y, B)}`;
  }).join('');
  const marke = offen ? '' : `<g class="tb-jetzt" data-rolle="marke"><path d="M0 -8V${ZEILE + 8}"/><circle cx="0" cy="-8" r="5"/><text class="tb-jetzt-text" x="8" y="-6">${esc(jetztText)}</text></g>`;
  return `<svg class="tagesband-svg tb-${fassung}" data-breite="${B}" viewBox="-8 0 ${B + 16} ${H}" aria-hidden="true" focusable="false">
<defs><pattern id="${praefix}-${fassung}-schraffur" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path class="tb-schraffur" d="M0 0V6"/></pattern></defs>
${zeilen}${marke}
</svg>`;
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
  const svg = roh(Object.entries(BREITEN).map(([fassung, B]) => bandSvg({ fassung, B, band, offen, titel, praefix, jetztText })).join('\n'));
  const daten = offen ? '' : JSON.stringify({ band, zeilen: Object.fromEntries(TAGESARTEN.map((a) => [a, ZEILEN[a].y])) });
  return html`<figure class="tagesband"${offen ? '' : html` data-modul="tagesband" data-band="${daten}"`}>
${svg}
<dl class="tagesband-legende">${fenster.map((f) => html`<div class="tb-eintrag tb-eintrag-${f.id}" data-fenster="${f.id}"><dt>${f.titel}</dt><dd>${fensterZeit(preise, f)}</dd></div>`)}</dl>
</figure>`;
}
