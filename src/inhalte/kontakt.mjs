// Kontakt (V10) – eigene Texte nach Themenpass /kontakt/: Notfall per Telefon, Planbares per E-Mail-Vorlage.
// Keine Erfolgsmeldung (das Mail-Programm sendet, nicht die Website), kein Einwilligungs-Häkchen, kein Honeypot.
export default {
  titel: 'Kontakt: Schlüsseldienst in Weilburg erreichen',
  beschreibung: 'Im Notfall anrufen, Planbares per E-Mail: So erreichen Sie den Schlüsseldienst in Weilburg – mit Vorlage für Ihre Anfrage, Zeiten und Anschrift.',
  kicker: 'Kontakt',
  h1: 'Anrufen oder schreiben?',
  einleitung: 'Geht eine Tür nicht mehr auf, rufen Sie an. Alles, was warten kann – ein Schlosstausch, eine Beratung, eine Frage zur Rechnung –, schicken Sie uns am besten per E-Mail.',
  notfall: {
    titel: 'Notfall: anrufen',
    text: 'Ausgesperrt, Schlüssel abgebrochen oder nach einem Einbruch: Am Telefon klären wir Lage, Ort und Preis.',
  },
  planbar: {
    titel: 'Planbares: E-Mail mit Vorlage',
    text: 'Die Vorlage fragt nur, was wir für eine Antwort brauchen. Ihr E-Mail-Programm öffnet sich mit dem fertigen Text; Sie senden selbst.',
    link: 'Zur Vorlage',
  },
  composer: {
    titel: 'Ihre Anfrage',
    einleitung: 'Füllen Sie aus, was Sie wissen. Mit „E-Mail vorbereiten“ öffnet sich Ihr E-Mail-Programm – gesendet wird erst, wenn Sie dort auf Senden tippen.',
    anliegenTitel: 'Worum geht es?',
    // Briefkopf der Vorlage (nur mit JavaScript): Empfänger und Betreff, wie die vorbereitete E-Mail sie trägt
    kopf: { an: 'An', betreff: 'Betreff' },
    anliegen: [
      { wert: 'notfall', titel: 'Notfall jetzt', text: 'ausgesperrt, Einbruch, Schlüssel abgebrochen', betreff: 'Notfall' },
      { wert: 'planbar', titel: 'Planbare Arbeit', text: 'Schloss, Einbruchschutz, Tresor, Technik', betreff: 'Anfrage planbare Arbeit' },
      { wert: 'preis', titel: 'Frage zu Preis oder Rechnung', text: '', betreff: 'Frage zu Preis oder Rechnung' },
      { wert: 'sonstiges', titel: 'Etwas anderes', text: '', betreff: 'Anfrage' },
    ],
    notfallText: 'E-Mails lesen wir nicht sofort. Im Notfall rufen Sie bitte an – dann wissen Sie in wenigen Sätzen, wie es weitergeht.',
    felder: {
      ort: { titel: 'Ort oder Postleitzahl', hilfe: 'Daraus ergibt sich die Anfahrt.' },
      name: { titel: 'Ihr Name', hilfe: '' },
      rueckruf: { titel: 'Telefon für Rückfragen', hilfe: '' },
      zeitraum: { titel: 'Wann passt es Ihnen?', hilfe: 'z. B. „vormittags“ oder „ab nächster Woche“' },
      nachricht: { titel: 'Ihre Nachricht', hilfe: 'Was soll gemacht werden? Tür, Schloss oder Gerät kurz beschreiben.' },
    },
    warnung: 'Bitte senden Sie keine Tresor- oder Alarmcodes, keine Fotos von Schlüsseln und keine Zugangsdaten per E-Mail.',
    knopf: 'E-Mail vorbereiten',
    fehlerTitel: 'Bitte prüfen Sie diese Angaben',
    gekuerzt: 'Ihre Nachricht war für eine E-Mail-Vorlage zu lang und wurde gekürzt. Ergänzen Sie den Rest bitte direkt in der E-Mail.',
    ohneProgramm: 'Öffnet sich kein E-Mail-Programm, schreiben Sie uns direkt an',
    // nur in Vorschau-Builds sichtbar: Die Adresse ist noch ein Platzhalter (der Release-Build verweigert ihn)
    ohneAdresse: 'Die E-Mail-Adresse ist noch nicht eingetragen – deshalb öffnet sich noch kein E-Mail-Programm.',
  },
  zeiten: {
    titel: 'Erreichbarkeit',
    text: 'Die Zeiten gelten für das Telefon. Außerhalb davon hilft der Nachtdienst, sofern er angeboten wird; die Preise je Zeitfenster stehen auf der Preisseite.',
  },
  anschrift: {
    titel: 'Anschrift',
    text: 'Unser Betrieb sitzt in Weilburg an der Lahn. Von hier aus richten sich Anfahrt und Zonen.',
  },
  faq: [
    { frage: 'Kann ich einen Termin für eine Beratung per E-Mail vereinbaren?', antwort: 'Ja. Wählen Sie in der Vorlage „Planbare Arbeit“ und nennen Sie Ort und mögliche Zeiträume. Den Termin stimmen wir dann mit Ihnen ab.' },
    { frage: 'Warum soll ich keine Tresor- oder Alarmcodes per E-Mail senden?', antwort: 'Eine E-Mail kann unterwegs mitgelesen werden und bleibt in Postfächern gespeichert. Codes, Zugangsdaten und Fotos von Schlüsseln besprechen wir deshalb nur persönlich.' },
  ],
  weiter: [
    { pfad: '/preise/', titel: 'Preise', text: 'Gesamtpreise nach Zeitfenster und Zone.' },
    { pfad: '/einsatzgebiet/', titel: 'Einsatzgebiet', text: 'Ob und mit welcher Anfahrt wir zu Ihnen kommen.' },
    { pfad: '/ueber-uns/', titel: 'Über uns', text: 'Wer hinter dem Betrieb in Weilburg steht.' },
  ],
};
