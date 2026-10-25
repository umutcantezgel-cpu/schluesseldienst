// Faktenblatt recht-rauchmelder: Rauchwarnmelderpflicht. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [
  { id: 'q1', titel: 'Hessisches Ministerium für Wirtschaft, Energie, Verkehr und Wohnen – Hessische Bauordnung (HBO) 2018, Druckschrift mit Änderung vom Oktober 2025', url: 'https://wirtschaft.hessen.de/sites/wirtschaft.hessen.de/files/2025-10/hbo_broschuere_stand_oktober_2025-baupaket_i_0.pdf', art: 'primaer', abgerufen: '2026-10-25' },
  { id: 'q2', titel: 'Landesrecht Nordrhein-Westfalen (recht.nrw.de) – Landesbauordnung 2018 (BauO NRW 2018), Fassung gültig ab 01.09.2026', url: 'https://recht.nrw.de/system/files/pdf/state-law-and-regulations/2026/08/02/4c959a/01-09-2026-bauo-nrw-2018-landesbauordnung-2018.pdf', art: 'primaer', abgerufen: '2026-10-25' },
  { id: 'q3', titel: 'Bayerisches Landesrecht (gesetze-bayern.de) – Bayerische Bauordnung (BayBO), Art. 46', url: 'https://www.gesetze-bayern.de/Content/Document/BayBO-46', art: 'primaer', abgerufen: '2026-10-25' },
  { id: 'q4', titel: 'Sächsisches Landesrecht (REVOSax) – Sächsische Bauordnung (SächsBO), § 47, Stand 19.03.2024', url: 'https://www.revosax.sachsen.de/vorschrift/1779-SaechsBO', art: 'primaer', abgerufen: '2026-10-25' },
];

