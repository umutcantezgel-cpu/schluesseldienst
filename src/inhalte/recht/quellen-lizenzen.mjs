// Quellen & Lizenzen (V12) – ENTWURF. Lizenzaussagen stammen aus den Faktenblättern lizenz-geonames
// (CC BY 4.0, GeoNames) und lizenz-schrift (SIL OFL 1.1), jeweils als Fakt-Objekte mit Status „verifizieren“.
// Die Angabe „verändert“ folgt der Pipeline (Entfernungen, Zonen, Verzeichnisse). Quellen der Ratgeber
// stehen am jeweiligen Artikel. Externe Links nur über src/konfig/quellen.mjs.
import { platzhalter } from '../../../bau/lib/platzhalter.mjs';
import geonames from '../fakten/lizenz-geonames.mjs';
import schrift from '../fakten/lizenz-schrift.mjs';

const g = geonames.fakten;
const s = schrift.fakten;

export default {
  id: 'quellen-lizenzen',
  pfad: '/quellen-lizenzen/',
  titel: 'Quellen & Lizenzen',
  h1: 'Quellen & Lizenzen',
  kicker: 'Betrieb und Recht',
  kurz: 'Woher Ortsdaten und Schriften stammen, mit Lizenzen.',
  beschreibung: 'Woher die Ortsdaten und Schriften dieser Website stammen und unter welchen Lizenzen wir sie verwenden.',
  stand: '2026-10-25',
  freigabe: platzhalter('recht.quellen-lizenzen.freigabe', 'Quellen & Lizenzen: Entwurf – rechtliche Prüfung und Freigabe nötig'),
  einleitung: 'Hier steht, woher wir Daten und Schriften haben und unter welchen Lizenzen wir sie verwenden.',
  weiterTitel: 'Weitere Rechtsseiten',
  abschnitte: [
    {
      id: 'geonames',
      titel: 'Ortsdaten von GeoNames',
      bloecke: [
        { absatz: ['Die Ortsdaten dieser Website stammen von GeoNames. ', g['geonames-lizenz']] },
        { absatz: 'Die Lizenz CC BY 4.0 verlangt unter anderem:' },
        { liste: [g.namensnennung, g.lizenzverweis, g.aenderungen] },
        { absatz: 'So setzen wir das auf dieser Website um:' },
        {
          liste: [
            'Namensnennung: Die Quelle GeoNames steht auf dieser Seite.',
            'Lizenzverweis: Der Link zur Lizenz steht in der Quellenliste unten.',
            'Änderungen: Die Ortsdaten sind verändert. Entfernungen und Zonen ab Weilburg sind eigene Berechnungen.',
          ],
        },
        { absatz: [g['geonames-hinweis']] },
      ],
    },
    {
      id: 'schriften',
      titel: 'Schriften',
      bloecke: [
        { absatz: 'Diese Website verwendet die Schriften Atkinson Hyperlegible Next und Atkinson Hyperlegible Mono. Die Schriftdateien liegen auf unserem Server. Es wird kein Schriftdienst geladen.' },
        { absatz: [s.version] },
        { absatz: [s.erlaubnis] },
        { link: { titel: 'Lizenztext als Datei (OFL.txt)', url: '/assets/schriften/OFL.txt' } },
      ],
    },
    {
      id: 'ratgeber',
      titel: 'Quellen der Ratgeber',
      bloecke: [
        { absatz: 'Die Quellen jedes Ratgeber-Artikels stehen am Ende des Artikels. Die Übersicht finden Sie im [Ratgeber](/ratgeber/).' },
      ],
    },
    {
      id: 'quellenliste',
      titel: 'Quellenliste',
      bloecke: [{
        quellen: [
          { titel: 'GeoNames – Startseite', url: 'https://www.geonames.org/' },
          { titel: 'GeoNames – Data & Web Services', url: 'https://www.geonames.org/export/' },
          { titel: 'Creative Commons – Namensnennung 4.0 International, Lizenztext', url: 'https://creativecommons.org/licenses/by/4.0/legalcode.de' },
          { titel: 'SIL International – SIL Open Font License, Version 1.1', url: 'https://openfontlicense.org/open-font-license-official-text/' },
        ],
      }],
    },
  ],
};
