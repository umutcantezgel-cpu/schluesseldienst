// Faktenblatt norm-tore: Garagentore. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [
  { id: 'q1', titel: 'DIN Media (Normungsinstitut DIN) – DIN EN 13241:2016-12, Normseite', url: 'https://www.dinmedia.de/en/standard/din-en-13241/261176948', art: 'sekundaer', abgerufen: '2026-10-25' },
  { id: 'q2', titel: 'DIN Media (Normungsinstitut DIN) – DIN EN 12453:2022-08, Normseite', url: 'https://www.dinmedia.de/en/standard/din-en-12453/327080711', art: 'sekundaer', abgerufen: '2026-10-25' },
  { id: 'q3', titel: 'Polizeiliche Kriminalprävention (KPK), Landeskriminalamt Niedersachsen – Herstellerverzeichnis Türen/Tore, Stand Januar 2025', url: 'https://www.lka.polizei-nds.de/download/74077/Tueren_und_Tore.pdf', art: 'sekundaer', abgerufen: '2026-10-25' },
];

export default {
  id: 'norm-tore',
  thema: 'Garagentore',
  stand: '2026-10-25',
  frage: 'Welche Sicherheitsanforderungen gelten für kraftbetätigte Tore, insbesondere die Notentriegelung?',
  fakten: {
    'en13241-ausgabe': fakt({ id: 'norm-tore.en13241-ausgabe', text: 'DIN EN 13241 ist laut Normungsinstitut in der Ausgabe 2016-12 aktuell und ersetzt DIN EN 13241-1:2011-06.', quelle: 'q1', status: 'verifizieren' }),
    'en13241-scope': fakt({ id: 'norm-tore.en13241-scope', text: 'DIN EN 13241 legt Sicherheits- und Leistungsanforderungen für Industrie-, Gewerbe- und Garagentore fest und nimmt Brand- und Rauchschutzeigenschaften aus.', quelle: 'q1', status: 'verifizieren' }),
    'en12453-ausgabe': fakt({ id: 'norm-tore.en12453-ausgabe', text: 'DIN EN 12453 ist laut Normungsinstitut in der Ausgabe 2022-08 aktuell und ersetzt DIN EN 12453:2017-11 sowie DIN EN 12635:2009-02.', quelle: 'q2', status: 'verifizieren' }),
    'en12453-titel': fakt({ id: 'norm-tore.en12453-titel', text: 'DIN EN 12453 behandelt die Nutzungssicherheit kraftbetätigter Tore; laut Normungsinstitut gibt es dazu eine Berichtigung 1 aus dem Jahr 2023-12.', quelle: 'q2', status: 'verifizieren' }),
    'kpk-18194': fakt({ id: 'norm-tore.kpk-18194', text: 'Die Polizei nennt DIN/TS 18194 als Grundlage für einbruchhemmende Tore, veröffentlicht im Juli 2020.', quelle: 'q3', status: 'verifizieren' }),
  },
  offen: [
    'Die Notentriegelung ist in keiner geprüften Quelle belegt. Die Normseite von DIN EN 12453 nennt sie nicht, und die Normseite von DIN EN 13241 nennt sie ebenfalls nicht. Die Frage ist offen.',
    'Die Abgrenzung von DIN EN 13241 (Produkt) und DIN EN 12453 (Nutzung) stammt aus Suchtreffern (Baunetzwissen) und ist am Normtext nicht geprüft.',
    'Widerspruch: Eine Sekundärquelle nennt DIN EN 12453 in der Ausgabe 2022-11. Die Normseite nennt 2022-08. Gültig ist nach der Normseite 2022-08 mit Berichtigung 2023-12.',
    'DIN/TS 18194 ist nur über die Polizeiquelle bekannt; Status und Inhalt sind nicht geprüft. Die Angabe betrifft Einbruchschutz, nicht die Notentriegelung.',
    'Laut Suchtreffer (DIN-Projektliste) läuft eine Revision von DIN EN 13241; das ist am DIN-Eintrag nicht geprüft.',
  ],
};
