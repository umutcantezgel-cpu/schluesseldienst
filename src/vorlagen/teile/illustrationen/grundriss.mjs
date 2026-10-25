// I-04 Grundriss mit Melderzonen (M-17 Sicherheitstechnik): schematische Wohnung; Schritt für Schritt Außenhaut-
// Kontakte, Bewegungsmelder-Bereiche, Rauchwarnmelder und Alarmierung. Dekorativ (Text trägt die Aussage).
import { roh } from '../../../../bau/lib/html.mjs';
import { illRahmen, teil } from './_svg.mjs';

const fenster = (x, y, b, h) => `<rect class="ill-fenster" x="${x}" y="${y}" width="${b}" height="${h}"/><path d="${b > h ? `M${x} ${y + h / 2}H${x + b}` : `M${x + b / 2} ${y}V${y + h}`}"/>`;
const kontakt = (x, y) => `<rect class="ill-melder" x="${x}" y="${y}" width="8" height="8" rx="1"/>`;
const rauch = (x, y) => `<circle class="ill-melder" cx="${x}" cy="${y}" r="10"/><circle class="ill-dunkel" cx="${x}" cy="${y}" r="2"/>`;

export function grundriss({ praefix = 'gr', zustand = null, klasse = '' } = {}) {
  const sf = `url(#${praefix}-schraffur)`;
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
${teil(4, `<rect class="ill-melder" x="232" y="256" width="24" height="24" rx="2"/><path d="M238 264H250M238 272H250"/><rect class="ill-melder" x="384" y="48" width="16" height="24" rx="2"/><path d="M408 52A12 12 0 0 1 408 68 M416 44A20 20 0 0 1 416 76"/>`)}`;
  return roh(illRahmen({ klasse: `ill-grundriss ${klasse}`, viewBox: '8 8 424 304', praefix, zustand, inhalt }));
}
