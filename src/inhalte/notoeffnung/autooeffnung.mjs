// Leistungsseite Autoöffnung (V03, Detailseite) – eigene Texte nach Themenpass /notoeffnung/autooeffnung/
// (src/konfig/themenpaesse.mjs). Blickwinkel: Grenze zum Pannendienst, Notruf bei Kind oder Tier, Keyless.
// Keine Zahlen, Normen oder Zeitangaben im Text (K-010); keine Zusagen außerhalb der Konfiguration.
export default {
  titel: 'Autoöffnung in Weilburg: Schlüssel im Wagen eingeschlossen',
  beschreibung: 'Schlüssel im Auto eingeschlossen oder Funkschlüssel tot? Wann der Schlüsseldienst zuständig ist, wann der Pannendienst, und was Sie zuerst tun.',
  h1: 'Autoöffnung: Schlüssel im Wagen oder Funkschlüssel tot',
  kurz: 'Ob und wie wir Ihr Auto öffnen, klären wir vorab mit Ihnen. Ist ein Kind oder ein Tier im Wagen, wählen Sie zuerst den Notruf.',
  figurText: 'Tür, Auto, Garage und Tresor nebeneinander; hervorgehoben ist das Auto.',
  blick: [
    { titel: 'Zuständig', text: 'Schlüsseldienst oder Pannendienst, wir klären es vorab' },
    { titel: 'Kind oder Tier', text: 'zuerst den Notruf wählen, nicht den Betrieb' },
    { titel: 'Funkschlüssel tot', text: 'mechanischer Notschlüssel, falls vorhanden' },
    { titel: 'Nachweis', text: 'Fahrzeugschein und Ausweis' },
  ],
  abschnitte: [
    {
      titel: 'Wann Schlüsseldienst, wann Pannendienst oder Hersteller',
      absaetze: [
        'Viele Pannendienste öffnen Fahrzeuge auch, wenn der Schlüssel im Wagen liegt. Fragen Sie dort zuerst nach, bevor Sie uns beauftragen.',
        'Liegt die Ursache im Fahrzeug selbst, etwa in der Elektronik, hilft oft nur der Hersteller oder eine Werkstatt. Das sagen wir Ihnen ehrlich, bevor wir öffnen.',
        'Vorbeugen und einen Ersatzschlüssel einplanen erklärt der Ratgeber unter [Schlüssel im Auto](/ratgeber/schluessel-im-auto/).',
      ],
    },
    {
      titel: 'Kind oder Tier im Fahrzeug: zuerst den Notruf wählen',
      absaetze: [
        'Ist ein Kind oder ein Tier im Wagen eingeschlossen, geht die Gefahr vor. Wählen Sie zuerst den Notruf.',
        'Die Rettungskräfte beurteilen die Lage vor Ort. Erst danach stellt sich die Frage nach dem Öffnen des Fahrzeugs. In diesem Moment sind wir nicht der erste Anruf.',
      ],
    },
    {
      titel: 'Funkschlüssel und Keyless: mechanischer Notschlüssel',
      absaetze: [
        'Viele Funkschlüssel und Keyless-Systeme haben einen mechanischen Notschlüssel. Wo er steckt, zeigt die Bedienungsanleitung.',
        'Ist die Batterie im Schlüssel leer, reagiert er oft nicht mehr. Ein Blick darauf lohnt sich, bevor Sie uns rufen.',
        'Keyless-Fahrzeuge lassen sich anders öffnen als Autos mit Metallschlüssel. Ob bei Ihnen eine Fahrzeugöffnung möglich ist, besprechen wir am Telefon.',
      ],
    },
    {
      titel: 'Welche Papiere wir sehen müssen',
      absaetze: [
        'Für jede Fahrzeugöffnung prüfen wir zuerst die Berechtigung. Wir brauchen Fahrzeugschein und Ausweis. Liegen die Papiere im Wagen, zeigen Sie sie uns direkt nach dem Öffnen.',
        'Gehört das Fahrzeug einem Betrieb oder einer anderen Person, brauchen wir deren Auftrag oder Vollmacht. Das gilt auch für Firmenwagen.',
      ],
    },
  ],
  preis: {
    text: 'Die Tabelle zeigt Gesamtpreise im Kerngebiet. Anfahrtszuschläge für andere Zonen stehen auf der [Preisseite](/preise/).',
    positionen: ['auto'],
  },
  faq: [
    { frage: 'Ist das nicht Sache des Pannendienstes?', antwort: 'Oft ja. Fragen Sie dort zuerst nach. Ist der Pannendienst nicht zuständig oder hilft er nicht weiter, besprechen wir mit Ihnen, ob wir das Fahrzeug öffnen können.' },
    { frage: 'Was tue ich, wenn ein Kind oder Tier im Auto eingeschlossen ist?', antwort: 'Wählen Sie zuerst den Notruf, nicht uns. Danach können Sie bei uns anrufen, wenn das Fahrzeug geöffnet werden soll.' },
    { frage: 'Mein Funkschlüssel reagiert nicht mehr – können Sie trotzdem öffnen?', antwort: 'Das hängt vom Fahrzeug ab. Prüfen Sie zuerst die Batterie im Schlüssel und suchen Sie den mechanischen Notschlüssel. Beschreiben Sie uns am Telefon Ihr Fahrzeug, dann sagen wir, was möglich ist.' },
    { frage: 'Öffnen Sie auch Transporter und Wohnmobile?', antwort: 'Auch das hängt vom Fahrzeug und von seinem Schloss ab. Nennen Sie uns am Telefon, was Sie fahren, dann klären wir, ob wir es öffnen können.' },
  ],
  weiter: [
    { pfad: '/ratgeber/schluessel-im-auto/', titel: 'Schlüssel im Auto', text: 'Was vorbeugt, wenn der Schlüssel im Wagen liegt.' },
    { pfad: '/preise/', titel: 'Preise', text: 'Gesamtpreise im Kerngebiet und Zuschläge je Zone.' },
    { pfad: '/notoeffnung/', titel: 'Notöffnung im Überblick', text: 'Tür, Auto, Garage und Tresor nach Objekt sortiert.' },
  ],
};
