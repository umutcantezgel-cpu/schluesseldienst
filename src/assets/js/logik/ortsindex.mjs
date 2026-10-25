// Reine Suchlogik (testbar, auch im Browser gebündelt): Name, Wortanfang oder PLZ.
// Kompakte Indizes: Orte {v:1,o:[[name, zusatz, ortsteil 0/1, slug|0, km, zone, richtungCode]]}
// (slug 0 = aus Name/Gemeinde ableitbar) · PLZ als Text „delta,kmZone[,zeile];…“ (aufsteigende PLZ).
import { schluessel, kern } from './normalisieren.mjs';

export const RICHTUNGEN = ['nördlich', 'nordöstlich', 'östlich', 'südöstlich', 'südlich', 'südwestlich', 'westlich', 'nordwestlich'];

/** Slug wie in der Orts-Pipeline: Gemeinde = Name; Ortsteil = Gemeindekern-Name (ohne Doppelung). */
export function slugAbleiten(name, gemeinde, istOrtsteil) {
  const n = schluessel(name);
  if (!istOrtsteil) return n;
  const g = schluessel(kern(gemeinde));
  return n.startsWith(g + '-') || n === g ? n : `${g}-${n}`;
}

export function indexAufbauen(daten) {
  return daten.o.map((z) => {
    const [name, zusatz, ortsteil, slug, km, zone, r] = z;
    const key = schluessel(name);
    const ohneUmlautE = schluessel(name.replace(/ä/gi, 'a').replace(/ö/gi, 'o').replace(/ü/gi, 'u'));
    return {
      name, zusatz, km, zone, richtung: RICHTUNGEN[r] || null,
      slug: slug || slugAbleiten(name, zusatz, ortsteil === 1),
      key, keys: [...new Set([key, ohneUmlautE])], woerter: key.split('-'),
    };
  });
}

/** Dekodiert den PLZ-Text zu { "35781": { km, zone, zeile } }. */
export function plzDekodieren(text) {
  const karte = {};
  let plz = 0;
  for (const teil of String(text).split(';')) {
    const m = /^(\d+),(\d+)(A|B|C|D|NL)(?:,(\d+))?$/.exec(teil);
    if (!m) continue;
    plz += Number(m[1]);
    karte[String(plz).padStart(5, '0')] = { km: Number(m[2]), zone: m[3], zeile: m[4] === undefined ? -1 : Number(m[4]) };
  }
  return karte;
}

/** Rangfolge: 0 exakt, 1 Präfix des ganzen Namens, 2 Wortanfang; PLZ: 0 exakt, 3 Präfix. */
export function suchen(index, plzKarte, anfrage, max = 8) {
  const q = String(anfrage || '').trim();
  if (!q) return { treffer: [], gesamt: 0 };
  if (/^\d{2,5}$/.test(q)) {
    const liste = [];
    for (const [plz, p] of Object.entries(plzKarte || {})) {
      if (!plz.startsWith(q)) continue;
      const ort = p.zeile >= 0 ? index[p.zeile] : null;
      liste.push({ name: ort ? ort.name : `PLZ ${plz}`, zusatz: ort ? `${plz} · ${ort.zusatz}` : plz, slug: ort ? ort.slug : null, km: p.km, zone: p.zone, richtung: ort && ort.km === p.km ? ort.richtung : null, plz, rang: plz === q ? 0 : 3 });
    }
    liste.sort((a, b) => a.rang - b.rang || a.plz.localeCompare(b.plz));
    return { treffer: liste.slice(0, max), gesamt: liste.length };
  }
  const k = schluessel(q);
  if (k.length < 2) return { treffer: [], gesamt: 0 };
  const liste = [];
  for (const e of index) {
    let rang = -1;
    if (e.keys.includes(k)) rang = 0;
    else if (e.keys.some((x) => x.startsWith(k))) rang = 1;
    else if (e.woerter.some((w, i) => i > 0 && e.woerter.slice(i).join('-').startsWith(k))) rang = 2;
    if (rang >= 0) liste.push({ ...e, rang });
  }
  liste.sort((a, b) => a.rang - b.rang || a.km - b.km || a.name.localeCompare(b.name, 'de'));
  return { treffer: liste.slice(0, max), gesamt: liste.length };
}
