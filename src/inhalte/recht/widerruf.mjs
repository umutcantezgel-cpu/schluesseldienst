// Widerruf (V12) – ENTWURF: Belehrung für Verträge im Fernabsatz und Muster-Widerruf als Text.
// Die Ausnahme bei dringenden Reparaturen stammt ausschließlich aus dem Faktenblatt recht-widerruf-notfall
// (Fakt-Objekte, Status „verifizieren“). Fehlende Zahlen (Frist) und die Aussage zur Notöffnung sind
// Platzhalter, bis ein belegter Fakt vorliegt. Das Muster ist nicht aus einer amtlichen Vorlage übernommen.
import { platzhalter } from '../../../bau/lib/platzhalter.mjs';
import recht from '../fakten/recht-widerruf-notfall.mjs';

const f = recht.fakten;
const frist = platzhalter('recht.widerruf.frist', 'Widerrufsfrist: Zahl und Beginn nach Prüfung ergänzen');
const notoeffnung = platzhalter('recht.widerruf.notoeffnung', 'Ob die Ausnahme gilt, ist nicht geprüft und wird ergänzt');

export default {
  id: 'widerruf',
  pfad: '/widerruf/',
  titel: 'Widerruf',
  h1: 'Widerruf',
  kicker: 'Betrieb und Recht',
  kurz: 'Ihr Widerrufsrecht bei Verträgen im Fernabsatz.',
  beschreibung: 'Ihr Widerrufsrecht bei Verträgen im Fernabsatz, die Ausnahme bei dringenden Reparaturen und ein Muster für den Widerruf als Text.',
  stand: '2026-10-25',
  freigabe: platzhalter('recht.widerruf.freigabe', 'Widerruf: Entwurf – rechtliche Prüfung und Freigabe nötig'),
  einleitung: 'Diese Seite erklärt, wann Sie einen Vertrag widerrufen können und wann dieses Recht bei dringenden Reparaturen nicht besteht.',
  weiterTitel: 'Weitere Rechtsseiten',
  abschnitte: [
    {
      id: 'fernabsatz',
      titel: 'Widerrufsrecht bei Verträgen im Fernabsatz',
      bloecke: [
        { absatz: 'Schließen Sie einen Vertrag am Telefon, per E-Mail oder im Internet, gilt grundsätzlich ein Widerrufsrecht. Das gilt auch, wenn wir außerhalb unserer Geschäftsräume für Sie arbeiten.' },
        { absatz: ['Sie können den Vertrag innerhalb von ', frist, ' ohne Angabe von Gründen widerrufen.'] },
      ],
    },
    {
      id: 'ausnahme',
      titel: 'Ausnahme bei dringenden Reparaturen',
      bloecke: [
        { absatz: [f['nr11-ausschluss']] },
        { absatz: [f['nr11-zusatzleistung']] },
        { absatz: [f['nr11-waren']] },
        { absatz: ['Für eine Notöffnung: ', notoeffnung] },
      ],
    },
    {
      id: 'folgen',
      titel: 'Folgen des Widerrufs',
      bloecke: [
        { absatz: 'Die Folgen eines Widerrufs richten sich nach dem Bürgerlichen Gesetzbuch. Dazu gehören die Rückzahlung und mögliche Zahlungen für bereits erbrachte Leistungen.' },
      ],
    },
    {
      id: 'erklaerung',
      titel: 'So widerrufen Sie',
      bloecke: [
        { absatz: 'Richten Sie Ihre Erklärung an:' },
        {
          angaben: [
            { bezeichnung: 'Firma', pfad: 'name' },
            { bezeichnung: 'Anschrift', pfad: 'adresse' },
            { bezeichnung: 'E-Mail', pfad: 'email' },
          ],
        },
        { absatz: 'Sie können dafür das Muster unten verwenden. Verpflichtend ist es nicht.' },
      ],
    },
    {
      id: 'muster',
      titel: 'Muster für den Widerruf',
      bloecke: [
        { absatz: 'Das Muster steht als Text zum Kopieren bereit. Ergänzen Sie die Angaben in Ihrer Nachricht.' },
        {
          muster: {
            anTitel: 'An:',
            an: ['name', 'adresse', 'email'],
            zeilen: [
              'Hiermit widerrufe ich den von mir abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung:',
              'Beauftragt am:',
              'Name der Verbraucherin oder des Verbrauchers:',
              'Anschrift der Verbraucherin oder des Verbrauchers:',
              'Datum:',
            ],
          },
        },
      ],
    },
  ],
};
