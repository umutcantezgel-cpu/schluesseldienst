// Leistungsseite Fenstersicherung (V03) – eigene Texte nach Themenpass /einbruchschutz/fenstersicherung/.
// Blickwinkel: Aufhebeln als Angriff am Beschlag, dann die drei Stufen der Nachrüstung (Beschlag, Griff, Zusatzsicherung).
// Vorsicht laut Pass: gekippt ist offen. Keine Zahlen, Normen oder Preise im Text (Faktenprüfer, K-010).
// Die Kopffigur fällt auf das Gruppenbild Tür-Schichten zurück (kein Eintrag für diese Leistung in der Vorlage): ohne figurText.
export default {
  titel: 'Fenstersicherung nachrüsten: Beschlag, Griff, Zusatzschutz',
  beschreibung: 'Fenster nachrüsten ohne Tausch: Pilzkopf im Beschlag, abschließbare Griffe, Zusatzsicherungen und warum ein gekipptes Fenster offen ist.',
  h1: 'Fenster und Terrassentüren nachrüsten',
  kurz: 'Ein Angriff am Fenster setzt oft am Beschlag an, nicht am Glas. Nachrüsten heißt deshalb, Beschlag, Griff und Zusatzsicherung gemeinsam zu betrachten. Vieles davon geht am vorhandenen Fenster, ohne es zu tauschen.',
  blick: [
    { titel: 'Aufhebeln', text: 'setzt am Beschlag an, nicht am Glas' },
    { titel: 'Pilzkopf', text: 'verriegelt den Flügel an mehreren Stellen' },
    { titel: 'Griff', text: 'abschließbar, hält für sich allein wenig' },
    { titel: 'Gekippt', text: 'ist offen und bietet keinen Verschluss' },
  ],
  abschnitte: [
    {
      titel: 'Wie Fenster angegriffen werden',
      absaetze: [
        'Der schwächste Punkt ist oft nicht das Glas, sondern der Beschlag mit Griff und Verriegelung. Beim Aufhebeln setzt man ein Werkzeug in den Spalt zwischen Flügel und Rahmen. Der Flügel wird so weit gedrückt, dass die Verriegelung nachgibt.',
        'Gegen genau diesen Weg setzt Nachrüsten an. Es geht nicht darum, jedes Fenster unangreifbar zu machen. Es geht darum, den Versuch aufwendiger zu machen.',
      ],
    },
    {
      titel: 'Pilzkopfverriegelung im Beschlag',
      absaetze: [
        'Die Pilzkopfverriegelung hält den Flügel mit pilzförmigen Zapfen an mehreren Stellen im Rahmen. Der Griff allein tut das nicht.',
        'Nicht jedes Fenster lässt sich auf Pilzkopf umrüsten. Profil, Beschlag und Schließstücke müssen dazu passen. Ob es passt, zeigt der Blick aufs Fenster. Neue Fenster mit passendem Beschlag behandelt die Seite [Sicherheitsfenster](/einbau-tresore/sicherheitsfenster/).',
      ],
    },
    {
      titel: 'Abschließbare Griffe',
      absaetze: [
        'Ein abschließbarer Griff lässt sich ohne Schlüssel nicht drehen. Das erschwert, den Flügel von außen zu öffnen.',
        'Der Griff ersetzt aber keine Verriegelung am Rahmen. Er ist ein Baustein, kein Ersatz für den Beschlag.',
      ],
    },
    {
      titel: 'Zusatzsicherungen für Terrassen- und Kellerfenster',
      absaetze: [
        'Terrassentüren und Kellerfenster sind oft leichter zu erreichen als Fenster im Obergeschoss. Dort helfen Zusatzsicherungen wie Riegel oder abschließbare Sperren.',
        'Bei Lichtschächten zählt vor allem, ob jemand an das Fenster herankommt. Eine Abdeckung oder ein Gitter kann den Zugang erschweren. Ob sich das lohnt, hängt vom Ort ab.',
      ],
    },
  ],
  faq: [
    { frage: 'Reicht ein abschließbarer Griff als Einbruchschutz?', antwort: 'Allein meist nicht. Der Griff verhindert, dass sich der Flügel von außen einfach drehen lässt. Gehalten wird der Flügel aber von der Verriegelung im Rahmen. Der Griff gehört deshalb zu einem Gesamtpaket.' },
    { frage: 'Lässt sich mein Fenster auf Pilzkopfzapfen umrüsten?', antwort: 'Das hängt vom Profil, vom vorhandenen Beschlag und von den Schließstücken am Rahmen ab. Manche Fenster lassen sich umrüsten, andere nicht. Eine Prüfung am Fenster zeigt, ob es passt.' },
    { frage: 'Wie sichere ich ein gekipptes Fenster?', antwort: 'Ehrlich gesagt: Ein gekipptes Fenster ist offen. Gesichert ist der Flügel nur, wenn er geschlossen und verriegelt ist. Wer zum Lüften kippt, sollte das Fenster bei Abwesenheit schließen.' },
    { frage: 'Was hilft bei Kellerfenstern und Lichtschächten?', antwort: 'Zuerst zählt, ob jemand überhaupt an das Fenster herankommt. Eine Abdeckung oder ein Gitter kann das erschweren. Danach folgt der Beschlag. Welche Lösung passt, hängt vom Ort ab.' },
  ],
  weiter: [
    { pfad: '/einbau-tresore/sicherheitsfenster/', titel: 'Sicherheitsfenster', text: 'Wenn ein Fenster ohnehin neu eingebaut wird.' },
    { pfad: '/ratgeber/einbruchschutz-haus/', titel: 'Einbruchschutz am Haus', text: 'Welche Stellen am Haus man zuerst ansehen sollte.' },
    { pfad: '/ratgeber/rc-widerstandsklassen/', titel: 'Widerstandsklassen', text: 'Begriffe wie Widerstandsklasse, kurz erklärt.' },
  ],
};
