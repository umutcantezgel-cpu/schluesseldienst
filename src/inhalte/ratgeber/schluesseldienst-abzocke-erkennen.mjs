// Ratgeber-Artikel (Muster für alle Artikel): Schlüsseldienst-Abzocke erkennen. Eigene Texte nach Themenpass.
// Keine Rechtsaussagen ohne geprüftes Faktenblatt (recht-wucher, recht-rechnung, recht-preisangabe) – deshalb
// allgemeine Verhaltensregeln und der Verweis auf Verbraucherzentralen statt Paragrafen. Keine Wettbewerber.
export default {
  titel: 'Schlüsseldienst-Abzocke erkennen und vermeiden',
  beschreibung: 'Lockpreise, Vermittler, Druck an der Tür: Woran Sie unseriöse Schlüsseldienste erkennen und was Sie vorher, währenddessen und danach tun können.',
  kategorie: 'recht',
  kurztitel: 'Abzocke erkennen',
  h1: 'Schlüsseldienst-Abzocke erkennen',
  kurz: 'Unseriöse Anbieter arbeiten mit Lockpreisen, weit entfernten Vermittlern und Zeitdruck an der Tür. Wer vor dem Auftrag den Gesamtpreis und die Anschrift des Betriebs erfragt, schützt sich am besten – bei jedem Schlüsseldienst, auch bei uns.',
  stand: '2026-10-25',
  figur: 'rechnung',
  figurText: 'Eine seriöse Rechnung nennt jede Position einzeln – Anfahrt, Arbeitszeit, Zuschläge und Mehrwertsteuer.',
  wichtig: [
    'Vor dem Auftrag den **Gesamtpreis** mit Anfahrt, Zuschlägen und Mehrwertsteuer nennen lassen.',
    'Nach **Firmenname und Anschrift** fragen – ein Betrieb in Ihrer Region nennt beides sofort.',
    'Erst öffnen lassen, wenn der Preis klar ist, und eine **Rechnung mit allen Positionen** verlangen.',
  ],
  abschnitte: [
    {
      titel: 'Woran Sie Vermittler erkennen',
      absaetze: [
        'Viele Anzeigen und Webseiten gehören nicht zu einem Betrieb vor Ort, sondern zu Vermittlungszentralen. Sie nehmen den Anruf an und schicken jemanden, den Sie vorher nicht kennen – oft von weit her und zu einem Preis, der erst an der Tür feststeht.',
      ],
      liste: [
        'Es gibt keine vollständige Anschrift, nur eine Telefonnummer.',
        'Auf der Seite stehen sehr viele Städte, aber kein Ort, an dem der Betrieb wirklich sitzt.',
        'Am Telefon wird kein Gesamtpreis genannt, nur ein „ab“-Preis.',
        'Der Name des Betriebs bleibt unklar oder wechselt.',
      ],
    },
    {
      titel: 'Vor dem Auftrag: Gesamtpreis und Anschrift',
      absaetze: [
        'Fragen Sie am Telefon nach dem Preis, den Sie am Ende tatsächlich zahlen – mit Anfahrt, Zuschlägen für Abend, Nacht oder Wochenende und Mehrwertsteuer. Sagen Sie dazu, ob die Tür nur zugefallen oder abgeschlossen ist; davon hängt der Preis ab.',
        'Lassen Sie sich Firmenname und Anschrift nennen. Ein Blick ins Impressum der Webseite zeigt, ob beides dort steht.',
      ],
      hinweis: { art: 'info', text: 'Unsere Preise stehen offen auf der [Preisseite](/preise/). Woraus sich ein Preis zusammensetzt, erklärt der Artikel [Was kostet ein Schlüsseldienst?](/ratgeber/schluesseldienst-kosten/)' },
    },
    {
      titel: 'An der Tür: kein Druck, kein Bohren ohne Grund',
      absaetze: [
        'Lassen Sie erst arbeiten, wenn der Preis vor Ort derselbe ist wie am Telefon. Weicht er ab, dürfen Sie den Auftrag ablehnen, bevor etwas geöffnet oder beschädigt wird.',
        'Eine nur zugefallene Tür lässt sich in aller Regel öffnen, ohne zu bohren. Wird trotzdem sofort zum Bohrer gegriffen, fragen Sie nach dem Grund und nach dem Preis für den neuen Zylinder.',
      ],
      hinweis: { art: 'warnung', text: 'Unterschreiben Sie nichts, was Sie nicht gelesen haben, und lassen Sie sich nicht zu einer Zahlung drängen, bevor die Rechnung vorliegt.' },
    },
    {
      titel: 'Danach: Rechnung, Zahlung, Beschwerde',
      absaetze: [
        'Verlangen Sie eine Rechnung, auf der jede Position einzeln steht: Anfahrt, Arbeitszeit, Zuschläge, Material und Mehrwertsteuer. Mit ihr können Sie den Preis später prüfen lassen und ihn gegebenenfalls bei Ihrer Versicherung einreichen.',
        'Kommt Ihnen eine Rechnung überhöht vor, zahlen Sie nicht unter Druck bar. Notieren Sie Namen, Kennzeichen und Uhrzeit. Ob ein Preis angemessen war, kann eine Verbraucherzentrale einschätzen; dort erfahren Sie auch, wie Sie weiter vorgehen.',
      ],
    },
  ],
  faq: [
    { frage: 'Woran erkenne ich ein Vermittlungsportal?', antwort: 'Meist fehlt eine vollständige Anschrift, die Seite nennt viele Städte, aber keinen Sitz, und am Telefon gibt es nur einen „ab“-Preis. Fragen Sie direkt, wo der Betrieb sitzt und wer kommt.' },
    { frage: 'Muss ich eine überhöhte Rechnung sofort bezahlen?', antwort: 'Lassen Sie sich nicht drängen. Bestehen Sie auf einer Rechnung mit allen Positionen und holen Sie sich Rat, bevor Sie zahlen – zum Beispiel bei einer Verbraucherzentrale.' },
    { frage: 'Wo kann ich mich über einen Schlüsseldienst beschweren?', antwort: 'Erste Anlaufstelle ist die Verbraucherzentrale in Ihrem Bundesland. Haben Sie den Eindruck, unter Druck gesetzt worden zu sein, können Sie sich auch an die Polizei wenden.' },
  ],
  weiter: [
    { pfad: '/preise/', titel: 'Unsere Preise', text: 'Gesamtpreise nach Zeitfenster und Zone, offen einsehbar.' },
    { pfad: '/ratgeber/schluesseldienst-kosten/', titel: 'Was kostet ein Schlüsseldienst?', text: 'Woraus sich der Preis zusammensetzt.' },
    { pfad: '/notoeffnung/tueroeffnung/', titel: 'Türöffnung', text: 'Wie wir öffnen – schonend und mit Rückfrage vor dem Bohren.' },
  ],
};
