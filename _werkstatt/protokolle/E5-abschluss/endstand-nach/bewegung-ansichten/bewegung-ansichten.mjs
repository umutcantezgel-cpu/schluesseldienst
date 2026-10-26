// bewegung-ansichten.mjs
// Haiku-Messer: Bewegungscode je Seite im Endstand-Build (.cache/e5-final/dist).
// Nur lesen. Geschrieben wird ausschliesslich bewegung-ansichten.json in diesem Ordner.
// Aufruf: node /home/user/schluesseldienst/.cache/endstand-nach/bewegung-ansichten/bewegung-ansichten.mjs

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = '/home/user/schluesseldienst';
const DIST = path.join(ROOT, '.cache/e5-final/dist');
const ASSETS = path.join(DIST, 'assets');
const MODUL_DIR = path.join(ROOT, 'src/assets/js/module');
const PROTOKOLL = path.join(ROOT, '_werkstatt/protokolle/E5-abschluss/endstand-nach');
const CACHE = path.join(ROOT, '.cache/endstand-nach');
const OUT_DIR = path.join(CACHE, 'bewegung-ansichten');
const OUT_JSON = path.join(OUT_DIR, 'bewegung-ansichten.json');
const SELBST = fileURLToPath(import.meta.url);

const WEICH = 12 * 1024;   // 12.288 B
const HART = 60 * 1024;    // 61.440 B
const MODUL_OBERE = 1036;  // groesse.json: abspielen 465 + szene 571 (einzeln gz9)
const BEWEGUNG_RE = /transition|animation|starting-style|view-transition/;
const LAYER_RE = /@layer bewegung\s*\{/g;
const KF_RE = /@keyframes\s+[\w-]+\s*\{/g;
const KOPF_RE = /^\/\/ (?:module|logik)\/[\w-]+\.mjs\s*$|^\/\/ app\.mjs\s*$/;
const BEWEGUNGS_MODULE = ['module/abspielen.mjs', 'module/szene.mjs'];
const BEZEICHNER = ['data-moment', 'Ablauf noch einmal', 'data-szene', 'laeuft', 'szene-figur',
  'szene-schritt', 'szene-liste', 'data-aktiv', '-50% 0px -50% 0px'];
const HAUPT = [
  ['/', '/'],
  ['/einbruchschutz/', '/einbruchschutz/'],
  ['/notoeffnung/tueroeffnung/', '/notoeffnung/tueroeffnung/'],
  ['/preise/', '/preise/'],
  ['/einsatzgebiet/', '/einsatzgebiet/'],
  ['/einsatzgebiet/hessen/limburg-weilburg/', '/einsatzgebiet/hessen/limburg-weilburg/'],
  ['/schluesseldienst-loehnberg/', '/schluesseldienst-loehnberg/'],
  ['/ratgeber/rauchmelderpflicht/', '/ratgeber/rauchmelderpflicht/'],
  ['/ueber-uns/', '/ueber-uns/'],
  ['/kontakt/', '/kontakt/'],
  ['/suche/', '/suche/'],
  ['/impressum/', '/impressum/'],
  ['/gibt-es-nicht/', '/404.html'],
];

const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
const cnt = (s, teil) => s.split(teil).length - 1;
const gelesen = new Map();

function lese(abs) {
  const buf = fs.readFileSync(abs);
  gelesen.set(path.relative(ROOT, abs), { sha256: sha(buf), bytes: buf.length });
  return buf;
}

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.isFile()) out.push(p);
  }
  return out.sort();
}

// gzip Stufe 9: Hauptmessung wie in groesse.json (Python gzip.compress, level 9, mtime 0).
// Kreuzpruefung mit GNU gzip -9 -n; node zlib nur zur Information (weicht ab).
const PY_GZ = 'import sys,gzip\nsys.stdout.write(str(len(gzip.compress(sys.stdin.buffer.read(),compresslevel=9,mtime=0))))\n';
const gzCache = new Map();
const kreuz = { geprueft: 0, cli_gleich: 0, cli_abweichung: [], node_gleich: 0, node_abweichung_anzahl: 0, node_abweichung_beispiele: [] };

