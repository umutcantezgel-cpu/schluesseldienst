// Ratgeber-Artikel: RC-Widerstandsklassen. Eigene Texte nach Themenpass (Kern: Klassen in Alltagssprache mit
// Stufengrafik und der Frage, wann welche Klasse sinnvoll ist). Alle Klassen, Zahlen und Verweise auf Normen
// stammen aus norm-rc-klassen und norm-verglasung; Prüfwerkzeuge und Prüfzeiten sind nicht belegt und fehlen bewusst.
import rc from '../fakten/norm-rc-klassen.mjs';
import vg from '../fakten/norm-verglasung.mjs';

export default {
  titel: 'RC-Widerstandsklassen einfach erklärt',
  beschreibung: 'Was die RC-Widerstandsklassen für Türen und Fenster bedeuten, welche Klasse wofür passt und warum der fachgerechte Einbau dazugehört.',
  kategorie: 'technik',
  kurztitel: 'RC-Klassen',
  h1: 'Was die RC-Widerstandsklassen bedeuten',
  kurz: [
    'Die RC-Klasse zeigt, wie stark eine Tür oder ein Fenster gegen Einbruch geprüft ist. ',
    rc.fakten['tueren-empfehlung'],
    ' ',
    vg.fakten['n-eingeschraenkt'],
  ],
  stand: '2026-10-25',
  figur: 'stufen',
  figurText: 'Drei Stufen steigenden Widerstands, verankert im Boden: Jede Stufe zählt nur mit fachgerechtem Einbau.',
  wichtig: [
    'Lesen Sie eine **Klasse** immer zusammen mit dem Bauteil, für das sie gilt.',
    ['Für **Fenster** gilt: ', rc.fakten.empfehlung],
    'Eine gute Klasse nützt wenig ohne fachgerechten **Einbau**.',
  ],
  abschnitte: [
    {
      titel: 'Was eine Klasse misst',
      absaetze: [
        ['Die Klassen stammen aus einer Norm für einbruchhemmende Türen und Fenster. ', rc.fakten.ausgabe],
        'Je höher die Klasse, desto höher der geprüfte Widerstand. Welches Werkzeug und welche Zeit je Klasse gelten, zeigen wir hier nicht. Diese Angaben finden Sie im Normtext oder beim Hersteller.',
      ],
      liste: [
        'Welches Bauteil ist gemeint, Tür oder Fenster?',
        'Welche Ausgabe der Norm nennt das Angebot?',
        'Steht die Klasse vollständig im Angebot, und ist das Glas dabei?',
      ],
    },
    {
      titel: 'Die Klassen im Überblick',
      absaetze: [
        [rc.fakten['tueren-klassen']],
        [rc.fakten['unter-rc2'], ' ', rc.fakten['gleiche-bezeichnung']],
        'Die Angaben in diesem Abschnitt beruhen auf Polizeiinformationen und auf den genannten Normausgaben. Bei Angeboten lohnt sich deshalb der Blick auf die Ausgabe, die dort genannt wird.',
      ],
      hinweis: { art: 'info', text: ['Auf älteren Angeboten steht manchmal die frühere Vornorm. ', rc.fakten.vornorm] },
    },
    {
      titel: 'Welche Klasse wofür',
      absaetze: [
        ['Bei erhöhtem Einbau, etwa ab der ersten Etage, sieht die Lage anders aus. ', rc.fakten.grundsicherung, ' ', rc.fakten['ohne-werkzeug'], ' Wer ein Fenster in höherer Lage einbauen lässt, sollte die Klasse deshalb gezielt abfragen.'],
        ['Beim Fenster gehört das Glas zur Klasse. ', vg.fakten.isolierverglasung, ' ', vg.fakten['p4a-nachruestung']],
        'Vergleichen Sie Angebote immer nach der genannten Klasse und danach, ob das Glas dazugehört.',
      ],
      liste: [
        'Wohnungstür: die Empfehlung für Türen beachten.',
        'Fenster im Erdgeschoss: Klasse und Glas gemeinsam prüfen.',
        'Fenster ab der ersten Etage: den erhöhten Einbau bei der Wahl berücksichtigen.',
      ],
      hinweis: { art: 'info', text: 'Eine Klasse ist ein Maßstab, kein Versprechen für jeden Einbruchsversuch.' },
    },
    {
      titel: 'Nur mit geprüftem Einbau',
      absaetze: [
        ['Eine Klasse beschreibt ein geprüftes Bauteil, kein einzelnes Teil. ', vg.fakten['nur-glas']],
        'Ob Tür oder Fenster fachgerecht eingebaut sind, prüft ein Fachbetrieb. Fragen Sie nach dem Nachweis zur Klasse und zum Einbau.',
        'Lassen Sie sich nach dem Einbau bestätigen, welche Klasse das Bauteil erreicht. So haben Sie den Nachweis, falls Sie ihn später brauchen.',
      ],
      liste: [
        'Rahmen und Anschluss an die Wand.',
        'Verankerung und Beschläge.',
        'Glas und Dichtungen, soweit vorhanden.',
      ],
      hinweis: { art: 'info', text: 'Eine Klasse im Angebot ist nur so aussagekräftig wie der Nachweis dazu.' },
    },
  ],
  faq: [
    { frage: 'Welche Widerstandsklasse empfehlen Polizei-Beratungsstellen für Wohnungen?', antwort: ['Das gilt für Türen, also auch für Wohnungstüren. ', rc.fakten['tueren-empfehlung']] },
    { frage: 'Was ist der Unterschied zwischen den unteren Klassen?', antwort: [vg.fakten['n-verzicht'], ' ', vg.fakten['rc1-glas'], ' Der Unterschied liegt also vor allem im Glas.'] },
    { frage: 'Gibt es Widerstandsklassen auch für Fenster?', antwort: [rc.fakten['sechs-klassen-fenster'], ' ', rc.fakten.empfehlung] },
  ],
  weiter: [
    { pfad: '/einbau-tresore/sicherheitstueren/', titel: 'Sicherheitstüren', text: 'Einbruchhemmende Wohnungs- und Haustüren nach Widerstandsklasse einbauen.' },
    { pfad: '/einbau-tresore/sicherheitsfenster/', titel: 'Sicherheitsfenster', text: 'Einbruchhemmende Fenster einbauen oder bestehende Fenster nachrüsten.' },
    { pfad: '/ratgeber/tresor-kaufen-widerstandsgrade/', titel: 'Tresor kaufen', text: 'Widerstandsgrade einfach erklärt.' },
  ],
};
