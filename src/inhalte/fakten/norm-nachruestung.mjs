// Faktenblatt norm-nachruestung: Nachrüstprodukte. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [
  { id: 'q1', titel: 'DIN Media (Normungsinstitut DIN) – DIN 18104-1:2017-08, Normseite', url: 'https://www.dinmedia.de/de/norm/din-18104-1/275794725', art: 'sekundaer', abgerufen: '2026-10-25' },
  { id: 'q2', titel: 'DIN Media (Normungsinstitut DIN) – DIN 18104-2:2021-12, Normseite', url: 'https://www.dinmedia.de/en/standard/din-18104-2/346041626', art: 'sekundaer', abgerufen: '2026-10-25' },
];

export default {
  id: 'norm-nachruestung',
  thema: 'Nachrüstprodukte',
  stand: '2026-10-25',
  frage: 'Welche Norm prüft nachrüstbare Sicherungen für Türen und Fenster (Zusatzschlösser, Bandseitensicherung, abschließbare Griffe), und was sagt die Prüfung aus?',
  fakten: {
    'teil1-zweck': fakt({ id: 'norm-nachruestung.teil1-zweck', text: 'DIN 18104-1 meint Zusatzprodukte, die sich nachträglich anbringen lassen, Tür- oder Fensterelemente verriegeln und so ihren Einbruchwiderstand erhöhen.', quelle: 'q1', status: 'verifizieren' }),
    'teil1-ausgabe': fakt({ id: 'norm-nachruestung.teil1-ausgabe', text: 'DIN 18104-1 ist laut Normungsinstitut in der Ausgabe 2017-08 aktuell und ersetzt die Ausgabe 2013-05.', quelle: 'q1', status: 'verifizieren' }),
    'teil1-zertifizierung': fakt({ id: 'norm-nachruestung.teil1-zertifizierung', text: 'Die Ausgabe 2017-08 hat die Abschnitte zu Zertifizierung und Kennzeichnung gestrichen.', quelle: 'q1', status: 'verifizieren' }),
    griffe: fakt({ id: 'norm-nachruestung.griffe', text: 'Abschließbare Fenstergriffe nach DIN 18267 gelten laut Normungsinstitut nicht als Nachrüstprodukte nach DIN 18104-1.', quelle: 'q1', status: 'verifizieren' }),
    'teil2-titel': fakt({ id: 'norm-nachruestung.teil2-titel', text: 'DIN 18104-2 behandelt im Falz eingelassene Nachrüstprodukte für Fenster und Türen.', quelle: 'q2', status: 'verifizieren' }),
    'teil2-ausgabe': fakt({ id: 'norm-nachruestung.teil2-ausgabe', text: 'DIN 18104-2 ist laut Normungsinstitut in der Ausgabe 2021-12 aktuell und ersetzt die Ausgabe 2021-05.', quelle: 'q2', status: 'verifizieren' }),
  },
  offen: [
    'Die Prüfung (Prüfkräfte, Prüfdauern, Prüfwerkzeuge, statische und manuelle Prüfung) ist nicht belegt. Die Normtexte sind kostenpflichtig. Die Angabe zu Prüfungen an Buchenmultiplexplatten stammt aus einem Suchtreffer und ist ungeprüft.',
    'Der Begriff Bandseitensicherung steht nicht auf den Normseiten. Ob er unter Teil 1 oder Teil 2 fällt, ist nicht belegt.',
    'Zusatzschlösser sind nur über die Definition in Teil 1 zuordenbar; die Zuordnung ist am Normtext nicht geprüft.',
    'Das Zertifizierungsprogramm (Suchtreffer: Stand 2011) wurde nicht geprüft. Die Streichung der Zertifizierung in der Ausgabe 2017-08 lässt es möglicherweise überholt erscheinen.',
    'Polizei-Herstellerverzeichnisse zu Nachrüstprodukten konnten nicht abgerufen werden (Sachsen-PDF: HTTP 404).',
  ],
};
