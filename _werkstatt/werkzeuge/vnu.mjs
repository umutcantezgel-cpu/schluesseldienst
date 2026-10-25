// HTML-Validität mit vnu (Nu-Validator): Fehler und Warnungen je Datei; Exit 1 bei Fehlern (type error).
// Aufruf: node _werkstatt/werkzeuge/vnu.mjs (--dateien <glob|liste> | --ordner <dir>) [--stichprobe N] --aus <json>
// Stichprobe: gleichmäßig verteilte Auswahl aus der sortierten Dateiliste (wiederholbar, kein Zufall).
// Exit: 0 ok · 1 Fehler gefunden · 2 Werkzeugfehler
import { parseArgs, promisify } from 'node:util';
import { execFile } from 'node:child_process';
import { promises as fsp } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { relative, resolve } from 'node:path';
import { pfadVon, schreibeJson } from './lib.mjs';

const run = promisify(execFile);
const CHARGE = 100; // Dateien je vnu-Aufruf (Kommandozeilenlänge)

/** Sammelt HTML-Dateien aus Glob-Mustern, Listen oder einem Ordner (ohne node_modules). */
async function sammle(optionen) {
  let dateien = [];
  if (optionen.ordner) {
    const wurzel = resolve(optionen.ordner);
    for await (const f of fsp.glob('**/*.html', { cwd: wurzel })) {
      if (!f.split('/').includes('node_modules')) dateien.push(resolve(wurzel, f));
    }
  } else {
    for (const eintrag of optionen.dateien.split(',').map((s) => s.trim()).filter(Boolean)) {
      if (/[*?[{]/.test(eintrag)) {
        for await (const f of fsp.glob(eintrag)) dateien.push(resolve(f));
      } else {
        await fsp.access(eintrag).catch(() => { throw new Error(`Datei fehlt: ${eintrag}`); });
        dateien.push(resolve(eintrag));
      }
    }
  }
  dateien = [...new Set(dateien)].sort();
  if (optionen.stichprobe && optionen.stichprobe < dateien.length) {
    const n = optionen.stichprobe; const len = dateien.length;
    dateien = Array.from({ length: n }, (_, i) => dateien[Math.floor((i * len) / n)]);
  }
  return dateien;
}

/** Führt vnu über eine Charge aus und liefert die JSON-Meldungen (vnu schreibt JSON auf stderr). */
async function pruefeCharge(jar, charge) {
  const { stderr } = await run('java', ['-jar', jar, '--format', 'json', '--exit-zero-always', ...charge],
    { maxBuffer: 64 * 1024 * 1024 });
  const zeile = stderr.split('\n').map((z) => z.trim()).filter((z) => !z.startsWith('Picked up JAVA_TOOL_OPTIONS')).find((z) => z.startsWith('{'));
  if (!zeile) throw new Error('keine JSON-Ausgabe von vnu');
  return JSON.parse(zeile).messages ?? [];
}

async function main() {
  const { values: a } = parseArgs({
    strict: true,
    options: {
      dateien: { type: 'string' }, ordner: { type: 'string' }, stichprobe: { type: 'string' }, aus: { type: 'string' },
    },
  });
  if (!a.aus || (!a.dateien && !a.ordner)) throw new Error('Pflicht: --aus <json> und --dateien <glob|liste> oder --ordner <dir>');
  const stichprobe = a.stichprobe === undefined ? undefined : Number(a.stichprobe);
  if (stichprobe !== undefined && (!Number.isInteger(stichprobe) || stichprobe < 1)) throw new Error('--stichprobe: ganze Zahl ≥ 1');
  const dateien = await sammle({ dateien: a.dateien, ordner: a.ordner, stichprobe });
  if (!dateien.length) throw new Error('keine HTML-Dateien gefunden');

  const jar = resolve(pfadVon('vnu-jar'), '..', 'build', 'dist', 'vnu.jar');
  await fsp.access(jar).catch(() => { throw new Error(`vnu.jar fehlt: ${jar}`); });

  const je = new Map(dateien.map((f) => [f, { fehler: [], warnungen: [] }]));
  const allgemein = [];
  for (let i = 0; i < dateien.length; i += CHARGE) {
    for (const m of await pruefeCharge(jar, dateien.slice(i, i + CHARGE))) {
      const eintrag = { zeile: m.lastLine ?? null, nachricht: m.message };
      const fehler = m.type === 'error' || m.type === 'non-document-error';
      if (!m.url) { allgemein.push({ ...eintrag, typ: m.type }); continue; }
      const ziel = je.get(resolve(fileURLToPath(m.url)));
      if (!ziel) { allgemein.push({ ...eintrag, typ: m.type, datei: m.url }); continue; }
      (fehler ? ziel.fehler : ziel.warnungen).push(eintrag);
    }
  }

  const liste = dateien.map((f) => ({
    datei: relative(process.cwd(), f), fehler: je.get(f).fehler.length, warnungen: je.get(f).warnungen.length,
    meldungen: [...je.get(f).fehler.map((m) => ({ typ: 'fehler', ...m })), ...je.get(f).warnungen.map((m) => ({ typ: 'warnung', ...m }))],
  }));
  const fehlerGesamt = liste.reduce((s, d) => s + d.fehler, 0) + allgemein.filter((m) => m.typ === 'error' || m.typ === 'non-document-error').length;
  const warnGesamt = liste.reduce((s, d) => s + d.warnungen, 0);
  const daten = {
    werkzeug: 'vnu', zeitpunkt: new Date().toISOString(), quelle: a.ordner ?? a.dateien, stichprobe: stichprobe ?? null,
    dateien: liste, allgemein, fehler_gesamt: fehlerGesamt, warnungen_gesamt: warnGesamt,
    ergebnis: fehlerGesamt ? 'fehler' : 'ok',
  };
  await schreibeJson(a.aus, daten);

  console.log(`vnu: ${dateien.length} Dateien · ${fehlerGesamt} Fehler · ${warnGesamt} Warnungen`);
  for (const d of liste) for (const m of d.meldungen.filter((x) => x.typ === 'fehler')) {
    console.log(`  FEHLER ${d.datei}:${m.zeile ?? '?'} ${m.nachricht.slice(0, 160)}`);
  }
  console.log(fehlerGesamt ? 'ERGEBNIS: fehler' : 'ERGEBNIS: ok');
  process.exitCode = fehlerGesamt ? 1 : 0;
}

main().catch((e) => {
  console.error(`vnu: Werkzeugfehler: ${e.message}`);
  process.exitCode = 2;
});
