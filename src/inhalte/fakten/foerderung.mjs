// Faktenblatt foerderung: Förderung Einbruchschutz. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [
  { id: 'q1', titel: 'KfW Bankengruppe – Merkblatt 159 „Altersgerecht Umbauen – Kredit“ (Stand 10/2023, Bestellnummer 600 000 3884)', url: 'https://www.kfw.de/PDF/Download-Center/F%C3%B6rderprogramme-(Inlandsf%C3%B6rderung)/PDF-Dokumente/6000003884_M_159_AU_ohne_TMA.pdf', art: 'primaer', abgerufen: '2026-10-25' },
];

export default {
  id: 'foerderung',
  thema: 'Förderung Einbruchschutz',
  stand: '2026-10-25',
  frage: 'Welche Förderung für Einbruchschutz gibt es zum Stand des Builds (Bund, Hessen), mit welchen Bedingungen, und welche Programme sind ausgelaufen?',
  fakten: {
    'kredit-159': fakt({ id: 'foerderung.kredit-159', text: 'Die KfW fördert Einbruchschutz an bestehenden Wohngebäuden mit dem zinsgünstigen Kredit „Altersgerecht Umbauen – Kredit“, Produktnummer 159.', quelle: 'q1', status: 'verifizieren' }),
    'kredit-159-bund': fakt({ id: 'foerderung.kredit-159-bund', text: 'Das Produkt 159 wird laut Merkblatt Stand 10/2023 im Auftrag des Bundesministeriums für Wohnen, Stadtentwicklung und Bauwesen von der KfW durchgeführt.', quelle: 'q1', status: 'verifizieren' }),
    'kredit-159-hoechstbetrag': fakt({ id: 'foerderung.kredit-159-hoechstbetrag', text: 'Für den Kredit 159 sind laut Merkblatt Stand 10/2023 Investitionskosten mit einem Kreditbetrag von maximal 50.000 Euro pro Wohneinheit förderfähig.', quelle: 'q1', status: 'verifizieren' }),
    'kredit-159-antrag': fakt({ id: 'foerderung.kredit-159-antrag', text: 'Der Antrag ist laut Merkblatt Stand 10/2023 vor Beginn des Vorhabens bei einem Finanzierungsinstitut zu stellen.', quelle: 'q1', status: 'verifizieren' }),
    'kredit-159-vorhabensbeginn': fakt({ id: 'foerderung.kredit-159-vorhabensbeginn', text: 'Als Beginn eines Vorhabens gilt laut Merkblatt Stand 10/2023 der Abschluss von Liefer- und Leistungsverträgen.', quelle: 'q1', status: 'verifizieren' }),
    'kredit-159-fachunternehmen': fakt({ id: 'foerderung.kredit-159-fachunternehmen', text: 'Die geförderten Maßnahmen müssen laut Merkblatt Stand 10/2023 durch Fachunternehmen ausgeführt werden, Eigenleistungen sind nicht förderfähig.', quelle: 'q1', status: 'verifizieren' }),
    'kredit-159-fenster': fakt({ id: 'foerderung.kredit-159-fenster', text: 'Der Einbau neuer Fenster und Fenstertüren wird laut Merkblatt Stand 10/2023 nicht über den Kredit 159, sondern ausschließlich über die Bundesförderung für effiziente Gebäude (BEG) gefördert.', quelle: 'q1', status: 'verifizieren' }),
  },
  offen: [
    'Stand des Abrufs ist 2026-10-25. Das aktuelle Antragsstatus des Kredits 159 ist nicht mit Datum belegt. Das Merkblatt stammt vom 10/2023. Eine KfW-Webseite zum Kredit 159 nennt keinen Antragsstopp, trägt aber kein Stand-Datum (nur Copyright 2026). Die Webseite war im Abruf nicht eindeutig einer URL zuzuordnen; sie ist deshalb nicht als Quelle angegeben.',
    'Zuschuss Einbruchschutz 455-E (Investitionszuschuss): Status nicht belegt, weder als aktiv noch als ausgelaufen. Die KfW-Partnerportalseite zum Produkt lieferte HTTP 404. Auf der öffentlichen KfW-Seite zu 455 wird 455-E nicht behandelt. Sekundärquellen widersprechen sich: ein Bank-Ratgeber nennt 455-E als 2023 ohne Mittel („eingestellt“); ein Energieberater-Beitrag meldet einen Antragsstopp ohne Datum, vermutlich 2025, mit dem Hinweis auf fehlende Haushaltsmittel; Beiträge aus 2022 beschreiben einen Stopp ab 01.07.2022 und eine Wiederaufnahme. Ein Datum für den Status kann ich nicht nennen.',
    'Die KfW-Seite zum Investitionszuschuss (455) nennt für 455-B (Barrierereduzierung, nicht Einbruchschutz) „Diesen Zuschuss können Sie nicht mehr beantragen.“ Wegen ausgeschöpfter Mittel; eine Wiederaufnahme nur, wenn 2027 erneut Bundesmittel bereitgestellt werden. Die Seite ist ohne Stand-Datum. 455-B ist hier nicht aufgenommen, weil es nicht den Einbruchschutz betrifft.',
    'Hessen: Ein Landesprogramm für Einbruchschutz ist nicht belegt. Die WIBank-Suche lieferte keine Richtlinie. Ein Anbieter-Text nennt eine hessische „Richtlinie“ mit Beträgen (1.500 Euro bzw. 10.000 Euro), die sich widersprechen und keine Primärquelle haben. Die Richtlinie aus Schleswig-Holstein ist nicht übertragbar. Hessen bleibt offen.',
    'Die Förderdatenbank des Bundes (foerderdatenbank.de) konnte ich nicht auswerten; Bundesprogramme sind nur über das KfW-Merkblatt belegt.',
    'Vorhabensbeginn: Laut Merkblatt kann bei einem dokumentierten Beratungsgespräch mit dem Finanzierungsinstitut vor dem Vertragsabschluss der Beginn der Bauarbeiten vor Ort gelten (Formular 600 000 4806). Das ist als Ausnahme nicht als Fakt aufgenommen.',
    'Steuerlicher Weg (§ 35a EStG für Lohnkosten) ist nicht Teil des Prüfauftrags und nicht geprüft.',
  ],
};
