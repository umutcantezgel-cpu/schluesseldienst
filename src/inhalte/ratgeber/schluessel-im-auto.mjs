// Ratgeber-Artikel: Schlüssel im Auto eingeschlossen. Eigene Texte nach Themenpass (Kern: Wege vergleichen –
// Zweitschlüssel, Hersteller-Dienste, Pannendienst, Schlüsseldienst – und vor Draht und Keil warnen).
// Keine Anleitung zum Öffnen eines Fahrzeugs. Notrufnummern nur als Fakt aus dem Faktenblatt notrufnummern.
import nr from '../fakten/notrufnummern.mjs';

export default {
  titel: 'Schlüssel im Auto eingeschlossen: was jetzt hilft',
  beschreibung: 'Schlüssel im Auto eingeschlossen? Welche Wege es gibt, warum Draht und Keil schaden und wann Sie sofort den Notruf wählen sollten.',
  kategorie: 'notfall',
  kurztitel: 'Schlüssel im Auto',
  h1: 'Schlüssel im Auto eingeschlossen',
  kurz: 'Autoschlüssel im Wagen eingesperrt? Prüfen Sie zuerst Zweitschlüssel und die Dienste des Herstellers oder Pannendienstes, erst danach lohnt ein Fachbetrieb. Verzichten Sie auf Draht und Keil, denn sie können Lack und Dichtungen beschädigen.',
  stand: '2026-10-25',
  wichtig: [
    'Prüfen Sie zuerst einen **Zweitschlüssel** und die Dienste des Herstellers.',
    'Verzichten Sie auf **Draht** oder Keil, denn sie können Lack und Dichtungen beschädigen.',
    'Ist ein Kind oder ein **Tier** im Auto, geht der Notruf vor.',
  ],
  abschnitte: [
    {
      titel: 'Zweitschlüssel und Hersteller-Dienste',
      absaetze: [
        'Ein Zweitschlüssel bei Partner, Familie oder einer vertrauten Person kann die Lage schnell lösen. Fragen Sie deshalb zuerst dort nach, bevor Sie einen Dienst beauftragen.',
        'Ein Zweitschlüssel, der im Wagen liegt, nützt Ihnen dagegen nichts.',
        'Manche Hersteller bieten Dienste über eine App an, mit denen sich das Fahrzeug aus der Ferne öffnen lässt. Ob Ihr Modell dazugehört, steht im Handbuch oder beim Hersteller.',
        'Prüfen Sie auch, ob ein Ersatzschlüssel in der Wohnung oder im Büro liegt. Manchmal liegt er dort, wo man ihn nie vermutet.',
      ],
      liste: [
        'Zweitschlüssel bei Partner, Familie oder Freunden',
        'Dienste des Herstellers über eine App, falls Ihr Modell sie hat',
        'Ihre Versicherung, falls Ihr Vertrag eine Hilfe enthält',
      ],
    },
    {
      titel: 'Pannendienst oder Schlüsseldienst',
      absaetze: [
        'Ein Pannendienst kann je nach Vertrag helfen. Ob er das Öffnen eines verschlossenen Fahrzeugs übernimmt, steht in Ihren Unterlagen oder lässt sich beim Anbieter erfragen. Nicht jeder Vertrag umfasst diesen Fall.',
        'Ein Schlüsseldienst rechnet den Einsatz selbst ab. Fragen Sie vor dem Auftrag nach dem Gesamtpreis, mit Anfahrt, etwaigen Zuschlägen und Mehrwertsteuer.',
        'Vergleichen Sie Angebote nach dem Gesamtpreis und nicht nach einem „ab“-Preis am Telefon. Verlangen Sie eine Rechnung mit allen Positionen, so sehen Sie später, was die Öffnung und was die Anfahrt gekostet hat.',
        'Notieren Sie Fahrzeug, Standort und Uhrzeit. Diese Angaben helfen Ihnen, die Rechnung später zu prüfen.',
        'Wie Sie unseriöse Anbieter erkennen, zeigt der Ratgeber zu [Abzocke erkennen](/ratgeber/schluesseldienst-abzocke-erkennen/).',
      ],
      hinweis: { art: 'info', text: 'Unsere Preise stehen offen auf der [Preisseite](/preise/). Die Leistung für Fahrzeuge finden Sie unter [Autoöffnung](/notoeffnung/autooeffnung/).' },
    },
    {
      titel: 'Warum Draht und Keil Schaden anrichten',
      absaetze: [
        'Drahtbügel und Keile wirken einfach, sind aber nicht für das Öffnen eines Fahrzeugs gebaut. Lack, Dichtungen und Scheibenkanten können dabei beschädigt werden.',
        'Moderne Fahrzeuge haben Kabel, Sensoren und Elektronik in den Türen. Ein Eingriff kann Folgeschäden verursachen, die deutlich teurer werden können als eine fachgerechte Öffnung.',
        'Ein Fachbetrieb arbeitet mit Werkzeug für Fahrzeuge. Das senkt das Risiko eines Schadens, verhindert ihn aber nicht.',
        'Auch ein erfolgloser Versuch kann Spuren am Lack oder an den Dichtungen hinterlassen.',
        'Fragen Sie am Telefon nach den Schritten, die der Betrieb für Ihr Modell vorsieht.',
        'Fragen Sie den Betrieb, wie er vorgeht, bevor er beginnt. Dann wissen Sie, welche Schäden möglich sind und wie er sie vermeidet.',
      ],
      hinweis: { art: 'warnung', text: 'Probieren Sie nicht selbst mit Draht oder Keil. Auch ein kurzer Versuch kann Schäden verursachen.' },
    },
    {
      titel: 'Kind oder Tier im Auto',
      absaetze: [
        ['Zeigt ein Kind Anzeichen einer Verletzung oder wirkt es bewusstlos, hat die Hilfe Vorrang vor dem Schlüssel. ', nr.fakten['rettungsdienst-112']],
        ['Bei einem Tier im Auto steht die Lage an erster Stelle. ', nr.fakten.leitstelle, ' Schildern Sie dort, was Sie sehen.'],
        'Können Sie die Lage nicht einschätzen, rufen Sie den Notruf an. Nennen Sie den Standort, das Fahrzeug und was Sie sehen.',
        'Beschreiben Sie genau, ob sich das Kind bewegt oder ob das Tier ruhig liegt. Diese Angaben helfen bei der Einschätzung.',
        'Im Auto kann es schnell gefährlich werden, bei Hitze wie bei Kälte. Halten Sie Ihr Telefon bereit, damit die Leitstelle Sie erreichen kann.',
      ],
      hinweis: { art: 'warnung', text: 'Warten Sie nicht ab, wenn ein Kind oder ein Tier im Auto in Not zu sein scheint.' },
    },
  ],
  faq: [
    { frage: 'Kann mein Pannendienst das Auto öffnen?', antwort: 'Das hängt von Ihrem Vertrag und vom Dienst ab. Fragen Sie den Anbieter, ob das Öffnen eines verschlossenen Fahrzeugs enthalten ist und was es kostet.' },
    { frage: 'Schadet ein Keil zwischen Tür und Rahmen dem Auto?', antwort: 'Er kann Lack, Dichtungen und Scheibenkanten beschädigen. Lassen Sie es nicht selbst versuchen, sondern fragen Sie einen Fachbetrieb.' },
    { frage: 'Wie beuge ich vor, den Schlüssel einzuschließen?', antwort: 'Ein Zweitschlüssel bei einer vertrauten Person hilft im Ernstfall. Prüfen Sie außerdem, ob Ihr Fahrzeug eine Dienst-App hat, und richten Sie sie vorab ein.' },
  ],
  weiter: [
    { pfad: '/notoeffnung/autooeffnung/', titel: 'Autoöffnung', text: 'Die Leistung für Fahrzeuge, die sich nicht öffnen lassen.' },
    { pfad: '/ratgeber/ausgesperrt-was-tun/', titel: 'Ausgesperrt was tun?', text: 'Die nächsten Schritte, wenn die Wohnungstür zu ist.' },
    { pfad: '/preise/', titel: 'Unsere Preise', text: 'Preise offen einsehbar, mit Zuschlägen und Anfahrt.' },
  ],
};
