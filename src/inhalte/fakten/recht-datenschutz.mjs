// Faktenblatt recht-datenschutz: Datenschutzhinweise. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [];

export default {
  id: 'recht-datenschutz',
  thema: 'Datenschutzhinweise',
  stand: '2026-10-25',
  frage: 'Welche Informationspflichten gelten für Hosting-Logs, E-Mail und Telefon, und was gilt ohne Cookies und Speicher im Endgerät?',
  fakten: {},
  offen: [
    'Das Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz (TDDDG, § 25 zu Speicherung und Zugriff auf Informationen im Endgerät) konnte nicht abgerufen werden: gesetze-im-internet.de lieferte HTTP 503 bzw. HTTP 404. Kein Fakt zur Endgerätespeicherung ist belegt.',
    'Die Informationspflichten der DS-GVO (Art. 13 und 14) für Hosting-Logs, E-Mail und Telefon wurden nicht am Verordnungstext geprüft. EUR-Lex lieferte nur Stichpunkte; die DSK-Orientierungshilfe zur Videoüberwachung betrifft nur Kameras und ist hier nicht einschlägig.',
    'Die Rechtsgrundlage für Server-Logs (berechtigtes Interesse nach Art. 6 Abs. 1 Buchst. f DS-GVO) und deren Speicherdauer: nicht belegt.',
    'Ob die Website ohne Cookies und ohne Speicherung im Endgerät tatsächlich auskommt, ist eine Umsetzungsfrage des Projekts und nicht Gegenstand einer Rechtsquelle.',
    'Ein Verzeichnis von Verarbeitungstätigkeiten oder ein Auftragsverarbeitungsvertrag mit dem Hoster: nicht geprüft.',
    'Dieses Blatt enthält ohne den Gesetzestext keine belegten Fakten; es muss nach Wiederherstellung des Abrufs nachgeholt werden.',
  ],
};
