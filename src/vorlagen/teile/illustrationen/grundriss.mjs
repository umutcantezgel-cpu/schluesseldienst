// I-04 Grundriss mit Melderzonen (M-17 Sicherheitstechnik): schematische Wohnung; Schritt für Schritt Außenhaut-
// Kontakte, Bewegungsmelder-Bereiche, Rauchwarnmelder und Alarmierung. Dekorativ (Text trägt die Aussage).
import { roh } from '../../../../bau/lib/html.mjs';
import { illRahmen, teil } from './_svg.mjs';

const fenster = (x, y, b, h) => `<rect class="ill-fenster" x="${x}" y="${y}" width="${b}" height="${h}"/><path d="${b > h ? `M${x} ${y + h / 2}H${x + b}` : `M${x + b / 2} ${y}V${y + h}`}"/>`;
const kontakt = (x, y) => `<rect class="ill-melder" x="${x}" y="${y}" width="8" height="8" rx="1"/>`;
const rauch = (x, y) => `<circle class="ill-melder" cx="${x}" cy="${y}" r="10"/><circle class="ill-dunkel" cx="${x}" cy="${y}" r="2"/>`;

// Zusätze für Detailseiten (immer sichtbar, Kupfer): Außenkamera mit Blickfeld oder Nebel im Wohnraum
const ZUSATZ = {
  kamera: `<path class="ill-akzent-flaeche" d="M392 240L428 216V264Z"/><rect class="ill-melder" x="376" y="232" width="20" height="16" rx="2"/><circle class="ill-dunkel" cx="392" cy="240" r="2"/>`,
  nebel: `<path class="ill-akzent-flaeche" d="M240 124A20 20 0 0 1 252 88A28 28 0 0 1 300 72A26 26 0 0 1 340 100A16 16 0 0 1 344 124Z"/><rect class="ill-melder" x="336" y="40" width="24" height="16" rx="2"/><path d="M340 48H356"/>`,
};

// Variante „rauchmelder“ (Ratgeber Rauchmelderpflicht): dieselbe Wohnung, aber nur die Melder, die der Text als
// Pflicht nennt. Der Flur erschließt hier alle Räume, damit „Flur auf dem Rettungsweg“ im Bild stimmt; Pflichträume
// tragen die Lahn-Zone (Kupfer bleibt Scherlinie und Fokus), das Wohnzimmer bleibt leer. Räume sind beschriftet.
// Name und Melder stehen auf der Mittelachse des Raums: So bleibt beidseits Luft zur Zonenkante, auch wenn die
// Schrift auf schmalen Telefonen stufenweise größer wird (ratgeber.css).
const RAEUME = [
  { name: 'Wohnen', x: 124, y: 72 },
  { name: 'Schlafen', x: 292, y: 72, zone: 'M224 40H360V144H224Z', melder: [292, 108] },
  { name: 'Kind', x: 124, y: 224, zone: 'M40 192H208V280H40Z', melder: [124, 250] },
  { name: 'Flur', x: 292, y: 192, zone: 'M224 160H360V280H224Z', melder: [292, 226] },
];

// Variante „rettungsweg“ (derselbe Artikel, Abschnitt „Welche Räume“): dieselbe Wohnung ohne Melder, dafür je Tür ein
// Pfeil – aus jedem Raum in den Flur, aus dem Flur hinaus. So wird sichtbar, was „Flure, über die Rettungswege führen“
// meint. Pfeile kreuzen die Türöffnungen auf ihrer Mitte (Raster 8, Spitzen 45°); „Flur“ rückt unter den Pfeil aus
// dem Schlafraum.
const WEGE = [
  'M200 168H240 M232 160L240 168L232 176',
  'M200 248H240 M232 240L240 248L232 256',
  'M304 128V168 M296 160L304 168L312 160',
  'M296 264V304 M288 296L296 304L304 296',
];
const LAGE_WEG = { Flur: { y: 216 } };

