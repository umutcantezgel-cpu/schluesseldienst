// Gruppenseite Einbau & Tresore (V02) – eigene Texte nach Themenpass /einbau-tresore/ (src/konfig/themenpaesse.mjs)
// und Szene I-05 „Widerstandsstufen“. Keine Zahlen, Normen, Preise oder Zusagen zum Ablauf (KERN K-010).
export default {
  titel: 'Tresor einbauen lassen in Weilburg: Tür, Fenster, Schrank',
  beschreibung: 'Tresor einbauen lassen aus Weilburg: Möbeltresor, Wertschrank, Sicherheitstür und -fenster. Entscheidend sind fachgerechter Einbau und Verankerung.',
  kicker: 'Leistungsgruppe',
  h1: 'Tresor einbauen lassen – und Tür und Fenster dazu',
  einleitung: 'Eine Tür, ein Fenster oder ein Tresor schützt nur so gut, wie er eingebaut ist. Wer einen Tresor kaufen will, sollte zuerst wissen, welche Stufe er braucht.',
  registerTitel: 'Was wir einbauen und liefern',
  szene: {
    titel: 'Stufe für Stufe mehr Widerstand',
    einleitung: 'Jede Stufe hält mehr aus als die davor – aber nur, wenn der Einbau stimmt. So sieht das Schritt für Schritt aus.',
    schritte: [
      { titel: 'Gelegenheit', text: 'Ein Möbeltresor und einfache Sicherungen bremsen den schnellen Griff. Mehr dazu auf der Seite [Möbeltresore](/einbau-tresore/moebeltresore/).' },
      { titel: 'Werkzeug', text: 'Geprüfte, einbruchhemmende Türen und Fenster halten Werkzeug länger stand. Die Seiten [Sicherheitstüren](/einbau-tresore/sicherheitstueren/) und [Sicherheitsfenster](/einbau-tresore/sicherheitsfenster/) zeigen, worauf es ankommt.' },
      { titel: 'Werte', text: 'Für höhere Werte braucht es einen Wertschutzschrank, dessen Widerstandsgrad zu Ihrer Versicherung passt. Die Bedingungen stehen in Ihrer Police. Mehr dazu bei den [Wertschutzschränken](/einbau-tresore/wertschutzschraenke/).' },
      { titel: 'Verankerung', text: 'Jede Stufe zählt nur mit fachgerechtem Einbau und Verankerung. Ein Schrank, der nicht fest montiert ist, lässt sich leichter mitnehmen.' },
    ],
  },
  abschnitte: [
    {
      titel: 'Aufmaß, Lieferung, Verankerung',
      absaetze: [
        'Ein genaues Aufmaß entscheidet, ob ein Bauteil überhaupt passt. Dazu gehören das Maß der Öffnung, die Anschlüsse an Wand oder Boden und der Weg zum Aufstellort.',
        'Die Lieferung hängt vom Bauteil ab. Was mit dem alten Bauteil geschieht, besprechen wir vorab.',
        'Eine Verankerung gehört bei schweren oder wertvollen Schränken dazu. Welche Befestigung passt, hängt vom Untergrund ab, etwa Beton, Mauerwerk oder Holzboden.',
      ],
    },
    {
      titel: 'Datensicherungs- und Waffenschränke',
      absaetze: [
        'Datensicherungsschränke schützen Datenträger und Akten im Brandfall. Datenträger brauchen dafür einen anderen Schutz als Papier. Mehr dazu auf der Seite [Datensicherungsschränke](/einbau-tresore/datensicherungsschraenke/).',
        'Waffenschränke unterliegen gesetzlichen Vorgaben. Welche Anforderungen in Ihrem Fall gelten, klärt die zuständige Waffenbehörde. Die Rechtsfragen stehen im [Ratgeber zu den Waffenschrank-Vorschriften](/ratgeber/waffenschrank-vorschriften/).',
      ],
    },
  ],
  faq: [
    { frage: 'Liefern Sie den Tresor auch ins Obergeschoss?', antwort: 'Ob und wie ein Schrank ins Obergeschoss kommt, hängt von Gewicht, Treppenhaus und Zugang ab. Das klären wir vorab mit Ihnen.' },
    { frage: 'Nehmen Sie die alte Tür mit?', antwort: 'Was mit der alten Tür oder dem alten Fenster geschieht, besprechen wir vorab. Sagen Sie uns am besten schon beim ersten Kontakt, welches Bauteil ersetzt werden soll.' },
    { frage: 'Wie läuft das Aufmaß ab?', antwort: 'Beim Aufmaß wird die Öffnung genau ausgemessen. Danach ist klar, welches Bauteil passt und wie es befestigt wird.' },
  ],
  weiter: [
    { pfad: '/ratgeber/rc-widerstandsklassen/', titel: 'Widerstandsklassen im Überblick', text: 'Was eine Widerstandsklasse aussagt und wo ihre Grenzen liegen.' },
    { pfad: '/ratgeber/tresor-kaufen-widerstandsgrade/', titel: 'Tresor kaufen: Widerstandsgrade', text: 'Worauf Sie bei Widerstandsgrad, Bauform und Schloss achten.' },
    { pfad: '/einbau-tresore/sicherheitstueren/', titel: 'Sicherheitstüren einbauen', text: 'Warum eine Klasse nur mit fachgerechtem Einbau gilt.' },
  ],
  schluss: {
    titel: 'Welche Stufe brauchen Sie?',
    text: 'Sagen Sie uns, welche Tür, welches Fenster oder welcher Schrank es sein soll. Den Preis besprechen wir nach der Besichtigung. Ein Tresor, der den Code nicht mehr annimmt, ist ein Fall für die [Tresoröffnung](/notoeffnung/tresoroeffnung/).',
    link: { text: 'Kontakt aufnehmen', pfad: '/kontakt/' },
  },
};
