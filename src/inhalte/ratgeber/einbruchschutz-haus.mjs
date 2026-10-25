// Ratgeber-Artikel: Einbruchschutz am Haus. Eigene Texte nach Themenpass (Kern: Rundgang ums Haus mit
// Prioritätenliste). Zahlen nur aus statistik-einbruch, Normaussagen nur aus norm-nachruestung. Zu Zugangswegen
// und zur Wirkung von Beleuchtung gibt es keinen belegten Fakt; der Text sagt das offen.
import statistik from '../fakten/statistik-einbruch.mjs';
import nachruestung from '../fakten/norm-nachruestung.mjs';

export default {
  titel: 'Einbruchschutz Haus: Rundgang um alle Zugänge',
  beschreibung: 'Einbruchschutz am Einfamilienhaus: Rundgang um alle Zugänge mit Haustür, Terrassentür, Fenstern, Keller und Garage, und eine Reihenfolge für die Prüfung.',
  kategorie: 'vorbeugen',
  kurztitel: 'Einbruchschutz Haus',
  h1: 'Einbruchschutz am Einfamilienhaus',
  kurz: 'Ein Einfamilienhaus sichern Sie mit einem festen Rundgang: Gehen Sie alle Zugänge ab und prüfen Sie jeden einzeln. Zuerst kommen Zugänge, die leicht erreichbar sind und schwach verriegelt wirken. Notieren Sie das Ergebnis, damit Sie beim nächsten Rundgang Veränderungen sehen.',
  stand: '2026-10-25',
  figur: 'grundriss',
  figurText: 'Schematischer Grundriss mit Fenstern und Außentür: Jeder Zugang gehört auf den Rundgang.',
  wichtig: [
    'Gehen Sie einmal ganz ums Haus und notieren Sie jeden **Zugang**.',
    'Prüfen Sie Terrassentür und Fenster auf **Verriegelung**, bevor Sie an Zusatzsicherungen denken.',
    'Die Verbindungstür zur **Garage** gehört in den Rundgang wie jede andere Tür.',
  ],
  abschnitte: [
    {
      titel: 'Rundgang: alle Zugänge',
      absaetze: [
        'Gehen Sie einmal ganz ums Haus und notieren Sie jeden Zugang: Haustür, Terrassentür, Kellertür, Garagentür, Fenster und Lichtschächte. Gehen Sie den Rundgang einmal bei Tag und einmal im Dunkeln ab. So sehen Sie, was von außen gut einsehbar ist.',
        'Prüfen Sie jeden Zugang mit drei Fragen. Wie ist er verriegelt? Wer kann ihn von der Straße oder vom Nachbargrundstück aus sehen? Ist er bei Ihrer Abwesenheit wirklich geschlossen?',
        ['Zur Einordnung: ', statistik.fakten['bund-faelle'], ' ', statistik.fakten['bund-begriff'], ' Für Einfamilienhäuser liegt uns keine eigene Zahl vor.'],
      ],
    },
    {
      titel: 'Terrassentür und Fenster',
      absaetze: [
        'Bei Terrassentüren prüfen Sie die Verriegelung im Rahmen und, bei einer Schiebetür, die Laufschiene. Ein Blick auf beides zeigt, ob etwas locker ist.',
        'Fenster prüfen Sie auf Verriegelung und Zustand der Beschläge. Lassen Sie Fenster beim Verlassen des Hauses ganz geschlossen und verriegelt.',
        ['Für Fenster und Terrassentüren kommen auch Nachrüstprodukte in Frage. ', nachruestung.fakten['teil2-titel'], ' Fragen Sie den Hersteller, ob sein Produkt dazugehört.'],
      ],
      liste: [
        'Schiebetür: Läuft sie leicht, und greift der Riegel sauber in den Rahmen?',
        'Fenster: Schließt der Flügel ohne Kraft, und greift die Verriegelung?',
        'Kippstellung: Ist das Fenster nur gekippt, wenn Sie lüften, und sonst verschlossen?',
        'Schlüssel: Liegt einer griffbereit, wenn Sie nicht da sind?',
      ],
    },
    {
      titel: 'Keller, Garage, Nebeneingänge',
      absaetze: [
        'Kellerzugänge gehören in den Rundgang wie jede andere Tür. Prüfen Sie Schloss, Rahmen und Verriegelung.',
        'Die Verbindungstür zur Garage führt ins Haus. Behandeln Sie sie deshalb wie eine Haustür.',
        'Eine Garage kann eine Seitentür oder ein Tor mit Antrieb haben. Prüfen Sie jeden dieser Zugänge einzeln.',
      ],
      liste: [
        'Kellerfenster: verschlossen und verriegelt?',
        'Kellertür: Schloss und Rahmen in Ordnung?',
        'Garagentor: verschlossen, wenn Sie nicht da sind?',
        'Nebeneingänge: Wer hat dort noch einen Schlüssel?',
        'Lichtschacht: Ist ein Deckel oder ein Gitter vorhanden?',
      ],
    },
    {
      titel: 'Beleuchtung und Sicht',
      absaetze: [
        'Ein Zugang, den Nachbarn oder Passanten einsehen können, ist für Sie leichter im Blick. Ein dunkler, verdeckter Zugang ist das Gegenteil.',
        'Ein Bewegungsmelder schaltet Licht ein, wenn sich jemand nähert. Ob er bei Ihnen etwas bringt, hängt vom Standort ab. Eine belegte Zahl dazu haben wir nicht.',
        'Hecken und Büsche verdecken Zugänge. Schneiden Sie sie so zurück, dass Haustür und Fenster vom Weg aus gut zu sehen sind.',
      ],
      liste: [
        'Ist der Zugang von der Straße aus zu sehen?',
        'Stehen Leitern, Gartenmöbel oder Ähnliches so am Haus, dass man daran hochkommt?',
      ],
    },
    {
      titel: 'Prioritäten nach Aufwand und Wirkung',
      absaetze: [
        'Abschließen und Verriegeln lassen sich ohne Umbau umsetzen. Beginnen Sie damit, bevor Sie größere Schritte planen.',
        'Wenn die Prüfung fehlende oder lockere Verriegelungen zeigt, lohnt sich eine Nachrüstung an genau dieser Stelle zuerst.',
        'Schreiben Sie die Liste in zwei Spalten: Was sofort geht, und was einen Fachbetrieb braucht. So sehen Sie, womit Sie anfangen können.',
      ],
      schritte: [
        'Zugänge aus dem Rundgang auflisten und die leicht erreichbaren markieren.',
        'Verriegelungen und Schlösser prüfen. Lockeres lassen Sie vom Fachbetrieb richten.',
        'Fenster und Terrassentür nachrüsten, wenn die Prüfung das nahelegt.',
        'Keller, Garage und Nebeneingänge danach in derselben Form prüfen.',
      ],
      hinweis: { art: 'info', text: 'Unsere Preise stehen offen auf der [Preisseite](/preise/).' },
    },
  ],
  faq: [
    { frage: 'Welcher Zugang wird an Einfamilienhäusern am häufigsten angegriffen?', antwort: 'Eine belegte Rangfolge haben wir nicht. Die Fakten, auf die wir uns stützen, nennen Fallzahlen, aber keine Zugangswege, deshalb prüfen Sie alle Zugänge. Die Prüfung im Rundgang zeigt Ihnen, wo Ihr Haus Lücken hat.' },
    { frage: 'Bringt Außenbeleuchtung mit Bewegungsmelder etwas?', antwort: 'Dazu haben wir keine belegte Zahl. Der Standort zählt: Die Leuchte sollte den Zugang erfassen, den Sie absichern wollen. Ein Bewegungsmelder wirkt nur in seinem Erfassungsbereich.' },
    { frage: 'Wie sichere ich die Verbindungstür zur Garage?', antwort: 'Behandeln Sie sie wie eine Haustür und lassen Sie Schloss, Zylinder und Rahmen prüfen. Halten Sie die Tür verschlossen, auch wenn das Garagentor offen steht. Bewahren Sie Schlüssel nicht sichtbar am Garagentor auf.' },
  ],
  weiter: [
    { pfad: '/einbruchschutz/fenstersicherung/', titel: 'Fenstersicherung', text: 'Verriegelung, Griffe und Zusatzsicherungen für Fenster und Terrassentüren.' },
    { pfad: '/einbruchschutz/tuersicherung/', titel: 'Türsicherung', text: 'Bandseite, Schließblech und Kellertüren prüfen und verstärken.' },
    { pfad: '/einbau-tresore/sicherheitstueren/', titel: 'Sicherheitstüren', text: 'Einbruchhemmende Haus- und Wohnungstüren, nach Widerstandsklasse eingebaut.' },
  ],
};
