// Faktenblatt norm-wertschutz: Wertschutzschränke und Sicherheitsschränke. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [
  { id: 'q1', titel: 'DIN Media (Normungsinstitut DIN) – DIN EN 1143-1:2019-07, Normseite', url: 'https://www.dinmedia.de/en/standard/din-en-1143-1/299949408', art: 'sekundaer', abgerufen: '2026-10-25' },
  { id: 'q2', titel: 'DIN Media (Normungsinstitut DIN) – DIN EN 14450:2024-04, Normseite', url: 'https://www.dinmedia.de/en/standard/din-en-14450/368570920', art: 'sekundaer', abgerufen: '2026-10-25' },
];

export default {
  id: 'norm-wertschutz',
  thema: 'Wertschutzschränke und Sicherheitsschränke',
  stand: '2026-10-25',
  frage: 'Welche Widerstandsgrade und Sicherheitsstufen gibt es für Wertschutz- und Sicherheitsschränke, und was folgt daraus für Versicherungssummen allgemein?',
  fakten: {
    '1143-1-ausgabe': fakt({ id: 'norm-wertschutz.1143-1-ausgabe', text: 'DIN EN 1143-1 ist laut Normungsinstitut in der Ausgabe 2019-07 aktuell und ersetzt die Ausgabe 2012-07.', quelle: 'q1', status: 'verifizieren' }),
    '1143-1-titel': fakt({ id: 'norm-wertschutz.1143-1-titel', text: 'DIN EN 1143-1 legt nach ihrem Titel Anforderungen, Klassifizierung und Prüfverfahren für den Einbruchwiderstand von Wertbehältnissen fest.', quelle: 'q1', status: 'verifizieren' }),
    '14450-ausgabe': fakt({ id: 'norm-wertschutz.14450-ausgabe', text: 'DIN EN 14450 ist laut Normungsinstitut in der Ausgabe 2024-04 aktuell und ersetzt die Ausgabe 2018-02.', quelle: 'q2', status: 'verifizieren' }),
    '14450-titel': fakt({ id: 'norm-wertschutz.14450-titel', text: 'DIN EN 14450 betrifft nach ihrem Titel Wertbehältnisse mit Widerstand gegen Einbruchdiebstahl, hier Sicherheitsschränke.', quelle: 'q2', status: 'verifizieren' }),
  },
  offen: [
    'Widerstandsgrade der DIN EN 1143-1 (zum Beispiel 0 oder N bis höher) und Sicherheitsstufen der DIN EN 14450 (S 1, S 2) sind nicht belegt. Die Normseiten nennen keine Klassen; die Polizeiquelle (Bremen, 2014) mit „10 Sicherheitsstufen“ und S 1 und S 2 war nicht abrufbar (HTTP 403).',
    'Die Blattfrage zu Versicherungssummen ist nicht belegt. Die GDV-Merkblätter wurden nicht abgerufen.',
    'Der Anwendungsbereich der Ausgabe 2019-07 (freistehende und eingebaute Tresore, Geldautomatentresore, Tresorraumtüren) stammt aus einem Suchtreffer zur Ausgabe 2012 und ist für 2019 nicht geprüft.',
    'Eine Gegenüberstellung mit VdS 2451 (Grade V bis XIII für Wertschutzräume) stammt aus einem Suchtreffer; sie ist kein Normtext und wurde nicht übernommen.',
  ],
};
