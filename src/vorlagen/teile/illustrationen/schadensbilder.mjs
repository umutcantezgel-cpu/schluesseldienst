// I-13 Schadensbilder (Ratgeber „Schäden durch falsche Türöffnung“, KERN K-008): drei Schnitt-Ansichten einer
// Türkante mit Schloss nebeneinander, je Feld eine Spur in Kupfer – gewaltsame Öffnung, Selbstversuch, Einbruch.
// Ruhig und schematisch: keine Personen, keine Werkzeuge, keine Schuldzuweisung. Raster 8, Strich 2 über CSS,
// Schnittflächen 45°-Schraffur (Abstand 4); die Spur ist die einzige Kupferstelle je Feld. Dekorativ
// (aria-hidden): der Text des Artikels trägt die Aussage, die Unterzeilen benennen nur die Felder.
import { roh } from '../../../../bau/lib/html.mjs';
import { illRahmen } from './_svg.mjs';

const FELD = 176;                 // Breite je Feld (Raster 8)
const VIEWBOX = '0 0 528 232';    // drei Felder à 176 nebeneinander

// Bauteile einer Türkante in Feldkoordinaten: Beschlag außen links, Blatt mit Zylinder und Schloss, Zarge rechts,
// Falle im Spalt, Schließblech in der Zarge.
const beschlag = () => '<rect class="ill-blatt" x="16" y="88" width="8" height="48" rx="2"/>';
const zylinder = () => '<rect class="ill-blatt" x="24" y="96" width="48" height="32" rx="2"/>';
const schloss = () => '<rect class="ill-flaeche" x="72" y="88" width="32" height="48" rx="2"/>';
const falle = () => '<path class="ill-blatt" d="M104 104H120L128 112L120 120H104Z"/>';
const blech = (x = 128) => `<rect class="ill-blatt" x="${x}" y="88" width="16" height="56"/>`;
const blatt = (sf) => `<path class="ill-schnitt" fill="${sf}" d="M24 24H104V200H24Z"/>`;
const zarge = (sf, d = 'M128 24H160V200H128Z') => `<path class="ill-schnitt" fill="${sf}" d="${d}"/>`;
const grund = (sf) => [blatt(sf), beschlag(), zylinder(), schloss(), falle(), zarge(sf), blech()].join('');

// Feld 1: Zarge an der Schließblechseite ausgerissen – das Stück samt Blech ist nach außen versetzt, seine Schraffur
// sitzt woanders (zweites Muster); die Kupferlinie markiert den Riss.
const gewaltsam = (sf, sv) => [
  blatt(sf), beschlag(), zylinder(), schloss(), falle(),
  zarge(sf, 'M128 24H160V80H128Z'),
  zarge(sf, 'M128 152H160V200H128Z'),
  zarge(sv, 'M136 80H168V152H136Z'),
  blech(136),
  '<path class="sb-spur" d="M136 80H168V152H136Z"/>',
].join('');

// Feld 2: Selbstversuch – Kratzer am Zylinderprofil (kurze Striche im 45°-Raster) und am Beschlag.
const selbstversuch = (sf) => [
  grund(sf),
  '<path class="sb-spur" d="M16 104L24 96M16 120L24 112M40 104L48 96M56 104L64 96M48 112L56 104"/>',
].join('');

// Feld 3: Einbruch – Hebelabdruck mit zwei parallelen Kerben an der Türkante (oberhalb des Schlosses) und am Blech
// (die Kerben am Blech liegen symmetrisch zur Falle und berühren sie nicht).
const einbruch = (sf) => [
  grund(sf),
  '<path class="sb-spur" d="M104 40L96 48L104 56M104 64L96 72L104 80M128 88L136 96L128 104M128 120L136 128L128 136"/>',
].join('');

const unterzeile = (text) => `<text class="ill-text" x="${FELD / 2}" y="224" text-anchor="middle">${text}</text>`;
const gruppe = (i, inhalt, text) => `<g class="sb-feld" transform="translate(${i * FELD} 0)">${inhalt}${unterzeile(text)}</g>`;

/** I-13 Schadensbilder: drei Felder (Gewaltsam geöffnet · Selbstversuch · Einbruchspuren), dekorativ. */
export function schadensbilder({ praefix = 'sb', klasse = '' } = {}) {
  const sf = `url(#${praefix}-schraffur)`;
  const sv = `url(#${praefix}-schraffur-v)`;
  // Zweites Schraffur-Muster, um 2 Einheiten versetzt (halber Abstand): macht die verschobene Zarge lesbar.
  const muster = `<defs><pattern id="${praefix}-schraffur-v" x="2" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path class="ill-schraffur-linie" d="M0 0V4"/></pattern></defs>`;
  const inhalt = `${muster}
${gruppe(0, gewaltsam(sf, sv), 'Gewaltsam geöffnet')}
${gruppe(1, selbstversuch(sf), 'Selbstversuch')}
${gruppe(2, einbruch(sf), 'Einbruchspuren')}`;
  return roh(illRahmen({ klasse: `sb-bild ${klasse}`.trim(), viewBox: VIEWBOX, praefix, zustand: null, inhalt }));
}
