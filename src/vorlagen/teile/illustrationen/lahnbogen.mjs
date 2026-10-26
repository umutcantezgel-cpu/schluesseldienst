// I-11 Lahnbogen (V09 Über uns, M-20 „Der gerade Weg“): stilisierte Lahnschleife um den Bergsporn mit der Stadt,
// die Kupferlinie ist der Schiffstunnel – der gerade Weg durch den Hals der Schleife. Keine Karte, kein Maßstab;
// die Bildunterschrift kennzeichnet die Grafik als stilisiert. Dekorativ (die Aussage trägt der Text mit Fakt).
//
// Formsystem K-008 (Linie & Bogen, Raster 8): Die Schleife ist ein Kreis (Mitte 224/120, Radius 80), Zu- und
// Abfluss biegen über Kreise mit Radius 40 tangential ein (Mittelpunkte 72 seitlich und 96 tiefer, also 120 = 80 + 40
// voneinander – ein 3-4-5-Dreieck, darum liegen die Übergänge auf ganzen Zahlen). Die Ufer sind dieselben Bögen mit
// Radius ± 8: Sie laufen exakt parallel, das Wasser ist überall 16 breit. Der Bergsporn ist die Fläche innerhalb des
// inneren Ufers, am Hals geschlossen von der Linie, auf der der Tunnel liegt.
import { roh } from '../../../../bau/lib/html.mjs';

const MITTE = { x: 224, y: 120 };
const R = 80; // Schleife
const r = 40; // Ein- und Ausbiegung
const VERSATZ = { x: 72, y: 96 };
const W = 8; // halbe Wasserbreite
const FUSS = { links: 40, rechts: 408 };
const HALS_Y = MITTE.y + VERSATZ.y;

const zahl = (n) => String(Math.round(n * 10) / 10);
// Punkt auf dem Weg von der Schleifenmitte zur Mitte der Biegung, im Abstand d von der Schleifenmitte
const uebergang = (seite, d) => ({ x: MITTE.x + seite * -VERSATZ.x * d / (R + r), y: MITTE.y + VERSATZ.y * d / (R + r) });

// Linie im Abstand v vom Flusslauf (v > 0: zum Bergsporn hin). Auf der Schleife ändert sich der Radius gegenläufig
// zu den Biegungen, am Fuß liegt die Linie v tiefer – so bleiben alle Stücke tangential.
function lauf(v) {
  const rb = r + v; const Rs = R - v;
  const a = uebergang(1, Rs); const b = uebergang(-1, Rs);
  const fussY = HALS_Y + r + v;
  const bl = MITTE.x - VERSATZ.x; const br = MITTE.x + VERSATZ.x;
  return `M${FUSS.links} ${fussY}H${bl}A${rb} ${rb} 0 0 0 ${zahl(a.x)} ${zahl(a.y)}A${Rs} ${Rs} 0 1 1 ${zahl(b.x)} ${zahl(b.y)}A${rb} ${rb} 0 0 0 ${br} ${fussY}H${FUSS.rechts}`;
}

// Bergsporn: innerhalb des inneren Ufers, vom linken Hals um die Schleife zum rechten Hals
function sporn() {
  const rb = r + W; const Rs = R - W;
  const a = uebergang(1, Rs); const b = uebergang(-1, Rs);
  const hl = MITTE.x - VERSATZ.x + rb; const hr = MITTE.x + VERSATZ.x - rb;
  return `M${hl} ${HALS_Y}A${rb} ${rb} 0 0 0 ${zahl(a.x)} ${zahl(a.y)}A${Rs} ${Rs} 0 1 1 ${zahl(b.x)} ${zahl(b.y)}A${rb} ${rb} 0 0 0 ${hr} ${HALS_Y}Z`;
}

// Tunnel waagerecht durch den Hals, von Flussmitte zu Flussmitte; die Tore stehen quer auf den inneren Ufern
const TUNNEL = { x1: MITTE.x - VERSATZ.x + r, x2: MITTE.x + VERSATZ.x - r, y: HALS_Y };
const tor = (x) => `<rect class="lb-tor" x="${x - 2}" y="${HALS_Y - W}" width="4" height="${2 * W}" rx="1"/>`;

// Die Bühne (Fluss, Bergsporn, Stadt) ist eine Gruppe: M-20 lässt sie als Ganzes auftreten, dann zieht der Tunnel.
// „Weilburg“ steht in der Mitte der Schleife, „Lahn“ über dem Abfluss, „Schiffstunnel“ unter dem Hals.
export function lahnbogen({ klasse = '' } = {}) {
  const { x1, x2, y } = TUNNEL;
  return roh(`<svg class="ill ill-lahnbogen ${klasse}" viewBox="32 24 384 280" aria-hidden="true" focusable="false">
<g class="lb-fluss-teil lb-buehne">
<path class="lb-berg" d="${sporn()}"/>
<path class="lb-wasser" d="${lauf(0)}"/>
<path class="lb-ufer" d="${lauf(-W)}"/><path class="lb-ufer" d="${lauf(W)}"/>
<text class="lb-text" x="${MITTE.x}" y="${MITTE.y + 8}" text-anchor="middle">Weilburg</text>
<text class="lb-text lb-text-fluss" x="${FUSS.rechts}" y="${HALS_Y + r - W - 12}" text-anchor="end">Lahn</text>
</g>
<g class="lb-tunnel-teil">
<path class="lb-tunnel" d="M${x1} ${y}H${x2}"/>
${tor(x1 + W)}${tor(x2 - W)}
<text class="lb-text lb-text-tunnel" x="${MITTE.x}" y="${HALS_Y + r + W + 28}" text-anchor="middle">Schiffstunnel</text>
</g>
</svg>`);
}
