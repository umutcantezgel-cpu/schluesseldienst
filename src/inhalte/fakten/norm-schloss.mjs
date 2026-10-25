// Faktenblatt norm-schloss: Einsteckschlösser. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [
  { id: 'q1', titel: 'DIN Media (Normungsinstitut DIN) – DIN 18251:2020-04, Normseite', url: 'https://www.dinmedia.de/en/standard/din-18251/318269990', art: 'sekundaer', abgerufen: '2026-10-25' },
  { id: 'q2', titel: 'DIN Media (Normungsinstitut DIN) – DIN EN 12209:2025-12, Normseite', url: 'https://www.dinmedia.de/de/norm/din-en-12209/386117616', art: 'sekundaer', abgerufen: '2026-10-25' },
];

export default {
  id: 'norm-schloss',
  thema: 'Einsteckschlösser',
  stand: '2026-10-25',
  frage: 'Welche Klassen gelten für Einsteckschlösser, und was unterscheidet ein Mehrfachverriegelungsschloss normativ?',
  fakten: {
    din18251: fakt({ id: 'norm-schloss.din18251', text: 'DIN 18251 ist laut Normungsinstitut in der Ausgabe 2020-04 aktuell; sie behandelt Einsteckschlösser und Mehrfachverriegelungen nach dem Titel nur als Begriffe und Maße.', quelle: 'q1', status: 'verifizieren' }),
    'din18251-ersetzt': fakt({ id: 'norm-schloss.din18251-ersetzt', text: 'Die Ausgabe 2020-04 ersetzt laut Normungsinstitut die Norm DIN 18250:2006-09 sowie die drei Teile der DIN 18251 aus dem Jahr 2002.', quelle: 'q1', status: 'verifizieren' }),
    en12209: fakt({ id: 'norm-schloss.en12209', text: 'DIN EN 12209 ist laut Normungsinstitut in der Ausgabe 2025-12 aktuell und regelt Merkmale und Prüfverfahren mechanisch betätigter Schlösser und Schließbleche.', quelle: 'q2', status: 'verifizieren' }),
    'en12209-ersetzt': fakt({ id: 'norm-schloss.en12209-ersetzt', text: 'Die Ausgabe 2025-12 ersetzt laut Normungsinstitut die Ausgabe DIN EN 12209:2016-10.', quelle: 'q2', status: 'verifizieren' }),
  },
  offen: [
    'Klassen für Einsteckschlösser sind nicht belegt. DIN 18251 enthält laut Titel keine Klassen. Güteklassen nach DIN EN 12209 (Suchtreffer: Klassen 1 bis 6) sind am Normtext nicht geprüft; die Normseite nennt keine Klassenzahl.',
    'Die normative Unterscheidung des Mehrfachverriegelungsschlosses ist nicht belegt. Ein Suchtreffer zur Ausgabe 2004 nannte einen Ausschluss von Mehrfachverriegelungen und einen Verweis auf DIN EN 15685; ob das für die Ausgabe 2025-12 gilt, ist nicht geprüft. Der Status von DIN EN 15685 ist ungeklärt (Suchtreffer: Entwurf 2007).',
    'Zu Einsteckschlössern wurde keine Polizei-Quelle gefunden; Herstellerangaben wurden nicht als Quelle genutzt.',
    'Die Blattfrage ist deshalb nur zum Teil beantwortbar: Die Normlage ist belegt, die Klassen und die Abgrenzung sind es nicht.',
  ],
};