function rauchmelderPlan(sf, weg = false) {
  return `<g class="ill-grund">
<path class="ill-wand" fill="${sf}" fill-rule="evenodd" d="M24 24H376V296H24Z M32 32H368V288H32Z"/>
<path class="ill-innenwand" d="M216 32V152 M216 184V232 M216 264V288 M32 184H216 M216 152H288 M320 152H368"/>
${fenster(80, 20, 72, 16)}${fenster(264, 20, 56, 16)}${fenster(20, 216, 16, 48)}
<rect class="ill-oeffnung" x="280" y="284" width="32" height="16"/>
<path class="ill-fein" d="M280 288V256A32 32 0 0 1 312 288"/>
</g>
<g class="gr-pflicht">${RAEUME.filter((r) => r.zone).map((r) => `<path class="ill-zone-flaeche" d="${r.zone}"/>`).join('')}</g>
${weg
    ? `<g class="gr-weg">${WEGE.map((d) => `<path d="${d}"/>`).join('')}</g>`
    : `<g class="gr-melder">${RAEUME.filter((r) => r.melder).map((r) => rauch(...r.melder)).join('')}</g>`}
<g class="gr-raeume">${RAEUME.map((r) => ({ ...r, ...(weg ? LAGE_WEG[r.name] : null) })).map((r) => `<text class="ill-text gr-raum" x="${r.x}" y="${r.y}" text-anchor="middle">${r.name}</text>`).join('')}</g>`;
}

export function grundriss({ praefix = 'gr', zustand = null, klasse = '', zusatz = '', variante = '' } = {}) {
  const sf = `url(#${praefix}-schraffur)`;
  if (variante === 'rauchmelder' || variante === 'rettungsweg') {
    return roh(illRahmen({ klasse: `ill-grundriss ill-grundriss-rauch ${klasse}`, viewBox: '8 8 384 304', praefix, zustand: null, inhalt: rauchmelderPlan(sf, variante === 'rettungsweg') }));
  }
  const inhalt = `<g class="ill-grund">
<path class="ill-wand" fill="${sf}" fill-rule="evenodd" d="M24 24H376V296H24Z M32 32H368V288H32Z"/>
<path class="ill-innenwand" d="M216 32V120 M216 152V288 M32 184H120 M152 184H216 M216 152H288 M320 152H368"/>
${fenster(80, 20, 72, 16)}${fenster(264, 20, 56, 16)}${fenster(20, 216, 16, 48)}
<rect class="ill-oeffnung" x="280" y="284" width="32" height="16"/>
<path class="ill-fein" d="M280 288V256A32 32 0 0 1 312 288"/>
</g>
${teil(1, `<path class="ill-zone" d="M44 44H356V276H44Z"/>${kontakt(112, 40)}${kontakt(288, 40)}${kontakt(40, 236)}${kontakt(292, 268)}`)}
${teil(2, `<path class="ill-zone-flaeche" d="M40 40H136A96 96 0 0 1 40 136Z"/><path class="ill-zone-flaeche" d="M360 280H288A72 72 0 0 1 360 208Z"/><path class="ill-melder" d="M40 40H52V52H40Z M348 268H360V280H348Z"/>`)}
${teil(3, `${rauch(124, 108)}${rauch(124, 236)}${rauch(292, 92)}${rauch(292, 216)}`)}
${teil(4, `<rect class="ill-melder" x="232" y="256" width="24" height="24" rx="2"/><path d="M238 264H250M238 272H250"/><rect class="ill-melder" x="384" y="48" width="16" height="24" rx="2"/><path d="M408 52A12 12 0 0 1 408 68 M416 44A20 20 0 0 1 416 76"/>`)}
${ZUSATZ[zusatz] || ''}`;
  return roh(illRahmen({ klasse: `ill-grundriss ${klasse}`, viewBox: '8 8 424 304', praefix, zustand, inhalt }));
}
