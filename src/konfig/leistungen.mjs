// Leistungsregister: 4 Gruppen, 23 Detailseiten. Reihenfolge = Navigation und Register.
// kurz: ein Satz für Register, Navigation und Meta-Fallback (eigene Formulierung).
export const GRUPPEN = [
  {
    id: 'notoeffnung', pfad: '/notoeffnung/', titel: 'Notöffnung', icon: 'tuer-offen', nr: '01',
    kurz: 'Tür, Auto, Garage oder Tresor zu – wir öffnen möglichst ohne Schaden und sichern nach einem Einbruch.',
    leistungen: [
      { id: 'tueroeffnung', pfad: '/notoeffnung/tueroeffnung/', titel: 'Türöffnung', icon: 'tuer', kurz: 'Zugefallene oder abgeschlossene Wohnungs- und Haustüren öffnen, mit Nachweis der Berechtigung.' },
      { id: 'autooeffnung', pfad: '/notoeffnung/autooeffnung/', titel: 'Autoöffnung', icon: 'auto', kurz: 'Schlüssel im Auto eingeschlossen: Fahrzeug öffnen, ohne Scheibe oder Lack zu beschädigen.' },
      { id: 'garagenoeffnung', pfad: '/notoeffnung/garagenoeffnung/', titel: 'Garagenöffnung', icon: 'garage', kurz: 'Schwing-, Sektional- und Rolltore öffnen, auch bei defektem Antrieb.' },
      { id: 'tresoroeffnung', pfad: '/notoeffnung/tresoroeffnung/', titel: 'Tresoröffnung', icon: 'tresor', kurz: 'Code vergessen oder Schloss defekt: Tresore und Wertschränke diskret öffnen.' },
      { id: 'einbruchschaden', pfad: '/notoeffnung/einbruchschaden/', titel: 'Einbruchschaden', icon: 'einbruchschaden', kurz: 'Nach einem Einbruch Türen und Fenster sofort sichern und Schäden instand setzen.' },
    ],
  },
  {
    id: 'einbruchschutz', pfad: '/einbruchschutz/', titel: 'Einbruchschutz', icon: 'schutzbeschlag', nr: '02',
    kurz: 'Mechanische Sicherung für Tür und Fenster – vom Schließzylinder bis zur Pilzkopfverriegelung.',
    leistungen: [
      { id: 'schliesszylinder', pfad: '/einbruchschutz/schliesszylinder/', titel: 'Schließzylinder', icon: 'zylinder', kurz: 'Sicherheitszylinder mit Bohr-, Zieh- und Aufsperrschutz auswählen und einbauen.' },
      { id: 'schliessanlagen', pfad: '/einbruchschutz/schliessanlagen/', titel: 'Schließanlagen', icon: 'schliessanlage', kurz: 'Ein Schlüssel für die eigenen Türen: Schließanlagen für Haus, Mehrfamilienhaus und Betrieb.' },
      { id: 'tuerschloesser', pfad: '/einbruchschutz/tuerschloesser/', titel: 'Türschlösser', icon: 'einsteckschloss', kurz: 'Einsteckschlösser und Mehrfachverriegelungen tauschen oder nachrüsten.' },
      { id: 'zusatzschloesser', pfad: '/einbruchschutz/zusatzschloesser/', titel: 'Zusatzschlösser', icon: 'kastenschloss', kurz: 'Kastenzusatz- und Querriegelschlösser für mehr Widerstand an der Wohnungstür.' },
      { id: 'schutzbeschlaege', pfad: '/einbruchschutz/schutzbeschlaege/', titel: 'Schutzbeschläge', icon: 'schutzbeschlag', kurz: 'Beschläge mit Zylinderabdeckung, die Abbrechen und Ziehen erschweren.' },
      { id: 'tuersicherung', pfad: '/einbruchschutz/tuersicherung/', titel: 'Türsicherung', icon: 'bandsicherung', kurz: 'Bandseite und Schließblech verstärken, Sperrbügel und Kellertüren sichern.' },
      { id: 'fenstersicherung', pfad: '/einbruchschutz/fenstersicherung/', titel: 'Fenstersicherung', icon: 'fenstersicherung', kurz: 'Pilzkopfverriegelung, abschließbare Griffe und Zusatzsicherungen für Fenster und Terrassentüren.' },
      { id: 'tuerschliesser', pfad: '/einbruchschutz/tuerschliesser/', titel: 'Türschließer', icon: 'tuerschliesser', kurz: 'Obentürschließer auswählen, montieren und richtig einstellen.' },
    ],
  },
  {
    id: 'sicherheitstechnik', pfad: '/sicherheitstechnik/', titel: 'Sicherheitstechnik', icon: 'alarmzentrale', nr: '03',
    kurz: 'Elektronischer Schutz, der mit der Mechanik zusammenarbeitet: Alarm, Video, Nebel, Rauchmelder.',
    leistungen: [
      { id: 'alarmanlagen', pfad: '/sicherheitstechnik/alarmanlagen/', titel: 'Alarmanlagen', icon: 'alarmzentrale', kurz: 'Funk- und Kabelalarmanlagen mit Meldern und Sirenen planen und einbauen.' },
      { id: 'videoueberwachung', pfad: '/sicherheitstechnik/videoueberwachung/', titel: 'Videoüberwachung', icon: 'kamera', kurz: 'Kameras für Eingang und Grundstück – mit Blick auf Datenschutz geplant.' },
      { id: 'nebelsysteme', pfad: '/sicherheitstechnik/nebelsysteme/', titel: 'Nebelsysteme', icon: 'nebel', kurz: 'Sicherheitsnebel, der Einbrechern in Sekunden die Sicht nimmt.' },
      { id: 'rauchmelder', pfad: '/sicherheitstechnik/rauchmelder/', titel: 'Rauchmelder', icon: 'rauchmelder', kurz: 'Rauch- und Wärmemelder auswählen, montieren und vernetzen.' },
    ],
  },
  {
    id: 'einbau-tresore', pfad: '/einbau-tresore/', titel: 'Einbau & Tresore', icon: 'sicherheitstuer', nr: '04',
    kurz: 'Sicherheitstüren und -fenster einbauen, Tresore und Schränke liefern und verankern.',
    leistungen: [
      { id: 'sicherheitstueren', pfad: '/einbau-tresore/sicherheitstueren/', titel: 'Sicherheitstüren', icon: 'sicherheitstuer', kurz: 'Einbruchhemmende Wohnungs- und Haustüren nach Widerstandsklasse einbauen.' },
      { id: 'sicherheitsfenster', pfad: '/einbau-tresore/sicherheitsfenster/', titel: 'Sicherheitsfenster', icon: 'fenster', kurz: 'Einbruchhemmende Fenster einbauen oder bestehende Fenster nachrüsten.' },
      { id: 'moebeltresore', pfad: '/einbau-tresore/moebeltresore/', titel: 'Möbeltresore', icon: 'tresor', kurz: 'Kleine Tresore für Schrank und Regal, mit Zahlen- oder Schlüsselschloss.' },
      { id: 'wertschutzschraenke', pfad: '/einbau-tresore/wertschutzschraenke/', titel: 'Wertschutzschränke', icon: 'wertschrank', kurz: 'Wertschutzschränke nach Widerstandsgrad auswählen, liefern und verankern.' },
      { id: 'datensicherungsschraenke', pfad: '/einbau-tresore/datensicherungsschraenke/', titel: 'Datensicherungsschränke', icon: 'datenschrank', kurz: 'Schränke, die Datenträger und Akten im Brandfall schützen.' },
      { id: 'waffenschraenke', pfad: '/einbau-tresore/waffenschraenke/', titel: 'Waffenschränke', icon: 'waffenschrank', kurz: 'Waffenschränke für die gesetzliche Aufbewahrung liefern und fachgerecht aufstellen.' },
    ],
  },
];

export const ALLE_LEISTUNGEN = GRUPPEN.flatMap((g) => g.leistungen.map((l) => ({ ...l, gruppe: g.id })));