function gz(buf, label) {
  const k = sha(buf);
  if (gzCache.has(k)) return gzCache.get(k);
  const r = spawnSync('python3', ['-I', '-c', PY_GZ], { input: buf, maxBuffer: 1 << 20 });
  if (r.status !== 0) throw new Error(`python3 gzip fehlgeschlagen (${label}): ${r.stderr}`);
  const py = Number(String(r.stdout).trim());
  const cli = execFileSync('gzip', ['-9', '-n', '-c'], { input: buf, maxBuffer: 1 << 26 }).length;
  const node = zlib.gzipSync(buf, { level: 9 }).length;
  kreuz.geprueft++;
  if (py === cli) kreuz.cli_gleich++; else kreuz.cli_abweichung.push({ label, py, cli });
  if (py === node) kreuz.node_gleich++;
  else {
    kreuz.node_abweichung_anzahl++;
    if (kreuz.node_abweichung_beispiele.length < 5) kreuz.node_abweichung_beispiele.push({ label, py, node });
  }
  gzCache.set(k, py);
  return py;
}

// Klammerpaar ab Position: liefert [start, ende) des vollstaendigen Blocks.
function blockAt(t, start, offen) {
  let tiefe = 0;
  for (let i = offen; i < t.length; i++) {
    const c = t[i];
    if (c === '{') tiefe++;
    else if (c === '}' && --tiefe === 0) return [start, i + 1];
  }
  throw new Error(`unausgeglichene Klammer ab Position ${start}`);
}

const klasse = (name) => (/^app\./.test(name) ? 'app' : /^druck\./.test(name) ? 'druck'
  : /^kontrast\./.test(name) ? 'kontrast' : 'ansicht');

// CSS-Analyse nach der Abgrenzung von groesse.json:
// Bewegungsanteil = alle @layer bewegung-Bloecke + @keyframes ausserhalb der Ebene;
// Uebergangs-Naeherung = Zeilen mit Schluesselwort, die nicht Teilstring der Ebenen-Bloecke sind.
function analysiere(datei, buf) {
  const t = buf.toString('utf8');
  const layer = [...t.matchAll(LAYER_RE)].map((m) => blockAt(t, m.index, m.index + m[0].length - 1));
  const kf = [...t.matchAll(KF_RE)].map((m) => blockAt(t, m.index, m.index + m[0].length - 1));
  const inLayer = ([a, b]) => layer.some(([ls, le]) => ls <= a && b <= le);
  const kfAussen = kf.filter((r) => !inLayer(r));
  const layerTxt = layer.map(([a, b]) => t.slice(a, b)).join('\n');
  const kfTxt = kfAussen.map(([a, b]) => t.slice(a, b)).join('\n');
  const anteilTxt = (layerTxt + '\n' + kfTxt).trim() + '\n';
  const zeilen = t.split('\n');
  const zusArr = zeilen.filter((z) => BEWEGUNG_RE.test(z) && !layerTxt.includes(z));
  const zusTxt = zusArr.join('\n');
  // Sensitivitaet: positionsgenau ausserhalb der Ebene
  let off = 0;
  const strikt = [];
  let inKf = 0;
  for (const z of zeilen) {
    const a = off;
    const b = off + z.length;
    off = b + 1;
    if (!BEWEGUNG_RE.test(z) || layer.some(([ls, le]) => ls <= a && b <= le)) continue;
    strikt.push(z);
    if (kfAussen.some(([ks, ke]) => ks <= a && b <= ke)) inKf++;
  }
  const striktTxt = strikt.join('\n');
  const rec = {
    datei,
    klasse: klasse(datei),
    roh_bytes: buf.length,
    klammern_auf: cnt(t, '{'),
    klammern_zu: cnt(t, '}'),
    layer_bloecke: layer.length,
    layer_roh: Buffer.byteLength(layerTxt),
    kf_gesamt: kf.length,
    kf_literal_vorkommen: cnt(t, '@keyframes'),
    kf_innen: kf.length - kfAussen.length,
    kf_aussen: kfAussen.length,
    kf_aussen_roh: Buffer.byteLength(kfTxt),
    anteil_roh: Buffer.byteLength(anteilTxt),
    zus_zeilen: zusArr.length,
    zus_roh: Buffer.byteLength(zusTxt),
    zus_zeilen_strikt: strikt.length,
    zus_zeilen_strikt_in_kf: inKf,
    layer_gz: gz(Buffer.from(layerTxt), `${datei} layer`),
    kf_aussen_gz: kfTxt ? gz(Buffer.from(kfTxt), `${datei} kf-aussen`) : 0,
    anteil_gz: gz(Buffer.from(anteilTxt), `${datei} anteil`),
    zus_gz: zusTxt ? gz(Buffer.from(zusTxt), `${datei} zus`) : 0,
    zus_gz_strikt: striktTxt ? gz(Buffer.from(striktTxt), `${datei} zus-strikt`) : 0,
  };
  return {
    rec,
    roh: buf,
    anteilBuf: Buffer.from(anteilTxt),
    zusBuf: zusTxt ? Buffer.from(zusTxt + '\n') : Buffer.alloc(0),
  };
}

