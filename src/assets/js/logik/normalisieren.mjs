// Ortsnamen-Schlüssel für Suche und Abgleich. Wird auch im Browser gebündelt:
// keine node:-Importe, nur benannte Exporte.

/** Schlüssel eines Namens: klein, ohne Umlaute und Akzente, Abkürzungen ausgeschrieben, Bindestriche. */
export function schluessel(s) {
  let t = String(s).normalize('NFC').toLocaleLowerCase('de')
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/[ßẞ]/g, 'ss');
  t = t.normalize('NFD').replace(/\p{M}/gu, '');
  t = t.replace(/^st\.?\s/, 'sankt ')
    .replace(/\bi\.\s?/g, 'im ')
    .replace(/\ba\.\s?d\.\s?/g, 'an der ')
    .replace(/\bv\.\s?d\.\s?h(?:oehe|\.?)/g, 'vor der hoehe ')
    .replace(/\bb\.\s?/g, 'bei ')
    .replace(/\bo\.\s?/g, 'ob ');
  return t.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/** Grundname eines Ortes: ohne Klammern, Zusätze („im …“, „an der …“, „v.d.Höhe“) und Teile nach „/“ und „,“. */
export function kern(s) {
  const t = String(s).normalize('NFC')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/,.*$/, '')
    .replace(/\/.*$/, '')
    .replace(/\s+(?:(?:am|an der|an|im|in|bei|ob der|vor der)\s|v\.\s?d\.|i\.|a\.\s?d\.|a\.).*$/i, '');
  return schluessel(t);
}

/** Suchschlüssel mit und ohne Umlaut-e („Mücke“ → muecke, mucke), dedupliziert. */
export function suchVarianten(s) {
  const roh = String(s).normalize('NFC');
  const ohne = roh.replace(/ä/gi, 'a').replace(/ö/gi, 'o').replace(/ü/gi, 'u');
  return [...new Set([schluessel(roh), schluessel(ohne)])];
}
