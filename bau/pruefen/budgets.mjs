// Budget-Prüfer (KERN K-011): Größen aus dem Ausgabeordner ctx.dist. CSS und JS gzip Stufe 9;
// Schriften, Seiten und Datendateien nach den Grenzen des Auftrags E2-PRUEF-06.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

export const name = 'budgets';

const GRENZE = {
  cssGz: 14336,
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
  for (const s of ctx.seiten ?? []) {
    const buf = await lies(s.datei);
    if (!buf) continue;
    const vorladen = [...buf.toString('utf8').matchAll(/<link\b[^>]*>/gi)].filter((m) => istSchriftVorladen(m[0])).length;
    vorladenMax = Math.max(vorladenMax, vorladen);
    if (vorladen > 1) f('budgets/schrift-vorladen', 'fehler', `${vorladen} Schriften mit rel="preload" und as="font" (erlaubt: 1)`, s.datei);
    if (ORTSSEITE.test(s.datei)) orte.push({ datei: s.datei, roh: buf.length });
    else {
      sonstige.push({ datei: s.datei, roh: buf.length });
      if (buf.length > GRENZE.sonstRoh) f('budgets/seite', 'warnung', `${buf.length} B roh > ${GRENZE.sonstRoh} B`, s.datei);
    }
  }
  messung.vorladenMax = vorladenMax;

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
    `CSS gz ${messung.css ?? '–'} B (Grenze ${GRENZE.cssGz})`,
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
