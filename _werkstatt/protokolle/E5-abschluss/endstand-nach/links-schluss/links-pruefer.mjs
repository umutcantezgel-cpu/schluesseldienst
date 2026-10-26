// Z-10 Linkprüfung, nur Lesen im Repo. Basis: links-md.mjs (E5-abschluss/z-pruefer).
// Abweichungen: Aufgabenliste, Ausgabe nur im eigenen Ordner, Anker wie GitHub
// (Unterstrich bleibt, doppelte Überschriften bekommen -1, -2, Code-Blöcke ignoriert),
// Backtick-Pfade (_werkstatt/, docs/, src/, bau/, test/) auf Existenz geprüft.
import { readFileSync, existsSync, statSync, writeFileSync, readdirSync, globSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const W = '/home/user/schluesseldienst';
const AUSGABE = `${W}/.cache/endstand-nach/links-schluss/links.json`;

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
const DOCS = readdirSync(`${W}/docs`)
  .filter((f) => statSync(`${W}/docs/${f}`).isFile())
  .sort()
  .map((f) => `docs/${f}`);
const DATEIEN = [...new Set([...FEST, ...DOCS])];

const PRE = ['_werkstatt/', 'docs/', 'src/', 'bau/', 'test/'];

const ohneBloecke = (t) => t
  .replace(/```[\s\S]*?```/g, (m) => m.replace(/[^\n]/g, ' '))
  .replace(/~~~[\s\S]*?~~~/g, (m) => m.replace(/[^\n]/g, ' '));
const ohneCode = (t) => ohneBloecke(t).replace(/`[^`\n]*`/g, (m) => ' '.repeat(m.length));

// GitHub-Slug: Markup und HTML weg, klein, nur Buchstaben/Ziffern/Unterstrich/Bindestrich, Leerzeichen zu Bindestrich
const slug = (t) => t
  .replace(/<[^>]+>/g, '')
  .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
  .replace(/[`*]/g, '')
  .trim()
  .toLowerCase()
  .replace(/[^\p{L}\p{M}\p{N}\s_-]/gu, '')
  .replace(/ /g, '-');

function ankerIn(text) {
  const t = ohneBloecke(text);
  const ids = new Set();
  const zaehler = new Map();
  for (const zeile of t.split('\n')) {
    const m = /^ {0,3}#{1,6}\s+(.+?)(?:\s+#+)?\s*$/.exec(zeile);
    if (!m) continue;
    const basis = slug(m[1]);
    const n = zaehler.get(basis) ?? 0;
    zaehler.set(basis, n + 1);
    ids.add(n === 0 ? basis : `${basis}-${n}`);
  }
  for (const m of t.matchAll(/\b(?:id|name)="([^"]+)"/g)) ids.add(m[1]);
  return ids;
}

const dekod = (s) => { try { return decodeURIComponent(s); } catch { return s; } };

const tot = [];
const hinweise = [];
const dateienInfo = [];
const pfadFehlend = [];
const pfadPlatzhalter = [];
const pfadDistinct = new Set();
const symbolHinweise = [];
let geprueftLinks = 0;
let refLinks = 0;
let ankerGeprueft = 0;
let ankerNichtMd = 0;
let pfadFundstellen = 0;
let pfadOk = 0;

