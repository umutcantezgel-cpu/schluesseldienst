#!/usr/bin/env node
// Stufe 30: Gleicht die Ortsnamen beider Wettbewerber mit dem GeoNames-Gazetteer ab.
// Die Wettbewerberlisten dienen nur als Auswahl; Schreibweise, Lage, Gemeinde, Kreis und Land
// stammen ausschließlich aus GeoNames. Unklare Fälle werden nicht geraten, sondern gelistet.
// Eingaben: .cache/orte/{quellen,gazetteer,verwaltung}.json · Ausgaben: .cache/orte/abgleich.json,
// src/daten/orte-unklar.json, _werkstatt/berichte/orte-abgleich.md
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { schluessel, kern } from '../../src/assets/js/logik/normalisieren.mjs';
import { haversineKm, schreibeZeilenJson } from './lib.mjs';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const CACHE = join(WURZEL, '.cache/orte');

function abstandLev(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 3;
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

const LATEIN = /^[\p{Script=Latin}\s'’.\-()/0-9]+$/u;

/** Zerlegt einen Quelldatensatz in Lesarten {name, gemeinde?, klammer?}. */
export function lesarten(datensatz, regeln) {
  const ergebnis = [];
  const hinzu = (name, gemeinde = null, klammer = null, abzug = 0) => {
    if (!name) return;
    ergebnis.push({ name: name.trim(), gemeinde: gemeinde ? gemeinde.trim() : null, klammer, abzug });
  };
  if (datensatz.quelle === 'A') {
    const s = datensatz.slug;
    hinzu(s);
    const teile = s.split('-');
    for (let i = 1; i < teile.length; i++) {
      const vorn = teile.slice(0, i).join('-');
      const hinten = teile.slice(i).join('-');
      hinzu(hinten, vorn);      // stadt-stadtteil (Adam-Schema, bevorzugt)
      hinzu(vorn, hinten, null, 6); // ort-gemeinde (seltener)
    }
    return ergebnis;
  }
  let text = datensatz.text.replace(/\s+/g, ' ').trim();
  if (datensatz.land === 'Berlin') text = text.replace(/^Berlin[\s-]+(?=\S)/, '');
  const klammer = (text.match(/\(([^)]+)\)/) || [])[1] || null;
  const [a, b] = text.split(/\s*,\s*/);
  const varianten = (t) => [t, ...(t.includes('/') ? t.split(/\s*\/\s*/) : [])];
  if (b !== undefined) {
    const aKey = schluessel(a);
    // Regel: „Ortsteil, Gemeinde“. Umgekehrt („Bremen, Arsten“, „Delmenhorst, Brendel/Adelheide“) nur mit Abzug,
    // außer der erste Teil ist ein Stadtstaat.
    const umgekehrtAbzug = regeln.stadtstaaten.includes(aKey) ? 0 : 8;
    for (const va of varianten(a)) for (const vb of varianten(b)) { hinzu(va, vb, klammer); hinzu(vb, va, klammer, umgekehrtAbzug); }
  } else {
    for (const v of varianten(a)) hinzu(v, null, klammer);
    // „Köln-Ehrenfeld“, „Hörstel-Dreierwalde“: Stadt-Stadtteil ohne Komma
    const ohneKlammer = a.replace(/\([^)]*\)/g, '').trim();
    const teile = ohneKlammer.split('-');
    for (let i = 1; i < teile.length; i++) hinzu(teile.slice(i).join('-'), teile.slice(0, i).join('-'), klammer, 3);
  }
  return ergebnis;
}

export function baueIndex(gazetteer) {
  const nachName = new Map();
  const nachKern = new Map();
  const nachAlt = new Map();
  const add = (map, k, e) => { if (!k) return; let l = map.get(k); if (!l) map.set(k, l = []); if (!l.includes(e)) l.push(e); };
  for (const e of gazetteer) {
    if (['PPLH', 'PPLQ', 'PPLW', 'PPLCH'].includes(e.fcode)) continue;
    add(nachName, schluessel(e.name), e);
    add(nachKern, kern(e.name), e);
    for (const alt of e.alt || []) if (LATEIN.test(alt)) { add(nachAlt, schluessel(alt), e); add(nachAlt, kern(alt), e); }
  }
  return { nachName, nachKern, nachAlt };
}

