// Faktenblatt recht-35a: Steuerermäßigung Handwerkerleistungen. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [
  { id: 'q1', titel: 'Bundesministerium der Justiz – Einkommensteuergesetz (EStG), § 35a Steuerermäßigung bei Aufwendungen für haushaltsnahe Beschäftigungsverhältnisse, haushaltsnahe Dienstleistungen und Handwerkerleistungen (gesetze-im-internet.de, ohne Stand-Datum)', url: 'https://www.gesetze-im-internet.de/estg/__35a.html', art: 'primaer', abgerufen: '2026-10-25' },
];

export default {
  id: 'recht-35a',
  thema: 'Steuerermäßigung Handwerkerleistungen',
  stand: '2026-10-25',
  frage: 'Welcher Anteil welcher Kosten ist absetzbar, bis zu welchem Höchstbetrag, und welche Zahlungsart ist Voraussetzung?',
  fakten: {
    'anteil': fakt({ id: 'recht-35a.anteil', text: 'Für Handwerkerleistungen bei Renovierungs-, Erhaltungs- und Modernisierungsmaßnahmen im Haushalt ermäßigt sich die tarifliche Einkommensteuer nach § 35a Abs. 3 EStG um 20 Prozent der Aufwendungen.', quelle: 'q1', status: 'verifizieren' }),
    'hoechstbetrag': fakt({ id: 'recht-35a.hoechstbetrag', text: 'Die Steuerermäßigung für Handwerkerleistungen nach § 35a Abs. 3 EStG beträgt höchstens 1.200 Euro.', quelle: 'q1', status: 'verifizieren' }),
    'arbeitskosten': fakt({ id: 'recht-35a.arbeitskosten', text: 'Bei Handwerkerleistungen zählen nach § 35a Abs. 5 EStG nur die Arbeitskosten.', quelle: 'q1', status: 'verifizieren' }),
    'zahlung-konto': fakt({ id: 'recht-35a.zahlung-konto', text: 'Voraussetzung für die Steuerermäßigung ist nach § 35a Abs. 5 EStG eine Rechnung und eine Zahlung auf das Konto des Leistungserbringers.', quelle: 'q1', status: 'verifizieren' }),
    'ausschluss-betrieb': fakt({ id: 'recht-35a.ausschluss-betrieb', text: 'Die Steuerermäßigung gilt nicht für Aufwendungen, die Betriebsausgaben, Werbungskosten, Sonderausgaben oder außergewöhnliche Belastungen sind.', quelle: 'q1', status: 'verifizieren' }),
  },
  offen: [
    'Stand des Gesetzes: Die Seite nennt kein Stand-Datum und keine Fassung. Ob die Fassung für den Veranlagungszeitraum 2026 gilt, ist nicht bestätigt.',
    'Anwendungsschreiben des Bundesfinanzministeriums (BMF): nicht abgerufen (HTTP 503). Ein Suchtreffer nannte das BMF-Schreiben vom 9. November 2016, geändert am 21. September 2021; das ist nicht geprüft.',
    'Förderausschluss bei öffentlicher Förderung: Die Zusammenfassung nannte zinsverbilligte Darlehen und steuerfreie Zuschüsse als Ausschluss; der genaue Umfang (insoweit oder vollständig) ist nicht am Wortlaut geprüft.',
    'Haushaltsnahe Dienstleistungen nach § 35a Abs. 2 EStG (20 Prozent, Höchstbetrag 4.000 Euro laut Suchtreffer): nicht als Fakt übernommen, weil nur über Suchtreffer bekannt.',
    'Die Abgrenzung, ob Notöffnungen oder Schlossaustausch Handwerkerleistungen im Sinne des Paragrafen sind: nicht belegt.',
    'Ob Barzahlungen ausgeschlossen sind, ist nur aus der Voraussetzung der Kontozahlung abgeleitet (Zusammenfassung nennt es als wahrscheinlich, nicht als Wortlaut); nicht als Fakt übernommen.',
    'Der Antrag für die Steuerermäßigung und die Behandlung bei zusammenlebenden Personen: nur am Wortlaut-Auszug gelesen, nicht als Fakt übernommen.',
  ],
};
