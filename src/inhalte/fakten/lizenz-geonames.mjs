// Faktenblatt lizenz-geonames: GeoNames-Lizenz. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [
  { id: 'q1', titel: 'Creative Commons – Namensnennung 4.0 International, Lizenztext (deutsche Fassung, Rechtscode)', url: 'https://creativecommons.org/licenses/by/4.0/legalcode.de', art: 'primaer', abgerufen: '2026-10-25' },
  { id: 'q2', titel: 'GeoNames – Startseite (Lizenzangabe zu den Daten)', url: 'https://www.geonames.org/', art: 'primaer', abgerufen: '2026-10-25' },
  { id: 'q3', titel: 'GeoNames – Data & Web Services (Hinweise zur Namensnennung)', url: 'https://www.geonames.org/export/', art: 'primaer', abgerufen: '2026-10-25' },
];

export default {
  id: 'lizenz-geonames',
  thema: 'GeoNames-Lizenz',
  stand: '2026-10-25',
  frage: 'Welche Bedingungen stellt CC BY 4.0 an Namensnennung und Kennzeichnung von Änderungen?',
  fakten: {
    'namensnennung': fakt({ id: 'lizenz-geonames.namensnennung', text: 'Wer das Material nach CC BY 4.0 weitergibt, muss die Bezeichnung des Urhebers und der für die Namensnennung vorgesehenen Stellen angeben (Abschnitt 3(a)(1)(A)(i)).', quelle: 'q1', status: 'verifizieren' }),
    'lizenzverweis': fakt({ id: 'lizenz-geonames.lizenzverweis', text: 'Bei der Weitergabe nach CC BY 4.0 ist ein Verweis auf diese Lizenz beizubehalten (Abschnitt 3(a)(1)(A)(iii)).', quelle: 'q1', status: 'verifizieren' }),
    'aenderungen': fakt({ id: 'lizenz-geonames.aenderungen', text: 'Wer das Material verändert hat und es weitergibt, muss nach CC BY 4.0 angeben, dass es verändert wurde, und frühere Änderungsangaben beibehalten (Abschnitt 3(a)(1)(B)).', quelle: 'q1', status: 'verifizieren' }),
    'geonames-lizenz': fakt({ id: 'lizenz-geonames.geonames-lizenz', text: 'Die GeoNames-Startseite nennt die Daten als frei unter „Creative Commons Attribution 4.0“.', quelle: 'q2', status: 'verifizieren' }),
    'geonames-hinweis': fakt({ id: 'lizenz-geonames.geonames-hinweis', text: 'GeoNames empfiehlt, bei der Nutzung der Daten mit einem Link oder einem anderen Verweis auf GeoNames Namensnennung zu geben.', quelle: 'q3', status: 'verifizieren' }),
  },
  offen: [
    'Versionsfrage: Die Export-Seite nennt nur „cc-by licence“ ohne Version. Die Startseite nennt 4.0. Suchtreffer zeigten eine Forumsseite mit CC BY 3.0 und eine Readme-Datei, die 4.0 nennt, aber auf die Version 3.0 verlinkt. Diese Seiten habe ich nicht selbst abgerufen. Die Version 4.0 ist deshalb nur durch die Startseite belegt.',
    'Die Nutzungsbedingungen von GeoNames („Terms and conditions“) habe ich nicht abgerufen; ein Versuch scheiterte mit HTTP 503. Kreditlimits und sonstige Nutzungsregeln sind daher nicht Teil des Blattes. Bei einer Wiederholung des Abrufs sind sie zu prüfen.',
    'Tonfall: GeoNames formuliert die Namensnennung als Empfehlung („should“), CC BY 4.0 verlangt sie als Bedingung der Lizenz. Für die Umsetzung gilt die Lizenz; die Empfehlung ist nicht als Pflicht aufgenommen.',
    'Nicht aufgenommen: Hinweis auf Urheberrechtsvermerk, Haftungsausschluss und Link auf den Lizenztext (Abschnitt 3(a)(1)(A)(ii), (iv), (v) und 3(a)(1)(C)). Der Wortlaut dieser Punkte wurde nicht gesondert belegt.',
  ],
};
