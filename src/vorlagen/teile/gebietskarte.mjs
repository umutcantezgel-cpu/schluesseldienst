// Gebietskarte (Ausschnitt von I-10): Orte um Weilburg als Rasterpunkte (Zellen à 3 km), Ringe für die Zonen,
// Beschriftungen mit Halo, Legende als HTML (gebietsLegende).
// Äquirektanguläre Projektion um den Sitz; Positionen nur über SVG-Attribute (CSP: kein style=).
import { roh, html } from '../../../bau/lib/html.mjs';

const esc = (s) => String(s).replace(/[&<>"']/g, (z) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[z]);

export function gebietskarte(sk, { praefix = 'gk', radiusKm = 56, ringe = [20, 50], beschriftet = 7, titel } = {}) {
  const orte = sk.daten.orte || [];
  const sitz = orte.find((o) => o.km === 0 && o.typ === 'gemeinde') || { lat: 50.4844, lon: 8.2625, name: 'Weilburg' };
  const kx = 111.32 * Math.cos((sitz.lat * Math.PI) / 180);
  const ky = 111.32;
  const masstab = 4; // SVG-Einheiten je km
  const p = (o) => [Math.round((o.lon - sitz.lon) * kx * masstab), Math.round(-(o.lat - sitz.lat) * ky * masstab)];
  const r = radiusKm * masstab;
  const gemeinden = orte.filter((o) => o.staat === 'DE' && o.typ === 'gemeinde' && o.km <= radiusKm);
  // Rasterpunkte (I-10): alle Orte auf Zellen von 3 km; je Zelle die engste Zone; ein Pfad je Zone (h0 + runde Enden).
  const zelle = 3 * masstab;
  const RANG = { A: 0, B: 1, C: 2, D: 3 };
  const zellen = new Map();
  for (const o of orte) {
    if (o.staat !== 'DE' || o.km > radiusKm + 3) continue;
    const [x, y] = p(o);
    const ix = Math.round(x / zelle); const iy = Math.round(y / zelle);
    if (Math.hypot(ix * zelle, iy * zelle) > r - zelle / 2) continue;
    const k = `${ix},${iy}`;
    const rang = RANG[o.zone] ?? 3;
    if (!zellen.has(k) || zellen.get(k) > rang) zellen.set(k, rang);
  }
  const ebenen = [[], [], [], []];
  for (const k of [...zellen.keys()].sort()) { const [ix, iy] = k.split(',').map(Number); ebenen[zellen.get(k)].push(`M${ix * zelle} ${iy * zelle}h0`); }
  const punkte = ebenen.map((d, i) => (d.length ? `<path class="gk-raster gk-zone-${'abcd'[i]}" d="${d.join('')}"/>` : '')).join('');
  // Beschriftungen gierig nach Einwohnerzahl, ohne Überlappung (geschätzte Textbreite) und innerhalb der Karte
  const kisten = [{ x1: 4, y1: -30, x2: 110, y2: -2 }];
  const ueberlappt = (k) => kisten.some((b) => k.x1 < b.x2 && k.x2 > b.x1 && k.y1 < b.y2 && k.y2 > b.y1);
  const kandidaten = [...gemeinden].filter((o) => o.km > 4).sort((a, b) => (b.pop || 0) - (a.pop || 0) || a.slug.localeCompare(b.slug));
  const beschriftungen = [];
  for (const o of kandidaten) {
    if (beschriftungen.length >= beschriftet) break;
    const [x, y] = p(o);
    const breite = o.name.length * 8.5;
    const rechts = x + 8 + breite <= r;
    const k = rechts ? { x1: x + 6, y1: y - 12, x2: x + 10 + breite, y2: y + 8 } : { x1: x - 10 - breite, y1: y - 12, x2: x - 6, y2: y + 8 };
    if (ueberlappt(k)) continue;
    kisten.push(k);
    beschriftungen.push(`<text class="gk-name" x="${rechts ? x + 8 : x - 8}" y="${y + 5}"${rechts ? '' : ' text-anchor="end"'}>${esc(o.name)}</text>`);
  }
  const namen = beschriftungen.join('');
  const ringSvg = ringe.map((km) => `<circle class="gk-ring" cx="0" cy="0" r="${km * masstab}"/><text class="gk-ring-text" x="0" y="${-km * masstab - 6}">${km} km</text>`).join('');
  return roh(`<svg class="gebietskarte" viewBox="${-r} ${-r} ${2 * r} ${2 * r}" role="img" aria-labelledby="${praefix}-titel">
<title id="${praefix}-titel">${esc(titel || `Gemeinden im Umkreis von ${radiusKm} km um Weilburg; Ringe bei ${ringe.join(' und ')} km Luftlinie.`)}</title>
<g class="gk-ringe">${ringSvg}</g>
<g class="gk-punkte">${punkte}</g>
<g class="gk-namen">${namen}</g>
<g class="gk-sitz"><circle class="gk-sitz-ring" cx="0" cy="0" r="10"/><circle class="gk-sitz-punkt" cx="0" cy="0" r="6"/><text class="gk-sitz-name" x="14" y="-14">Weilburg</text></g>
</svg>`);
}

/** Legende zur Gebietskarte (HTML, unter der Figur). */
export function gebietsLegende(ringe = [20, 50]) {
  return html`<figcaption class="gk-legende">
<span><span class="gk-marke gk-marke-a" aria-hidden="true"></span>Zone A – Kerngebiet</span>
<span><span class="gk-marke gk-marke-b" aria-hidden="true"></span>Zone B – Umland</span>
<span><span class="gk-marke gk-marke-c" aria-hidden="true"></span>Zone C – nach Absprache</span>
<span><span class="gk-marke gk-marke-ring" aria-hidden="true"></span>Ringe bei ${ringe.join(' und ')} km Luftlinie</span>
</figcaption>`;
}
