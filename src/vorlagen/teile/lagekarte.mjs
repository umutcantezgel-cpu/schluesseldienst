// Lagekarte je Ortsseite (I-10 als Kleinform, M-19) und Gebietslage je Hub („Linie & Bogen“, K-008).
// Ortsseite: Weilburg (Kupfer), der Ort (Lahn), die Peilung mit Entfernung, der Bogen um Weilburg durch den Ort,
// Orte der Umgebung als Punkte (die größten beschriftet) und ein Maßstab. Hub: die Orte des Gebiets als Raster nach
// Zonen wie die Einsatzgebietskarte, Weilburg, Zonenringe und die größten Orte.
// Äquirektangulär um die Mitte des Ausschnitts, auf die Figur skaliert. Beschriftungen, Punkte und Maßstab weichen
// einander, der Peilung, dem Bogen und den Zonenringen aus (Kisten, Strecken, Ringe), statt sich zu überdecken;
// Positionen nur über SVG-Attribute (CSP).
import { roh } from '../../../bau/lib/html.mjs';

const esc = (s) => String(s).replace(/[&<>"']/g, (z) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[z]);
const KM_JE_GRAD = 111.32;
const r = Math.round;

// Textmaße in Nutzereinheiten. Atkinson Hyperlegible Next läuft breit (≈ 0,58 em, fett ≈ 0,64 em, Mono 0,6 em);
// die Kisten schätzen eher zu groß, damit nichts knapp überlappt. Größen wie die Tokens --svg-text-s/-m/-l.
const SCHRIFT = { s: 15, m: 16, l: 18 };
const textKiste = (x, y, anker, text, groesse, faktor) => {
  const b = text.length * groesse * faktor;
  const x1 = anker === 'start' ? x : anker === 'end' ? x - b : x - b / 2;
  return { x1: x1 - 2, y1: y - groesse * 0.78, x2: x1 + b + 2, y2: y + groesse * 0.24 };
};

/** Projektion, die alle Punkte mit Rand in die Fläche b × h einpasst. */
function projektion(punkte, b, h, randX, randY) {
  const lats = punkte.map((o) => o.lat);
  const kx = Math.cos((((Math.min(...lats) + Math.max(...lats)) / 2) * Math.PI) / 180);
  const xs = punkte.map((o) => o.lon * kx); const ys = punkte.map((o) => -o.lat);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const m = Math.min((b - 2 * randX) / Math.max(x1 - x0, 1e-6), (h - 2 * randY) / Math.max(y1 - y0, 1e-6));
  const vx = (b - (x1 - x0) * m) / 2; const vy = (h - (y1 - y0) * m) / 2;
  return { p: (o) => [r((o.lon * kx - x0) * m + vx), r((-o.lat - y0) * m + vy)], jeKm: m / KM_JE_GRAD, m, kx };
}

/**
 * Belegte Flächen der Figur: Kisten (Beschriftungen, Marken, Punkte), Strecken (Peilung) und Ringe (Bogen um
 * Weilburg, Zonenringe). Ein Ring belegt nur seine Linie: eine Kiste ganz innen oder ganz außen ist frei.
 */
function belegung(b, h) {
  const kisten = []; const strecken = []; const ringe = [];
  const schneidet = (k, s) => {
    const n = Math.max(2, Math.ceil(Math.hypot(s[2] - s[0], s[3] - s[1]) / 3));
    for (let i = 0; i <= n; i++) {
      const x = s[0] + ((s[2] - s[0]) * i) / n; const y = s[1] + ((s[3] - s[1]) * i) / n;
      if (x > k.x1 && x < k.x2 && y > k.y1 && y < k.y2) return true;
    }
    return false;
  };
  // Abstand 3 zur Linie: halbe Strichbreite plus Luft, damit Schrift den Strich nicht berührt
  const kreuzt = (k, [cx, cy, rr]) => {
    const nah = Math.hypot(Math.max(k.x1 - cx, 0, cx - k.x2), Math.max(k.y1 - cy, 0, cy - k.y2));
    const fern = Math.max(...[[k.x1, k.y1], [k.x2, k.y1], [k.x1, k.y2], [k.x2, k.y2]].map(([x, y]) => Math.hypot(x - cx, y - cy)));
    return nah < rr + 3 && fern > rr - 3;
  };
  return {
    kiste(k) { kisten.push(k); return k; },
    loesen() { kisten.pop(); },
    strecke(s) { strecken.push(s); },
    ring(cx, cy, rr) { ringe.push([cx, cy, rr]); },
    innen: (k, rand = 2) => k.x1 >= rand && k.y1 >= rand && k.x2 <= b - rand && k.y2 <= h - rand,
    // mitRingen: false nur für Beschriftungen, die stehen müssen und sonst keinen Platz fänden
    aufRing: (k) => ringe.some((rg) => kreuzt(k, rg)),
    frei: (k, { mitRingen = true } = {}) => !kisten.some((a) => k.x1 < a.x2 && k.x2 > a.x1 && k.y1 < a.y2 && k.y2 > a.y1)
      && !strecken.some((s) => schneidet(k, s)) && !(mitRingen && ringe.some((rg) => kreuzt(k, rg))),
    abstandStrecke(x, y) {
      return Math.min(Infinity, ...strecken.map(([ax, ay, bx, by]) => {
        const dx = bx - ax; const dy = by - ay; const l2 = dx * dx + dy * dy || 1;
        const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / l2));
        return Math.hypot(x - (ax + t * dx), y - (ay + t * dy));
      }));
    },
  };
}

/**
 * Setzt eine Beschriftung an die erste freie Stelle. Pflichtbeschriftungen (Ort, Weilburg, Entfernung) dürfen danach
 * einen Ring kreuzen, zuletzt auch überdecken; alle übrigen entfallen ohne freie Stelle.
 */
function setzen(bel, kandidaten, { pflicht = false } = {}) {
  const innen = kandidaten.filter((c) => bel.innen(c.kiste));
  const wahl = innen.find((c) => bel.frei(c.kiste))
    || (pflicht ? innen.find((c) => bel.frei(c.kiste, { mitRingen: false })) || innen[0] || kandidaten[0] : null);
  if (wahl) bel.kiste(wahl.kiste);
  return wahl;
}

const text = (klasse, c, inhalt, zusatz = '') => `<text class="${klasse}"${zusatz} x="${r(c.x)}" y="${r(c.y)}"${c.anker === 'start' ? '' : ` text-anchor="${c.anker}"`}>${c.zeilen
  ? c.zeilen.map((z, i) => `<tspan x="${r(c.x)}"${i ? ` dy="${r(c.zeile)}"` : ''}>${esc(z)}</tspan>`).join('')
  : esc(inhalt)}</text>`;

