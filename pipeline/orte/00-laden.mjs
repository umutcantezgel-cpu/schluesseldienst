// Stufe 1: lädt GeoNames-Archive und Verwaltungscodes nach .cache/geonames/ und prüft sie gegen quellen.lock.json.
// Aufruf: NODE_USE_ENV_PROXY=1 node pipeline/orte/00-laden.mjs [--neu-einlesen] [--datum JJJJ-MM-TT]
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { sha256 } from './lib.mjs';

const WURZEL = fileURLToPath(new URL('../../', import.meta.url));
const CACHE = join(WURZEL, '.cache', 'geonames');
const LOCK = join(WURZEL, 'pipeline', 'orte', 'quellen.lock.json');
const BASIS = 'https://download.geonames.org/export/';

/** Alle Quelldateien. pflicht: false = darf fehlen (404), dann ohne diese Quelle weiter. */
export const DATEIEN = [
  { schluessel: 'dump/DE.zip', pflicht: true },
  { schluessel: 'dump/NL.zip', pflicht: true },
  { schluessel: 'zip/DE.zip', pflicht: true },
  { schluessel: 'zip/NL.zip', pflicht: false },
  { schluessel: 'dump/admin1CodesASCII.txt', pflicht: true },
  { schluessel: 'dump/admin2Codes.txt', pflicht: true },
];

/** Kommandozeilenargumente lesen. */
export function argumente(liste) {
  const neu = liste.includes('--neu-einlesen');
  const i = liste.indexOf('--datum');
  const datum = i >= 0 ? liste[i + 1] : undefined;
  if (datum !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(datum)) throw new Error('--datum erwartet JJJJ-MM-TT');
  return { neu, datum };
}

async function existiert(datei) {
  try { await stat(datei); return true; } catch { return false; }
}

async function liesLock() {
  try {
    return JSON.parse(await readFile(LOCK, 'utf8'));
  } catch (f) {
    if (f.code === 'ENOENT') return {};
    throw f;
  }
}

/** Lädt eine Datei. Liefert { status: 404 } oder { bytes, datum } (datum = Tag laut Server-Header, UTC). */
async function laden(schluessel) {
  const url = BASIS + schluessel;
  const antwort = await fetch(url);
  if (antwort.status === 404) return { status: 404 };
  if (!antwort.ok) throw new Error(`${url}: HTTP ${antwort.status}`);
  const bytes = Buffer.from(await antwort.arrayBuffer());
  if (schluessel.endsWith('.zip') && bytes.subarray(0, 2).toString('latin1') !== 'PK') {
    throw new Error(`${url}: kein ZIP-Archiv empfangen`);
  }
  const kopf = antwort.headers.get('date');
  if (!kopf) throw new Error(`${url}: kein Date-Header; bitte --datum angeben`);
  return { bytes, datum: new Date(kopf).toISOString().slice(0, 10) };
}

/** Hauptlauf: prüft jede Datei gegen den Lock und lädt nur nach den Regeln der Stufe. */
export async function hauptlauf(argv) {
  const { neu, datum } = argumente(argv);
  const lock = await liesLock();
  const neuerLock = { ...lock };
  let geaendert = false;

  for (const { schluessel, pflicht } of DATEIEN) {
    const ziel = join(CACHE, schluessel);
    const eintrag = lock[schluessel];
    const vorhanden = await existiert(ziel);
    const hash = vorhanden ? sha256(await readFile(ziel)) : null;

    if (eintrag && vorhanden && hash === eintrag.sha256) {
      console.log(`= ${schluessel}  unverändert (sha256 ${hash.slice(0, 16)}…)`);
      continue;
    }
    if (eintrag && !vorhanden && !neu) {
      throw new Error(`${schluessel} fehlt im Cache. Mit --neu-einlesen erneut laden.`);
    }
    if (eintrag && vorhanden && !neu) {
      throw new Error(`${schluessel}: Prüfsumme weicht vom Lock ab (Cache ${hash.slice(0, 16)}…, Lock ${eintrag.sha256.slice(0, 16)}…). Mit --neu-einlesen erneut laden.`);
    }

    const r = await laden(schluessel);
    if (r.status === 404) {
      if (pflicht) throw new Error(`${schluessel}: 404 (Pflichtdatei)`);
      console.log(`Hinweis: ${schluessel} nicht vorhanden (404). Ohne diese Quelle weiter.`);
      continue;
    }
    await mkdir(dirname(ziel), { recursive: true });
    await writeFile(ziel, r.bytes);
    const neueSumme = sha256(r.bytes);
    if (eintrag && eintrag.sha256 === neueSumme) {
      console.log(`= ${schluessel}  neu geladen, Inhalt identisch (sha256 ${neueSumme.slice(0, 16)}…)`);
      continue;
    }
    if (eintrag) console.log(`! ${schluessel}: alte Prüfsumme ${eintrag.sha256}, neue ${neueSumme}`);
    else console.log(`+ ${schluessel}  ${r.bytes.length} Bytes  sha256 ${neueSumme}`);
    neuerLock[schluessel] = { sha256: neueSumme, bytes: r.bytes.length, geladen: datum ?? r.datum };
    geaendert = true;
  }

  if (geaendert || !(await existiert(LOCK))) {
    const sortiert = Object.fromEntries(Object.keys(neuerLock).sort().map((k) => [k, neuerLock[k]]));
    await writeFile(LOCK, JSON.stringify(sortiert, null, 2) + '\n');
    console.log(`Lock geschrieben: ${LOCK}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  hauptlauf(process.argv.slice(2)).catch((f) => {
    console.error(`Fehler: ${f.message}`);
    process.exitCode = 1;
  });
}
