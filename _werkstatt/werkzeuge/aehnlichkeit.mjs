// Textähnlichkeit der Ortsseiten (E3-PRUEF-10, Schritt 3): Jaccard über Wort-5-Gramme des sichtbaren Textes in <main>.
// Aufruf: node _werkstatt/werkzeuge/aehnlichkeit.mjs --dist <ordner> [--paare 2000] [--saat 7] --aus <json>
// Ortsseiten: Ordner /schluesseldienst-*/ mit index.html (Sortierung nach Pfad).
// Text: erstes <main>…</main>; <script>, <style> und Kommentare entfernt; Tags durch Leerzeichen ersetzt;
//   NFC, Kleinschreibung; alles außer Buchstaben, Ziffern und Zeichenmarken wird zu Leerzeichen.
// Wort-5-Gramme: Menge verschiedener Fünferfolgen aufeinanderfolgender Wörter je Seite.
// Gruppe „zufall“: --paare gleichverteilte Paare verschiedener Ortsseiten (mulberry32 mit --saat, ohne Wiederholung).
// Gruppe „nachbar“: Paare Ort–Nachbarort aus der Liste „ort-liste-km“ der Seite (Duplikate als ungerichtete Paare
//   entfernt). Gibt es mehr als --paare, wird mit derselben Saat eine Teilmenge gezogen.
// Je Gruppe: Median, 95 %-Quantil (Nearest-Rank), Maximum, und die 10 ähnlichsten Paare mit Wert.
// Ausgabe: JSON nach --aus (ohne Zeitstempel).
// Exit: 0 ok · 2 Werkzeugfehler
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