export default {
  id: 'recht-rauchmelder',
  thema: 'Rauchwarnmelderpflicht',
  stand: '2026-10-25',
  frage: 'Welche Pflicht gilt in Hessen und in den übrigen Ländern (Räume, Verpflichtete für Einbau und Betrieb, Fristen)?',
  fakten: {
    'hessen-wohnungen': fakt({ id: 'recht-rauchmelder.hessen-wohnungen', text: 'Nach § 14 Abs. 2 Satz 1 Nr. 1 HBO müssen in Wohnungen Schlafräume und Kinderzimmer sowie Flure, über die Rettungswege von Aufenthaltsräumen führen, jeweils mindestens einen Rauchwarnmelder haben.', quelle: 'q1', status: 'verifizieren' }),
    'hessen-nutzungseinheiten': fakt({ id: 'recht-rauchmelder.hessen-nutzungseinheiten', text: 'Nach § 14 Abs. 2 Satz 1 Nr. 2 HBO gilt die Pflicht in sonstigen Nutzungseinheiten für Aufenthaltsräume, in denen bestimmungsgemäß Personen schlafen, sofern es keine Räume besonderer Art oder Nutzung im Sinne des § 2 Abs. 9 HBO sind.', quelle: 'q1', status: 'verifizieren' }),
    'hessen-funktion': fakt({ id: 'recht-rauchmelder.hessen-funktion', text: 'Nach § 14 Abs. 2 Satz 2 HBO müssen Rauchwarnmelder so eingebaut oder angebracht und betrieben werden, dass Brandrauch frühzeitig erkannt und gemeldet wird.', quelle: 'q1', status: 'verifizieren' }),
    'hessen-betrieb': fakt({ id: 'recht-rauchmelder.hessen-betrieb', text: 'Nach § 14 Abs. 2 Satz 3 HBO liegt die Betriebsbereitschaft in Wohnungen bei den unmittelbaren Besitzerinnen und Besitzern und in sonstigen Nutzungseinheiten bei den Betreiberinnen und Betreibern, sofern die Eigentümerinnen oder Eigentümer diese Pflicht nicht übernommen haben.', quelle: 'q1', status: 'verifizieren' }),
    'hessen-frist': fakt({ id: 'recht-rauchmelder.hessen-frist', text: 'Bestehende sonstige Nutzungseinheiten sind nach § 14 Abs. 2 Satz 4 HBO bis zum 1. Januar 2020 entsprechend auszustatten.', quelle: 'q1', status: 'verifizieren' }),
    'hessen-bussgeld': fakt({ id: 'recht-rauchmelder.hessen-bussgeld', text: 'Nach § 86 Abs. 1 Nr. 2 HBO handelt ordnungswidrig, wer Räume oder Nutzungseinheiten entgegen § 14 Abs. 2 HBO nicht mit den erforderlichen Rauchwarnmeldern ausstattet.', quelle: 'q1', status: 'verifizieren' }),
    'nrw-wohnungen': fakt({ id: 'recht-rauchmelder.nrw-wohnungen', text: 'Nach § 47 Abs. 2 BauO NRW 2018 müssen in Wohnungen Schlafräume und Kinderzimmer sowie Flure, über die Rettungswege von Aufenthaltsräumen führen, jeweils mindestens einen Rauchwarnmelder haben.', quelle: 'q2', status: 'verifizieren' }),
    'nrw-betrieb': fakt({ id: 'recht-rauchmelder.nrw-betrieb', text: 'Nach § 47 Abs. 2 BauO NRW 2018 stellt die unmittelbar besitzhabende Person die Betriebsbereitschaft sicher, es sei denn, die Eigentümerin oder der Eigentümer übernimmt diese Verpflichtung selbst.', quelle: 'q2', status: 'verifizieren' }),
    'bayern-raeume': fakt({ id: 'recht-rauchmelder.bayern-raeume', text: 'Nach Art. 46 Abs. 4 BayBO müssen in Wohnungen Schlafzimmer, Kinderzimmer und Flure, die zu Aufenthaltsräumen führen, jeweils mindestens einen Rauchwarnmelder haben.', quelle: 'q3', status: 'verifizieren' }),
    'bayern-frist': fakt({ id: 'recht-rauchmelder.bayern-frist', text: 'Nach Art. 46 Abs. 4 BayBO mussten bestehende Wohnungen bis zum 31. Dezember 2017 mit Rauchwarnmeldern ausgestattet werden.', quelle: 'q3', status: 'verifizieren' }),
    'bayern-betrieb': fakt({ id: 'recht-rauchmelder.bayern-betrieb', text: 'Nach Art. 46 Abs. 4 BayBO sind für die Betriebsbereitschaft grundsätzlich die unmittelbaren Besitzer zuständig, sofern der Eigentümer diese Pflicht nicht selbst übernimmt.', quelle: 'q3', status: 'verifizieren' }),
    'sachsen-raeume': fakt({ id: 'recht-rauchmelder.sachsen-raeume', text: 'Nach § 47 Abs. 4 SächsBO müssen Aufenthaltsräume, in denen bestimmungsgemäß Personen schlafen, sowie die Flure, die zu diesen Räumen führen, jeweils mindestens einen Rauchwarnmelder haben.', quelle: 'q4', status: 'verifizieren' }),
    'sachsen-ausnahme': fakt({ id: 'recht-rauchmelder.sachsen-ausnahme', text: 'Die Pflicht nach § 47 Abs. 4 SächsBO entfällt, soweit für diese Räume eine automatische Rauchdetektion und angemessene Alarmierung sichergestellt sind.', quelle: 'q4', status: 'verifizieren' }),
    'sachsen-frist': fakt({ id: 'recht-rauchmelder.sachsen-frist', text: 'Eigentümer bereits bestehender Nutzungseinheiten müssen nach § 47 Abs. 4 SächsBO bis zum 31. Dezember 2023 nachrüsten.', quelle: 'q4', status: 'verifizieren' }),
    'sachsen-betrieb': fakt({ id: 'recht-rauchmelder.sachsen-betrieb', text: 'Für die Betriebsbereitschaft nach § 47 Abs. 4 SächsBO sind die unmittelbaren Besitzer zuständig, sofern der Eigentümer diese Pflicht nicht übernimmt.', quelle: 'q4', status: 'verifizieren' }),
  },
  offen: [
    'Hessen: Wer die Rauchwarnmelder einbauen muss, nennt der Wortlaut von § 14 Abs. 2 HBO nicht ausdrücklich. Eine Feuerwehr-Seite nennt den Eigentümer; das ist nicht am Gesetz geprüft.',
    'Hessen: Eine Übergangsfrist für Wohnungen im Bestand steht nicht im Wortlaut der HBO (Fassung Oktober 2025, auch § 87 ohne Rauchwarnmelder-Regel). Sekundärquellen nennen widersprüchliche Stichtage (31.12.2014 bzw. 01.01.2020), nicht belegt.',
    'Hessen: Der Begriff „Räume besonderer Art oder Nutzung“ (§ 2 Abs. 9 HBO) ist nicht ausgeführt; er wurde nicht geprüft.',
    'Hessen: Ob DIN 14676-1 in Hessen als Technische Baubestimmung gilt, ist nicht belegt; die Handlungsempfehlungen des Ministeriums wurden nicht gelesen.',
    'NRW: Eine Frist für Bestandswohnungen steht nicht in § 47 Abs. 2 BauO NRW 2018. Eine Sekundärquelle nennt 31.12.2016 für ältere Wohnungen; nicht am Gesetz geprüft.',
    'Bayern: Der Wortlaut von Art. 46 Abs. 4 BayBO wurde nur als Zusammenfassung der Portalseite gelesen. Die Angaben „Fassung 14.08.2007“ und „Text gilt ab 01.05.2026“ sind von der Seite übernommen, nicht geprüft.',
    'Sachsen: Der Wortlaut von § 47 Abs. 4 SächsBO wurde nur als Zusammenfassung von Seite 1 der Portalseite gelesen (Seite umfasst rund 213.000 Zeichen). Die Frist 31.12.2023 ist deshalb nicht am Volltext bestätigt.',
    'NRW, Bayern, Sachsen: Ob der Einbau dort dem Eigentümer obliegt, ist im gelesenen Wortlaut nicht getrennt geregelt und nicht belegt.',
    'Berlin, Baden-Württemberg, Brandenburg, Bremen, Hamburg, Mecklenburg-Vorpommern, Niedersachsen, Rheinland-Pfalz, Saarland, Sachsen-Anhalt, Schleswig-Holstein, Thüringen: kein amtlich bestätigter Wortlaut in dieser Prüfung. Die Suchtreffer waren veraltet oder widersprüchlich (Rheinland-Pfalz nennt je nach Quelle Absatz 7 oder 8; Berlin nennt Fristen aus älteren Fassungen; Hamburg ohne Treffer). Deshalb nicht übernommen.',
    'Einbauregeln (Position, Abstand, Anzahl je Raum, Wartungsintervalle) und die Normen DIN EN 14604 und DIN 14676-1 gehören zu E4-KUND-03 und sind hier nicht geprüft.',
  ],
};