const TYP = (fcode) => (/^PPL(A|A2|A3|A4|C)$/.test(fcode) ? 2 : fcode === 'PPL' || fcode === 'ADM4' ? 1 : 0);
const BEV = (pop) => Math.min(4, Math.log10((pop || 0) + 1) * 0.8);

export function verwaltungsnamen(e, verwaltung, regeln) {
  const land = e.cc === 'NL' ? 'Niederlande' : regeln.laenderDe[`${e.cc}.${e.a1}`] || null;
  if (e.cc === 'NL') {
    return { land, kreis: regeln.provinzenNl[`NL.${e.a1}`] || null, gemeinde: verwaltung.kreis[`NL.${e.a1}.${e.a2}`] || null };
  }
  const kreis = e.a3 ? verwaltung.gemeinde[`${e.cc}.${e.a1}.${e.a2}.${e.a3}`] || null : null;
  const gemeinde = e.a4 ? verwaltung.gemeinde[`${e.cc}.${e.a1}.${e.a2}.${e.a3}.${e.a4}`] || null : null;
  return { land, kreis, gemeinde };
}

/** Bewertet alle Kandidaten einer Lesart; liefert [{e, punkte, gruende}] absteigend. */
function bewerte(lesart, kontext) {
  const { index, verwaltung, regeln, datensatz, landFilter, regionFilter, zentrum } = kontext;
  const nameKey = schluessel(lesart.name);
  const nameKern = kern(lesart.name);
  const kandidaten = new Map();
  const merke = (e, p, g) => { const alt = kandidaten.get(e.id); if (!alt || alt.p < p) kandidaten.set(e.id, { e, p, g }); };
  for (const e of index.nachName.get(nameKey) || []) merke(e, 10, 'name');
  for (const e of index.nachKern.get(nameKern) || []) merke(e, nameKern === nameKey ? 10 : 8, 'kern');
  for (const e of index.nachAlt.get(nameKey) || []) merke(e, 6, 'alt');
  for (const e of index.nachAlt.get(nameKern) || []) merke(e, 5, 'alt-kern');

  // Gemeinde-Hinweis auflösen: Lage aller gleichnamigen Orte/Gemeinden im erlaubten Raum
  let gemeindeOrte = null;
  if (lesart.gemeinde) {
    const gk = kern(lesart.gemeinde);
    const gs = schluessel(lesart.gemeinde);
    gemeindeOrte = [...(index.nachName.get(gs) || []), ...(index.nachKern.get(gk) || [])]
      .filter((g) => !landFilter || landFilter(g));
  }

  const bewertet = [];
  for (const { e, p, g } of kandidaten.values()) {
    if (landFilter && !landFilter(e)) continue;
    if (zentrum && haversineKm(zentrum.lat, zentrum.lon, e.lat, e.lon) > zentrum.radiusKm) continue;
    let punkte = p - (lesart.abzug || 0);
    const gruende = lesart.abzug ? [g, `abzug-${lesart.abzug}`] : [g];
    const vn = verwaltungsnamen(e, verwaltung, regeln);
    if (lesart.gemeinde) {
      const gk = kern(lesart.gemeinde);
      const gs = schluessel(lesart.gemeinde);
      const passt = (n) => n && (schluessel(n) === gs || kern(n) === gk || schluessel(n).includes(gk) || (gk.length > 6 && abstandLev(kern(n), gk) <= 2));
      let nah = Infinity;
      for (const o of gemeindeOrte || []) nah = Math.min(nah, haversineKm(o.lat, o.lon, e.lat, e.lon));
      if (passt(vn.gemeinde)) { punkte += 6; gruende.push('gemeinde'); }
      else if (passt(vn.kreis) || nah <= regeln.schwelle.gemeindeNahKm) { punkte += 3; gruende.push('gemeinde-nah'); }
      else if (gemeindeOrte.length && nah > regeln.schwelle.gemeindeFernKm) { punkte -= 4; gruende.push('gemeinde-fern'); }
      if (schluessel(e.name) === gs && e.fcode !== 'PPLX') { punkte -= 6; gruende.push('ist-gemeinde-selbst'); }
    }
    if (lesart.klammer) {
      const kk = schluessel(lesart.klammer);
      if ([vn.gemeinde, vn.kreis, vn.land, ...(e.alt || [])].some((n) => n && schluessel(n).includes(kk))) { punkte += 4; gruende.push('klammer'); }
    }
    if (regionFilter && regionFilter(vn, e)) { punkte += 5; gruende.push('region'); }
    punkte += TYP(e.fcode) + (g.startsWith('alt') ? 0 : BEV(e.pop));
    bewertet.push({ e, punkte, gruende, vn });
  }
  bewertet.sort((a, b) => b.punkte - a.punkte || (b.e.pop || 0) - (a.e.pop || 0) || a.e.id.localeCompare(b.e.id));
  return bewertet;
}

