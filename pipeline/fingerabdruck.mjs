// Einmaliger Lauf: erzeugt bau/pruefen/fingerabdruck.json aus den Rohexporten der beiden Wettbewerber.
// Gespeichert werden nur Hashes, keine Texte. Aufruf:
//   FINGERABDRUCK_FIRMENNAMEN='[…]' node pipeline/fingerabdruck.mjs
// Die Firmennamen (Klartext) stehen bewusst nicht im Repo; sie kommen als JSON-Array aus der Umgebung.
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

const ausfuehren = promisify(execFile);
const WURZEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const AUSGABE = join(WURZEL, 'bau/pruefen/fingerabdruck.json');
const GROSS = { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 };
const PARALLEL = 16;
const COMMIT = 'ad81157';
const RICHTER_ORDNER = 'Richter Schlüsseldienst/01a12b76-b326-7756-a303-8fa6e684874c';
const ZIP_ADAM_MD = 'Schlüsseldienst Adam/dba3265a-e101-45c5-a4b2-34f91dac4d75.zip';
const ZIP_ADAM_JSON = 'Schlüsseldienst Adam/dff09287-3472-45a0-bec3-2e544301d508.zip';

export const SCHINDELLAENGE = 7;
const HAEUFIG_AB = 26; // Schindel in mehr als 25 Quelldateien → Liste haeufig
const AIZA = /AIza[0-9A-Za-z_-]{35}/g;

/** Normalisierung: Links/Bilder/URLs weg, klein, nur Buchstaben und Ziffern, Wortliste. */
export function woerter(text) {
  const bereinigt = String(text)
    .normalize('NFC')
    .replace(/[­​-‍﻿]/g, '') // weiche Trennzeichen, Nullbreiten-Zeichen
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // Bild-Syntax
    .replace(/\[([^\]]*)\]\([^)]*\)/g, ' $1 ') // Link → Linktext
    .replace(/\b(?:https?:\/\/|www\.)\S+/gi, ' ') // URLs
    .toLocaleLowerCase('de')
    .replace(/[^\p{L}\p{Nd}\p{M}]+/gu, ' ');
  return bereinigt.split(' ').filter(Boolean);
}

/** 64-Bit-Schindel: erste 16 Hex-Zeichen von SHA-256 über die sieben Wörter. */
export function schindelHash(siebenWoerter) {
  return createHash('sha256').update(siebenWoerter.join(' '), 'utf8').digest('hex').slice(0, 16);
}

