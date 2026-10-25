// I-11 Lahnbogen (V09 Über uns, M-20 „Der gerade Weg“): stilisierte Lahnschleife um den Bergsporn mit der Stadt,
// die Kupferlinie ist der Schiffstunnel – der gerade Weg durch den Hals der Schleife. Keine Karte, kein Maßstab;
// die Bildunterschrift kennzeichnet die Grafik als stilisiert. Dekorativ (die Aussage trägt der Text mit Fakt).
import { roh } from '../../../../bau/lib/html.mjs';

// Zu- und Abfluss enden mit runder Kappe innerhalb des Ausschnitts: Die Figur bricht nicht aus dem Raster aus.
const FLUSS = 'M56 240 C104 240 150 238 190 222 C222 208 218 174 200 146 C176 108 182 52 244 44 C306 36 352 78 348 134 C344 178 330 200 312 214 C296 226 304 238 340 238 C384 238 408 236 424 236';
const TUNNEL = { x1: 190, y1: 222, x2: 312, y2: 214 };

// Ausschnitt ohne die langen geraden Flussenden: Die Schleife füllt die Figur, Beschriftungen bleiben auch auf
// schmalen Telefonen lesbar. „Weilburg“ steht über dem Bergsporn, wo die Schleife am weitesten ist; im Hals
// zwischen Berg und Tunnel berührte das Wort auf Telefonen das Wasserband. „Schiffstunnel“ liegt unter dem
// Tunnel zwischen Zu- und Abfluss, mit Luft zu beiden (Ausschnitt dafür unten etwas länger). „Lahn“ über dem Abfluss.
export function lahnbogen({ klasse = '' } = {}) {
  const { x1, y1, x2, y2 } = TUNNEL;
  return roh(`<svg class="ill ill-lahnbogen ${klasse}" viewBox="32 28 416 246" aria-hidden="true" focusable="false">
<g class="lb-fluss-teil"><path class="lb-wasser" d="${FLUSS}"/><path class="lb-fluss" d="${FLUSS}"/>
<text class="lb-text lb-text-fluss" x="392" y="218">Lahn</text></g>
<g class="lb-stadt-teil">
<path class="lb-berg" d="M222 120C230 98 254 92 272 100C296 110 304 138 292 160C278 182 248 186 234 168C222 154 218 136 222 120Z"/>
<path class="ill-fein" d="M244 140V128H252V134H262V128H270V140Z M256 128V122"/>
<text class="lb-text" x="257" y="84" text-anchor="middle">Weilburg</text>
</g>
<g class="lb-tunnel-teil">
<path class="lb-tunnel" d="M${x1} ${y1}L${x2} ${y2}"/>
<circle class="lb-tor" cx="${x1}" cy="${y1}" r="5"/><circle class="lb-tor" cx="${x2}" cy="${y2}" r="5"/>
<text class="lb-text lb-text-tunnel" x="${(x1 + x2) / 2 - 11}" y="${Math.max(y1, y2) + 48}" text-anchor="middle">Schiffstunnel</text>
</g>
</svg>`);
}
