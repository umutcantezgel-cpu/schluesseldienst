// Faktenblatt norm-tuerschliesser: Türschließer. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [
  { id: 'q1', titel: 'DIN Media (Normungsinstitut DIN) – DIN EN 1154:2003-04, Normseite', url: 'https://www.dinmedia.de/en/standard/din-en-1154/60811752', art: 'sekundaer', abgerufen: '2026-10-25' },
];

export default {
  id: 'norm-tuerschliesser',
  thema: 'Türschließer',
  stand: '2026-10-25',
  frage: 'Wie werden Türschließer nach Schließkraft eingeteilt, und welche Anforderungen gelten an Feuer- und Rauchschutztüren?',
  fakten: {
    ausgabe: fakt({ id: 'norm-tuerschliesser.ausgabe', text: 'DIN EN 1154 ist laut Normungsinstitut in der Ausgabe 2003-04 aktuell und ersetzt die Ausgabe 1997-05.', quelle: 'q1', status: 'verifizieren' }),
    titel: fakt({ id: 'norm-tuerschliesser.titel', text: 'Die Norm legt nach ihrem Titel Anforderungen und Prüfverfahren für Türschließmittel mit kontrolliertem Schließablauf fest.', quelle: 'q1', status: 'verifizieren' }),
    berichtigung: fakt({ id: 'norm-tuerschliesser.berichtigung', text: 'Eine Berichtigung 1 aus dem Jahr 2006-06 gehört laut Normungsinstitut zur Norm.', quelle: 'q1', status: 'verifizieren' }),
  },
  offen: [
    'Die Einteilung nach Schließkraft (Größen 1 bis 6 bzw. bis 7) ist nicht belegt. Die Normseite nennt keine Größen; der Normtext ist kostenpflichtig. Die Größenangaben in Suchtreffern stammen aus Produktwerbung und dienen nicht als Quelle.',
    'Anforderungen an Feuer- und Rauchschutztüren sind nicht belegt. Die Normseite erwähnt diesen Punkt nicht; die Zulassungsregeln des DIBt wurden nicht abgerufen.',
    'Eine Herstellererklärung aus den Suchtreffern bezieht sich auf EN 1154:1996/A1:2002/AC:2006. Ob sie der Ausgabe 2003-04 entspricht, ist nicht geprüft.',
  ],
};