/** Fasst Kandidaten derselben Siedlung zusammen (ADM4 + PPL, gleiche Gemeinde, ≤ clusterKm). */
const lesartMitHinweis = (k) => Boolean(k.lesart.gemeinde || k.lesart.klammer);

function gleicheSiedlung(a, b, km) {
  if (a.e.id === b.e.id) return true;
  if (kern(a.e.name) !== kern(b.e.name)) return false;
  if (a.e.a4 && a.e.a4 === b.e.a4 && a.e.a3 === b.e.a3) return true;
  return haversineKm(a.e.lat, a.e.lon, b.e.lat, b.e.lon) <= km;
}

export function gleicheAb(datensatz, kontext) {
  const erst = gleicheAbMit(datensatz, kontext, false);
  if (erst.status === 'zugeordnet' || datensatz.quelle !== 'R' || erst.grund === 'mehrdeutig') return erst;
  // Richter ordnet manche Orte dem falschen Land zu (z. B. Rinteln unter NRW): bundesweit mit Abzug erneut versuchen
  const zweit = gleicheAbMit(datensatz, kontext, true);
  return zweit.status === 'zugeordnet' ? { ...zweit, landKorrigiert: true } : erst;
}

function gleicheAbMit(datensatz, kontext, bundesweit) {
  const { regeln } = kontext;
  let landFilter = null;
  let regionFilter = null;
  let zentrum = null;
  if (datensatz.quelle === 'R' && bundesweit) {
    landFilter = (e) => e.cc === (regeln.richterLand[datensatz.land] === 'NL' ? 'NL' : 'DE');
  } else if (datensatz.quelle === 'R') {
    const code = regeln.richterLand[datensatz.land];
    if (code === 'NL') landFilter = (e) => e.cc === 'NL';
    else if (code && datensatz.land !== 'Berlin') {
      const [cc, a1] = code.split('.');
      landFilter = (e) => e.cc === cc && e.a1 === a1;
    } else landFilter = (e) => e.cc === 'DE';
  } else {
    landFilter = (e) => e.cc === 'DE';
    zentrum = regeln.adamZentrum;
    const ziele = regeln.adamRegionKreise[datensatz.region] || [];
    if (ziele.length) {
      regionFilter = (vn, e) => ziele.some((z) => (z.startsWith('DE.') ? `${e.cc}.${e.a1}` === z : [vn.kreis, vn.gemeinde].some((n) => n && schluessel(n).includes(z))));
    }
  }
  const alle = [];
  for (const lesart of lesarten(datensatz, regeln)) {
    const l = bundesweit ? { ...lesart, abzug: (lesart.abzug || 0) + 2 } : lesart;
    for (const b of bewerte(l, { ...kontext, datensatz, landFilter, regionFilter, zentrum })) alle.push({ ...b, lesart: l });
  }
  const volltext = schluessel(datensatz.quelle === 'A' ? datensatz.slug : datensatz.text);
  const vollTreffer = alle.some((k) => !k.lesart.gemeinde && schluessel(k.lesart.name) === volltext && (k.gruende[0] === 'name' || k.gruende[0] === 'kern') && schluessel(k.e.name) === volltext);
  if (vollTreffer) for (const k of alle) if (k.lesart.gemeinde && schluessel(k.lesart.gemeinde + '-' + k.lesart.name) === volltext) { k.punkte -= 6; k.gruende.push('teil-eines-vollnamens'); }
  alle.sort((a, b) => b.punkte - a.punkte || (b.e.pop || 0) - (a.e.pop || 0) || a.e.id.localeCompare(b.e.id));
  // Eindeutigkeit: wie viele verschiedene Siedlungen erreichen ≥ beste − abstand?
  const beste = alle[0];
  if (!beste) return { status: 'unklar', grund: 'kein-kandidat', top: [] };
  const zweite = alle.find((k) => !gleicheSiedlung(k, beste, regeln.schwelle.clusterKm));
  const abstand = zweite ? beste.punkte - zweite.punkte : Infinity;
  const top = [beste, zweite, ...alle.filter((k) => k !== beste && k !== zweite && !gleicheSiedlung(k, beste, regeln.schwelle.clusterKm))].filter(Boolean).slice(0, 3)
    .map((k) => ({ id: k.e.id, name: k.e.name, gemeinde: k.vn.gemeinde, kreis: k.vn.kreis, punkte: Math.round(k.punkte * 10) / 10, gruende: k.gruende }));
  // Bevorzugt die besiedelte Stelle (PPL) vor der Verwaltungsfläche (ADM4) derselben Siedlung
  let wahl = beste;
  if (beste.e.fc === 'A') {
    const ppl = alle.find((k) => k.e.fc === 'P' && gleicheSiedlung(k, beste, regeln.schwelle.clusterKm) && beste.punkte - k.punkte <= 2);
    if (ppl) wahl = ppl;
  }
  const direkt = (k) => k && ['name', 'kern'].includes(k.gruende[0]);
  const zweiteDirekt = alle.find((k) => direkt(k) && !gleicheSiedlung(k, beste, regeln.schwelle.clusterKm));
  const hat = (k, g) => k && k.gruende.includes(g);
  const eindeutig = direkt(beste) && !zweiteDirekt && beste.punkte >= regeln.schwelle.eindeutig && !beste.lesart.abzug;
  // Starke Hinweise entscheiden: passende Gemeinde (Verwaltung) oder Adam-Region schlägt bloße Nähe
  const stark = beste.punkte >= regeln.schwelle.punkte && ((hat(beste, 'gemeinde') && !hat(zweite, 'gemeinde')) || (hat(beste, 'region') && !hat(zweite, 'region')) || (hat(beste, 'klammer') && beste.gruende[0] === 'name' && !(hat(zweite, 'klammer') && zweite.gruende[0] === 'name')));
  // Gleichnamige eigenständige Orte ohne weiteren Hinweis: jeder Kandidat ergäbe eine wahre Seite (GeoNames-Fakten);
  // gewählt wird der bevölkerungsreichste, der Titel nennt Gemeinde/Kreis zur Unterscheidung.
  const gleichnamig = !lesartMitHinweis(beste) && beste.punkte >= regeln.schwelle.eindeutig && direkt(beste) && !beste.lesart.abzug;
  const ok = eindeutig || stark || gleichnamig || (beste.punkte >= regeln.schwelle.punkte && abstand >= regeln.schwelle.abstand);
  return {
    gleichnamigGewaehlt: ok && gleichnamig && !eindeutig && !stark && abstand < regeln.schwelle.abstand,
    status: ok ? 'zugeordnet' : 'unklar', grund: ok ? null : beste.punkte < regeln.schwelle.punkte ? 'zu-wenig-punkte' : 'mehrdeutig',
    wahl: ok ? wahl : null, punkte: beste.punkte, abstand, top,
  };
}

