// Einsatzgebiet (V05) – eigene Texte nach Themenpass /einsatzgebiet/. Zahlen (Radien, Ortszahlen) kommen aus
// Konfiguration und Daten, nie aus dem Text. Keine Niederlassung außerhalb Weilburgs behaupten.
export default {
  titel: 'Einsatzgebiet: Schlüsseldienst ab Weilburg nach Zonen',
  beschreibung: 'Wohin kommt der Schlüsseldienst aus Weilburg? Ort oder Postleitzahl prüfen, Zonen und Anfahrt verstehen, alle Orte nach Land und Kreis.',
  kicker: 'Einsatzgebiet',
  h1: 'Wie weit unser Weg zu Ihnen ist',
  einleitung: 'Unser Betrieb sitzt in Weilburg an der Lahn. Je näher Ihr Ort liegt, desto kürzer ist unser Weg – und desto mehr können wir kurzfristig übernehmen. Geben Sie Ihren Ort ein und Sie sehen Entfernung und Zone.',
  pruefTitel: 'Ihren Ort prüfen',
  pruefHinweis: 'Ort oder Postleitzahl eingeben – Sie sehen Entfernung ab Weilburg und Zone.',
  karte: {
    titel: 'Ringe um Weilburg',
    text: 'Jeder Punkt steht für Orte in einem Raster von wenigen Kilometern; die Farbe zeigt die engste Zone darin. Die Ringe markieren die Grenzen der Zonen als Luftlinie.',
  },
  zonen: {
    titel: 'Was die Zonen bedeuten',
    einleitung: 'Die Zonen richten sich nach der Luftlinie ab Weilburg. Sie sagen, wie wir arbeiten – nicht, ob wir freundlich sind.',
    notoeffnung: { ja: 'Notöffnung', 'nach-absprache': 'Notöffnung nur nach Absprache' },
    planbar: 'Planbare Arbeiten nach Absprache',
    anfahrt: { A: 'Anfahrt im Gesamtpreis enthalten', B: 'Anfahrtsaufschlag', C: 'Anfahrt nach Absprache', D: 'Anfahrt nach Absprache' },
    orteZeile: 'Orte auf dieser Website',
  },
  laender: {
    titel: 'Alle Orte nach Land und Kreis',
    einleitung: 'Jede Ortsseite nennt Entfernung, Zone und Postleitzahlen. Die Liste ist nach Bundesland geordnet, darunter nach Kreis.',
  },
  faq: [
    { frage: 'Warum unterscheiden Sie zwischen Zonen?', antwort: 'Weil der Weg den Preis und die Planbarkeit bestimmt. Im Kerngebiet können wir kurzfristig kommen; je weiter es ist, desto eher lohnt sich ein Betrieb, der näher sitzt – das sagen wir Ihnen offen.' },
    { frage: 'Kommen Sie auch über die Zone C hinaus?', antwort: 'Für planbare Arbeiten wie Schlosstausch, Einbruchschutz oder Tresormontage nach Absprache. Für eine Notöffnung ist ein Betrieb in kürzerer Entfernung meist schneller.' },
    { frage: 'Mein Ort fehlt in der Liste – was nun?', antwort: 'Geben Sie die Postleitzahl in die Ortsprüfung ein oder fragen Sie uns über die [Kontaktseite](/kontakt/). Die Zone richtet sich allein nach der Entfernung zu Weilburg.' },
  ],
  schluss: {
    titel: 'Ihr Ort fehlt oder Sie sind unsicher?',
    text: 'Fragen Sie kurz nach. Ob wir kommen und mit welcher Anfahrt, klären wir vor jedem Auftrag.',
    link: { text: 'Kontakt aufnehmen', pfad: '/kontakt/' },
  },
};