/** Mulberry32: deterministischer Zufallsgenerator mit fester Saat. */
function mulberry32(saat) {
  let s = saat >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const median = (werte) => { const s = [...werte].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const nearestRank = (werte, q) => { const s = [...werte].sort((x, y) => x - y); return s[Math.max(0, Math.ceil(q * s.length) - 1)]; };

/** Sichtbarer Text des ersten <main>-Elements als Wortliste (kleingeschrieben, ohne Satzzeichen). */
function woerter(html) {
  const m = /<main\b[^>]*>([\s\S]*?)<\/main>/i.exec(html);
  if (!m) return null;
  const ohne = m[1].replace(/<!--[\s\S]*?-->/g, ' ').replace(/<(script|style)\b[\s\S]*?<\/\1\s*>/gi, ' ');
  const text = entitaeten(ohne.replace(/<[^>]*>/g, ' ')).normalize('NFC').toLowerCase();
  return text.replace(/[^\p{L}\p{M}\p{N}]+/gu, ' ').trim().split(' ').filter(Boolean);
}

function fuenfGramme(liste) {
  const menge = new Set();
  for (let i = 0; i + 5 <= liste.length; i++) menge.add(liste.slice(i, i + 5).join(' '));
  return menge;
}

function jaccard(a, b) {
  const [klein, gross] = a.size <= b.size ? [a, b] : [b, a];
  let schnitt = 0;
  for (const x of klein) if (gross.has(x)) schnitt++;
  const vereinigung = a.size + b.size - schnitt;
  return vereinigung ? schnitt / vereinigung : 0;
}

async function main() {
  const { values: a } = parseArgs({
    strict: true,
    options: { dist: { type: 'string' }, paare: { type: 'string' }, saat: { type: 'string' }, aus: { type: 'string' } },
  });
  if (!a.dist || !a.aus) throw new Error('Pflicht: --dist <ordner> und --aus <json>');
  const anzahl = a.paare === undefined ? 2000 : Number(a.paare);
  const saat = a.saat === undefined ? 7 : Number(a.saat);
  if (!Number.isInteger(anzahl) || anzahl < 1) throw new Error('--paare: ganze Zahl ≥ 1');
  if (!Number.isInteger(saat)) throw new Error('--saat: ganze Zahl');
  const wurzel = resolve(a.dist);

  // Ortsseiten in fester Reihenfolge
  const pfade = (await fsp.readdir(wurzel, { withFileTypes: true }))
    .filter((e) => e.isDirectory() && e.name.startsWith('schluesseldienst-'))
    .map((e) => `/${e.name}/`).sort();
  const index = new Map(pfade.map((p, i) => [p, i]));
  const N = pfade.length;
  if (N < 2) throw new Error('weniger als zwei Ortsseiten gefunden');

  const cache = new Map(); // Index -> { anzahl, gramme } (nur für die gezogenen Paare)
  const dateiPfad = (p) => join(wurzel, p.slice(1), 'index.html');
  async function merkmale(i, behalten = true) {
    if (cache.has(i)) return cache.get(i);
    const html = await fsp.readFile(dateiPfad(pfade[i]), 'utf8');
    const w = woerter(html);
    if (!w) throw new Error(`kein <main> in ${pfade[i]}`);
    const m = { anzahl: w.length, gramme: fuenfGramme(w) };
    if (behalten) cache.set(i, m);
    return m;
  }

  // Zufallspaare: gleichverteilt, verschieden, ohne Wiederholung
  const rnd = mulberry32(saat);
  const zufall = []; const gesehen = new Set();
  let versuche = 0;
  while (zufall.length < anzahl) {
    if (++versuche > anzahl * 100) throw new Error('Zufallspaare nicht ziehbar');
    const i = Math.floor(rnd() * N); const j = Math.floor(rnd() * N);
    if (i === j) continue;
    const [x, y] = i < j ? [i, j] : [j, i];
    const schluessel = x * N + y;
    if (gesehen.has(schluessel)) continue;
    gesehen.add(schluessel); zufall.push([x, y]);
  }

  // Nachbarpaare aus der Nachbarliste jeder Ortsseite
  const nachbarMenge = new Map();
  let seitenMitListe = 0;
  for (let i = 0; i < N; i++) {
    const html = await fsp.readFile(dateiPfad(pfade[i]), 'utf8');
    const block = /<ul class="ort-liste ort-liste-km"[^>]*>([\s\S]*?)<\/ul>/i.exec(html);
    if (!block) continue;
    seitenMitListe++;
    for (const m of block[1].matchAll(/href="([^"]*)"/g)) {
      const j = index.get(entitaeten(m[1]));
      if (j === undefined || j === i) continue;
      const [x, y] = i < j ? [i, j] : [j, i];
      nachbarMenge.set(x * N + y, [x, y]);
    }
  }
  const nachbarAlle = [...nachbarMenge.entries()].sort((p, q) => p[0] - q[0]).map(([, paar]) => paar);
  let nachbar = nachbarAlle;
  if (nachbarAlle.length > anzahl) {
    const rnd2 = mulberry32(saat);
    const kopie = nachbarAlle.slice();
    for (let i = 0; i < anzahl; i++) {
      const j = i + Math.floor(rnd2() * (kopie.length - i));
      [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
    }
    nachbar = kopie.slice(0, anzahl).sort((p, q) => (p[0] * N + p[1]) - (q[0] * N + q[1]));
  }

  async function gruppe(paare) {
    const werte = [];
    for (const [x, y] of paare) {
      const mx = await merkmale(x); const my = await merkmale(y);
      werte.push({ wert: jaccard(mx.gramme, my.gramme), a: pfade[x], b: pfade[y] });
    }
    const top = [...werte].sort((p, q) => q.wert - p.wert || (p.a + p.b < q.a + q.b ? -1 : 1)).slice(0, 10)
      .map((e) => ({ wert: Number(e.wert.toFixed(4)), a: e.a, b: e.b }));
    const zahlen = werte.map((e) => e.wert);
    return {
      n: zahlen.length, median: Number(median(zahlen).toFixed(4)), q95: Number(nearestRank(zahlen, 0.95).toFixed(4)),
      maximum: Number(Math.max(...zahlen).toFixed(4)), top10: top,
    };
  }

  const zufallGruppe = await gruppe(zufall);
  const nachbarGruppe = await gruppe(nachbar);

  // Grundgesamtheit: Wörter und 5-Gramme je Ortsseite (alle Seiten, ohne Zwischenspeicher)
  const woerterWerte = []; const grammWerte = [];
  for (let i = 0; i < N; i++) { const m = await merkmale(i, false); woerterWerte.push(m.anzahl); grammWerte.push(m.gramme.size); }

  const daten = {
    werkzeug: 'aehnlichkeit', dist: a.dist, saat, paare_je_gruppe: anzahl,
    grundgesamtheit: {
      ortsseiten: N, woerter_median: median(woerterWerte), fuenfgramme_median: median(grammWerte),
      fuenfgramme_min: Math.min(...grammWerte), fuenfgramme_max: Math.max(...grammWerte),
      seiten_mit_nachbarliste: seitenMitListe,
    },
    nachbarpaare: { verschieden: nachbarAlle.length, gezogen: nachbar.length },
    gruppen: { zufall: zufallGruppe, nachbar: nachbarGruppe },
  };
  await fsp.mkdir(resolve(a.aus, '..'), { recursive: true });
  await fsp.writeFile(resolve(a.aus), JSON.stringify(daten, null, 2) + '\n');

  console.log(`aehnlichkeit: ${N} Ortsseiten · saat ${saat} · Wörter Median ${daten.grundgesamtheit.woerter_median} · 5-Gramme Median ${daten.grundgesamtheit.fuenfgramme_median}`);
  for (const [name, g] of [['zufall', zufallGruppe], ['nachbar', nachbarGruppe]]) {
    console.log(`${name}: n=${g.n} · Median ${g.median} · 95%-Quantil ${g.q95} · Maximum ${g.maximum}`);
  }
  console.log(`nachbarpaare verschieden: ${nachbarAlle.length} · gezogen: ${nachbar.length}`);
}

main().catch((e) => {
  console.error(`aehnlichkeit: Werkzeugfehler: ${e.message}`);
  process.exitCode = 2;
});
