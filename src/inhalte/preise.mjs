// Preise (V04) – eigene Texte nach Themenpass /preise/. Beträge und Uhrzeiten stehen nur in der Konfiguration
// (src/konfig/preise.mjs); Texte nennen keine Zahlen und keine Beispielrechnungen mit erfundenen Beträgen.
export default {
  titel: 'Schlüsseldienst Preise: Gesamtpreise ab Weilburg',
  beschreibung: 'Was kostet der Schlüsseldienst aus Weilburg? Gesamtpreise nach Lage und Zeitfenster, Anfahrt nach Zone, Rechner mit Endbetrag und Zahlarten ohne Aufschlag.',
  kicker: 'Preise',
  h1: 'Preise, die am Ende stimmen',
  einleitung: 'Jeder Betrag auf dieser Seite ist ein Gesamtpreis. Er ändert sich nur durch drei Dinge: was zu tun ist, wann Sie uns brauchen und wie weit unser Weg ist.',
  formel: {
    titel: 'So setzt sich der Preis zusammen',
    teile: [
      // ziel: Jeder Teil der Formel ist ein Abschnitt dieser Seite, in derselben Reihenfolge
      { icon: 'tuer', titel: 'Leistung im Zeitfenster', text: 'aus der Preisliste, je nach Lage und Uhrzeit', ziel: '#liste-titel' },
      { icon: 'entfernung', titel: 'Anfahrt nach Zone', text: 'im Kerngebiet schon enthalten', ziel: '#anfahrt-titel' },
      { icon: 'rechnung', titel: 'Gesamtpreis', text: 'den Sie vor dem Auftrag erfahren', ziel: '#rechner-titel' },
    ],
    material: 'Material wie ein neuer Zylinder kommt nur dazu, wenn es nötig ist – mit Preis vorher.',
  },
  liste: {
    titel: 'Preisliste nach Lage und Zeitfenster',
    einleitung: 'Für jede Lage an der Tür nennt die Liste einen Preis je Zeitfenster. Jeder Betrag ist ein Gesamtpreis im Kerngebiet.',
    band: 'Welches Zeitfenster gilt, zeigt das Tagesband. An Feiertagen gilt das Wochenende.',
    bandOffen: 'Die Uhrzeiten der Zeitfenster folgen mit der Preisliste.',
    jetzt: 'jetzt',
  },
  anfahrt: {
    titel: 'Anfahrt nach Zone',
    einleitung: 'Die Zone ergibt sich aus der Luftlinie zwischen Weilburg und Ihrem Ort. Prüfen Sie Ihren Ort – Sie sehen Entfernung und Zone.',
    zeilen: { A: 'im Preis enthalten', B: 'Aufschlag je Einsatz', C: 'nach Absprache', D: 'nach Absprache', NL: 'ohne Preisangaben' },
    pruefTitel: 'Ihren Ort prüfen',
    pruefHinweis: 'Ort oder Postleitzahl eingeben – Sie sehen Entfernung ab Weilburg und Zone.',
  },
  rechner: {
    titel: 'Preisrechner',
    einleitung: 'Drei Angaben, ein Endbetrag. Der Rechner zeigt immer den Gesamtpreis mit Anfahrt, nie einen „ab“-Preis.',
    fragen: { position: 'Was ist passiert?', fenster: 'Wann brauchen Sie uns?', zone: 'Wo ist die Tür?' },
    ergebnis: 'Gesamtpreis',
    ohneJs: 'Der Rechner braucht JavaScript. Alle Preise stehen in der Preisliste oben.',
    offen: 'Berechnung erst mit Preisliste möglich.',
    absprache: 'Dieser Preis wird nach Absprache vereinbart – fragen Sie uns vorher.',
    hinweis: 'Gesamtpreis mit Anfahrt. Material nur nach Absprache, mit Preis vorher.',
    // Nur im Zustand „nach Absprache“ und nur mit bestätigter Zusage preisVorAuftrag (Wortlaut wie auf den Ortsseiten)
    hinweisAbsprache: 'Den Gesamtpreis mit Anfahrt nennen wir Ihnen am Telefon, bevor wir losfahren.',
  },
  material: {
    titel: 'Was nicht im Preis enthalten ist',
    text: 'Ersatzteile sind nicht Teil der Preisliste, weil sie von Tür und Schloss abhängen. Muss etwas getauscht werden, nennen wir das Teil und seinen Preis, bevor wir es einbauen.',
    beispiele: ['ein neuer Schließzylinder, wenn der alte beschädigt ist', 'Schloss, Beschlag oder Schließblech', 'Material für eine Notverriegelung nach einem Einbruch'],
    link: { text: 'Zylinder und ihre Unterschiede', pfad: '/einbruchschutz/schliesszylinder/' },
  },
  zahlung: {
    titel: 'Zahlarten ohne Aufschlag',
    aufschlag: 'Für keine Zahlart berechnen wir einen Aufschlag.',
    rechnung: 'Sie erhalten eine Rechnung, auf der jede Position einzeln steht.',
    karte: 'Kartenzahlung vor Ort ist möglich.',
  },
  erfolglos: {
    titel: 'Wenn die Öffnung nicht gelingt',
    text: 'Manche Türen lassen sich ohne Schaden nicht öffnen, etwa bei einem defekten Schloss. Dann besprechen wir mit Ihnen, wie es weitergeht, bevor wir anders vorgehen.',
    ja: 'Gelingt die Öffnung nicht, zahlen Sie nur, was vorher vereinbart war.',
  },
  faq: [
    { frage: 'Ist die Anfahrt im angezeigten Preis enthalten?', antwort: 'Im Kerngebiet ja – die Preisliste nennt dort Gesamtpreise mit Anfahrt. Im Umland kommt ein fester Aufschlag je Einsatz dazu, weiter entfernt wird die Anfahrt vorher abgesprochen.' },
    { frage: 'Was kostet ein neuer Zylinder zusätzlich?', antwort: 'Das hängt vom Zylinder ab. Wir nennen Ihnen das Teil und seinen Preis, bevor wir es einbauen. Den Austausch selbst finden Sie als eigene Position in der Preisliste.' },
    { frage: 'Kostet Kartenzahlung extra?', antwort: 'Nein. Für keine Zahlart berechnen wir einen Aufschlag.' },
    { frage: 'Was zahle ich, wenn Sie die Tür nicht öffnen können?', antwort: 'Bevor wir anders vorgehen als besprochen, sprechen wir mit Ihnen. Was in diesem Fall berechnet wird, steht im Abschnitt [Wenn die Öffnung nicht gelingt](#erfolglos-titel).' },
  ],
  weiter: [
    { pfad: '/ratgeber/schluesseldienst-kosten/', titel: 'Was kostet ein Schlüsseldienst?', text: 'Woraus sich Preise zusammensetzen und warum sie so unterschiedlich sind.' },
    { pfad: '/notoeffnung/tueroeffnung/', titel: 'Türöffnung', text: 'Zugefallen oder abgeschlossen – wie wir öffnen.' },
    { pfad: '/einsatzgebiet/', titel: 'Einsatzgebiet', text: 'Zonen, Entfernung und alle Orte.' },
  ],
  schluss: {
    titel: 'Lieber einmal fragen',
    text: 'Nennen Sie uns am Telefon Ort, Uhrzeit und ob die Tür nur zugefallen ist.',
    zusage: 'Dann hören Sie den Gesamtpreis, bevor jemand losfährt.',
  },
};
