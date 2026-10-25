// Budget-Prüfer (KERN K-011): Größen aus dem Ausgabeordner ctx.dist. CSS und JS gzip Stufe 9;
// Schriften, Seiten und Datendateien nach den Grenzen des Auftrags E2-PRUEF-06.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

export const name = 'budgets';

const GRENZE = {
  cssGz: 14336,
  cssDruckGz: 3072,
  jsGz: 16384,
  woff2Summe: 76800,
  ortRoh: 30720,
  sonstRoh: 81920,
  ordnerOrteGz: 81920,
  plzGz: 51200,
};
const EINZELBEFUNDE_ORT_MAX = 20;
const ORTSSEITE = /^\/schluesseldienst-[^/]+\/index\.html$/;

const gz = (buf) => gzipSync(buf, { level: 9 }).length;

function attribute(tag) {
  const werte = {};
  for (const m of tag.matchAll(/\s([a-zA-Z-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g)) {
    werte[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4];
  }
  return werte;
}

function istSchriftVorladen(tag) {
  const a = attribute(tag);
  return (a.rel ?? '').toLowerCase().split(/\s+/).includes('preload') && (a.as ?? '').toLowerCase() === 'font';
}

/** Entfernt @media-Blöcke für Druck und erzwungene Farben (mit verschachtelten Klammern) aus einem CSS-Text. */
export function ohneSonderMedien(css) {
  const muster = /@media\s*([^{]*)\{/g;
  let aus = '';
  let i = 0;
  let m;
  while ((m = muster.exec(css))) {
    if (!/\bprint\b|forced-colors/.test(m[1])) continue;
    let tiefe = 1;
    let j = muster.lastIndex;
    while (j < css.length && tiefe) { if (css[j] === '{') tiefe++; else if (css[j] === '}') tiefe--; j++; }
    aus += css.slice(i, m.index);
    i = j;
    muster.lastIndex = j;
  }
  return aus + css.slice(i);
}

export async function pruefe(ctx) {
  const befunde = [];
  const f = (regel, schwere, meldung, datei) => befunde.push(datei ? { regel, schwere, datei, meldung } : { regel, schwere, meldung });
  const lies = async (rel) => {
    try {
      return await readFile(join(ctx.dist, rel));
    } catch {
      f('budgets/fehlt', 'fehler', `Datei ${rel} fehlt im Ausgabeordner`, rel);
      return null;
    }
  };
  const messung = {};

  // Bundles: CSS und JS aus dem Build-Ergebnis
  for (const [art, bez, grenze] of [['css', 'CSS', GRENZE.cssGz], ['js', 'JS', GRENZE.jsGz]]) {
    const pfad = ctx.assets?.[art]?.pfad;
    if (!pfad) {
      f('budgets/fehlt', 'fehler', `${bez}-Bundle nicht gemeldet (ctx.assets.${art}.pfad fehlt)`);
      continue;
    }
    const buf = await lies(pfad);
    if (!buf) continue;
    messung[art] = gz(buf);
    if (messung[art] > grenze) f(`budgets/${art}`, 'fehler', `${bez} gz ${messung[art]} B > ${grenze} B`, pfad);
  }

  // Schriften: Summe aller .woff2 (Warnung) und vorgeladene Schriften je Seite (Fehler)
  let woffSumme = 0;
  for (const d of (ctx.dateien ?? []).filter((x) => x.endsWith('.woff2'))) {
    const buf = await lies(d);
    if (buf) woffSumme += buf.length;
  }
  messung.woff2 = woffSumme;
  if (woffSumme > GRENZE.woff2Summe) f('budgets/schriften-summe', 'warnung', `Schriften (.woff2) zusammen ${woffSumme} B > ${GRENZE.woff2Summe} B`);

  // Seiten: Ortsseiten und sonstige Seiten (roh), Vorladungen je Seite
  const orte = [];
  const sonstige = [];
  let vorladenMax = 0;
  // CSS je Seite: gemeinsames Bündel plus Ansichts-Stile (Summe gz); jede Datei wird einmal gemessen
  const cssGz = new Map();
  let cssSeiteMax = 0;
  const druckLinks = new Set();
  // Klassen, die nur in Ansichts-Stilen definiert sind: Klasse → Bündelpfade (Seite muss eines davon laden)
  const nurAnsicht = new Map();
  const gemeinsam = new Set();
  const klassenIn = (text) => new Set([...text.matchAll(/\.([a-z][a-z0-9-]*)/g)].map((m) => m[1]));
  // Druck- und Kontrastregeln (@media print, forced-colors) im gemeinsamen Bündel gestalten Klassen nur um; ihre
  // Bildschirm-Regeln kommen weiter aus dem Ansichts-Stil. Sie zählen deshalb nicht als gemeinsame Stile.
  if (ctx.assets?.css?.pfad) { const b = await lies(ctx.assets.css.pfad); if (b) for (const k of klassenIn(ohneSonderMedien(b.toString('utf8')))) gemeinsam.add(k); }
  for (const a of Object.values(ctx.assets?.ansichten ?? {})) {
    const b = await lies(a.pfad);
    if (!b) continue;
    for (const k of klassenIn(b.toString('utf8'))) if (!gemeinsam.has(k)) nurAnsicht.set(k, [...(nurAnsicht.get(k) || []), a.pfad]);
  }
  const stilFehlt = new Map();
  for (const s of ctx.seiten ?? []) {
    const buf = await lies(s.datei);
    if (!buf) continue;
    const html = buf.toString('utf8');
    const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0]);
    const vorladen = links.filter(istSchriftVorladen).length;
    let cssSumme = 0;
    for (const l of links) {
      const a = attribute(l);
      if (a.rel !== 'stylesheet' || !a.href?.startsWith('/assets/')) continue;
      // Druckstile (media="print") blockieren das Rendern nicht; eigenes Budget budgets/css-druck (D-CSS-02)
      if (a.media === 'print') { druckLinks.add(a.href); continue; }
      if (!cssGz.has(a.href)) { const b = await lies(a.href); cssGz.set(a.href, b ? gz(b) : 0); }
      cssSumme += cssGz.get(a.href);
    }
    cssSeiteMax = Math.max(cssSeiteMax, cssSumme);
    if (nurAnsicht.size) {
      const geladen = new Set(links.map(attribute).filter((a) => a.rel === 'stylesheet').map((a) => a.href));
      for (const m of html.matchAll(/\sclass="([^"]+)"/g)) {
        for (const k of m[1].split(/\s+/)) {
          const quellen = nurAnsicht.get(k);
          if (quellen && !quellen.some((q) => geladen.has(q))) stilFehlt.set(k, [...(stilFehlt.get(k) || []), s.datei]);
        }
      }
    }
    if (cssSumme > GRENZE.cssGz) f('budgets/css-seite', 'fehler', `CSS dieser Seite gz ${cssSumme} B > ${GRENZE.cssGz} B (gemeinsam + Ansicht)`, s.datei);
    vorladenMax = Math.max(vorladenMax, vorladen);
    if (vorladen > 1) f('budgets/schrift-vorladen', 'fehler', `${vorladen} Schriften mit rel="preload" und as="font" (erlaubt: 1)`, s.datei);
    if (ORTSSEITE.test(s.datei)) orte.push({ datei: s.datei, roh: buf.length });
    else {
      sonstige.push({ datei: s.datei, roh: buf.length });
      if (buf.length > GRENZE.sonstRoh) f('budgets/seite', 'warnung', `${buf.length} B roh > ${GRENZE.sonstRoh} B`, s.datei);
    }
  }
  messung.vorladenMax = vorladenMax;
  messung.cssSeiteMax = cssSeiteMax;
  for (const href of druckLinks) {
    const b = await lies(href);
    if (!b) continue;
    const g = gz(b);
    messung.cssDruck = Math.max(messung.cssDruck || 0, g);
    if (g > GRENZE.cssDruckGz) f('budgets/css-druck', 'fehler', `Druckstile gz ${g} B > ${GRENZE.cssDruckGz} B`, href);
  }
  for (const [k, dateien] of stilFehlt) {
    const eindeutig = [...new Set(dateien)];
    f('budgets/stil-fehlt', 'fehler', `Klasse .${k} hat Regeln nur in einem Ansichts-Stil, den ${eindeutig.length} Seite(n) nicht laden (seite.stile ergänzen oder Regel nach komponenten/ verschieben)`, eindeutig[0]);
  }

  const ueber = orte.filter((o) => o.roh > GRENZE.ortRoh);
  for (const o of ueber.slice(0, EINZELBEFUNDE_ORT_MAX)) {
    f('budgets/ortsseite', 'fehler', `${o.roh} B roh > ${GRENZE.ortRoh} B`, o.datei);
  }
  const ortSumme = orte.reduce((a, o) => a + o.roh, 0);
  if (ueber.length > 0) {
    f('budgets/ortsseite', 'fehler', `Summe: ${ueber.length} von ${orte.length} Ortsseiten über ${GRENZE.ortRoh} B; Rohgröße aller Ortsseiten ${ortSumme} B; Einzelbefunde auf ${EINZELBEFUNDE_ORT_MAX} begrenzt`);
  }
  messung.orte = { anzahl: orte.length, max: Math.max(0, ...orte.map((o) => o.roh)), summe: ortSumme };
  messung.sonstige = { anzahl: sonstige.length, max: Math.max(0, ...sonstige.map((o) => o.roh)) };

  // Datendateien unter /daten/ (gzip)
  const datenMessung = { orte: 0, plz: 0 };
  for (const [art, muster, grenze] of [['orte', /^\/daten\/orte\..*\.json$/, GRENZE.ordnerOrteGz], ['plz', /^\/daten\/plz\..*\.json$/, GRENZE.plzGz]]) {
    for (const d of (ctx.dateien ?? []).filter((x) => muster.test(x))) {
      const buf = await lies(d);
      if (!buf) continue;
      const groesse = gz(buf);
      datenMessung[art] = Math.max(datenMessung[art], groesse);
      if (groesse > grenze) f('budgets/daten', 'fehler', `${art}-Datei gz ${groesse} B > ${grenze} B`, d);
    }
  }
  messung.daten = datenMessung;

  f('budgets/messung', 'info', [
    `CSS gz gemeinsam ${messung.css ?? '–'} B, je Seite max ${cssSeiteMax} B (Grenze ${GRENZE.cssGz})`,
    `JS gz ${messung.js ?? '–'} B (Grenze ${GRENZE.jsGz})`,
    `Schriften .woff2 zusammen ${woffSumme} B (Grenze ${GRENZE.woff2Summe})`,
    `vorgeladene Schriften je Seite max ${vorladenMax} (Grenze 1)`,
    `Ortsseiten ${orte.length}, größte ${messung.orte.max} B roh (Grenze ${GRENZE.ortRoh}), Summe ${ortSumme} B`,
    `sonstige Seiten ${sonstige.length}, größte ${messung.sonstige.max} B roh (Grenze ${GRENZE.sonstRoh})`,
    `orte-Datei gz max ${datenMessung.orte} B (Grenze ${GRENZE.ordnerOrteGz})`,
    `plz-Datei gz max ${datenMessung.plz} B (Grenze ${GRENZE.plzGz})`,
  ].join(' · '));

  return befunde;
}
