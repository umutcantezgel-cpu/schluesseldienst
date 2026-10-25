// Signet „Linie & Bogen“: offener Lahnbogen (zugleich Schlüsselreide), gerade Scherlinie durch den Hals,
// die als Schlüsselschaft mit zwei Bartkerben weiterläuft. Dekorativ (der umgebende Link trägt den Namen).
import { roh } from '../../../bau/lib/html.mjs';

export const signet = (klasse = 'signet') => roh(`<svg class="${klasse}" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path class="signet-bogen" d="M15.4 11.5A7 7 0 1 0 15.4 20.5"/><path class="signet-linie" d="M5 16H29M24 16v3.5M27 16v2"/></svg>`);
