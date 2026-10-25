// Systemseiten (V11 Suche, V12 404) – eigene Texte. Die 404 bleibt ruhig: was passiert ist, drei Wege, Ortssuche, Anruf.
export default {
  suche: {
    titel: 'Suche: Leistungen, Ratgeber und Orte',
    beschreibung: 'Durchsuchen Sie alle Seiten des Schlüsseldienstes aus Weilburg – Leistungen, Preise, Ratgeber und alle Orte im Einsatzgebiet.',
    kicker: 'Suche',
    h1: 'Was suchen Sie?',
    einleitung: 'Ein Stichwort genügt, etwa „Zylinder“, „Tresor“ oder ein Ortsname. Die Suche läuft in Ihrem Browser; außer dem Suchverzeichnis wird nichts geladen oder gesendet.',
    label: 'Suchbegriff',
    platzhalter: 'z. B. Tresor oder Löhnberg',
    leeren: 'Suchbegriff löschen',
    kurz: 'Bitte mindestens zwei Zeichen eingeben.',
    leer: 'Keine Treffer. Versuchen Sie ein anderes Wort oder sehen Sie in der Sitemap nach.',
    fehler: 'Das Suchverzeichnis konnte nicht geladen werden. Die Sitemap führt ebenfalls zu jeder Seite.',
    seiten: 'Seiten',
    orte: 'Orte',
    ohneJs: 'Die Suche braucht JavaScript. Ohne JavaScript finden Sie jede Seite über die Sitemap und jeden Ort über das Einsatzgebiet.',
    // Leerzustand: die Seiten zu den Hauptaufgaben (KERN K-002: Notlage, Preis, Planung, seriösen Betrieb erkennen,
    // Anfrage). Titel, Bereich und Kurztext kommen aus dem Seitenindex, wie bei den Treffern.
    themen: {
      titel: 'Hauptthemen',
      pfade: ['/notoeffnung/tueroeffnung/', '/preise/', '/einbruchschutz/schliesszylinder/', '/ratgeber/schluesseldienst-abzocke-erkennen/', '/kontakt/'],
    },
    wege: [
      { pfad: '/sitemap/', titel: 'Sitemap', text: 'Alle Seiten nach Bereichen.' },
      { pfad: '/einsatzgebiet/', titel: 'Einsatzgebiet', text: 'Alle Orte nach Land und Kreis.' },
      { pfad: '/leistungen/', titel: 'Alle Leistungen', text: 'Register mit einem Satz je Leistung.' },
    ],
  },
  fehler: {
    titel: 'Seite nicht gefunden',
    beschreibung: 'Diese Seite gibt es nicht. Über die Suche, die Leistungen oder die Startseite finden Sie weiter.',
    kicker: 'Fehler 404',
    h1: 'Dieser Schlüssel passt nicht.',
    text: 'Unter dieser Adresse gibt es keine Seite – vielleicht ein Tippfehler oder ein alter Link. Einer dieser Wege führt weiter:',
    figur: 'Ein falscher Schlüssel: Kein Stift liegt auf der Linie, der Kern bleibt fest.',
    wege: [
      { pfad: '/', titel: 'Startseite', text: 'Notfall, Leistungen und Preise im Überblick.' },
      { pfad: '/suche/', titel: 'Suche', text: 'Seiten und Orte nach Stichwort.' },
      { pfad: '/leistungen/', titel: 'Alle Leistungen', text: 'Vom Türöffnen bis zum Tresor.' },
    ],
    ortTitel: 'Ort suchen',
    ortHinweis: 'Ort oder Postleitzahl eingeben und zur Ortsseite springen.',
  },
};
