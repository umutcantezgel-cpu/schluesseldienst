// Z-09/Z-02 Prüfstufe C: Zufallsstichprobe der übrigen Nicht-Ortsseiten (Saat 20261026, mulberry32, teilweises Fisher-Yates).
import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = '/home/user/schluesseldienst/.cache/e5-final/dist';
const SAAT = 20261026;
const ORDNER = '/home/user/schluesseldienst/.cache/z09-stichprobe';
const HAUPT = ['/', '/einbruchschutz/', '/notoeffnung/tueroeffnung/', '/preise/', '/einsatzgebiet/',
  '/einsatzgebiet/hessen/limburg-weilburg/', '/schluesseldienst-loehnberg/', '/ratgeber/rauchmelderpflicht/',
  '/ueber-uns/', '/kontakt/', '/suche/', '/impressum/', '/gibt-es-nicht/'];

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

function alleIndex(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) alleIndex(p, out);
    else if (name === 'index.html') out.push(p);
  }
  return out;
}

const alle = alleIndex(DIST);
const urlVon = (datei) => {
  const rel = relative(DIST, datei).split(sep).join('/');
  return '/' + rel.replace(/index\.html$/, '');
};
const alleUrls = alle.map(urlVon).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
const ortsseiten = alleUrls.filter((u) => /^\/schluesseldienst-[^/]+\/$/.test(u));
const restRoh = alleUrls.filter((u) => !/^\/schluesseldienst-/.test(u));
const hauptImPool = HAUPT.filter((h) => restRoh.includes(h));
const hauptNichtGefunden = HAUPT.filter((h) => !restRoh.includes(h));
const grundgesamtheit = restRoh.filter((u) => !HAUPT.includes(u));

const n = Math.max(30, Math.ceil(grundgesamtheit.length * 0.1));
const rnd = mulberry32(SAAT);
const liste = grundgesamtheit.slice();
for (let i = 0; i < n; i++) {
  const j = i + Math.floor(rnd() * (liste.length - i));
  [liste[i], liste[j]] = [liste[j], liste[i]];
}
const stichprobeReihenfolge = liste.slice(0, n);
const stichprobeSortiert = stichprobeReihenfolge.slice().sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

const zahl = {
  alleIndexHtml: alle.length,
  ortsseitenWurzel: ortsseiten.length,
  nichtOrtsseitenRoh: restRoh.length,
  hauptansichtenImPool: hauptImPool.length,
  hauptansichtenNichtGefunden: hauptNichtGefunden,
  grundgesamtheit: grundgesamtheit.length,
  stichprobeGroesse: n,
  anteilProzent: +(100 * n / grundgesamtheit.length).toFixed(2),
  ratgeberSchluesseldienstSeiten: restRoh.filter((u) => /\/schluesseldienst-[^/]+\/$/.test(u) && !/^\/schluesseldienst-/.test(u)),
};

const ausgabe = {
  werkzeug: 'z09-stichprobe/ziehe.mjs',
  basis: DIST,
  saat: SAAT,
  verfahren: 'mulberry32(Saat) (Implementierung wie _werkstatt/werkzeuge/ortsstichprobe.mjs) mit teilweisem Fisher-Yates ueber die nach Pfad (Codepunkt-Vergleich) sortierte Grundgesamtheit; Anzahl = max(30, ceil(0,10 * N))',
  definition: {
    grundgesamtheit: 'alle index.html unter .cache/e5-final/dist ohne Ortsseiten (Wurzelordner beginnt mit schluesseldienst-) und ohne die aufgelisteten Hauptansichten; 404.html ist keine index.html und entfaellt',
    hinweis: '/schluesseldienst-loehnberg/ ist eine Ortsseite und entfaellt bereits durch die Ortsseiten-Regel; /gibt-es-nicht/ hat keine index.html in dist',
  },
  zaehlung: zahl,
  grundgesamtheitPfade: grundgesamtheit,
  stichprobeNichtOrtsseiten: { reihenfolgeDerZiehung: stichprobeReihenfolge, sortiert: stichprobeSortiert },
};
writeFileSync(join(ORDNER, 'stichprobe-rest-zaehlung.json'), JSON.stringify(ausgabe, null, 2) + '\n');
console.log(JSON.stringify(zahl, null, 2));
console.log('Stichprobe (sortiert):');
console.log(stichprobeSortiert.join('\n'));
