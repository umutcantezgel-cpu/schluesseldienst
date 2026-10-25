// Faktenblatt recht-bfsg: Barrierefreiheit. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [
  { id: 'q1', titel: 'Bundesministerium der Justiz – Barrierefreiheitsstärkungsgesetz (BFSG), § 1 Anwendungsbereich (gesetze-im-internet.de)', url: 'https://www.gesetze-im-internet.de/bfsg/__1.html', art: 'primaer', abgerufen: '2026-10-25' },
];

export default {
  id: 'recht-bfsg',
  thema: 'Barrierefreiheit',
  stand: '2026-10-25',
  frage: 'Gilt das Barrierefreiheitsstärkungsgesetz für diesen Betrieb, und was gehört in eine freiwillige Erklärung?',
  fakten: {
    'stichtag': fakt({ id: 'recht-bfsg.stichtag', text: 'Nach § 1 Abs. 3 BFSG werden Dienstleistungen erfasst, die für Verbraucher nach dem 28. Juni 2025 erbracht werden.', quelle: 'q1', status: 'verifizieren' }),
    'dienstleistungsarten': fakt({ id: 'recht-bfsg.dienstleistungsarten', text: 'Zu den Dienstleistungen nach § 1 Abs. 3 BFSG zählen unter anderem Telekommunikationsdienste, Bankdienstleistungen, E-Books und E-Commerce-Angebote.', quelle: 'q1', status: 'verifizieren' }),
  },
  offen: [
    'Ob dieser Betrieb (Schlüsseldienst) unter eine der genannten Dienstleistungsarten fällt: nicht belegt. Der Dienstleistungsbegriff wurde nicht auf Notöffnungen oder Schlüsseldienste angewendet.',
    'Kleinstunternehmen-Ausnahme (laut IHK-Zusammenfassung weniger als zehn Beschäftigte und Umsatz oder Bilanzsumme bis 2 Mio. Euro): nicht am Gesetzestext geprüft. Der Paragraf (§ 3 BFSG) konnte nicht abgerufen werden (HTTP 503).',
    'Unverhältnismäßige-Belastung-Ausnahme (Dokumentation und Aufbewahrung über fünf Jahre laut Sekundärquelle): nicht geprüft.',
    'Inhalt, Pflicht und Form einer Erklärung zur Barrierefreiheit (§ 12 BFSG): nicht belegt. Der Paragraf konnte nicht abgerufen werden (HTTP 503), die Suche lieferte keine Quelle.',
    'Ob Erklärungen für Kleinstunternehmen freiwillig sind: nicht belegt.',
    'Die Bundesfachstelle Barrierefreiheit (Behörde, mit Selbstcheck und FAQ) wurde nicht unmittelbar gelesen; sie wäre die geeignete primäre Zweitquelle.',
  ],
};
