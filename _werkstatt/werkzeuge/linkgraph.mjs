// Linkgraph der statischen Website: interne Links aller index.html als gerichteter Graph.
// Aufruf: node _werkstatt/werkzeuge/linkgraph.mjs --dist <ordner> --aus <json>
// Seiten: alle index.html im Ordner (404.html zählt nicht zum Graphen).
// Kanten: <a href> mit Ziel „/…“. Anker „#…“ und Abfrage „?…“ werden abgeschnitten (Ziel ist die Seite).
//   Nicht gezählt: Ziele „//…“ sowie alle Links, die nicht mit „/“ beginnen (mailto, tel, extern, reine Anker).
//   Selbstlinks zählen nicht als Kante. Mehrfachlinks zwischen zwei Seiten zählen als eine Kante.
// Eingehend je Seite: Anzahl verschiedener Quellseiten. Quantile: Nearest-Rank.
// Klicktiefe: Breitensuche ab „/“ über die Kanten; nicht erreichte Seiten werden gesondert ausgewiesen.
// Ausgabe: JSON nach --aus (ohne Zeitstempel, damit Läufe vergleichbar sind).
// Exit: 0 ok · 1 Links auf nicht vorhandene Ziele · 2 Werkzeugfehler
import { parseArgs } from 'node:util';
import { promises as fsp } from 'node:fs';
import { join, resolve } from 'node:path';

const NAMEN = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const entitaeten = (s) => s.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (m, e) => {
  if (e[0] === '#') {
    const cp = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
    return cp <= 0x10ffff ? String.fromCodePoint(cp) : m;
  }
  return NAMEN[e.toLowerCase()] ?? m;
});

