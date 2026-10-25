// I-05b Datensicherungsschrank (V03): Schnitt durch einen Schrank mit dicker Dämmwand; innen ein Fach mit Ordnern
// und eines mit Datenträgern, außen Wärme als Kupferlinien. Zeigt: Brandschutz heißt Wärme fernhalten. Dekorativ.
import { roh } from '../../../../bau/lib/html.mjs';

const welle = (x) => `M${x} 248C${x - 8} 232 ${x + 8} 216 ${x} 200C${x - 8} 184 ${x + 8} 168 ${x} 152C${x - 8} 136 ${x + 8} 120 ${x} 104`;

export function datenschrank({ praefix = 'ds', klasse = '' } = {}) {
  return roh(`<svg class="ill ill-datenschrank ${klasse}" viewBox="8 8 304 288" aria-hidden="true" focusable="false">
<defs><pattern id="${praefix}-schraffur" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path class="ill-schraffur-linie" d="M0 0V4"/></pattern></defs>
<path class="ill-wand" fill="url(#${praefix}-schraffur)" fill-rule="evenodd" d="M80 24H240V272H80Z M104 48V248H216V48Z"/>
<path d="M80 24H240V272H80Z M104 48H216V248H104Z"/>
<path d="M104 148H216"/>
<path class="ill-blatt" d="M120 76H136V140H120Z M140 76H156V140H140Z M160 76H176V140H160Z"/>
<path class="ill-fein" d="M128 84V100 M148 84V100 M168 84V100"/>
<rect class="ill-blatt" x="124" y="180" width="72" height="48" rx="4"/>
<circle cx="148" cy="204" r="12"/><circle class="ill-dunkel" cx="148" cy="204" r="2"/><path d="M172 196H188 M172 212H184"/>
<path class="ill-schliesspunkt-ring" d="${welle(32)} ${welle(56)} ${welle(264)} ${welle(288)}"/>
<path d="M56 280H264"/>
</svg>`);
}
