// Leistungsseite Möbeltresore (V03, Muster: notoeffnung/tueroeffnung.mjs) – eigene Texte nach Themenpass
// /einbau-tresore/moebeltresore/. Keine Zahlen, Normen oder Preise ohne Faktenblatt; keine Zusagen außerhalb der Konfiguration (K-010).
export default {
  titel: 'Möbeltresor einbauen und verankern lassen in Weilburg',
  beschreibung: 'Kleiner Tresor für Schrank oder Regal: Welches Schloss passt, was ein Möbeltresor schützt und warum er in Wand oder Boden verankert werden sollte.',
  h1: 'Möbeltresor einbauen und verankern in Weilburg und Umgebung',
  kurz: 'Ein Möbeltresor schützt vor Gelegenheit, nicht vor Werkzeug. Deshalb besprechen wir mit Ihnen, welches Schloss zu Ihrem Gebrauch passt und wie der Tresor in Wand oder Boden verankert wird.',
  figurText: 'Die hervorgehobene Stufe links zeigt einen kleinen Möbeltresor, noch ohne Verankerung.',
  blick: [
    { titel: 'Schutz', text: 'vor Gelegenheit, nicht vor Werkzeug' },
    { titel: 'Schloss', text: 'Elektronik oder Schlüssel, je nach Modell' },
    { titel: 'Notfall', text: 'Notstrom oder Notschlüssel vorher klären' },
    { titel: 'Befestigung', text: 'Verankerung in Wand oder Boden' },
  ],
  abschnitte: [
    {
      titel: 'Wofür ein Möbeltresor reicht',
      absaetze: [
        'Ein Möbeltresor ist für Schmuck, Papiere und kleinere Werte gedacht, die griffbereit bleiben sollen. Er schützt vor Gelegenheit: Wer spontan etwas mitnehmen will, hat es schwerer.',
        'Gegen einen Angreifer mit Werkzeug und Zeit ist er nicht ausgelegt. Für höhere Werte lohnt sich der Blick auf [Wertschutzschränke](/einbau-tresore/wertschutzschraenke/).',
      ],
    },
    {
      titel: 'Elektronik- oder Schlüsselschloss',
      absaetze: [
        'Ein Elektronikschloss öffnet sich über einen Code, je nach Modell auch über einen Chip. Ein Schlüsselschloss braucht keinen Strom, dafür einen Schlüssel, den Sie sicher verwahren.',
        'Welches Schloss passt, hängt davon ab, wer den Tresor öffnen soll und wie oft. Das besprechen wir vorher mit Ihnen.',
      ],
    },
    {
      titel: 'Notschlüssel und Notstrom',
      absaetze: [
        'Ein Elektronikschloss braucht Strom. Ist die Batterie leer und gibt es keinen Notstrom und keinen Notschlüssel, kann sich der Tresor nicht öffnen lassen.',
        'Ob das Modell einen Notschlüssel oder einen Anschluss für Notstrom hat, steht in seiner Beschreibung. Prüfen Sie das vor dem Kauf und bewahren Sie den Notschlüssel getrennt vom Schrank auf. Bleibt nur die Öffnung, steht der Weg unter [Tresoröffnung](/notoeffnung/tresoroeffnung/).',
      ],
    },
    {
      titel: 'Verankerung in Wand oder Boden',
      absaetze: [
        'Ein Möbeltresor, den man einfach tragen kann, ist leicht mitzunehmen. Die Verankerung in Wand oder Boden erschwert das.',
        'Deshalb raten wir, jeden Möbeltresor zu verankern. Welche Befestigung passt, hängt vom Untergrund ab, etwa Beton, Mauerwerk oder Holzboden. Das klären wir vor Ort.',
      ],
    },
  ],
  faq: [
    { frage: 'Reicht ein Möbeltresor für Schmuck und Bargeld?', antwort: 'Für Schmuck und kleinere Bargeldbeträge kann er reichen, besonders wenn er verankert ist. Gegen einen Angreifer mit Werkzeug ist er nicht gedacht. Für höhere Werte lesen Sie unter [Wertschutzschränke](/einbau-tresore/wertschutzschraenke/) weiter.' },
    { frage: 'Was mache ich, wenn die Batterie des Elektronikschlosses leer ist?', antwort: 'Dann hilft nur ein Notschlüssel oder ein Anschluss für Notstrom, sofern das Modell einen davon hat. Fehlt beides, bleibt die Öffnung. Wie sie abläuft, steht unter [Tresoröffnung](/notoeffnung/tresoroeffnung/).' },
    { frage: 'Warum muss ein kleiner Tresor verankert werden?', antwort: 'Ein Tresor, der sich ganz wegtragen lässt, ist leicht mitzunehmen. Dann hilft das Schloss nicht mehr. Die Verankerung erschwert das, deshalb raten wir in jedem Fall dazu.' },
  ],
  weiter: [
    { pfad: '/einbau-tresore/wertschutzschraenke/', titel: 'Wertschutzschränke', text: 'Für höhere Werte, nach Widerstandsgrad.' },
    { pfad: '/notoeffnung/tresoroeffnung/', titel: 'Tresoröffnung', text: 'Wenn Code oder Schloss nicht mehr funktionieren.' },
    { pfad: '/ratgeber/tresor-kaufen-widerstandsgrade/', titel: 'Widerstandsgrade', text: 'Kaufkriterien für Tresore, einfach erklärt.' },
  ],
};
