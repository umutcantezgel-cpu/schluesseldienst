// I-01 Zylinder-Schnitt (KERN K-008): Gehäuse, Kern, fünf Stiftpaare mit Federn, Schlüssel, Scherlinie.
// Grundzustand = Endzustand (Stifte auf der Scherlinie, Schlüssel eingeführt). M-16 animiert nur den
// Weg dorthin (CSS, nur transform/opacity, unter prefers-reduced-motion: no-preference).
// Raster 8, Strich 2 über CSS; IDs eindeutig je Seite über das Präfix.
import { roh } from '../../../../bau/lib/html.mjs';

const STIFTE = [26, 16, 32, 20, 12];   // Länge der Kernstifte = Einschnitttiefe des Schlüssels
const X = [120, 184, 248, 312, 376];   // Mitte der Stiftkanäle
const SCHER_Y = 120;                   // Scherlinie (Trennfuge Kern/Gehäuse)

function feder(x) {
  // Zickzack-Feder im 45°-Raster zwischen y 56 und 88
  const p = [`M${x - 6} 56`];
  for (let y = 60, s = 1; y <= 88; y += 4, s = -s) p.push(`L${x + 6 * s} ${y}`);
  return p.join(' ');
}

export function zylinderSchnitt({ praefix = 'zy', klasse = '', titel = 'Schnitt durch einen Schließzylinder: Liegen alle Stifte auf der Scherlinie, lässt sich der Kern drehen.' } = {}) {
  const schluesselOben = [`M-60 152`, `L92 152`];
  X.forEach((x, i) => { const y = SCHER_Y + STIFTE[i]; schluesselOben.push(`L${x - 10} ${y}`, `L${x + 10} ${y}`); });
  schluesselOben.push('L404 140', 'L420 152', 'L420 172', 'L-60 172');
  const stifte = X.map((x, i) => `<g class="zy-stiftpaar" style-frei="" data-i="${i}">
<path class="zy-feder" d="${feder(x)}"/>
<rect class="zy-oberstift" x="${x - 8}" y="88" width="16" height="${SCHER_Y - 88}" rx="2"/>
<rect class="zy-kernstift" x="${x - 8}" y="${SCHER_Y}" width="16" height="${STIFTE[i]}" rx="2"/>
</g>`).join('\n').replace(/ style-frei=""/g, '');
  return roh(`<svg class="zylinder ${klasse}" viewBox="-80 24 540 176" role="img" aria-labelledby="${praefix}-titel" preserveAspectRatio="xMidYMid meet">
<title id="${praefix}-titel">${titel}</title>
<defs><pattern id="${praefix}-schraffur" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V8" class="zy-schraffur-linie"/></pattern></defs>
<g class="zy-gehaeuse">
<path class="zy-flaeche" d="M64 40H440V184H64Z"/>
<path class="zy-schnitt" fill="url(#${praefix}-schraffur)" d="M64 40H440V${SCHER_Y}H64Z"/>
${X.map((x) => `<path class="zy-kanal" d="M${x - 10} 48H${x + 10}V${SCHER_Y}H${x - 10}Z"/>`).join('')}
</g>
<g class="zy-kern">
<path class="zy-kern-flaeche" d="M72 ${SCHER_Y}H432V180H72Z"/>
${X.map((x) => `<path class="zy-kanal" d="M${x - 10} ${SCHER_Y}H${x + 10}V150H${x - 10}Z"/>`).join('')}
</g>
<g class="zy-stifte">
${stifte}
</g>
<g class="zy-schluessel">
<circle class="zy-reide" cx="-40" cy="162" r="28"/>
<circle class="zy-reide-loch" cx="-48" cy="162" r="8"/>
<path class="zy-bart" d="${schluesselOben.join(' ')}Z"/>
</g>
<path class="zy-scherlinie" d="M72 ${SCHER_Y}H432"/>
</svg>`);
}
