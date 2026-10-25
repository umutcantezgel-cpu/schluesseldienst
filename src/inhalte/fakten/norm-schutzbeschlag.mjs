// Faktenblatt norm-schutzbeschlag: Schutzbeschläge. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [
  { id: 'q1', titel: 'DIN Media (Normungsinstitut DIN) – DIN 18257:2022-02, Normseite', url: 'https://www.dinmedia.de/en/standard/din-18257/348923000', art: 'sekundaer', abgerufen: '2026-10-25' },
  { id: 'q2', titel: 'Polizeiliche Kriminalprävention (KPK), Landeskriminalamt Niedersachsen – Herstellerverzeichnis Schutzbeschläge, Stand Januar 2025', url: 'https://www.lka.polizei-nds.de/download/74076/Schutzbeschlaege.pdf', art: 'sekundaer', abgerufen: '2026-10-25' },
  { id: 'q3', titel: 'Polizeiliche Kriminalprävention (KPK), Landeskriminalamt Niedersachsen – Herstellerverzeichnis Profilzylinder, Stand Januar 2025', url: 'https://www.lka.polizei-nds.de/download/74074/Profilzylinder.pdf', art: 'sekundaer', abgerufen: '2026-10-25' },
];

export default {
  id: 'norm-schutzbeschlag',
  thema: 'Schutzbeschläge',
  stand: '2026-10-25',
  frage: 'Welche Klassen gibt es für Schutzbeschläge, und welche Zylinderabdeckung verlangt welche Klasse?',
  fakten: {
    ausgabe: fakt({ id: 'norm-schutzbeschlag.ausgabe', text: 'DIN 18257 ist laut Normungsinstitut in der Ausgabe 2022-02 aktuell und ersetzt die Ausgabe 2015-06.', quelle: 'q1', status: 'verifizieren' }),
    titel: fakt({ id: 'norm-schutzbeschlag.titel', text: 'DIN 18257 regelt nach ihrem Titel Begriffe, Maße, Anforderungen und Kennzeichnung von Schutzbeschlägen.', quelle: 'q1', status: 'verifizieren' }),
    klassen: fakt({ id: 'norm-schutzbeschlag.klassen', text: 'Schutzbeschläge nach DIN 18257 werden nach Polizeiangaben in die Widerstandsklassen ES 0 bis ES 3 eingeteilt.', quelle: 'q2', status: 'verifizieren' }),
    'es-bedeutung': fakt({ id: 'norm-schutzbeschlag.es-bedeutung', text: 'Die Bezeichnung ES steht nach Polizeiangaben für einbruchhemmenden Schutzbeschlag.', quelle: 'q2', status: 'verifizieren' }),
    empfehlung: fakt({ id: 'norm-schutzbeschlag.empfehlung', text: 'Die Polizei empfiehlt Schutzbeschläge ab der Widerstandsklasse ES 1.', quelle: 'q2', status: 'verifizieren' }),
    'din-en-1906': fakt({ id: 'norm-schutzbeschlag.din-en-1906', text: 'Nach Polizeiangaben entspricht ES 2 der Sicherheitsklasse 3 nach DIN EN 1906; empfohlen sind Ausführungen der Sicherheitsklassen 2 bis 4.', quelle: 'q2', status: 'verifizieren' }),
    'za-immer': fakt({ id: 'norm-schutzbeschlag.za-immer', text: 'Die Polizei empfiehlt, Schutzbeschläge immer mit Zylinderabdeckung zu verwenden, weil diese einen hohen Schutz für den Profilzylinder bietet.', quelle: 'q2', status: 'verifizieren' }),
    'za-profilzylinder': fakt({ id: 'norm-schutzbeschlag.za-profilzylinder', text: 'Der Grundschutz eines Profilzylinders soll nach Polizeiangaben durch einen Schutzbeschlag nach DIN 18257 mindestens der Klasse ES 1 mit Zylinderabdeckung ergänzt werden.', quelle: 'q3', status: 'verifizieren' }),
    sicherheit: fakt({ id: 'norm-schutzbeschlag.sicherheit', text: 'Schutzbeschläge sollen nach Polizeiangaben das gewaltsame Abdrehen des Profilzylinders und einen mechanischen Angriff auf das Schloss wirksam erschweren.', quelle: 'q2', status: 'verifizieren' }),
  },
  offen: [
    'Eine klassenabhängige Zuordnung der Zylinderabdeckung ist nicht belegt. Die Polizeiquelle empfiehlt die Zylinderabdeckung immer und nennt keine Klassenvorgabe.',
    'Die Prüfkriterien der ES-Klassen (Stoßkörper, Fallhöhen, Werkzeuge, Dauern) sind nicht belegt. Der Normtext ist kostenpflichtig; die Normseite enthält keinen Klassentext.',
    'Ein Suchtreffer nannte gehärteten Stahl für bestimmte Klassen; das ist ungeprüft und nicht übernommen.',
    'Anforderungen an Schutzbeschläge an Feuer- und Rauchschutztüren (Verweise auf andere Normen oder Zulassungen laut Suchtreffer) sind nicht geprüft.',
    'Die Gleichwertigkeit mit DIN EN 1906 stammt aus der Polizeiquelle und ist am Normtext von DIN EN 1906 nicht geprüft.',
  ],
};
