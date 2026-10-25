// I-03c Türschließer (V03 Türschließer): oberer Teil einer Tür in der Zarge mit Obentürschließer und
// Gleitschiene; Kupfer markiert den Arm, der Schließkraft und Endschlag überträgt. Dekorativ.
import { roh } from '../../../../bau/lib/html.mjs';

export function tuerschliesserFigur({ praefix = 'tsl', klasse = '' } = {}) {
  return roh(`<svg class="ill ill-tuerschliesser ${klasse}" viewBox="8 8 304 192" aria-hidden="true" focusable="false">
<defs><pattern id="${praefix}-schraffur" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path class="ill-schraffur-linie" d="M0 0V4"/></pattern></defs>
<path class="ill-wand" fill="url(#${praefix}-schraffur)" d="M16 16H304V40H16Z"/>
<path class="ill-flaeche" d="M40 196V40H280V196H264V56H56V196Z"/>
<path class="ill-blatt" d="M60 196V60H260V196"/>
<rect class="ill-flaeche" x="196" y="44" width="64" height="8" rx="2"/>
<rect class="ill-blatt" x="84" y="76" width="112" height="32" rx="4"/>
<path class="ill-fein" d="M100 88H148M100 96H132"/>
<path class="ill-schliesspunkt-ring" d="M180 92L216 60L236 48"/>
<circle class="ill-dunkel" cx="180" cy="92" r="4"/><circle class="ill-dunkel" cx="236" cy="48" r="3"/>
<rect class="ill-flaeche" x="230" y="128" width="14" height="44" rx="4"/><path d="M237 140H208"/><circle class="ill-dunkel" cx="237" cy="160" r="2"/>
</svg>`);
}
