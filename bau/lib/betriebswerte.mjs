// Betriebswerte (D-DATEN-01): Angaben, die nur der Betrieb kennt (Firmendaten, Erreichbarkeit, Preise, Zusagen,
// Leistungen je Zone), pflegt der Inhaber in Supabase (Tabelle betrieb.werte). Der Workflow
// .github/workflows/betriebswerte.yml übernimmt nur bestätigte Werte als Schnappschuss nach
// src/daten/betriebswerte.json und öffnet dafür einen Pull Request. Der Bau liest ausschließlich diese Datei und
// setzt die Werte nach dem Laden der Konfiguration ein; was fehlt, bleibt Platzhalter (Release-Sperre unverändert).
// Besucher berühren Supabase nie. Reine Funktionen, nur Node-Bordmittel; der JS-Validator hier ist maßgeblich, die
// Prüfungen in der Datenbank (pipeline/betriebswerte/datenbank.sql) fangen nur Tippfehler beim Speichern ab.
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { platzhalterIn, istPlatzhalter } from './platzhalter.mjs';
import { geheimnisTreffer } from './geheimnisse.mjs';
import { bandPruefen, zeitText, TAGESARTEN } from '../../src/assets/js/logik/preise.mjs';
import { adresseGueltig } from '../../src/assets/js/logik/mailto.mjs';

export class BetriebswerteFehler extends Error {}

export const STANDARD_DATEI = 'src/daten/betriebswerte.json';
export const FORMAT = 1;
export const QUELLE = 'Supabase betrieb.freigegeben – geschrieben von .github/workflows/betriebswerte.yml, nicht von Hand bearbeiten';

export const TYPEN = ['text', 'text_oder_leer', 'plz', 'telefon_anzeige', 'telefon_e164', 'email', 'https_basis', 'ust_modus', 'ja_nein', 'betrag', 'zeiten', 'tagesband'];
export const WOCHENTAGE = ['mo', 'di', 'mi', 'do', 'fr', 'sa', 'so'];
const TAGNAME = { mo: 'Mo', di: 'Di', mi: 'Mi', do: 'Do', fr: 'Fr', sa: 'Sa', so: 'So' };

// Kontakt- und Adressangaben: Änderungen hebt der Pull Request hervor (gekaperte Notrufnummer als Angriffsziel).
export const KONTAKT = ['betrieb.telefon', 'betrieb.telefon-e164', 'betrieb.email', 'betrieb.strasse', 'betrieb.plz', 'betrieb.basis-url'];

// Beträge in Cent: Positionen 10–3000 €, Anfahrt 0 € oder 1–500 €.
const POSITION = { min: 1000, max: 300000 };
const ANFAHRT = { null: 0, min: 100, max: 50000 };

