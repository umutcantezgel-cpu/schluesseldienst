// Faktenblatt norm-verglasung: Einbruchhemmende Verglasung. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [
  { id: 'q1', titel: 'DIN Media (Normungsinstitut DIN) – DIN EN 356:2000-02, Normseite', url: 'https://www.dinmedia.de/en/standard/din-en-356/16077416', art: 'sekundaer', abgerufen: '2026-10-25' },
  { id: 'q2', titel: 'Polizeiliche Kriminalprävention – k-einbruch.de, Seite Fenster, Balkon- und Terrassentür', url: 'https://www.k-einbruch.de/sicherheitstipps/fenster/', art: 'sekundaer', abgerufen: '2026-10-25' },
  { id: 'q3', titel: 'Polizeiliche Kriminalprävention (KPK), Bayerisches Landeskriminalamt – Herstellerverzeichnis Fenster und Fassaden, Stand Januar 2025', url: 'https://www.polizei.bayern.de/mam/praevention/250220_blka_fenster.pdf', art: 'sekundaer', abgerufen: '2026-10-25' },
];

export default {
  id: 'norm-verglasung',
  thema: 'Einbruchhemmende Verglasung',
  stand: '2026-10-25',
  frage: 'Welche Klassen gibt es für durchwurf- und durchbruchhemmendes Glas, und welche Klasse gehört zu welcher Widerstandsklasse des Fensters?',
  fakten: {
    ausgabe: fakt({ id: 'norm-verglasung.ausgabe', text: 'DIN EN 356 ist laut Normungsinstitut in der Ausgabe 2000-02 aktuell; ihr Titel nennt eine Klasseneinteilung des Widerstandes gegen manuellen Angriff.', quelle: 'q1', status: 'verifizieren' }),
    'isolierverglasung': fakt({ id: 'norm-verglasung.isolierverglasung', text: 'Übliche Isolierverglasungen haben nach Polizeiangaben keine einbruchhemmende Wirkung.', quelle: 'q2', status: 'verifizieren' }),
    'p4a-nachruestung': fakt({ id: 'norm-verglasung.p4a-nachruestung', text: 'Nach Polizeiangaben können einbruchhemmende Verbundsicherheitsgläser je nach Gefährdung ab der Klasse P 4 A nachgerüstet werden.', quelle: 'q2', status: 'verifizieren' }),
    'nur-glas': fakt({ id: 'norm-verglasung.nur-glas', text: 'Nach Polizeiangaben reicht eine Nachrüstung allein mit einbruchhemmendem Glas nicht aus.', quelle: 'q2', status: 'verifizieren' }),
    'rc1-glas': fakt({ id: 'norm-verglasung.rc1-glas', text: 'Die Widerstandsklasse RC 1 verwendet nach Polizeiangaben eine Sicherheitsverglasung mit geringerem Sicherheitsniveau als RC 2.', quelle: 'q3', status: 'verifizieren' }),
    'n-verzicht': fakt({ id: 'norm-verglasung.n-verzicht', text: 'Bei den Klassen RC 1 N und RC 2 N wird nach Polizeiangaben auf die Sicherheitsverglasung vollständig verzichtet.', quelle: 'q3', status: 'verifizieren' }),
    'n-eingeschraenkt': fakt({ id: 'norm-verglasung.n-eingeschraenkt', text: 'Die Klassen RC 1 N, RC 1 und RC 2 N sind nach Polizeiangaben nur eingeschränkt empfehlenswert.', quelle: 'q3', status: 'verifizieren' }),
  },
  offen: [
    'Die Zuordnung von P-Klassen zu RC-Klassen (zum Beispiel P 4 A zu RC 2, P 5 A zu RC 3) ist nicht belegt. Die Polizeiquellen nennen nur die Schwelle P 4 A für die Nachrüstung. Die Zuordnung aus Suchtreffern ist ungeprüft.',
    'Die Klassen der DIN EN 356 (P1A bis P8B), ihre Prüfwerkzeuge und Prüfzeiten sind nicht belegt. Die Normseite nennt keine Klassen; der Normtext ist kostenpflichtig.',
    'Die Blattangabe „DIN EN 1627 Anhang zur Verglasung“ ist nicht geprüft und nicht belegt.',
    'Der Status der DIN EN 356 ist nur über die Normseite belegt, nicht über den Normtext.',
  ],
};
