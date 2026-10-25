// Lagekarte je Ortsseite (I-10, Kleinform): Weilburg (Kupfer), der Ort (Lahn), Nachbarorte als Punkte und die
// Peilungslinie mit Entfernung. Äquirektangulär um die Mitte beider Orte, auf die Figur skaliert; nur SVG-Attribute.
import { roh } from '../../../bau/lib/html.mjs';

const esc = (s) => String(s).replace(/[&<>"']/g, (z) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[z]);
const B = 320; const H = 200; const RAND = 28;

export function lagekarte({ ort, sitz, nachbarn = [], praefix = 'lk' }) {
  const mitteLat = (ort.lat + sitz.lat) / 2;
  const kx = Math.cos((mitteLat * Math.PI) / 180);
  const punkte = [sitz, ort, ...nachbarn];
  const xs = punkte.map((p) => p.lon * kx); const ys = punkte.map((p) => -p.lat);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const massstab = Math.min((B - 2 * RAND) / Math.max(x1 - x0, 1e-6), (H - 2 * RAND) / Math.max(y1 - y0, 1e-6));
  const versatzX = (B - (x1 - x0) * massstab) / 2; const versatzY = (H - (y1 - y0) * massstab) / 2;
  const p = (o) => [Math.round(((o.lon * kx) - x0) * massstab + versatzX), Math.round(((-o.lat) - y0) * massstab + versatzY)];
  const [sx, sy] = p(sitz); const [ox, oy] = p(ort);
  const nachbarPunkte = nachbarn.map((n) => { const [x, y] = p(n); return `M${x} ${y}h0`; }).join('');
  // Beschriftung auf der von der Linie abgewandten Seite
  const ortOben = oy <= sy;
  const anker = (x) => (x < B / 3 ? ['start', -8] : x > (2 * B) / 3 ? ['end', 8] : ['middle', 0]);
  const [oa, od] = anker(ox); const [sa, sd] = anker(sx);
  const ortText = `<text class="lk-ort-text" x="${ox + od}" y="${ortOben ? oy - 14 : oy + 24}" text-anchor="${oa}">${esc(ort.name)}</text>`;
  const sitzText = ort.km > 0 ? `<text class="lk-sitz-text" x="${sx + sd}" y="${ortOben ? sy + 24 : sy - 14}" text-anchor="${sa}">Weilburg</text>` : '';
  const mx = Math.round((sx + ox) / 2); const my = Math.round((sy + oy) / 2);
  // Peilungslinie waagerecht gezeichnet und per transform-Attribut der Hülle auf die Richtung gedreht: So kann M-19
  // sie mit scaleX von Weilburg aus ziehen (CSS-transform am Pfad überschreibt das Attribut der Hülle nicht).
  const laenge = Math.round(Math.hypot(ox - sx, oy - sy));
  const winkel = Math.round((Math.atan2(oy - sy, ox - sx) * 1800) / Math.PI) / 10;
  const linie = ort.km > 0 ? `<g transform="translate(${sx} ${sy}) rotate(${winkel})"><path class="lk-linie" d="M0 0H${laenge}"/></g><text class="lk-km" x="${mx + 8}" y="${my - 6}">${ort.km} km</text>` : '';
  return roh(`<svg class="lagekarte" viewBox="0 0 ${B} ${H}" role="img" aria-labelledby="${praefix}-titel">
<title id="${praefix}-titel">${esc(ort.km > 0 ? `Lage von ${ort.name}: rund ${ort.km} km ${ort.richtung || ''} von Weilburg, dazu die Nachbarorte` : `Lage von ${ort.name} mit den Nachbarorten`)}</title>
${nachbarPunkte ? `<path class="lk-nachbarn" d="${nachbarPunkte}"/>` : ''}
${linie}
${ort.km > 0 ? `<circle class="lk-sitz" cx="${sx}" cy="${sy}" r="6"/>` : ''}
<circle class="lk-ort-ring" cx="${ox}" cy="${oy}" r="10"/><circle class="lk-ort" cx="${ox}" cy="${oy}" r="5"/>
${sitzText}${ortText}
</svg>`);
}
