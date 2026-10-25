// Zonen ab dem Sitz Weilburg (Luftlinie). Radien und Leistungen sind ANNAHMEN,
// bis der Mensch sie bestätigt (MENSCHEN.md §2). Texte ohne Minuten- oder Vor-Ort-Behauptungen.
// satz: {ort}, {km}, {richtung} = Lage des Ortes VON Weilburg aus; Mini-Syntax für Links erlaubt.
// Zusagen (Preis vorab) stehen nicht hier, sondern laufen über teile/zusage.mjs.
import { platzhalter as p } from '../../bau/lib/platzhalter.mjs';

export default {
  sitzKreis: 'Landkreis Limburg-Weilburg',
  stufen: [
    {
      id: 'A', titel: 'Kerngebiet', kurz: 'Kerngebiet ab Weilburg', bisKm: 20, auchKreis: true, notoeffnung: 'ja', indexierung: true,
      leistungenBestaetigt: p('zonen.a.leistungen', 'Leistungen in Zone A bestätigen'),
      satz: '{ort} liegt rund {km} km {richtung} von Weilburg und gehört zu unserem Kerngebiet.',
    },
    {
      id: 'B', titel: 'Umland', kurz: 'Umland – mit Anfahrt', bisKm: 50, notoeffnung: 'ja', indexierung: true,
      leistungenBestaetigt: p('zonen.b.leistungen', 'Leistungen in Zone B bestätigen'),
      satz: '{ort} liegt rund {km} km {richtung} von Weilburg im Umland unseres Betriebs. Rechnen Sie mit einer längeren Anfahrt als im Kerngebiet.',
    },
    {
      id: 'C', titel: 'Region', kurz: 'Region – nach Absprache', bisKm: 100, notoeffnung: 'nach-absprache', indexierung: true,
      leistungenBestaetigt: p('zonen.c.leistungen', 'Leistungen in Zone C bestätigen'),
      satz: '{ort} liegt rund {km} km {richtung} von Weilburg, wo unser Betrieb sitzt. Planbare Arbeiten wie Schlosstausch, Einbruchschutz oder Tresormontage übernehmen wir nach Absprache.',
    },
    {
      id: 'D', titel: 'Überregional', kurz: 'Überregional – nach Absprache', bisKm: Infinity, notoeffnung: 'nach-absprache', indexierung: true,
      leistungenBestaetigt: p('zonen.d.leistungen', 'Leistungen in Zone D bestätigen'),
      satz: '{ort} liegt rund {km} km {richtung} von Weilburg in Hessen, wo unser Betrieb sitzt. Für eine Notöffnung ist ein Betrieb, der näher an {ort} sitzt, meist schneller – woran Sie einen seriösen erkennen, steht im [Ratgeber](/ratgeber/schluesseldienst-abzocke-erkennen/). Planbare Leistungen übernehmen wir nach Absprache.',
    },
  ],
  // Niederlande: immer Regeln wie Zone D, keine Preise (Umsatzsteuer offen, MENSCHEN.md §2).
  nl: { wieZone: 'D', preise: false, landesregel: false, titel: 'Niederlande', kurz: 'Niederlande – nach Absprache' },
};
