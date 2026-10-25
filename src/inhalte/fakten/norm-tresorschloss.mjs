// Faktenblatt norm-tresorschloss: Tresorschlösser. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [
  { id: 'q1', titel: 'DIN Media (Normungsinstitut DIN) – DIN EN 1300:2024-01, Normseite', url: 'https://www.dinmedia.de/en/standard/din-en-1300/360807969', art: 'sekundaer', abgerufen: '2026-10-25' },
];

export default {
  id: 'norm-tresorschloss',
  thema: 'Tresorschlösser',
  stand: '2026-10-25',
  frage: 'Welche Klassen gelten für Hochsicherheitsschlösser an Tresoren (mechanisch und elektronisch)?',
  fakten: {
    ausgabe: fakt({ id: 'norm-tresorschloss.ausgabe', text: 'DIN EN 1300 ist laut Normungsinstitut in der Ausgabe 2024-01 aktuell und ersetzt die Ausgabe 2019-05.', quelle: 'q1', status: 'verifizieren' }),
    titel: fakt({ id: 'norm-tresorschloss.titel', text: 'Die Norm klassifiziert Hochsicherheitsschlösser nach ihrem Widerstandswert gegen unbefugtes Öffnen.', quelle: 'q1', status: 'verifizieren' }),
  },
  offen: [
    'Klassenzahl und Klassenbezeichnungen sind nicht belegt. Die Normseite nennt keine Klassen; der Normtext ist kostenpflichtig.',
    'Die Trennung nach mechanischen und elektronischen Schlössern ist nicht belegt. Ein Suchtreffer nannte Anforderungen an ferngesteuerte elektronische Schlösser seit der Ausgabe 2014; das ist ungeprüft.',
    'Prüfkriterien (Werkzeuge, Zeiten, Angriffsarten) sind nicht belegt.',
    'Polizeiliche Herstellerverzeichnisse zu Tresorschlössern wurden nicht gefunden.',
  ],
};
