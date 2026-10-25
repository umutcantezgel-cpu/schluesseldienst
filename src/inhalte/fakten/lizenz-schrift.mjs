// Faktenblatt lizenz-schrift: Schriftlizenz SIL Open Font License 1.1. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [
  { id: 'q1', titel: 'SIL International – SIL Open Font License, Version 1.1 (26. Februar 2007), Lizenztext', url: 'https://openfontlicense.org/open-font-license-official-text/', art: 'primaer', abgerufen: '2026-10-25' },
];

export default {
  id: 'lizenz-schrift',
  thema: 'Schriftlizenz',
  stand: '2026-10-25',
  frage: 'Was erlaubt die SIL Open Font License beim Einbetten und Ausliefern der Schriftdateien?',
  fakten: {
    'version': fakt({ id: 'lizenz-schrift.version', text: 'Der Lizenztext der SIL Open Font License trägt die Version 1.1 vom 26. Februar 2007.', quelle: 'q1', status: 'verifizieren' }),
    'erlaubnis': fakt({ id: 'lizenz-schrift.erlaubnis', text: 'Die Lizenz erlaubt, die Schrift zu verwenden, zu untersuchen, zu kopieren, zusammenzuführen, einzubetten, zu verändern, weiterzuverbreiten und zu verkaufen.', quelle: 'q1', status: 'verifizieren' }),
    'buendeln': fakt({ id: 'lizenz-schrift.buendeln', text: 'Nach Bedingung 2 dürfen Schriften mit beliebiger Software gebündelt, weiterverbreitet und verkauft werden.', quelle: 'q1', status: 'verifizieren' }),
    'copyright-vermerk': fakt({ id: 'lizenz-schrift.copyright-vermerk', text: 'Jede weitergegebene Kopie der Schrift muss nach Bedingung 2 den Urheberrechtsvermerk und die Lizenz enthalten.', quelle: 'q1', status: 'verifizieren' }),
    'nicht-allein-verkaufen': fakt({ id: 'lizenz-schrift.nicht-allein-verkaufen', text: 'Die Schrift selbst darf nach Bedingung 1 nicht allein verkauft werden, auch nicht in veränderter Fassung.', quelle: 'q1', status: 'verifizieren' }),
    'schriftname': fakt({ id: 'lizenz-schrift.schriftname', text: 'Veränderte Fassungen dürfen den reservierten Schriftnamen nur mit ausdrücklicher schriftlicher Genehmigung des Rechteinhabers verwenden (Bedingung 3).', quelle: 'q1', status: 'verifizieren' }),
  },
  offen: [
    'Die Lizenz gilt für jede Schrift einzeln. Im Projekt liegen unter src/assets/schriften/ eine Datei OFL.txt (Version 1.1) und Schriftdateien der Familie Atkinson Hyperlegible Next (Copyright 2020 bis 2024). Ob die Schriftdateien selbst die Lizenzangaben tragen, ist nicht geprüft.',
    'Die Zitate stammen aus einer Auswertung der Lizenzseite, nicht aus dem vollständigen Lizenztext. Der Wortlaut der gebündelten OFL.txt ist nicht gegen das Original abgeglichen.',
    'Nicht geprüft: Hinweispflichten in Dokumentation oder Quelltext, die über die Lizenzbedingungen hinausgehen.',
  ],
};
