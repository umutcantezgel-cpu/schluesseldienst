// Gemeinsame Helfer der Orts-Pipeline: Rohdaten aus Git, ZIP-Entpacken, TSV, JSON-Ausgabe, Geografie.
// Nur node:-Module. Keine Uhr und kein Zufall (Determinismus).
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const ausfuehren = promisify(execFile);
const MB = 1024 * 1024;
const WURZEL = fileURLToPath(new URL('../../', import.meta.url));

/** Commit mit den Rohdaten (Website-Exporte beider Wettbewerber). */
export const ROH_COMMIT = 'ad81157';

/** Liest eine Datei aus dem Commit ROH_COMMIT als Bytes. pfad wie im Repo, z. B. „Ordner/datei.json“. */
export async function gitShow(pfad) {
  const { stdout } = await ausfuehren('git', ['show', `${ROH_COMMIT}:${pfad}`], {
    cwd: WURZEL,
    maxBuffer: 64 * MB,
    encoding: 'buffer',
  });
  return stdout;
}

/** Liest einen Eintrag aus einem ZIP-Archiv als Bytes (unzip -p, ohne Shell). */
export async function unzipEintrag(zip, eintrag) {
  const { stdout } = await ausfuehren('unzip', ['-p', zip, eintrag], {
    maxBuffer: 512 * MB,
    encoding: 'buffer',
  });
  return stdout;
}

/** Zeilen → Felder, Tab-getrennt, ohne Anführungszeichen-Logik. Leere Zeilen entfallen. */
export function liesTsv(text) {
  return String(text)
    .split('\n')
    .map((z) => (z.endsWith('\r') ? z.slice(0, -1) : z))
    .filter((z) => z.length > 0)
    .map((z) => z.split('\t'));
}

/** Schreibt eine Liste als JSON mit einem Datensatz pro Zeile. Die Reihenfolge übernimmt der Aufrufer. */
export async function schreibeZeilenJson(datei, liste) {
  await mkdir(dirname(datei), { recursive: true });
  const inhalt = liste.length === 0
    ? '[]\n'
    : '[\n' + liste.map((e) => JSON.stringify(e)).join(',\n') + '\n]\n';
  await writeFile(datei, inhalt);
}

const sortiert = (w) => {
  if (Array.isArray(w)) return w.map(sortiert);
  if (w && typeof w === 'object') return Object.fromEntries(Object.keys(w).sort().map((k) => [k, sortiert(w[k])]));
  return w;
};

/** Schreibt ein Objekt als JSON mit 2 Leerzeichen und sortierten Schlüsseln. */
export async function schreibeObjektJson(datei, objekt) {
  await mkdir(dirname(datei), { recursive: true });
  await writeFile(datei, JSON.stringify(sortiert(objekt), null, 2) + '\n');
}

/** SHA-256 als Hex-Text. */
export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

/** Großkreisdistanz in km (Haversine, Erdradius 6371,0088 km). */
export function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371.0088;
  const rad = (g) => (g * Math.PI) / 180;
  const dPhi = rad(lat2 - lat1);
  const dLam = rad(lon2 - lon1);
  const a = Math.sin(dPhi / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLam / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}

const RICHTUNGEN = ['nördlich', 'nordöstlich', 'östlich', 'südöstlich', 'südlich', 'südwestlich', 'westlich', 'nordwestlich'];

/** Himmelsrichtung von „von“ nach „nach“ ({lat, lon}) in 45°-Sektoren, 0° = Norden. */
export function richtung8(von, nach) {
  const rad = (g) => (g * Math.PI) / 180;
  const dLam = rad(nach.lon - von.lon);
  const y = Math.sin(dLam) * Math.cos(rad(nach.lat));
  const x = Math.cos(rad(von.lat)) * Math.sin(rad(nach.lat))
    - Math.sin(rad(von.lat)) * Math.cos(rad(nach.lat)) * Math.cos(dLam);
  const peilung = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  return RICHTUNGEN[Math.round(peilung / 45) % 8];
}

/** Harte Zusicherung: wirft, wenn die Bedingung nicht erfüllt ist. */
export function zusicherung(bedingung, meldung) {
  if (!bedingung) throw new Error(`Zusicherung verletzt: ${meldung}`);
}
