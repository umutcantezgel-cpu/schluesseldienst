// Faktenblatt notrufnummern: Notrufnummern. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [
  { id: 'q1', titel: 'Polizei Hessen – Seite „Notruf 110 und 112“ (ohne Stand-Datum)', url: 'https://www.polizei.hessen.de/service/notruf', art: 'primaer', abgerufen: '2026-10-25' },
  { id: 'q2', titel: 'Polizei Hessen – Seite „Hilfe im Notfall“ (ohne Stand-Datum)', url: 'https://www.polizei.hessen.de/praevention/beratung-hilfe-und-unterstuetzung/sicher-im-urlaub/auf-der-reise/hilfe-im-notfall', art: 'primaer', abgerufen: '2026-10-25' },
  { id: 'q3', titel: 'Bundesnetzagentur – Seite „Notruf“ (Stand 22.08.2018, laut Seite nicht auf dem aktuellen Stand)', url: 'https://bundesnetzagentur.de/DE/Fachthemen/Telekommunikation/Unternehmenspflichten/Notruf/start.html', art: 'primaer', abgerufen: '2026-10-25' },
];

export default {
  id: 'notrufnummern',
  thema: 'Notrufnummern',
  stand: '2026-10-25',
  frage: 'Welche Notrufnummern gelten für Polizei sowie Feuerwehr und Rettungsdienst, und wann ruft man welche?',
  fakten: {
    'vorwahl': fakt({ id: 'notrufnummern.vorwahl', text: 'Die Notrufnummern 110 und 112 können überall ohne Vorwahl gewählt werden.', quelle: 'q1', status: 'verifizieren' }),
    'polizei-110': fakt({ id: 'notrufnummern.polizei-110', text: 'Die Notrufnummer 110 führt im Notfall zur nächsten Polizeidienststelle.', quelle: 'q2', status: 'verifizieren' }),
    'feuerwehr-112': fakt({ id: 'notrufnummern.feuerwehr-112', text: 'Im Brandfall wählt man die Notrufnummer 112 der Feuerwehr.', quelle: 'q2', status: 'verifizieren' }),
    'rettungsdienst-112': fakt({ id: 'notrufnummern.rettungsdienst-112', text: 'Unter der Notrufnummer 112 kann auch der Rettungsdienst verständigt werden.', quelle: 'q2', status: 'verifizieren' }),
    'leitstelle': fakt({ id: 'notrufnummern.leitstelle', text: 'Die Notrufnummern führen in der Regel zur örtlich zuständigen Leitstelle der Polizei oder der Feuerwehr.', quelle: 'q1', status: 'verifizieren' }),
    'bnetza-umwandlung': fakt({ id: 'notrufnummern.bnetza-umwandlung', text: 'Telefondiensteanbieter wandeln die Kurzwahlnummern 110 und 112 laut Bundesnetzagentur in den Notrufanschluss der örtlich zuständigen Notrufabfragestelle um.', quelle: 'q3', status: 'verifizieren' }),
  },
  offen: [
    'Wann man welche Nummer wählt, ist nur teilweise belegt. Die Behördenseiten nennen Brand (112) und den allgemeinen Notfall (110). Eine Zuordnung nach Notfallarten, etwa Unfall, Gewalt oder medizinischer Notfall, fehlt in den abgerufenen Seiten. Eine Aussage zu gesundheitlichen Notfällen aus einer Mitteilung des Gesundheitsministeriums ist älter und nicht abgerufen; nicht übernommen.',
    'Rettungsdienst über 112: Die Seite „Notruf“ nennt nur die Feuerwehr. Die Seite „Hilfe im Notfall“ nennt zusätzlich den Rettungsdienst, deshalb stützt sich der Fakt auf diese Seite. Ein Abgleich mit dem Innenministerium Hessen, das im Prüfauftrag als Quelle genannt ist, steht aus. Eine Seite des Innenressorts habe ich nicht gefunden.',
    'Die Bundesnetzagentur-Seite ist laut eigener Angabe nicht aktuell (Stand 22.08.2018). Sie nennt als Rechtsgrundlage § 108 TKG in der Fassung von 2004. Laut einer Rechtsdatenbank (sekundär) ist die Vorschrift inzwischen § 164 TKG. Die Rechtsgrundlage ist deshalb nicht als aktuell übernommen; der Fakt zur Umwandlung ist mit dem Stand 2018 gekennzeichnet.',
    'Notfall-Telefax und Notruf-App („nora“) sind in Suchtreffern genannt, auf den Behördenseiten nicht bestätigt bzw. nicht abgerufen. Nicht aufgenommen.',
  ],
};
