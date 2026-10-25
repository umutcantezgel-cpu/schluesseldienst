// Faktenblatt versicherung-schluessel: Versicherung bei Schlüsseldienst und Schlüsselverlust. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [
  { id: 'q1', titel: 'Gesamtverband der Deutschen Versicherungswirtschaft (GDV) – Allgemeine Hausrat-Versicherungsbedingungen VHB 2022, Quadratmetermodell (Musterbedingungen, Stand Juni 2026)', url: 'https://www.gdv.de/resource/blob/6114/458ab7b03401b2bb3bd22b707a5ec6cc/allgemeine-hausrat-versicherungsbedingungen-vhb-2022-quadratmetermodell--data.pdf', art: 'sekundaer', abgerufen: '2026-10-25' },
];

export default {
  id: 'versicherung-schluessel',
  thema: 'Versicherung bei Schlüsseldienst und Schlüsselverlust',
  stand: '2026-10-25',
  frage: 'Welche Versicherungsarten können Kosten für Türöffnung, Schlosstausch oder Schlüsselverlust abdecken, und wovon hängt das ab?',
  fakten: {
    'vhb-folgekosten': fakt({ id: 'versicherung-schluessel.vhb-folgekosten', text: 'Die Musterbedingungen VHB 2022 ersetzen Schlossänderungskosten nur als Kosten, die infolge eines Versicherungsfalls erforderlich und tatsächlich angefallen sind (Ziffer A 13.1.5).', quelle: 'q1', status: 'verifizieren' }),
    'vhb-schluessel': fakt({ id: 'versicherung-schluessel.vhb-schluessel', text: 'Nach Ziffer A 13.2.5 der VHB 2022 setzen Schlossänderungskosten voraus, dass Schlüssel für Türen der Wohnung oder für dort befindliche Wertschutzschränke durch einen Versicherungsfall abhandengekommen sind.', quelle: 'q1', status: 'verifizieren' }),
    'vhb-falsche-schluessel': fakt({ id: 'versicherung-schluessel.vhb-falsche-schluessel', text: 'Einbruchdiebstahl liegt nach Ziffer A 4.1.1 der VHB 2022 auch vor, wenn der Täter mit einem falschen Schlüssel in einen Raum eines Gebäudes eindringt; ein Schlüssel ist falsch, wenn seine Anfertigung für das Schloss nicht von einer berechtigten Person veranlasst oder gebilligt wurde.', quelle: 'q1', status: 'verifizieren' }),
    'vhb-keine-notoeffnung': fakt({ id: 'versicherung-schluessel.vhb-keine-notoeffnung', text: 'Die VHB 2022 nennen Kosten für eine Notöffnung oder für Schlosserleistungen nicht ausdrücklich.', quelle: 'q1', status: 'verifizieren' }),
  },
  offen: [
    'Es wurde nur das Musterwerk VHB 2022 im Quadratmetermodell gelesen. Das Versicherungssummenmodell und die Tarife einzelner Versicherer sind nicht geprüft; die Aussagen gelten nur für die Musterbedingungen.',
    'Deckung für Notöffnung und Schlosserkosten: Die Musterbedingungen schweigen dazu. Ob einzelne Versicherer dies über Zusatzbausteine abdecken, ist nicht belegt; es wurde kein Versicherer geprüft.',
    'Schlüsselverlust ohne Versicherungsfall (nur verlorener Schlüssel): Die Deckung ist nicht belegt. Der Ausschluss ergibt sich nur aus dem Wortlaut von A 13.2.5 und ist nicht ausdrücklich bestätigt.',
    'Die Gewerbeklausel für erweiterte Schlossänderungskosten (SK 4301 laut Suchtreffer) ist nicht am Originaltext geprüft und betrifft Gewerbe, nicht Privathaushalte.',
    'Gebäude-, Wohngebäude- und Rechtsschutzversicherung: nicht geprüft.',
    'Die Musterbedingungen sind Verbandsempfehlungen; die im Einzelfall vereinbarte Fassung ist maßgeblich und nicht bekannt.',
  ],
};
