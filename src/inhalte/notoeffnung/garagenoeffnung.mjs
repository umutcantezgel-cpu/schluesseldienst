// Leistungsseite Garagenöffnung (V03, Detailseite) – eigene Texte nach Themenpass /notoeffnung/garagenoeffnung/
// (src/konfig/themenpaesse.mjs). Blickwinkel: Tortypen und Notentriegelung als Selbsthilfe, dann Fachbetrieb.
// Keine Zahlen, Normen oder Zeitangaben im Text (K-010); keine Reparaturzusage ohne Bestätigung des Betriebs.
export default {
  titel: 'Garagentor öffnen lassen in Weilburg: Tor klemmt oder ist zu',
  beschreibung: 'Garagentor klemmt oder der Antrieb streikt? Torarten, Notentriegelung und die Frage, wann ein Fachbetrieb nötig ist – in Weilburg und Umgebung.',
  h1: 'Garagentor öffnen: Notentriegelung, Antrieb, Schloss',
  kurz: 'Die Notentriegelung ist der erste Weg, den Sie selbst prüfen können. Bleibt das Tor zu, klären wir vor Ort, woran es hängt.',
  figurText: 'Tür, Auto, Garage und Tresor nebeneinander; hervorgehoben ist die Garage.',
  blick: [
    { titel: 'Notentriegelung', text: 'erster Weg, den Sie selbst prüfen können' },
    { titel: 'Torart', text: 'bestimmt, wie sich das Tor entriegeln lässt' },
    { titel: 'Antrieb', text: 'Reparatur nur nach Prüfung vor Ort' },
    { titel: 'Schloss', text: 'Tausch nach dem Öffnen besprechen wir' },
  ],
  abschnitte: [
    {
      titel: 'Tortypen: Schwing-, Sektional-, Roll- und Flügeltor',
      absaetze: [
        'Die Bauart bestimmt, wie sich das Tor bewegt und wo die Notentriegelung sitzt. Typisch sind diese vier:',
      ],
      liste: [
        'Schwingtor: schwingt in einem Bogen nach oben in den Raum.',
        'Sektionaltor: läuft in mehreren Segmenten an der Decke entlang.',
        'Rolltor: wird über der Öffnung in einen Wickelkasten aufgerollt.',
        'Flügeltor: schwenkt wie zwei Türflügel auf.',
      ],
    },
    {
      titel: 'Notentriegelung von innen und außen',
      absaetze: [
        'Die Notentriegelung trennt das Tor vom Antrieb, damit es sich von Hand bewegen lässt. Sie sitzt meist innen, am Antrieb oder an der Führung. Die Bedienungsanleitung zeigt die genaue Stelle.',
        'Von außen hilft oft nur das Schloss. Ob Ihr Tor eines hat und ob es sich öffnen lässt, sehen wir vor Ort.',
      ],
    },
    {
      titel: 'Defekter Antrieb oder verlorene Fernbedienung',
      absaetze: [
        'Fällt der Antrieb aus, kann die Ursache in der Steuerung, im Strom oder in der Mechanik liegen. Ohne Prüfung vor Ort lässt sich das nicht sagen.',
        'Eine verlorene Fernbedienung bekommen Sie in der Regel über den Torhersteller oder einen Fachbetrieb. Ob und was am Antrieb repariert werden kann, besprechen wir mit Ihnen, bevor etwas gemacht wird.',
      ],
    },
    {
      titel: 'Schloss danach tauschen',
      absaetze: [
        'Ist das Schloss beschädigt, besprechen wir einen Tausch, bevor Sie das Tor wieder nutzen. Ersatzteile nennen wir vorher; sie kommen gesondert dazu.',
        'Mehr zu Schlössern für Türen und Tore finden Sie unter [Türschlösser](/einbruchschutz/tuerschloesser/).',
      ],
    },
  ],
  preis: {
    text: 'Der Gesamtpreis für eine Garage steht in der Tabelle, bezogen auf das Kerngebiet. Anfahrtszuschläge je Zone stehen auf der [Preisseite](/preise/).',
    positionen: ['garage'],
  },
  faq: [
    { frage: 'Wo finde ich die Notentriegelung meines Garagentors?', antwort: 'Meist im Innenraum, am Antrieb oder an der Führung der Schiene. Finden Sie nichts, rufen Sie uns an; wir schauen vor Ort nach.' },
    { frage: 'Was tun, wenn der Torantrieb bei Stromausfall streikt?', antwort: 'Dann hilft oft die Notentriegelung. Bewegen Sie das Tor per Hand nur, wenn es frei läuft und niemand darunter steht.' },
    { frage: 'Können Sie auch das Schloss am Schwingtor erneuern?', antwort: 'Ob ein Schloss am Schwingtor getauscht werden kann, sehen wir vor Ort. Den Ersatzteilpreis nennen wir Ihnen vorher, bevor etwas eingebaut wird.' },
    { frage: 'Öffnen Sie auch Hallentore von Betrieben?', antwort: 'Ja, wenn ein Auftrag oder eine Vollmacht der Inhaberin, des Inhabers oder der Geschäftsführung vorliegt. Die Rechnung geht dann an den Betrieb.' },
  ],
  weiter: [
    { pfad: '/notoeffnung/', titel: 'Notöffnung im Überblick', text: 'Tür, Auto, Garage und Tresor nach Objekt sortiert.' },
    { pfad: '/preise/', titel: 'Preise', text: 'Gesamtpreise im Kerngebiet und Zuschläge je Zone.' },
    { pfad: '/einbruchschutz/tuerschloesser/', titel: 'Türschlösser', text: 'Schlösser, die sich tauschen oder nachrüsten lassen.' },
  ],
};
