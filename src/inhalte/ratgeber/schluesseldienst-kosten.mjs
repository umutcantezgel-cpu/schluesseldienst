// Ratgeber-Artikel: Was kostet ein Schlüsseldienst? Eigene Texte nach Themenpass (Kern: den Preis in Posten zerlegen
// und zeigen, welche Fragen am Telefon Klarheit bringen). Steuerregeln nur als Fakten aus recht-35a. Zu Preisangaben
// hat recht-preisangabe noch keinen belegten Fakt, deshalb keine Rechtsaussagen dazu. Preise stehen nur auf /preise/.
import st from '../fakten/recht-35a.mjs';

export default {
  titel: 'Was kostet ein Schlüsseldienst? Was den Preis bestimmt',
  beschreibung: 'Aus welchen Posten sich der Preis eines Schlüsseldienstes zusammensetzt, wann Zuschläge anfallen und welche Fragen Sie vorab stellen sollten.',
  kategorie: 'recht',
  kurztitel: 'Was kostet es?',
  h1: 'Was kostet ein Schlüsseldienst?',
  kurz: 'Den Preis bestimmen die Anfahrt, die Arbeitszeit, mögliche Zuschläge und gegebenenfalls das Material. Wer vorab nach dem Gesamtpreis fragt, weiß vor dem Einsatz, womit er rechnen muss.',
  stand: '2026-10-25',
  figur: 'rechnung',
  figurText: 'Die Zeichnung zeigt den Aufbau einer Rechnung mit einzelnen Positionen, ohne Beträge.',
  wichtig: [
    'Der Preis besteht aus **Posten**; lassen Sie sich jeden einzeln nennen.',
    'Ein Zuschlag für **Abend, Nacht oder Wochenende** kann dazukommen; fragen Sie, ob einer anfällt.',
    'Wird ein neuer **Zylinder** nötig, kommt das Material zu den übrigen Posten hinzu.',
  ],
  abschnitte: [
    {
      titel: 'Bestandteile des Preises',
      absaetze: [
        'Der Betrag setzt sich aus mehreren Posten zusammen. Lassen Sie sich diese am Telefon nennen, nicht nur einen Endbetrag.',
        'Fragen Sie bei jedem Posten, ob er fest ist oder sich während des Einsatzes ändern kann. So können Sie die Rechnung später prüfen. Typisch sind diese Posten:',
      ],
      liste: [
        'Anfahrt zum Einsatzort',
        'Arbeitszeit vor Ort',
        'Zuschläge für Abend, Nacht oder Wochenende',
        'Material, etwa ein neuer Zylinder',
        'Mehrwertsteuer',
      ],
      hinweis: { art: 'info', text: 'Ein Preis mit dem Zusatz „ab“ ist noch keine Gesamtsumme. Fragen Sie nach dem Betrag, den Sie am Ende zahlen.' },
    },
    {
      titel: 'Zeitfenster und Zuschläge',
      absaetze: [
        'Ob ein Einsatz am Tag, am Abend, in der Nacht oder am Wochenende stattfindet, kann den Preis ändern. Fragen Sie nach der Höhe eines Zuschlags, bevor Sie zusagen.',
        'Nennen Sie am Telefon die Uhrzeit und den Wochentag. Nur dann kann der Betrieb Ihnen einen Preis für Ihren Fall nennen.',
        'Lässt sich der Einsatz zeitlich verschieben, fragen Sie nach, wie sich das auf den Betrag auswirkt.',
      ],
    },
    {
      titel: 'Anfahrt und Entfernung',
      absaetze: [
        'Die Anfahrt ist ein eigener Posten. Fragen Sie, ob sie im genannten Betrag enthalten ist und wie sie berechnet wird.',
        'Die Anschrift des Betriebs zeigt, wie weit die Anfahrt ungefähr ist. Fehlt eine Anschrift, sollten Sie misstrauisch werden. Woran Sie Vermittler erkennen, zeigt der Artikel [Schlüsseldienst-Abzocke erkennen](/ratgeber/schluesseldienst-abzocke-erkennen/).',
        'Je weiter die Anfahrt, desto mehr fällt dieser Posten ins Gewicht. Fragen Sie deshalb früh nach der Entfernung zu Ihrem Wohnort.',
      ],
    },
    {
      titel: 'Material: wann ein Zylinder dazukommt',
      absaetze: [
        'Ein Schloss öffnen ist etwas anderes als ein Schloss ersetzen. Ein neuer Zylinder kommt mit seinem Preis zu den übrigen Posten hinzu.',
        'Ob ein Zylinder nötig ist, zeigt sich manchmal erst vor Ort. Welche Zylinder welchen Schutz bieten, erklärt die Seite [Schließzylinder](/einbruchschutz/schliesszylinder/).',
        'Lassen Sie sich begründen, warum ein neuer Zylinder nötig sein soll. Eine bloße Behauptung reicht für eine Entscheidung nicht aus.',
      ],
      hinweis: { art: 'warnung', text: 'Lassen Sie keinen neuen Zylinder einbauen, bevor Ihnen dessen Preis genannt wurde.' },
    },
    {
      titel: 'Steuer: Handwerkerleistung absetzen',
      absaetze: [
        ['Für die Steuer gelten feste Regeln. ', st.fakten.anteil],
        [st.fakten.hoechstbetrag, ' ', st.fakten.arbeitskosten, ' Material zählt also nicht dazu.'],
        [st.fakten['zahlung-konto'], ' Lassen Sie sich deshalb eine Rechnung ausstellen, die jede Position einzeln nennt.'],
      ],
      hinweis: { art: 'info', text: 'Ob eine Notöffnung oder ein Schlossaustausch darunter fällt, lässt sich aus den Regeln nicht sicher ableiten. Fragen Sie dazu das Finanzamt oder eine Steuerberatung.' },
    },
  ],
  faq: [
    { frage: 'Warum kostet eine Öffnung nachts mehr?', antwort: 'Ein Einsatz am Abend, in der Nacht oder am Wochenende kann einen eigenen Zuschlag auslösen. Fragen Sie vorab nach dessen Höhe, bevor Sie einen Auftrag erteilen.' },
    { frage: 'Kann ich die Kosten von der Steuer absetzen?', antwort: ['Das kommt auf den Einzelfall an. ', st.fakten.anteil, ' Ob eine Notöffnung darunter fällt, lässt sich nicht sicher ableiten; fragen Sie das Finanzamt.'] },
    { frage: 'Welche Fragen sollte ich am Telefon zum Preis stellen?', antwort: 'Fragen Sie nach dem Gesamtpreis mit Anfahrt, Zuschlägen und Mehrwertsteuer. Fragen Sie außerdem nach Firmenname und Anschrift und ob der Preis vor Ort gleich bleibt.' },
  ],
  weiter: [
    { pfad: '/preise/', titel: 'Unsere Preise', text: 'Der Preis im Überblick, offen einsehbar.' },
    { pfad: '/ratgeber/schluesseldienst-abzocke-erkennen/', titel: 'Schlüsseldienst-Abzocke erkennen', text: 'Lockpreise, Vermittler und Druck an der Tür.' },
    { pfad: '/notoeffnung/tueroeffnung/', titel: 'Türöffnung', text: 'Wie eine Türöffnung abläuft, Schritt für Schritt.' },
  ],
};
