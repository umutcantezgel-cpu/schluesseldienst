// Geometrie-Linter für Icons (KERN K-008): src/assets/icons/*.svg auf Datei-Form, Elemente, Bezier-Freiheit,
// aktive Fläche 2–22, Winkel 0/45/90, Bogenradien, Raster 0,25 und Dateigröße. Geprüft wird die Quelle, nicht dist.
// Schnittstelle: name, pruefe(ctx) (ganzer Ordner), pruefeIcon(name, svgText) (ein Icon, für Tests).
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { VERTRAG } from '../../src/konfig/icon-vertrag.mjs';

export const name = 'icons';

const KOPF = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">';
const ELEMENTE = new Set(['path', 'circle', 'rect', 'line', 'polyline']);
const GEOMETRIE = new Set(['d', 'cx', 'cy', 'r', 'x', 'y', 'width', 'height', 'rx', 'ry', 'x1', 'y1', 'x2', 'y2', 'points']);
const FLAECHE_MIN = 2;
const FLAECHE_MAX = 22;
const FLAECHE_TOL = 0.01;
const WINKEL_TOL = 0.01;
const BOGEN_PUNKTE = 32;
const BYTES_MAX = 1024;
const BEFEHL = 'MmLlHhVvAaCcSsQqTtZz';
// Anzahl Argumente je Befehl (Gruppe); Z hat keine
const GRUPPE = { M: 2, L: 2, T: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, A: 7, Z: 0 };

const r4 = (v) => Math.round(v * 1e6) / 1e6;
const istViertel = (v) => Math.abs(v - Math.round(v * 4) / 4) < 1e-6; // Vielfaches von 0,25
const istHalb = (v) => Math.abs(v - Math.round(v * 2) / 2) < 1e-6; // Vielfaches von 0,5

/** Attribute eines Start-Tags als Objekt. */
function attribute(tag) {
  const out = {};
  for (const m of tag.matchAll(/([A-Za-z_:][-A-Za-z0-9_:.]*)\s*=\s*"([^"]*)"/g)) out[m[1]] = m[2];
  return out;
}

/**
 * Pfaddaten in Befehle zerlegen: [{ cmd, args }] mit flachen Argumentlisten.
 * Arc-Flags (4. und 5. Argument eines A) werden als einzelne Ziffern gelesen, wie SVG es verlangt.
 * Gibt null zurück, wenn der Pfad nicht lesbar ist.
 */
