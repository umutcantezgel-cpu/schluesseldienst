#!/usr/bin/env node
// Übernahme der Betriebswerte aus Supabase (D-DATEN-01), Teil des Workflows .github/workflows/betriebswerte.yml.
//   npm run betriebswerte -- --roh <export.json> [--ziel <datei>] [--bericht <md>] [--commit <txt>]
//                            [--ausgabe <$GITHUB_OUTPUT>] [--zusammenfassung <$GITHUB_STEP_SUMMARY>]
//   npm run betriebswerte -- --liste        übernommen / abgeleitet / offen je Schlüssel
//   npm run betriebswerte -- --startwerte   SQL für die Tabelle betrieb.werte (pipeline/betriebswerte/startwerte.sql)
// --roh liest die Ausgabe von export.sql (eine JSON-Liste der bestätigten Zeilen), prüft sie mit denselben Regeln wie
// der Bau (bau/lib/betriebswerte.mjs) und schreibt den Schnappschuss nur, wenn er gültig ist und sich geändert hat.
// Exit 0 = gültig (geaendert=ja|nein), 1 = Werte ungültig, 2 = technischer Fehler. Gibt nie Zugangsdaten aus.
import { parseArgs } from 'node:util';
import { readFile, writeFile, rename, appendFile, rm } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  regelFuer, schluesselAusKonfig, betriebswerteLaden, betriebswertePruefen, serialisieren, anzeige, startwerteSql, gleicherWert,
  BetriebswerteFehler, STANDARD_DATEI, KONTAKT,
} from '../../bau/lib/betriebswerte.mjs';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

class Ungueltig extends Error {}

async function konfigLaden() {
  const lade = async (n) => (await import(pathToFileURL(join(WURZEL, 'src/konfig', n)).href)).default;
  return { betrieb: await lade('betrieb.mjs'), preise: await lade('preise.mjs'), zonen: await lade('zonen.mjs') };
}

async function datenLaden() {
  try { return { plz: JSON.parse(await readFile(join(WURZEL, 'src/daten/plz.json'), 'utf8')) }; } catch { return {}; }
}

// Texte in Unicode-Normalform NFC; die Datenbank hat sie schon getrimmt.
const nfc = (w) => (typeof w === 'string' ? w.normalize('NFC') : Array.isArray(w) ? w.map(nfc) : w && typeof w === 'object' ? Object.fromEntries(Object.entries(w).map(([k, v]) => [k, nfc(v)])) : w);

/** Zeilen aus export.sql in Werte übersetzen; Typ und Schlüssel müssen zu den Regeln des Repos passen. */
export function zeilenZuWerten(zeilen, konfig) {
  if (!Array.isArray(zeilen)) throw new Error('Export ist keine JSON-Liste.');
  const fehler = [];
  const werte = {};
  const geaendert = {};
  for (const z of zeilen) {
    const schluessel = z?.schluessel;
    if (typeof schluessel !== 'string') { fehler.push(`Zeile ohne Schlüssel: ${JSON.stringify(z).slice(0, 80)}`); continue; }
    const regel = regelFuer(schluessel, konfig);
    if (!regel) { fehler.push(`${schluessel}: unbekannter Schlüssel in Supabase (startwerte.sql neu einspielen oder Zeile löschen)`); continue; }
    if (regel.abgeleitet) { fehler.push(`${schluessel}: wird aus ${regel.abgeleitet} abgeleitet und gehört nicht in Supabase`); continue; }
    if (z.typ !== regel.typ) { fehler.push(`${schluessel}: Typ in Supabase „${z.typ}“, erwartet „${regel.typ}“ (startwerte.sql neu einspielen)`); continue; }
    if (Object.hasOwn(werte, schluessel)) { fehler.push(`${schluessel}: doppelt im Export`); continue; }
    werte[schluessel] = nfc(z.wert);
    geaendert[schluessel] = z.geaendert_am ?? null;
  }
  if (fehler.length) throw new Ungueltig(fehler.join('\n'));
  return { werte, geaendert };
}

const berlin = (iso) => (iso ? new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso)) : '—');
const zelle = (s) => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');

function bericht({ alt, neu, geaendert, konfig, warnungen }) {
  const alle = schluesselAusKonfig(konfig);
  const supabase = alle.filter((s) => s.quelle === 'supabase');
  const titel = new Map(alle.map((s) => [s.schluessel, s.beschriftung]));
  const aenderungen = [...new Set([...Object.keys(alt), ...Object.keys(neu)])].sort()
    .filter((k) => !gleicherWert(alt[k], neu[k]));
  const offen = supabase.filter((s) => !Object.hasOwn(neu, s.schluessel));
  const kontakt = aenderungen.filter((k) => KONTAKT.includes(k));
  const zeilen = [
    '## Betriebswerte aus Supabase',
    '',
    `Bestätigt: **${supabase.length - offen.length} von ${supabase.length}** Werten. Geändert: **${aenderungen.length}**.`,
    '',
    'Bestätigte Werte sind mit diesem Pull Request öffentlich (auch wenn er nicht zusammengeführt wird).',
  ];
  if (kontakt.length) {
    zeilen.push('', `**Achtung: Kontakt- oder Adressangaben geändert** (${kontakt.join(', ')}). Vor dem Zusammenführen die Nummer anrufen und Adresse und Domain prüfen.`);
  }
  if (aenderungen.length) {
    zeilen.push('', '| Schlüssel | Angabe | bisher | neu | geändert (Supabase) |', '|---|---|---|---|---|');
    for (const k of aenderungen) zeilen.push(`| \`${k}\` | ${zelle(titel.get(k) ?? '')} | ${zelle(anzeige(k, alt[k], konfig))} | ${zelle(anzeige(k, neu[k], konfig))} | ${berlin(geaendert[k])} |`);
  }
  if (warnungen.length) zeilen.push('', '### Hinweise', '', ...warnungen.map((w) => `- ${w}`));
  if (offen.length) {
    zeilen.push('', `<details><summary>Noch offen (${offen.length})</summary>`, '', ...offen.map((s) => `- \`${s.schluessel}\` – ${s.beschriftung}`), '', '</details>');
  }
  return { text: `${zeilen.join('\n')}\n`, aenderungen, offen };
}

