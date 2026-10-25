// Betriebsdaten. Alles, was nur der Mensch kennt, ist ein Platzhalter (siehe MENSCHEN.md §1).
// Release-Builds verweigern jeden verbleibenden Platzhalter.
import { platzhalter as p } from '../../bau/lib/platzhalter.mjs';

export default {
  name: p('betrieb.name', 'Firmenname'),
  rechtsform: p('betrieb.rechtsform', 'Rechtsform'),
  inhaber: p('betrieb.inhaber', 'Inhaber/Vertretungsberechtigte'),
  adresse: {
    strasse: p('betrieb.strasse', 'Straße und Hausnummer'),
    plz: p('betrieb.plz', 'PLZ'),
    ort: 'Weilburg',
    land: 'DE',
  },
  // Sitz für Entfernungen und Zonen: wird in der Orts-Pipeline aus GeoNames aufgelöst.
  sitz: { name: 'Weilburg', gemeinde: 'Weilburg', kreis: 'Landkreis Limburg-Weilburg', land: 'Hessen' },
  telefon: {
    anzeige: p('betrieb.telefon', 'Telefonnummer'),
    e164: p('betrieb.telefon-e164', 'Telefon (+49…)'),
  },
  email: p('betrieb.email', 'E-Mail-Adresse'),
  // Erreichbarkeit: Zeiten je Wochentag (Europe/Berlin). null = keine Angabe → nur Nummer wird gezeigt.
  erreichbarkeit: {
    zeiten: p('betrieb.zeiten', 'Erreichbarkeitszeiten'),
    nachtdienst: p('betrieb.nachtdienst', 'Nachtdienst ja/nein'),
    rundUmDieUhr: false,
  },
  impressum: {
    register: p('impressum.register', 'Registereintrag oder „kein Registereintrag“'),
    ustId: p('impressum.ust-id', 'USt-IdNr. oder W-IdNr.'),
    kammer: p('impressum.kammer', 'Zuständige Kammer'),
    berufsbezeichnung: p('impressum.berufsbezeichnung', 'Berufsbezeichnung und Staat der Verleihung'),
    verantwortlichMStV: p('impressum.mstv', 'Verantwortlich nach § 18 Abs. 2 MStV'),
    vsbg: p('impressum.vsbg', 'Erklärung zur Verbraucherstreitbeilegung'),
    aufsicht: null,
  },
  // Zusagen zur Arbeitsweise: true = wird zugesagt, false = wird nicht zugesagt (neutraler Text).
  // Bis zur Bestätigung durch den Menschen sind sie Platzhalter (sichtbar markiert, Release gesperrt).
  zusagen: {
    preisVorAuftrag: p('zusagen.preis-vor-auftrag', 'Zusage bestätigen: Gesamtpreis vor Arbeitsbeginn'),
    rechnungMitPositionen: p('zusagen.rechnung-positionen', 'Zusage bestätigen: Rechnung mit allen Positionen'),
    kartenzahlung: p('zusagen.kartenzahlung', 'Zusage bestätigen: Kartenzahlung vor Ort'),
  },
  bewertungen: { profilUrl: null },
  gruendungsjahr: null,
  qualifikationen: [],
  team: [],
  stellen: [],
  basisUrl: p('betrieb.basis-url', 'https://Ihre-Domain.de'),
};
