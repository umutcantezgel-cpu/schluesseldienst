// herkunft.mjs – prüft die Herkunft des E2-Vergleichsbaus (Commit 7422b0f).
// Liest nur: git archive (lesend), e2-quelle/, e2-dist/, e2-bau.log, _werkstatt-Belege (nicht benötigt).
// Schreibt ausschließlich in den Ordner dieses Skripts (herkunft/): archiv/, dist/, dist-ohne-datum/, herkunft.json.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, readdir, lstat, rm, mkdir, writeFile, stat } from 'node:fs/promises';
import { join, relative, dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const HIER = dirname(fileURLToPath(import.meta.url));
const CACHE = resolve(HIER, '..');
const REPO = '/home/user/schluesseldienst';
const COMMIT = '7422b0f';
const ARCHIV_PFADE = ['bau', 'src', 'package.json'];
const DATUM = '2026-10-25';
const QUELLE = join(CACHE, 'e2-quelle');
const E2_DIST = join(CACHE, 'e2-dist');
const E2_LOG = join(CACHE, 'e2-bau.log');
const ARCHIV = join(HIER, 'archiv');
const DIST = join(HIER, 'dist');
const DIST_OHNE_DATUM = join(HIER, 'dist-ohne-datum');
// Vom Bau selbst geschrieben (bau/bauen.mjs, Zeilen 233-234): Build-Bericht im Quellordner, kein Quelltext.
const BAU_ARTEFAKTE = ['.cache/bau-bericht.json'];

function sicher(pfad) {
  const voll = resolve(pfad);
  if (!voll.startsWith(HIER + sep)) throw new Error(`Schreibverbot außerhalb von herkunft/: ${voll}`);
  return voll;
}

async function baum(wurzel) {
  const karte = new Map();
  const gehe = async (ordner) => {
    for (const e of await readdir(ordner, { withFileTypes: true })) {
      const voll = join(ordner, e.name);
      const rel = relative(wurzel, voll).split(sep).join('/');
      if (e.isDirectory()) await gehe(voll);
      else if (e.isFile()) {
        const buf = await readFile(voll);
        const st = await lstat(voll);
        karte.set(rel, { sha256: createHash('sha256').update(buf).digest('hex'), bytes: buf.length, modus: (st.mode & 0o777).toString(8) });
      } else karte.set(rel, { sonderform: e.isSymbolicLink() ? 'symlink' : 'anderer Typ' });
    }
  };
  await gehe(wurzel);
  return karte;
}

// Vergleich in beide Richtungen. `ignoriert` gilt nur für die Seite B (Quelle) und wird ausgewiesen.
function vergleiche(a, b, ignoriert = []) {
  const kA = [...a.keys()];
  const kB = [...b.keys()].filter((k) => !ignoriert.includes(k));
  const gemeinsam = kA.filter((k) => b.has(k) && !ignoriert.includes(k));
  const sortiert = (xs) => [...xs].sort();
  return {
    dateienA: kA.length,
    dateienB: kB.length,
    gleich: gemeinsam.filter((k) => !a.get(k).sonderform && a.get(k).sha256 === b.get(k).sha256).length,
    nurInA: sortiert(kA.filter((k) => !b.has(k))),
    nurInB: sortiert(kB.filter((k) => !a.has(k))),
    abweichend: sortiert(gemeinsam.filter((k) => a.get(k).sha256 !== b.get(k).sha256)),
    modusAbweichend: sortiert(gemeinsam.filter((k) => a.get(k).modus !== b.get(k).modus)),
    ignoriertVorhanden: ignoriert.filter((k) => b.has(k)),
  };
}

const istIdentisch = (v) => v.nurInA.length === 0 && v.nurInB.length === 0 && v.abweichend.length === 0;

async function archivAufbauen() {
  await rm(sicher(ARCHIV), { recursive: true, force: true });
  await mkdir(ARCHIV, { recursive: true });
  const tar = execFileSync('git', ['-C', REPO, 'archive', COMMIT, ...ARCHIV_PFADE], { maxBuffer: 1 << 30 });
  execFileSync('tar', ['-x', '-C', ARCHIV], { input: tar });
}

// Baut mit dem Generator aus `cwd`; mit `mitDatum` wird --datum=2026-10-25 übergeben.
function baue(cwd, aus, mitDatum) {
  const args = ['bau/bauen.mjs', '--messen', `--aus=${aus}`];
  if (mitDatum) args.push(`--datum=${DATUM}`);
  const befehl = `node ${args.join(' ')}`;
  try {
    const stdout = execFileSync(process.execPath, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { befehl, cwd, exitCode: 0, stdout };
  } catch (e) {
    return { befehl, cwd, exitCode: e.status, stdout: e.stdout || '', stderr: e.stderr || '' };
  }
}

const normMs = (s) => s.replace(/\d+ ms/g, 'N ms').trim();

function berichtOhneMs(text) {
  const o = JSON.parse(text);
  delete o.ms;
  return o;
}

function vergleichBericht(a, b) {
  const schluessel = [...new Set([...Object.keys(a), ...Object.keys(b)])].sort();
  const ab = [];
  for (const k of schluessel) if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) ab.push(k);
  return ab;
}

async function main() {
  const zeitstempel = new Date().toISOString();
  const commitInfo = execFileSync('git', ['-C', REPO, 'log', '-1', '--format=%H%n%cI%n%s', COMMIT], { encoding: 'utf8' }).trim().split('\n');

  // Schritt 1: Archiv entpacken und mit e2-quelle vergleichen
  await archivAufbauen();
  const baumArchiv = await baum(ARCHIV);
  const baumQuelle = await baum(QUELLE);
  const schritt1 = {
    befehl: `git -C ${REPO} archive ${COMMIT} ${ARCHIV_PFADE.join(' ')} | tar -x -C ${ARCHIV}`,
    ohneIgnorierung: vergleiche(baumArchiv, baumQuelle, []),
    ignoriert: BAU_ARTEFAKTE,
  };
  schritt1.mitIgnorierung = vergleiche(baumArchiv, baumQuelle, BAU_ARTEFAKTE);
  schritt1.gleich = istIdentisch(schritt1.mitIgnorierung);

  // Schritt 2: Archiv-Quelle mit dem Befehl des Bau-Protokolls bauen und mit e2-dist vergleichen
  await rm(sicher(DIST), { recursive: true, force: true });
  const bau = baue(ARCHIV, DIST, true);
  const logArchiv = normMs(bau.stdout);
  const logRef = normMs(await readFile(E2_LOG, 'utf8'));
  const berichtArchiv = await readFile(join(ARCHIV, '.cache/bau-bericht.json'), 'utf8');
  const berichtRef = await readFile(join(QUELLE, '.cache/bau-bericht.json'), 'utf8');
  const berichtAb = vergleichBericht(berichtOhneMs(berichtArchiv), berichtOhneMs(berichtRef));
  const baumDist = await baum(DIST);
  const baumE2Dist = await baum(E2_DIST);
  const schritt2 = {
    befehl: bau.befehl,
    cwd: ARCHIV,
    exitCode: bau.exitCode,
    nodeVersion: process.version,
    logGleich: logArchiv === logRef,
    logArchiv,
    logReferenz: logRef,
    berichtAbweichendeSchluessel: berichtAb,
    berichtArchiv: berichtOhneMs(berichtArchiv),
    distVergleich: vergleiche(baumDist, baumE2Dist, []),
  };
  schritt2.gleich = bau.exitCode === 0 && schritt2.logGleich && berichtAb.length === 0 && istIdentisch(schritt2.distVergleich);

  // Datumsprobe: derselbe Bau ohne --datum (Datum käme dann aus git log im Arbeitsbaum)
  await rm(sicher(DIST_OHNE_DATUM), { recursive: true, force: true });
  const ohne = baue(ARCHIV, DIST_OHNE_DATUM, false);
  const berichtOhne = JSON.parse(await readFile(join(ARCHIV, '.cache/bau-bericht.json'), 'utf8'));
  const baumOhne = await baum(DIST_OHNE_DATUM);
  const datumsprobe = {
    befehl: ohne.befehl,
    exitCode: ohne.exitCode,
    datumImBericht: berichtOhne.datum,
    distVergleich: vergleiche(baumOhne, baumE2Dist, []),
  };

  // Abweichungen und Ergebnis
  const abweichungen = [];
  for (const k of schritt1.mitIgnorierung.nurInA) abweichungen.push(`Schritt 1: nur im Archiv: ${k}`);
  for (const k of schritt1.mitIgnorierung.nurInB) abweichungen.push(`Schritt 1: nur in e2-quelle: ${k}`);
  for (const k of schritt1.mitIgnorierung.abweichend) abweichungen.push(`Schritt 1: Inhalt abweichend: ${k}`);
  if (bau.exitCode !== 0) abweichungen.push(`Schritt 2: Bau endete mit Exit-Code ${bau.exitCode}`);
  if (!schritt2.logGleich) abweichungen.push('Schritt 2: Bau-Protokoll weicht vom e2-bau.log ab (ohne ms)');
  for (const k of berichtAb) abweichungen.push(`Schritt 2: Build-Bericht Feld abweichend: ${k}`);
  for (const k of schritt2.distVergleich.nurInA) abweichungen.push(`Schritt 2: nur im neu gebauten dist: ${k}`);
  for (const k of schritt2.distVergleich.nurInB) abweichungen.push(`Schritt 2: nur in e2-dist: ${k}`);
  for (const k of schritt2.distVergleich.abweichend) abweichungen.push(`Schritt 2: dist-Inhalt abweichend: ${k}`);
  const identisch = schritt1.gleich && schritt2.gleich;

  const ergebnis = {
    zeitstempel,
    werkzeug: `herkunft.mjs (Node ${process.version})`,
    commit: { voll: commitInfo[0], commitDatum: commitInfo[1], betreff: commitInfo[2] },
    schritt1,
    schritt2,
    datumsprobe,
    ergebnis: identisch ? 'identisch: Archiv-Quelle und Messbau stimmen mit e2-quelle bzw. e2-dist überein' : 'abweichend: siehe abweichungen',
    abweichungen,
    anmerkungen: [
      `Ignoriert in Schritt 1 (nur vom Bau erzeugt, bau/bauen.mjs Zeilen 233-234): ${BAU_ARTEFAKTE.join(', ')}`,
      'Der Build-Ordner e2-quelle/.cache enthält nur diese Datei; sie ist aus dem Bau und kein Quelltext.',
      `Datum: Referenz-Bericht (e2-quelle/.cache/bau-bericht.json) nennt datum=${berichtOhneMs(berichtRef).datum}; der Nachbau mit --datum=${DATUM} nennt datum=${berichtOhneMs(berichtArchiv).datum}. Ohne --datum (Probelauf) nennt er datum=${datumsprobe.datumImBericht}; gegenüber e2-dist abweichende Dateien: ${datumsprobe.distVergleich.abweichend.length}, nur in Probe: ${datumsprobe.distVergleich.nurInA.length}, nur in e2-dist: ${datumsprobe.distVergleich.nurInB.length}.`,
      'Die Vergleiche wurden in beide Richtungen (nur in A, nur in B, abweichend) per SHA-256 durchgeführt; Dateirechte werden zusätzlich ausgewiesen.',
    ],
  };

  const datei = sicher(join(HIER, 'herkunft.json'));
  await writeFile(datei, JSON.stringify(ergebnis, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify({ ergebnis: ergebnis.ergebnis, schritt1: schritt1.gleich, schritt2: schritt2.gleich, abweichungen }, null, 2));
  console.log('geschrieben:', datei, (await stat(datei)).size, 'B');
}

main().catch((e) => {
  console.error(e.stack || String(e));
  process.exitCode = 2;
});
