// Reine Logik (testbar, Build und Browser): sichere mailto:-Adresse aus Formularangaben.
// Schutz gegen Kopfzeilen-Einschleusung: Empfänger streng geprüft, Betreff ohne Zeilenumbrüche und Steuerzeichen,
// nur subject und body als Parameter. Die kodierte Adresse bleibt ≤ MAX_LAENGE Zeichen (Mail-Programme kürzen
// längere Adressen unbemerkt); ein zu langer Text wird an einer Wortgrenze gekürzt und das gemeldet.
export const MAX_LAENGE = 1900;
const ADRESSE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const STEUER = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u2028\u2029]/g;
const GEKUERZT = '\n\n[gekürzt – bitte in der E-Mail ergänzen]';

export const adresseGueltig = (s) => typeof s === 'string' && s.length <= 254 && ADRESSE.test(s) && !s.includes('..');

/** Eine Zeile (Betreff, Feldwerte): ohne Umbrüche und Steuerzeichen, Leerraum zusammengefasst, begrenzt. */
export function zeile(s, max = 120) {
  return String(s ?? '').replace(/[\r\n]+/g, ' ').replace(STEUER, '').replace(/\s+/g, ' ').trim().slice(0, max);
}

/** Mehrzeiliger Text: Zeilenenden vereinheitlicht, Steuerzeichen entfernt, höchstens zwei Leerzeilen in Folge. */
export function absatz(s, max = 4000) {
  return String(s ?? '').replace(/\r\n?/g, '\n').replace(STEUER, '').replace(/\n{3,}/g, '\n\n').trim().slice(0, max);
}

// RFC 6068: Zeilenumbrüche im body als %0D%0A; encodeURIComponent kodiert alles Nötige (auch &, =, ?, #)
const kodiere = (s) => encodeURIComponent(s).replace(/%0A/g, '%0D%0A');

/**
 * mailto:-Adresse bauen. felder: [{ titel, wert }] werden als „Titel: Wert“ über der Nachricht aufgeführt.
 * Ergebnis: { url, gekuerzt } oder wirft bei ungültigem Empfänger.
 */
export function mailtoUrl({ an, betreff, felder = [], nachricht = '' }) {
  if (!adresseGueltig(an)) throw new Error('Empfängeradresse ungültig');
  const kopf = `mailto:${an}?subject=${kodiere(zeile(betreff, 120))}&body=`;
  const angaben = felder.map((f) => ({ titel: zeile(f.titel, 40), wert: zeile(f.wert, 200) })).filter((f) => f.wert);
  const text = [angaben.map((f) => `${f.titel}: ${f.wert}`).join('\n'), absatz(nachricht)].filter(Boolean).join('\n\n');
  let url = kopf + kodiere(text);
  if (url.length <= MAX_LAENGE) return { url, gekuerzt: false };
  // an Wortgrenze kürzen, bis die kodierte Fassung mit Hinweis passt
  const rest = MAX_LAENGE - kopf.length - kodiere(GEKUERZT).length;
  let ende = text.length;
  while (ende > 0 && kodiere(text.slice(0, ende)).length > rest) ende = Math.floor(ende * 0.9);
  const leer = text.lastIndexOf(' ', ende);
  const kurz = text.slice(0, leer > ende * 0.8 ? leer : ende).trimEnd();
  url = kopf + kodiere(kurz + GEKUERZT);
  return { url, gekuerzt: true };
}

/** Pflichtfelder prüfen: regeln = [{ id, titel, pflicht, min }]; liefert [{ id, text }] in Formularreihenfolge. */
export function pruefen(werte, regeln) {
  const fehler = [];
  for (const r of regeln) {
    const w = String(werte[r.id] ?? '').trim();
    if (r.pflicht && !w) fehler.push({ id: r.id, text: `${r.titel}: Bitte ausfüllen.` });
    else if (w && r.min && w.length < r.min) fehler.push({ id: r.id, text: `${r.titel}: Bitte etwas ausführlicher.` });
  }
  return fehler;
}