// Feste Schlüssel (die Preise je Position und Zeitfenster und die abgeleiteten Uhrzeiten folgen in regelFuer).
const FEST = {
  'betrieb.name': { typ: 'text', max: 80, hinweis: 'Firmenname, erscheint als Wortmarke, im Titel und im Impressum.' },
  'betrieb.rechtsform': { typ: 'text', max: 60, hinweis: 'Rechtsform, z. B. Einzelunternehmen oder GmbH.' },
  'betrieb.inhaber': { typ: 'text', max: 120, hinweis: 'Inhaber oder vertretungsberechtigte Person.' },
  'betrieb.strasse': { typ: 'text', max: 80, ziffer: true, hinweis: 'Straße und Hausnummer in Weilburg.' },
  'betrieb.plz': { typ: 'plz', hinweis: 'Postleitzahl in Weilburg (fünf Ziffern).' },
  'betrieb.telefon': { typ: 'telefon_anzeige', hinweis: 'Notrufnummer, wie sie angezeigt wird, z. B. 06471 123456. Dieselbe Nummer wie in betrieb.telefon-e164.' },
  'betrieb.telefon-e164': { typ: 'telefon_e164', hinweis: 'Dieselbe Nummer international ohne Leerzeichen, z. B. +496471123456.' },
  'betrieb.email': { typ: 'email', hinweis: 'Adresse für Kontakt und Anfragen; steht auch in security.txt.' },
  'betrieb.zeiten': { typ: 'zeiten', hinweis: 'Telefonische Erreichbarkeit je Wochentag (Europe/Berlin), JSON wie {"mo":[["08:00","18:00"]],…,"so":[]}.' },
  'betrieb.nachtdienst': { typ: 'ja_nein', hinweis: 'Nachtdienst außerhalb der Zeiten: ja oder nein.' },
  'betrieb.basis-url': { typ: 'https_basis', titel: 'Adresse der Website (https://…)', hinweis: 'https:// und die Domain, ohne Pfad und ohne Schrägstrich; muss zum Hoster passen (mit oder ohne www).' },
  'impressum.register': { typ: 'text_oder_leer', max: 200, hinweis: 'Registereintrag oder „kein Registereintrag“; ohne_wert lässt die Zeile entfallen.' },
  'impressum.ust-id': { typ: 'text_oder_leer', max: 40, ustId: true, hinweis: 'USt-IdNr. (DE und 9 Ziffern) oder W-IdNr. (DE, 9 Ziffern, Bindestrich, 5 Ziffern); ohne_wert lässt die Zeile entfallen.' },
  'impressum.kammer': { typ: 'text_oder_leer', max: 200, hinweis: 'Zuständige Kammer; ohne_wert lässt die Zeile entfallen.' },
  'impressum.berufsbezeichnung': { typ: 'text_oder_leer', max: 200, hinweis: 'Berufsbezeichnung und Staat der Verleihung; ohne_wert lässt die Zeile entfallen.' },
  'impressum.mstv': { typ: 'text_oder_leer', max: 300, hinweis: 'Verantwortliche Person mit Anschrift (Medienstaatsvertrag); ohne_wert lässt den Abschnitt entfallen.' },
  'impressum.vsbg': { typ: 'text_oder_leer', max: 600, hinweis: 'Erklärung zur Verbraucherstreitbeilegung; ohne_wert lässt den Abschnitt entfallen.' },
  'zusagen.preis-vor-auftrag': { typ: 'ja_nein', hinweis: 'Zusage: Gesamtpreis vor Arbeitsbeginn (ja = Zusagetext, nein = neutraler Text).' },
  'zusagen.rechnung-positionen': { typ: 'ja_nein', hinweis: 'Zusage: Rechnung mit allen Positionen.' },
  'zusagen.kartenzahlung': { typ: 'ja_nein', hinweis: 'Zusage: Kartenzahlung vor Ort; passend zu preise.zahlarten.' },
  'zusagen.erfolglos': { typ: 'ja_nein', hinweis: 'Zusage zu den Kosten, wenn die Öffnung nicht gelingt.' },
  'preise.ust-modus': { typ: 'ust_modus', hinweis: '„regel“ (Regelbesteuerung) oder „klein“ (Kleinunternehmer). Die Preise sind Endpreise und werden nicht umgerechnet.' },
  'preise.tagesband': { typ: 'tagesband', hinweis: 'Uhrzeiten der Zeitfenster je Tagesart, lückenlos 00:00–24:00, JSON wie {"werktags":[["nacht","00:00","07:00"],…],"wochenende":[["wochenende","00:00","24:00"]]}. Die Uhrzeiten der Preistabelle entstehen daraus.' },
  'preise.anfahrt-b': { typ: 'betrag', grenzen: ANFAHRT, hinweis: 'Anfahrtsaufschlag Zone B in Euro (0 oder 1–500); ohne_wert = nach Absprache.' },
  'preise.anfahrt-c': { typ: 'betrag', grenzen: ANFAHRT, hinweis: 'Anfahrt Zone C in Euro (0 oder 1–500); ohne_wert = nach Absprache, wie die Texte es heute sagen.' },
  'preise.zahlarten': { typ: 'text', max: 200, zahlarten: true, hinweis: 'Zahlarten als Text, ohne Beträge und ohne Aufschläge (§ 270a BGB), z. B. „Bar, Girocard, Kreditkarte“.' },
  'zonen.a.leistungen': { typ: 'ja_nein', hinweis: 'Leistungen in Zone A (Kerngebiet) auf den Ortsseiten zeigen: ja oder nein.' },
  'zonen.b.leistungen': { typ: 'ja_nein', hinweis: 'Leistungen in Zone B (Umland) auf den Ortsseiten zeigen: ja oder nein.' },
  'zonen.c.leistungen': { typ: 'ja_nein', hinweis: 'Leistungen in Zone C (Region) auf den Ortsseiten zeigen: ja oder nein.' },
  'zonen.d.leistungen': { typ: 'ja_nein', hinweis: 'Leistungen in Zone D (überregional) auf den Ortsseiten zeigen: ja oder nein.' },
};