// 1) CSS: alle Dateien unter dist/assets
const analysen = new Map();
for (const abs of walk(ASSETS).filter((p) => p.endsWith('.css'))) {
  const name = path.basename(abs);
  analysen.set(name, analysiere(name, lese(abs)));
}

// 2) JS-Bundles: Abschnitte ueber Kopfzeilen (// module/<n>.mjs, // logik/<n>.mjs, // app.mjs)
function abschnitte(t) {
  const zeilen = t.split('\n');
  const kopf = [];
  zeilen.forEach((z, i) => { if (KOPF_RE.test(z)) kopf.push(i); });
  const liste = kopf.map((s, k) => {
    const e = k + 1 < kopf.length ? kopf[k + 1] : zeilen.length;
    return {
      name: zeilen[s].replace(/^\/\/ /, '').trim(),
      zeilen: [s + 1, e],
      txt: zeilen.slice(s, e).join('\n').replace(/\s+$/, '') + '\n',
    };
  });
  return {
    liste,
    erste_kopfzeile: kopf[0] + 1,
    zeilen_gesamt: zeilen.length,
    vor_kopf_nichtleer: zeilen.slice(0, kopf[0]).filter((z) => z.trim() !== '').length,
  };
}

const bundles = new Map();
for (const abs of walk(ASSETS).filter((p) => /\/app\.[0-9a-f]+\.js$/.test(p))) {
  const buf = lese(abs);
  const name = path.basename(abs);
  const t = buf.toString('utf8');
  const { liste, erste_kopfzeile, zeilen_gesamt, vor_kopf_nichtleer } = abschnitte(t);
  const sekt = liste.map((s) => ({
    name: s.name,
    zeilen: s.zeilen,
    roh: Buffer.byteLength(s.txt),
    gz: gz(Buffer.from(s.txt), `${name} ${s.name}`),
  }));
  const beweg = liste.filter((s) => BEWEGUNGS_MODULE.includes(s.name));
  bundles.set(name, {
    datei: path.relative(DIST, abs),
    roh_bytes: buf.length,
    zeilen_gesamt,
    erste_kopfzeile,
    vor_kopf_nichtleer,
    abschnitte: sekt,
    bewegungsmodule: beweg.map((s) => s.name),
    modul_gz: sekt.filter((s) => BEWEGUNGS_MODULE.includes(s.name)).reduce((n, s) => n + s.gz, 0),
    bezeichner: Object.fromEntries(BEZEICHNER.map((id) => [id, {
      gesamt: cnt(t, id),
      im_bewegungsmodul: beweg.reduce((n, s) => n + cnt(s.txt, id), 0),
    }])),
  });
}