// Kandidaten um einen Punkt: zuerst in der gewünschten Reihenfolge, dann schräg (Abstand d zur Marke)
const SCHRAEG = ['rechtsOben', 'linksOben', 'rechtsUnten', 'linksUnten'];
function umPunkt(x, y, inhalt, groesse, faktor, d, reihenfolge = ['rechts', 'links', 'oben', 'unten']) {
  const [oben, unten] = [y - d * 0.7 - groesse * 0.24, y + d * 0.7 + groesse * 0.78];
  const lage = {
    rechts: { x: x + d, y: y + groesse * 0.34, anker: 'start' },
    links: { x: x - d, y: y + groesse * 0.34, anker: 'end' },
    oben: { x, y: y - d - groesse * 0.24, anker: 'middle' },
    unten: { x, y: y + d + groesse * 0.78, anker: 'middle' },
    rechtsOben: { x: x + d * 0.7, y: oben, anker: 'start' },
    linksOben: { x: x - d * 0.7, y: oben, anker: 'end' },
    rechtsUnten: { x: x + d * 0.7, y: unten, anker: 'start' },
    linksUnten: { x: x - d * 0.7, y: unten, anker: 'end' },
  };
  return [...reihenfolge, ...SCHRAEG].map((n) => ({ ...lage[n], lage: n, kiste: textKiste(lage[n].x, lage[n].y, lage[n].anker, inhalt, groesse, faktor) }));
}

