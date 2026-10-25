// Preisliste. Beträge in Cent als Gesamtpreise (inkl. USt und Anfahrt in der Zone).
// Solange Platzhalter enthalten sind, zeigt der Preisrechner „Berechnung erst mit Preisliste möglich“.
import { platzhalter as p } from '../../bau/lib/platzhalter.mjs';

export default {
  ustModus: p('preise.ust-modus', 'Umsatzsteuer: Regelbesteuerung oder Kleinunternehmer'),
  waehrung: 'EUR',
  // Zeitfenster (Europe/Berlin). Reihenfolge = Spalten der Preistabelle.
  zeitfenster: [
    { id: 'werktag', titel: 'Werktags tagsüber', zeit: p('preise.zeit-werktag', 'Uhrzeit werktags') },
    { id: 'abend', titel: 'Werktags abends', zeit: p('preise.zeit-abend', 'Uhrzeit abends') },
    { id: 'nacht', titel: 'Nachts', zeit: p('preise.zeit-nacht', 'Uhrzeit nachts') },
    { id: 'wochenende', titel: 'Wochenende und Feiertag', zeit: p('preise.zeit-wochenende', 'Zeitraum Wochenende/Feiertag') },
  ],
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
    preise: Object.fromEntries(['werktag', 'abend', 'nacht', 'wochenende'].map((z) => [z, p(`preise.${pos.id}.${z}`, `Preis ${pos.titel} (${z})`)])),
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
