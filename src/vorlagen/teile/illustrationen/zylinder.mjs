// I-01 Zylinder-Schnitt (KERN K-008): Gehäuse, Kern, fünf Stiftpaare mit Federn, Schlüssel, Scherlinie.
// Grundzustand = Endzustand (Stifte auf der Scherlinie, Schlüssel eingeführt). M-16 animiert nur den
// Weg dorthin (CSS, nur transform/opacity, unter prefers-reduced-motion: no-preference).
// Raster 8, Strich 2 über CSS; IDs eindeutig je Seite über das Präfix.
import { roh } from '../../../../bau/lib/html.mjs';

const STIFTE = [26, 16, 32, 20, 12];   // Länge der Kernstifte = Einschnitttiefe des Schlüssels
const X = [120, 184, 248, 312, 376];   // Mitte der Stiftkanäle
const SCHER_Y = 120;                   // Scherlinie (Trennfuge Kern/Gehäuse)
const FALSCH = [16, 30, 14, 28, 22];   // Einschnitte eines falschen Schlüssels (404, M-21): kein Stift trifft die Linie
const LUECKE = [200, 232];             // Bruch der Scherlinie (404) mittig zwischen Kanal 2 und 3, deutlich breiter als ein Strich

function feder(x) {
  // Zickzack-Feder im 45°-Raster zwischen y 56 und 88
  const p = [`M${x - 6} 56`];
  for (let y = 60, s = 1; y <= 88; y += 4, s = -s) p.push(`L${x + 6 * s} ${y}`);
  return p.join(' ');
}

// Feder des falschen Schlüssels (404): oben fest im Kanal, unten am versetzten Oberstift – gestaucht oder gedehnt,
// nie über den Kanal hinaus. Gleiche Windungszahl wie feder(), Stützpunkte auf halbe Einheiten gerundet.
function federBis(x, unten) {
  const schritt = (unten - 56) / 8;
  const p = [`M${x - 6} 56`];
  for (let k = 1, s = 1; k <= 8; k++, s = -s) p.push(`L${x + 6 * s} ${Math.round((56 + k * schritt) * 2) / 2}`);
  return p.join(' ');
}

// Szenenbetrieb (M-17, „Stift für Stift“): schluessel=false blendet den Schlüssel aus; stiftAb[i] = Schritt, ab dem
// Stiftpaar i auf der Scherlinie sitzt (davor per CSS versetzt); linieAb = Schritt, ab dem die Linie erscheint;
// zustand = fester Schritt für Einzelbilder; dekorativ = ohne Titel, aria-hidden.
// falsch = falscher Schlüssel (404): Ober- und Kernstift per transform-Attribut einer inneren Hülle auf den Einschnitt
// versetzt, die Feder bleibt oben im Kanal und folgt gestaucht oder gedehnt (die Bewegung M-21 animiert das ganze Paar),
// Scherlinie in zwei Hälften mit Lücke.
export function zylinderSchnitt({ praefix = 'zy', klasse = '', titel = 'Schnitt durch einen Schließzylinder: Liegen alle Stifte auf der Scherlinie, lässt sich der Kern drehen.', schluessel = true, stiftAb = null, linieAb = null, zustand = null, dekorativ = false, falsch = false } = {}) {
  const schnitte = falsch ? FALSCH : STIFTE;
  const schluesselOben = [`M-12 152`, `L92 152`];
  X.forEach((x, i) => { const y = SCHER_Y + schnitte[i]; schluesselOben.push(`L${x - 10} ${y}`, `L${x + 10} ${y}`); });
  schluesselOben.push('L404 140', 'L420 152', 'L420 172', 'L-12 172');
  const stiftAttr = (i) => (stiftAb ? ` data-setzt="${stiftAb[i]}" data-bei="${stiftAb[i]}"` : '');
  const stiftKoerper = (x, i) => `<rect class="zy-oberstift" x="${x - 8}" y="88" width="16" height="${SCHER_Y - 88}" rx="2"/>
<rect class="zy-kernstift" x="${x - 8}" y="${SCHER_Y}" width="16" height="${STIFTE[i]}" rx="2"/>
<rect class="zy-kernstift-schraffur" fill="url(#${praefix}-schraffur)" x="${x - 8}" y="${SCHER_Y}" width="16" height="${STIFTE[i]}" rx="2"/>`;
  const stifte = falsch
    ? X.map((x, i) => {
      const versatz = FALSCH[i] - STIFTE[i];
      return `<g class="zy-stiftpaar" data-i="${i}">
<path class="zy-feder" d="${federBis(x, 88 + versatz)}"/>
<g transform="translate(0 ${versatz})">${stiftKoerper(x, i)}</g>
</g>`;
    }).join('\n')
    : X.map((x, i) => `<g class="zy-stiftpaar" style-frei="" data-i="${i}"${stiftAttr(i)}>
<path class="zy-feder" d="${feder(x)}"/>
${stiftKoerper(x, i)}
</g>`).join('\n').replace(/ style-frei=""/g, '');
  const kopf = dekorativ ? 'aria-hidden="true" focusable="false"' : `role="img" aria-labelledby="${praefix}-titel"`;
  const box = schluessel ? '-80 24 540 176' : '48 24 408 176';
  return roh(`<svg class="zylinder ${klasse}" viewBox="${box}" ${kopf}${zustand ? ` data-zustand="${zustand}"` : ''} preserveAspectRatio="xMidYMid meet">
${dekorativ ? '' : `<title id="${praefix}-titel">${titel}</title>`}
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
${schluessel ? `<g class="zy-schluessel">
<circle class="zy-reide" cx="-40" cy="162" r="28"/>
<circle class="zy-reide-loch" cx="-48" cy="162" r="8"/>
<path class="zy-bart" d="${schluesselOben.join(' ')}Z"/>
</g>` : ''}
${falsch
    // Lücke zwischen zwei Kanälen (Kanal 2 endet bei x 194, Kanal 3 beginnt bei 238), im Raster 8: Läge sie in einem
    // Kanal, füllte der Stift sie, und die Linie läse sich als durchgehend.
    ? `<path class="zy-scherlinie zy-scherlinie-links" d="M72 ${SCHER_Y}H${LUECKE[0]}"/><path class="zy-scherlinie zy-scherlinie-rechts" d="M${LUECKE[1]} ${SCHER_Y}H432"/>`
    : `<path class="zy-scherlinie" d="M72 ${SCHER_Y}H432"${linieAb ? ` data-ab="${linieAb}"` : ''}/>`}
</svg>`);
}
