// Leistungsseite Schließanlagen (V03, Muster wie Türöffnung) – eigene Texte nach Themenpass
// /einbruchschutz/schliessanlagen/. Ohne Preis: der Pass hat keine Preisposition. Keine Zahlen, Normen oder Fristen (K-010).
export default {
  titel: 'Schließanlage in Weilburg: Schlüssel für mehrere Türen',
  beschreibung: 'Schließanlagen für Haus, Mehrfamilienhaus und Betrieb: Anlagenarten einfach erklärt, der Schließplan als Werkzeug und was bei Verlust zu tun ist.',
  h1: 'Schließanlagen für Haus, Mehrfamilienhaus und Betrieb',
  kurz: 'Eine Schließanlage erlaubt, mit wenigen Schlüsseln mehrere Türen zu öffnen. Welche Anlage passt, hängt davon ab, wer welche Tür braucht und wie oft sich das ändert.',
  figurText: 'Eine Wohnungstür mit allen Schichten. Jede Tür einer Anlage hat ihren Zylinder.',
  blick: [
    { titel: 'Anlagenarten', text: 'gleichschließend, Hauptschlüssel, Zentralschloss' },
    { titel: 'Schließplan', text: 'legt fest, welcher Schlüssel welche Tür öffnet' },
    { titel: 'Mechanisch oder elektronisch', text: 'Schlüssel, Karte, Code oder Transponder' },
    { titel: 'Erweiterung', text: 'hängt von Anlage und Schließplan ab' },
  ],
  abschnitte: [
    {
      titel: 'Anlagenarten: gleichschließend, Zentralschloss, Hauptschlüssel',
      absaetze: [
        'Gleichschließend heißt: Alle Zylinder der Anlage lassen sich mit demselben Schlüssel öffnen. Das ist leicht zu verstehen, hat aber eine Schwäche. Geht dieser Schlüssel verloren, betrifft das alle Türen.',
        'Bei einer Hauptschlüsselanlage öffnet ein Hauptschlüssel alle Türen, während weitere Schlüssel nur Teile der Anlage öffnen. Die Zentralschloss-Variante fasst eine Gruppe von Türen über ein zentrales Schloss zusammen. Welche Form zu Ihrem Gebäude passt, klären wir bei der Planung.',
      ],
    },
    {
      titel: 'Der Schließplan',
      absaetze: [
        'Der Schließplan hält fest, welcher Schlüssel welche Tür öffnet und wer ihn besitzt. Er ist die Grundlage für Erweiterungen und für jede Reaktion auf einen Verlust.',
        'Ohne Schließplan weiß bei einer größeren Anlage niemand mehr genau, wer was hat. Deshalb sollte er vor der Bestellung stehen und gut aufbewahrt werden.',
      ],
    },
    {
      titel: 'Mechanisch oder elektronisch',
      absaetze: [
        'Mechanische Anlagen arbeiten mit Schlüsseln und Zylindern. Elektronische Anlagen öffnen mit Karte, Code oder Transponder. Dort lassen sich Berechtigungen ändern, ohne jeden Zylinder zu tauschen.',
        'Die Entscheidung hängt von den Personen, den Türen und den Änderungen ab, die Sie erwarten. Die Technik im Detail steht unter [Elektronische Schließanlagen](/ratgeber/elektronische-schliessanlagen/).',
      ],
    },
    {
      titel: 'Erweitern und bei Verlust reagieren',
      absaetze: [
        'Ob sich eine bestehende Anlage erweitern lässt, hängt von ihrem Aufbau und vom Schließplan ab. Das klären wir anhand des Plans.',
        'Geht ein Schlüssel verloren, muss die Reaktion zur Anlage passen. Manchmal reicht der Austausch eines Zylinders, manchmal berührt der Verlust die ganze Anlage. Mehr dazu unter [Schlüssel verloren](/ratgeber/schluessel-verloren/).',
      ],
    },
  ],
  faq: [
    { frage: 'Was ist der Unterschied zwischen Zentralschloss- und Hauptschlüsselanlage?', antwort: 'Beide Varianten lassen einen Schlüssel mehrere Türen öffnen. Der Unterschied liegt im Aufbau und darin, wer welche Türen öffnen darf. Welche Variante zu Ihnen passt, klären wir bei der Planung.' },
    { frage: 'Kann eine Schließanlage später erweitert werden?', antwort: 'Das hängt vom Aufbau der Anlage ab. Wichtig sind der Schließplan und die Frage, ob die vorhandenen Zylinder in die Erweiterung passen. Das klären wir mit Ihnen anhand des Plans.' },
    { frage: 'Was passiert, wenn ein Schlüssel der Anlage verloren geht?', antwort: 'Das hängt davon ab, welche Anlage Sie haben. Bei manchen reicht ein neuer Zylinder, bei anderen betrifft der Verlust mehrere Türen. Melden Sie den Verlust zeitnah und halten Sie den Schließplan bereit.' },
    { frage: 'Wer verwaltet den Schließplan?', antwort: 'Das hängt vom Gebäude ab. In einem Mehrfamilienhaus klärt die Hausverwaltung oder die Eigentümergemeinschaft das. Wichtig ist, dass eine Stelle den Plan führt und aktuell hält.' },
  ],
  weiter: [
    { pfad: '/einbruchschutz/schliesszylinder/', titel: 'Schließzylinder', text: 'Bohr-, Zieh- und Aufsperrschutz im Überblick.' },
    { pfad: '/ratgeber/elektronische-schliessanlagen/', titel: 'Elektronische Anlagen', text: 'Karte, Code und Transponder im Detail.' },
    { pfad: '/ratgeber/schluessel-verloren/', titel: 'Schlüssel verloren', text: 'Was nach einem Verlust zu klären ist.' },
  ],
};
