// Gruppenseite Sicherheitstechnik (V02) – eigene Texte nach Themenpass /sicherheitstechnik/ (src/konfig/themenpaesse.mjs)
// und Szene I-04 „Grundriss mit Melderzonen“ mit vier Schritten. Keine Zahlen, Normen oder Zusagen zum Ablauf (K-010).
export default {
  titel: 'Sicherheitstechnik Weilburg: Alarm, Video, Rauchmelder',
  beschreibung: 'Alarmanlage, Videoüberwachung, Nebel und Rauchmelder aus Weilburg: Die Elektronik meldet, die Mechanik hält auf. Was wo passt.',
  kicker: 'Leistungsgruppe',
  h1: 'Sicherheitstechnik: Elektronik als Ergänzung zur Mechanik',
  einleitung: 'Alarm, Kamera, Nebel oder Rauchmelder: Welche Technik zu Ihrem Gebäude passt, hängt von Türen, Fenstern und Nutzung ab. Wir zeigen, was jede Lösung leistet – und wo sie nicht reicht.',
  registerTitel: 'Die Technik im Überblick',
  szene: {
    titel: 'Vom Grundriss zur Anlage',
    einleitung: 'Ein Grundriss zeigt, wo eine Anlage ansetzt: an den Öffnungen, in den Räumen und an den Fluchtwegen.',
    schritte: [
      { titel: 'Außenhaut', text: 'Öffnungsmelder an Tür und Fenstern melden das Öffnen. So erfährt die Anlage davon, bevor jemand im Raum ist. Mehr zu Meldern und Zentrale unter [Alarmanlagen](/sicherheitstechnik/alarmanlagen/).' },
      { titel: 'Innenraum', text: 'Bewegungsmelder in Fluren und großen Räumen bilden die zweite Linie. Sie greifen, wenn jemand die Außenhaut schon überwunden hat.' },
      { titel: 'Brand', text: 'Rauchwarnmelder gehören dorthin, wo geschlafen wird und Fluchtwege verlaufen. Welche Pflicht gilt, steht im [Ratgeber zur Rauchmelderpflicht](/ratgeber/rauchmelderpflicht/). Zur Auswahl und Montage geht es zu [Rauchmelder](/sicherheitstechnik/rauchmelder/).' },
      { titel: 'Alarmierung', text: 'Die Zentrale nimmt jede Meldung auf. Eine Sirene macht den Alarm hörbar, und eine Benachrichtigung erreicht die Personen, die Sie benennen. Wer wann was erfährt, legen Sie vorab fest.' },
    ],
  },
  abschnitte: [
    {
      titel: 'Mechanik hält auf, Elektronik meldet',
      absaetze: [
        'Eine Alarmanlage meldet einen Einbruch. Sie hält ihn nicht auf. Das leisten Schloss, Zylinder, Beschläge und Fenstersicherung.',
        'Deshalb kommt die Mechanik zuerst. Wer nur Melder setzt, bemerkt einen Einbruch – aufhalten muss ihn die Mechanik. Die Grundlagen stehen unter [Einbruchschutz](/einbruchschutz/).',
      ],
    },
    {
      titel: 'Sehen: Kamera',
      absaetze: [
        'Eine Kamera beantwortet zuerst eine Frage: Was soll sie sehen? Eingang, Einfahrt und Grundstück verlangen jeweils andere Blickwinkel.',
        'Der Zweck kommt vor der Technik. Datenschutz gehört von Anfang an dazu, nicht als Zusatz am Ende. Was eine Kamera erfasst, bestimmt, welche Regeln gelten.',
        'Mehr dazu auf der Seite [Videoüberwachung](/sicherheitstechnik/videoueberwachung/).',
      ],
    },
    {
      titel: 'Verzögern: Nebel',
      absaetze: [
        'Ein Nebelsystem nimmt in einem Raum die Sicht. Wer drin ist, sieht kaum noch etwas und kommt langsamer voran.',
        'Das verschafft Zeit, ersetzt aber weder Tür noch Alarmanlage. Wie beides zusammenspielt, zeigt die Seite [Alarmanlagen](/sicherheitstechnik/alarmanlagen/).',
        'Ob ein solches System an Ihrem Ort zulässig ist, klären Sie vorab. Details stehen auf der Seite [Nebelsysteme](/sicherheitstechnik/nebelsysteme/).',
      ],
    },
  ],
  faq: [
    { frage: 'Ersetzt eine Alarmanlage den mechanischen Schutz?', antwort: 'Nein. Eine Alarmanlage meldet einen Einbruch, sie hält ihn nicht auf. Dafür sorgen Schloss, Zylinder und Fenstersicherung – die Grundlagen stehen unter [Einbruchschutz](/einbruchschutz/).' },
    { frage: 'Welche Technik passt zu einer Mietwohnung?', antwort: 'Oft sind es Melder an der Wohnungstür und an den Fenstern, dazu Rauchwarnmelder in Schlaf- und Flurbereichen. Funkmelder kommen ohne neue Kabel aus. Was außen am Haus erlaubt ist, klären Sie vorab mit der Vermieterin oder dem Vermieter.' },
    { frage: 'Lassen sich Alarm, Kamera und Rauchmelder verbinden?', antwort: 'Viele Systeme lassen sich über eine gemeinsame Zentrale verbinden. Ob einzelne Geräte zusammenpassen, hängt vom System ab. Das lässt sich vor dem Kauf prüfen.' },
  ],
  weiter: [
    { pfad: '/sicherheitstechnik/alarmanlagen/', titel: 'Alarmanlagen', text: 'Melder, Zentrale und Sirene – und was davon zu Ihrem Gebäude passt.' },
    { pfad: '/ratgeber/alarmanlage-planen/', titel: 'Alarmanlage planen', text: 'Welche Fragen Sie vor dem Kauf klären sollten.' },
    { pfad: '/einbruchschutz/', titel: 'Einbruchschutz', text: 'Die mechanische Sicherung, auf der jede Anlage aufbaut.' },
  ],
  schluss: {
    titel: 'Erst die Frage, dann die Technik.',
    text: 'Erzählen Sie uns, was Sie schützen wollen und wo. Welche Technik dazu passt, hängt vom Gebäude ab.',
    link: { text: 'Kontakt aufnehmen', pfad: '/kontakt/' },
  },
};
