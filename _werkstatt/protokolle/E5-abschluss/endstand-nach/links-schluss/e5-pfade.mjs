// Zusatzprüfung: Backtick-Pfade, die nicht mit _werkstatt/, docs/, src/, bau/, test/ beginnen,
// werden relativ zu _werkstatt/protokolle/E5-abschluss/ aufgelöst (nur Lesen, Ausgabe nur in links-schluss/).
import { readFileSync, existsSync, statSync, writeFileSync, readdirSync, globSync } from 'node:fs';
import { resolve } from 'node:path';

const W = '/home/user/schluesseldienst';
const E5 = `${W}/_werkstatt/protokolle/E5-abschluss`;
const AUSGABE = `${W}/.cache/endstand-nach/links-schluss/e5-pfade.json`;

const FEST = [
  'README.md',
  '_werkstatt/ENTSCHEIDUNGEN.md',
  '_werkstatt/PLAN.md',
  '_werkstatt/BERICHT.md',
  '_werkstatt/KERN.md',
  '_werkstatt/MENSCHEN.md',
  '_werkstatt/ABNAHME.md',
  '_werkstatt/berichte/E5-abschluss-pruefung.md',
  '_werkstatt/berichte/E5-abschlusspruefer.md',
];
const DOCS = readdirSync(`${W}/docs`).filter((f) => statSync(`${W}/docs/${f}`).isFile()).sort().map((f) => `docs/${f}`);
const DATEIEN = [...new Set([...FEST, ...DOCS])];
const PRE = ['_werkstatt/', 'docs/', 'src/', 'bau/', 'test/'];

const ohneBloecke = (t) => t
  .replace(/```[\s\S]*?```/g, (m) => m.replace(/[^\n]/g, ' '))
  .replace(/~~~[\s\S]*?~~~/g, (m) => m.replace(/[^\n]/g, ' '));

const kandidaten = [];
for (const d of DATEIEN) {
  const text = readFileSync(resolve(W, d), 'utf8');
  ohneBloecke(text).split('\n').forEach((zeile, i) => {
    for (const m of zeile.matchAll(/`([^`\n]+)`/g)) {
      const inh = m[1].trim();
      if (PRE.some((p) => inh.startsWith(p))) continue;
      if (/^(https?:|\/|<|\.\.)/.test(inh) || inh.includes('://')) continue;
      const erster = inh.split(/\s+/)[0];
      if (!erster.includes('/') && !/\.[a-z0-9]{1,5}$/i.test(erster)) continue;
      if (/[<>{}…]|\.\.\./.test(erster)) { kandidaten.push({ datei: d, zeile: i + 1, pfad: inh, art: 'Platzhalter' }); continue; }
      const sauber = erster.replace(/:\d+(?:-\d+)?$/, '').split('#')[0];
      kandidaten.push({ datei: d, zeile: i + 1, pfad: inh, sauber, art: 'pfad' });
    }
  });
}

const pruefe = (base, p) => {
  if (/[*?\[]/.test(p)) {
    try { return globSync(p, { cwd: base }).length > 0; } catch { return false; }
  }
  return existsSync(resolve(base, p));
};

const ergebnis = { werkzeug: 'e5-pfade (Zusatzprüfung, Auflösung relativ zu _werkstatt/protokolle/E5-abschluss/)', zeitpunkt: new Date().toISOString(), e5: E5, kandidaten: 0, ok: [], nurRepo: [], fehlt: [], platzhalter: [], cacheVorhanden: [] };

const seen = new Set();
for (const k of kandidaten) {
  if (k.art === 'Platzhalter') { ergebnis.platzhalter.push({ datei: k.datei, zeile: k.zeile, pfad: k.pfad }); continue; }
  const key = `${k.datei}|${k.sauber}`;
  ergebnis.kandidaten += seen.has(key) ? 0 : 1;
  seen.add(key);
  const inE5 = pruefe(E5, k.sauber);
  const inRepo = pruefe(W, k.sauber);
  const rest = { datei: k.datei, zeile: k.zeile, pfad: k.pfad };
  if (k.sauber.startsWith('endstand-nach/links-schluss')) {
    const cache = pruefe(`${W}/.cache`, k.sauber);
    ergebnis.cacheVorhanden.push({ ...rest, inCache: cache, hinweis: 'zählt als vorhanden, wenn .cache/endstand-nach/links-schluss/ existiert; wird nach Prüfung ins Repo kopiert' });
    continue;
  }
  if (inE5) ergebnis.ok.push({ ...rest, aufgeloestSeit: 'E5', geprueft: k.sauber });
  else if (inRepo) ergebnis.nurRepo.push({ ...rest, hinweis: 'nur relativ zum Repo-Stamm vorhanden, nicht unter E5' });
  else ergebnis.fehlt.push({ ...rest, geprueft: k.sauber });
}

writeFileSync(AUSGABE, JSON.stringify(ergebnis, null, 2) + '\n');
console.log(`Kandidaten (ohne Repo-Präfix): ${ergebnis.kandidaten}`);
console.log(`unter E5 vorhanden: ${ergebnis.ok.length}; nur Repo-Stamm: ${ergebnis.nurRepo.length}; fehlt in beiden: ${ergebnis.fehlt.length}; Cache-Sonderfall: ${ergebnis.cacheVorhanden.length}; Platzhalter: ${ergebnis.platzhalter.length}`);
for (const f of ergebnis.fehlt) console.log(`FEHLT ${f.datei}:${f.zeile} → ${f.pfad} (geprüft: ${f.geprueft})`);
for (const f of ergebnis.nurRepo) console.log(`NURREPO ${f.datei}:${f.zeile} → ${f.pfad}`);
for (const f of ergebnis.cacheVorhanden) console.log(`CACHE ${f.datei}:${f.zeile} → ${f.pfad} (inCache=${f.inCache})`);
console.log(`Ausgabe: ${AUSGABE}`);
