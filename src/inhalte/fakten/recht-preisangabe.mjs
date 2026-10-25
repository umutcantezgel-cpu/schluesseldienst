// Faktenblatt recht-preisangabe: Preisangaben. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [];

export default {
  id: 'recht-preisangabe',
  thema: 'Preisangaben',
  stand: '2026-10-25',
  frage: 'Was verlangt die Preisangabenverordnung an Gesamtpreisen, Zuschlägen und Anfahrtskosten gegenüber Verbrauchern?',
  fakten: {},
  offen: [
    'Die Preisangabenverordnung (PAngV) konnte nicht abgerufen werden: gesetze-im-internet.de lieferte bei allen Abrufen HTTP 503. Deshalb ist kein Fakt belegt; Gesamtpreis, Zuschläge und Anfahrtskosten bleiben offen.',
    'Ob Anfahrtskosten und Zuschläge bei Schlüsseldienst-Leistungen in den Gesamtpreis einzurechnen sind, ist nicht am Verordnungstext geprüft. Die Verbraucherzentrale spricht nur allgemein von Festpreisen mit Anfahrt und Zuschlägen (siehe Blatt recht-wucher).',
    'Die aktuelle Fassung der PAngV und die Preisangabenpflicht bei Dienstleistungen sind nicht geprüft.',
  ],
};
