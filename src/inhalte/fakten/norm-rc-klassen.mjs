// Faktenblatt norm-rc-klassen: Widerstandsklassen Türen und Fenster. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [
  { id: 'q1', titel: 'DIN Media (Normungsinstitut DIN) – DIN EN 1627:2021-11, Normseite', url: 'https://www.dinmedia.de/en/standard/din-en-1627/332355073', art: 'sekundaer', abgerufen: '2026-10-25' },
  { id: 'q2', titel: 'Polizeiliche Kriminalprävention (KPK), Bayerisches Landeskriminalamt – Herstellerverzeichnis Fenster und Fassaden, Stand Januar 2025', url: 'https://www.polizei.bayern.de/mam/praevention/250220_blka_fenster.pdf', art: 'sekundaer', abgerufen: '2026-10-25' },
  { id: 'q3', titel: 'Polizeiliche Kriminalprävention (KPK), Landeskriminalamt Niedersachsen – Herstellerverzeichnis Türen/Tore, Stand Januar 2025', url: 'https://www.lka.polizei-nds.de/download/74077/Tueren_und_Tore.pdf', art: 'sekundaer', abgerufen: '2026-10-25' },
  { id: 'q4', titel: 'Polizeiliche Kriminalprävention – k-einbruch.de, Seite Fenster, Balkon- und Terrassentür', url: 'https://www.k-einbruch.de/sicherheitstipps/fenster/', art: 'sekundaer', abgerufen: '2026-10-25' },
];

export default {
  id: 'norm-rc-klassen',
  thema: 'Widerstandsklassen Türen und Fenster',
  stand: '2026-10-25',
  frage: 'Welche Widerstandsklassen kennt die Norm für einbruchhemmende Türen und Fenster, und was beschreibt jede Klasse (Täterbild, Werkzeug, Prüfdauer)?',
  fakten: {
    ausgabe: fakt({ id: 'norm-rc-klassen.ausgabe', text: 'DIN EN 1627 liegt laut Normungsinstitut in der Ausgabe 2021-11 als aktuelle Fassung vor und ersetzt die Ausgabe 2011-09.', quelle: 'q1', status: 'verifizieren' }),
    'rc6-hoechste': fakt({ id: 'norm-rc-klassen.rc6-hoechste', text: 'Nach Polizeiangaben steht RC 6 für die höchste Widerstandsklasse einbruchhemmender Fenster.', quelle: 'q2', status: 'verifizieren' }),
    'unter-rc2': fakt({ id: 'norm-rc-klassen.unter-rc2', text: 'Unterhalb von RC 2 führt die Ausgabe 2021 die Klassen RC 1 N, RC 1 und RC 2 N, die Ausgabe 2011 nur RC 1 N und RC 2 N.', quelle: 'q2', status: 'verifizieren' }),
    'gleiche-bezeichnung': fakt({ id: 'norm-rc-klassen.gleiche-bezeichnung', text: 'Die Klassen RC 2 bis RC 6 tragen in den Ausgaben 2021 und 2011 dieselbe Bezeichnung.', quelle: 'q2', status: 'verifizieren' }),
    empfehlung: fakt({ id: 'norm-rc-klassen.empfehlung', text: 'Nach Polizeiangaben sind Fenster ab RC 2 uneingeschränkt empfehlenswert.', quelle: 'q2', status: 'verifizieren' }),
    grundsicherung: fakt({ id: 'norm-rc-klassen.grundsicherung', text: 'Die Klassen RC 1 N und RC 1 gelten nach Polizeiangaben als Grundsicherung für Fenster bei erhöhtem Einbau, etwa ab der ersten Etage.', quelle: 'q2', status: 'verifizieren' }),
    'ohne-werkzeug': fakt({ id: 'norm-rc-klassen.ohne-werkzeug', text: 'Für die Grundsicherungsklassen RC 1 N und RC 1 ist nach Polizeiangaben keine Einbruchprüfung mit Werkzeug vorgesehen.', quelle: 'q2', status: 'verifizieren' }),
    vornorm: fakt({ id: 'norm-rc-klassen.vornorm', text: 'Fenster nach der bis September 2011 gültigen Vornorm DIN V ENV 1627 gelten nach Polizeiangaben als gleichwertig.', quelle: 'q2', status: 'verifizieren' }),
    'sechs-klassen-fenster': fakt({ id: 'norm-rc-klassen.sechs-klassen-fenster', text: 'Einbruchhemmende Fenster werden nach Polizeiangaben in sechs Widerstandsklassen RC 1 bis RC 6 eingeteilt.', quelle: 'q2', status: 'verifizieren' }),
    'tueren-klassen': fakt({ id: 'norm-rc-klassen.tueren-klassen', text: 'Einbruchhemmende Türen werden nach Polizeiangaben in sechs Widerstandsklassen RC 1 bis RC 6 eingeteilt.', quelle: 'q3', status: 'verifizieren' }),
    'tueren-empfehlung': fakt({ id: 'norm-rc-klassen.tueren-empfehlung', text: 'Nach Polizeiangaben sind Türen ab der Widerstandsklasse RC 2 uneingeschränkt empfehlenswert.', quelle: 'q3', status: 'verifizieren' }),
  },
  offen: [
    'Die Anzahl der Klassen widerspricht sich: Die KPK-Broschüren sprechen von sechs Widerstandsklassen (RC 1 bis RC 6), die k-einbruch.de-Seite Fenster von sieben. Die Tabelle der Ausgabe 2021 zählt RC 1 N, RC 1, RC 2 N sowie RC 2 bis RC 6.',
    'Täterbild, Angriffswerkzeuge und Prüfdauern (Werkzeugeinwirkzeit, Gesamtwiderstandszeit) je Klasse sind nicht belegt. Die Polizeibroschüren nennen dazu keine Werte; die k-einbruch.de-Seite verweist auf Tabellen, die nur als Bild eingebunden sind.',
    'Angaben aus einer Präsentation der Polizei Wuppertal (3 und 5 Minuten Werkzeugangriff, 15 Minuten Gesamtzeit, Werkzeugliste) sind nur aus Suchtreffern bekannt. Die Quelle war dreimal nicht abrufbar (HTTP 503). Nicht übernommen.',
    'Der Normtext DIN EN 1627:2021-11 ist kostenpflichtig, die Normseite enthält keine Klassenbeschreibung. Alle Angaben sind sekundär; eine Primärquelle fehlt.',
    'Die Bedeutung der Klasse RC 1 ohne N als eigene Klasse der Ausgabe 2021 stammt nur aus der Tabelle der Polizei und ist inhaltlich nicht belegt.',
  ],
};
