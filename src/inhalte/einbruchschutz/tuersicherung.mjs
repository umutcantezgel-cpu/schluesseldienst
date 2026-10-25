// Leistungsseite Türsicherung (V03) – eigene Texte nach Themenpass /einbruchschutz/tuersicherung/.
// Blickwinkel: die Tür als Ganzes (Bandseite, Schließseite, Rahmen) und die Nebeneingänge.
// Keine Zahlen, Normen oder Preise im Text (Faktenprüfer, K-010). Figur: Tür-Schichten bis Stufe 4 (Bandseite).
export default {
  titel: 'Türsicherung nachrüsten: Bänder, Schließseite, Nebentüren',
  beschreibung: 'Türsicherung nachrüsten ohne Austausch: Bänder, Schließseite und Rahmen zusammen prüfen, Sperrbügel einordnen und Nebentüren nicht vergessen.',
  h1: 'Türsicherung nachrüsten: die Tür als Ganzes prüfen',
  kurz: 'Eine Tür ist nur so widerstandsfähig wie ihre schwächste Stelle. Bänder, Schließseite und Rahmen müssen zusammenpassen, damit das Schloss überhaupt halten kann. Ob sich eine Maßnahme lohnt, hängt vom Zustand der Tür ab.',
  figurText: 'Zylinder, Beschlag und Schloss sind vorhanden. Die Bandseite ist hervorgehoben.',
  blick: [
    { titel: 'Bandseite', text: 'Scharniere und Bänder mitprüfen' },
    { titel: 'Schließseite', text: 'Schließblech und Rahmen gehören zusammen' },
    { titel: 'Sperrbügel', text: 'begrenzt den Spalt, ersetzt kein Schloss' },
    { titel: 'Nebentüren', text: 'Kellertür und Gartentür nicht vergessen' },
  ],
  abschnitte: [
    {
      titel: 'Bandseite: warum Scharniere eine Schwachstelle sind',
      absaetze: [
        'Die Bänder tragen das ganze Türblatt. Liegen sie außen, also bei einer Tür, die nach außen öffnet, sind sie von dort aus zugänglich. Dann lässt sich versuchen, das Türblatt aus dem Rahmen zu drücken, auch wenn das Schloss hält.',
        'Öffnet die Tür nach innen, liegen die Bänder im Raum. Dann rückt die Schließseite stärker in den Blick. Steht ein Austausch ohnehin an, passt die Frage nach [Sicherheitstüren](/einbau-tresore/sicherheitstueren/) besser.',
      ],
    },
    {
      titel: 'Schließseite und Rahmen',
      absaetze: [
        'Auf der Schließseite greift das Schloss in das Schließblech im Rahmen. Gibt der Rahmen nach, hilft auch ein gutes Schloss wenig. Deshalb gehören Schloss, Schließblech und Rahmen zusammen geprüft. Mehr zum Schloss auf [Türschlösser](/einbruchschutz/tuerschloesser/).',
        'Ein Rahmen mit Spiel in der Wand gibt unter Druck nach. Ein stabileres Schließblech, das tief im Rahmen verankert ist, kann hier helfen. Ob es passt, hängt von Material und Einbau ab.',
      ],
    },
    {
      titel: 'Sperrbügel und Türspion',
      absaetze: [
        'Ein Sperrbügel begrenzt, wie weit sich eine Tür öffnen lässt, wenn sie einen Spalt offen steht. Er ist eine Sperre beim Öffnen, keine Verriegelung.',
        'Ein Türspion zeigt, wer davor steht, bevor Sie öffnen. Er verschließt nichts. Beides ergänzt den Schutz im Alltag, ersetzt aber kein Schloss.',
      ],
    },
    {
      titel: 'Keller- und Nebentüren',
      absaetze: [
        'Nebentüren geraten leicht aus dem Blick, etwa die Kellertür oder eine Tür zum Garten. Jede davon hat Bänder, Schloss und Rahmen wie die Wohnungstür und verdient denselben Blick.',
        'Welche Maßnahme sinnvoll ist, hängt von Türblatt, Öffnungsrichtung und Zugang ab. Eine Tür, die vom Garten aus erreichbar ist, braucht eine andere Betrachtung als eine Tür zum Hausflur. Fenster und Terrassentüren sind ein eigenes Thema, siehe [Fenstersicherung](/einbruchschutz/fenstersicherung/).',
      ],
    },
  ],
  faq: [
    { frage: 'Warum soll ich die Scharnierseite sichern?', antwort: 'Die Bänder tragen das Türblatt. Liegen sie außen, lässt sich die Tür unter Umständen aus dem Rahmen drücken, auch wenn das Schloss hält. Deshalb gehört die Bandseite zur Prüfung.' },
    { frage: 'Ersetzt ein Sperrbügel ein Zusatzschloss?', antwort: 'Nein. Der Sperrbügel begrenzt den Spalt, wenn die Tür offen steht. Die geschlossene Tür hält er nicht im Rahmen. Dafür braucht es ein Schloss oder einen Riegel, etwa ein [Zusatzschloss](/einbruchschutz/zusatzschloesser/).' },
    { frage: 'Wie sichere ich eine Kellertür von innen?', antwort: 'Auch hier gilt: Schloss, Bänder und Rahmen gemeinsam betrachten. Welche Maßnahme passt, hängt von Türblatt, Rahmen und Öffnungsrichtung ab. Ihre Beschreibung der Tür hilft bei der ersten Einschätzung.' },
  ],
  weiter: [
    { pfad: '/einbruchschutz/zusatzschloesser/', titel: 'Zusatzschlösser', text: 'Ein zweiter Halt für die Wohnungstür.' },
    { pfad: '/einbruchschutz/fenstersicherung/', titel: 'Fenstersicherung', text: 'Fenster und Terrassentüren mit eigenem Blick.' },
    { pfad: '/ratgeber/haustuer-sicherheitscheck/', titel: 'Haustür-Sicherheitscheck', text: 'Die Haustür systematisch prüfen, bevor Sie etwas nachrüsten.' },
  ],
};