// 3) Modul-Quelldateien (Vergleich mit groesse.json)
const abspielenBuf = lese(path.join(MODUL_DIR, 'abspielen.mjs'));
const szeneBuf = lese(path.join(MODUL_DIR, 'szene.mjs'));
const groesseAlt = JSON.parse(lese(path.join(PROTOKOLL, 'groesse.json')).toString('utf8'));
const altAnteil = lese(path.join(CACHE, 'groesse-bewegungsanteil.css'));
lese(path.join(PROTOKOLL, 'groesse/groesse.py'));

// 4) Seiten (alle HTML in dist)
function pfadVon(rel) {
  const r = rel.split(path.sep).join('/');
  const dir = path.posix.dirname(r);
  if (path.posix.basename(r) === 'index.html') return dir === '.' ? '/' : `/${dir}/`;
  return `/${r}`;
}

const kombis = new Map();
function kombi(appName, views, jsName) {
  const key = [appName, ...views].join(',') + '|' + jsName;
  let k = kombis.get(key);
  if (k) return k;
  const teile = [analysen.get(appName), ...views.map((v) => analysen.get(v))];
  const T = Buffer.concat(teile.map((a) => a.anteilBuf));
  const Z = Buffer.concat(teile.map((a) => a.zusBuf));
  const TZ = Buffer.concat([T, Z]);
  const mod = bundles.get(jsName);
  k = {
    id: `K${String(kombis.size + 1).padStart(2, '0')}`,
    app: appName,
    ansichts_css: views,
    js: jsName,
    bewegungsmodule: mod.bewegungsmodule,
    css_bewegung_gz: gz(T, `${key} T`),
    css_bewegung_mit_naeherung_gz: gz(TZ, `${key} T+Z`),
    css_einzelsumme_gz: teile.reduce((n, a) => n + a.rec.anteil_gz, 0),
    modul_gz: mod.modul_gz,
    modul_obere_gz: mod.bewegungsmodule.length ? MODUL_OBERE : 0,
    roh_bewegung: T.length,
    roh_mit_naeherung: TZ.length,
    seiten: 0,
  };
  kombis.set(key, k);
  return k;
}