async function main() {
  const regeln = JSON.parse(await readFile(join(dirname(fileURLToPath(import.meta.url)), 'regeln.json'), 'utf8'));
  const quellen = JSON.parse(await readFile(join(CACHE, 'quellen.json'), 'utf8'));
  const gazetteer = JSON.parse(await readFile(join(CACHE, 'gazetteer.json'), 'utf8'));
  const verwaltung = JSON.parse(await readFile(join(CACHE, 'verwaltung.json'), 'utf8'));
  let manuell = {};
  try { manuell = JSON.parse(await readFile(join(dirname(fileURLToPath(import.meta.url)), 'zuordnung-manuell.json'), 'utf8')); } catch { /* leer */ }
  const index = baueIndex(gazetteer);
  const nachId = new Map(gazetteer.map((e) => [e.id, e]));
  const kontext = { index, verwaltung, regeln };

  const orte = new Map();
  const unklar = [];
  const stat = { R: { zugeordnet: 0, unklar: 0, verworfen: 0 }, A: { zugeordnet: 0, unklar: 0, verworfen: 0 } };
  let gleichnamigGewaehlt = 0;
  let landKorrigiert = 0;
  for (const d of quellen) {
    const quelleSchluessel = `${d.quelle}:${d.slug}`;
    let wahl = null;
    let info = null;
    if (manuell[quelleSchluessel]) {
      const m = manuell[quelleSchluessel];
      if (m === 'verwerfen') { stat[d.quelle].verworfen++; continue; }
      wahl = { e: nachId.get(m) };
      if (!wahl.e) throw new Error(`Manuelle Zuordnung ${quelleSchluessel} → ${m}: ID unbekannt`);
      info = { manuell: true };
    } else {
      info = gleicheAb(d, kontext);
      if (info.status !== 'zugeordnet') {
        stat[d.quelle].unklar++;
        unklar.push({ quelle: quelleSchluessel, text: d.text, land: d.land || null, region: d.region || null, grund: info.grund, top: info.top });
        continue;
      }
      wahl = info.wahl;
    }
    stat[d.quelle].zugeordnet++;
    if (info.gleichnamigGewaehlt) gleichnamigGewaehlt++;
    if (info.landKorrigiert) landKorrigiert++;
    const e = wahl.e;
    const vn = verwaltungsnamen(e, verwaltung, regeln);
    const bisher = orte.get(e.id);
    if (bisher) { bisher.quellen = [...new Set([...bisher.quellen, quelleSchluessel])].sort(); continue; }
    orte.set(e.id, {
      id: e.id, name: e.name, cc: e.cc, a1: e.a1, a2: e.a2, a3: e.a3, a4: e.a4, fcode: e.fcode, pop: e.pop,
      lat: e.lat, lon: e.lon, gemeinde: vn.gemeinde, kreis: vn.kreis, land: vn.land,
      quellen: [quelleSchluessel], punkte: info.punkte ? Math.round(info.punkte * 10) / 10 : null,
    });
  }
  const liste = [...orte.values()].sort((a, b) => a.id.localeCompare(b.id));
  await schreibeZeilenJson(join(CACHE, 'abgleich.json'), liste);
  await mkdir(join(WURZEL, 'src/daten'), { recursive: true });
  await schreibeZeilenJson(join(WURZEL, 'src/daten/orte-unklar.json'), unklar.sort((a, b) => a.quelle.localeCompare(b.quelle)));

  const jeLand = {};
  for (const u of unklar) jeLand[u.land || u.region || '?'] = (jeLand[u.land || u.region || '?'] || 0) + 1;
  const gesamt = quellen.length;
  const zugeordnet = stat.R.zugeordnet + stat.A.zugeordnet;
  const bericht = `# Orts-Abgleich (Stufe 30)

- Quelldatensätze: ${gesamt} (R ${stat.R.zugeordnet + stat.R.unklar + stat.R.verworfen}, A ${stat.A.zugeordnet + stat.A.unklar + stat.A.verworfen})
- Zugeordnet: ${zugeordnet} (${(100 * zugeordnet / gesamt).toFixed(1)} %) – R ${stat.R.zugeordnet}, A ${stat.A.zugeordnet}
- Unklar (nicht veröffentlicht, Liste in \`src/daten/orte-unklar.json\`): ${unklar.length} (${(100 * unklar.length / gesamt).toFixed(1)} %)
- Verworfen (manuell): ${stat.R.verworfen + stat.A.verworfen}
- Verschiedene Orte nach Zusammenführung: ${liste.length}
- Davon gleichnamige Orte ohne weiteren Hinweis (bevölkerungsreichster gewählt, Titel mit Gemeinde/Kreis): ${gleichnamigGewaehlt}
- Land korrigiert (Quelle nannte ein anderes Bundesland): ${landKorrigiert}
- Schwelle: ≥ ${regeln.schwelle.punkte} Punkte und ≥ ${regeln.schwelle.abstand} Punkte Abstand zur nächsten anderen Siedlung

## Unklar je Land/Region
${Object.entries(jeLand).sort((a, b) => b[1] - a[1]).map(([k, v]) => `- ${k}: ${v}`).join('\n')}
`;
  await writeFile(join(WURZEL, '_werkstatt/berichte/orte-abgleich.md'), bericht);
  console.log(bericht);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main().catch((e) => { console.error(e.stack || e); process.exitCode = 1; });
