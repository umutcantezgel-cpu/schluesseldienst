// Faktenblatt norm-rauchmelder: Rauchwarnmelder. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [
  { id: 'q1', titel: 'DIN Media (Normungsinstitut DIN) – DIN EN 14604:2009-02, Normseite', url: 'https://www.dinmedia.de/en/standard/din-en-14604/115461758', art: 'sekundaer', abgerufen: '2026-10-25' },
  { id: 'q2', titel: 'DIN Media (Normungsinstitut DIN) – DIN 14676-1:2025-05, Normseite', url: 'https://www.dinmedia.de/en/standard/din-14676-1/389751439', art: 'sekundaer', abgerufen: '2026-10-25' },
  { id: 'q3', titel: 'DIN Media (Normungsinstitut DIN) – DIN 14676-1:2023-09, Normseite (zurückgezogen)', url: 'https://www.dinmedia.de/en/standard/din-14676-1/364875796', art: 'sekundaer', abgerufen: '2026-10-25' },
];

export default {
  id: 'norm-rauchmelder',
  thema: 'Rauchwarnmelder',
  stand: '2026-10-25',
  frage: 'Welche Produktnorm gilt für Rauchwarnmelder, und was regelt die Anwendungsnorm zu Planung, Einbau und Instandhaltung?',
  fakten: {
    '14604-ausgabe': fakt({ id: 'norm-rauchmelder.14604-ausgabe', text: 'DIN EN 14604 ist laut Normungsinstitut in der Ausgabe 2009-02 aktuell; eine Berichtigung 1 aus dem Jahr 2018-09 gehört dazu.', quelle: 'q1', status: 'verifizieren' }),
    '14604-titel': fakt({ id: 'norm-rauchmelder.14604-titel', text: 'DIN EN 14604 trägt den Titel Rauchwarnmelder und ist die deutsche Fassung der EN 14604:2005.', quelle: 'q1', status: 'verifizieren' }),
    '14676-1-ausgabe': fakt({ id: 'norm-rauchmelder.14676-1-ausgabe', text: 'DIN 14676-1 ist laut Normungsinstitut in der Ausgabe 2025-05 aktuell und ersetzt die Ausgabe 2023-09.', quelle: 'q2', status: 'verifizieren' }),
    '14676-1-zweck': fakt({ id: 'norm-rauchmelder.14676-1-zweck', text: 'DIN 14676-1 legt Mindestanforderungen an Planung, Montage, Betrieb und Instandhaltung von Rauchwarnmeldern nach DIN EN 14604 in Wohngebäuden und wohnähnlich genutzten Räumen fest.', quelle: 'q2', status: 'verifizieren' }),
    '14676-1-montage': fakt({ id: 'norm-rauchmelder.14676-1-montage', text: 'Die Ausgabe 2025-05 ersetzt im deutschen Titel den Begriff Einbau durch Montage.', quelle: 'q2', status: 'verifizieren' }),
    '14676-1-zurueck': fakt({ id: 'norm-rauchmelder.14676-1-zurueck', text: 'Die Ausgabe 2023-09 ist laut Normungsinstitut zurückgezogen; sie ersetzte die Ausgabe 2018-12.', quelle: 'q3', status: 'verifizieren' }),
  },
  offen: [
    'Einbauregeln (Position, Abstände, Anzahl je Raum, Wartungsintervalle) sind nicht belegt. Der Normtext ist kostenpflichtig; die Normseite nennt keine Einzelwerte.',
    'Die Dreiteilung A, B, C für funkvernetzte Melder stammt aus einer Pressemitteilung von 2018. Ob die Ausgabe 2025-05 sie übernimmt, ist nicht bestätigt.',
    'Die Fachkunde der Dienstleister (Teil 2 der Reihe) und ein DIN-FAQ-Hinweis auf einen Abschnitt 7 ohne Ausgabenangabe sind nicht geprüft.',
    'Die Verbindlichkeit der DIN 14676-1 über die Landesbauordnungen gehört zu einem anderen Blatt und ist hier nicht geprüft.',
    'Die Normseite der DIN EN 14604 nennt keine Produktanforderungen; die Prüfbedingungen des Produktes sind nicht belegt.',
  ],
};
