// I-03b Fenster-Schichten (V03 Fenstersicherung, Sicherheitsfenster): Ansicht eines Fensters in der Wand; Schicht
// für Schicht Pilzkopfverriegelung, abschließbarer Griff, Verglasung und Zusatzsicherung. Dekorativ.
import { roh } from '../../../../bau/lib/html.mjs';
import { illRahmen, teil } from './_svg.mjs';

const pilz = (x, y, links) => `<path d="M${x} ${y - 6}V${y + 6}"/><circle class="ill-blatt" cx="${links ? x - 6 : x + 6}" cy="${y}" r="5"/><rect class="ill-flaeche" x="${links ? x - 24 : x + 12}" y="${y - 10}" width="12" height="20" rx="2"/>`;

export function fensterSchichten({ praefix = 'fs', zustand = null, klasse = '' } = {}) {
  const sf = `url(#${praefix}-schraffur)`;
  const inhalt = `<g class="ill-grund">
<path class="ill-wand" fill="${sf}" d="M16 24H48V376H16Z M272 24H304V376H272Z"/>
<path class="ill-flaeche" d="M48 40H272V360H48Z M64 56V344H256V56Z" fill-rule="evenodd"/>
<rect class="ill-blatt" x="72" y="64" width="176" height="272" rx="2"/>
<rect class="ill-fein" x="96" y="88" width="128" height="224"/>
<path d="M8 376H312"/>
</g>
${teil(1, `${pilz(248, 112, false)}${pilz(248, 288, false)}${pilz(72, 112, true)}${pilz(72, 288, true)}`)}
${teil(2, `<rect class="ill-flaeche" x="226" y="176" width="14" height="40" rx="4"/><path d="M233 216V256"/><circle class="ill-dunkel" cx="233" cy="190" r="3"/>`)}
${teil(3, `<rect class="ill-fenster" x="96" y="88" width="128" height="224"/><path class="ill-fein" d="M104 96V304M216 96V304"/><path class="ill-schnitt" fill="${sf}" d="M96 88H104V312H96Z M216 88H224V312H216Z"/>`)}
${teil(4, `<rect class="ill-flaeche" x="136" y="324" width="48" height="20" rx="2"/><path class="ill-bolzen" d="M152 344H168V356H152Z"/><circle class="ill-dunkel" cx="160" cy="334" r="3"/>`)}`;
  return roh(illRahmen({ klasse: `ill-fenster-schichten ${klasse}`, viewBox: '8 16 304 368', praefix, zustand, inhalt }));
}