const fensterIds = (konfig) => konfig.preise.zeitfenster.map((z) => z.id);
const positionIds = (konfig) => konfig.preise.positionen.map((p) => p.id);
const schreibweise = (liste) => liste.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');

/**
 * Regel eines Schlüssels: { typ, … } für Werte aus Supabase, { abgeleitet } für Werte, die der Bau selbst bildet,
 * null für unbekannte Schlüssel.
 */
export function regelFuer(schluessel, konfig) {
  if (Object.hasOwn(FEST, schluessel)) return FEST[schluessel];
  const fenster = fensterIds(konfig);
  const zeit = schluessel.match(new RegExp(`^preise\\.zeit-(${schreibweise(fenster)})$`));
  if (zeit) return { abgeleitet: 'preise.tagesband', fenster: zeit[1] };
  const preis = schluessel.match(new RegExp(`^preise\\.(${schreibweise(positionIds(konfig))})\\.(${schreibweise(fenster)})$`));
  if (preis) {
    const pos = konfig.preise.positionen.find((p) => p.id === preis[1]);
    const zf = konfig.preise.zeitfenster.find((z) => z.id === preis[2]);
    return { typ: 'betrag', grenzen: POSITION, position: pos.id, fenster: zf.id, titel: `${pos.titel} – ${zf.titel}`, hinweis: 'Gesamtpreis in Euro inkl. Umsatzsteuer und Anfahrt in Zone A (10–3000); ohne_wert = nach Absprache.' };
  }
  return null;
}

/** Alle Platzhalter der Konfiguration mit Regel. Wirft, wenn ein Platzhalter keine Regel hat (Drift Code/Datenbank). */
export function schluesselAusKonfig(konfig) {
  return platzhalterIn({ betrieb: konfig.betrieb, preise: konfig.preise, zonen: konfig.zonen }).map((p) => {
    const regel = regelFuer(p.schluessel, konfig);
    if (!regel) throw new Error(`Betriebswerte: Platzhalter ${p.schluessel} (${p.pfad}) hat keine Regel in bau/lib/betriebswerte.mjs.`);
    return {
      schluessel: p.schluessel,
      pfad: p.pfad,
      beschriftung: regel.titel ?? p.beschriftung,
      typ: regel.typ ?? null,
      quelle: regel.abgeleitet ? 'abgeleitet' : 'supabase',
      hinweis: regel.abgeleitet ? `wird aus ${regel.abgeleitet} abgeleitet` : regel.hinweis,
    };
  });
}

/* ---------- Laden -------------------------------------------------------- */

/** Liest den Schnappschuss. Fehlt die Datei, sind keine Werte bestätigt. Aufbaufehler werfen BetriebswerteFehler. */
export async function betriebswerteLaden(wurzel, datei = STANDARD_DATEI) {
  let text;
  try {
    text = await readFile(resolve(wurzel, datei), 'utf8');
  } catch (e) {
    if (e.code === 'ENOENT') return { vorhanden: false, datei, werte: {} };
    throw e;
  }
  if (text.startsWith('﻿')) text = text.slice(1);
  let daten;
  try { daten = JSON.parse(text); } catch (e) {
    throw new BetriebswerteFehler(`Betriebswerte ungültig – ${datei}: kein gültiges JSON (${e.message}).`);
  }
  const fehler = [];
  if (!istObjekt(daten)) fehler.push('erwartet ein Objekt { format, quelle, werte }');
  else {
    for (const k of Object.keys(daten)) if (!['format', 'quelle', 'werte'].includes(k)) fehler.push(`unbekanntes Feld „${k}“`);
    if (daten.format !== FORMAT) fehler.push(`format ${JSON.stringify(daten.format)} – dieser Bau versteht format ${FORMAT}`);
    if (!istObjekt(daten.werte)) fehler.push('werte fehlt oder ist kein Objekt');
  }
  if (fehler.length) throw new BetriebswerteFehler(`Betriebswerte ungültig – ${datei}: ${fehler.join('; ')}.`);
  return { vorhanden: true, datei, werte: daten.werte };
}

