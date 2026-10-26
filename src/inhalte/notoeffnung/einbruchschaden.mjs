// Leistungsseite Einbruchschaden (V03, Muster wie Türöffnung) – eigene Texte nach Themenpass
// /notoeffnung/einbruchschaden/. Keine Zahlen, Normen, Fristen oder Preise (K-010). Der Pass hat keine Preisposition.
export default {
  titel: 'Einbruchschaden reparieren in Weilburg',
  beschreibung: 'Nach einem Einbruch zuerst die Polizei, dann die Tür. Wir sichern, reparieren und rüsten Türen und Fenster in Weilburg nach.',
  h1: 'Einbruchschaden reparieren in Weilburg und Umgebung',
  kurz: 'Nach einem Einbruch steht zuerst die Anzeige bei der Polizei. Danach sichern wir Tür oder Fenster zunächst mit einem Notverschluss und besprechen mit Ihnen, was die dauerhafte Reparatur umfasst.',
  figurText: 'Eine Wohnungstür mit allen Schichten: Zylinder, Beschlag, Verriegelung, Bänder und Querriegel.',
  blick: [
    { titel: 'Zuerst', text: 'Anzeige bei der Polizei, dann die Tür' },
    { titel: 'Notverschluss', text: 'Übergang, bis die Schäden behoben sind' },
    { titel: 'Instandsetzung', text: 'Tür, Rahmen oder Schloss wieder herstellen' },
    { titel: 'Versicherung', text: 'Fotos vor dem Beheben helfen beim Nachweis' },
  ],
  abschnitte: [
    {
      titel: 'Erst Polizei, dann wir',
      hinweis: 'warnung',
      absaetze: [
        'Nach einem Einbruch steht die Anzeige bei der Polizei an erster Stelle. Ist noch jemand im Haus oder ist Gefahr im Spiel, gilt der Notruf zuerst.',
        'Sprechen Sie uns am Telefon ab, ob die Polizei noch vor Ort ist. Spuren an Tür und Schloss können für die Ermittlung wichtig sein, deshalb klären wir den Ablauf mit Ihnen.',
      ],
    },
    {
      titel: 'Notverschluss als erster Schritt',
      absaetze: [
        'Ein Notverschluss sichert die Tür oder das Fenster, bis die eigentliche Reparatur möglich ist. Er ist eine Übergangslösung und ersetzt keine Instandsetzung.',
        'Ob ein Notverschluss an Ihrer Tür möglich ist, sehen wir vor Ort. Dabei sagen wir Ihnen auch, welche Schäden sich nur vorläufig sichern lassen.',
      ],
    },
    {
      titel: 'Instandsetzung und Nachrüstung',
      absaetze: [
        'Bei der Instandsetzung bringen wir Tür, Rahmen oder Schloss wieder in einen brauchbaren Zustand. Was dafür nötig ist, besprechen wir nach der Besichtigung.',
        'Nachrüsten heißt, die Schwachstellen zu beseitigen, die der Einbruch gezeigt hat. Solche Stellen können am Schließblech, am Zylinder oder an der Bandseite liegen. Mehr zur Verstärkung steht unter [Türsicherung](/einbruchschutz/tuersicherung/).',
      ],
    },
    {
      titel: 'Unterlagen für die Versicherung',
      absaetze: [
        'Welche Nachweise Ihre Versicherung braucht, entscheidet der Versicherer. Fragen Sie dort nach, bevor Sie den Schaden melden.',
        'Hilfreich sind Fotos vom Schaden, bevor etwas verändert wird, und Belege über die Arbeiten. Heben Sie alle Unterlagen auf.',
      ],
    },
  ],
  faq: [
    { frage: 'Darf ich die Tür schon reparieren lassen, bevor die Polizei da war?', antwort: 'Sagen Sie uns am Telefon, ob die Polizei schon da war oder noch kommt. Dann klären wir den Ablauf. Wenn die Wohnung offen steht, geht die Sicherung vor.' },
    { frage: 'Was ist ein Notverschluss?', antwort: 'Ein Notverschluss sichert Tür oder Fenster vorläufig, damit die Wohnung wieder verschlossen ist. Er ist nur eine Zwischenlösung. Die dauerhafte Reparatur folgt danach, nach Absprache.' },
    { frage: 'Welche Belege braucht die Versicherung von Ihnen?', antwort: 'Das entscheidet Ihr Versicherer. Fragen Sie dort nach den Nachweisen, die verlangt werden. Hilfreich sind Fotos vom Schaden und Belege über die durchgeführten Arbeiten.' },
    { frage: 'Sollte ich nach einem Einbruch alle Schlösser tauschen?', antwort: 'Das lässt sich nicht pauschal sagen. Entscheidend ist, wie der Täter ins Haus kam und welche Schlösser betroffen sind. Wir sehen uns die Schwachstelle mit Ihnen an und besprechen, was sinnvoll ist.' },
  ],
  weiter: [
    { pfad: '/ratgeber/nach-einbruch-was-tun/', titel: 'Nach dem Einbruch', text: 'Was jetzt zu tun ist, Schritt für Schritt.' },
    { pfad: '/einbruchschutz/', titel: 'Einbruchschutz', text: 'Wo Einbrecher ansetzen und was zuerst hilft.' },
    { pfad: '/einbruchschutz/tuersicherung/', titel: 'Türsicherung', text: 'Bandseite und Schließblech verstärken.' },
  ],
};
