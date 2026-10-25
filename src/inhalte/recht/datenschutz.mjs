// Datenschutz (V12) – ENTWURF für die rechtliche Prüfung. Das Faktenblatt recht-datenschutz ist leer
// (Server nicht erreichbar): ohne Paragrafen-Nummern, Gesetze nur beim Namen. Die Aussagen „keine Cookies“,
// „kein Speicher im Endgerät“, „kein Tracking“ und „keine Drittanbieter“ gelten für den Code dieser Website
// (src/konfig/sicherheit.mjs, CSP: nur eigene Herkunft). Was der Hoster zusätzlich einstellt, ist offen.
import { platzhalter } from '../../../bau/lib/platzhalter.mjs';

const hoster = platzhalter('recht.datenschutz.hoster', 'Name, Anschrift und Aufbewahrungsdauer der Protokolle');

export default {
  id: 'datenschutz',
  pfad: '/datenschutz/',
  titel: 'Datenschutz',
  h1: 'Datenschutz',
  kicker: 'Betrieb und Recht',
  kurz: 'Welche Daten beim Besuch anfallen und welche Rechte Sie haben.',
  beschreibung: 'Welche Daten beim Besuch dieser Website anfallen, wie Kontakt und Anfragen laufen und welche Rechte Sie haben. Ohne Cookies und ohne Tracking.',
  stand: '2026-10-25',
  freigabe: platzhalter('recht.datenschutz.freigabe', 'Datenschutz: Entwurf – rechtliche Prüfung und Freigabe nötig'),
  einleitung: 'Hier steht, welche Daten beim Besuch dieser Website anfallen, wie Anfragen bei uns ankommen und welche Rechte Sie haben.',
  weiterTitel: 'Weitere Rechtsseiten',
  abschnitte: [
    {
      id: 'verantwortlich',
      titel: 'Verantwortlicher',
      bloecke: [
        { absatz: 'Verantwortlich für die Verarbeitung personenbezogener Daten auf dieser Website ist:' },
        {
          angaben: [
            { bezeichnung: 'Firma', pfad: 'name' },
            { bezeichnung: 'Anschrift', pfad: 'adresse' },
            { bezeichnung: 'Telefon', pfad: 'telefon' },
            { bezeichnung: 'E-Mail', pfad: 'email' },
          ],
        },
      ],
    },
    {
      id: 'hosting',
      titel: 'Hosting und Protokolle',
      bloecke: [
        { absatz: 'Diese Website liegt bei einem Hoster. Beim Aufruf einer Seite übermittelt Ihr Browser technische Angaben an den Server. Je nach Einstellung schreibt der Hoster sie in Protokolle, sogenannte Server-Logs. Dazu können die IP-Adresse, der Zeitpunkt und die aufgerufene Seite gehören.' },
        { absatz: ['Angaben zum Hoster und zur Aufbewahrung der Protokolle: ', hoster] },
        { absatz: 'Für diese Verarbeitung gilt die Datenschutz-Grundverordnung.' },
      ],
    },
    {
      id: 'kontakt',
      titel: 'Kontakt per Telefon und E-Mail',
      bloecke: [
        { absatz: 'Wenn Sie uns anrufen oder schreiben, verarbeiten wir die Angaben, die Sie uns mitteilen, um Ihr Anliegen zu bearbeiten.' },
        { absatz: 'Das Formular auf der [Kontaktseite](/kontakt/) öffnet Ihr E-Mail-Programm mit einem vorbereiteten Entwurf. Es sendet keine Angaben an unseren Server.' },
      ],
    },
    {
      id: 'cookies',
      titel: 'Cookies, Speicher und Tracking',
      bloecke: [{
        liste: [
          'Diese Website setzt keine Cookies.',
          'Sie speichert nichts in Ihrem Browser oder auf Ihrem Gerät, auch nicht im lokalen Speicher.',
          'Es gibt kein Tracking und keine Analysedienste.',
        ],
      }],
    },
    {
      id: 'dienste',
      titel: 'Dienste anderer Anbieter',
      bloecke: [
        { absatz: 'Diese Website bindet keine Dienste anderer Anbieter ein. Die Schriften liegen auf unserem Server, und es wird kein Schriftdienst geladen.' },
        { absatz: 'Die Ortssuche lädt ihre Ortsliste von unserem Server. Ihre Eingabe verlässt Ihren Browser dabei nicht.' },
      ],
    },
    {
      id: 'rechte',
      titel: 'Ihre Rechte',
      bloecke: [
        { absatz: 'Nach der Datenschutz-Grundverordnung haben Sie diese Rechte:' },
        {
          liste: [
            'Auskunft über Ihre gespeicherten Daten',
            'Berichtigung unrichtiger Daten',
            'Löschung',
            'Einschränkung der Verarbeitung',
            'Widerspruch gegen die Verarbeitung',
            'Übertragung Ihrer Daten',
          ],
        },
      ],
    },
    {
      id: 'beschwerde',
      titel: 'Beschwerde',
      bloecke: [{ absatz: 'Sie können sich nach der Datenschutz-Grundverordnung bei einer Datenschutz-Aufsichtsbehörde beschweren.' }],
    },
  ],
};
