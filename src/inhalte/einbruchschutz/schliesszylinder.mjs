// Leistungsseite Schließzylinder (V03, Muster wie Türöffnung) – eigene Texte nach Themenpass
// /einbruchschutz/schliesszylinder/. Preis nur mit Position „zylinder“ (Arbeitszeit). Keine Zahlen, Normen oder Maße (K-010).
export default {
  titel: 'Sicherheitszylinder einbauen in Weilburg',
  beschreibung: 'Schließzylinder mit Bohr-, Zieh- und Aufsperrschutz: woran Sie ihn erkennen, worauf es beim Maß ankommt, was der Tausch kostet.',
  h1: 'Sicherheitszylinder einbauen in Weilburg und Umgebung',
  kurz: 'Ein Zylinder mit guten Schutzfunktionen erschwert das Bohren, Ziehen und Aufsperren. Welcher passt, hängt von Tür, Maß und Schutzbedarf ab, und das klären wir vor dem Einbau.',
  figur: 'zylinder',
  figurText: 'Schnitt durch den Zylinder: Der passende Schlüssel hebt alle Stifte auf die Scherlinie, erst dann dreht der Kern.',
  blick: [
    { titel: 'Schutzfunktionen', text: 'Bohr-, Zieh- und Aufsperrschutz prüfen' },
    { titel: 'Maß', text: 'Länge passend zur Türstärke, ohne Überstand' },
    { titel: 'Sicherungskarte', text: 'gehört zum Zylinder, sicher verwahren' },
    { titel: 'Preis', text: 'Tausch mit Arbeitszeit, neuer Zylinder gesondert' },
  ],
  abschnitte: [
    {
      titel: 'Schutzfunktionen: Bohren, Ziehen, Aufsperren',
      absaetze: [
        'Ein Zylinder wird auf drei Arten angegriffen. Beim Bohren wird er aufgebohrt. Beim Ziehen versucht man, ihn aus der Tür zu ziehen. Beim Aufsperren öffnet man ihn ohne passenden Schlüssel.',
        'Ein Zylinder kann gegen jede dieser Methoden geschützt sein. Ob er es ist, steht in seiner Beschreibung. Fragen Sie vor dem Kauf danach. Der Zylinder allein sichert nicht die ganze Tür, mehr dazu unter [Schutzbeschläge](/einbruchschutz/schutzbeschlaege/).',
      ],
    },
    {
      titel: 'Richtig messen und Überstand vermeiden',
      absaetze: [
        'Der Zylinder muss zur Tür passen. Steht er deutlich über den Beschlag hinaus, lässt er sich leichter abbrechen. Ist er zu kurz, sitzt er nicht sauber im Beschlag.',
        'Wie lang er sein muss, hängt von der Stärke des Türblatts und vom Schloss ab. Das klären wir vor dem Bestellen.',
      ],
    },
    {
      titel: 'Sicherungskarte und Nachschlüssel',
      absaetze: [
        'Die Sicherungskarte gehört zum Zylinder. Mit ihr lassen sich Nachschlüssel nachbestellen. Bewahren Sie die Karte gut auf, nicht an der Tür und nicht im Auto.',
        'Ist die Karte verloren, sprechen Sie das vor dem Kauf eines neuen Zylinders an. Was dann möglich ist, hängt vom Hersteller ab.',
      ],
    },
    {
      titel: 'Tausch nach Verlust, Umzug oder Einbruch',
      absaetze: [
        'Ein Tausch ist nötig oder ratsam, wenn ein Schlüssel verloren ging und die Adresse auf dem Schlüssel steht. Auch nach einem Umzug in eine Wohnung mit fremden Schlüsseln oder nach einem Einbruchversuch lohnt die Frage.',
        'Mehr zum verlorenen Schlüssel steht unter [Schlüssel verloren](/ratgeber/schluessel-verloren/).',
      ],
    },
  ],
  preis: {
    text: 'Die Preise gelten für den Tausch in Zone A, mit Anfahrt. Den neuen Zylinder nennen wir Ihnen vorher und berechnen ihn gesondert. Was in Ihrer Zone gilt, steht auf der [Preisseite](/preise/).',
    positionen: ['zylinder'],
  },
  faq: [
    { frage: 'Woran erkenne ich, dass mein Zylinder zu weit übersteht?', antwort: 'Ein Zylinder, der deutlich über den Beschlag hinaussteht, lässt sich leichter abbrechen. Sehen Sie nach, ob er bündig sitzt oder deutlich vorsteht. Ob er passt, prüfen wir vor Ort.' },
    { frage: 'Was bringt eine Sicherungskarte?', antwort: 'Sie gehört zum Zylinder und dient dazu, Nachschlüssel nachzubestellen. Deshalb sollte sie gut verwahrt werden, nicht an der Tür.' },
    { frage: 'Wie viele Schlüssel bekomme ich zu einem neuen Zylinder?', antwort: 'Die Anzahl steht in der Beschreibung des Zylinders und hängt vom Modell ab. Fragen Sie vor der Bestellung danach.' },
    { frage: 'Kann ein Zylinder in eine bestehende Schließanlage eingebunden werden?', antwort: 'Das hängt von der Anlage ab und davon, ob der Zylinder dafür vorgesehen ist. Klären Sie es vor dem Kauf. Mehr dazu steht unter [Schließanlagen](/einbruchschutz/schliessanlagen/).' },
  ],
  weiter: [
    { pfad: '/einbruchschutz/schutzbeschlaege/', titel: 'Schutzbeschläge', text: 'Beschläge mit Zylinderabdeckung für mehr Widerstand.' },
    { pfad: '/ratgeber/schliesszylinder-wechseln/', titel: 'Zylinder selbst wechseln', text: 'Was dabei zu beachten ist, Schritt für Schritt.' },
    { pfad: '/einbruchschutz/schliessanlagen/', titel: 'Schließanlagen', text: 'Wenn mehrere Türen einen Schlüssel teilen sollen.' },
  ],
};
