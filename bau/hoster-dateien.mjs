#!/usr/bin/env node
// Schreibt vercel.json (Test-Deploy der Vorschau, noindex) ins Wurzelverzeichnis – aus src/konfig/sicherheit.mjs und
// src/daten/weiterleitungen.json. Vercel liest die Datei vor dem Bau; nach Änderungen an Headern oder Weiterleitungen
// neu erzeugen und committen (der Bau mit --ziel=vercel bricht sonst ab). Netlify braucht keine Datei: _headers schreibt der Bau.
import { writeFile } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pruefeWeiterleitungen, weiterleitungenLesen, vercelText } from './lib/hosting.mjs';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const weiterleitungen = await weiterleitungenLesen(WURZEL);
// Ob jedes Ziel existiert, prüft der Bau; hier nur Pfadform, Doppel und Ketten.
pruefeWeiterleitungen(weiterleitungen, () => true);
await writeFile(join(WURZEL, 'vercel.json'), vercelText(weiterleitungen));
console.log(`vercel.json geschrieben (${weiterleitungen.length} Weiterleitungen).`);
