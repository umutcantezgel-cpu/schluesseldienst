// Leistungsseite Nebelsysteme (V03, Muster Türöffnung) – eigene Texte nach Themenpass /sicherheitstechnik/nebelsysteme/
// (src/konfig/themenpaesse.mjs). Keine Sekundenangaben, keine Gesundheitsversprechen, keine Superlative (K-010).
export default {
  titel: 'Nebelsystem als Einbruchschutz in Weilburg',
  beschreibung: 'Sicherheitsnebel für Laden, Lager oder Haus: was er leistet, wie er an die Alarmanlage gekoppelt wird und was offen ist.',
  h1: 'Nebelsystem als Einbruchschutz: Sicht nehmen statt Tür halten',
  kurz: 'Ein Nebelsystem nimmt Eindringlingen im Raum die Sicht. Es hält keine Tür auf und ersetzt keine Alarmanlage. Ob es passt, entscheiden der Raum und das, was darin liegt.',
  blick: [
    { titel: 'Prinzip', text: 'Sicht nehmen statt Tür halten' },
    { titel: 'Kopplung', text: 'meist über Melder der Alarmanlage' },
    { titel: 'Einsatzorte', text: 'Laden, Lager oder einzelne Räume' },
    { titel: 'Rückstände', text: 'Datenblatt des Herstellers vorher lesen' },
  ],
  abschnitte: [
    {
      titel: 'Prinzip und Grenzen',
      absaetze: [
        'Ein Nebelgerät füllt einen Raum in kurzer Zeit mit dichtem Nebel. Wer drin ist, sieht kaum noch etwas und findet sich schlechter zurecht.',
        'Die Wirkung bleibt auf den Raum beschränkt, in dem das Gerät steht. Fenster, Türen und Nischen außerhalb davon brauchen eigene Sicherung.',
        'Nebel verschafft Zeit, ersetzt aber weder Tür noch Fenstersicherung. Er ist eine Ergänzung zur Mechanik.',
      ],
    },
    {
      titel: 'Kopplung an die Alarmanlage',
      absaetze: [
        'Nebelgeräte werden meist über Melder ausgelöst, die mit einer Alarmanlage verbunden sind. So wirkt der Nebel, wenn die Anlage Alarm meldet.',
        'Wie die Kopplung aussieht, hängt von Gerät und Anlage ab. Beide Teile müssen zueinander passen. Die Grundlagen zur Anlage stehen unter [Alarmanlagen](/sicherheitstechnik/alarmanlagen/).',
      ],
    },
    {
      titel: 'Einsatzorte: Laden, Lager, Wohnung',
      absaetze: [
        'Im Laden ist die Ware das Ziel, im Lager sind es Regale und Maschinen. In der Wohnung geht es meist um Wertsachen und einzelne Räume im Erdgeschoss.',
        'Je nach Raum ändert sich, was der Nebel schützt und was er verschmutzt. Das ist die eigentliche Planungsfrage.',
      ],
    },
    {
      titel: 'Rückstände und Gesundheit',
      absaetze: [
        'Nebel hinterlässt einen Rückstand, der sich auf Oberflächen absetzt. Wie stark das ist und welche Stoffe enthalten sind, steht im Sicherheitsdatenblatt des Herstellers.',
        'Gesundheitliche Fragen beantwortet dieser Text nicht. Lesen Sie das Datenblatt vor einer Entscheidung und klären Sie Vorerkrankungen mit Ihrer Ärztin oder Ihrem Arzt.',
      ],
    },
  ],
  faq: [
    { frage: 'Schadet der Nebel Waren oder Elektronik?', antwort: 'Der Rückstand kann Waren, Oberflächen und Geräte verschmutzen. Wie stark, hängt vom Gerät, vom Raum und von der Ware ab. Das Datenblatt des Herstellers gibt Auskunft, bevor Sie sich entscheiden.' },
    { frage: 'Löst der Nebel ohne Alarmanlage aus?', antwort: 'Ob ein Gerät ohne Anschluss an eine Anlage auslöst, hängt vom Modell und vom Aufbau ab. Fragen Sie vor dem Kauf nach, wie die Auslösung funktioniert.' },
    { frage: 'Ist Sicherheitsnebel in Wohnungen sinnvoll?', antwort: 'Das kommt auf die Wohnung und den Raum an. Für viele Wohnungen ist eine Alarmanlage der naheliegendere Schritt. Nebel passt eher zu Räumen mit Ware oder Wertsachen.' },
  ],
  weiter: [
    { pfad: '/sicherheitstechnik/alarmanlagen/', titel: 'Alarmanlagen', text: 'Die Anlage, an die der Nebel gekoppelt wird.' },
    { pfad: '/ratgeber/alarmanlage-planen/', titel: 'Alarmanlage planen', text: 'Planung im Detail, Melder und Zentrale.' },
    { pfad: '/sicherheitstechnik/', titel: 'Sicherheitstechnik', text: 'Alarm, Video, Nebel und Rauchmelder im Überblick.' },
  ],
};