/** Alle href-Werte der <a>-Elemente (Kommentare und Skripte vorher entfernt). */
function linkZiele(html) {
  const ohne = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style)\b[\s\S]*?<\/\1\s*>/gi, '');
  const ziele = [];
  for (const m of ohne.matchAll(/<a\b((?:[^>"']|"[^"]*"|'[^']*')*)>/gi)) {
    const attr = /(?:^|\s)href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i.exec(m[1]);
    if (attr) ziele.push(attr[1] ?? attr[2] ?? attr[3]);
  }
  return ziele;
}

const median = (werte) => { const s = [...werte].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const nearestRank = (werte, q) => { const s = [...werte].sort((x, y) => x - y); return s[Math.max(0, Math.ceil(q * s.length) - 1)]; };

async function main() {
  const { values: a } = parseArgs({ strict: true, options: { dist: { type: 'string' }, aus: { type: 'string' } } });
  if (!a.dist || !a.aus) throw new Error('Pflicht: --dist <ordner> und --aus <json>');
  const wurzel = resolve(a.dist);

  // Seiten: jede index.html ist eine Seite; Pfad mit abschließendem „/“
  const seiten = new Set();
  for await (const f of fsp.glob('**/index.html', { cwd: wurzel })) {
    if (!f.split('/').includes('node_modules')) seiten.add('/' + f.slice(0, -'index.html'.length));
  }
  if (!seiten.has('/')) throw new Error('Startseite / fehlt im Ordner');
  const alle = [...seiten].sort();

  const dateiCache = new Map();
  async function istDatei(pfad) {
    if (!dateiCache.has(pfad)) {
      let ok = false;
      try { ok = (await fsp.stat(join(wurzel, decodeURIComponent(pfad)))).isFile(); } catch { ok = false; }
      dateiCache.set(pfad, ok);
    }
    return dateiCache.get(pfad);
  }
  async function ziel(pfad) {
    if (seiten.has(pfad)) return { art: 'seite', pfad };
    if (!pfad.endsWith('/') && seiten.has(pfad + '/')) return { art: 'seite', pfad: pfad + '/', ohneSchraegstrich: true };
    if (!pfad.endsWith('/') && await istDatei(pfad)) return { art: 'datei' };
    return { art: 'fehlt' };
  }

  const kanten = new Map(); // Quelle -> Set(Ziele)
  const eingehend = new Map(); // Ziel -> Set(Quellen)
  const fehlend = new Map(); // Ziel -> { vorkommen, quellen: Set }
  const dateien = new Map(); // Datei -> { vorkommen, quellen: Set }
  const zaehler = { vorkommen: 0, extern: 0, selbst: 0, mitAnker: 0, ohneSchraegstrich: 0, zuIndexHtml: 0 };

  for (const p of alle) {
    const html = await fsp.readFile(join(wurzel, p.slice(1), 'index.html'), 'utf8');
    for (const roh of linkZiele(html)) {
      zaehler.vorkommen++;
      const h = entitaeten(roh).trim();
      if (!h.startsWith('/') || h.startsWith('//')) { zaehler.extern++; continue; }
      if (h.includes('#')) zaehler.mitAnker++;
      let pfad = h.replace(/[#?][\s\S]*$/, '');
      if (pfad.endsWith('/index.html')) { pfad = pfad.slice(0, -'index.html'.length); zaehler.zuIndexHtml++; }
      const z = await ziel(pfad);
      if (z.art === 'seite') {
        if (z.ohneSchraegstrich) zaehler.ohneSchraegstrich++;
        if (z.pfad === p) { zaehler.selbst++; continue; }
        if (!kanten.has(p)) kanten.set(p, new Set());
        kanten.get(p).add(z.pfad);
        if (!eingehend.has(z.pfad)) eingehend.set(z.pfad, new Set());
        eingehend.get(z.pfad).add(p);
      } else {
        const tabelle = z.art === 'datei' ? dateien : fehlend;
        if (!tabelle.has(pfad)) tabelle.set(pfad, { vorkommen: 0, quellen: new Set() });
        const e = tabelle.get(pfad); e.vorkommen++; e.quellen.add(p);
      }
    }
  }

  // Eingehende Links je Seite (alle Seiten, auch ohne Eingang)
  const ein = new Map(alle.map((p) => [p, eingehend.get(p)?.size ?? 0]));
  const einWerte = alle.map((p) => ein.get(p));
  const eingehendStat = {
    grundgesamtheit: alle.length, min: Math.min(...einWerte), q05: nearestRank(einWerte, 0.05),
    median: median(einWerte), max: Math.max(...einWerte),
  };
  const unter3 = alle.filter((p) => ein.get(p) < 3).sort((x, y) => ein.get(x) - ein.get(y) || (x < y ? -1 : 1))
    .map((p) => ({ pfad: p, eingehend: ein.get(p) }));
  const waisen = alle.filter((p) => ein.get(p) === 0 && p !== '/');

  // Klicktiefe ab „/“
  const tiefe = new Map([['/', 0]]);
  const schlange = ['/'];
  for (let i = 0; i < schlange.length; i++) {
    const p = schlange[i];
    for (const t of kanten.get(p) ?? []) if (!tiefe.has(t)) { tiefe.set(t, tiefe.get(p) + 1); schlange.push(t); }
  }
  const verteilung = {};
  for (const t of tiefe.values()) verteilung[t] = (verteilung[t] ?? 0) + 1;
  const unerreichbar = alle.filter((p) => !tiefe.has(p));
  const ueber4 = alle.filter((p) => (tiefe.get(p) ?? -1) > 4)
    .sort((x, y) => tiefe.get(y) - tiefe.get(x) || (x < y ? -1 : 1)).map((p) => ({ pfad: p, tiefe: tiefe.get(p) }));

  // Kanten verschieden
  let kantenAnzahl = 0;
  for (const ziele of kanten.values()) kantenAnzahl += ziele.size;

  const fehlendListe = [...fehlend.entries()]
    .map(([ziel, e]) => ({ ziel, vorkommen: e.vorkommen, quellen: e.quellen.size, quellenListe: [...e.quellen].sort() }))
    .sort((x, y) => y.vorkommen - x.vorkommen || (x.ziel < y.ziel ? -1 : 1));
  const dateienListe = [...dateien.entries()]
    .map(([ziel, e]) => ({ ziel, vorkommen: e.vorkommen, quellen: e.quellen.size }))
    .sort((x, y) => y.vorkommen - x.vorkommen || (x.ziel < y.ziel ? -1 : 1));

  const daten = {
    werkzeug: 'linkgraph', dist: a.dist, seiten: alle.length,
    kanten: { verschieden: kantenAnzahl, interne_vorkommen: zaehler.vorkommen - zaehler.extern, selbstlinks: zaehler.selbst,
      mit_anker: zaehler.mitAnker, ohne_schraegstrich_auf_seite: zaehler.ohneSchraegstrich, auf_index_html: zaehler.zuIndexHtml,
      externe_oder_andere: zaehler.extern, auf_dateien: dateien.size, auf_dateien_vorkommen: dateienListe.reduce((s, d) => s + d.vorkommen, 0),
      auf_fehlende_ziele_vorkommen: fehlendListe.reduce((s, d) => s + d.vorkommen, 0) },
    eingehend: eingehendStat,
    unter_3: { anzahl: unter3.length, liste: unter3 },
    waisen: { anzahl: waisen.length, liste: waisen },
    klicktiefe: { start: '/', max: Math.max(...tiefe.values()), verteilung, erreicht: tiefe.size,
      unerreichbar: { anzahl: unerreichbar.length, liste: unerreichbar },
      ueber_4: { anzahl: ueber4.length, liste: ueber4 } },
    fehlende_ziele: { ziele: fehlendListe.length, vorkommen: fehlendListe.reduce((s, d) => s + d.vorkommen, 0), liste: fehlendListe },
    links_auf_dateien: dateienListe,
  };
  await fsp.mkdir(join(resolve(a.aus), '..'), { recursive: true });
  await fsp.writeFile(resolve(a.aus), JSON.stringify(daten, null, 2) + '\n');

  console.log(`linkgraph: ${alle.length} Seiten · ${kantenAnzahl} Kanten (verschieden) · ${zaehler.vorkommen - zaehler.extern} interne Link-Vorkommen`);
  console.log(`eingehend je Seite: min ${eingehendStat.min} · 5%-Quantil ${eingehendStat.q05} · Median ${eingehendStat.median} · max ${eingehendStat.max}`);
  console.log(`unter 3 eingehend: ${unter3.length} · Waisen (ohne /): ${waisen.length}`);
  console.log(`Klicktiefe ab /: max ${daten.klicktiefe.max} · erreicht ${tiefe.size} · unerreichbar ${unerreichbar.length} · > 4: ${ueber4.length}`);
  console.log(`Links auf fehlende Ziele: ${fehlendListe.length} verschiedene Ziele, ${daten.fehlende_ziele.vorkommen} Vorkommen`);
  for (const f of fehlendListe.slice(0, 10)) console.log(`  FEHLT ${f.ziel} (${f.vorkommen} Vorkommen, ${f.quellen} Quellseiten)`);
  console.log(fehlendListe.length ? 'ERGEBNIS: befunde' : 'ERGEBNIS: ok');
  process.exitCode = fehlendListe.length ? 1 : 0;
}

main().catch((e) => {
  console.error(`linkgraph: Werkzeugfehler: ${e.message}`);
  process.exitCode = 2;
});
