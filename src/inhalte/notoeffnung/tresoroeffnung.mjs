// Leistungsseite Tresoröffnung (V03, Detailseite) – eigene Texte nach Themenpass /notoeffnung/tresoroeffnung/
// (src/konfig/themenpaesse.mjs). Blickwinkel: Reihenfolge zerstörungsfrei zuerst, Eigentumsnachweis, Zustand danach.
// Keine Zahlen, Normen, Schutzklassen-Stufen oder Zeitangaben im Text (K-010); Preis nur nach Absprache.
export default {
  titel: 'Tresoröffnung in Weilburg: Code vergessen, Tresor zu',
  beschreibung: 'Tresor geht nicht auf, Code vergessen oder Schloss defekt? Wir beginnen in Weilburg zerstörungsfrei, verlangen einen Nachweis und sagen, was danach gilt.',
  h1: 'Tresoröffnung: zerstörungsfrei zuerst, Nachweis vorab',
  kurz: 'Wir beginnen mit Methoden, die den Tresor möglichst schonen, und gehen erst dann zu aufwendigeren Wegen über. Vorab klären wir Ihren Eigentumsnachweis und was mit dem Inhalt geschieht.',
  figurText: 'Tür, Auto, Garage und Tresor nebeneinander; hervorgehoben ist der Tresor.',
  blick: [
    { titel: 'Zerstörungsfrei', text: 'zuerst, solange der Tresor es zulässt' },
    { titel: 'Nachweis', text: 'Beleg, dass der Tresor Ihnen gehört' },
    { titel: 'Diskretion', text: 'Ort und Ablauf besprechen wir vorab' },
    { titel: 'Preis', text: 'hängt vom Aufwand und vom Tresor ab' },
  ],
  abschnitte: [
    {
      titel: 'Ursachen: Code vergessen, Elektronik leer, Schloss defekt',
      absaetze: [
        'Typische Gründe sind ein vergessener Code, eine leere Batterie in der Elektronik oder ein defektes Schloss. Welcher Fall vorliegt, zeigt sich erst am Tresor.',
        'Ein Tresor, der piept, aber nicht öffnet, hat nicht immer denselben Grund. Ausprobieren auf eigene Faust kann die Elektronik zusätzlich sperren. Ob sich der Tresor überhaupt öffnen lässt, besprechen Sie am besten mit uns.',
        'Welche Widerstandsgrade es gibt und was sie bedeuten, erklärt der Ratgeber unter [Tresor kaufen](/ratgeber/tresor-kaufen-widerstandsgrade/).',
      ],
    },
    {
      titel: 'Zerstörungsfrei zuerst',
      absaetze: [
        'Wir beginnen mit den Methoden, die den Tresor möglichst schonen. Erst wenn sie nicht zum Ziel führen, besprechen wir mit Ihnen, welche Eingriffe möglich sind.',
        'Jeder Schritt, der etwas beschädigen kann, geschieht nur mit Ihrer Zustimmung. Dann wissen Sie vorher, was am Schloss passiert und was danach zu tun ist.',
      ],
    },
    {
      titel: 'Eigentumsnachweis und Diskretion',
      absaetze: [
        'Einen Tresor öffnen wir nur, wenn klar ist, dass er Ihnen gehört. Etwa ein Kaufbeleg oder der Standort in Ihren eigenen Räumen kann das belegen. Im Betrieb brauchen wir die Vollmacht der Geschäftsführung.',
        'Wer bei der Öffnung dabei ist und wo der Tresor steht, besprechen wir vorab mit Ihnen. So bleibt der Einsatz für Ihr Umfeld so ruhig wie möglich.',
      ],
    },
    {
      titel: 'Nach der Öffnung: Schloss erneuern oder Nachfolger',
      absaetze: [
        'Ob der Tresor nach der Öffnung weiter genutzt werden kann, hängt vom Schloss ab. Ist es beschädigt, besprechen wir den Tausch, bevor Sie den Tresor wieder nutzen.',
        'Ist der Tresor selbst für den Inhalt nicht mehr geeignet, kommt ein Nachfolger infrage. Welche Tresore und Schränke es gibt, zeigt der Bereich [Einbau & Tresore](/einbau-tresore/).',
      ],
    },
  ],
  preis: {
    text: 'Der Preis richtet sich nach Aufwand und Schutzklasse und wird vorab besprochen. Die Anfahrt je Zone steht auf der [Preisseite](/preise/).',
    positionen: ['tresor'],
  },
  faq: [
    { frage: 'Der Tresor piept, öffnet aber nicht – woran liegt das?', antwort: 'Ein Piepton zeigt oft an, dass die Elektronik etwas erkannt hat, etwa eine falsche Eingabe oder eine schwache Batterie. Welche Ursache vorliegt, prüfen wir am Tresor.' },
    { frage: 'Wie belege ich, dass mir der Tresor gehört?', antwort: 'Etwa mit einem Kaufbeleg oder dem Standort in Ihren eigenen Räumen. Im Betrieb brauchen wir die Vollmacht der Geschäftsführung.' },
    { frage: 'Ist der Tresor nach der Öffnung noch zu gebrauchen?', antwort: 'Das hängt vom Schloss und vom Zustand des Gehäuses ab. Das sehen wir, wenn der Tresor offen ist, und sagen es Ihnen ehrlich.' },
    { frage: 'Was passiert mit dem Inhalt während der Öffnung?', antwort: 'Wertvolle Dinge sollten Sie möglichst vorher herausnehmen. Was im Tresor liegt, besprechen wir vorab mit Ihnen, bevor wir beginnen.' },
  ],
  weiter: [
    { pfad: '/einbau-tresore/moebeltresore/', titel: 'Möbeltresore', text: 'Kleine Tresore für Schrank und Regal.' },
    { pfad: '/einbau-tresore/wertschutzschraenke/', titel: 'Wertschutzschränke', text: 'Wenn ein größerer Schrank gebraucht wird.' },
    { pfad: '/ratgeber/tresor-kaufen-widerstandsgrade/', titel: 'Tresor kaufen', text: 'Widerstandsgrade einfach erklärt.' },
  ],
};
