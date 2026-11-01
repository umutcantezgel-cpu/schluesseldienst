#!/usr/bin/env node
// Passwort der Rolle sd_export als SCRAM-SHA-256-Verifier (D-DATEN-01, docs/BETRIEB.md „Betriebswerte“).
//   node pipeline/betriebswerte/scram-verifier.mjs [rolle]
//     → Passwort eingeben (keine Anzeige) oder per Pipe übergeben;
//       Ausgabe: alter role sd_export password 'SCRAM-SHA-256$4096:…';
// Postgres speichert Passwörter nur als Verifier. Wer den Verifier statt des Klartexts im SQL-Editor setzt,
// hinterlässt das Passwort weder in dessen Historie noch in Protokollen. Erlaubt sind druckbare ASCII-Zeichen
// (mindestens 24): Andere Zeichen normalisiert Postgres per SASLprep, was hier nicht nachgebildet wird.
import { createHash, createHmac, pbkdf2Sync, randomBytes } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const ITERATIONEN = 4096;
export const MINDESTLAENGE = 24;

export function passwortPruefen(passwort) {
  if (!/^[\x21-\x7e]+$/.test(passwort)) return 'Nur druckbare ASCII-Zeichen ohne Leerzeichen.';
  if (passwort.length < MINDESTLAENGE) return `Mindestens ${MINDESTLAENGE} Zeichen.`;
  return null;
}

/** Verifier im Format von Postgres: SCRAM-SHA-256$<runden>:<salz>$<StoredKey>:<ServerKey> (RFC 5802/7677). */
export function scramVerifier(passwort, { salz = randomBytes(16), iterationen = ITERATIONEN } = {}) {
  const gesalzen = pbkdf2Sync(Buffer.from(passwort, 'utf8'), salz, iterationen, 32, 'sha256');
  const clientKey = createHmac('sha256', gesalzen).update('Client Key').digest();
  const storedKey = createHash('sha256').update(clientKey).digest();
  const serverKey = createHmac('sha256', gesalzen).update('Server Key').digest();
  return `SCRAM-SHA-256$${iterationen}:${salz.toString('base64')}$${storedKey.toString('base64')}:${serverKey.toString('base64')}`;
}

export function alterRole(rolle, verifier) {
  if (!/^[a-z_][a-z0-9_]{0,62}$/.test(rolle)) throw new Error(`Ungültiger Rollenname: ${rolle}`);
  return `alter role ${rolle} password '${verifier}';`;
}

// Liest das Passwort ohne Anzeige (Terminal) oder aus einer Pipe.
async function passwortLesen() {
  const { stdin, stderr } = process;
  if (!stdin.isTTY) {
    let text = '';
    for await (const teil of stdin) text += teil;
    return text.replace(/\r?\n$/, '');
  }
  stderr.write('Passwort (wird nicht angezeigt): ');
  stdin.setRawMode(true);
  stdin.setEncoding('utf8');
  stdin.resume();
  return new Promise((fertig, abbruch) => {
    let text = '';
    const ende = () => { stdin.setRawMode(false); stdin.pause(); stdin.removeListener('data', lesen); stderr.write('\n'); };
    const lesen = (zeichen) => {
      for (const z of zeichen) {
        if (z === '\r' || z === '\n') { ende(); fertig(text); return; }
        if (z === '\u0003') { ende(); abbruch(new Error('Abgebrochen.')); return; }
        text = z === '\u007f' || z === '\b' ? text.slice(0, -1) : text + z;
      }
    };
    stdin.on('data', lesen);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  (async () => {
    const passwort = await passwortLesen();
    const fehler = passwortPruefen(passwort);
    if (fehler) throw new Error(fehler);
    console.log(alterRole(process.argv[2] ?? 'sd_export', scramVerifier(passwort)));
  })().catch((e) => { console.error(e.message); process.exitCode = 1; });
}
