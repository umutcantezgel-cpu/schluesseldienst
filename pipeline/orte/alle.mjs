#!/usr/bin/env node
// Orchestrator der Orts-Pipeline: führt die Stufen nacheinander als Kindprozesse aus und bricht bei Fehler ab.
// Stufe 00 läuft ohne Download (nur Prüfung gegen quellen.lock.json und den Cache).
// Aufruf: node pipeline/orte/alle.mjs  (npm run orte)
import { execFile } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { promisify } from 'node:util';
import { performance } from 'node:perf_hooks';
import { schreibeObjektJson } from './lib.mjs';

const HIER = dirname(fileURLToPath(import.meta.url));
const WURZEL = resolve(HIER, '../..');
const CACHE = join(WURZEL, '.cache/orte');
const ausfuehren = promisify(execFile);

export const STUFEN = [
  '00-laden.mjs',
  '10-quellen.mjs',
  '20-index.mjs',
  '30-abgleich.mjs',
  '40-umkreis.mjs',
  '50-anreichern.mjs',
  '60-slugs.mjs',
  '90-pruefen.mjs',
];

/** Führt alle Stufen aus. Laufzeiten (ms) landen in .cache/orte/laufzeiten.json, bevor die Prüfung läuft. */
export async function alleLaufen() {
  const laufzeiten = {};
  for (const datei of STUFEN) {
    const start = performance.now();
    try {
      const { stdout, stderr } = await ausfuehren(process.execPath, [join(HIER, datei)], {
        cwd: WURZEL,
        maxBuffer: 256 * 1024 * 1024,
      });
      process.stdout.write(stdout);
      if (stderr) process.stderr.write(stderr);
    } catch (f) {
      if (f.stdout) process.stdout.write(f.stdout);
      if (f.stderr) process.stderr.write(f.stderr);
      throw new Error(`Stufe ${datei} abgebrochen: ${String(f.message).split('\n')[0]}`);
    }
    laufzeiten[datei] = Math.round(performance.now() - start);
    await schreibeObjektJson(join(CACHE, 'laufzeiten.json'), laufzeiten);
  }
  return laufzeiten;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  alleLaufen().catch((f) => {
    console.error(f.message || f);
    process.exitCode = 1;
  });
}