async function schreibeAtomar(datei, text) {
  const tmp = `${datei}.${process.pid}.tmp`;
  await writeFile(tmp, text);
  try { await rename(tmp, datei); } catch (e) { await rm(tmp, { force: true }); throw e; }
}

async function uebernehmen(arg) {
  const konfig = await konfigLaden();
  const daten = await datenLaden();
  const ziel = arg.ziel ?? STANDARD_DATEI;
  const zielPfad = resolve(WURZEL, ziel);
  let roh;
  try { roh = JSON.parse((await readFile(resolve(arg.roh), 'utf8')).trim() || '[]'); } catch (e) {
    throw new Error(`Export nicht lesbar (${e.message}).`);
  }
  const { werte, geaendert } = zeilenZuWerten(roh, konfig);
  const { fehler, warnungen } = betriebswertePruefen(werte, { konfig, daten });
  if (fehler.length) throw new Ungueltig(fehler.join('\n'));
  let alt = {};
  try { alt = (await betriebswerteLaden(WURZEL, ziel)).werte; } catch { /* ungültiger alter Stand: wird ersetzt */ }
  const text = serialisieren(werte);
  const bisher = await readFile(zielPfad, 'utf8').catch(() => null);
  const istNeu = bisher !== text;
  if (istNeu) await schreibeAtomar(zielPfad, text);
  const b = bericht({ alt, neu: werte, geaendert, konfig, warnungen });
  if (arg.bericht) await writeFile(arg.bericht, b.text);
  if (arg.commit) {
    const liste = b.aenderungen.length ? b.aenderungen.map((k) => `- ${k}`).join('\n') : '- nur Form (keine Wertänderung)';
    await writeFile(arg.commit, `Betriebswerte aus Supabase übernehmen (${b.aenderungen.length} geändert, ${b.offen.length} offen)\n\n${liste}\n`);
  }
  if (arg.ausgabe) await appendFile(arg.ausgabe, `geaendert=${istNeu ? 'ja' : 'nein'}\n`);
  if (arg.zusammenfassung) {
    await appendFile(arg.zusammenfassung, `### Betriebswerte\n\n${istNeu ? `Schnappschuss geändert: ${b.aenderungen.length} Werte.` : 'Keine Änderung gegenüber dem Stand im Repository.'} Offen: ${b.offen.length}. Hinweise: ${warnungen.length}.\n`);
  }
  console.log(`Betriebswerte: ${Object.keys(werte).length} bestätigt, ${b.aenderungen.length} geändert, ${b.offen.length} offen – ${istNeu ? `${ziel} geschrieben` : 'keine Änderung'}.`);
}

async function liste(arg) {
  const konfig = await konfigLaden();
  const { werte, vorhanden } = await betriebswerteLaden(WURZEL, arg.ziel ?? STANDARD_DATEI);
  if (!vorhanden) console.log(`Hinweis: ${arg.ziel ?? STANDARD_DATEI} fehlt.`);
  const zaehler = { übernommen: 0, abgeleitet: 0, offen: 0 };
  for (const s of schluesselAusKonfig(konfig)) {
    const stand = s.quelle === 'abgeleitet' ? (Object.hasOwn(werte, 'preise.tagesband') ? 'abgeleitet' : 'offen') : Object.hasOwn(werte, s.schluessel) ? 'übernommen' : 'offen';
    zaehler[stand] += 1;
    console.log(`${stand.padEnd(11)} ${s.schluessel} – ${s.beschriftung}`);
  }
  console.log(`\n${zaehler.übernommen} übernommen, ${zaehler.abgeleitet} abgeleitet, ${zaehler.offen} offen.`);
}

async function main() {
  const { values: arg } = parseArgs({
    options: {
      roh: { type: 'string' }, ziel: { type: 'string' }, bericht: { type: 'string' }, commit: { type: 'string' },
      ausgabe: { type: 'string' }, zusammenfassung: { type: 'string' }, liste: { type: 'boolean' }, startwerte: { type: 'boolean' },
    },
  });
  if (arg.startwerte) { process.stdout.write(startwerteSql(await konfigLaden())); return; }
  if (arg.liste) { await liste(arg); return; }
  if (!arg.roh) throw new Error('Aufruf: --roh <export.json> | --liste | --startwerte');
  await uebernehmen(arg);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((e) => {
    if (e instanceof Ungueltig || e instanceof BetriebswerteFehler) {
      console.error(`Betriebswerte ungültig – nichts geschrieben:\n  • ${e.message.split('\n').join('\n  • ')}\nBitte in Supabase (Tabelle betrieb.werte) korrigieren.`);
      process.exitCode = 1;
    } else {
      console.error(`Betriebswerte: technischer Fehler – ${e.message}`);
      process.exitCode = 2;
    }
  });
}
