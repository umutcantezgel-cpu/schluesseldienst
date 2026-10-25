// Faktenblatt recht-rechnung: Pflichtangaben einer Rechnung. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [
  { id: 'q1', titel: 'Bundesministerium der Justiz – Umsatzsteuergesetz (UStG), § 14 Ausstellung von Rechnungen (gesetze-im-internet.de)', url: 'https://www.gesetze-im-internet.de/ustg_1980/__14.html', art: 'primaer', abgerufen: '2026-10-25' },
  { id: 'q2', titel: 'Bundesministerium der Justiz – Umsatzsteuer-Durchführungsverordnung (UStDV), § 33 Kleinbetragsrechnungen (gesetze-im-internet.de)', url: 'https://www.gesetze-im-internet.de/ustdv_1980/__33.html', art: 'primaer', abgerufen: '2026-10-25' },
];

export default {
  id: 'recht-rechnung',
  thema: 'Pflichtangaben einer Rechnung',
  stand: '2026-10-25',
  frage: 'Welche Angaben muss eine Rechnung enthalten, und was gilt für Kleinbetragsrechnungen?',
  fakten: {
    'name-anschrift': fakt({ id: 'recht-rechnung.name-anschrift', text: 'Nach § 14 Abs. 4 Satz 1 Nr. 1 UStG müssen Name und Anschrift des leistenden Unternehmers und des Leistungsempfängers vollständig angegeben werden.', quelle: 'q1', status: 'verifizieren' }),
    'steuernummer': fakt({ id: 'recht-rechnung.steuernummer', text: 'Nach § 14 Abs. 4 Satz 1 Nr. 2 UStG muss die Rechnung die Steuernummer oder die Umsatzsteuer-Identifikationsnummer des leistenden Unternehmers enthalten.', quelle: 'q1', status: 'verifizieren' }),
    'datum-nummer': fakt({ id: 'recht-rechnung.datum-nummer', text: 'Nach § 14 Abs. 4 Satz 1 Nr. 3 und 4 UStG muss die Rechnung das Ausstellungsdatum und eine fortlaufende Rechnungsnummer enthalten.', quelle: 'q1', status: 'verifizieren' }),
    'leistung': fakt({ id: 'recht-rechnung.leistung', text: 'Nach § 14 Abs. 4 Satz 1 Nr. 5 UStG müssen Menge und handelsübliche Bezeichnung der Gegenstände oder Umfang und Art der sonstigen Leistung angegeben werden.', quelle: 'q1', status: 'verifizieren' }),
    'zeitpunkt': fakt({ id: 'recht-rechnung.zeitpunkt', text: 'Nach § 14 Abs. 4 Satz 1 Nr. 6 UStG ist der Zeitpunkt der Lieferung oder sonstigen Leistung anzugeben, sofern er feststeht und vom Ausstellungsdatum abweicht.', quelle: 'q1', status: 'verifizieren' }),
    'entgelt-steuer': fakt({ id: 'recht-rechnung.entgelt-steuer', text: 'Nach § 14 Abs. 4 Satz 1 Nr. 7 und 8 UStG müssen das Entgelt nach Steuersätzen aufgeschlüsselt, der anzuwendende Steuersatz und der darauf entfallende Steuerbetrag angegeben werden; bei einer Steuerbefreiung genügt ein Hinweis darauf.', quelle: 'q1', status: 'verifizieren' }),
    'kleinbetrag-grenze': fakt({ id: 'recht-rechnung.kleinbetrag-grenze', text: 'Eine Kleinbetragsrechnung nach § 33 UStDV liegt vor, wenn ihr Gesamtbetrag höchstens 250 Euro beträgt.', quelle: 'q2', status: 'verifizieren' }),
    'kleinbetrag-pflicht': fakt({ id: 'recht-rechnung.kleinbetrag-pflicht', text: 'Auch eine Kleinbetragsrechnung muss nach § 33 UStDV mindestens Name und Anschrift des leistenden Unternehmers, das Ausstellungsdatum, Menge und Art der Leistung sowie Entgelt, Steuersatz und Steuerbetrag als Summe enthalten.', quelle: 'q2', status: 'verifizieren' }),
    'kleinbetrag-entfall': fakt({ id: 'recht-rechnung.kleinbetrag-entfall', text: 'Die Steuernummer und die Rechnungsnummer zählen nach § 33 UStDV nicht zu den Mindestangaben einer Kleinbetragsrechnung.', quelle: 'q2', status: 'verifizieren' }),
  },
  offen: [
    'Der Wortlaut von § 14 Abs. 4 UStG und § 33 UStDV wurde nur sinngemäß gelesen (Zusammenfassung der amtlichen Seiten), nicht wörtlich. Die Seiten nennen keinen Stand-Termin; die Fassung ist nicht bestätigt.',
    'Die Einzelabrufe der Gesetzesseiten lieferten zeitweise HTTP 503; die UStG-Seite wurde erst im zweiten Abruf geladen.',
    'Nummern 9 und 10 des § 14 Abs. 4 UStG (Hinweis zur Aufbewahrung nach § 14b, Angabe „Gutschrift“) nicht übernommen.',
    'Ob die Betragsgrenze von 250 Euro im Jahr 2026 unverändert gilt, ist nicht am Stand der Fassung geprüft.',
    'Vereinfachungen für Rechnungen nach § 14 Abs. 5 und § 14a UStG, Besonderheiten für Gutschriften und elektronische Rechnungen: nicht geprüft.',
  ],
};
