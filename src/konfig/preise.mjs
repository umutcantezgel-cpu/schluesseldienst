// Preisliste. Beträge in Cent als Gesamtpreise (inkl. USt und Anfahrt in der Zone).
// Solange Platzhalter enthalten sind, zeigt der Preisrechner „Berechnung erst mit Preisliste möglich“.
import { platzhalter as p } from '../../bau/lib/platzhalter.mjs';

export default {
  ustModus: p('preise.ust-modus', 'Umsatzsteuer: Regelbesteuerung oder Kleinunternehmer'),
  waehrung: 'EUR',
  // Zeitfenster (Europe/Berlin). Reihenfolge = Spalten der Preistabelle.
  zeitfenster: [
    { id: 'werktag', titel: 'Werktags tagsüber', zeit: p('preise.zeit-werktag', 'Uhrzeit folgt') },
    { id: 'abend', titel: 'Werktags abends', zeit: p('preise.zeit-abend', 'Uhrzeit folgt') },
    { id: 'nacht', titel: 'Nachts', zeit: p('preise.zeit-nacht', 'Uhrzeit folgt') },
    { id: 'wochenende', titel: 'Wochenende und Feiertag', zeit: p('preise.zeit-wochenende', 'Zeitraum folgt') },
  ],
  // Uhrzeiten der Zeitfenster je Tagesart für Tagesband und Rechner (lückenlos 00:00–24:00, geprüft mit bandPruefen).
  // Form: { werktags: [['nacht', '00:00', '07:00'], ['werktag', '07:00', '18:00'], …], wochenende: [['wochenende', '00:00', '24:00']] }
  // Feiertage gelten wie das Wochenende; die Seite sagt das, der Rechner kennt Feiertage nicht.
  tagesband: p('preise.tagesband', 'Uhrzeiten der Zeitfenster je Tagesart'),
  // Leistungen mit Gesamtpreis je Zeitfenster (Zone A). Weitere Zonen: Anfahrtsaufschlag je Zone.
  positionen: [
    { id: 'tuer-zugefallen', titel: 'Tür zugefallen (nicht abgeschlossen)', leistung: '/notoeffnung/tueroeffnung/' },
    { id: 'tuer-abgeschlossen', titel: 'Tür abgeschlossen oder Schlüssel abgebrochen', leistung: '/notoeffnung/tueroeffnung/' },
    { id: 'auto', titel: 'Autoöffnung', leistung: '/notoeffnung/autooeffnung/' },
    { id: 'garage', titel: 'Garagentor öffnen', leistung: '/notoeffnung/garagenoeffnung/' },
    { id: 'tresor', titel: 'Tresoröffnung', leistung: '/notoeffnung/tresoroeffnung/', hinweis: 'abhängig von Schutzklasse, nach Absprache' },
    { id: 'zylinder', titel: 'Schließzylinder tauschen (Arbeitszeit)', leistung: '/einbruchschutz/schliesszylinder/' },
  ].map((pos) => ({
    ...pos,
    preise: Object.fromEntries(['werktag', 'abend', 'nacht', 'wochenende'].map((z) => [z, p(`preise.${pos.id}.${z}`, 'Preis folgt')])),
  })),
  // Anfahrtsaufschlag je Zone in Cent (Zone A = 0 = in den Positionen enthalten).
  anfahrt: {
    A: 0,
    B: p('preise.anfahrt-b', 'Anfahrtsaufschlag Zone B'),
    C: p('preise.anfahrt-c', 'Anfahrt Zone C'),
    D: null,
  },
  // Zahlarten ohne Aufschläge (§ 270a BGB). Leer = keine Angabe.
  zahlarten: p('preise.zahlarten', 'Zahlarten'),
  material: 'Ersatzteile (z. B. neuer Zylinder) werden vorher genannt und gesondert berechnet.',
};
