// Ratgeber-Artikel: Haustür-Sicherheitscheck. Eigene Texte nach Themenpass (Kern: Prüfpunkte zum Abhaken mit
// Grafik der Tür in Schichten, vom Zylinder bis zum Rahmen). Zahlen und Normen nur über Fakten aus
// norm-zylinder und norm-schutzbeschlag; die Prüfpunkte selbst sind Sichtprüfungen ohne Messwerte.
import zyl from '../fakten/norm-zylinder.mjs';
import sb from '../fakten/norm-schutzbeschlag.mjs';

export default {
  titel: 'Haustür-Sicherheit prüfen: Schwachstellen selbst finden',
  beschreibung: 'Prüfen Sie Zylinder, Beschlag, Schloss, Bandseite und Rahmen Ihrer Haustür Punkt für Punkt und erfahren Sie, was Sie zuerst beheben sollten.',
  kategorie: 'vorbeugen',
  kurztitel: 'Haustür selbst prüfen',
  h1: 'Haustür-Sicherheit selbst prüfen',
  kurz: 'Gehen Sie Ihre Haustür Stück für Stück durch: Zylinder, Beschlag, Schloss, Bandseite und Rahmen. Die Prüfliste hilft Ihnen, Schwachstellen ohne Spezialwerkzeug zu erkennen. Die Auswertung am Ende zeigt, was zuerst zu klären ist.',
  stand: '2026-10-25',
  figur: 'tuer-schichten',
  figurText: 'Schicht für Schicht: Zylinder, Beschlag, Verriegelung, Bandseite und Querriegel gehören zusammen.',
  wichtig: [
    'Beginnen Sie mit dem **Zylinder** und dem Beschlag, weil beide von außen zu sehen sind.',
    'Prüfen Sie **Schloss und Schließblech** gemeinsam, denn das Schloss wirkt nur mit festem Gegenstück.',
    'Mängel an **Rahmen** und Mauerwerk beurteilt ein Fachbetrieb.',
  ],
  abschnitte: [
    {
      titel: 'Zylinder und Beschlag',
      absaetze: [
        ['Der Schließzylinder sitzt von außen gut sichtbar in der Tür. ', zyl.fakten.bohrschutz],
        ['Ein Schutzbeschlag schützt den Zylinder zusätzlich. ', sb.fakten.sicherheit, ' ', sb.fakten['za-immer']],
        'Ein Zylinder, der ohne Beschlag offen liegt, bietet Angreifern mehr Angriffsfläche. Prüfen Sie ihn bei geschlossener Tür von außen: Lässt er sich leicht bewegen oder herausziehen, ist das ein deutlicher Mangel.',
      ],
      liste: [
        'Ist ein Profilzylinder mit Bohrschutz eingebaut?',
        'Ist ein Schutzbeschlag montiert?',
        'Liegt der Zylinder geschützt unter einer Abdeckung, oder steht er darüber hinaus?',
      ],
      hinweis: { art: 'info', text: 'Notieren Sie Bezeichnungen, die Sie auf Zylinder oder Beschlag finden, für das Gespräch mit dem Fachbetrieb.' },
    },
    {
      titel: 'Schloss und Schließblech',
      absaetze: [
        'Das Schloss wirkt nur, wenn das Schließblech im Rahmen fest sitzt. Prüfen Sie beide, während die Tür geschlossen ist.',
        'Ein Schloss, das klemmt oder schwer schließt, weist auf ein Problem im Rahmen oder am Schloss hin. Notieren Sie auffällige Stellen, damit Sie sie einem Fachbetrieb zeigen können.',
      ],
      liste: [
        'Ist nur ein Schloss vorhanden, oder gibt es eine Mehrfachverriegelung?',
        'Sitzt das Schließblech fest, mit allen Schrauben?',
        'Greift der Riegel ohne Spiel in das Schließblech ein?',
      ],
      hinweis: { art: 'info', text: 'Lockere Schrauben am Schließblech erkennen Sie oft schon mit einem Blick.' },
    },
    {
      titel: 'Bandseite',
      absaetze: [
        'An der Bandseite zeigt sich, ob die Tür gegen Aushebeln gesichert ist. Die Bänder tragen das Gewicht der Tür, und von außen sehen Sie oft nur die Scharniere.',
        'Hängt die Tür durch, ist der Riegel oft schwerer in das Schließblech zu bringen. Ein Band, das wackelt oder sich lockert, sollten Sie prüfen lassen.',
      ],
      liste: [
        'Sitzen die Bänder fest, ohne Spiel in der Tür?',
        'Gibt es eine Sicherung gegen Aushebeln, etwa einen Bolzen oder einen Querriegel?',
      ],
    },
    {
      titel: 'Rahmen und Mauerwerk',
      absaetze: [
        'Eine Tür ist nur so fest wie ihr Rahmen und dessen Verankerung. Rütteln Sie vorsichtig an der geschlossenen Tür. Sie sollte sich im Rahmen nicht bewegen.',
        'Eine Tür, die im Rahmen spielt, hat meist ein Problem mit dem Rahmen, den Bändern oder der Verankerung. Achten Sie auch auf feuchte Stellen, Risse oder Ausbrüche in der Wand neben dem Rahmen.',
      ],
      liste: [
        'Lässt sich die geschlossene Tür im Rahmen bewegen?',
        'Ist der Rahmen fest im Mauerwerk verankert, ohne lose Stellen?',
      ],
      hinweis: { art: 'warnung', text: 'Zeigt der Rahmen Risse oder ist er locker, lassen Sie ihn von einem Fachbetrieb prüfen, bevor Sie etwas verändern.' },
    },
    {
      titel: 'Auswertung: was zuerst',
      absaetze: [
        'Gehen Sie die Mängel in dieser Reihenfolge durch. Notieren Sie für jeden Punkt, ob er in Ordnung, auffällig oder unklar ist.',
        'Ein Fachbetrieb ist dann nötig, wenn Sie einen Befund nicht sicher einschätzen.',
      ],
      schritte: [
        'Beginnen Sie mit Mängeln an Zylinder und Beschlag, denn dort liegt die äußere Schicht.',
        'Ziehen Sie lockere Schrauben am Schließblech nach, wenn sie sich ohne Schaden drehen lassen.',
        'Lassen Sie Bandseite und Rahmen von einem Fachbetrieb prüfen, wenn Sie einen Mangel nicht sicher beurteilen.',
      ],
      hinweis: { art: 'info', text: 'Fotografieren Sie Mängel, bevor Sie etwas verändern. So können Sie sie einem Fachbetrieb genau beschreiben.' },
    },
  ],
  faq: [
    { frage: 'Wie viel darf der Zylinder überstehen?', antwort: ['Dazu nennen wir keinen festen Wert. ', sb.fakten['za-immer']] },
    { frage: 'Wie erkenne ich ein schwaches Schließblech?', antwort: 'Achten Sie auf lockere oder fehlende Schrauben, auf Spiel am Riegel und auf Schäden am Holz. Ein Fachbetrieb beurteilt, ob das Schließblech ersetzt werden muss.' },
    { frage: 'Was ist, wenn sich die Tür im Rahmen bewegen lässt?', antwort: 'Dann sitzen Tür, Rahmen oder Verankerung nicht fest. Lassen Sie den Befund von einem Fachbetrieb prüfen, bevor Sie selbst etwas verändern. Ein ordentlicher Eindruck von außen reicht dafür nicht.' },
  ],
  weiter: [
    { pfad: '/einbruchschutz/tuerschloesser/', titel: 'Türschlösser', text: 'Einsteckschlösser und Mehrfachverriegelungen tauschen oder nachrüsten.' },
    { pfad: '/einbruchschutz/schutzbeschlaege/', titel: 'Schutzbeschläge', text: 'Beschläge mit Zylinderabdeckung, die Abbrechen und Ziehen erschweren.' },
    { pfad: '/einbruchschutz/tuersicherung/', titel: 'Türsicherung', text: 'Bandseite und Schließblech verstärken, Sperrbügel und Kellertüren sichern.' },
  ],
};