// Lange Ortsnamen („Herschbach (Oberwesterwald)“) passten in keiner Lage ins Blatt und wurden an der Kante
// abgeschnitten: Sie brechen zweizeilig vor der Klammer oder vor „an der“, „am“, „bei“ …, sonst am Leerzeichen
// nächst der Mitte. Der Block steht dort, wo die eine Zeile stünde (oben bündig unten, unten bündig oben, seitlich mittig).
const ZWEI_AB = 18;
function zweiZeilen(name) {
  if (name.length < ZWEI_AB) return null;
  const vor = /\s(?=\(|(?:an der|an den|am|an|bei|im|in der|ob der|vor der|auf der|über)\s)/g;
  const stellen = [...name.matchAll(vor)].map((m) => m.index);
  const alle = stellen.length ? stellen : [...name.matchAll(/\s/g)].map((m) => m.index);
  if (!alle.length) return null;
  const i = alle.sort((a, b) => Math.abs(a - name.length / 2) - Math.abs(b - name.length / 2))[0];
  return [name.slice(0, i), name.slice(i + 1)];
}
const VERSATZ = { oben: -1, rechtsOben: -1, linksOben: -1, unten: 0, rechtsUnten: 0, linksUnten: 0, rechts: -0.5, links: -0.5 };
function zweizeilig(kandidaten, zeilen, groesse, faktor) {
  const zeile = groesse * 1.1;
  const laengste = zeilen.reduce((a, b) => (b.length > a.length ? b : a));
  return kandidaten.map((c) => {
    const y = c.y + VERSATZ[c.lage] * zeile;
    const k = textKiste(c.x, y, c.anker, laengste, groesse, faktor);
    return { ...c, y, zeilen, zeile, kiste: { ...k, y2: k.y2 + zeile } };
  });
}

// Maßstab: runde Länge, deren Strich zwischen 36 und 84 Einheiten misst (nächst an 56)
const MASSSTAB_KM = [0.5, 1, 2, 5, 10, 20, 50, 100, 200];
function massstab(bel, jeKm, b, h, punkte) {
  const passend = MASSSTAB_KM.map((km) => ({ km, l: km * jeKm })).filter((m) => m.l >= 36 && m.l <= 84);
  if (!passend.length) return '';
  const { km, l } = passend.sort((a, c) => Math.abs(a.l - 56) - Math.abs(c.l - 56))[0];
  const inhalt = `${String(km).replace('.', ',')} km`;
  const w = Math.max(l, inhalt.length * SCHRIFT.s * 0.58);
  // zuerst die Ecken, dann entlang der Unter- und Oberkante, zuletzt an den Seiten
  const ecken = [[12, h - 12], [b - 12 - l, h - 12], [12, 30], [b - 12 - l, 30]];
  const kanten = [0.25, 0.5, 0.75].flatMap((t) => [[12 + (b - 24 - l) * t, h - 12], [12 + (b - 24 - l) * t, 30]]);
  const seiten = [0.4, 0.6].flatMap((t) => [[12, 30 + (h - 42) * t], [b - 12 - l, 30 + (h - 42) * t]]);
  for (const [x, y] of [...ecken, ...kanten, ...seiten]) {
    const kiste = { x1: x - 4, y1: y - 8 - SCHRIFT.s, x2: x + w + 4, y2: y + 6 };
    if (!bel.innen(kiste, 0) || !bel.frei(kiste) || punkte.some(([px, py]) => px > kiste.x1 - 4 && px < kiste.x2 + 4 && py > kiste.y1 - 4 && py < kiste.y2 + 4)) continue;
    bel.kiste(kiste);
    const [xr, yr, lr] = [r(x), r(y), r(l)];
    return `<path class="lk-mass" d="M${xr} ${yr}h${lr}M${xr} ${yr - 3}v6M${xr + lr} ${yr - 3}v6"/><text class="lk-mass-text" x="${xr}" y="${yr - 8}">${inhalt}</text>`;
  }
  return '';
}

// Orte mit Einwohnerzahl, größte zuerst – einmal je Datenbestand sortiert, nicht je Seite
const SORTIERT = new WeakMap();
function nachGroesse(orte) {
  if (!SORTIERT.has(orte)) SORTIERT.set(orte, orte.filter((o) => o.pop > 0).sort((a, c) => c.pop - a.pop || (a.slug < c.slug ? -1 : 1)));
  return SORTIERT.get(orte);
}

// Mindestabstand benannter Punkte: Nachbarn untereinander, Orientierungsorte zu allen
const NAH_ABSTAND = 40; const WEIT_ABSTAND = 56;
// Ortsbeschriftung: Kandidaten um die Marke, zuerst auf der von der Linie abgewandten Seite
const ortKandidaten = (ox, oy, name, oben) => umPunkt(ox, oy, name, SCHRIFT.l, 0.64, 16, oben ? ['oben', 'rechts', 'links', 'unten'] : ['unten', 'rechts', 'links', 'oben']);

/**
 * Ausschnitt der Lagekarte. Weilburg und sein Name (mittig unter bzw. über der Marke, vom Ort abgewandt) halten
 * mindestens --sp-l (32 Einheiten) Abstand zur Blattkante: Fehlt Rand, setzt ein Hilfspunkt an der Kante der Kiste den
 * Ausschnitt neu.
 * Der Bogen läuft durch den Ort; frei von ihm steht der Ortsname nur jenseits des Bogens. Liegt der Ort so am
 * Blattrand, dass der Name dort näher als ORT_RAND an der Kante stünde, rückt ein weiterer Hilfspunkt den Ausschnitt
 * um diesen Überstand ein (höchstens 96 Einheiten; längere Namen kreuzen den Bogen an der Marke).
 * Passt der ganze Bogen ins Blatt (Durchmesser höchstens H − 2 · ORT_RAND), liegt er auch ganz darin: Hilfspunkte an
 * seinen vier Polen, um den Unterschied der Ränder (30/36 statt 12) nach innen gerückt. Angeschnitten wirkte er wie
 * ein Versehen (Löhnberg 2 Einheiten unten, Taunusstein-Wehen 38 oben).
 */
const SITZ_RAND = 32;
// Mindestabstand des Ortsnamens und des Bogens zur Blattkante (≈ --sp-xs): „Bremen“ stand sonst oben an der Kante
const ORT_RAND = 12;
function ausschnitt(ort, sitz, nachbarn, B, H, mitLinie) {
  const punkte = [sitz, ort, ...nachbarn];
  let proj = projektion(punkte, B, H, 30, 36);
  if (!mitLinie) return proj;
  const unten = proj.p(ort)[1] <= proj.p(sitz)[1];
  const halb = ('Weilburg'.length * SCHRIFT.m * 0.62) / 2;
  // Hilfspunkt an der Stelle (hx, hy) des Ausschnitts, bezogen auf den Ort o
  const punkt = (o, [x, y], hx, hy) => ({ lat: o.lat - (hy - y) / proj.m, lon: o.lon + (hx - x) / (proj.m * proj.kx) });
  const sitzHilfe = () => {
    const [x, y] = proj.p(sitz);
    // Kiste aus Marke (r 6) und Name im Abstand 14 (wie umPunkt); seitlich liegt der Rand des Ausschnitts bei 30, oben
    // und unten bei 36 – seitlich 2 Einheiten Zugabe
    const k = unten ? { x1: x - halb, y1: y - 9, x2: x + halb, y2: y + 31 } : { x1: x - halb, y1: y - 31, x2: x + halb, y2: y + 9 };
    return [[k.x1 < SITZ_RAND, k.x1 - 2, y], [k.x2 > B - SITZ_RAND, k.x2 + 2, y], [k.y1 < SITZ_RAND, x, k.y1], [k.y2 > H - SITZ_RAND, x, k.y2]]
      .filter(([fehlt]) => fehlt).map(([, hx, hy]) => punkt(sitz, [x, y], hx, hy));
  };
  const ortHilfe = () => {
    const [sx, sy] = proj.p(sitz); const [ox, oy] = proj.p(ort);
    const bel = belegung(B, H);
    bel.kiste({ x1: ox - 11, y1: oy - 11, x2: ox + 11, y2: oy + 11 });
    bel.strecke([sx, sy, ox, oy]);
    bel.ring(sx, sy, Math.hypot(ox - sx, oy - sy));
    const ueber = (k) => [Math.min(0, k.x1 - ORT_RAND) || Math.max(0, k.x2 - (B - ORT_RAND)), Math.min(0, k.y1 - ORT_RAND) || Math.max(0, k.y2 - (H - ORT_RAND))];
    const kandidaten = ortKandidaten(ox, oy, ort.name, oy <= sy).filter((c) => bel.frei(c.kiste));
    if (!kandidaten.length || kandidaten.some((c) => bel.innen(c.kiste, ORT_RAND))) return [];
    const { kiste: k } = kandidaten.map((c) => ({ ...c, u: Math.hypot(...ueber(c.kiste)) })).sort((a, c) => a.u - c.u)[0];
    if (Math.hypot(...ueber(k)) > 96) return [];
    // Der Hilfspunkt liegt so, dass die Kiste ORT_RAND vor der Kante landet, wenn er selbst am Rand des Ausschnitts
    // (30/36) steht – mit 2 Einheiten Zugabe
    const [dx, dy] = ueber(k);
    const [ax, ay] = [28 - ORT_RAND, 34 - ORT_RAND];
    return [punkt(ort, [ox, oy], dx > 0 ? k.x2 - ax : dx < 0 ? k.x1 + ax : ox, dy > 0 ? k.y2 - ay : dy < 0 ? k.y1 + ay : oy)];
  };
  const polHilfe = () => {
    const [sx, sy] = proj.p(sitz); const [ox, oy] = proj.p(ort);
    const rr = Math.hypot(ox - sx, oy - sy);
    const drin = sx - rr >= ORT_RAND && sy - rr >= ORT_RAND && sx + rr <= B - ORT_RAND && sy + rr <= H - ORT_RAND;
    if (drin || 2 * rr > H - 2 * ORT_RAND) return [];
    // Schrumpft der Maßstab beim Einpassen, schrumpft der Überstand mit: der Rand bleibt mindestens ORT_RAND
    const [dx, dy] = [Math.max(rr - (30 - ORT_RAND), 0), Math.max(rr - (36 - ORT_RAND), 0)];
    return [[sx - dx, sy], [sx + dx, sy], [sx, sy - dy], [sx, sy + dy]].map(([hx, hy]) => punkt(sitz, [sx, sy], hx, hy));
  };
  // Jedes Einpassen ändert den Maßstab: bis zu viermal prüfen, der Hilfspunkt für den Ortsnamen höchstens einmal
  let ortFrei = true;
  for (let i = 0; i < 4; i++) {
    const ortNeu = ortFrei ? ortHilfe() : [];
    if (ortNeu.length) ortFrei = false;
    const neu = [...sitzHilfe(), ...ortNeu, ...polHilfe()];
    if (!neu.length) break;
    punkte.push(...neu);
    proj = projektion(punkte, B, H, 30, 36);
  }
  return proj;
}

/**
 * Lagekarte der Ortsseite. umgebung: alle veröffentlichten Orte (Kontext für Punkte und Namen im Ausschnitt).
 * Die Peilung wird waagerecht gezeichnet und per transform-Attribut der Hülle gedreht; M-19 zieht sie über eine
 * Maske (clipPath) mit scaleX auf, damit das Strichmuster nicht mitgestaucht wird.
 */
export function lagekarte({ ort, sitz, nachbarn = [], umgebung = [], praefix = 'lk' }) {
  const B = 360; const H = 225;
  const mitLinie = ort.km > 0; // Weilburgs eigene Seite hat keine Peilung
  const { p, jeKm } = ausschnitt(ort, sitz, nachbarn, B, H, mitLinie);
  const [sx, sy] = p(sitz); const [ox, oy] = p(ort);
  const bel = belegung(B, H);
  // Ortsmarke: Ring r 10 mit Strich 2 reicht bis 11
  bel.kiste({ x1: ox - 11, y1: oy - 11, x2: ox + 11, y2: oy + 11 });
  // Bogen um Weilburg durch den Ort: vor allen Beschriftungen eingetragen, damit Namen, Entfernung und Maßstab ihm
  // ausweichen; die Ortsbeschriftung sucht zuerst eine Stelle neben dem Bogen
  const laenge = r(Math.hypot(ox - sx, oy - sy));
  const mitBogen = mitLinie && laenge >= 18;
  if (mitLinie) {
    bel.kiste({ x1: sx - 9, y1: sy - 9, x2: sx + 9, y2: sy + 9 });
    bel.strecke([sx, sy, ox, oy]);
  }
  if (mitBogen) bel.ring(sx, sy, laenge);
  // Ort und Weilburg: zuerst auf der von der Linie abgewandten Seite
  const ortOben = oy <= sy;
  // Ortsname mit Abstand zur Kante, wo das geht (der Ausschnitt hat dafür Platz gelassen); ein langer Name lieber
  // zweizeilig als an der Kante; ganz im Bild lieber über dem Bogen (Lichthof) oder auf anderer Schrift als
  // abgeschnitten. Erst wenn keine Lage ins Blatt passt, die mit dem kleinsten Überstand.
  const ortK = ortKandidaten(ox, oy, ort.name, ortOben);
  const zeilen = zweiZeilen(ort.name);
  const ortZ = zeilen ? zweizeilig(ortK, zeilen, SCHRIFT.l, 0.64) : [];
  const im = (liste, rand) => liste.filter((c) => bel.innen(c.kiste, rand));
  const nehmen = (c) => c && (bel.kiste(c.kiste), c);
  const ueberBogen = (liste) => liste.find((c) => bel.frei(c.kiste, { mitRingen: false }));
  const ueberstand = ({ kiste: k }) => Math.max(0, -k.x1, -k.y1, k.x2 - B, k.y2 - H);
  const ortL = setzen(bel, im(ortK, ORT_RAND)) || setzen(bel, im(ortZ, ORT_RAND)) || setzen(bel, ortK) || setzen(bel, ortZ)
    || nehmen(ueberBogen(im(ortZ, ORT_RAND)) || ueberBogen(im(ortK, 2)) || ueberBogen(im(ortZ, 2)) || im([...ortK, ...ortZ], 2)[0]
      || [...ortK, ...ortZ].sort((a, c) => ueberstand(a) - ueberstand(c))[0]);
  const sitzL = mitLinie ? setzen(bel, umPunkt(sx, sy, 'Weilburg', SCHRIFT.m, 0.62, 14, ortOben ? ['unten', 'rechts', 'links', 'oben'] : ['oben', 'rechts', 'links', 'unten']), { pflicht: true }) : null;
  // Entfernung senkrecht zur Peilung neben der Linienmitte, auf der freien Seite
  let km = ''; let kmL = null;
  if (mitLinie) {
    const inhalt = `${ort.km} km`;
    const l = Math.hypot(ox - sx, oy - sy) || 1;
    const [nx, ny] = [-(oy - sy) / l, (ox - sx) / l];
    const breite = inhalt.length * SCHRIFT.m * 0.6; const hoehe = SCHRIFT.m;
    const kandidaten = [[0.5, 10], [0.36, 10], [0.64, 10], [0.25, 10], [0.75, 10], [0.5, 22]].flatMap(([t, d]) => [1, -1].map((v) => {
      const ab = d + Math.abs(nx) * breite / 2 + Math.abs(ny) * hoehe / 2;
      const cx = sx + (ox - sx) * t + v * nx * ab; const cy = sy + (oy - sy) * t + v * ny * ab;
      return { x: cx, y: cy + hoehe * 0.34, anker: 'middle', kiste: { x1: cx - breite / 2 - 2, y1: cy - hoehe / 2 - 1, x2: cx + breite / 2 + 2, y2: cy + hoehe / 2 + 1 } };
    }));
    kmL = setzen(bel, kandidaten, { pflicht: true });
    km = text('lk-km', kmL, inhalt);
  }
  // Punkte nie auf Marken, Linie oder Schrift und nicht dicht an einem anderen Punkt
  const gesetzt = [];
  const imBild = (x, y) => x >= 8 && x <= B - 8 && y >= 8 && y <= H - 8;
  const punktFrei = (x, y) => imBild(x, y) && Math.hypot(x - ox, y - oy) >= 16 && !(mitLinie && (Math.hypot(x - sx, y - sy) < 12 || bel.abstandStrecke(x, y) < 6))
    && bel.frei({ x1: x - 4, y1: y - 4, x2: x + 4, y2: y + 4 }) && !gesetzt.some(([gx, gy]) => Math.hypot(gx - x, gy - y) < 10);
  // Jeder Punkt trägt seinen Namen: Findet der Name keinen Platz, entfällt der Punkt mit ihm (stumme Punkte lasen
  // sich als halb fertige Karte und nahmen den benannten Platz weg). Benannte Punkte halten Abstand zueinander, damit
  // sich die Namen über das Blatt verteilen statt sich zu ballen (Köln mit Düsseldorf, Bonn oder Essen).
  const namenSvg = [];
  const benannt = (o, [x, y], abstand) => {
    if (o.name.length > 24 || !punktFrei(x, y) || gesetzt.some(([gx, gy]) => Math.hypot(gx - x, gy - y) < abstand)) return false;
    bel.kiste({ x1: x - 3, y1: y - 3, x2: x + 3, y2: y + 3 });
    const c = setzen(bel, umPunkt(x, y, o.name, SCHRIFT.s, 0.58, 7));
    if (!c) { bel.loesen(); return false; }
    gesetzt.push([x, y]); namenSvg.push(text('lk-name', c, o.name));
    return true;
  };
  // Zuerst die Liste „Orte in der Nähe“ (nächste zuerst, bis zu drei), damit Karte und Liste einander zeigen
  const nah = nachbarn.filter((o) => o.slug !== sitz.slug).map((o) => ({ o, xy: p(o) }))
    .sort((a, c) => Math.hypot(a.xy[0] - ox, a.xy[1] - oy) - Math.hypot(c.xy[0] - ox, c.xy[1] - oy));
  for (const { o, xy } of nah) if (namenSvg.length < 3) benannt(o, xy, NAH_ABSTAND);
  // Dazu bis zu drei größere Orte im Ausschnitt zur Orientierung (zusammen höchstens vier Namen), weiter gestreut.
  // Zuerst die nahe der Peilung (höchstens H/3 von ihr): Sie zeigen den Weg von Weilburg zum Ort, ein Name am anderen
  // Ende des Blatts (Köln über Böckweiler) zeigt nichts. Nur Gemeinden: ein Stadtteil („Gallus“) orientiert nicht.
  const gross = [];
  for (const o of nachGroesse(umgebung)) {
    if (gross.length >= 60) break;
    if (o.typ === 'ortsteil' || o.slug === ort.slug || o.slug === sitz.slug || nah.some((n) => n.o.slug === o.slug)) continue;
    const xy = p(o);
    if (imBild(...xy)) gross.push({ o, xy, amWeg: mitLinie && bel.abstandStrecke(...xy) <= H / 3 });
  }
  let orientierung = 0;
  for (const { o, xy } of [...gross.filter((g) => g.amWeg), ...gross.filter((g) => !g.amWeg)]) {
    if (orientierung >= 3 || namenSvg.length >= 4) break;
    if (benannt(o, xy, WEIT_ABSTAND)) orientierung++;
  }
  const mass = massstab(bel, jeKm, B, H, gesetzt);
  const winkel = r((Math.atan2(oy - sy, ox - sx) * 1800) / Math.PI) / 10;
  // Fanden Weilburg oder die Entfernung nur auf dem Bogen Platz (Ortsteile dicht am Sitz), entfällt der Bogen
  const bogen = mitBogen && ![sitzL, kmL].some((c) => c && bel.aufRing(c.kiste)) ? `<circle class="lk-bogen" cx="${sx}" cy="${sy}" r="${laenge}"/>` : '';
  const linie = mitLinie ? `<g transform="translate(${sx} ${sy}) rotate(${winkel})"><clipPath id="${praefix}-zug"><rect class="lk-zug" y="-4" width="${laenge}" height="8"/></clipPath><path class="lk-linie" d="M0 0H${laenge}" clip-path="url(#${praefix}-zug)"/></g>` : '';
  const punkte = gesetzt.map(([x, y]) => `M${x} ${y}h0`).join('');
  return roh(`<svg class="lagekarte" viewBox="0 0 ${B} ${H}" role="img" aria-labelledby="${praefix}-titel">
<title id="${praefix}-titel">${esc(mitLinie ? `Lage von ${ort.name}: rund ${ort.km} km ${ort.richtung || ''} von Weilburg, dazu Orte der Umgebung` : `Lage von ${ort.name} mit den Orten der Umgebung`)}</title>
${bogen}${punkte ? `<path class="lk-nachbarn" d="${punkte}"/>` : ''}${linie}${km}
${mitLinie ? `<circle class="lk-sitz" cx="${sx}" cy="${sy}" r="6"/><circle class="lk-ort-ring" cx="${ox}" cy="${oy}" r="10"/><circle class="lk-ort" cx="${ox}" cy="${oy}" r="5"/>` : `<circle class="lk-ort-ring lk-sitz-ring" cx="${ox}" cy="${oy}" r="10"/><circle class="lk-sitz" cx="${ox}" cy="${oy}" r="6"/>`}
${sitzL ? text('lk-sitz-text', sitzL, 'Weilburg') : ''}${text('lk-ort-text', ortL, ort.name)}${namenSvg.join('')}${mass}
</svg>`);
}


/**
 * Zonenring als Kreis; läuft er durch eine der Kisten (Weilburg, ein Hauptname ohne andere freie Stelle; 3 Einheiten
 * Luft), setzt er dort aus: Bögen über die freien Winkel in Grad-Schritten, damit der Name ohne Platte oder Maske frei
 * steht.
 */
function ring(cx, cy, rr, kisten) {
  const frei = Array.from({ length: 360 }, (_, g) => {
    const [x, y] = [cx + rr * Math.cos((g * Math.PI) / 180), cy + rr * Math.sin((g * Math.PI) / 180)];
    return !kisten.some((k) => x > k.x1 - 3 && x < k.x2 + 3 && y > k.y1 - 3 && y < k.y2 + 3);
  });
  if (frei.every(Boolean)) return `<circle class="gk-ring" cx="${cx}" cy="${cy}" r="${rr}"/>`;
  // Läufe freier Winkel, beginnend nach einem belegten Grad (so wird kein Lauf über 0° zerschnitten)
  const start = frei.findIndex((f, g) => f && !frei[(g + 359) % 360]);
  const pkt = (g) => `${r(cx + rr * Math.cos((g * Math.PI) / 180))} ${r(cy + rr * Math.sin((g * Math.PI) / 180))}`;
  const boegen = []; let von = null;
  for (let i = 0; i <= 360; i++) {
    const g = start + i;
    if (i < 360 && frei[g % 360]) { if (von === null) von = g; continue; }
    if (von !== null) { boegen.push(`M${pkt(von)}A${rr} ${rr} 0 ${g - 1 - von > 180 ? 1 : 0} 1 ${pkt(g - 1)}`); von = null; }
  }
  return `<path class="gk-ring" d="${boegen.join('')}"/>`;
}

// Pfad aus der Punktfolge [x0, y0, x1, y1, …]
const pfadD = (pkte) => pkte.map(r).reduce((s, v, i) => s + (i % 2 ? ` ${v}` : `${i ? 'L' : 'M'}${v}`), '');
function abstandZurStrecke(x, y, [ax, ay, bx, by]) {
  const dx = bx - ax; const dy = by - ay; const l2 = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / l2));
  return Math.hypot(x - (ax + t * dx), y - (ay + t * dy));
}
// Stützpunkte im Abstand von höchstens 2 Einheiten entlang einer Strecke
const entlang = ([ax, ay, bx, by]) => {
  const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / 2));
  return Array.from({ length: n + 1 }, (_, i) => [ax + ((bx - ax) * i) / n, ay + ((by - ay) * i) / n]);
};
const inKiste = ([x, y], k) => x > k.x1 && x < k.x2 && y > k.y1 && y < k.y2;
const abschnitte = (l) => Array.from({ length: l.length / 2 - 1 }, (_, i) => l.slice(i * 2, i * 2 + 4));