const istObjekt = (w) => w !== null && typeof w === 'object' && !Array.isArray(w);

/* ---------- Prüfen ------------------------------------------------------- */

const STEUER = /[\u0000-\u001F\u007F-\u009F]/u;
const UNSICHTBAR = /[؜​-‏‪-‮⁠-⁤⁦-⁩﻿]/u;
const VERBOTEN = /[[\]<>{}§⟦⟧]/u;
// Wie der Prüfer emoji (Symbolzeichen) plus die Pfeile, die im Titel verboten sind (der Firmenname steht im Titel).
const SYMBOL = /[\p{Extended_Pictographic}★☆✓✔✗✘☎☏▾▸►◄≡⏰▷✆⚠❗❕➜➔→←]/u;
const UHR = /^([01]\d|2[0-3]):[0-5]\d$/;
const UHR_ENDE = /^(([01]\d|2[0-3]):[0-5]\d|24:00)$/;
const minuten = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };

function textFehler(w, { min = 2, max = 200 } = {}) {
  if (typeof w !== 'string') return [`erwartet Text, gefunden ${art(w)}`];
  const f = [];
  if (w !== w.normalize('NFC')) f.push('ist nicht in Unicode-Normalform NFC');
  if (w !== w.trim()) f.push('beginnt oder endet mit Leerraum');
  if (/[\r\n]/.test(w)) f.push('enthält einen Zeilenumbruch');
  else if (STEUER.test(w) || UNSICHTBAR.test(w)) f.push('enthält Steuer- oder unsichtbare Zeichen');
  if (VERBOTEN.test(w)) f.push('enthält eines der Zeichen [ ] < > { } § ⟦ ⟧');
  if (SYMBOL.test(w)) f.push('enthält ein Emoji oder Symbolzeichen');
  if (w.includes('://')) f.push('enthält eine Adresse mit „://“');
  const n = [...w].length;
  if (n < min || n > max) f.push(`erwartet ${min}–${max} Zeichen, gefunden ${n}`);
  return f;
}

const art = (w) => (w === null ? 'null' : Array.isArray(w) ? 'Liste' : typeof w === 'object' ? 'Objekt' : typeof w === 'string' ? `„${kurz(w)}“` : String(w));
const kurz = (s) => (s.length > 40 ? `${s.slice(0, 37)}…` : s);

/** Ziffernfolge einer deutschen Nummer als 49… (für den Vergleich von Anzeige und E.164). */
export const nummerZiffern = (s) => {
  const ziffern = String(s).replace(/\D/g, '');
  if (String(s).trim().startsWith('+')) return ziffern;
  return ziffern.startsWith('0') ? `49${ziffern.slice(1)}` : ziffern;
};

