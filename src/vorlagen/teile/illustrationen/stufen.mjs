// I-05 Widerstandsstufen (M-17 Einbau & Tresore): drei Stufen steigender Widerstand mit Möbeltresor, Tür und
// Wertschutzschrank; Schritt 4 verankert alles im Boden („jede Stufe zählt nur mit fachgerechtem Einbau“).
// Ohne Norm-Bezeichnungen oder Zahlen (die stehen nur in Texten mit Faktenblatt). Dekorativ.
import { roh } from '../../../../bau/lib/html.mjs';
import { illRahmen, teil } from './_svg.mjs';

const anker = (x) => `<path d="M${x} 264V296 M${x - 6} 290L${x} 296L${x + 6} 290 M${x - 6} 280L${x} 286L${x + 6} 280"/>`;

export function widerstandsStufen({ praefix = 'ws', zustand = null, klasse = '' } = {}) {
  const sf = `url(#${praefix}-schraffur)`;
  const inhalt = `<g class="ill-grund">
<path class="ill-wand" fill="${sf}" d="M16 264H384V304H16Z"/>
<path d="M16 264H384"/>
</g>
${teil(1, `<path class="ill-flaeche" d="M32 264V208H136V264"/><rect class="ill-blatt" x="64" y="152" width="48" height="56" rx="4"/><circle cx="88" cy="180" r="10"/><path d="M88 170V176"/>`)}
${teil(2, `<path class="ill-flaeche" d="M136 264V152H240V264"/><path class="ill-blatt" d="M168 152V64H216V152"/><path d="M160 152H224"/><circle class="ill-dunkel" cx="206" cy="112" r="3"/><path class="ill-bolzen" d="M216 80H222V88H216Z M216 132H222V140H216Z"/>`)}
${teil(3, `<path class="ill-flaeche" d="M240 264V96H344V264"/><rect class="ill-blatt" x="264" y="16" width="64" height="80" rx="4"/><path d="M272 88V96 M320 88V96"/><circle cx="296" cy="52" r="12"/><path d="M296 40V64 M284 52H308"/>`)}
${teil(4, `${anker(84)}${anker(188)}${anker(292)}`)}`;
  return roh(illRahmen({ klasse: `ill-stufen ${klasse}`, viewBox: '8 8 384 304', praefix, zustand, inhalt }));
}
