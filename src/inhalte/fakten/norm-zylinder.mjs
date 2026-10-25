// Faktenblatt norm-zylinder: Schließzylinder. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [
  { id: 'q1', titel: 'Polizeiliche Kriminalprävention (KPK), Landeskriminalamt Niedersachsen – Herstellerverzeichnis Profilzylinder, Stand Januar 2025', url: 'https://www.lka.polizei-nds.de/download/74074/Profilzylinder.pdf', art: 'sekundaer', abgerufen: '2026-10-25' },
  { id: 'q2', titel: 'DIN Media (Normungsinstitut DIN) – DIN 18252:2018-05, Normseite', url: 'https://www.dinmedia.de/en/standard/din-18252/286575374', art: 'sekundaer', abgerufen: '2026-10-25' },
  { id: 'q3', titel: 'DIN Media (Normungsinstitut DIN) – DIN EN 1303:2026-08, Normseite', url: 'https://www.dinmedia.de/de/norm/din-en-1303/401073981', art: 'sekundaer', abgerufen: '2026-10-25' },
  { id: 'q4', titel: 'DIN Media (Normungsinstitut DIN) – DIN EN 1303:2015-08, Normseite (zurückgezogen)', url: 'https://www.dinmedia.de/en/standard/din-en-1303/225357321', art: 'sekundaer', abgerufen: '2026-10-25' },
  { id: 'q5', titel: 'Baunetzwissen – Fachglossar, Stichwort Sicherungskarte', url: 'https://www.baunetzwissen.de/glossar/s/sicherungskarte-217167', art: 'sekundaer', abgerufen: '2026-10-25' },
];