const PRUEFER = {
  text: (w, r) => textFehler(w, r),
  text_oder_leer: (w, r) => (w === null ? [] : textFehler(w, r)),
  plz: (w) => (typeof w === 'string' && /^\d{5}$/.test(w) ? [] : [`erwartet fünf Ziffern als Text, gefunden ${art(w)}`]),
  telefon_anzeige: (w) => {
    if (typeof w !== 'string') return [`erwartet Text, gefunden ${art(w)}`];
    const f = [];
    if (!/^[0-9 /()+-]+$/.test(w)) f.push('erlaubt sind Ziffern, Leerzeichen und / - ( ) +');
    if (!/^(0|\+49)/.test(w)) f.push('beginnt mit 0 oder +49');
    const n = w.replace(/\D/g, '').length;
    if (n < 6 || n > 15) f.push(`erwartet 6–15 Ziffern, gefunden ${n}`);
    // Eine freistehende Vierergruppe 19xx/20xx hielte der Prüfer fakten für eine Jahreszahl ohne Beleg.
    if (/(?<!\d)(19|20)\d{2}(?!\d)/.test(w)) f.push('eine freistehende Vierergruppe 19xx oder 20xx wirkt wie eine Jahreszahl – Ziffern anders gruppieren (z. B. „20 45“)');
    if (w !== w.trim() || /\s{2,}/.test(w)) f.push('enthält doppelten oder äußeren Leerraum');
    return f;
  },
  telefon_e164: (w) => {
    if (typeof w !== 'string' || !/^\+49[1-9]\d{5,12}$/.test(w)) return [`erwartet +49 und 6–13 Ziffern ohne Leerzeichen (z. B. +496471999999), gefunden ${art(w)}`];
    if (/^\+49(900|137|138)/.test(w)) return ['Mehrwertdienst-Nummer (0900, 0137, 0138) ist nicht erlaubt'];
    return [];
  },
  email: (w) => (adresseGueltig(w) ? [] : [`erwartet eine E-Mail-Adresse, gefunden ${art(w)}`]),
  https_basis: (w) => (typeof w === 'string' && /^https:\/\/([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(w)
    ? [] : [`erwartet https:// und eine Domain in Kleinbuchstaben ohne Pfad und ohne Schrägstrich, gefunden ${art(w)}`]),
  ust_modus: (w) => (w === 'regel' || w === 'klein' ? [] : [`erwartet „regel“ oder „klein“, gefunden ${art(w)}`]),
  ja_nein: (w) => (typeof w === 'boolean' ? [] : [`erwartet true oder false, gefunden ${art(w)}`]),
  betrag: (w, r) => {
    if (w === null) return [];
    if (!Number.isInteger(w)) return [`erwartet einen Betrag in Cent als ganze Zahl oder null, gefunden ${art(w)}`];
    const g = r.grenzen;
    if (w === g.null) return [];
    if (w < g.min || w > g.max) return [`erwartet ${g.null === undefined ? '' : `${euroText(g.null)} oder `}${euroText(g.min)}–${euroText(g.max)}, gefunden ${euroText(w)}`];
    return [];
  },
  zeiten: (w) => {
    if (!istObjekt(w)) return [`erwartet ein Objekt mit den Tagen mo–so, gefunden ${art(w)}`];
    const f = [];
    const tage = Object.keys(w);
    for (const t of tage) if (!WOCHENTAGE.includes(t)) f.push(`unbekannter Tag „${t}“`);
    for (const t of WOCHENTAGE) if (!tage.includes(t)) f.push(`Tag „${t}“ fehlt (leere Liste = nicht erreichbar)`);
    for (const t of WOCHENTAGE.filter((x) => tage.includes(x))) {
      const liste = w[t];
      if (!Array.isArray(liste)) { f.push(`${t}: erwartet eine Liste von [von, bis]`); continue; }
      if (liste.length > 3) f.push(`${t}: höchstens drei Zeiträume`);
      let ende = -1;
      for (const z of liste) {
        if (!Array.isArray(z) || z.length !== 2 || typeof z[0] !== 'string' || typeof z[1] !== 'string') { f.push(`${t}: Zeitraum ${JSON.stringify(z)} ist kein Paar [„HH:MM“, „HH:MM“]`); continue; }
        const [von, bis] = z;
        if (!UHR.test(von) || !UHR_ENDE.test(bis)) { f.push(`${t}: Uhrzeit ${von}–${bis} (erwartet HH:MM, Ende bis 24:00)`); continue; }
        if (minuten(bis) <= minuten(von)) f.push(`${t}: ${von}–${bis} endet nicht nach dem Beginn (über Mitternacht auf zwei Tage teilen)`);
        if (minuten(von) <= ende) f.push(`${t}: ${von}–${bis} überschneidet oder berührt den vorigen Zeitraum oder ist nicht aufsteigend`);
        ende = Math.max(ende, minuten(bis));
      }
    }
    return f;
  },
  tagesband: (w, r, konfig) => {
    if (!istObjekt(w)) return [`erwartet ein Objekt { werktags, wochenende }, gefunden ${art(w)}`];
    const f = [];
    for (const k of Object.keys(w)) if (!TAGESARTEN.includes(k)) f.push(`unbekannte Tagesart „${k}“`);
    for (const a of TAGESARTEN) {
      for (const e of Array.isArray(w[a]) ? w[a] : []) {
        if (!Array.isArray(e) || e.length !== 3 || e.some((x) => typeof x !== 'string')) { f.push(`${a}: Eintrag ${JSON.stringify(e)} ist kein [Fenster, „HH:MM“, „HH:MM“]`); continue; }
        if (!UHR.test(e[1]) || !UHR_ENDE.test(e[2])) f.push(`${a}: Uhrzeit ${e[1]}–${e[2]} (erwartet HH:MM, Ende bis 24:00)`);
      }
    }
    if (f.length) return f;
    const ids = fensterIds(konfig);
    f.push(...bandPruefen(w, ids));
    if (f.length) return f;
    const genutzt = new Set(TAGESARTEN.flatMap((a) => w[a].map(([id]) => id)));
    for (const id of ids) if (!genutzt.has(id)) f.push(`Zeitfenster „${id}“ kommt im Tagesband nicht vor (seine Uhrzeit bliebe leer)`);
    return f;
  },
};

const euroText = (cent) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(cent / 100).replace(/\s/g, ' ');

/** Alle Text-Blätter eines Werts (für die Geheimnis-Muster). */
const texte = (w) => (typeof w === 'string' ? [w] : Array.isArray(w) ? w.flatMap(texte) : istObjekt(w) ? Object.values(w).flatMap(texte) : []);

/**
 * Prüft einen Schnappschuss gegen die Regeln und gegen die Konfiguration. Liefert { fehler, warnungen } mit je einer
 * deutschen Meldung pro Befund (alle Schlüssel auf einmal). Werte erscheinen in Meldungen nur gekürzt, Geheimnis-Muster
 * nie im Wortlaut.
 */
export function betriebswertePruefen(werte, { konfig, daten = {} }) {
  const fehler = [];
  const warnungen = [];
  if (!istObjekt(werte)) return { fehler: ['werte ist kein Objekt'], warnungen };
  const offen = new Set(platzhalterIn({ betrieb: konfig.betrieb, preise: konfig.preise, zonen: konfig.zonen }).map((p) => p.schluessel));
  const gueltig = {};
  for (const schluessel of Object.keys(werte).sort()) {
    const w = werte[schluessel];
    const regel = regelFuer(schluessel, konfig);
    if (!regel) { fehler.push(`${schluessel}: unbekannter Schlüssel (nicht in der Konfiguration)`); continue; }
    if (regel.abgeleitet) { fehler.push(`${schluessel}: wird aus ${regel.abgeleitet} abgeleitet und gehört nicht in die Betriebswerte`); continue; }
    const geheim = geheimnisTreffer(texte(w).join('\n'));
    if (geheim.length) { fehler.push(`${schluessel}: enthält ein Geheimnis-Muster (${geheim.join(', ')}) – Wert nicht übernommen`); continue; }
    let eigene = PRUEFER[regel.typ](w, regel, konfig);
    if (!eigene.length && typeof w === 'string') eigene = zusatzFehler(regel, w);
    if (eigene.length) { for (const m of eigene) fehler.push(`${schluessel}: ${m}`); continue; }
    if (!offen.has(schluessel)) { fehler.push(`${schluessel}: steht in der Konfiguration bereits fest (kein Platzhalter mehr) – einen der beiden Werte entfernen`); continue; }
    if (regel.typ === 'telefon_e164' && /^\+49180/.test(w)) warnungen.push(`${schluessel}: 0180-Nummer – für Anrufer kostenpflichtig, besser eine Festnetz- oder Mobilnummer`);
    gueltig[schluessel] = w;
  }
  // Prüfungen über mehrere Schlüssel am fertigen Stand (Schnappschuss plus fest eingetragene Werte)
  const { konfig: neu } = betriebswerteAnwenden(konfig, gueltig);
  const b = neu.betrieb;
  const echt = (w) => !istPlatzhalter(w);
  if (echt(b.telefon.anzeige) && echt(b.telefon.e164) && nummerZiffern(b.telefon.anzeige) !== nummerZiffern(b.telefon.e164)) {
    fehler.push('betrieb.telefon / betrieb.telefon-e164: Anzeige und +49-Form nennen verschiedene Nummern');
  }
  if (echt(b.adresse.plz)) {
    if (!Array.isArray(daten.plz)) warnungen.push('betrieb.plz: src/daten/plz.json fehlt – Zuordnung zu Weilburg nicht geprüft');
    else if (!daten.plz.some((e) => e.plz === b.adresse.plz && e.ort === b.adresse.ort)) fehler.push(`betrieb.plz: ${b.adresse.plz} gehört laut src/daten/plz.json nicht zu ${b.adresse.ort}`);
  }
  if (echt(b.basisUrl) && /\.(netlify\.app|vercel\.app|pages\.dev|example|test|invalid|localhost)$/.test(b.basisUrl)) {
    warnungen.push(`betrieb.basis-url: ${b.basisUrl} ist eine Test-Adresse – für den Release die echte Domain eintragen`);
  }
  const p = neu.preise;
  if (p.anfahrt.B === null) warnungen.push('preise.anfahrt-b: „nach Absprache“ – die Preisseite verspricht für Zone B einen festen Aufschlag je Einsatz (FAQ in src/inhalte/preise.mjs anpassen)');
  if (Number.isInteger(p.anfahrt.C)) warnungen.push('preise.anfahrt-c: fester Betrag – die Texte zu Zone C sagen „nach Absprache“ (src/inhalte/einsatzgebiet.mjs und FAQ prüfen)');
  const nachtpreis = p.positionen.some((pos) => Number.isInteger(pos.preise.nacht));
  if (b.erreichbarkeit.nachtdienst === false && nachtpreis) warnungen.push('betrieb.nachtdienst: kein Nachtdienst, aber Preise im Zeitfenster „nacht“ – Angaben abgleichen');
  if (echt(b.zusagen.kartenzahlung) && echt(p.zahlarten)) {
    const karte = /karte|girocard|\bec\b|kredit|debit/i.test(p.zahlarten);
    if (b.zusagen.kartenzahlung === true && !karte) warnungen.push('zusagen.kartenzahlung: Zusage Kartenzahlung, aber preise.zahlarten nennt keine Karte');
    if (b.zusagen.kartenzahlung === false && karte) warnungen.push('zusagen.kartenzahlung: keine Zusage, aber preise.zahlarten nennt eine Karte');
  }
  return { fehler, warnungen };
}

function zusatzFehler(regel, w) {
  const f = [];
  if (regel.ziffer && !/\d/.test(w)) f.push('Hausnummer fehlt (keine Ziffer)');
  if (regel.ustId && !/^DE\d{9}(-\d{5})?$/.test(w)) f.push('erwartet DE und 9 Ziffern (USt-IdNr.) oder DE, 9 Ziffern, Bindestrich und 5 Ziffern (W-IdNr.)');
  if (regel.zahlarten) {
    if (/[0-9€%]/.test(w)) f.push('ohne Ziffern, € und % (keine Beträge)');
    if (/aufschlag|zuschlag|gebühr/i.test(w)) f.push('keine Aufschläge oder Gebühren je Zahlart (§ 270a BGB)');
  }
  return f;
}

/* ---------- Anwenden ----------------------------------------------------- */

// Kopie aus einfachen Objekten und Listen; Platzhalter bleiben dieselben Instanzen (Markierungen in der Vorschau),
// Infinity bleibt erhalten. Die Module der Konfiguration selbst werden nie verändert.
const kopie = (w) => {
  if (Array.isArray(w)) return w.map(kopie);
  if (w && typeof w === 'object' && Object.getPrototypeOf(w) === Object.prototype) return Object.fromEntries(Object.entries(w).map(([k, v]) => [k, kopie(v)]));
  return w;
};

function setzen(wurzel, pfad, wert) {
  const teile = pfad.match(/[^.[\]]+/g);
  let o = wurzel;
  for (const t of teile.slice(0, -1)) o = o[t];
  o[teile.at(-1)] = wert;
}

/**
 * Setzt die Werte in eine Kopie von betrieb, preise und zonen ein (nur dort, wo ein Platzhalter steht) und leitet die
 * Uhrzeiten der Zeitfenster aus dem Tagesband ab. Übrige Teile der Konfiguration werden durchgereicht.
 */
export function betriebswerteAnwenden(konfig, werte) {
  const neu = { ...konfig, betrieb: kopie(konfig.betrieb), preise: kopie(konfig.preise), zonen: kopie(konfig.zonen) };
  const wurzel = { betrieb: neu.betrieb, preise: neu.preise, zonen: neu.zonen };
  const uebernommen = [];
  for (const p of platzhalterIn(wurzel)) {
    if (!Object.hasOwn(werte, p.schluessel)) continue;
    setzen(wurzel, p.pfad, werte[p.schluessel]);
    uebernommen.push(p.schluessel);
  }
  const abgeleitet = [];
  const band = neu.preise.tagesband;
  if (!istPlatzhalter(band) && band && !bandPruefen(band, fensterIds(neu)).length) {
    for (const z of neu.preise.zeitfenster) {
      if (!istPlatzhalter(z.zeit)) continue;
      const schluessel = z.zeit.schluessel;
      z.zeit = zeitText(band, z.id);
      abgeleitet.push(schluessel);
    }
  }
  return { konfig: neu, uebernommen: uebernommen.sort(), abgeleitet: abgeleitet.sort() };
}

/* ---------- Ausgabe ------------------------------------------------------ */

const sortiert = (w) => (Array.isArray(w) ? w.map(sortiert) : istObjekt(w) ? Object.fromEntries(Object.keys(w).sort().map((k) => [k, sortiert(w[k])])) : w);

/** Gleicher Wert unabhängig von der Reihenfolge der Schlüssel (Supabase liefert jsonb in eigener Ordnung). */
export const gleicherWert = (a, b) => JSON.stringify(sortiert(a)) === JSON.stringify(sortiert(b));

/** Kanonischer Text des Schnappschusses: Schlüssel sortiert, 2 Leerzeichen, LF am Ende, ohne Zeitstempel. */
export function serialisieren(werte) {
  return `${JSON.stringify({ format: FORMAT, quelle: QUELLE, werte: sortiert(werte) }, null, 2)}\n`;
}

/** Lesbare Darstellung eines Werts für Berichte und den Pull Request. */
export function anzeige(schluessel, wert, konfig) {
  const regel = konfig ? regelFuer(schluessel, konfig) : null;
  if (wert === undefined) return '—';
  if (regel?.typ === 'betrag') return wert === null ? 'nach Absprache' : euroText(wert);
  if (regel?.typ === 'text_oder_leer' && wert === null) return 'entfällt';
  if (typeof wert === 'boolean') return wert ? 'ja' : 'nein';
  if (regel?.typ === 'zeiten' && istObjekt(wert)) {
    return WOCHENTAGE.map((t) => `${TAGNAME[t]} ${(wert[t] ?? []).length ? wert[t].map(([v, b]) => `${v}–${b}`).join(', ') : 'nicht erreichbar'}`).join('; ');
  }
  if (regel?.typ === 'tagesband' && istObjekt(wert)) {
    return TAGESARTEN.map((a) => `${a}: ${(wert[a] ?? []).map(([id, v, b]) => `${id} ${v}–${b}`).join(', ')}`).join('; ');
  }
  return typeof wert === 'string' ? wert : JSON.stringify(wert);
}

const sqlText = (s) => (s === null || s === undefined ? 'null' : `'${String(s).replace(/'/g, "''")}'`);

/** Startwerte für Supabase: eine Zeile je Schlüssel (ohne Werte); vorhandene Werte bleiben unberührt. */
export function startwerteSql(konfig) {
  const zeilen = schluesselAusKonfig(konfig)
    .filter((s) => s.quelle === 'supabase')
    .sort((a, b) => (a.schluessel < b.schluessel ? -1 : 1))
    .map((s) => `  (${sqlText(s.schluessel)}, ${sqlText(s.beschriftung)}, ${sqlText(s.typ)}, ${sqlText(s.hinweis)})`);
  return [
    '-- Startwerte der Tabelle betrieb.werte: eine Zeile je Betriebswert, ohne Wert (Projekt B, Supabase).',
    '-- Erzeugt mit „npm run betriebswerte -- --startwerte“ aus src/konfig/*.mjs – nicht von Hand bearbeiten;',
    '-- test/betriebswerte.test.mjs hält die Datei mit der Konfiguration gleich. Vorhandene Werte bleiben unberührt.',
    'insert into betrieb.werte (schluessel, beschriftung, typ, hinweis) values',
    `${zeilen.join(',\n')}`,
    'on conflict (schluessel) do update set beschriftung = excluded.beschriftung, typ = excluded.typ, hinweis = excluded.hinweis;',
    '',
  ].join('\n');
}
