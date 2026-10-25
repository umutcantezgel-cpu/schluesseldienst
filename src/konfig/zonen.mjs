// Zonen ab dem Sitz Weilburg (Luftlinie). Radien und Leistungen sind ANNAHMEN,
// bis der Mensch sie bestätigt (MENSCHEN.md §2). Texte ohne Minuten- oder Vor-Ort-Behauptungen.
import { platzhalter as p } from '../../bau/lib/platzhalter.mjs';

export default {
  sitzKreis: 'Landkreis Limburg-Weilburg',
  stufen: [
    {
      id: 'A', titel: 'Kerngebiet', bisKm: 20, auchKreis: true, notoeffnung: 'ja', indexierung: true,
      leistungenBestaetigt: p('zonen.a.leistungen', 'Leistungen in Zone A bestätigen'),
      satz: 'Unser Betrieb in Weilburg liegt rund {km} km {richtung} von {ort}. {ort} gehört zu unserem Kerngebiet.',
    },
    {
      id: 'B', titel: 'Umland', bisKm: 50, notoeffnung: 'ja', indexierung: true,
      leistungenBestaetigt: p('zonen.b.leistungen', 'Leistungen in Zone B bestätigen'),
      satz: 'Wir kommen aus Weilburg, rund {km} km Luftlinie entfernt. Bitte planen Sie die Anfahrt ein; den Gesamtpreis nennen wir Ihnen am Telefon vor dem Auftrag.',
    },
    {
      id: 'C', titel: 'Region', bisKm: 100, notoeffnung: 'nach-absprache', indexierung: true,
      leistungenBestaetigt: p('zonen.c.leistungen', 'Leistungen in Zone C bestätigen'),
      satz: 'Unser Betrieb sitzt in Weilburg, rund {km} km von {ort} entfernt. Planbare Arbeiten wie Schlosstausch, Einbruchschutz oder Tresormontage übernehmen wir nach Absprache.',
    },
    {
      id: 'D', titel: 'Überregional', bisKm: Infinity, notoeffnung: 'nach-absprache', indexierung: true,
      leistungenBestaetigt: p('zonen.d.leistungen', 'Leistungen in Zone D bestätigen'),
      satz: 'Unser Betrieb sitzt in Weilburg (Hessen), rund {km} km von {ort} entfernt. Für eine Notöffnung ist ein Betrieb in Ihrer Nähe meist schneller – woran Sie einen seriösen erkennen, lesen Sie im Ratgeber. Planbare Leistungen übernehmen wir nach Absprache.',
    },
  ],
  // Niederlande: immer Regeln wie Zone D, keine Preise (Umsatzsteuer offen, MENSCHEN.md §2).
  nl: { wieZone: 'D', preise: false, landesregel: false },
};
