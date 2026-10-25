// Bausteine der Ortsseiten (V07): eigene Texte, Varianz nur über Daten und Zone (kein Spinning, D-004).
// Platzhalter in geschweiften Klammern füllt die Vorlage aus den Daten: {ort}, {gemeinde}, {kreis}, {land},
// {km}, {richtung}, {zone}, {plz}. Mini-Syntax für Links erlaubt. Keine Minuten-, Vor-Ort- oder Preisbehauptungen.
export default {
  kicker: 'Einsatzgebiet',
  leistungenTitel: {
    nah: 'Was wir in {ort} übernehmen',
    fern: 'Was wir für {ort} übernehmen',
  },
  leistungenHinweisFern: 'Notöffnungen übernehmen wir in dieser Entfernung nur nach Absprache; planbare Arbeiten vereinbaren wir mit Ihnen.',
  preisTitel: 'Preise für {ort}',
  preisText: {
    A: 'Gesamtpreise mit Anfahrt im Kerngebiet. Wovon sie abhängen, steht auf der [Preisseite](/preise/).',
    B: 'Gesamtpreise aus dem Kerngebiet; für {ort} kommt der Anfahrtsaufschlag der Zone B hinzu. Alles Weitere steht auf der [Preisseite](/preise/).',
    C: 'In Zone C richtet sich die Anfahrt nach der Entfernung. Den Gesamtpreis vereinbaren wir mit Ihnen, bevor wir einen Termin festlegen. Grundlagen stehen auf der [Preisseite](/preise/).',
    D: 'In dieser Entfernung arbeiten wir nur nach Absprache; die Anfahrt vereinbaren wir mit Ihnen. Grundlagen stehen auf der [Preisseite](/preise/).',
  },
  anfahrtZeile: 'Anfahrtsaufschlag Zone {zone}',
  umgebungTitel: { gemeinde: 'Ortsteile von {ort}', ortsteil: 'Zur Gemeinde {gemeinde}' },
  nachbarnTitel: 'Orte in der Nähe von {ort}',
  faqTitel: 'Häufige Fragen zu {ort}',
  faq: {
    entfernung: { frage: 'Wie weit ist {ort} von Weilburg entfernt?', antwort: 'Rund {km} km Luftlinie; {ort} liegt {richtung} von Weilburg. Die Strecke auf der Straße ist meist etwas länger.' },
    zone: { frage: 'Zu welcher Zone gehört {ort}?', antwort: '{ort} gehört zur Zone {zone} – {zonenKurz}. Was das für Leistungen und Anfahrt bedeutet, steht im [Einsatzgebiet](/einsatzgebiet/).' },
    plz: { frage: 'Welche Postleitzahlen hat {ort}?', antwort: 'Für {ort} gilt {plzSatz}. Über die Ortssuche im [Einsatzgebiet](/einsatzgebiet/) finden Sie jeden Ort auch über seine Postleitzahl.' },
  },
  serioesTitel: 'Woran Sie einen seriösen Schlüsseldienst erkennen',
  serioes: [
    'Gesamtpreis mit Anfahrt und Mehrwertsteuer vorher nennen lassen.',
    'Nach Firmenname und Anschrift fragen – auch bei uns.',
    'Erst öffnen lassen, wenn der Preis klar ist; Rechnung mit allen Positionen verlangen.',
  ],
  serioesLink: { text: 'Ausführlich im Ratgeber', pfad: '/ratgeber/schluesseldienst-abzocke-erkennen/' },
  landesregel: 'Welche Pflichten bei Rauchwarnmeldern in {land} gelten, steht im Ratgeber [Rauchmelderpflicht](/ratgeber/rauchmelderpflicht/).',
  quelle: 'Ortsdaten (Namen, Postleitzahlen, Lage) nach GeoNames, Lizenz CC BY 4.0, für diese Seite aufbereitet. Mehr unter [Quellen und Lizenzen](/quellen-lizenzen/).',
};
