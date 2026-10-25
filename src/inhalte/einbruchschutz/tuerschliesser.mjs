// Leistungsseite Türschließer (V03) – eigene Texte nach Themenpass /einbruchschutz/tuerschliesser/.
// Blickwinkel: Schließen und Einstellen (Schließkraft, Endschlag, Dämpfung), nicht Einbruchschutz.
// Vorsicht laut Pass: keine Herstellernamen; Aussagen zur Zulassung von Feuerschutztüren bleiben generisch,
// bis das Faktenblatt norm-tuerschliesser geprüft ist. Keine Zahlen, Normen oder Preise im Text (K-010).
// Die Kopffigur fällt auf das Gruppenbild Tür-Schichten zurück (kein Eintrag für diese Leistung in der Vorlage): ohne figurText.
export default {
  titel: 'Türschließer einstellen: Schließkraft, Endschlag, Dämpfung',
  beschreibung: 'Türschließer auswählen und einstellen: Gestänge oder Gleitschiene, Schließkraft, Endschlag und Dämpfung, dazu die Regeln an Brandschutztüren.',
  h1: 'Türschließer: auswählen, einbauen, richtig einstellen',
  kurz: 'Ein Türschließer zieht die Tür nach dem Öffnen selbst zu. Mit Einbruchschutz hat er wenig zu tun, seine Aufgabe ist das verlässliche Schließen. Ob er richtig arbeitet, merkt man an Schließkraft, Endschlag und Dämpfung.',
  blick: [
    { titel: 'Schließkraft', text: 'passend zu Tür, Breite und Gewicht' },
    { titel: 'Endschlag', text: 'kurz vor dem Rahmen, nicht hart' },
    { titel: 'Dämpfung', text: 'bremst die Tür beim Öffnen' },
    { titel: 'Brandschutztür', text: 'eigene Regeln, Unterlagen zuerst' },
  ],
  abschnitte: [
    {
      titel: 'Bauarten: Gestänge oder Gleitschiene',
      absaetze: [
        'Beide Bauarten sitzen oben an der Tür. Das Gestänge führt einen Arm zum Rahmen. Die Gleitschiene verzichtet auf den Arm und läuft in einer Schiene oben an der Tür.',
        'Welche Bauart passt, entscheidet der Platz über dem Türblatt und die Öffnungsrichtung. Beides prüfen Sie vor dem Kauf.',
      ],
    },
    {
      titel: 'Schließkraft passend zu Türbreite und Gewicht',
      absaetze: [
        'Die Schließkraft muss zur Tür passen. Eine schwere oder breite Tür braucht mehr Kraft, sonst fällt sie nicht sicher zu. Ein zu starker Schließer schlägt dagegen hart zu und belastet Rahmen und Beschläge.',
        'Ob die Kraft passt, zeigt eine Probe an der Tür. Stimmt sie nicht, hilft oft nur ein anderer Schließer.',
      ],
    },
    {
      titel: 'Einstellen: Geschwindigkeit, Endschlag, Dämpfung',
      absaetze: [
        'Eingestellt werden meist drei Dinge: die Schließgeschwindigkeit, der Endschlag kurz vor dem Rahmen und die Dämpfung beim Öffnen. Jedes Modell hat dafür eigene Schrauben. Die Anleitung des Herstellers sagt, welche Schraube was bewirkt.',
        'Nicht alle Schrauben auf einmal verstellen. Immer nur kleine Schritte drehen und danach die Tür prüfen. So finden Sie die Einstellung, die zu Ihrer Tür passt.',
      ],
    },
    {
      titel: 'Feuer- und Rauchschutztüren',
      absaetze: [
        'An Feuer- und Rauchschutztüren gelten eigene Regeln. Welcher Schließer dort zulässig ist, geht aus den Unterlagen der Tür hervor. Vor einem Tausch sollten Sie diese Unterlagen prüfen.',
        'Ein Schließer zieht die Tür selbst zu, auch wenn niemand daran denkt. Er ersetzt aber keinen Rauchmelder. Für Rauch und Brand gehört eine eigene Seite: [Rauchmelder](/sicherheitstechnik/rauchmelder/).',
      ],
    },
  ],
  faq: [
    { frage: 'Warum knallt meine Tür trotz Türschließer?', antwort: 'Oft ist der Schließer zu stark eingestellt oder der Endschlag zu hart. Auch Zugluft durch offene Fenster kann die Tür zuwerfen. Prüfen Sie zuerst die Einstellung, bevor Sie ein Teil tauschen.' },
    { frage: 'Darf ich an einer Brandschutztür den Schließer selbst tauschen?', antwort: 'Das hängt von der Zulassung der Tür ab. Ohne Blick in die Unterlagen sollten Sie an einer Brandschutztür nichts verändern. Klären Sie vorher, welcher Schließer zugelassen ist.' },
    { frage: 'Gestänge oder Gleitschiene – was passt zu meiner Tür?', antwort: 'Das hängt vom Platz über dem Türblatt und von der Öffnungsrichtung ab. Welche Bauart passt, zeigt der Blick auf Tür und Rahmen. Bei Unsicherheit hilft ein Foto der Tür mit dem Rahmen.' },
  ],
  weiter: [
    { pfad: '/einbau-tresore/sicherheitstueren/', titel: 'Sicherheitstüren', text: 'Wenn die Tür selbst ersetzt werden soll.' },
    { pfad: '/einbruchschutz/tuerschloesser/', titel: 'Türschlösser', text: 'Schloss, Verriegelung und Schließblech im Zusammenhang.' },
    { pfad: '/sicherheitstechnik/rauchmelder/', titel: 'Rauchmelder', text: 'Melder für Rauch, unabhängig vom Schließer.' },
  ],
};
