// Faktenblatt statistik-einbruch: Wohnungseinbruch in Zahlen. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [
  { id: 'q1', titel: 'Bundeskriminalamt – Factsheet Polizeiliche Kriminalstatistik 2025: Wohnungseinbruchdiebstahl (Stand April 2026, V 1.0)', url: 'https://www.bka.de/SharedDocs/Downloads/DE/Publikationen/PolizeilicheKriminalstatistik/2025/BundesdatenDelikte_Factsheets/07_WohnungseinbruchdiebstahlBRD.pdf?__blob=publicationFile', art: 'primaer', abgerufen: '2026-10-25' },
  { id: 'q2', titel: 'Hessisches Landeskriminalamt – Pressepapier PKS-Jahresstatistik 2025 Hessen (März 2026), S. 22 „Wohnungseinbruchdiebstahl“', url: 'https://www.polizei.hessen.de/sites/polizei.hessen.de/files/2026-03/pressepapier_pks-jahresstatistik_2025.pdf', art: 'primaer', abgerufen: '2026-10-25' },
];

export default {
  id: 'statistik-einbruch',
  thema: 'Wohnungseinbruch in Zahlen',
  stand: '2026-10-25',
  frage: 'Wie viele Wohnungseinbrüche erfasste die Polizei im jüngsten Berichtsjahr bundesweit und in Hessen, und welcher Anteil blieb im Versuch stecken?',
  fakten: {
    'bund-faelle': fakt({ id: 'statistik-einbruch.bund-faelle', text: 'Die Polizeiliche Kriminalstatistik des Bundeskriminalamts erfasst für das Berichtsjahr 2025 bundesweit 82.920 Fälle von Wohnungseinbruchdiebstahl.', quelle: 'q1', status: 'verifizieren' }),
    'bund-vorjahr': fakt({ id: 'statistik-einbruch.bund-vorjahr', text: 'Für das Berichtsjahr 2024 erfasste die Polizeiliche Kriminalstatistik bundesweit 78.436 Fälle von Wohnungseinbruchdiebstahl.', quelle: 'q1', status: 'verifizieren' }),
    'bund-begriff': fakt({ id: 'statistik-einbruch.bund-begriff', text: 'Die Zahl „Fälle“ umfasst in dieser Statistik vollendete Fälle und strafbare Versuche.', quelle: 'q1', status: 'verifizieren' }),
    'bund-aufgeklaert': fakt({ id: 'statistik-einbruch.bund-aufgeklaert', text: 'Im Berichtsjahr 2025 wurden bundesweit 11.672 Fälle von Wohnungseinbruchdiebstahl aufgeklärt, die Aufklärungsquote lag bei 14,1 %.', quelle: 'q1', status: 'verifizieren' }),
    'hessen-faelle': fakt({ id: 'statistik-einbruch.hessen-faelle', text: 'Die Polizei Hessen erfasste im Berichtsjahr 2025 insgesamt 6.777 Fälle von Wohnungseinbruchdiebstahl, im Berichtsjahr 2024 waren es 5.867.', quelle: 'q2', status: 'verifizieren' }),
    'hessen-versuche': fakt({ id: 'statistik-einbruch.hessen-versuche', text: 'Von den 6.777 Fällen in Hessen im Berichtsjahr 2025 blieben 2.893 im Versuch (42,7 %), 3.884 Fälle (57,3 %) waren vollendet.', quelle: 'q2', status: 'verifizieren' }),
    'hessen-aufklaerung': fakt({ id: 'statistik-einbruch.hessen-aufklaerung', text: 'In Hessen wurden im Berichtsjahr 2025 insgesamt 1.028 Fälle von Wohnungseinbruchdiebstahl geklärt, das entspricht 15,2 %.', quelle: 'q2', status: 'verifizieren' }),
  },
  offen: [
    'Der bundesweite Versuchsanteil für 2025 ist nicht belegt. Das BKA-Factsheet nennt keinen Anteil, und die BKA-Falltabelle für den Bund war nicht abrufbar (Verbindungsabbruch). Die Polizei-Beratung (Polizeiliche Kriminalprävention, sekundär) schreibt „nahezu die Hälfte (44,9 Prozent) aller Einbrüche“, ohne den Bezug zur Gesamtzahl eindeutig zu nennen. Nicht übernommen.',
    'Eine Statistikseite nennt für 2025 bundesweit 82.290 Fälle und ein Anbieterartikel eine Zahl je Tag. Das BKA nennt 82.920. Die abweichenden Zahlen sind nicht übernommen.',
    'Die Zahlen aus dem IMK-Bericht des BKA (Tabelle 4.4-T07a/b, Schlüssel 435*00) stimmen mit dem Factsheet überein. Den Bericht konnte ich nur als Textauszug lesen; er ist deshalb nicht als Quelle angegeben.',
    'Dunkelfeld: Laut BKA-IMK-Bericht wurden nach der Dunkelfeldstudie SKiD 2024 etwa 57 % der Wohnungseinbruchdiebstähle der Polizei bekannt. Das ist nicht im Prüfauftrag enthalten und deshalb nicht als Fakt aufgenommen. Wenn gewünscht, kann es als eigener Fakt geführt werden.',
    'Die Hessen-Zahlen stammen aus dem Pressepapier des Landeskriminalamts. Die Falltabellen Hessen habe ich nicht geprüft.',
  ],
};
