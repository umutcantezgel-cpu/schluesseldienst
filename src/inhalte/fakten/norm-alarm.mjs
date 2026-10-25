// Faktenblatt norm-alarm: Einbruchmeldeanlagen. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [
  { id: 'q1', titel: 'DIN Media (Normungsinstitut DIN) – DIN EN 50131-1:2021-07, Normseite', url: 'https://www.dinmedia.de/en/standard/din-en-50131-1/335664444', art: 'sekundaer', abgerufen: '2026-10-25' },
  { id: 'q2', titel: 'Polizeiliche Kriminalprävention (k-einbruch.de) – Seite „Alarmanlagen“ (ohne Stand-Datum)', url: 'https://www.k-einbruch.de/sicherheitstipps/alarmanlagen/', art: 'sekundaer', abgerufen: '2026-10-25' },
  { id: 'q3', titel: 'Merkblatt „Einbruchmeldeanlagen nach DIN EN 50131 und VdS“ (BHE, Stiftung DFK, Polizeiliche Kriminalprävention; Stand 10.06.2026)', url: 'https://www.kriminalpraevention.de/files/DFK/bilder/einbruchschutz/Infopapier_EMA%20EN%2BVdS_06_2026_CDR.pdf', art: 'sekundaer', abgerufen: '2026-10-25' },
];

export default {
  id: 'norm-alarm',
  thema: 'Einbruchmeldeanlagen',
  stand: '2026-10-25',
  frage: 'Welche Grade unterscheidet die Norm für Einbruch- und Überfallmeldeanlagen, und welche Planungsnorm gilt in Deutschland?',
  fakten: {
    'ausgabe': fakt({ id: 'norm-alarm.ausgabe', text: 'DIN EN 50131-1 liegt laut Normungsinstitut in der Ausgabe 2021-07 als aktuelle Fassung vor und ersetzt die Ausgabe 2017-12.', quelle: 'q1', status: 'verifizieren' }),
    'titel': fakt({ id: 'norm-alarm.titel', text: 'DIN EN 50131-1 trägt im Deutschen den Titel „Alarmanlagen – Einbruch- und Überfallmeldeanlagen – Teil 1: Systemanforderungen“.', quelle: 'q1', status: 'verifizieren' }),
    'grade-anzahl': fakt({ id: 'norm-alarm.grade-anzahl', text: 'Die Normung sieht nach Angaben der Polizeilichen Kriminalprävention insgesamt vier Grade für Einbruchmeldeanlagen vor.', quelle: 'q2', status: 'verifizieren' }),
    'grade-normenreihen': fakt({ id: 'norm-alarm.grade-normenreihen', text: 'Die Einteilung nach Graden findet sich nach Angaben der Polizeilichen Kriminalprävention insbesondere in den Normenreihen DIN EN 50130, DIN EN 50131, DIN EN 50136 und DIN VDE 0833, Teile 1 und 3.', quelle: 'q2', status: 'verifizieren' }),
    'grade-empfehlung': fakt({ id: 'norm-alarm.grade-empfehlung', text: 'Nach Angaben der Polizeilichen Kriminalprävention empfiehlt die Polizei nur die Grade 2, 3 und 4.', quelle: 'q2', status: 'verifizieren' }),
    'grade-1': fakt({ id: 'norm-alarm.grade-1', text: 'Grad 1 liegt nach Angaben der Polizeilichen Kriminalprävention unterhalb der polizeilichen Anforderungen und wird deshalb nicht empfohlen.', quelle: 'q2', status: 'verifizieren' }),
    'planung-0833-3': fakt({ id: 'norm-alarm.planung-0833-3', text: 'DIN VDE 0833-3 beschreibt nach dem Merkblatt von BHE, Stiftung DFK und Polizeilicher Kriminalprävention zusätzliche Anforderungen an Einbruch- und Überfallmeldeanlagen.', quelle: 'q3', status: 'verifizieren' }),
    'system-0833-3': fakt({ id: 'norm-alarm.system-0833-3', text: 'Nach demselben Merkblatt fordert DIN VDE 0833-3, dass alle Anlagenteile der Normenreihe DIN EN 50131 entsprechen und funktionsmäßig als System abgestimmt sind.', quelle: 'q3', status: 'verifizieren' }),
  },
  offen: [
    'Welche Planungsnorm in Deutschland gilt, ist nicht belegt. Das Merkblatt nennt DIN VDE 0833-3 nur als Zusatzanforderungen. Planung und Einbau von EMA regelt nach dem Merkblatt die VdS-Richtlinie 2311; das ist eine Richtlinie, kein Normtext. Der Normtext ist kostenpflichtig und war nicht einsehbar.',
    'Inhalt der Grade 1 bis 4 (Überwindungssicherheit, Ansprechempfindlichkeit, Täterbild, Werkzeuge, Prüfbedingungen) ist nicht belegt. Die Normseite DIN EN 50131-1 nennt keine Grade, nur Metadaten.',
    'Klassen A, B und C: Die Polizeiseite ordnet Klasse A dem Grad 2 zu, Klasse B dem Grad 3 und Klasse C dem Grad 4, jeweils mit Empfehlungen. Diese Zuordnung ist nicht als Fakt übernommen. Eine ältere VdS-Tabelle (2013, auf DIN VDE 0833-3:2009-06 gestützt) ist veraltet und nicht übernommen.',
    'Ein Ratgeber eines Kameraherstellers zu Grad 2 für Privathaushalte ist ein Herstellertext und nicht übernommen.',
    'Die übrigen Teile der Normenreihe DIN EN 50131 (Geräte wie Melder und Zentralen) sind nicht geprüft; das Merkblatt beschreibt sie nur allgemein.',
    'Die Seite k-einbruch.de nennt kein Stand-Datum. Der Abruf ist vom 2026-10-25.',
  ],
};
