// I-02b „Falle und Riegel“ (V03 Türöffnung, Ratgeber): Schnitt durch Türkante und Zarge in zwei Zuständen.
// Links zugefallen (nur die Falle greift ins Schließblech und weicht beim Zurückdrücken ins Schloss aus), rechts
// abgeschlossen (der Riegel sitzt in der Zarge). Kupfer = das Teil, das die Tür im jeweiligen Zustand hält, mit
// Bezugslinie zur Beschriftung. Schnittflächen 45°-schraffiert; Beschriftung in Mono, ohne Zahlen.
// Raster 8 für alle Teile; nur das Schließblech liegt um seine Blechstärke (4) vor Zarge und Taschen.
// Schmal gehalten (400 Einheiten), damit die Beschriftung auch mobil in Lesegröße ankommt.
import { roh } from '../../../../bau/lib/html.mjs';

const RAND = 16;
const BREITE = 160; // ein Feld: Türblatt 0–64 (Stulp an der Kante), Falz bis 104, Zarge 104–160
const ABSTAND = 48;

function feld(x, abgeschlossen, praefix) {
  const sf = `url(#${praefix}-schraffur)`;
  // Das haltende Teil trägt Kupfer: zugefallen die Falle, abgeschlossen der Riegel
  const falle = `<path class="${abgeschlossen ? 'ill-blatt' : 'ill-akzent-flaeche'}" data-teil="falle" d="M${x + 64} 80H${x + 104}L${x + 120} 96V112H${x + 64}Z"/>`;
  const riegel = abgeschlossen
    ? `<path class="ill-akzent-flaeche" data-teil="riegel" d="M${x + 64} 144H${x + 128}V176H${x + 64}Z"/>`
    : `<path class="ill-flaeche" data-teil="riegel" d="M${x + 32} 144H${x + 64}V176H${x + 32}Z"/>`;
  // Zugefallen: Pfeil im Schlosskasten – die Falle lässt sich ins Schloss zurückdrücken
  const pfeil = abgeschlossen ? '' : `<path class="ill-fein" d="M${x + 56} 96H${x + 24}M${x + 32} 88L${x + 24} 96L${x + 32} 104"/>`;
  // Bezugslinie von der Mitte des haltenden Teils durch den Falz nach unten zur Beschriftung
  const bezugY = abgeschlossen ? 160 : 96;
  return `<g class="ill-feld">
<text class="ill-text" x="${x + BREITE / 2}" y="24" text-anchor="middle">${abgeschlossen ? 'abgeschlossen' : 'zugefallen'}</text>
<path class="ill-schnitt" fill="${sf}" d="M${x} 40H${x + 64}V216H${x}Z"/>
<path class="ill-blatt" d="M${x + 16} 64H${x + 64}V192H${x + 16}Z"/>
<path class="ill-schnitt" fill="${sf}" d="M${x + 104} 40H${x + 160}V216H${x + 104}V184H${x + 144}V136H${x + 104}V128H${x + 136}V64H${x + 104}Z"/>
<path class="ill-blech" d="M${x + 100} 40V68H${x + 132}V124H${x + 100}V140H${x + 140}V180H${x + 100}V216"/>
<path class="ill-stulp" d="M${x + 64} 40V216"/>
${riegel}
${falle}
${pfeil}
<path class="ill-schliesspunkt-strich ill-fein" d="M${x + 88} ${bezugY}V232"/>
<circle class="ill-schliesspunkt" cx="${x + 88}" cy="${bezugY}" r="2"/>
<text class="ill-text" x="${x + 88}" y="256" text-anchor="middle">${abgeschlossen ? 'Riegel' : 'Falle'}</text>
</g>`;
}

export function falleRiegel({ praefix = 'fr', klasse = '' } = {}) {
  const breite = 2 * RAND + 2 * BREITE + ABSTAND;
  return roh(`<svg class="ill ill-falle-riegel ${klasse}" viewBox="0 0 ${breite} 264" aria-hidden="true" focusable="false">
<defs><pattern id="${praefix}-schraffur" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path class="ill-schraffur-linie" d="M0 0V4"/></pattern></defs>
${feld(RAND, false, praefix)}
${feld(RAND + BREITE + ABSTAND, true, praefix)}
</svg>`);
}