export default {
  id: 'norm-zylinder',
  thema: 'Schließzylinder',
  stand: '2026-10-25',
  frage: 'Wie klassifizieren die Normen Profilzylinder (Kennziffern, Bohr- und Ziehschutz), und was bedeutet eine Sicherungskarte rechtlich und praktisch?',
  fakten: {
    aktuell: fakt({ id: 'norm-zylinder.aktuell', text: 'DIN EN 1303 liegt laut Normungsinstitut in der Ausgabe 2026-08 als aktuelle Norm vor und ersetzt die Ausgabe 2015-08.', quelle: 'q3', status: 'verifizieren' }),
    zurueckgezogen: fakt({ id: 'norm-zylinder.zurueckgezogen', text: 'Die Ausgabe DIN EN 1303:2015-08 ist laut Normungsinstitut zurückgezogen.', quelle: 'q4', status: 'verifizieren' }),
    din18252: fakt({ id: 'norm-zylinder.din18252', text: 'DIN 18252 ist laut Normungsinstitut in der Ausgabe 2018-05 aktuell und ersetzt die Ausgabe 2006-12.', quelle: 'q2', status: 'verifizieren' }),
    gleichlautend: fakt({ id: 'norm-zylinder.gleichlautend', text: 'Nach Polizeiangaben beschreibt DIN 18252 vom Mai 2018 die Sicherheitseigenschaften von Profilzylindern gleichlautend mit DIN EN 1303.', quelle: 'q1', status: 'verifizieren' }),
    bohrschutz: fakt({ id: 'norm-zylinder.bohrschutz', text: 'Profilzylinder müssen nach Polizeiangaben mindestens durch einen Bohrschutz gegen mechanische Angriffe geschützt sein.', quelle: 'q1', status: 'verifizieren' }),
    achtstellig: fakt({ id: 'norm-zylinder.achtstellig', text: 'Die Klassifizierung nach DIN EN 1303 erfolgt nach Polizeiangaben in einem achtstelligen Schlüssel, dessen letzte Stelle den Angriffswiderstand beschreibt.', quelle: 'q1', status: 'verifizieren' }),
    stelle0: fakt({ id: 'norm-zylinder.stelle0', text: 'Die Angriffswiderstandsklasse 0 ist nach Polizeiangaben ungeeignet, wenn Anforderungen an den Einbruchschutz bestehen.', quelle: 'q1', status: 'verifizieren' }),
    klassen: fakt({ id: 'norm-zylinder.klassen', text: 'Die Klasse A steht nach Polizeiangaben für die erste Sicherheitsklasse ohne Ziehschutz, B für die höhere Klasse ohne Ziehschutz, C für die erste Klasse mit Ziehschutz und D für die höhere Klasse mit Ziehschutz.', quelle: 'q1', status: 'verifizieren' }),
    empfehlung: fakt({ id: 'norm-zylinder.empfehlung', text: 'Empfohlen werden nach Polizeiangaben die Klassen A bzw. B und mit Ziehschutz die Klassen C bzw. D, wobei B und D jeweils die höhere Klasse sind.', quelle: 'q1', status: 'verifizieren' }),
    altzuordnung: fakt({ id: 'norm-zylinder.altzuordnung', text: 'Nach Polizeiangaben entsprechen A und C der alten Angriffswiderstandsklasse 1, B und D der alten Klasse 2.', quelle: 'q1', status: 'verifizieren' }),
    'bs-bz': fakt({ id: 'norm-zylinder.bs-bz', text: 'In der alten Kennzeichnung steht BS für Bohrschutz und BZ für Bohrschutz mit Ziehschutz.', quelle: 'q1', status: 'verifizieren' }),
    schutzbeschlag: fakt({ id: 'norm-zylinder.schutzbeschlag', text: 'Der Grundschutz eines Profilzylinders soll nach Polizeiangaben durch einen Schutzbeschlag nach DIN 18257 ergänzt werden, mindestens der Klasse ES 1 mit Zylinderabdeckung.', quelle: 'q1', status: 'verifizieren' }),
    'sk-schutz': fakt({ id: 'norm-zylinder.sk-schutz', text: 'Eine Sicherungskarte schützt laut Fachglossar vor unbefugtem Kopieren von Schlüsseln.', quelle: 'q5', status: 'verifizieren' }),
    'sk-nachfertigung': fakt({ id: 'norm-zylinder.sk-nachfertigung', text: 'Schlüssel lassen sich laut Fachglossar nur zusammen mit der Sicherungskarte beim Hersteller oder bei autorisierten Händlern nachfertigen.', quelle: 'q5', status: 'verifizieren' }),
  },
  offen: [
    'Die Bedeutung der Stellen 1 bis 7 des achtstelligen Schlüssels (Nutzungsklasse, Dauerhaftigkeit, Brandschutz, Korrosion, Schließsicherheit, Temperatur) ist nicht belegt. Suchtreffer nannten Stufenzahlen; der Normtext wurde nicht geprüft.',
    'Zur rechtlichen Bedeutung der Sicherungskarte (Vertragsbindung, Eigentumsnachweis, Haftung) wurde weder eine Norm noch ein Gesetz gefunden. Die Blattfrage „rechtlich“ ist deshalb offen. Herstellerseiten wurden nicht als Quelle genutzt.',
    'Die Gleichlautung von DIN 18252 und DIN EN 1303 bezieht sich in der Polizeiquelle auf die Ausgaben 2018 und 2015. Ob die Ausgabe 2026-08 noch gleichlautend ist, ist nicht geprüft.',
    'Die Prüfverfahren für Bohr- und Ziehschutz (Werkzeuge, Zeiten, Angriffsarten) sind nicht belegt; die Normseiten enthalten keine Prüfangaben.',
    'Die Suchtreffer zu DIN EN 1303:2026-08 widersprachen sich (eine Trefferseite: Vorbestellung). Die Detailseite zeigt „AKTUELL“; diese Angabe gilt für den Stand 2026-10-25.',
    'Mechatronische Schließzylinder (DIN EN 15684) sind nicht Gegenstand dieses Blattes und wurden nicht geprüft.',
  ],
};
