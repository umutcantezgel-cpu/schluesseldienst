// Leistungsseite Schutzbeschläge (V03) – eigene Texte nach Themenpass /einbruchschutz/schutzbeschlaege/
// (src/konfig/themenpaesse.mjs). Blickwinkel: Der Beschlag schützt den Zylinder von außen; warum ein guter
// Zylinder ohne passenden Beschlag angreifbar bleibt. Keine Zahlen, Normen oder Preise (K-010).
export default {
  titel: 'Schutzbeschlag: Zylinder von außen gegen Abbrechen sichern',
  beschreibung: 'Schutzbeschlag für den Zylinder: Warum ein guter Zylinder ohne passenden Beschlag angreifbar bleibt und wie Beschlag und Zylinder zusammenpassen.',
  h1: 'Schutzbeschlag für Zylinder und Tür',
  kurz: 'Ein Schutzbeschlag legt sich von außen um den Zylinder und nimmt ihm die Angriffsfläche. Ein guter Zylinder schützt nur so weit, wie der Beschlag ihn lässt. Beschlag und Zylinder sollten deshalb zusammen gewählt werden.',
  blick: [
    { titel: 'Aufgabe', text: 'Zylinder von außen gegen Angriffe schützen' },
    { titel: 'Zylinderabdeckung', text: 'deckt den Zylinder rundum ab' },
    { titel: 'Kernziehschutz', text: 'erschwert das Herausziehen des Kerns' },
    { titel: 'Passung', text: 'Beschlag, Tür und Zylinder zusammen prüfen' },
  ],
  figurText: 'Zylinder mit Schutzbeschlag in der Türfläche, ohne Schloss und Bandseite.',
  abschnitte: [
    {
      titel: 'Aufgabe des Schutzbeschlags',
      absaetze: [
        'Der Zylinder steht in der Tür und ragt meist nur wenig heraus. Genau dort setzen Angreifer an: Sie wollen ihn fassen, abbrechen oder herausziehen.',
        'Der Schutzbeschlag nimmt diese Angriffsfläche weg. Er liegt außen an der Tür an und deckt den Zylinder so ab, dass man ihn schlecht greifen kann.',
        'Das Schloss im Türblatt ist ein anderes Thema, dazu [Türschlösser](/einbruchschutz/tuerschloesser/).',
      ],
    },
    {
      titel: 'Zylinderabdeckung und Kernziehschutz',
      absaetze: [
        'Die Zylinderabdeckung ist eine Blende rund um den Zylinder. Sie verhindert, dass ein Werkzeug gut ansetzen kann. Welche Zylinder infrage kommen, steht unter [Schließzylinder](/einbruchschutz/schliesszylinder/).',
        'Der Kernziehschutz ist eine Eigenschaft des Zylinders selbst. Er erschwert, den Kern herauszuziehen. Der Beschlag ersetzt ihn nicht: Ist der Zylinder leicht zu ziehen, bleibt diese Schwachstelle.',
        'Vor der Wahl lohnt ein Blick auf beides:',
      ],
      liste: [
        'Zylinder: Bohr-, Zieh- und Aufsperrschutz prüfen.',
        'Beschlag: Abdeckung passend zum Zylinder wählen.',
      ],
    },
    {
      titel: 'Verschraubung von innen',
      absaetze: [
        'Ein Schutzbeschlag wird von innen verschraubt. Die Befestigung liegt dann auf der geschützten Seite und ist von außen nicht zugänglich.',
        'Bei dünnem oder beschädigtem Türblatt hält die Verschraubung weniger. Das lässt sich nur an der Tür selbst beurteilen.',
      ],
    },
    {
      titel: 'Passung zu Tür und Zylinder',
      absaetze: [
        'Ein Schutzbeschlag muss zum Zylinder passen. Wichtig sind Länge und Form der Abdeckung, damit sie zum Zylinder und zur Türdicke passt.',
        'Auch die Lage des Zylinders bestimmt die Wahl. Nicht jeder Beschlag passt auf jede Tür.',
        'Die Bandseite ist ein eigenes Thema, dazu [Türsicherung](/einbruchschutz/tuersicherung/).',
      ],
    },
  ],
  faq: [
    { frage: 'Brauche ich einen Schutzbeschlag, wenn mein Zylinder schon sicher ist?', antwort: 'Ein sicherer Zylinder allein reicht oft nicht. Ohne Beschlag bleibt er von außen angreifbar. Ob sich der Aufwand lohnt, hängt davon ab, wie gut die Tür einsehbar und erreichbar ist.' },
    { frage: 'Passt ein Schutzbeschlag auf meine vorhandene Tür?', antwort: 'Das lässt sich nicht pauschal sagen. Es zählen Türdicke, Zylinder und die Lage der Bohrungen. Am sichersten ist der Blick auf die Tür selbst, bevor Sie etwas bestellen.' },
    { frage: 'Was bedeutet Zylinderabdeckung?', antwort: 'Die Zylinderabdeckung umschließt den Zylinder rundum. Sie gehört zum Beschlag und erschwert, den Zylinder zu fassen oder abzubrechen. Sie muss zum Zylinder passen.' },
  ],
  weiter: [
    { pfad: '/einbruchschutz/schliesszylinder/', titel: 'Schließzylinder', text: 'Welcher Zylinder zum Beschlag passt.' },
    { pfad: '/einbruchschutz/tuersicherung/', titel: 'Türsicherung', text: 'Die Scharnierseite, falls sie die schwächere Stelle ist.' },
    { pfad: '/einbruchschutz/', titel: 'Einbruchschutz', text: 'Alle Schichten der Tür im Überblick.' },
  ],
};