/**
 * Stelle für den Namen eines Rasterpunkts im Hub. Zuerst direkt am Punkt: rechts oder links auf seiner Höhe, sonst
 * mittig darüber oder darunter. Sonst am nächsten freien Rand des Rasters mit einer Haarlinie aus 0°, 45° und 90°
 * (K-008, höchstens ein Knick): waagerecht zum Namen auf gleicher Höhe, senkrecht zum Namen mittig darüber oder
 * darunter, oder mit einem 45°-Stück aus dem Punkt in eine der beiden. Im dichten Raster liegt auf jeder solchen Linie
 * ein Punkt; sie spart die Punkte aus, an denen sie näher als 4 vorbeiläuft (wie die Schrift von „Weilburg“), jeder
 * ausgesparte Punkt kostet, einer des Kerngebiets doppelt. Ohne Aussparung fehlten im dichten Raster gerade die
 * größten Städte (Köln, Frankfurt). Die Linie kreuzt weder Schrift noch eine andere Linie; lange Namen brechen
 * zweizeilig (zweiZeilen). Liefert die günstigste Lösung { x, y, anker, kiste, zeilen?, linie?, aus } oder null.
 */
const AUS_KOSTEN = 8; const AUS_MAX = 10; const KNICK_KOSTEN = 6; const ZWEI_KOSTEN = 4;
function namensStelle(bel, [x, y], inhalt, groesse, { raster, schrift, linien, reichweite, ueberRinge = false }) {
  const eigen = raster.schluessel(x, y);
  const zeilen = zweiZeilen(inhalt);
  // Name an der Stelle (lx, ly) im Abstand d: seitlich auf gleicher Höhe, oben und unten mittig; lange Namen auch
  // zweizeilig (der Block steht wie die eine Zeile, zweizeilig())
  const an = (lx, ly, lage, d = 3) => {
    const c = {
      rechts: { x: lx + d, y: ly + groesse * 0.34, anker: 'start' },
      links: { x: lx - d, y: ly + groesse * 0.34, anker: 'end' },
      oben: { x: lx, y: ly - d - groesse * 0.24, anker: 'middle' },
      unten: { x: lx, y: ly + d + groesse * 0.78, anker: 'middle' },
    }[lage];
    const eins = { ...c, lage, kiste: textKiste(c.x, c.y, c.anker, inhalt, groesse, 0.6), kosten: 0 };
    return zeilen ? [eins, ...zweizeilig([eins], zeilen, groesse, 0.6).map((z) => ({ ...z, kosten: ZWEI_KOSTEN }))] : [eins];
  };
  const passt = (c) => bel.innen(c.kiste) && bel.frei(c.kiste, { mitRingen: !ueberRinge });
  let beste = null;
  const nimm = (c, kosten, linie = null, aus = []) => {
    if (passt(c) && (!beste || kosten + c.kosten < beste.kosten)) beste = { ...c, kosten: kosten + c.kosten, linie, aus };
  };
  // direkt am Punkt, in dieser Reihenfolge (gleiche Kosten: die erste freie Lage gewinnt)
  [['rechts', 5, 0], ['links', -5, 0], ['oben', 0, -5], ['unten', 0, 5]].forEach(([lage, dx, dy], i) => {
    for (const c of an(x + dx, y + dy, lage)) nimm(c, i * 0.1);
  });
  if (beste && !beste.zeilen) return beste;
  // Eine Strecke wird in Stücken geprüft: kreuzt sie Schrift oder eine andere Linie, ist die Richtung zu Ende;
  // Punkte, an denen sie vorbeiläuft, sammelt sie (außer dem eigenen) mit ihrem Preis; zu viele beenden sie auch
  const weg = (von = null) => ({ aus: new Set(von?.aus), preis: von?.preis || 0, zu: false });
  const verlaengern = (w, s) => {
    for (const q of entlang(s)) {
      if (schrift.some((k) => inKiste(q, k))) { w.zu = true; return w; }
      for (const k of raster.nahe(q[0], q[1], 4)) {
        if (k === eigen || w.aus.has(k)) continue;
        w.aus.add(k); w.preis += raster.kern(k) ? 2 * AUS_KOSTEN : AUS_KOSTEN;
      }
    }
    if (w.aus.size > AUS_MAX || linien.some((l) => abschnitte(l).some((a) => entlang(s).some(([qx, qy]) => abstandZurStrecke(qx, qy, a) < 3)))) w.zu = true;
    return w;
  };
  const ziel = (s, v) => (s ? (s > 0 ? 'rechts' : 'links') : v < 0 ? 'oben' : 'unten');
  // gerade: waagerecht (s) oder senkrecht (v), Länge l ab dem Rand der Marke
  for (const [s, v] of [[1, 0], [-1, 0], [0, -1], [0, 1]]) {
    const w = weg(); let von = 4;
    for (let l = 10; l <= reichweite && !w.zu; l += 2) {
      verlaengern(w, [x + s * von, y + v * von, x + s * l, y + v * l]); von = l;
      if (w.zu) break;
      const linie = [x + s * 4, y + v * 4, x + s * l, y + v * l];
      for (const c of an(x + s * l, y + v * l, ziel(s, v))) nimm(c, l + w.preis, linie, [...w.aus]);
    }
  }
  // 45° aus dem Punkt bis zur n-ten Rasterdiagonale, dann waagerecht oder senkrecht weiter
  for (const s of [1, -1]) {
    for (const v of [-1, 1]) {
      const schraeg = weg();
      for (let n = 1; n <= 4 && !schraeg.zu; n++) {
        const [kx, ky] = [x + s * 6 * n, y + v * 6 * n];
        verlaengern(schraeg, [x + s * 6 * (n - 1 || 0.47), y + v * 6 * (n - 1 || 0.47), kx, ky]);
        if (schraeg.zu) break;
        const diag = 6 * n * Math.SQRT2;
        for (const [ws, wv] of [[s, 0], [0, v]]) {
          const w = weg(schraeg); let von = 0;
          for (let l = 6; diag + l <= reichweite; l += 2) {
            verlaengern(w, [kx + ws * von, ky + wv * von, kx + ws * l, ky + wv * l]); von = l;
            if (w.zu) break;
            const linie = [x + s * 2.8, y + v * 2.8, kx, ky, kx + ws * l, ky + wv * l];
            for (const c of an(kx + ws * l, ky + wv * l, ziel(ws, wv))) nimm(c, diag + l + KNICK_KOSTEN + w.preis, linie, [...w.aus]);
          }
        }
      }
    }
  }
  return beste;
}

