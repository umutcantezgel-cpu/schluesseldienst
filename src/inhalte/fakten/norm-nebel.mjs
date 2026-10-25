// Faktenblatt norm-nebel: Sicherheitsnebelgeräte. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [
  { id: 'q1', titel: 'DIN (Normungsinstitut) – DIN EN 50131-8 (VDE 0830-2-8:2020-01), Normseite', url: 'https://din.de/en/getting-involved/standards-committees/nqsz/publications/wdc-beuth:din21:313922115', art: 'sekundaer', abgerufen: '2026-10-25' },
];

export default {
  id: 'norm-nebel',
  thema: 'Sicherheitsnebelgeräte',
  stand: '2026-10-25',
  frage: 'Welche Norm gilt für Sicherheitsnebelgeräte, und was müssen Hersteller zu Rückständen und Gesundheit nachweisen?',
  fakten: {
    'ausgabe': fakt({ id: 'norm-nebel.ausgabe', text: 'DIN EN 50131-8 (VDE 0830-2-8:2020-01) ist laut Normungsinstitut die aktuelle Fassung und entspricht der EN 50131-8:2019.', quelle: 'q1', status: 'verifizieren' }),
    'titel': fakt({ id: 'norm-nebel.titel', text: 'Die Norm trägt im Deutschen den Titel „Alarmanlagen – Einbruch- und Überfallmeldeanlagen – Teil 8: Nebelgeräte für Sicherungsanwendungen“.', quelle: 'q1', status: 'verifizieren' }),
    'gremium': fakt({ id: 'norm-nebel.gremium', text: 'Zuständiges nationales Gremium für die Norm ist laut Normungsinstitut DKE/UK 713.1 „Gefahrenmelde- und Überwachungsanlagen“.', quelle: 'q1', status: 'verifizieren' }),
  },
  offen: [
    'Rückstände und Gesundheit: nicht belegt. Die Normseite nennt weder Anwendungsbereich noch Anforderungen; der Normtext ist kostenpflichtig und war nicht einsehbar. Herstellersicherheitsdatenblätter sind nach Vorgabe nicht verwendet.',
    'Begriff: Der Prüfauftrag spricht von „Sicherheitsnebelgeräten“, die Norm heißt „Nebelgeräte für Sicherungsanwendungen“. Ob der Seitentext den Normbegriff übernehmen soll, ist eine Entscheidung für den Menschen.',
    'Eine Polizeiquelle zu Nebelgeräten wurde nicht gefunden; Einsatz- oder Gebrauchshinweise sind deshalb nicht enthalten.',
    'Die ältere Ausgabe 2010-03 (EN 50131-8:2009) ist laut Normungsinstitut zurückgezogen; sie ist nicht Grundlage dieses Blattes.',
  ],
};
