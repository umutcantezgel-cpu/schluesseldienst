// Faktenblatt norm-datensicherung: Datensicherungsschränke. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [
  { id: 'q1', titel: 'DIN Media (Normungsinstitut DIN) – DIN EN 1047-1:2019-12, Normseite', url: 'https://www.dinmedia.de/en/standard/din-en-1047-1/303320202', art: 'sekundaer', abgerufen: '2026-10-25' },
  { id: 'q2', titel: 'DIN Media (Normungsinstitut DIN) – DIN EN 15659:2020-02, Normseite', url: 'https://www.dinmedia.de/en/standard/din-en-15659/316345666', art: 'sekundaer', abgerufen: '2026-10-25' },
];

export default {
  id: 'norm-datensicherung',
  thema: 'Datensicherungsschränke',
  stand: '2026-10-25',
  frage: 'Welche Klassen gelten für den Brandschutz von Datenträgern und Papier in Schränken, und was bedeuten die Kennzeichnungen?',
  fakten: {
    '1047-1-ausgabe': fakt({ id: 'norm-datensicherung.1047-1-ausgabe', text: 'DIN EN 1047-1 ist laut Normungsinstitut in der Ausgabe 2019-12 aktuell und ersetzt die Ausgabe 2006-01.', quelle: 'q1', status: 'verifizieren' }),
    '1047-1-titel': fakt({ id: 'norm-datensicherung.1047-1-titel', text: 'DIN EN 1047-1 betrifft nach ihrem Titel die Klassifizierung und Prüfmethoden für den Brandwiderstand von Wertbehältnissen.', quelle: 'q1', status: 'verifizieren' }),
    '1047-1-teil1': fakt({ id: 'norm-datensicherung.1047-1-teil1', text: 'Teil 1 der DIN EN 1047 betrifft laut Titel Datensicherungsschränke und Disketteneinsätze.', quelle: 'q1', status: 'verifizieren' }),
    '15659-gegenstand': fakt({ id: 'norm-datensicherung.15659-gegenstand', text: 'DIN EN 15659 betrifft nach ihrem Titel leichte Brandschutzschränke; die Normseite nennt Datenträger und Papier nicht.', quelle: 'q2', status: 'verifizieren' }),
    '15659-ausgabe': fakt({ id: 'norm-datensicherung.15659-ausgabe', text: 'DIN EN 15659 ist laut Normungsinstitut in der Ausgabe 2020-02 aktuell und als korrigierte Fassung gekennzeichnet.', quelle: 'q2', status: 'verifizieren' }),
  },
  offen: [
    'Die Annahme „Brandschutz von Datenträgern und Papier“ ist nicht belegt. Die Normseiten nennen Datensicherungsschränke und Disketteneinsätze (EN 1047-1) sowie leichte Brandschutzschränke (EN 15659), nicht Datenträger oder Papier als Schutzgut. Ob diese Stoffe in den Klassen vorkommen, ist ungeklärt.',
    'Klassen und Kennzeichnungen (Brandklassen, Prüftemperaturen, Prüfdauern, Kennzeichnung) sind nicht belegt. Die Normtexte sind kostenpflichtig.',
    'Ob DIN EN 1047-1 und DIN EN 15659 für denselben Zweck gelten, ist nicht geprüft.',
    'DIN EN 1047-2 (Datensicherungsräume und -container, Ausgabe 2019-06 laut Suchtreffer) wurde nicht geprüft.',
  ],
};