/**
 * Gebietslage eines Hubs: alle Orte des Gebiets als Raster (Zellen à 6 Einheiten, je Zelle die engste Zone, ein Pfad
 * je Zone – wie I-10), Weilburg mit den Zonenringen im Ausschnitt und die größten Orte. Liegt das Gebiet so fern, dass
 * es neben Weilburg zum Fleck schrumpfte, zeigt der Ausschnitt nur das Gebiet; eine Peilung läuft zur Blattkante in
 * Richtung Weilburg und trägt die Entfernung. Klassen der Einsatzgebietskarte (gk-…) und der Lagekarte (lk-…), damit
 * Farben, Dunkelmodus und erzwungene Farben gleich bleiben. Liefert SVG, gezeigte Zonen und Ringe.
 * Rasterpunkte und Ringe gehören zur Belegung: Schrift steht nur auf freier Fläche, Namen im dichten Raster am Rand
 * mit Führungslinie. Einzig „Weilburg“ muss stehen; findet der Name keine freie Stelle, spart das Raster unter ihm aus
 * – wie schon um die Sitzmarke – und ein kreuzender Ring setzt dort aus.
 */
export function gebietslage({ orte, sitz, ringeKm = [20, 50, 100], praefix = 'gl', titel, namenMax = 4 }) {
  const B = 360; const H = 240; const ZELLE = 6;
  const lat0 = orte.reduce((a, o) => a + o.lat, 0) / orte.length; const lon0 = orte.reduce((a, o) => a + o.lon, 0) / orte.length;
  const kx0 = Math.cos((lat0 * Math.PI) / 180);
  const ausdehnung = (liste) => Math.max(
    (Math.max(...liste.map((o) => o.lat)) - Math.min(...liste.map((o) => o.lat))) * KM_JE_GRAD,
    (Math.max(...liste.map((o) => o.lon)) - Math.min(...liste.map((o) => o.lon))) * KM_JE_GRAD * kx0,
  );
  // Fern: das Gebiet beginnt jenseits des äußersten Zonenrings oder schrumpfte neben Weilburg auf weniger als die Hälfte
  const fern = !orte.some((o) => o.slug === sitz.slug)
    && (Math.min(...orte.map((o) => o.km)) > Math.max(...ringeKm) || ausdehnung(orte) < ausdehnung([sitz, ...orte]) * 0.5);
  // Mindestausschnitt um das Gebiet, damit ein einzelner Ort nicht unendlich vergrößert wird: 40 km, bei ein oder zwei
  // Orten 16 km, damit nahe Orte (Stadt und Stadtteil) getrennte Punkte bleiben. Nah dazu 22 km um Weilburg, damit
  // Sitz, Name und der Ring des Kerngebiets nicht an der Kante kleben.
  const minKm = orte.length < 3 ? 16 : 40;
  const um = (o, km, kx) => [{ lat: o.lat - km / KM_JE_GRAD, lon: o.lon - km / KM_JE_GRAD / kx }, { lat: o.lat + km / KM_JE_GRAD, lon: o.lon + km / KM_JE_GRAD / kx }];
  // Fern: Platz in Richtung Weilburg, damit Peilung und Beschriftung neben dem Gebiet stehen statt darauf
  const richtung = [(sitz.lon - lon0) * kx0, sitz.lat - lat0]; const rl = Math.hypot(...richtung) || 1;
  const vorlauf = (ausdehnung(orte) / 2 + 0.45 * Math.max(ausdehnung(orte), minKm)) / KM_JE_GRAD;
  const rahmen = [...um({ lat: lat0, lon: lon0 }, minKm / 2, kx0), ...(fern
    ? [{ lat: lat0 + (richtung[1] / rl) * vorlauf, lon: lon0 + ((richtung[0] / rl) * vorlauf) / kx0 }]
    : [sitz, ...um(sitz, Math.min(...ringeKm) + 2, kx0)])];
  const { p, jeKm } = projektion([...orte, ...rahmen], B, H, 22, 26);
  const [sx, sy] = p(sitz);
  const RANG = { A: 0, B: 1, C: 2, D: 3, NL: 3 };
  const schluessel = ([x, y]) => `${r(x / ZELLE)},${r(y / ZELLE)}`;
  const mitte = (k) => k.split(',').map((n) => Number(n) * ZELLE);
  const zellen = new Map();
  for (const o of orte) {
    if (o.slug === sitz.slug) continue;
    const k = schluessel(p(o));
    const rang = RANG[o.zone] ?? 3;
    if (!zellen.has(k) || zellen.get(k) > rang) zellen.set(k, rang);
  }
  const unter = (kiste) => [...zellen.keys()].filter((k) => {
    const [x, y] = mitte(k);
    return x + 3 > kiste.x1 && x - 3 < kiste.x2 && y + 3 > kiste.y1 && y - 3 < kiste.y2;
  });
  const nurBreit = new Map(); // Zellen, die nur unter der mobilen Weilburg-Schrift liegen
  const schrift = []; // Kisten der Beschriftungen und der Sitzmarke: Führungslinien der Namen kreuzen sie nicht
  const bel = belegung(B, H);
  // Schriftgrößen der Kisten: mobil (gebiet.css) ist die Schrift eine Stufe größer – geschätzt wird mit der größeren
  let sitzSvg; let ringe = []; let ringText = ''; const luecken = []; let peilung = null;
  if (!fern) {
    // die Sitzmarke bleibt frei
    for (const k of [...zellen.keys()]) { const [x, y] = mitte(k); if (Math.hypot(x - sx, y - sy) < 12) zellen.delete(k); }
    bel.kiste({ x1: sx - 12, y1: sy - 12, x2: sx + 12, y2: sy + 12 });
    // Ringe: nur die, von denen mindestens ein Viertel im Ausschnitt liegt (kein Bogenrest in einer Ecke) und die
    // nicht zu klein sind; eingetragen vor jeder Beschriftung
    const imAusschnitt = (rr) => Array.from({ length: 72 }, (_, i) => [sx + rr * Math.cos(i * Math.PI / 36), sy + rr * Math.sin(i * Math.PI / 36)])
      .filter(([x, y]) => x >= 0 && x <= B && y >= 0 && y <= H).length / 72;
    ringe = ringeKm.map((km) => ({ km, rr: km * jeKm })).filter(({ rr }) => rr >= 24 && imAusschnitt(rr) >= 0.25);
    for (const { rr } of ringe) bel.ring(sx, sy, rr);
    // Weilburg: die Stelle mit den wenigsten Rasterpunkten darunter, zuerst ohne Ring zu kreuzen
    const kandidaten = umPunkt(sx, sy, 'Weilburg', 24, 0.64, 16, ['rechts', 'oben', 'links', 'unten']).filter((c) => bel.innen(c.kiste));
    const wenigste = (liste) => liste.map((c, i) => ({ c, n: unter(c.kiste).length, i })).sort((a, c) => a.n - c.n || a.i - c.i)[0]?.c;
    const sitzL = wenigste(kandidaten.filter((c) => bel.frei(c.kiste)))
      || wenigste(kandidaten.filter((c) => bel.frei(c.kiste, { mitRingen: false })))
      || kandidaten[0] || umPunkt(sx, sy, 'Weilburg', 24, 0.64, 16)[0];
    bel.kiste(sitzL.kiste); schrift.push(sitzL.kiste, { x1: sx - 12, y1: sy - 12, x2: sx + 12, y2: sy + 12 });
    // Aussparung: Breit steht der Name eine Stufe kleiner (18 statt 24 Einheiten, gebiet.css). Punkte nur unter der
    // breiten Schrift entfallen ganz; die unter der größeren mobilen Schrift zeigt erst ab 48em ein eigener Pfad.
    const kisteBreit = textKiste(sitzL.x, sitzL.y, sitzL.anker, 'Weilburg', SCHRIFT.l, 0.62);
    const breit = new Set(unter(kisteBreit));
    for (const k of unter(sitzL.kiste)) {
      if (!breit.has(k)) nurBreit.set(k, zellen.get(k));
      zellen.delete(k);
    }
    // Kreuzt ein Ring den Namen (kleiner Ring, breiter Name), setzt der Ring dort aus (ringSvg)
    luecken.push(sitzL.kiste);
    sitzSvg = `<circle class="gk-sitz-ring" cx="${sx}" cy="${sy}" r="10"/><circle class="gk-sitz-punkt" cx="${sx}" cy="${sy}" r="6"/>${text('gk-sitz-name', sitzL, 'Weilburg')}`;
  }
  for (const k of zellen.keys()) { const [x, y] = mitte(k); bel.kiste({ x1: x - 3, y1: y - 3, x2: x + 3, y2: y + 3 }); }
  if (!fern) {
    // Ringbeschriftung außen an den Ring gelehnt, zuerst oben, dann schräg und seitlich, zuletzt innen; ohne freie
    // Stelle entfällt sie (die Legende nennt die Ringe)
    const WINKEL = [-90, 90, -60, -120, 60, 120, -30, -150, 30, 150, 0, 180];
    ringText = ringe.map(({ km, rr }) => {
      const inhalt = `${km} km`; const g = SCHRIFT.l; const w = inhalt.length * g * 0.6;
      const kand = [1, -1].flatMap((seite) => WINKEL.map((grad) => {
        const [c, s] = [Math.cos((grad * Math.PI) / 180), Math.sin((grad * Math.PI) / 180)];
        const d = rr + seite * (5 + Math.abs(c) * (w / 2 + 2) + Math.abs(s) * g * 0.55);
        const [x, y] = [sx + c * d, sy + s * d + g * 0.27];
        return { x, y, anker: 'middle', kiste: textKiste(x, y, 'middle', inhalt, g, 0.6) };
      }));
      const wahl = setzen(bel, kand);
      if (wahl) schrift.push(wahl.kiste);
      return wahl ? text('gk-ring-text', wahl, inhalt) : '';
    }).join('');
  } else {
    // Peilung vom Rand des Gebiets zur Blattkante in Richtung Weilburg; die Beschriftung steht neben der Linie im
    // freien Vorlauf, weder auf der Linie noch auf den Punkten
    const pts = orte.map(p);
    const cx = pts.reduce((a, q) => a + q[0], 0) / pts.length; const cy = pts.reduce((a, q) => a + q[1], 0) / pts.length;
    const l = Math.hypot(sx - cx, sy - cy) || 1; const [dx, dy] = [(sx - cx) / l, (sy - cy) / l];
    const bisKante = Math.min(dx > 0 ? (B - cx) / dx : dx < 0 ? -cx / dx : Infinity, dy > 0 ? (H - cy) / dy : dy < 0 ? -cy / dy : Infinity);
    const radius = Math.max(...pts.map(([x, y]) => (x - cx) * dx + (y - cy) * dy));
    const start = Math.min(radius + 10, bisKante - 40);
    const [ax, ay] = [cx + dx * start, cy + dy * start];
    const [ex, ey] = [cx + dx * (bisKante + 20), cy + dy * (bisKante + 20)];
    peilung = [ax, ay, ex, ey];
    bel.strecke(peilung);
    const kms = orte.map((o) => o.km);
    const kmText = Math.min(...kms) === Math.max(...kms) ? `${kms[0]} km` : `${Math.min(...kms)}–${Math.max(...kms)} km`;
    // Beschriftung zweizeilig an der Kante, an der die Peilung das Blatt verlässt: alle Stellen entlang beider Kanten
    // der nächsten Ecke, sortiert nach dem Abstand zum Austrittspunkt – so steht „Weilburg“ dort, wo die Linie
    // hinausläuft, auch wenn sie eine Ecke trifft. Maße mit der mobilen Größe geschätzt (gebiet.css:
    // --svg-text-gross 24, Zeilenabstand 26 Einheiten).
    const [kx, ky] = [cx + dx * bisKante, cy + dy * bisKante];
    const breite = Math.max('Weilburg'.length * 24 * 0.64, kmText.length * 24 * 0.6); const hoehe = 24 * 0.78 + 26 + 24 * 0.24;
    const oben = ky < H / 2; const links = kx < B / 2;
    const y1Kante = oben ? 8 : H - 8 - hoehe; const xKante = links ? 8 : B - 8;
    const schritte = Array.from({ length: 24 }, (_, i) => i * 8);
    const kandidaten = [
      ...schritte.flatMap((w) => [[kx - w, 'end'], [kx + w, 'start']]).map(([x, anker]) => ({ x, anker, y1: y1Kante })),
      ...schritte.flatMap((w) => [ky - w - hoehe, ky + w]).map((y1) => ({ x: xKante, anker: links ? 'start' : 'end', y1 })),
    ].map(({ x, anker, y1 }) => ({ x, y: y1 + 24 * 0.78, anker, kiste: { x1: anker === 'start' ? x : x - breite, y1, x2: anker === 'start' ? x + breite : x, y2: y1 + hoehe } }))
      .map((c) => ({ ...c, d: Math.hypot(Math.max(c.kiste.x1 - kx, 0, kx - c.kiste.x2), Math.max(c.kiste.y1 - ky, 0, ky - c.kiste.y2)) }))
      .sort((a, c) => a.d - c.d);
    const sitzL = setzen(bel, kandidaten, { pflicht: true });
    schrift.push(sitzL.kiste);
    const anker = sitzL.anker === 'start' ? '' : ` text-anchor="${sitzL.anker}"`;
    sitzSvg = `<path class="lk-linie" d="M${r(ax)} ${r(ay)}L${r(ex)} ${r(ey)}"/><text class="gk-sitz-name" x="${r(sitzL.x)}" y="${r(sitzL.y)}"${anker}>Weilburg<tspan class="lk-km" x="${r(sitzL.x)}" dy="26">${kmText}</tspan></text>`;
  }
  const zonen = ['A', 'B', 'C', 'D'].filter((_, i) => [...zellen.values(), ...nurBreit.values()].includes(i));
  const pfade = (m, zusatz) => {
    const ebenen = [[], [], [], []];
    for (const [k, rang] of [...m.entries()].sort((a, c) => (a[0] < c[0] ? -1 : 1))) {
      const [x, y] = mitte(k);
      ebenen[rang].push(`M${x} ${y}h0`);
    }
    return ebenen.map((d, i) => (d.length ? `<path class="gk-raster gk-zone-${'abcd'[i]}${zusatz}" d="${d.join('')}"/>` : '')).join('');
  };
  // Rasterpunkte für die Führungslinien: welche liegen näher als rr an (qx, qy), welche gehören zum Kerngebiet
  const raster = {
    schluessel: (x, y) => schluessel([x, y]),
    nahe(qx, qy, rr) {
      const aus = [];
      for (let i = Math.floor((qx - rr) / ZELLE); i <= Math.ceil((qx + rr) / ZELLE); i++) {
        for (let j = Math.floor((qy - rr) / ZELLE); j <= Math.ceil((qy + rr) / ZELLE); j++) {
          const k = `${i},${j}`;
          if ((zellen.has(k) || nurBreit.has(k)) && Math.hypot(i * ZELLE - qx, j * ZELLE - qy) < rr) aus.push(k);
        }
      }
      return aus;
    },
    kern: (k) => zellen.get(k) === 0 || nurBreit.get(k) === 0,
  };
  // Die größten Orte des Gebiets, am Punkt ihrer Rasterzelle und nur auf freier Fläche (weder auf Punkten noch auf
  // Ringen); der Sitz trägt schon seinen Namen. Die ersten zwei reichen mit ihrer Linie weiter (96 statt 64
  // Einheiten), ab dem dritten nur breit (data-rang="2", gebiet.css). Unter einer Führungslinie entfallen die Punkte.
  const namen = []; const fuehrungen = [];
  // Ohne Einwohnerzahl in den Daten (Stadtteile von Oberhausen, Pirmasens) stehen die Orte nach dem Alphabet
  const nennbar = orte.filter((x) => x.slug !== sitz.slug && (x.name.length <= 24 || zweiZeilen(x.name)?.every((z) => z.length <= 24)));
  const mitZahl = nennbar.filter((x) => x.pop > 0).sort((a, c) => c.pop - a.pop);
  const kandidaten = mitZahl.length ? mitZahl : nennbar.sort((a, c) => a.name.localeCompare(c.name, 'de'));
  for (const o of kandidaten.slice(0, namenMax * 10)) {
    if (namen.length >= namenMax) break;
    const k = schluessel(p(o));
    if (!zellen.has(k)) continue;
    const rang = namen.length < 2 ? 1 : 2;
    const lage = {
      raster, schrift, linien: [...(peilung ? [peilung] : []), ...fuehrungen.map((f) => f.punkte)], reichweite: rang === 1 ? 96 : 64,
    };
    // Ein Hauptname, der zwischen den Ringen keinen Platz findet (Marburg, Bad Homburg), darf einen Ring kreuzen;
    // der Ring setzt dort aus wie bei „Weilburg“
    let wahl = namensStelle(bel, mitte(k), o.name, rang === 1 ? SCHRIFT.l : SCHRIFT.s, lage);
    if (!wahl && rang === 1 && ringe.length) {
      wahl = namensStelle(bel, mitte(k), o.name, SCHRIFT.l, { ...lage, ueberRinge: true });
      if (wahl) luecken.push(wahl.kiste);
    }
    if (!wahl) continue;
    bel.kiste(wahl.kiste); schrift.push(wahl.kiste);
    const zusatz = rang === 2 ? ' data-rang="2"' : '';
    namen.push(text('gk-name', wahl, o.name, zusatz));
    for (const a of wahl.aus) { zellen.delete(a); nurBreit.delete(a); }
    if (wahl.linie) {
      for (let i = 2; i < wahl.linie.length; i += 2) bel.strecke(wahl.linie.slice(i - 2, i + 2));
      fuehrungen.push({ punkte: wahl.linie, svg: `<path class="gl-fuehrung"${zusatz} d="${pfadD(wahl.linie)}"/>` });
    }
  }
  const rasterSvg = pfade(zellen, '') + pfade(nurBreit, ' gl-nur-breit');
  // Ferne Gebiete haben keine Zonenringe als Maß: ein Maßstab wie auf der Lagekarte, wo eine Ecke frei ist
  const mass = fern ? massstab(bel, jeKm, B, H, [...zellen.keys()].map(mitte)) : '';
  const ringSvg = ringe.map(({ rr }) => ring(sx, sy, r(rr), luecken)).join('');
  const svg = roh(`<svg class="gebietslage" viewBox="0 0 ${B} ${H}" role="img" aria-labelledby="${praefix}-titel">
<title id="${praefix}-titel">${esc(titel)}</title>
<g class="gk-ringe">${ringSvg}</g><g class="gk-punkte">${rasterSvg}</g>
<g class="gk-namen">${fuehrungen.map((f) => f.svg).join('')}${ringText}${namen.join('')}${mass}</g>
<g class="gk-sitz">${sitzSvg}</g>
</svg>`);
  return { svg, zonen, ringe: ringe.map((x) => x.km), fern };
}
