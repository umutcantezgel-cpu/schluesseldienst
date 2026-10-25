// Startseite (V01) – eigene Texte. Sie-Anrede, keine Minuten-, Sterne- oder Jahresangaben (KERN K-010).
// Zusagen (Preis vorab, Rechnung) laufen über teile/zusage.mjs und brauchen die Bestätigung des Menschen.
export default {
  titel: 'Schlüsseldienst Weilburg: Türöffnung, Schlösser, Sicherheit',
  beschreibung: 'Schlüsseldienst mit Sitz in Weilburg: Türen öffnen, Schlösser tauschen, Einbruchschutz und Tresore. Preise offen, ehrliche Angaben zum Einsatzgebiet.',
  hero: {
    kicker: 'Schlüsseldienst in Weilburg an der Lahn',
    h1: 'Tür zu? Wir finden die Linie, auf der sie aufgeht.',
    text: 'Ruhig im Ton, präzise im Handwerk, offen im Preis – für Weilburg, den Landkreis Limburg-Weilburg und das Umland.',
    pruefTitel: 'Kommen Sie zu mir?',
    pruefHinweis: 'Ort oder Postleitzahl eingeben – Sie sehen sofort Entfernung und Einsatzzone ab Weilburg.',
    abspielen: 'Ablauf noch einmal ansehen',
  },
  triage: {
    titel: 'Was jetzt hilft',
    einleitung: 'Drei Lagen, in denen Menschen uns am häufigsten anrufen – und was Sie bis dahin tun können.',
    faelle: [
      {
        titel: 'Tür ist ins Schloss gefallen',
        icon: 'tuer',
        schritte: [
          'Nicht mit Karte, Draht oder Werkzeug probieren – das beschädigt oft Schloss und Rahmen.',
          'Ausweis oder Mietvertrag bereitlegen, falls Sie ihn erreichen; sonst kann ein Nachbar oder die Hausverwaltung bestätigen, dass Sie dort wohnen.',
          'Anrufen und sagen, ob die Tür nur zugefallen oder abgeschlossen ist.',
        ],
        link: { text: 'Mehr zur Türöffnung', pfad: '/notoeffnung/tueroeffnung/' },
      },
      {
        titel: 'Schlüssel abgebrochen oder verloren',
        icon: 'schluessel-abgebrochen',
        schritte: [
          'Ein abgebrochenes Reststück nicht weiter drehen oder herausziehen – es verkeilt sich sonst tiefer.',
          'Ist der Schlüssel verloren und mit Adresse auffindbar, den Zylinder tauschen lassen.',
          'Bei Mietwohnungen die Hausverwaltung informieren; oft gehört der Zylinder zur Schließanlage des Hauses.',
        ],
        link: { text: 'Mehr zu Schließzylindern', pfad: '/einbruchschutz/schliesszylinder/' },
      },
      {
        titel: 'Nach einem Einbruch',
        icon: 'einbruchschaden',
        schritte: [
          'Zuerst die Polizei unter 110 rufen und nichts anfassen, bis die Spuren gesichert sind.',
          'Schäden fotografieren und die Versicherung informieren.',
          'Danach Tür und Fenster provisorisch sichern lassen, damit die Wohnung wieder verschlossen ist.',
        ],
        link: { text: 'Mehr zum Einbruchschaden', pfad: '/notoeffnung/einbruchschaden/' },
      },
    ],
  },
  preis: {
    titel: 'Preis vor Arbeit',
    aussage: 'Was eine Öffnung kostet, hängt von drei Dingen ab: ob die Tür nur zugefallen oder abgeschlossen ist, zu welcher Uhrzeit Sie anrufen und wie weit Ihr Ort von Weilburg entfernt ist.',
    zusageJa: 'Den Gesamtpreis mit Anfahrt und Mehrwertsteuer nennen wir Ihnen am Telefon, bevor wir losfahren.',
    zusageNein: 'Fragen Sie am Telefon nach dem Gesamtpreis mit Anfahrt und Mehrwertsteuer.',
    positionen: ['tuer-zugefallen', 'tuer-abgeschlossen', 'auto'],
    link: 'Alle Preise und den Preisrechner ansehen',
  },
  leistungen: {
    titel: 'Leistungen',
    einleitung: 'Vom offenen Schloss bis zur sicheren Tür: vier Bereiche, ein Betrieb.',
  },
  ablauf: {
    titel: 'So läuft eine Türöffnung ab',
    schritte: [
      { titel: 'Anruf', text: 'Sie schildern kurz, welche Tür es ist und wo Sie stehen.' },
      { titel: 'Preis', zusage: 'preisVorAuftrag', ja: 'Sie erfahren den Gesamtpreis, bevor wir losfahren.', nein: 'Wir besprechen Anfahrt und Kosten am Telefon.' },
      { titel: 'Öffnen', text: 'Wir öffnen möglichst ohne Schaden. Muss gebohrt werden, fragen wir vorher.' },
      { titel: 'Rechnung', zusage: 'rechnungMitPositionen', ja: 'Sie erhalten eine Rechnung, auf der jede Position steht.', nein: 'Sie erhalten eine Rechnung über die Leistung.' },
    ],
  },
  gebiet: {
    titel: 'Einsatzgebiet ab Weilburg',
    text: 'Unser Betrieb sitzt in Weilburg. Im Landkreis Limburg-Weilburg und den Orten rundherum ist unser Weg zu Ihnen kurz. Je weiter er wird, desto offener sagen wir Ihnen, ob sich die Anfahrt lohnt.',
    link: 'Alle Orte und Zonen ansehen',
  },
  serioes: {
    titel: 'Seriösen Schlüsseldienst erkennen',
    einleitung: 'Ob Sie uns anrufen oder einen anderen Betrieb: Diese fünf Punkte schützen Sie vor überhöhten Rechnungen.',
    punkte: [
      'Lassen Sie sich den Gesamtpreis vorher nennen – mit Anfahrt, Zuschlägen und Mehrwertsteuer.',
      'Fragen Sie nach Firmenname und Anschrift. Ein echter Betrieb nennt beides ohne Zögern.',
      'Lassen Sie erst öffnen, wenn der Preis klar ist. Im Zweifel holen Sie ein zweites Angebot ein.',
      'Bohren nur nach Rückfrage: Eine zugefallene Tür lässt sich meist ohne Bohren öffnen.',
      'Verlangen Sie eine Rechnung mit allen Positionen und zahlen Sie nicht unter Druck bar.',
    ],
    link: { text: 'Ausführlich im Ratgeber', pfad: '/ratgeber/schluesseldienst-abzocke-erkennen/' },
  },
  faq: {
    titel: 'Häufige Fragen',
    fragen: [
      { frage: 'Was kostet eine Türöffnung?', antwort: 'Das hängt davon ab, ob die Tür nur zugefallen oder abgeschlossen ist, zu welcher Uhrzeit Sie anrufen und wie weit Ihr Ort von Weilburg entfernt ist. Alle Preise stehen auf der [Preisseite](/preise/).' },
      { frage: 'Wie schnell sind Sie da?', antwort: 'Das hängt von der Entfernung zu Weilburg und davon ab, wo wir gerade arbeiten. Wir nennen Ihnen am Telefon eine ehrliche Einschätzung statt einer Werbezahl.' },
      { frage: 'Wird meine Tür beschädigt?', antwort: 'Eine nur zugefallene Tür lässt sich in aller Regel ohne Schaden öffnen. Ist sie abgeschlossen oder steckt ein abgebrochener Schlüssel im Schloss, kann es nötig sein, den Zylinder zu bohren. Das besprechen wir vorher mit Ihnen.' },
      { frage: 'Muss ich nachweisen, dass ich dort wohne?', antwort: 'Ja. Wir öffnen nur, wenn klar ist, dass Sie berechtigt sind – zum Beispiel mit Ausweis und Meldeadresse, Mietvertrag oder der Bestätigung von Nachbarn oder Hausverwaltung. Das schützt Sie und uns.' },
      { frage: 'In welchen Orten sind Sie im Einsatz?', antwort: 'Unser Kerngebiet ist der Landkreis Limburg-Weilburg mit dem Umland. Über die [Ortssuche](/einsatzgebiet/) sehen Sie für jeden Ort die Entfernung ab Weilburg und was wir dort anbieten.' },
      { frage: 'Übernimmt meine Versicherung die Kosten?', antwort: 'Manche Hausrat- oder Haftpflichtversicherungen übernehmen Kosten für den Schlüsseldienst oder einen neuen Zylinder. Prüfen Sie Ihre Police; für die Erstattung brauchen Sie in der Regel eine Rechnung, auf der die Leistung genau beschrieben ist.' },
    ],
  },
};
