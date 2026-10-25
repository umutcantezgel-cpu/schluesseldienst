// Impressum (V12) – ENTWURF für die rechtliche Prüfung. Alle Angaben stehen in src/konfig/betrieb.mjs
// und werden hier nur ausgegeben (Platzhalter bleiben sichtbar). Keine Paragrafen: das Faktenblatt
// recht-impressum ist ohne belegte Fakten. Die Beschriftung von impressum.verantwortlichMStV nennt einen
// Paragrafen ohne Beleg – siehe Bericht.
import { platzhalter } from '../../../bau/lib/platzhalter.mjs';

export default {
  id: 'impressum',
  pfad: '/impressum/',
  titel: 'Impressum',
  h1: 'Impressum',
  kicker: 'Betrieb und Recht',
  kurz: 'Anbieter, Kontakt und Pflichtangaben.',
  beschreibung: 'Anbieter, Kontakt und Pflichtangaben des Schlüsseldienstes in Weilburg an der Lahn. Mit Angaben zu Register, Steuer und Verantwortung für Inhalte.',
  stand: '2026-10-25',
  freigabe: platzhalter('recht.impressum.freigabe', 'Impressum: Entwurf – rechtliche Prüfung und Freigabe nötig'),
  einleitung: 'Hier finden Sie die Angaben zu unserem Betrieb und zu den Verantwortlichen für diese Website.',
  weiterTitel: 'Weitere Rechtsseiten',
  abschnitte: [
    {
      id: 'anbieter',
      titel: 'Anbieter',
      bloecke: [{
        angaben: [
          { bezeichnung: 'Firma', pfad: 'name' },
          { bezeichnung: 'Rechtsform', pfad: 'rechtsform' },
          { bezeichnung: 'Inhaber', pfad: 'inhaber' },
          { bezeichnung: 'Anschrift', pfad: 'adresse' },
        ],
      }],
    },
    {
      id: 'kontakt',
      titel: 'Kontakt',
      bloecke: [
        { angaben: [{ bezeichnung: 'Telefon', pfad: 'telefon' }, { bezeichnung: 'E-Mail', pfad: 'email' }] },
        { absatz: 'Anfragen richten Sie bitte über die [Kontaktseite](/kontakt/).' },
      ],
    },
    {
      id: 'register',
      titel: 'Register und Steuer',
      bloecke: [{
        angaben: [
          { bezeichnung: 'Registereintrag', pfad: 'impressum.register' },
          { bezeichnung: 'USt-IdNr.', pfad: 'impressum.ustId' },
        ],
      }],
    },
    {
      id: 'beruf',
      titel: 'Berufsrecht',
      bloecke: [{
        angaben: [
          { bezeichnung: 'Zuständige Kammer', pfad: 'impressum.kammer' },
          { bezeichnung: 'Berufsbezeichnung', pfad: 'impressum.berufsbezeichnung' },
        ],
      }],
    },
    {
      id: 'verantwortlich',
      titel: 'Verantwortlich für Inhalte',
      bloecke: [{ wert: 'impressum.verantwortlichMStV' }],
    },
    {
      id: 'streitbeilegung',
      titel: 'Verbraucherstreitbeilegung',
      bloecke: [{ wert: 'impressum.vsbg' }],
    },
  ],
};