/** Volle SHA-256-Hashes für Wettbewerber-Kennungen (Linter). */
export function kennungHash(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

/** Alle Schindel-Hashes eines Wortstroms, Position für Position (Dubletten inklusive). */
export function schindelnVon(worte) {
  const ergebnis = [];
  for (let i = 0; i + SCHINDELLAENGE <= worte.length; i++) {
    ergebnis.push(schindelHash(worte.slice(i, i + SCHINDELLAENGE)));
  }
  return ergebnis;
}

/** Telefonnummern als Ziffernfolge mit führender 0 (mindestens 9 Ziffern). */
export function telefonnummernVon(text) {
  const ergebnis = [];
  for (const treffer of String(text).matchAll(/(?<!\d)(?:\+49|0)(?:[ \/-]?\d){8,}/g)) {
    let ziffern = treffer[0].replace(/[ \/-]/g, '');
    if (ziffern.startsWith('+49')) ziffern = `0${ziffern.slice(3)}`;
    ergebnis.push(ziffern);
  }
  return ergebnis;
}

/** Baut den Fingerabdruck aus Texten. Schindeln in mehr als 25 Quelldateien wandern nach haeufig. */
export function baueFingerabdruck(texte, kennungen = { domains: [], namen: [], telefon: [], schluessel: [] }) {
  const quellen = new Map(); // Schindel-Hash → Anzahl verschiedener Quelldateien
  for (const text of texte) {
    for (const h of new Set(schindelnVon(woerter(text)))) {
      quellen.set(h, (quellen.get(h) ?? 0) + 1);
    }
  }
  const schindeln = [];
  const haeufig = [];
  for (const [h, anzahl] of quellen) {
    if (anzahl >= HAEUFIG_AB) haeufig.push(h);
    else schindeln.push(h);
  }
  schindeln.sort();
  haeufig.sort();
  return { version: 1, schindelLaenge: SCHINDELLAENGE, schindeln, haeufig, kennungen };
}

async function gitText(pfad) {
  return (await ausfuehren('git', ['-C', WURZEL, 'show', `${COMMIT}:${pfad}`], GROSS)).stdout;
}

async function zipEintraege(zip, endung) {
  const { stdout } = await ausfuehren('unzip', ['-Z1', join(WURZEL, zip)], GROSS);
  return stdout.split('\n').filter((n) => n.endsWith(endung));
}

async function zipText(zip, eintrag) {
  return (await ausfuehren('unzip', ['-p', join(WURZEL, zip), eintrag], GROSS)).stdout;
}

/** Prüft, dass die ZIP-Datei im Arbeitsbaum dem Stand in COMMIT entspricht. */
async function zipGeprueft(zip) {
  const [aktuell, imCommit] = await Promise.all([
    ausfuehren('git', ['-C', WURZEL, 'hash-object', join(WURZEL, zip)]),
    ausfuehren('git', ['-C', WURZEL, 'rev-parse', `${COMMIT}:${zip}`]),
  ]);
  if (aktuell.stdout.trim() !== imCommit.stdout.trim()) {
    throw new Error(`ZIP weicht von ${COMMIT} ab`);
  }
}

async function nacheinander(liste, fn) {
  const ergebnis = [];
  for (let i = 0; i < liste.length; i += PARALLEL) {
    ergebnis.push(...(await Promise.all(liste.slice(i, i + PARALLEL).map(fn))));
  }
  return ergebnis;
}

/** Domains aus den Dateinamen (Präfix vor dem ersten Unterstrich), ohne www. */
function domainsAus(pfade) {
  const menge = new Set();
  for (const pfad of pfade) {
    const kopf = pfad.split('/').pop().split('_')[0];
    if (/^(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+$/.test(kopf)) menge.add(kopf.replace(/^www\./, ''));
  }
  return [...menge].sort();
}

function firmennamenAusUmgebung() {
  const roh = process.env.FINGERABDRUCK_FIRMENNAMEN;
  if (!roh) {
    throw new Error('FINGERABDRUCK_FIRMENNAMEN fehlt (JSON-Array der Firmennamen; bewusst nicht im Repo)');
  }
  const liste = JSON.parse(roh);
  if (!Array.isArray(liste) || liste.some((n) => typeof n !== 'string' || !n.trim())) {
    throw new Error('FINGERABDRUCK_FIRMENNAMEN muss ein JSON-Array nichtleerer Strings sein');
  }
  return [...new Set(liste.map((n) => n.normalize('NFC').toLocaleLowerCase('de')))];
}

/** JSON mit einem Element pro Zeile, damit Diffs lesbar bleiben. */
function jsonZeilen(wert, tiefe = 0) {
  const innen = '  '.repeat(tiefe + 1);
  const aussen = '  '.repeat(tiefe);
  if (Array.isArray(wert)) {
    if (!wert.length) return '[]';
    return `[\n${wert.map((v) => innen + jsonZeilen(v, tiefe + 1)).join(',\n')}\n${aussen}]`;
  }
  if (wert !== null && typeof wert === 'object') {
    const eintraege = Object.entries(wert);
    return `{\n${eintraege.map(([k, v]) => `${innen}${JSON.stringify(k)}: ${jsonZeilen(v, tiefe + 1)}`).join(',\n')}\n${aussen}}`;
  }
  return JSON.stringify(wert);
}

async function hauptlauf() {
  const start = performance.now();
  const firmennamen = firmennamenAusUmgebung();
  for (const zip of [ZIP_ADAM_MD, ZIP_ADAM_JSON]) await zipGeprueft(zip);

  const alle = (await ausfuehren('git', ['-C', WURZEL, 'ls-tree', '-r', '-z', '--name-only', COMMIT], GROSS))
    .stdout.split('\0').filter(Boolean);
  const imOrdner = (ordner, endung) => alle.filter((p) => p.startsWith(`${ordner}/`)
    && p.endsWith(endung) && !p.slice(ordner.length + 1).includes('/'));
  const richterMd = imOrdner(`${RICHTER_ORDNER} 2`, '.md');
  const richterJson = imOrdner(RICHTER_ORDNER, '.json');
  const adamMd = await zipEintraege(ZIP_ADAM_MD, '.md');
  const adamJson = await zipEintraege(ZIP_ADAM_JSON, '.json');

  const md = [
    ...(await nacheinander(richterMd, async (p) => ({ name: p, text: await gitText(p) }))),
    ...(await nacheinander(adamMd, async (e) => ({ name: e, text: await zipText(ZIP_ADAM_MD, e) }))),
  ];
  const json = [
    ...(await nacheinander(richterJson, async (p) => ({ name: p, text: await gitText(p) }))),
    ...(await nacheinander(adamJson, async (e) => ({ name: e, text: await zipText(ZIP_ADAM_JSON, e) }))),
  ];

  const domains = domainsAus([...richterMd, ...adamMd]);
  if (domains.length !== 2) throw new Error(`erwartet 2 Domains, gefunden ${domains.length}`);

  const telefon = new Set();
  for (const d of md) for (const z of telefonnummernVon(d.text)) telefon.add(z);

  const aiza = new Set();
  for (const d of [...md, ...json]) for (const m of d.text.matchAll(AIZA)) aiza.add(m[0]);

  const verifizierung = new Set();
  let unlesbar = 0;
  for (const d of json) {
    let obj;
    try {
      obj = JSON.parse(d.text);
    } catch {
      unlesbar += 1;
      continue;
    }
    const wert = obj?.metadata?.['google-site-verification'];
    if (typeof wert === 'string' && wert.trim()) verifizierung.add(wert.trim());
  }
  if (unlesbar) throw new Error(`${unlesbar} JSON-Dateien nicht lesbar`);

  const kennungen = {
    domains: domains.flatMap((d) => [d, `www.${d}`]).map(kennungHash).sort(),
    namen: firmennamen.map(kennungHash).sort(),
    telefon: [...telefon].map(kennungHash).sort(),
    schluessel: [...aiza, ...verifizierung].map(kennungHash).sort(),
  };

  const fingerabdruck = baueFingerabdruck(md.map((d) => d.text), kennungen);
  const inhalt = `${jsonZeilen(fingerabdruck)}\n`;
  await writeFile(AUSGABE, inhalt, 'utf8');

  console.log(`Korpus: ${md.length} Markdown-Dateien (Richter ${richterMd.length}, Adam ${adamMd.length}), ${json.length} JSON-Dateien`);
  console.log(`Schindeln: ${fingerabdruck.schindeln.length} eindeutig, haeufig: ${fingerabdruck.haeufig.length}`);
  console.log(`Kennungen (Anzahl je Art): Domains ${domains.length} (mit und ohne www.), Namen ${firmennamen.length}, `
    + `Telefonnummern ${telefon.size}, Schlüssel ${aiza.size} AIza + ${verifizierung.size} Verifizierung`);
  console.log(`Größe: ${(Buffer.byteLength(inhalt) / 1e6).toFixed(2)} MB (Ziel < 25 MB)`);
  console.log(`Dauer: ${((performance.now() - start) / 1000).toFixed(1)} s`);
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  hauptlauf().catch((fehler) => {
    console.error(`Fehler: ${fehler.message}`);
    process.exitCode = 1;
  });
}