const htmlAbs = walk(DIST).filter((p) => p.endsWith('.html'));
const seiten = [];
const probleme = [];
for (const abs of htmlAbs) {
  const buf = fs.readFileSync(abs);
  const html = buf.toString('utf8');
  const rel = path.relative(DIST, abs);
  const css = [];
  const js = [];
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = m[0];
    if (!/\brel\s*=\s*["']?stylesheet\b/i.test(tag)) continue;
    const h = /\bhref\s*=\s*["']([^"']+)["']/i.exec(tag);
    if (h) css.push(h[1]);
  }
  for (const m of html.matchAll(/<script\b[^>]*>/gi)) {
    const tag = m[0];
    if (!/\btype\s*=\s*["']module["']/i.test(tag)) continue;
    const s = /\bsrc\s*=\s*["']([^"']+)["']/i.exec(tag);
    if (s) js.push(s[1]);
  }
  const cssNamen = css.map((h) => path.basename(h));
  const app = cssNamen.filter((n) => /^app\./.test(n));
  const views = cssNamen.filter((n) => !/^(app|druck|kontrast)\./.test(n));
  const jsNamen = js.filter((s) => /^\/assets\/app\.[0-9a-f]+\.js$/.test(s)).map((s) => path.basename(s));
  if (!css.every((h) => h.startsWith('/assets/')) || cssNamen.some((n) => !analysen.has(n))) {
    probleme.push({ seite: rel, fehler: 'CSS-Verweis nicht im Build', css });
    continue;
  }
  if (app.length !== 1 || jsNamen.length !== 1 || js.length !== jsNamen.length) {
    probleme.push({ seite: rel, fehler: 'Struktur (app-CSS bzw. Modul-Skript)', app, js });
    continue;
  }
  const k = kombi(app[0], views, jsNamen[0]);
  k.seiten++;
  seiten.push({
    pfad: pfadVon(rel),
    datei: rel.split(path.sep).join('/'),
    sha256: sha(buf),
    kombination: k.id,
    ansichts_css: views,
    js: jsNamen[0],
    anzahl_css_links: css.length,
    code_gz: k.css_bewegung_gz + k.modul_gz,
    code_mit_naeherung_gz: k.css_bewegung_mit_naeherung_gz + k.modul_gz,
    code_obere_gz: k.css_bewegung_gz + k.modul_obere_gz,
    code_obere_mit_naeherung_gz: k.css_bewegung_mit_naeherung_gz + k.modul_obere_gz,
  });
}

// 5) Validierung gegen groesse.json (Methode muss die vorhandenen Werte reproduzieren)
const A = [...analysen.values()].find((a) => a.rec.klasse === 'app');
const gMod = {
  abspielen: gz(abspielenBuf, 'abspielen Quelle'),
  szene: gz(szeneBuf, 'szene Quelle'),
  verkettet: gz(Buffer.concat([abspielenBuf, szeneBuf]), 'Quellen verkettet'),
};
const vergleiche = [
  ['app_anteil_gz', A.rec.anteil_gz, groesseAlt.build_css_bewegungsanteil.anteil_gz9_py],
  ['app_layer_gz', A.rec.layer_gz, groesseAlt.build_css_bewegungsanteil.layer_bewegung_gz9],
  ['app_kf_aussen_roh', A.rec.kf_aussen_roh, groesseAlt.build_css_bewegungsanteil.keyframes_ausserhalb_roh],
  ['app_uebergaenge_naeherung_gz', A.rec.zus_gz, groesseAlt.zusatz_uebergaenge_ausserhalb_layer_naeherung.gz9_py],
  ['app_gesamt_gz', gz(A.roh, 'app gesamt'), groesseAlt.build_css.gz9_gesamt],
  ['abspielen_quelle_gz', gMod.abspielen, groesseAlt.module_quelle.abspielen.gz9_py],
  ['szene_quelle_gz', gMod.szene, groesseAlt.module_quelle.szene.gz9_py],
  ['module_summe_gz', gMod.abspielen + gMod.szene, groesseAlt.module_summe_beide_einzeln_gz9],
  ['module_verkettet_gz', gMod.verkettet, groesseAlt.module_verkettet_beide_gz9],
  ['summe_css_plus_module', A.rec.anteil_gz + gMod.abspielen + gMod.szene, groesseAlt.summe.bewegung_plus_module_einzeln_gz9],
].map(([name, neu, alt]) => ({ name, neu, alt, ok: neu === alt }));
const anteilIdentisch = Buffer.compare(A.anteilBuf, altAnteil) === 0;
const validierung = {
  vergleiche,
  anteil_datei_byte_identisch_mit_groesse_bewegungsanteil: anteilIdentisch,
  alle_ok: anteilIdentisch && vergleiche.every((v) => v.ok),
};

// 6) Auswertung
const MASSE = [
  ['code_gz', 'Bewegungscode: CSS (ohne Naeherung) + Bewegungsmodul gemessen'],
  ['code_mit_naeherung_gz', 'Bewegungscode mit Uebergangs-Naeherung + Bewegungsmodul gemessen'],
  ['code_obere_gz', 'Obere Schaetzung: CSS (ohne Naeherung) + 1036 B bei Bewegungsmodul'],
  ['code_obere_mit_naeherung_gz', 'Obere Schaetzung: CSS mit Naeherung + 1036 B bei Bewegungsmodul'],
];
const maximum = {};
const budget = {};
for (const [m] of MASSE) {
  const max = Math.max(...seiten.map((s) => s[m]));
  const tr = seiten.filter((s) => s[m] === max);
  maximum[m] = { wert: max, anzahl_seiten_mit_wert: tr.length, kombination: tr[0].kombination, beispiel_seiten: tr.slice(0, 12).map((s) => s.pfad) };
  budget[m] = {
    ueber_weich_12288: seiten.filter((s) => s[m] > WEICH).length,
    ueber_hart_61440: seiten.filter((s) => s[m] > HART).length,
  };
}

const hauptansichten = HAUPT.map(([anzeige, pfad]) => {
  const s = seiten.find((x) => x.pfad === pfad);
  if (!s) return { anzeige, fehlt: true };
  return {
    anzeige,
    pfad: s.pfad,
    ersatz_fuer: anzeige === pfad ? null : anzeige,
    datei: s.datei,
    kombination: s.kombination,
    ansichts_css: s.ansichts_css,
    js: s.js,
    code_gz: s.code_gz,
    code_mit_naeherung_gz: s.code_mit_naeherung_gz,
    code_obere_gz: s.code_obere_gz,
    code_obere_mit_naeherung_gz: s.code_obere_mit_naeherung_gz,
  };
});

const cssAusgabe = [...analysen.values()].map((a) => ({
  ...a.rec,
  gemessen_fuer_seiten: a.rec.klasse === 'ansicht' || a.rec.klasse === 'app',
  verwendet_von_seiten: a.rec.klasse === 'app'
    ? seiten.length
    : seiten.filter((s) => s.ansichts_css.includes(a.rec.datei)).length,
}));

const bemerkungen = [
  'Hauptmessung: Python gzip.compress(level 9, mtime 0), wie groesse.json. GNU gzip -9 -n stimmt bei allen Bewegungswerten mit Python ueberein (kreuzpruefung.cli_gleich); einzige Abweichung ist app.css gesamt (10687 Python gegen 10615 CLI), das ist kein Bewegungswert. node zlib weicht bei vielen Werten ab (z. B. app-Anteil 1310 statt 1313) und wird nicht verwendet.',
  'Bewegungscode je Seite = gz(app-Bewegung + Ansichts-CSS-Bewegung als ein Text, Dateien in Dokumentreihenfolge) + Bewegungsmodul. Die Einzelsumme (css_einzelsumme_gz) liegt in allen Kombinationen ueber dem Konkatenationswert; sie ist eine Schranke, kein Messwert.',
  'Leere Bewegungsanteile (Datei ohne @layer bewegung und ohne Keyframes) tragen nur das Zeilenende bei (1 B). Ort-CSS (5252 Seiten) hat keine Ebene; ihre zwei transition-Zeilen zaehlen nur in der Naeherung.',
  'Mit Naeherung: gz(Bewegungsteile + Naeherungsteile). Die Naeherung folgt der Zeilenregel aus groesse.json (Teilstring-Ausschluss gegen die Ebenen-Bloecke). Die positionsgenaue Variante steht je CSS-Datei als zus_gz_strikt; Zeilen in Keyframes ausserhalb der Ebene zaehlen in der Naeherung doppelt (zus_zeilen_strikt_in_kf).',
  'Bundles sind nicht minifiziert. Die Bewegungsmodule werden als Abschnitt zwischen den Kopfzeilen gemessen (Kopfzeile plus Code, ohne export-Schluesselwort). Das Ergebnis (szene 579, abspielen 468) liegt wegen der Kopfzeile knapp ueber den Quelldateien (571/465). 1036 B bleibt als obere Schaetzung ausgewiesen; bei der Seite / (nur abspielen) ist 1036 ebenfalls eine obere Schranke.',
  'Gemessen wird nur, was die Vorgabe nennt: app.*, Ansichts-CSS (ohne druck.* und kontrast.*) und die Module abspielen und szene. Im Build gibt es keine Inline-Styles mit Bewegung, keine Inline-Skripte ausser JSON-LD, kein @import, keine CSS-Kommentare und keine CR-Zeilenenden.',
  'druck.css (media=print) enthaelt je eine transition- und animation-Zeile ausserhalb der Ebene; sie ist nicht gezaehlt. kontrast.css enthaelt keine Bewegung.',
  '/gibt-es-nicht/ existiert im Build nicht. Gemessen wurde 404.html.',
  'In der MODULE-Map des app.mjs-Abschnitts steht der Schluessel szene; dieser Eintrag und der gemeinsame app.mjs-Code sind nicht gezaehlt.',
];

const out = {
  zeitstempel: new Date().toISOString(),
  werkzeug: 'bewegung-ansichten.mjs (Haiku-Messer)',
  skript: { datei: path.relative(ROOT, SELBST), sha256: sha(fs.readFileSync(SELBST)) },
  methode: {
    hauptmessung: 'Python 3 gzip.compress(level 9, mtime 0) (Methode groesse.json)',
    kreuzpruefung: 'GNU gzip -9 -n -c',
    nicht_verwendet: 'node zlib level 9 (weicht ab)',
    bewegungsanteil_css: 'alle @layer bewegung-Bloecke (vollstaendig, Klammern gezaehlt) + @keyframes ausserhalb der Ebene, Text je Datei wie groesse-bewegungsanteil.css',
    uebergaenge_naeherung: 'Zeilen mit transition|animation|starting-style|view-transition, die nicht Teilstring der Ebenen-Bloecke sind (wie groesse.json)',
    seite: 'gz(app + Ansichts-CSS, Dokumentreihenfolge) + Bewegungsmodul (Abschnitt im geladenen Bundle, gz einzeln)',
    bundles: 'Abschnitte per Kopfzeile // module/<n>.mjs | // logik/<n>.mjs | // app.mjs',
    budget: 'weich 12.288 B, hart 61.440 B (gz)',
  },
  validierung_gegen_groesse_json: validierung,
  kreuzpruefung: kreuz,
  html: {
    anzahl: htmlAbs.length,
    verarbeitet: seiten.length,
    probleme: probleme.length,
    manifest_sha256: sha(Buffer.from(seiten.map((s) => `${s.datei} ${s.sha256}`).sort().join('\n') + '\n')),
  },
  gelesene_dateien: Object.fromEntries([...gelesen.entries()].sort((a, b) => a[0].localeCompare(b[0]))),
  css: cssAusgabe,
  bundles: [...bundles.entries()].map(([name, b]) => ({ name, ...b })),
  kombinationen: [...kombis.values()],
  hauptansichten,
  maximum,
  budget,
  probleme,
  bemerkungen,
  seiten,
};

fs.writeFileSync(OUT_JSON, JSON.stringify(out, null, 2) + '\n');

// Kurzausgabe
console.log(`Zeitstempel ${out.zeitstempel}`);
console.log(`Validierung gegen groesse.json: ${validierung.alle_ok ? 'OK' : 'ABWEICHUNG'}`);
for (const v of vergleiche) console.log(`  ${v.ok ? 'ok ' : 'ABW'} ${v.name}: neu=${v.neu} alt=${v.alt}`);
console.log(`  anteil-Datei byte-identisch: ${anteilIdentisch}`);
console.log(`Kreuzpruefung gzip-CLI: ${kreuz.cli_gleich}/${kreuz.geprueft} gleich; node zlib abweichend: ${kreuz.node_abweichung_anzahl}`);
console.log(`HTML: ${htmlAbs.length} gefunden, ${seiten.length} verarbeitet, Probleme ${probleme.length}`);
console.log(`Kombinationen: ${kombis.size}`);
for (const [m, desc] of MASSE) console.log(`${m}: max=${maximum[m].wert} (${maximum[m].anzahl_seiten_mit_wert} Seiten, ${maximum[m].kombination}, z. B. ${maximum[m].beispiel_seiten[0]}); ueber weich ${budget[m].ueber_weich_12288}, ueber hart ${budget[m].ueber_hart_61440}`);
console.log(`geschrieben: ${OUT_JSON}`);
