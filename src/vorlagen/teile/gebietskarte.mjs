// Gebietskarte (Ausschnitt von I-10): Orte um Weilburg als Rasterpunkte (Zellen à 3 km), Ringe für die Zonen,
// Beschriftungen mit Halo, Legende als HTML (gebietsLegende).
// Äquirektanguläre Projektion um den Sitz; Positionen nur über SVG-Attribute (CSP: kein style=).
// Die viewBox beginnt bei 0 0 (Weilburg liegt bei r r): Chromium misst den Zeitstrahl view() eines SVG-Teils ab dem
// Ursprung der viewBox – bei zentrierter viewBox lief M-18 eine halbe Kartenhöhe zu spät ab.
import { roh, html } from '../../../bau/lib/html.mjs';

const esc = (s) => String(s).replace(/[&<>"']/g, (z) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[z]);

export function gebietskarte(sk, { praefix = 'gk', radiusKm = 56, ringe = [20, 50], beschriftet = 7, beschriftetMobil = 5, titel, zelleKm = 3, klasse = '', schrift = 1, schriftMobil = 1.2 } = {}) {
  const orte = sk.daten.orte || [];
  const sitz = orte.find((o) => o.km === 0 && o.typ === 'gemeinde') || { lat: 50.4844, lon: 8.2625, name: 'Weilburg' };
  const kx = 111.32 * Math.cos((sitz.lat * Math.PI) / 180);
  const ky = 111.32;
  const masstab = 4; // SVG-Einheiten je km
  const p = (o) => [Math.round((o.lon - sitz.lon) * kx * masstab), Math.round(-(o.lat - sitz.lat) * ky * masstab)];
  const r = radiusKm * masstab;
  const gemeinden = orte.filter((o) => o.staat === 'DE' && o.typ === 'gemeinde' && o.km <= radiusKm);
  // Rasterpunkte (I-10): alle Orte auf Zellen von 3 km; je Zelle die engste Zone; ein Pfad je Zone (h0 + runde Enden).
  const zelle = zelleKm * masstab;
  const RANG = { A: 0, B: 1, C: 2, D: 3 };
  const zellen = new Map();
  for (const o of orte) {
    if (o.staat !== 'DE' || o.km > radiusKm + zelleKm) continue;
    const [x, y] = p(o);
    const ix = Math.round(x / zelle); const iy = Math.round(y / zelle);
    if (Math.hypot(ix * zelle, iy * zelle) > r - zelle / 2) continue;
    const k = `${ix},${iy}`;
    const rang = RANG[o.zone] ?? 3;
    if (!zellen.has(k) || zellen.get(k) > rang) zellen.set(k, rang);
  }
  const ebenen = [[], [], [], []];
  for (const k of [...zellen.keys()].sort()) { const [ix, iy] = k.split(',').map(Number); ebenen[zellen.get(k)].push(`M${ix * zelle + r} ${iy * zelle + r}h0`); }
  const punkte = ebenen.map((d, i) => (d.length ? `<path class="gk-raster gk-zone-${'abcd'[i]}" d="${d.join('')}"/>` : '')).join('');
  // Beschriftungen gierig nach Einwohnerzahl, ohne Überlappung (geschätzte Textbreite, dazu etwas Luft) und innerhalb
  // der Karte; passt ein Name rechts vom Punkt nicht, wird links versucht. schrift = Faktor der Beschriftungsgröße
  // gegenüber 15 Einheiten (Kollisionskisten wachsen mit). Erst wird mit der größeren Mobilschrift (schriftMobil, unter
  // 48em) gesetzt, dann mit der Desktopschrift aufgefüllt; was nur im zweiten Durchgang Platz fand, trägt
  // data-rang="2" und entfällt mobil, damit sich dort nichts überlagert.
  const grundKisten = (f) => [{ x1: 4, y1: -30 * f, x2: 110 * f, y2: -2 }, ...ringe.map((km) => ({ x1: -32 * f, y1: -km * masstab - 6 - 16 * f, x2: 32 * f, y2: -km * masstab }))];
  const kiste = (o, f, rechts) => {
    const [x, y] = p(o);
    const breite = o.name.length * 8.5 * f;
    const luft = 4 * f;
    return rechts
      ? { x1: x + 6 - luft, y1: y - 12 * f - luft, x2: x + 10 + breite + luft, y2: y + 8 * f + luft }
      : { x1: x - 10 - breite - luft, y1: y - 12 * f - luft, x2: x - 6 + luft, y2: y + 8 * f + luft };
  };
  const innen = (k) => k.x1 >= -r && k.x2 <= r && k.y1 >= -r && k.y2 <= r; // innerhalb der viewBox
  const ueberlappt = (kisten, k) => kisten.some((b) => k.x1 < b.x2 && k.x2 > b.x1 && k.y1 < b.y2 && k.y2 > b.y1);
  const setzen = (kisten, o, f) => {
    for (const rechts of [true, false]) {
      const k = kiste(o, f, rechts);
      if (innen(k) && !ueberlappt(kisten, k)) return { k, rechts };
    }
    return null;
  };
  const kandidaten = [...gemeinden].filter((o) => o.km > 4).sort((a, b) => (b.pop || 0) - (a.pop || 0) || a.slug.localeCompare(b.slug));
  const gesetzt = []; // { o, rechts, rang }
  const mobil = grundKisten(schriftMobil);
  for (const o of kandidaten) {
    if (gesetzt.length >= Math.min(beschriftet, beschriftetMobil)) break;
    const t = setzen(mobil, o, schriftMobil);
    if (!t) continue;
    mobil.push(t.k);
    gesetzt.push({ o, rechts: t.rechts, rang: 1 });
  }
  const gross = [...grundKisten(schrift), ...gesetzt.map((g) => kiste(g.o, schrift, g.rechts))];
  for (const o of kandidaten) {
    if (gesetzt.length >= beschriftet) break;
    if (gesetzt.some((g) => g.o === o)) continue;
    const t = setzen(gross, o, schrift);
    if (!t) continue;
    gross.push(t.k);
    gesetzt.push({ o, rechts: t.rechts, rang: 2 });
  }
  const namen = gesetzt.map(({ o, rechts, rang }) => {
    const [x, y] = p(o);
    return `<text class="gk-name"${rang === 2 ? ' data-rang="2"' : ''} x="${(rechts ? x + 8 : x - 8) + r}" y="${y + 5 + r}"${rechts ? '' : ' text-anchor="end"'}>${esc(o.name)}</text>`;
  }).join('');
  const ringSvg = ringe.map((km) => `<circle class="gk-ring" cx="${r}" cy="${r}" r="${km * masstab}"/>`).join('');
  const ringText = ringe.map((km) => `<text class="gk-ring-text" x="${r}" y="${r - km * masstab - 6}">${km} km</text>`).join('');
  return roh(`<svg class="gebietskarte${klasse ? ' ' + klasse : ''}" viewBox="0 0 ${2 * r} ${2 * r}" role="img" aria-labelledby="${praefix}-titel">
<title id="${praefix}-titel">${esc(titel || `Orte im Umkreis von ${radiusKm} km um Weilburg; Ringe bei ${ringe.slice(0, -1).join(', ')}${ringe.length > 1 ? ' und ' : ''}${ringe.at(-1)} km Luftlinie.`)}</title>
<g class="gk-ringe">${ringSvg}</g>
<g class="gk-punkte">${punkte}</g>
<g class="gk-namen">${ringText}${namen}</g>
<g class="gk-sitz"><circle class="gk-sitz-ring" cx="${r}" cy="${r}" r="10"/><circle class="gk-sitz-punkt" cx="${r}" cy="${r}" r="6"/><text class="gk-sitz-name" x="${r + 14}" y="${r - 14}">Weilburg</text></g>
</svg>`);
}

/** Legende zur Gebietskarte (HTML, unter der Figur). */
export function gebietsLegende(ringe = [20, 50], { zoneC = true } = {}) {
  return html`<figcaption class="gk-legende">
<span><span class="gk-marke gk-marke-a" aria-hidden="true"></span>Zone A – Kerngebiet</span>
<span><span class="gk-marke gk-marke-b" aria-hidden="true"></span>Zone B – Umland</span>
${zoneC ? html`<span><span class="gk-marke gk-marke-c" aria-hidden="true"></span>Zone C – nach Absprache</span>` : ''}
<span><span class="gk-marke gk-marke-ring" aria-hidden="true"></span>Ringe bei ${ringe.length > 1 ? `${ringe.slice(0, -1).join(', ')} und ${ringe.at(-1)}` : ringe[0]} km Luftlinie</span>
</figcaption>`;
}
