// Emoji-Prüfer: Emojis und Symbolzeichen dürfen nicht als Gestaltungsmittel vorkommen.
// Geprüft wird die ganze Seite (Kopf, Fuß, Attribute). Die Pfeile → und ← sind im Textinhalt erlaubt
// (Brotkrumen nutzen ← per CSS); geprüft werden sie nur in <title> und meta description.
import { entitaeten, fundstelle, textfelder } from './ehrlichkeit.mjs';

export const name = 'emoji';

const ZEICHEN = /[\p{Extended_Pictographic}★☆✓✔✗✘☎☏▾▸►◄≡⏰▷✆⚠❗❕➜➔]/gu;
const PFEILE = /[→←]/gu;
const hex = (zeichen) => zeichen.codePointAt(0).toString(16).toUpperCase().padStart(4, '0');

export async function pruefe(ctx) {
  const befunde = [];
  for (const seite of ctx.seiten ?? []) {
    const roh = entitaeten(String(seite.html ?? ''));
    for (const m of roh.matchAll(ZEICHEN)) {
      befunde.push({
        regel: 'emoji/zeichen',
        schwere: 'fehler',
        datei: seite.datei,
        meldung: `Seite ${seite.pfad}: Zeichen U+${hex(m[0])} „${m[0]}“ – Fundstelle „…${fundstelle(roh, m.index, m.index + m[0].length)}…“`,
      });
    }
    for (const { feld, text } of textfelder(seite)) {
      if (feld !== 'title' && feld !== 'meta description') continue;
      for (const m of text.matchAll(PFEILE)) {
        befunde.push({
          regel: 'emoji/zeichen',
          schwere: 'fehler',
          datei: seite.datei,
          meldung: `Seite ${seite.pfad}, ${feld}: Pfeil U+${hex(m[0])} „${m[0]}“ – Fundstelle „…${fundstelle(text, m.index, m.index + 1)}…“`,
        });
      }
    }
  }
  return befunde;
}
