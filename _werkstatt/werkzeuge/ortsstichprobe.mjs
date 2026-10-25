// Ortsstichprobe (E3-PRUEF-10, Schritt 4): geschichtete Stichprobe von Ortsseiten gegen src/daten/orte.json.
// Aufruf: node _werkstatt/werkzeuge/ortsstichprobe.mjs --dist <ordner> --daten <orte.json> [--saat 7]
//         [--zonen A:25,B:25,C:25,D:15,NL:10] --aus <json>
// Ziehung: je Zone die Orte nach Slug sortiert; teilweises Fisher-Yates mit mulberry32(--saat), Zonen in der
//   Reihenfolge von --zonen. Gleiche Saat und gleiche Daten ergeben dieselbe Stichprobe.
// Prüfungen je Ort (Ergebnis je Prüfung: ok | abweichend | entfaellt = nicht anwendbar):
//   seite-existiert        Datei /schluesseldienst-<slug>/index.html vorhanden (Status-Code egal, statisch)
//   h1-ortsname            H1 enthält den Ortsnamen
//   fakten-gemeinde        Ortsteile: Faktenzeile „Ortsteil von <Gemeinde>“
//   fakten-kreis           Faktenzeile = Kreis; entfällt, wenn Kreis = Land (Stadtstaat) oder kein Kreis in den Daten
//   fakten-land            Faktenzeile = Land
//   fakten-plz             Faktenzeile „PLZ <alle PLZ aus den Daten, Komma-getrennt>“ exakt
//   fakten-km-richtung     „<km> km <Richtung> von Weilburg“ exakt; km 0 (Sitz): „Sitz des Betriebs“
//   titel-weilburg, titel-km   Zonen C, D, NL: <title> nennt „Weilburg“ bzw. die km-Zahl („<km> km“)
//   h1-weilburg, h1-km         Zonen C, D, NL: H1 nennt „Weilburg“ bzw. die km-Zahl
//   nl-kein-preis          NL: „class=\"preis\"“ kommt nicht vor
//   jsonld-lesbar          JSON-LD-Blöcke vorhanden und parsebar
//   jsonld-kein-localbusiness   kein „LocalBusiness“ oder „Locksmith“ in JSON-LD
//   jsonld-kein-aggregaterating kein „aggregateRating“ in JSON-LD
//   brotkrumen-reihenfolge  Start › Einsatzgebiet › Land › Kreis (Kreis entfällt bei Stadtstaat) › aktuelle Seite
//   brotkrumen-links-existieren  jeder Link in nav.brotkrumen zeigt auf eine vorhandene Seite oder Datei
// Ausgabe: JSON nach --aus (ohne Zeitstempel). Je Ort ein Eintrag mit Belegpfad; Auswertung je Prüfung und Zone.
// Exit: 0 keine Abweichung · 1 mindestens eine Abweichung · 2 Werkzeugfehler
import { parseArgs } from 'node:util';
import { promises as fsp, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const PRUEFUNGEN = [
  'seite-existiert', 'h1-ortsname', 'fakten-gemeinde', 'fakten-kreis', 'fakten-land', 'fakten-plz', 'fakten-km-richtung',
  'titel-weilburg', 'titel-km', 'h1-weilburg', 'h1-km', 'nl-kein-preis',
  'jsonld-lesbar', 'jsonld-kein-localbusiness', 'jsonld-kein-aggregaterating',
  'brotkrumen-reihenfolge', 'brotkrumen-links-existieren',
];
const KM_ZONEN = ['C', 'D', 'NL'];
const STANDARD_ZONEN = 'A:25,B:25,C:25,D:15,NL:10';

const NAMEN = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const entitaeten = (s) => s.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (m, e) => {
  if (e[0] === '#') {
    const cp = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
    return cp <= 0x10ffff ? String.fromCodePoint(cp) : m;
  }
  return NAMEN[e.toLowerCase()] ?? m;
});
const norm = (s) => s.replace(/\s+/g, ' ').trim();
/** Klartext: Tags ohne Ersatz entfernt (so bleibt <wbr> ohne Lücke), Entitäten aufgelöst. */
const klartext = (s) => norm(entitaeten(s.replace(/<[^>]*>/g, '')));
const attribut = (tag, name) => { const m = new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i').exec(tag); return m ? entitaeten(m[1] ?? m[2]) : null; };

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

const kmRegex = (km) => new RegExp(`(?<![0-9])${km} km(?![0-9])`);

/** Prüft eine Ortsseite gegen die Daten. html === null: Seite fehlt. */
function pruefeOrt(o, html, wurzel) {
  const e = {};
  const setze = (name, status, detail = '') => { e[name] = { status, detail }; };
  const ja = (bed) => (bed ? 'ok' : 'abweichend');

  if (html === null) {
    setze('seite-existiert', 'abweichend', 'index.html fehlt');
    for (const n of PRUEFUNGEN.slice(1)) setze(n, 'entfaellt', 'Seite fehlt');
    return e;
  }
  setze('seite-existiert', 'ok');

  const titelM = /<title>([\s\S]*?)<\/title>/i.exec(html);
  const titel = titelM ? klartext(titelM[1]) : '';
  const h1M = /<h1\b[^>]*>([\s\S]*?)<\/h1>/i.exec(html);
  const h1 = h1M ? klartext(h1M[1]) : null;
  const faktenM = /<ul class="ort-fakten"[^>]*>([\s\S]*?)<\/ul>/i.exec(html);
  const fakten = faktenM ? [...faktenM[1].matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map((m) => klartext(m[1])) : null;
  const jsonld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  const brotM = /<nav class="brotkrumen"[^>]*>([\s\S]*?)<\/nav>/i.exec(html);

  // H1 und Ortsname
  setze('h1-ortsname', h1 === null ? 'abweichend' : ja(h1.includes(o.name)), h1 === null ? 'H1 fehlt' : `H1: ${h1}`);

  // Faktenzeile
  const li = fakten ?? [];
  if (fakten === null) {
    for (const n of ['fakten-gemeinde', 'fakten-kreis', 'fakten-land', 'fakten-plz', 'fakten-km-richtung']) setze(n, 'abweichend', 'ul.ort-fakten fehlt');
  } else {
    if (o.typ !== 'ortsteil') setze('fakten-gemeinde', 'entfaellt', 'Gemeinde-Seite');
    else setze('fakten-gemeinde', ja(li.some((x) => x.includes(o.gemeinde))), `erwartet: Ortsteil von ${o.gemeinde}`);

    if (!o.kreis) setze('fakten-kreis', 'entfaellt', 'kein Kreis in Daten');
    else if (o.kreis === o.land) setze('fakten-kreis', 'entfaellt', 'Kreis = Land (Stadtstaat)');
    else setze('fakten-kreis', ja(li.includes(o.kreis)), `erwartet: ${o.kreis}`);

    setze('fakten-land', ja(li.includes(o.land)), `erwartet: ${o.land}`);

    if (!o.plz?.length) setze('fakten-plz', 'entfaellt', 'keine PLZ in Daten');
    else { const erw = `PLZ ${o.plz.join(', ')}`; setze('fakten-plz', ja(li.includes(erw)), `erwartet: ${erw}`); }

    if (o.km > 0) {
      const erw = norm(`${o.km} km ${o.richtung ?? ''} von Weilburg`);
      setze('fakten-km-richtung', ja(li.some((x) => norm(x) === erw)), `erwartet: ${erw}`);
    } else {
      setze('fakten-km-richtung', ja(li.includes('Sitz des Betriebs')), 'km 0: erwartet „Sitz des Betriebs“');
    }
  }

  // Zonen C, D, NL: ehrliche Titel und H1 mit Weilburg und km-Zahl
  if (!KM_ZONEN.includes(o.zone)) {
    for (const n of ['titel-weilburg', 'titel-km', 'h1-weilburg', 'h1-km']) setze(n, 'entfaellt', `Zone ${o.zone}`);
  } else {
    const kmRe = kmRegex(o.km);
    setze('titel-weilburg', ja(titel.includes('Weilburg')), `Titel: ${titel}`);
    setze('titel-km', ja(kmRe.test(titel)), `Titel: ${titel}; erwartet: ${o.km} km`);
    setze('h1-weilburg', h1 === null ? 'abweichend' : ja(h1.includes('Weilburg')), `H1: ${h1 ?? 'fehlt'}`);
    setze('h1-km', h1 === null ? 'abweichend' : ja(kmRe.test(h1)), `H1: ${h1 ?? 'fehlt'}; erwartet: ${o.km} km`);
  }

  // NL: keine Preisangaben
  if (o.staat !== 'NL') setze('nl-kein-preis', 'entfaellt', `Staat ${o.staat}`);
  else {
    const n = html.split('class="preis"').length - 1;
    setze('nl-kein-preis', ja(n === 0), `class="preis": ${n}×`);
  }

  // JSON-LD
  const roh = jsonld.join('\n');
  let parsebar = jsonld.length > 0;
  for (const blk of jsonld) { try { JSON.parse(blk); } catch { parsebar = false; } }
  setze('jsonld-lesbar', ja(parsebar), `${jsonld.length} Block/Blöcke`);
  setze('jsonld-kein-localbusiness', ja(!/LocalBusiness|Locksmith/.test(roh)));
  setze('jsonld-kein-aggregaterating', ja(!/aggregateRating/.test(roh)));

  // Brotkrumen
  if (!brotM) {
    setze('brotkrumen-reihenfolge', 'abweichend', 'nav.brotkrumen fehlt');
    setze('brotkrumen-links-existieren', 'abweichend', 'nav.brotkrumen fehlt');
  } else {
    const inhalt = brotM[1];
    const eintraege = [...inhalt.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map((m) => {
      const link = /<a\b[^>]*>/i.exec(m[1]);
      return { text: klartext(m[1]), href: link ? attribut(link[0], 'href') : null, aktuell: /aria-current/i.test(m[1]) };
    });
    const kreisErwartet = !!o.kreis && o.kreis !== o.land;
    const erwartet = [
      { text: 'Start', href: '/' },
      { text: 'Einsatzgebiet', href: '/einsatzgebiet/' },
      { text: o.land, href: `/einsatzgebiet/${o.landSlug}/` },
      // Brotkrumen zeigen kreisfreie Städte wie die Hubs: „Name (kreisfreie Stadt)“ (Entscheidung Opus, PRÜFPUNKT)
      ...(kreisErwartet ? [{ text: o.kreis.replace(/^Kreisfreie Stadt\s+(.+)$/, '$1 (kreisfreie Stadt)'), href: `/einsatzgebiet/${o.landSlug}/${o.kreisSlug}/` }] : []),
    ];
    const probleme = [];
    if (eintraege.length !== erwartet.length + 1) probleme.push(`${eintraege.length} Einträge statt ${erwartet.length + 1}`);
    erwartet.forEach((x, i) => {
      const it = eintraege[i];
      if (!it) return;
      if (it.text !== x.text) probleme.push(`Eintrag ${i + 1}: „${it.text}“ statt „${x.text}“`);
      if (it.href !== x.href) probleme.push(`Eintrag ${i + 1}: Ziel ${it.href} statt ${x.href}`);
    });
    const letzter = eintraege.at(-1);
    if (!letzter?.aktuell) probleme.push('letzter Eintrag ist nicht aktuelle Seite');
    else if (!letzter.text.includes(o.name)) probleme.push(`letzter Eintrag „${letzter.text}“ nennt nicht ${o.name}`);
    const kette = eintraege.map((x) => x.text).join(' › ');
    setze('brotkrumen-reihenfolge', probleme.length ? 'abweichend' : 'ok', probleme.length ? probleme.join('; ') : kette);

    const links = [...inhalt.matchAll(/<a\b[^>]*>/gi)].map((m) => attribut(m[0], 'href')).filter((h) => h !== null);
    const fehlen = links.filter((h) => !zielDa(wurzel, h));
    setze('brotkrumen-links-existieren', fehlen.length || !links.length ? 'abweichend' : 'ok',
      !links.length ? 'keine Links' : `${links.length} Links${fehlen.length ? `; fehlen: ${fehlen.join(', ')}` : ''}`);
  }
  return e;
}

/** Ziel eines internen Links im Ausgabeordner: Verzeichnis mit index.html oder vorhandene Datei. */
function zielDa(wurzel, href) {
  if (!href.startsWith('/') || href.startsWith('//')) return false;
  const pfad = decodeURIComponent(href.replace(/[#?][\s\S]*$/, ''));
  if (pfad.endsWith('/')) return existsSync(join(wurzel, pfad.slice(1), 'index.html'));
  return existsSync(join(wurzel, pfad.slice(1)));
}

async function main() {
  const { values: a } = parseArgs({
    strict: true,
    options: { dist: { type: 'string' }, daten: { type: 'string' }, saat: { type: 'string' }, zonen: { type: 'string' }, aus: { type: 'string' } },
  });
  if (!a.dist || !a.daten || !a.aus) throw new Error('Pflicht: --dist <ordner>, --daten <orte.json> und --aus <json>');
  const saat = a.saat === undefined ? 7 : Number(a.saat);
  if (!Number.isInteger(saat)) throw new Error('--saat: ganze Zahl');
  const zonen = (a.zonen ?? STANDARD_ZONEN).split(',').map((t) => {
    const [z, n] = t.trim().split(':');
    const anzahl = Number(n);
    if (!z || !Number.isInteger(anzahl) || anzahl < 1) throw new Error(`--zonen: ungültig „${t}“`);
    return { zone: z, n: anzahl };
  });
  const wurzel = resolve(a.dist);

  const orte = JSON.parse(await fsp.readFile(resolve(a.daten), 'utf8'));
  if (!Array.isArray(orte)) throw new Error('--daten: Liste erwartet');
  const rnd = mulberry32(saat);
  const gezogen = [];
  const population = [];
  for (const { zone, n } of zonen) {
    const pop = orte.filter((o) => o.slug && o.zone === zone).sort((x, y) => (x.slug < y.slug ? -1 : x.slug > y.slug ? 1 : 0));
    if (pop.length < n) throw new Error(`Zone ${zone}: ${pop.length} Orte, ${n} verlangt`);
    const liste = pop.slice();
    for (let i = 0; i < n; i++) {
      const j = i + Math.floor(rnd() * (liste.length - i));
      [liste[i], liste[j]] = [liste[j], liste[i]];
    }
    population.push({ zone, grundgesamtheit: pop.length, gezogen: n });
    for (const o of liste.slice(0, n)) gezogen.push({ zone, o });
  }

  const ergebnisse = [];
  for (const { zone, o } of gezogen) {
    const pfad = `/schluesseldienst-${o.slug}/`;
    const datei = join(wurzel, `schluesseldienst-${o.slug}`, 'index.html');
    const html = existsSync(datei) ? await fsp.readFile(datei, 'utf8') : null;
    const e = pruefeOrt(o, html, wurzel);
    const abweichungen = Object.entries(e).filter(([, v]) => v.status === 'abweichend').map(([k, v]) => ({ pruefung: k, detail: v.detail }));
    ergebnisse.push({
      zone, slug: o.slug, pfad, name: o.name, typ: o.typ, staat: o.staat, land: o.land, kreis: o.kreis ?? null, km: o.km, richtung: o.richtung ?? null,
      plz: o.plz ?? [], status: abweichungen.length ? 'abweichend' : 'ok', abweichungen, pruefungen: e,
    });
  }

  // Auswertung je Prüfung und Zone
  const auswertung = {};
  for (const name of PRUEFUNGEN) {
    const je = {};
    for (const { zone } of zonen) je[zone] = { ok: 0, abweichend: 0, entfaellt: 0 };
    const z = { ok: 0, abweichend: 0, entfaellt: 0 };
    for (const r of ergebnisse) {
      const s = r.pruefungen[name]?.status ?? 'entfaellt';
      z[s]++; je[r.zone][s]++;
    }
    auswertung[name] = { geprueft: z.ok + z.abweichend, ok: z.ok, abweichend: z.abweichend, entfaellt: z.entfaellt, je_zone: je };
  }
  const zusammensetzung = {};
  for (const { zone } of zonen) {
    const rs = ergebnisse.filter((r) => r.zone === zone);
    zusammensetzung[zone] = {
      gesamt: rs.length, gemeinde: rs.filter((r) => r.typ === 'gemeinde').length, ortsteil: rs.filter((r) => r.typ === 'ortsteil').length,
      stadtstaat_kreis_gleich_land: rs.filter((r) => r.kreis && r.kreis === r.land).length,
      ohne_kreis: rs.filter((r) => !r.kreis).length, ohne_plz: rs.filter((r) => !r.plz.length).length,
    };
  }
  const abweichungen = ergebnisse.flatMap((r) => r.abweichungen.map((x) => ({ pfad: r.pfad, zone: r.zone, ...x })));

  const daten = {
    werkzeug: 'ortsstichprobe', dist: a.dist, daten: a.daten, saat, zonen: population,
    orte_gesamt: gezogen.length, auswertung, zusammensetzung, abweichungen, orte: ergebnisse,
  };
  await fsp.mkdir(resolve(a.aus, '..'), { recursive: true });
  await fsp.writeFile(resolve(a.aus), JSON.stringify(daten, null, 2) + '\n');

  console.log(`ortsstichprobe: ${gezogen.length} Orte · saat ${saat} · ${population.map((p) => `${p.zone} ${p.gezogen} aus ${p.grundgesamtheit}`).join(' · ')}`);
  for (const name of PRUEFUNGEN) {
    const w = auswertung[name];
    console.log(`  ${name.padEnd(28)} geprüft ${String(w.geprueft).padStart(3)} · ok ${String(w.ok).padStart(3)} · abweichend ${String(w.abweichend).padStart(3)} · entfällt ${w.entfaellt}`);
  }
  for (const x of abweichungen.slice(0, 40)) console.log(`  ABWEICHUNG ${x.pfad} ${x.pruefung}: ${x.detail}`);
  if (abweichungen.length > 40) console.log(`  … ${abweichungen.length - 40} weitere Abweichungen in ${a.aus}`);
  console.log(abweichungen.length ? `ERGEBNIS: abweichungen (${abweichungen.length})` : 'ERGEBNIS: ok');
  process.exitCode = abweichungen.length ? 1 : 0;
}

main().catch((e) => {
  console.error(`ortsstichprobe: Werkzeugfehler: ${e.message}`);
  process.exitCode = 2;
});
