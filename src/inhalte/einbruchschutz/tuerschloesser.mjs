// Leistungsseite Türschlösser (V03) – eigene Texte nach Themenpass /einbruchschutz/tuerschloesser/
// (src/konfig/themenpaesse.mjs). Blickwinkel: Zusammenspiel von Schloss, Schließblech und Zylinder.
// Keine Zahlen, Normen oder Preise im Text (Faktenprüfer, K-010).
export default {
  titel: 'Türschloss austauschen: Schloss, Verriegelung, Schließblech',
  beschreibung: 'Türschloss austauschen oder nachrüsten: Wie Einsteckschloss, Mehrfachverriegelung und Schließblech zusammenspielen und wann nur der Zylinder fehlt.',
  h1: 'Türschloss austauschen und nachrüsten',
  kurz: 'Ein defektes oder unsicheres Türschloss tauschen wir aus oder rüsten es nach. Ob das nötig ist, zeigt das Zusammenspiel von Schloss, Schließblech und Zylinder. Der Zylinder allein reicht selten.',
  blick: [
    { titel: 'Defekt', text: 'klemmt, hakt oder schließt nicht mehr sauber' },
    { titel: 'Schloss oder Zylinder', text: 'erst prüfen, dann tauschen' },
    { titel: 'Schließblech', text: 'gehört zum Schloss und muss passen' },
    { titel: 'Passung', text: 'Dornmaß und Abstände vorher prüfen' },
  ],
  figurText: 'Zylinder und Beschlag in der Tür, an der Schließseite die Verriegelungen.',
  abschnitte: [
    {
      titel: 'Einsteckschloss, Mehrfachverriegelung, Schließblech',
      absaetze: [
        'Ein Einsteckschloss sitzt im Türblatt an der Schließseite. Seine Falle hält die Tür zu, der Riegel wird mit dem Schlüssel vorgeschoben.',
        'Eine Mehrfachverriegelung schiebt zusätzliche Riegel in den Rahmen. Die Tür hält dann an mehreren Stellen statt an einer.',
        'Das Schließblech sitzt im Rahmen und ist das Gegenstück zum Schloss. Es nimmt Falle und Riegel auf.',
        'Was ein zusätzlicher Riegel leistet, zeigt die Seite [Zusatzschlösser](/einbruchschutz/zusatzschloesser/).',
      ],
    },
    {
      titel: 'Schloss oder Zylinder – was ist defekt?',
      absaetze: [
        'Ob der Zylinder oder das Schloss schuld ist, zeigt sich am Verhalten von Schlüssel und Riegel. Typische Anzeichen sind:',
      ],
      liste: [
        'Der Schlüssel lässt sich schwer drehen oder klemmt.',
        'Der Riegel fährt nur mit Mühe aus oder ein.',
        'Die Tür schließt nur mit Kraft oder klemmt im Rahmen.',
        'Der Zylinder wackelt oder steht über.',
      ],
    },
    {
      titel: 'Austausch nach Einbruch, Verlust oder Umzug',
      absaetze: [
        'Nach einem Einbruch ist das Schloss oft verbogen oder beschädigt, auch wenn die Tür wieder zu ist. Dann ist ein Tausch meist sinnvoller als eine Reparatur.',
        'Bei einem Schlüsselverlust entscheidet das Risiko, nicht das Gefühl. Wie sich das abwägen lässt, steht unter [Schlüssel verloren](/ratgeber/schluessel-verloren/).',
        'Nach einem Umzug weiß niemand genau, wer noch Schlüssel hat. Ein neues Schloss schafft dann Klarheit.',
      ],
    },
    {
      titel: 'Passung: Dornmaß und Entfernung',
      absaetze: [
        'Ein neues Schloss muss zur Tür passen. Wichtig ist das Dornmaß, also der Abstand von der Türkante bis zur Mitte des Schlosses.',
        'Auch die Lage der Bohrungen für Schloss und Zylinder zählt. Stimmt sie nicht, wird der Einbau aufwendiger. Das lässt sich am besten an der Tür selbst prüfen.',
        'Zu Beschlägen, die den Zylinder von außen schützen, steht mehr unter [Schutzbeschläge](/einbruchschutz/schutzbeschlaege/).',
      ],
    },
  ],
  faq: [
    { frage: 'Woran erkenne ich, ob das Schloss oder der Zylinder defekt ist?', antwort: 'Ein schwergängiger Schlüssel spricht eher für den Zylinder. Ein Riegel, der trotz gut laufendem Schlüssel nicht sauber fährt, spricht eher für das Schloss. Ganz sicher wird es erst an der Tür.' },
    { frage: 'Lässt sich eine Mehrfachverriegelung in eine bestehende Tür einbauen?', antwort: 'Das hängt von Türblatt, Rahmen und dem Platz für die Riegel ab. Ob es bei Ihrer Tür passt, zeigt eine genaue Prüfung.' },
    { frage: 'Warum ist das Schließblech so wichtig?', antwort: 'Ist es lose, ausgeschlagen oder falsch gesetzt, hält das Schloss weniger, auch wenn es selbst in Ordnung ist. Der Riegel findet dann keinen festen Halt.' },
  ],
  weiter: [
    { pfad: '/einbruchschutz/schliesszylinder/', titel: 'Schließzylinder', text: 'Wenn der Zylinder selbst der Schwachpunkt ist.' },
    { pfad: '/einbruchschutz/zusatzschloesser/', titel: 'Zusatzschlösser', text: 'Wenn an der Wohnungstür ein zweiter Riegel fehlt.' },
    { pfad: '/ratgeber/haustuer-sicherheitscheck/', titel: 'Haustür-Sicherheitscheck', text: 'Eine Checkliste für Schloss, Zylinder und Beschlag.' },
  ],
};