export function befehle(d) {
  const out = [];
  const zahl = /[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/y;
  const ziffer = /[01]/y;
  let p = 0;
  const trenner = () => { while (p < d.length && /[\s,]/.test(d[p])) p++; };
  for (;;) {
    trenner();
    if (p >= d.length) break;
    const c = d[p];
    if (BEFEHL.includes(c)) { out.push({ cmd: c, args: [] }); p++; continue; }
    const letzter = out[out.length - 1];
    if (!letzter) return null;
    const C = letzter.cmd.toUpperCase();
    const n = GRUPPE[C];
    if (!n) return null; // Argumente nach Z
    const pos = letzter.args.length % n;
    const re = C === 'A' && (pos === 3 || pos === 4) ? ziffer : zahl;
    re.lastIndex = p;
    const m = re.exec(d);
    if (!m) return null;
    letzter.args.push(Number(m[0]));
    p = re.lastIndex;
  }
  return out;
}

/** Bogen (SVG 1.1 Anhang F.6.5, Mittelpunktsdarstellung) → Punkte entlang des Bogens (ohne Startpunkt). */
export function bogenPunkte(x1, y1, rx, ry, phiGrad, fA, fS, x2, y2, n = BOGEN_PUNKTE) {
  rx = Math.abs(rx); ry = Math.abs(ry);
  if (rx === 0 || ry === 0 || (x1 === x2 && y1 === y2)) return [[x2, y2]];
  const phi = (phiGrad * Math.PI) / 180;
  const c = Math.cos(phi); const s = Math.sin(phi);
  const dx = (x1 - x2) / 2; const dy = (y1 - y2) / 2;
  const x1p = c * dx + s * dy; const y1p = -s * dx + c * dy;
  const lam = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lam > 1) { rx *= Math.sqrt(lam); ry *= Math.sqrt(lam); }
  const zaehler = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const nenner = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  let faktor = nenner === 0 ? 0 : Math.sqrt(Math.max(0, zaehler / nenner));
  if (fA === fS) faktor = -faktor;
  const cxp = (faktor * rx * y1p) / ry; const cyp = (-faktor * ry * x1p) / rx;
  const cx = c * cxp - s * cyp + (x1 + x2) / 2; const cy = s * cxp + c * cyp + (y1 + y2) / 2;
  const winkel = (ux, uy, vx, vy) => {
    const vz = ux * vy - uy * vx < 0 ? -1 : 1;
    const skalar = ux * vx + uy * vy;
    const laenge = Math.hypot(ux, uy) * Math.hypot(vx, vy);
    return vz * Math.acos(Math.max(-1, Math.min(1, skalar / laenge)));
  };
  const th1 = winkel(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
  let dth = winkel((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry);
  if (!fS && dth > 0) dth -= 2 * Math.PI;
  if (fS && dth < 0) dth += 2 * Math.PI;
  const punkte = [];
  for (let i = 1; i <= n; i++) {
    const t = th1 + (dth * i) / n;
    punkte.push([c * rx * Math.cos(t) - s * ry * Math.sin(t) + cx, s * rx * Math.cos(t) + c * ry * Math.sin(t) + cy]);
  }
  return punkte;
}

/**
 * Pfad auswerten. Ergebnis (alle Koordinaten absolut):
 *  stuetz: Stützkoordinaten (Endpunkte, Bezier-Kontrollpunkte) für die Rasterprüfung
 *  punkte: alle Punkte für die Flächenprüfung (Stützpunkte plus 32 Punkte je Bogen)
 *  segmente: gerade Segmente für die Winkelprüfung
 *  bezier: gefundene Bezier-Befehle; bogen: { rx, ry } je Pfadbogen; lesbar: false bei kaputtem Pfad
 */
function pfadAuswerten(d) {
  const ergebnis = { stuetz: [], punkte: [], segmente: [], bezier: [], bogen: [], lesbar: true };
  const folgen = befehle(d);
  if (!folgen) { ergebnis.lesbar = false; return ergebnis; }
  let x = 0; let y = 0; let sx = 0; let sy = 0;
  for (const { cmd, args } of folgen) {
    const rel = cmd !== cmd.toUpperCase();
    const C = cmd.toUpperCase();
    if (C === 'Z') {
      ergebnis.segmente.push([x, y, sx, sy]); x = sx; y = sy;
      continue;
    }
    const n = GRUPPE[C];
    if (args.length % n !== 0) { ergebnis.lesbar = false; return ergebnis; }
    for (let i = 0; i < args.length; i += n) {
      const g = args.slice(i, i + n);
      const ab = (dx, dy) => (rel ? [x + dx, y + dy] : [dx, dy]);
      // Erste Gruppe nach M ist der Startpunkt; weitere Paare nach M sind Linien
      if (C === 'M' && i === 0) {
        [x, y] = ab(g[0], g[1]); sx = x; sy = y;
        ergebnis.stuetz.push([x, y]); ergebnis.punkte.push([x, y]);
      } else if (C === 'M' || C === 'L') {
        const [nx, ny] = ab(g[0], g[1]);
        ergebnis.segmente.push([x, y, nx, ny]);
        x = nx; y = ny;
        ergebnis.stuetz.push([x, y]); ergebnis.punkte.push([x, y]);
      } else if (C === 'H') {
        const nx = rel ? x + g[0] : g[0];
        ergebnis.segmente.push([x, y, nx, y]); x = nx;
        ergebnis.stuetz.push([x, y]); ergebnis.punkte.push([x, y]);
      } else if (C === 'V') {
        const ny = rel ? y + g[0] : g[0];
        ergebnis.segmente.push([x, y, x, ny]); y = ny;
        ergebnis.stuetz.push([x, y]); ergebnis.punkte.push([x, y]);
      } else if (C === 'A') {
        const [rx, ry, phi, fA, fS] = g;
        const [nx, ny] = ab(g[5], g[6]);
        ergebnis.bogen.push({ rx, ry });
        for (const p of bogenPunkte(x, y, rx, ry, phi, fA, fS, nx, ny)) ergebnis.punkte.push(p);
        x = nx; y = ny;
        ergebnis.stuetz.push([x, y]); ergebnis.punkte.push([x, y]);
      } else if (C === 'C' || C === 'S' || C === 'Q' || C === 'T') {
        ergebnis.bezier.push(C);
        // alle Koordinatenpaare der Gruppe (Kontrollpunkte und Ende) konservativ prüfen
        const paare = [];
        for (let k = 0; k + 1 < g.length; k += 2) paare.push(ab(g[k], g[k + 1]));
        for (const p of paare) { ergebnis.punkte.push(p); ergebnis.stuetz.push(p); }
        [x, y] = paare[paare.length - 1];
      }
    }
  }
  return ergebnis;
}

/** Eine Form → { stuetz, punkte, segmente, bezier, bogen, lesbar } (absolut). */
function formAuswerten(el, a) {
  const leer = { stuetz: [], punkte: [], segmente: [], bezier: [], bogen: [], lesbar: true };
  if (el === 'path') return pfadAuswerten(a.d ?? '');
  if (el === 'circle') {
    const cx = Number(a.cx); const cy = Number(a.cy); const r = Number(a.r);
    const punkte = [];
    for (let i = 0; i < BOGEN_PUNKTE; i++) {
      const t = (2 * Math.PI * i) / BOGEN_PUNKTE;
      punkte.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]);
    }
    return { ...leer, stuetz: [[cx, cy]], punkte };
  }
  if (el === 'rect') {
    const x = Number(a.x ?? 0); const y = Number(a.y ?? 0);
    const w = Number(a.width ?? 0); const h = Number(a.height ?? 0);
    const ecken = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
    return { ...leer, stuetz: ecken, punkte: ecken, segmente: [[x, y, x + w, y], [x + w, y, x + w, y + h], [x + w, y + h, x, y + h], [x, y + h, x, y]] };
  }
  if (el === 'line') {
    const p = [[Number(a.x1), Number(a.y1)], [Number(a.x2), Number(a.y2)]];
    return { ...leer, stuetz: p, punkte: p, segmente: [[...p[0], ...p[1]]] };
  }
  if (el === 'polyline') {
    const z = (a.points ?? '').trim().split(/[\s,]+/).filter(Boolean).map(Number);
    const p = [];
    for (let i = 0; i + 1 < z.length; i += 2) p.push([z[i], z[i + 1]]);
    const segmente = [];
    for (let i = 0; i + 1 < p.length; i++) segmente.push([...p[i], ...p[i + 1]]);
    return { ...leer, stuetz: p, punkte: p, segmente, lesbar: z.length % 2 === 0 };
  }
  return leer;
}

