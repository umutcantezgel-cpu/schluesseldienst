// I-02b „Falle und Riegel“ (V03 Türöffnung, Ratgeber): Schnitt durch Türkante und Zarge in zwei Zuständen.
// Links zugefallen (nur die Falle rastet ein, lässt sich zurückdrücken), rechts abgeschlossen (Riegel sitzt in
// der Zarge, Kupfer = aktiver Zustand). Schnittflächen 45°-schraffiert; Beschriftung in Mono, ohne Zahlen.
import { roh } from '../../../../bau/lib/html.mjs';

function feld(x, abgeschlossen, praefix) {
  const sf = `url(#${praefix}-schraffur)`;
  const riegel = abgeschlossen
    ? `<path class="ill-akzent-flaeche" data-teil="riegel" d="M${x + 120} 136H${x + 184}V160H${x + 120}Z"/>`
    : `<path class="ill-blatt" data-teil="riegel" d="M${x + 88} 136H${x + 120}V160H${x + 88}Z"/>`;
  const pfeil = abgeschlossen ? '' : `<path class="ill-fein" d="M${x + 176} 120H${x + 136}M${x + 144} 112L${x + 136} 120L${x + 144} 128"/>`;
  return `<g class="ill-feld">
<path class="ill-schnitt" fill="${sf}" d="M${x + 16} 24H${x + 116}V216H${x + 16}Z"/>
<path class="ill-schnitt" fill="${sf}" d="M${x + 156} 24H${x + 232}V216H${x + 156}Z"/>
<path class="ill-oeffnung" d="M${x + 153} 64H${x + 188}V112H${x + 153}Z M${x + 153} 128H${x + 188}V168H${x + 153}Z"/>
<path class="ill-stulp" d="M${x + 120} 24V216"/>
<path class="ill-blech" d="M${x + 152} 24V64M${x + 152} 112V128M${x + 152} 168V216M${x + 152} 64H${x + 188}V112H${x + 152}M${x + 152} 128H${x + 188}V168H${x + 152}"/>
<path class="ill-blatt" data-teil="falle" d="M${x + 120} 72H${x + 160}L${x + 176} 88V104H${x + 120}Z"/>
${riegel}
${pfeil}
<text class="ill-text" x="${x + 124}" y="244" text-anchor="middle">${abgeschlossen ? 'abgeschlossen' : 'zugefallen'}</text>
</g>`;
}

export function falleRiegel({ praefix = 'fr', klasse = '' } = {}) {
  return roh(`<svg class="ill ill-falle-riegel ${klasse}" viewBox="0 8 520 252" aria-hidden="true" focusable="false">
<defs><pattern id="${praefix}-schraffur" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path class="ill-schraffur-linie" d="M0 0V4"/></pattern></defs>
${feld(8, false, praefix)}
${feld(272, true, praefix)}
</svg>`);
}
