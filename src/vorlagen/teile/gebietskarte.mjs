// Gebietskarte (I-10): Orte um Weilburg als Rasterpunkte (Zellen à zelleKm), Ringe für die Zonen und eine Kupferlinie
// als Maß – die Luftlinie von Weilburg nach Norden bis zum äußeren Ring, rechts daneben die Ringmaße. Beschriftungen
// stehen auf ausgesparter Fläche: Punkte unter einer Schrift entfallen, statt durch sie hindurchzuscheinen.
// Legende als HTML (gebietsLegende).
// Äquirektanguläre Projektion um den Sitz; Positionen nur über SVG-Attribute (CSP: kein style=).
// Die viewBox beginnt bei 0 0 (Weilburg liegt bei r r): Chromium misst den Zeitstrahl view() eines SVG-Teils ab dem
// Ursprung der viewBox – bei zentrierter viewBox lief M-18 eine halbe Kartenhöhe zu spät ab.
import { roh, html } from '../../../bau/lib/html.mjs';

const esc = (s) => String(s).replace(/[&<>"']/g, (z) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[z]);

// Schriftmaße in 1/1000 em, im Browser gemessen: Vorschub je Zeichen von Atkinson Hyperlegible Next 400 (fett etwa 7 %
// breiter), Mono einheitlich 632; Oberlänge 719, Versal-Umlaut 859, Unterlänge 203; „middle“ liegt 248 über der
// alphabetischen Grundlinie. Kisten aus echten Breiten sitzen auf der Schrift – mit einer Durchschnittsbreite lagen
// lange Namen auf Punkten, kurze sparten zu viel aus.
const ZEICHEN = ' ()-./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÄÖÜßäöü';
const VORSCHUB = new Map([...ZEICHEN].map((z, i) => [z, [
  280, 299, 299, 362, 210, 387, 648, 407, 548, 576, 614, 588, 598, 510, 615, 595, 626, 613, 645, 669, 569, 552, 694, 694, 392,
  512, 631, 541, 824, 693, 714, 592, 724, 614, 592, 558, 690, 593, 856, 623, 575, 607, 525, 566, 485, 564, 538, 314, 558, 550,
  252, 245, 492, 262, 845, 550, 548, 566, 574, 349, 471, 326, 540, 461, 684, 481, 449, 460, 626, 714, 690, 582, 525, 548, 540,
][i]]));
const breite = (t, s, art) => (s / 1000) * (art === 'mono'
  ? [...t].length * 632
  : [...t].reduce((n, z) => n + (VORSCHUB.get(z) ?? 700), 0) * (art === 'fett' ? 1.07 : 1));

/** Tintenkiste eines Textes der Größe s; Namen stehen auf „middle“ (mittig zur Punktzeile), Ringmaße alphabetisch. */
function tinte(t, x, y, s, anker, art = 'text', grundlinie = 'middle') {
  const w = breite(t, s, art);
  const x1 = anker === 'end' ? x - w : x;
  const basis = grundlinie === 'middle' ? y + 0.248 * s : y;
  const oben = /[ÄÖÜ]/.test(t) ? 0.859 : 0.719;
  const unten = /[gjpqy(),]/.test(t) ? 0.203 : 0.016;
  return { x1, y1: basis - oben * s, x2: x1 + w, y2: basis + unten * s };
}

const ueberlappt = (a, b, luft) => a.x1 - luft < b.x2 && a.x2 + luft > b.x1 && a.y1 - luft < b.y2 && a.y2 + luft > b.y1;
const abstandKiste = (x, y, k) => Math.hypot(Math.max(k.x1 - x, 0, x - k.x2), Math.max(k.y1 - y, 0, y - k.y2));
// Eine Kiste kreuzt einen Ring, wenn ihr nächster Punkt innen und ihr fernster außen liegt
const kreuztRing = (k, mx, my, R) => abstandKiste(mx, my, k) < R
  && Math.hypot(Math.max(Math.abs(k.x1 - mx), Math.abs(k.x2 - mx)), Math.max(Math.abs(k.y1 - my), Math.abs(k.y2 - my))) > R;

// Kartenname in der üblichen Kurzform („Frankfurt am Main“ → „Frankfurt“, „Hennef (Sieg)“ → „Hennef“): Der Zusatz
// verlängerte die Kiste um bis zur Hälfte und kostete Punkte, ohne den Ort auf dieser Karte eindeutiger zu machen.
const kurzname = (n) => n.replace(/\s*\(.*\)$/, '').replace(/\s+(?:am|an der|vor der|in der|im|ob der|bei)\s.+$/, '');

// Gewicht ausgesparter Punkte je Zone: Das Kerngebiet soll möglichst vollständig bleiben
const GEWICHT = [4, 2, 1, 1];
const LAGEN = [
  ['rechts', 0, 0], ['rechts', -0.5, 0.4], ['rechts', 0.5, 0.6],
  ['links', 0, 0.8], ['links', -0.5, 1], ['links', 0.5, 1.2],
];

/**
 * schrift: Schriftgrößen in SVG-Einheiten [unter 48em, ab 48em] wie in gebiet.css bzw. einsatzgebiet.css gesetzt;
 * punkt: Punktdurchmesser (--gk-punkt bzw. --gk-punkt-gross). Beides bestimmt, welche Punkte eine Schrift ausspart.
 */
export function gebietskarte(sk, {
  praefix = 'gk', radiusKm = 56, ringe = [20, 50], beschriftet = 7, beschriftetMobil = 5, titel, zelleKm = 3, klasse = '',
  schrift = { name: [18, 15], ring: [18, 16], sitz: [24, 18] }, punkt = 5,
} = {}) {
  const orte = sk.daten.orte || [];
  const sitz = orte.find((o) => o.km === 0 && o.typ === 'gemeinde') || { lat: 50.4844, lon: 8.2625, name: 'Weilburg' };
  const kx = 111.32 * Math.cos((sitz.lat * Math.PI) / 180);
  const ky = 111.32;
  const masstab = 4; // SVG-Einheiten je km
  const r = radiusKm * masstab;
  const p = (o) => [Math.round((o.lon - sitz.lon) * kx * masstab) + r, Math.round(-(o.lat - sitz.lat) * ky * masstab) + r];
  const zelle = zelleKm * masstab;
  const rad = punkt / 2;
  const luft = (s) => 0.15 * s; // Abstand der Schrift zu Punkten und zueinander, mit ihr wachsend (≈ 2 px)

  // Rasterpunkte (I-10): alle Orte auf Zellen; je Zelle die engste Zone
  const RANG = { A: 0, B: 1, C: 2, D: 3 };
  const zellen = new Map();
  for (const o of orte) {
    if (o.staat !== 'DE' || o.km > radiusKm + zelleKm) continue;
    const [x, y] = p(o);
    const ix = Math.round((x - r) / zelle); const iy = Math.round((y - r) / zelle);
    if (Math.hypot(ix * zelle, iy * zelle) > r - zelle / 2) continue;
    const k = `${ix},${iy}`;
    const rang = RANG[o.zone] ?? 3;
    if (!zellen.has(k) || zellen.get(k).rang > rang) zellen.set(k, { x: ix * zelle + r, y: iy * zelle + r, rang });
  }

  // Feste Teile: Kupferlinie von Weilburg bis zum äußeren Ring (die Punktspalte darunter bleibt frei), die Ringmaße
  // rechts daneben knapp über ihrem Ring und der Name des Sitzes. belegt[g] hält je Größe (0 schmal, 1 breit) die
  // sichtbaren Schriftkisten mit ihrer Luft; daraus folgt, welche Punkte wo entfallen.
  const aussen = Math.max(...ringe) * masstab;
  const sitzR = 11; // Sitzring 10 und halbe Strichstärke
  const spalte = r + sitzR + 6; // linke Kante aller Schrift rechts der Linie
  const schneise = { x1: r - 1, y1: r - aussen - rad - 2, x2: r + 1, y2: r - sitzR }; // endet am Ring, nicht an einem Punkt
  const belegt = [[], []];
  const innen = (k) => k.x1 >= 2 && k.y1 >= 1 && k.x2 <= 2 * r - 2 && k.y2 <= 2 * r - 1;
  const ringMasse = ringe.map((km) => ({ km, y: r - km * masstab - 6 }));
  for (const g of [0, 1]) {
    for (const { km, y } of ringMasse) belegt[g].push({ k: tinte(`${km} km`, spalte, y, schrift.ring[g], 'start', 'mono', 'alphabetic'), luft: luft(schrift.ring[g]) });
  }
  const verdeckt = (z, g) => belegt[g].some((b) => abstandKiste(z.x, z.y, b.k) < rad + b.luft);
  const inSchneise = (z) => abstandKiste(z.x, z.y, schneise) < rad + 1;
  // Zellen, an denen ein Name steht, je Größe, in der er sichtbar ist: Dort entfällt der Punkt nie
  const anker = new Map();
  const istAnker = (key, g) => anker.get(key)?.includes(g);
  // Kosten einer Stelle: gewichtete Zahl der Punkte, die sie ausspart (je sichtbarer Größe)
  const kosten = (kisten) => {
    let n = 0;
    for (const [key, z] of zellen) {
      if (inSchneise(z)) continue;
      for (const [g, k, l] of kisten) if (!istAnker(key, g) && !verdeckt(z, g) && abstandKiste(z.x, z.y, k) < rad + l) n += GEWICHT[z.rang];
    }
    return n;
  };
  // Beste freie Stelle für einen Text an einem Punkt (cx, cy) mit Abstand d, in den Größen gs; null, wenn keine passt
  const stelle = (t, art, cx, cy, d, gs, lagen = LAGEN) => {
    const sitzSelbst = art === 'fett';
    let beste = null;
    for (const [seite, dy, vorzug] of lagen) {
      const x = seite === 'rechts' ? cx + d : cx - d;
      const y = cy + dy * zelle;
      const kisten = gs.map((g) => [g, tinte(t, x, y, schrift[art === 'fett' ? 'sitz' : 'name'][g], seite === 'rechts' ? 'start' : 'end', art), luft(schrift[art === 'fett' ? 'sitz' : 'name'][g])]);
      const frei = kisten.every(([g, k, l]) => innen(k) && (sitzSelbst || abstandKiste(r, r, k) > sitzR + l) && !ueberlappt(k, schneise, l)
        && !belegt[g].some((b) => ueberlappt(k, b.k, Math.max(l, b.luft)))
        && ![...anker.keys()].some((key) => istAnker(key, g) && abstandKiste(zellen.get(key).x, zellen.get(key).y, k) < rad + l));
      if (!frei) continue;
      // Ringe darf eine Schrift kreuzen (der Halo unterbricht sie), lieber aber nicht
      const kreuzt = kisten.some(([, k]) => ringe.some((km) => kreuztRing(k, r, r, km * masstab)));
      const wert = kosten(kisten) + vorzug + (kreuzt ? 12 : 0);
      if (!beste || wert < beste.wert) beste = { x, y, seite, kisten, wert };
    }
    return beste;
  };
  const setzen = (wahl) => { for (const [g, k, l] of wahl.kisten) belegt[g].push({ k, luft: l }); };

  // Weilburg steht rechts oben am Sitzring, in einer Flucht mit den Ringmaßen, dort, wo die Linie beginnt; nur wenn
  // dort etwas im Weg ist, mittig oder darunter (rechts mittig, falls nichts frei ist)
  const sitzL = stelle('Weilburg', 'fett', r, r, sitzR + 6, [0, 1], [['rechts', -0.5, 0], ['rechts', 0, 20], ['rechts', 0.5, 20]])
    || { x: spalte, y: r, seite: 'rechts', kisten: [0, 1].map((g) => [g, tinte('Weilburg', spalte, r, schrift.sitz[g], 'start', 'fett'), luft(schrift.sitz[g])]) };
  setzen(sitzL);

  // Namen gierig nach Einwohnerzahl, am Punkt ihrer Rasterzelle. Erst mit der schmalen (größeren) Schrift, dann mit
  // der breiten aufgefüllt; was nur im zweiten Durchgang Platz fand, trägt data-rang="2" und entfällt schmal.
  const kandidaten = orte.filter((o) => o.staat === 'DE' && o.typ === 'gemeinde' && o.km <= radiusKm && o.km > 4)
    .sort((a, b) => (b.pop || 0) - (a.pop || 0) || a.slug.localeCompare(b.slug));
  const namen = [];
  const durchgang = (rang, gs, max) => {
    for (const o of kandidaten) {
      if (namen.length >= max) break;
      const [x, y] = p(o);
      const key = `${Math.round((x - r) / zelle)},${Math.round((y - r) / zelle)}`;
      const z = zellen.get(key);
      if (!z || anker.has(key) || inSchneise(z) || gs.some((g) => verdeckt(z, g))) continue;
      const name = kurzname(o.name);
      const wahl = stelle(name, 'text', z.x, z.y, rad + luft(schrift.name[0]), gs);
      if (!wahl) continue;
      setzen(wahl);
      anker.set(key, gs);
      namen.push({ name, rang, ...wahl });
    }
  };
  durchgang(1, [0, 1], Math.min(beschriftet, beschriftetMobil));
  durchgang(2, [1], beschriftet);

  // Punkte: ein Pfad je Zone (h0 + runde Enden); was nur unter der schmalen Schrift liegt, zeigt ein eigener Pfad erst
  // ab 48em (data-nur="breit"), was nur unter Namen der breiten Fassung liegt, nur schmal (data-nur="schmal")
  const ebenen = { '': [[], [], [], []], schmal: [[], [], [], []], breit: [[], [], [], []] };
  for (const key of [...zellen.keys()].sort()) {
    const z = zellen.get(key);
    if (inSchneise(z)) continue;
    const [schmal, breit] = [0, 1].map((g) => !istAnker(key, g) && verdeckt(z, g));
    if (schmal && breit) continue;
    ebenen[schmal ? 'breit' : breit ? 'schmal' : ''][z.rang].push(`M${z.x} ${z.y}h0`);
  }
  const punkte = Object.entries(ebenen).map(([nur, je]) => je.map((d, i) => (d.length
    ? `<path class="gk-raster gk-zone-${'abcd'[i]}"${nur ? ` data-nur="${nur}"` : ''} d="${d.join('')}"/>` : '')).join('')).join('');

  const text = (klasse, x, y, seite, inhalt, zusatz = '') => `<text class="${klasse}"${zusatz} x="${Math.round(x)}" y="${Math.round(y)}" dominant-baseline="middle"${seite === 'links' ? ' text-anchor="end"' : ''}>${esc(inhalt)}</text>`;
  const namenSvg = namen.map((n) => text('gk-name', n.x, n.y, n.seite, n.name, n.rang === 2 ? ' data-rang="2"' : '')).join('');
  const massSvg = ringMasse.map(({ km, y }) => `<text class="gk-ring-text" x="${spalte}" y="${y}">${km}&#160;km</text>`).join('');
  const ringSvg = ringe.map((km) => `<circle class="gk-ring" cx="${r}" cy="${r}" r="${km * masstab}"/>`).join('');
  return roh(`<svg class="gebietskarte${klasse ? ' ' + klasse : ''}" viewBox="0 0 ${2 * r} ${2 * r}" role="img" aria-labelledby="${praefix}-titel">
<title id="${praefix}-titel">${esc(titel || `Orte im Umkreis von ${radiusKm} km um Weilburg; Ringe bei ${ringe.slice(0, -1).join(', ')}${ringe.length > 1 ? ' und ' : ''}${ringe.at(-1)} km Luftlinie.`)}</title>
<g class="gk-ringe">${ringSvg}</g>
<g class="gk-punkte">${punkte}</g>
<g class="gk-mass"><path class="gk-mess" d="M${r} ${r - sitzR}V${r - aussen}"/>${massSvg}</g>
<g class="gk-namen">${namenSvg}</g>
<g class="gk-sitz"><circle class="gk-sitz-ring" cx="${r}" cy="${r}" r="10"/><circle class="gk-sitz-punkt" cx="${r}" cy="${r}" r="6"/>${text('gk-sitz-name', sitzL.x, sitzL.y, sitzL.seite, 'Weilburg')}</g>
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
