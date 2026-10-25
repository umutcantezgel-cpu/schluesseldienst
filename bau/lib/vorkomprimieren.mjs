// Vorkomprimierte Varianten für Hoster ohne eigene Kompression (K-05): zu jeder Textdatei im Ausgabeordner
// eine .br (Brotli, Stufe 11) und eine .gz (gzip, Stufe 9) daneben – nur wenn sie kleiner als das Original ist.
// Nur node:zlib. Deterministisch: gleiche Eingabe → gleiche Bytes (gzip ohne Zeitstempel und Dateinamen, feste OS-Kennung).
// Unveränderte Dateien werden nicht neu komprimiert: Eine vorhandene Variante wird entpackt und mit dem Original verglichen.
// Verwaiste Varianten (Quelle gelöscht oder nicht mehr kleiner) werden entfernt.
// Hinweis: Ändern sich die Kompressionsparameter, den Ausgabeordner leeren – sonst bleiben alte, gültige Varianten stehen.
import { brotliCompressSync, brotliDecompressSync, gzipSync, gunzipSync, constants } from 'node:zlib';
import { readdir, readFile, unlink } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

/** Endungen der Textdateien mit Varianten (eine Quelle; bau/lib/hosting.mjs nutzt dieselbe Liste). */
export const TEXT_ENDUNGEN = ['.html', '.css', '.js', '.json', '.xml', '.svg', '.txt', '.webmanifest'];

function brotli(buf) {
  return brotliCompressSync(buf, {
    params: {
      [constants.BROTLI_PARAM_MODE]: constants.BROTLI_MODE_TEXT,
      [constants.BROTLI_PARAM_QUALITY]: 11,
      [constants.BROTLI_PARAM_SIZE_HINT]: buf.length,
    },
  });
}

function gzip(buf) {
  const out = gzipSync(buf, { level: 9 }); // Kopf ohne Zeitstempel (Bytes 4–7 = 0) und ohne Dateinamen
  out[9] = 3; // OS-Kennung „Unix“ fest, damit die Bytes nicht von der Plattform abhängen
  return out;
}

const VARIANTEN = {
  '.br': { komprimiere: brotli, entpacke: brotliDecompressSync },
  '.gz': { komprimiere: gzip, entpacke: gunzipSync },
};

async function dateienIn(ordner) {
  const liste = [];
  for (const e of await readdir(ordner, { withFileTypes: true })) {
    const pfad = join(ordner, e.name);
    if (e.isDirectory()) liste.push(...(await dateienIn(pfad)));
    else if (e.isFile()) liste.push(pfad);
  }
  return liste;
}

/** true, wenn die vorhandene Variante entpackt genau das aktuelle Original ergibt. */
function passt(variante, alt, original) {
  try { return VARIANTEN[variante].entpacke(alt).equals(original); } catch { return false; }
}

/**
 * Erzeugt, erneuert und entfernt die Varianten im Ausgabeordner des Schreibers.
 * Quellen sind die Textdateien, die dieser Lauf geschrieben hat (schreiber.geschrieben). Veraltete Dateien früherer
 * Läufe bekommen keine Varianten mehr; ihre alten .br/.gz fallen hier weg, auch wenn aufraeumen() danach die Quelle löscht.
 * Mit ohneAufraeumen (--nur, dort läuft kein aufraeumen()) zählt jede vorhandene Textdatei als Quelle.
 * Schreibt über den Schreiber, damit die Varianten als „in diesem Lauf geschrieben“ gelten
 * (sonst würde schreiber.aufraeumen() sie löschen) und die Prüfer sie sehen. Muss vor aufraeumen() laufen.
 * Rückgabe: { quellen, neu, unveraendert, zuGross, entfernt, original, br, gz, ms } – Bytes in original/br/gz.
 */
export async function vorkomprimieren(schreiber, { ohneAufraeumen = false } = {}) {
  const start = performance.now();
  const wurzel = schreiber.ziel;
  const vorhanden = ohneAufraeumen ? await dateienIn(wurzel) : [...schreiber.geschrieben];
  const quellen = vorhanden.filter((p) => TEXT_ENDUNGEN.includes(extname(p))).sort();
  const behalten = new Set();
  const bericht = { quellen: quellen.length, neu: 0, unveraendert: 0, zuGross: 0, entfernt: 0, original: 0, br: 0, gz: 0 };
  for (const quelle of quellen) {
    const original = await readFile(quelle);
    bericht.original += original.length;
    for (const variante of Object.keys(VARIANTEN)) {
      const pfad = quelle + variante;
      const rel = relative(wurzel, pfad);
      const alt = await readFile(pfad).catch(() => null);
      if (alt && passt(variante, alt, original)) {
        await schreiber.schreibe(rel, alt);
        behalten.add(pfad);
        bericht.unveraendert++;
        bericht[variante.slice(1)] += alt.length;
        continue;
      }
      const neu = VARIANTEN[variante].komprimiere(original);
      if (neu.length < original.length) {
        await schreiber.schreibe(rel, neu);
        behalten.add(pfad);
        bericht.neu++;
        bericht[variante.slice(1)] += neu.length;
      } else {
        bericht.zuGross++;
      }
    }
  }
  // Verwaist: eine Variante, die dieser Lauf weder geschrieben noch behalten hat (Quelle fehlt oder ist nicht mehr kleiner).
  for (const pfad of await dateienIn(wurzel)) {
    if (!Object.keys(VARIANTEN).includes(extname(pfad))) continue;
    if (behalten.has(pfad) || schreiber.geschrieben.has(pfad)) continue;
    await unlink(pfad);
    bericht.entfernt++;
  }
  bericht.ms = Math.round(performance.now() - start);
  return bericht;
}
