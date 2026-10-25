// Leistungsseite Videoüberwachung (V03, Muster Türöffnung) – eigene Texte nach Themenpass /sicherheitstechnik/videoueberwachung/
// (src/konfig/themenpaesse.mjs). Keine Rechtsberatung, keine Paragrafen, keine Zahlen (K-010, Faktenblatt recht-video).
export default {
  titel: 'Videoüberwachung am Haus in Weilburg: Zweck zuerst',
  beschreibung: 'Kamera am Haus planen: erst den Zweck klären, dann Blickwinkel, Speicherung und Hinweise. Bei Grenzfragen hilft die Datenschutzaufsicht.',
  h1: 'Videoüberwachung am Haus in Weilburg und Umgebung',
  kurz: 'Eine Kamera braucht einen klaren Zweck: abschrecken, dokumentieren oder melden. Daraus folgen Blickwinkel, Speicherung und Hinweise. Bei Grenzfragen wenden Sie sich an die Datenschutzaufsicht Ihres Landes.',
  blick: [
    { titel: 'Zweck', text: 'abschrecken, dokumentieren oder melden' },
    { titel: 'Blickwinkel', text: 'eigenes Grundstück im Mittelpunkt' },
    { titel: 'Speicherung', text: 'Zugriff festlegen, Fristen am Zweck ausrichten' },
    { titel: 'Hinweis', text: 'Schild prüfen, Rechte Betroffener kennen' },
  ],
  abschnitte: [
    {
      titel: 'Zweck zuerst: abschrecken, dokumentieren, melden',
      absaetze: [
        'Bevor es um Geräte geht, steht die Frage: Was soll die Kamera leisten? Eine Kamera zum Abschrecken sitzt sichtbar, etwa am Hauseingang. Eine zum Dokumentieren braucht eine andere Auflösung und eine andere Speicherung.',
        'Soll eine Kamera Meldungen auslösen, gehört sie zur Alarmanlage. Die Einzelheiten stehen unter [Alarmanlagen](/sicherheitstechnik/alarmanlagen/).',
      ],
    },
    {
      titel: 'Blickwinkel und Grundstücksgrenze',
      absaetze: [
        'Die Kamera sollte den eigenen Eingang, die Einfahrt oder den Garten erfassen. Gehwege, Straßen und Nachbargrundstücke geraten leicht ins Bild, ohne dass man es will.',
        'Ein enger Ausschnitt ist leichter zu begründen als ein weiter. Das ersetzt keine Prüfung im Einzelfall, hilft aber bei der Planung.',
        'Schwenken und Zoomen verändern den Bereich nachträglich. Stellen Sie den Blickwinkel fest ein und prüfen Sie ihn am Monitor, bevor die Montage abgeschlossen ist.',
      ],
    },
    {
      titel: 'Speicherung und Zugriff',
      absaetze: [
        'Aufnahmen können auf einem Gerät im Haus, in einem Netzwerk oder bei einem Anbieter liegen. Jede Lösung hat eigene Zugriffe und eigene Fristen.',
        'Legen Sie fest, wer Aufnahmen sehen darf. Ein Passwort, das viele kennen, ist dafür keine Regel.',
        'Wie lange Aufnahmen bleiben, richtet sich nach dem Zweck, nicht nach dem verfügbaren Speicher.',
      ],
    },
    {
      titel: 'Hinweisschild und Rechte Betroffener',
      absaetze: [
        'Ob ein Hinweisschild nötig ist, hängt von Ort und Erfassungsbereich ab. Dazu gibt die Datenschutzaufsicht Auskunft.',
        'Wer auf Aufnahmen zu sehen ist, hat Rechte. Dazu zählt das Recht auf Auskunft über gespeicherte Daten. Ein klarer Hinweis, wer filmt, erleichtert solche Fragen.',
      ],
    },
  ],
  faq: [
    { frage: 'Darf meine Kamera den Gehweg erfassen?', antwort: 'Öffentlicher Raum ist heikel. Richten Sie die Kamera so aus, dass der Gehweg möglichst nicht erfasst wird. Im Zweifel fragen Sie die Datenschutzaufsicht.' },
    { frage: 'Wo werden die Aufnahmen gespeichert?', antwort: 'Das hängt vom System ab: auf einer Speicherkarte oder einem Rekorder im Haus, im Netzwerk oder bei einem Cloud-Anbieter. Entscheidend ist, wer Zugriff hat und wie lange die Aufnahmen bleiben.' },
    { frage: 'Braucht eine Kamera am Privathaus ein Hinweisschild?', antwort: 'Das hängt vom Einzelfall ab, vor allem davon, was die Kamera erfasst. Die Datenschutzaufsicht Ihres Landes beantwortet solche Fragen. Dieser Text ersetzt keine Rechtsberatung.' },
  ],
  weiter: [
    { pfad: '/sicherheitstechnik/alarmanlagen/', titel: 'Alarmanlagen', text: 'Wenn die Kamera Meldungen auslösen soll.' },
    { pfad: '/einbruchschutz/', titel: 'Einbruchschutz', text: 'Die Mechanik bleibt die erste Linie.' },
    { pfad: '/sicherheitstechnik/', titel: 'Sicherheitstechnik', text: 'Wie Mechanik und Elektronik zusammenspielen.' },
  ],
};