/** Winkel eines geraden Segments: 0° und 90° exakt, 45° mit Toleranz 0,01 auf |dx|−|dy|. */
export function winkelOk(x1, y1, x2, y2) {
  const dx = Math.abs(x2 - x1); const dy = Math.abs(y2 - y1);
  if (dx < 1e-9 || dy < 1e-9) return true;
  return Math.abs(dx - dy) <= WINKEL_TOL;
}

/** Alle Befunde für ein Icon (ohne info). */
export function pruefeIcon(iconName, svgText) {
  const befunde = [];
  const datei = `${iconName}.svg`;
  const f = (regel, schwere, meldung) => befunde.push({ regel: `icons/${regel}`, schwere, datei, meldung });
  const svg = String(svgText ?? '');
  const kopfTags = svg.match(/<svg\b[^>]*>/g) || [];
  const trimmt = svg.trim();

  // datei: genau ein Kopf-Tag ohne weitere Attribute, eine Zeile, Name im Vertrag
  const kopfOk = kopfTags.length === 1 && kopfTags[0] === KOPF && trimmt.startsWith(KOPF) && /<\/svg>$/.test(trimmt);
  if (!kopfOk) f('datei', 'fehler', `genau ein <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> ohne weitere Attribute erwartet`);
  if (trimmt.includes('\n')) f('datei', 'fehler', 'Datei muss genau eine Zeile haben');
  if (!VERTRAG.includes(iconName)) f('datei', 'fehler', `Name „${iconName}“ steht nicht im Icon-Vertrag (src/konfig/icon-vertrag.mjs)`);

  // groesse
  const bytes = Buffer.byteLength(svg, 'utf8');
  if (bytes > BYTES_MAX) f('groesse', 'warnung', `${bytes} Byte, Grenze ${BYTES_MAX}`);

  const innen = svg.replace(/^[\s\S]*?<svg\b[^>]*>/, '').replace(/<\/svg>\s*$/, '');

  // Textinhalt außerhalb der Elemente ist unzulässig
  const text = innen.replace(/<[^>]*>/g, '').trim();
  if (text) f('element', 'fehler', `Textinhalt „${text.slice(0, 40)}“ nicht erlaubt`);

  // element: erlaubte Elemente, nur Geometrie-Attribute, fill nur auf Punkt-Kreis
  const formen = [];
  const elementRe = /<(\/?)([A-Za-z][\w-]*)\b([^>]*)>/g;
  for (const m of innen.matchAll(elementRe)) {
    if (m[1] === '/') continue;
    const el = m[2];
    const a = attribute(m[0]);
    if (!ELEMENTE.has(el)) { f('element', 'fehler', `Element <${el}> nicht erlaubt (nur path/circle/rect/line/polyline)`); continue; }
    for (const k of Object.keys(a)) {
      if (k === 'fill') {
        if (!(el === 'circle' && a.fill === 'currentColor' && Number(a.r) <= 1)) {
          f('element', 'fehler', `<${el}> fill="${a.fill}" nicht erlaubt (nur circle mit r ≤ 1 und currentColor)`);
        }
      } else if (!GEOMETRIE.has(k)) {
        f('element', 'fehler', `<${el}> Attribut „${k}“ nicht erlaubt`);
      }
    }
    formen.push({ el, a });
  }

  // Auswertung je Form
  const alle = { stuetz: [], punkte: [], segmente: [], bezier: [], bogen: [] };
  for (const { el, a } of formen) {
    const r = formAuswerten(el, a);
    if (!r.lesbar) f('element', 'fehler', `<${el}> nicht lesbar (Pfaddaten unvollständig oder fehlerhaft)`);
    alle.stuetz.push(...r.stuetz); alle.punkte.push(...r.punkte);
    alle.segmente.push(...r.segmente); alle.bezier.push(...r.bezier); alle.bogen.push(...r.bogen);
    if (el === 'circle') {
      const rr = Number(a.r);
      if (!istViertel(rr)) f('bogen', 'fehler', `Kreis r=${a.r} kein Vielfaches von 0,25`);
    }
    if (el === 'rect' && (a.rx !== undefined || a.ry !== undefined)) {
      const rx = Number(a.rx ?? a.ry); const ry = Number(a.ry ?? a.rx);
      if (rx !== ry) f('bogen', 'fehler', `rect rx=${rx} ≠ ry=${ry}`);
      if (!istHalb(rx)) f('bogen', 'fehler', `rect-Radius ${rx} kein Vielfaches von 0,5`);
    }
  }

  // bogen: Pfadbögen rx = ry und Radius Vielfaches von 0,5
  for (const { rx, ry } of alle.bogen) {
    if (rx !== ry) f('bogen', 'fehler', `Bogen rx=${rx} ≠ ry=${ry}`);
    if (!istHalb(rx)) f('bogen', 'fehler', `Bogenradius ${rx} kein Vielfaches von 0,5`);
  }

  // bezier: C/S/Q/T sind verboten
  if (alle.bezier.length) f('bezier', 'fehler', `Béziers nicht erlaubt: ${[...new Set(alle.bezier)].join(', ')}`);

  // flaeche: alle Punkte in [2, 22] (Toleranz 0,01)
  const aus = alle.punkte.filter(([px, py]) => px < FLAECHE_MIN - FLAECHE_TOL || px > FLAECHE_MAX + FLAECHE_TOL
    || py < FLAECHE_MIN - FLAECHE_TOL || py > FLAECHE_MAX + FLAECHE_TOL);
  if (aus.length) {
    const [px, py] = aus[0];
    f('flaeche', 'fehler', `${aus.length} Punkt(e) außerhalb [2, 22], z. B. (${r4(px)}, ${r4(py)})`);
  }

  // winkel: gerade Segmente nur 0°, 45°, 90°
  for (const [x1, y1, x2, y2] of alle.segmente) {
    if (!winkelOk(x1, y1, x2, y2)) {
      const grad = Math.round((Math.atan2(Math.abs(y2 - y1), Math.abs(x2 - x1)) * 180 / Math.PI) * 10) / 10;
      f('winkel', 'fehler', `Segment (${r4(x1)}, ${r4(y1)}) → (${r4(x2)}, ${r4(y2)}) hat ca. ${grad}°`);
    }
  }

  // raster: Stützkoordinaten auf Vielfache von 0,25 (Warnung)
  const krumm = alle.stuetz.filter(([px, py]) => !istViertel(px) || !istViertel(py));
  if (krumm.length) {
    const [px, py] = krumm[0];
    f('raster', 'warnung', `${krumm.length} Stützkoordinate(n) nicht auf Vielfachen von 0,25, z. B. ${r4(px)}/${r4(py)}`);
  }

  return befunde;
}

/** Prüft src/assets/icons (nicht dist) und den Icon-Vertrag. */
export async function pruefe(ctx) {
  const ordner = join(ctx.wurzel, 'src/assets/icons');
  const dateien = (await readdir(ordner)).filter((n) => n.endsWith('.svg')).sort();
  const namen = dateien.map((n) => n.replace(/\.svg$/, ''));
  const befunde = [];
  for (const n of namen) {
    const svg = await readFile(join(ordner, `${n}.svg`), 'utf8');
    befunde.push(...pruefeIcon(n, svg));
  }
  const fehlend = VERTRAG.filter((n) => !namen.includes(n));
  if (fehlend.length) {
    befunde.push({
      regel: 'icons/vollstaendig',
      schwere: ctx.modus === 'release' ? 'fehler' : 'warnung',
      datei: 'src/konfig/icon-vertrag.mjs',
      meldung: `${fehlend.length} Vertragsname(n) ohne Datei: ${fehlend.join(', ')}`,
    });
  }
  befunde.push({ regel: 'icons/info', schwere: 'info', meldung: `${namen.length} Icons geprüft` });
  return befunde;
}
