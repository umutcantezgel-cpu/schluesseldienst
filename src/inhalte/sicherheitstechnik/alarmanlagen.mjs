// Leistungsseite Alarmanlagen (V03, Muster Türöffnung) – eigene Texte nach Themenpass /sicherheitstechnik/alarmanlagen/
// (src/konfig/themenpaesse.mjs). Keine Zahlen, Normen, Preise oder Zusagen außerhalb der Konfiguration (K-010).
import { platzhalter } from '../../../bau/lib/platzhalter.mjs';

// Ob der Betrieb eine Aufschaltung anbietet, ist nicht bestätigt. Bis dahin steht die Aussage als Platzhalter (Themenpass, Vorsicht).
const aufschaltung = platzhalter('sicherheit.aufschaltung', 'Zusage bestätigen: Aufschaltung über den Betrieb, ja oder nein');

export default {
  titel: 'Alarmanlage einbauen lassen in Weilburg: Funk oder Kabel',
  beschreibung: 'Alarmanlage einbauen lassen in Weilburg: Außenhaut- und Innenraumschutz, Funk oder Kabel und die Frage, wer im Alarmfall reagiert.',
  h1: 'Alarmanlage einbauen lassen in Weilburg und Umgebung',
  kurz: 'Eine Alarmanlage, auch Einbruchmeldeanlage genannt, meldet einen Einbruch. Aufhalten muss ihn die Mechanik an Tür und Fenster. Ob Funk oder Kabel passt, hängt vom Gebäude ab, und vorab legen Sie fest, wer benachrichtigt wird.',
  figurText: 'Grundriss mit Öffnungsmeldern, Bewegungsbereichen, Rauchmeldern, Zentrale und Sirene.',
  blick: [
    { titel: 'Außenhaut', text: 'Öffnungsmelder an Türen und Fenstern' },
    { titel: 'Innenraum', text: 'Bewegungsmelder in Fluren und Räumen' },
    { titel: 'Funk oder Kabel', text: 'Funk ohne Verlegung, Kabel mit Leitungen' },
    { titel: 'Alarmfall', text: 'Sirene und Benachrichtigung, vorab festgelegt' },
  ],
  abschnitte: [
    {
      titel: 'Außenhaut- und Innenraumschutz',
      absaetze: [
        'Die Außenhaut ist die Hülle des Gebäudes. Öffnungsmelder an Türen und Fenstern melden, sobald sich ein Flügel öffnet. Sie sehen aber nicht, wer schon im Raum steht.',
        'Der Innenraumschutz setzt dahinter an. Bewegungsmelder in Fluren und großen Räumen erkennen Bewegung. Sie greifen, wenn jemand die Außenhaut schon überwunden hat.',
        'Welche Kombination passt, hängt von Türen, Fenstern und Nutzung ab. Ein Keller mit kleinem Fenster braucht etwas anderes als eine Wohnung im Obergeschoss. Die Mechanik bleibt die erste Linie, siehe [Einbruchschutz](/einbruchschutz/).',
      ],
    },
    {
      titel: 'Funk oder Kabel',
      absaetze: [
        'Bei einer Kabelanlage werden Melder und Zentrale über Leitungen verbunden. Im Neubau ist das gut planbar. Im bewohnten Haus bedeutet es oft mehr Aufwand, weil Leitungen durch Wände und Decken müssen.',
        'Eine Funkalarmanlage kommt ohne Verlegung aus. Sie braucht Batterien und einen Standort, an dem die Funkverbindung sicher steht. Den prüft man vor dem Einbau, nicht danach.',
        'Beides hat seine Berechtigung. Die Entscheidung fällt am Gebäude, nicht an der Technik allein.',
      ],
    },
    {
      titel: 'Wer reagiert: Sirene, Benachrichtigung, Aufschaltung',
      absaetze: [
        'Eine Sirene macht den Alarm hörbar. Sie kann auch Nachbarn aufmerksam machen.',
        'Eine Benachrichtigung erreicht die Personen, die Sie benennen. Wer wann reagiert, legen Sie vorab fest.',
        ['Eine Aufschaltung leitet die Meldung an eine Leitstelle weiter. Das ist eine eigene Vereinbarung mit einem Anbieter. ', aufschaltung],
      ],
    },
    {
      titel: 'Fehlalarme vermeiden',
      absaetze: [
        'Melder, die falsch ausgerichtet sind, lösen leichter Fehlalarme aus. Zugluft, Heizkörper und bewegliche Vorhänge im Blickfeld können dasselbe bewirken.',
        'Haustiere gehören von Anfang an in die Planung. Melder mit Haustierfunktion reagieren am Boden weniger stark, ersetzen aber nicht die richtige Montage.',
      ],
    },
  ],
  faq: [
    { frage: 'Was ist der Unterschied zwischen Außenhaut- und Innenraumschutz?', antwort: 'Die Außenhaut meldet das Öffnen von Türen und Fenstern. Der Innenraumschutz meldet Bewegung im Raum. Beides ergänzt sich, ersetzt aber nicht die Mechanik an Tür und Fenster.' },
    { frage: 'Funk oder Kabel – was ist zuverlässiger?', antwort: 'Keine Technik ist für jedes Haus die bessere. Kabel verlangt Leitungen durch das Gebäude, Funk braucht Batterien und einen guten Funkweg. Das Gebäude entscheidet.' },
    { frage: 'Wer kommt, wenn die Anlage nachts auslöst?', antwort: 'Vorab legen Sie fest, wer benachrichtigt wird und wer prüft, ob es ein Ernstfall ist. Bei Gefahr wählen Sie zuerst den Notruf.' },
    { frage: 'Wie verhindere ich Fehlalarme durch Haustiere?', antwort: 'Ja, das lässt sich eingrenzen. Entscheidend sind Montagehöhe, Blickfeld und Ausrichtung. Ob es im Alltag passt, zeigt ein Probelauf mit den Tieren im Haus.' },
  ],
  weiter: [
    { pfad: '/ratgeber/alarmanlage-planen/', titel: 'Alarmanlage planen', text: 'Die Planung im Detail, bevor der Einbau beginnt.' },
    { pfad: '/sicherheitstechnik/videoueberwachung/', titel: 'Videoüberwachung', text: 'Kameras für Eingang und Grundstück, mit Blick auf Datenschutz.' },
    { pfad: '/sicherheitstechnik/nebelsysteme/', titel: 'Nebelsysteme', text: 'Sicherheitsnebel als Ergänzung, mit Blick auf Rückstände.' },
  ],
};
