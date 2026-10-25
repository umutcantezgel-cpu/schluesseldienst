// Ratgeber-Artikel: Elektronische Schließanlagen. Eigene Texte nach Themenpass (Kern: mechanisch und elektronisch
// vergleichen nach Verlustfall, Berechtigungen, Energie und Datenschutz). Der Themenpass nennt kein Faktenblatt:
// deshalb keine Zahlen, Fristen, Normen oder technischen Daten.
export default {
  titel: 'Elektronische Schließanlage: Wann sich der Umstieg lohnt',
  beschreibung: 'Elektronische Schließanlage oder mechanisch? Verlust, Batterie, Notweg, Protokolle und Datenschutz – worauf Sie beim Umstieg achten sollten.',
  kategorie: 'technik',
  kurztitel: 'Elektronische Anlagen',
  h1: 'Wann sich eine elektronische Schließanlage lohnt',
  kurz: 'Elektronische Schließanlagen öffnen per Chip, Karte oder Code statt mit einem Metallschlüssel. Ob sich der Umstieg lohnt, hängt davon ab, wie Sie mit Verlust, leerer Batterie und Zutrittsdaten umgehen wollen.',
  stand: '2026-10-25',
  wichtig: [
    'Bei Verlust lässt sich ein **Transponder** in vielen Anlagen sperren, statt den Zylinder zu tauschen.',
    'Klären Sie vor dem Kauf, wie Sie bei **leerer Batterie** wieder ins Haus oder in die Wohnung kommen.',
    'Fragen Sie nach der **Protokollierung** und danach, wer die Daten einsehen darf.',
  ],
  abschnitte: [
    {
      titel: 'Wie elektronische Zylinder arbeiten',
      absaetze: [
        'Bei einem mechanischen Zylinder bewegt der Schlüssel Stifte im Inneren auf die richtige Höhe. Ein elektronischer Schließzylinder prüft dagegen, ob ein berechtigter Chip, eine Karte oder ein Code vorliegt. Dann gibt er einen Antrieb frei, der den Riegel bewegt.',
        'Beide Varianten müssen zu Tür und Schloss passen. Welche Technik zu Ihrer Tür passt, klärt der Fachbetrieb beim Aufmaß.',
        'Bei Mietwohnungen klären Sie vorab mit dem Vermieter, ob Sie die Schließtechnik ändern dürfen.',
        'Viele elektronische Anlagen erlauben, Berechtigungen zentral zu verwalten: Wer darf wann in welche Tür? Das hilft, wenn Personal wechselt oder jemand auszieht.',
      ],
      liste: [
        'Mechanisch: ein Metallschlüssel mit festem Profil.',
        'Elektronisch: Chip, Karte, Code oder Fingerabdruck, je nach System.',
      ],
    },
    {
      titel: 'Verlust: sperren statt tauschen',
      absaetze: [
        'Geht bei einer mechanischen Anlage ein Schlüssel verloren, lässt er sich in der Regel nicht einzeln sperren. Dann bleibt oft nur der Austausch des Zylinders, und das kann aufwendig werden.',
        'Viele elektronische Systeme erlauben, einen verlorenen Schlüssel zu sperren, ohne den Zylinder zu tauschen. Die Berechtigung wird dann im System entfernt.',
        'Ob Ihre Anlage das kann, klärt der Fachbetrieb vor dem Kauf. Fragen Sie auch, wie neue Schlüssel oder Karten ausgegeben und verwaltet werden.',
        'Für die Entscheidung helfen diese Fragen: Wie oft gehen Schlüssel verloren, und wer braucht Zugang?',
      ],
    },
    {
      titel: 'Batterie und Notöffnung',
      absaetze: [
        'Elektronische Zylinder brauchen Strom, meist aus Batterien. Ist die Batterie leer, lässt sich die Tür elektronisch oft nicht mehr öffnen.',
        'Ob es einen mechanischen Notschlüssel gibt oder einen Anschluss für einen Notstrom, steht im Angebot. Fragen Sie danach, bevor Sie die Anlage bestellen.',
        'Notieren Sie den Wechseltermin im Kalender, dann geht er nicht unter.',
        'Viele Anlagen melden eine schwache Batterie rechtzeitig. Legen Sie den Batteriewechsel fest, nicht erst dann, wenn nichts mehr geht. Prüfen Sie außerdem, welche Batterien die Anlage braucht und wie der Wechsel abläuft.',
      ],
      hinweis: { art: 'warnung', text: 'Eine Anlage ohne klaren Notweg kann Sie aussperren. Klären Sie den Notweg, bevor Sie kaufen.' },
    },
    {
      titel: 'Protokolle und Datenschutz',
      absaetze: [
        'Viele elektronische Anlagen speichern, welcher Schlüssel wann geöffnet hat. Das hilft bei der Aufklärung, heißt aber auch: Es entstehen Daten darüber, wer wann gekommen ist.',
        'Legen Sie fest, wer die Protokolle einsehen darf, wie lange sie gespeichert werden und wer die Anlage verwaltet. Das gehört in die Planung, nicht in die Nachbetrachtung.',
        'Ein Protokoll kann bei einem Vorfall helfen. Es betrifft aber auch Mitarbeitende und Bewohner, deshalb speichern Sie nur, was Sie wirklich brauchen.',
        'Für Fragen zum Datenschutz wenden Sie sich an die zuständige Datenschutzbehörde.',
      ],
      liste: [
        'Wer darf Protokolle lesen?',
        'Wie lange werden sie gespeichert?',
        'Wer verwaltet die Berechtigungen?',
      ],
    },
    {
      titel: 'Mischbetrieb mit Mechanik',
      absaetze: [
        'Ob mechanische und elektronische Zylinder in einer Anlage zusammenarbeiten, hängt vom System ab. Es gibt Systeme, die beides verbinden, sie müssen aber von Anfang an geplant werden.',
        'Eine nachträgliche Mischung kann zu zwei Schlüsselwelten führen. Dann passen manche Schlüssel nur an einer Tür, was den Alltag erschwert.',
        'Fragen Sie beim Kauf auch, ob die Anlage später erweitert werden kann, ohne die ganze Schließplanung zu ändern.',
        'Lassen Sie sich die Schließplanung vor dem Einbau schriftlich geben, mit allen Türen und Berechtigungen.',
        'Ein verlorener Schlüssel ist ärgerlich. Wichtig ist, dass Sie ihn schnell aus dem System nehmen können.',
      ],
      hinweis: { art: 'info', text: 'Eine saubere Planung hilft, Doppelarbeit zu vermeiden. Sie gehört deshalb vor den Einbau, nicht danach.' },
    },
  ],
  faq: [
    { frage: 'Was passiert, wenn die Batterie im elektronischen Zylinder leer ist?', antwort: 'Dann lässt sich die Tür elektronisch oft nicht mehr öffnen. Ob ein mechanischer Notschlüssel oder ein Notstromanschluss vorhanden ist, steht im Angebot.' },
    { frage: 'Kann ich mechanische und elektronische Zylinder mischen?', antwort: 'Das hängt vom System ab. Lassen Sie den Mischbetrieb vor dem Kauf ausdrücklich im Angebot nennen, damit die Schließplanung stimmt.' },
    { frage: 'Werden Zutritte protokolliert?', antwort: 'Das hängt von der Anlage ab. Manche speichern Öffnungen, andere nicht. Fragen Sie vor dem Kauf, was gespeichert wird, wie lange und wer darauf zugreifen kann.' },
  ],
  weiter: [
    { pfad: '/einbruchschutz/schliessanlagen/', titel: 'Schließanlagen', text: 'Schließanlagen für Haus, Mehrfamilienhaus und Betrieb.' },
    { pfad: '/einbruchschutz/schliesszylinder/', titel: 'Schließzylinder', text: 'Sicherheitszylinder auswählen und einbauen.' },
    { pfad: '/sicherheitstechnik/', titel: 'Sicherheitstechnik', text: 'Alarmanlagen, Videoüberwachung und weitere Technik im Überblick.' },
  ],
};