for (const d of DATEIEN) {
  const pfad = resolve(W, d);
  const text = readFileSync(pfad, 'utf8');
  const zeilen = ohneCode(text).split('\n');
  let n = 0;
  let nRef = 0;
  zeilen.forEach((zeile, i) => {
    const ziele = [];
    for (const m of zeile.matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) ziele.push({ ziel: m[1], ref: false });
    const r = /^ {0,3}\[[^\]]+\]:\s*(\S+)/.exec(zeile);
    if (r) ziele.push({ ziel: r[1], ref: true });
    for (const { ziel, ref } of ziele) {
      if (/^(https?:|mailto:|tel:|ftp:)/i.test(ziel) || ziel.startsWith('//')) continue;
      n += 1; geprueftLinks += 1;
      if (ref) { nRef += 1; refLinks += 1; }
      const [teil, ...rest] = ziel.split('#');
      const anchor = rest.length ? rest.join('#') : null;
      const pfadTeil = teil.split('?')[0];
      let zielDatei;
      if (!pfadTeil) zielDatei = pfad;
      else if (pfadTeil.startsWith('/')) {
        zielDatei = resolve(W, dekod(pfadTeil).slice(1));
        hinweise.push({ datei: d, zeile: i + 1, link: ziel, hinweis: 'absoluter Pfad, als Repo-Wurzel gelesen' });
      } else zielDatei = resolve(dirname(pfad), dekod(pfadTeil));
      let grund = null;
      if (!existsSync(zielDatei)) grund = 'Ziel fehlt';
      else if (anchor) {
        if (statSync(zielDatei).isFile() && zielDatei.endsWith('.md')) {
          ankerGeprueft += 1;
          const ids = ankerIn(readFileSync(zielDatei, 'utf8'));
          if (!ids.has(dekod(anchor))) grund = `Anker #${anchor} fehlt`;
        } else if (statSync(zielDatei).isFile()) {
          ankerNichtMd += 1;
          hinweise.push({ datei: d, zeile: i + 1, link: ziel, hinweis: 'Anker in Nicht-.md-Ziel nicht geprüft' });
        }
      }
      if (grund) tot.push({ datei: d, zeile: i + 1, link: ziel, grund });
    }
  });

  // Backtick-Pfade (inline), Fenced-Blöcke ausgenommen
  const zeilenBT = ohneBloecke(text).split('\n');
  zeilenBT.forEach((zeile, i) => {
    for (const m of zeile.matchAll(/`([^`\n]+)`/g)) {
      const inh = m[1].trim();
      if (!PRE.some((p) => inh.startsWith(p))) continue;
      if (/[<>{}…]|\.\.\./.test(inh)) {
        pfadPlatzhalter.push({ datei: d, zeile: i + 1, pfad: inh });
        continue;
      }
      // Pfad = erstes Wort; Rest (z. B. „→ zusagen“) ist ein Symbolhinweis, kein Teil des Pfads
      const ersterTeil = inh.split(/\s+/)[0];
      const zusatz = inh.slice(ersterTeil.length).trim();
      const sauber = ersterTeil.replace(/:\d+(?:-\d+)?$/, '').split('#')[0];
      pfadFundstellen += 1;
      pfadDistinct.add(sauber);
      let ok;
      let grund = null;
      if (/[*?\[]/.test(sauber)) {
        let treffer = [];
        try { treffer = globSync(sauber, { cwd: W }); } catch { treffer = []; }
        ok = treffer.length > 0;
        if (!ok) grund = 'Muster ohne Treffer';
      } else {
        ok = existsSync(resolve(W, sauber));
        if (!ok) grund = 'Pfad fehlt';
      }
      if (ok) pfadOk += 1;
      else pfadFehlend.push({ datei: d, zeile: i + 1, pfad: inh, grund });
      if (ok && zusatz) {
        // Symbolhinweis: jedes Segment des Symbols muss im Text der Datei vorkommen
        const symbol = zusatz.replace(/^→\s*/, '');
        const segmente = symbol.split('.').map((s) => s.trim()).filter(Boolean);
        const ziel = resolve(W, sauber);
        const zielText = statSync(ziel).isFile() ? readFileSync(ziel, 'utf8') : '';
        const fehlt = segmente.some((s) => /^[\p{L}\p{N}_$-]+$/u.test(s) && !zielText.includes(s));
        symbolHinweise.push({ datei: d, zeile: i + 1, pfad: sauber, zusatz, status: fehlt ? 'Symbol nicht im Dateitext gefunden' : 'Datei existiert, Symbol im Text gefunden' });
      }
    }
  });

  dateienInfo.push({ datei: d, relativeLinks: n, referenzDefinitionen: nRef });
}

const ergebnis = {
  werkzeug: 'links-pruefer (Basis links-md.mjs, Z-10)',
  zeitpunkt: new Date().toISOString(),
  basis: W,
  dateien: dateienInfo,
  geprueftLinks,
  davonReferenzDefinitionen: refLinks,
  ankerGeprueft,
  ankerNichtMdGeprueftNicht: ankerNichtMd,
  tot,
  pfade: {
    fundstellen: pfadFundstellen,
    verschiedene: pfadDistinct.size,
    ok: pfadOk,
    fehlend: pfadFehlend,
    platzhalterAusgenommen: pfadPlatzhalter,
    symbolHinweise,
  },
  hinweise,
};
writeFileSync(AUSGABE, JSON.stringify(ergebnis, null, 2) + '\n');

console.log(`Dateien: ${DATEIEN.length}`);
console.log(`geprüfte relative Links: ${geprueftLinks} (davon Referenz-Definitionen: ${refLinks}), Anker geprüft: ${ankerGeprueft}`);
console.log(`tote Links: ${tot.length}`);
for (const t of tot) console.log(`TOT ${t.datei}:${t.zeile} → ${t.link} (${t.grund})`);
console.log(`geprüfte Backtick-Pfade: ${pfadFundstellen} Fundstellen, ${pfadDistinct.size} verschiedene, ok ${pfadOk}, fehlend ${pfadFehlend.length}, Platzhalter ausgenommen ${pfadPlatzhalter.length}`);
for (const p of pfadFehlend) console.log(`FEHLT ${p.datei}:${p.zeile} → ${p.pfad} (${p.grund})`);
for (const p of pfadPlatzhalter) console.log(`PLATZHALTER ${p.datei}:${p.zeile} → ${p.pfad}`);
for (const s of symbolHinweise) console.log(`SYMBOL ${s.datei}:${s.zeile} → ${s.pfad} ${s.zusatz} (${s.status})`);
for (const h of hinweise) console.log(`HINWEIS ${h.datei}:${h.zeile} → ${h.link} (${h.hinweis})`);
console.log(`Ausgabe: ${AUSGABE}`);
