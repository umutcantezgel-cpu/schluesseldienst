// Gruppenseite Notöffnung (V02) – eigene Texte nach Themenpass /notoeffnung/ (src/konfig/themenpaesse.mjs).
// Keine Minuten-, Sterne- oder Jahresangaben; Zusagen nur über die Konfiguration (K-010).
export default {
  titel: 'Schlüsselnotdienst Weilburg: Tür, Auto, Garage, Tresor',
  beschreibung: 'Ausgesperrt, Autoschlüssel im Wagen oder Tresor zu? Notöffnung aus Weilburg: möglichst ohne Schaden, mit Nachweis der Berechtigung und offenem Preis.',
  kicker: 'Leistungsgruppe',
  h1: 'Notöffnung für Tür, Auto, Garage und Tresor',
  einleitung: 'Ob die Wohnungstür ins Schloss gefallen ist, der Autoschlüssel im Wagen liegt oder der Tresor den Code nicht mehr annimmt: Wir öffnen möglichst ohne Schaden – und erst, wenn klar ist, dass Sie dazu berechtigt sind.',
  registerTitel: 'Wobei wir helfen',
  szene: {
    titel: 'Stift für Stift: So öffnen wir',
    einleitung: 'Ein Schloss gibt nach, wenn alle Stifte auf der Scherlinie liegen. Genau so gehen wir vor – Schritt für Schritt und ohne Gewalt, solange es irgend geht.',
    schritte: [
      { titel: 'Zuhören', text: 'Sie sagen uns, welche Tür oder welches Fahrzeug es ist, welches Schloss verbaut ist und wo Sie stehen. Daraus ergibt sich, wie wir öffnen – und was es kostet.' },
      { titel: 'Schonend beginnen', text: 'Zuerst kommen die Methoden, die nichts beschädigen. Eine nur zugefallene Tür lässt sich meist über die Falle öffnen, ohne dass der Zylinder etwas davon merkt.' },
      { titel: 'Stift für Stift', text: 'Ist abgeschlossen, arbeiten wir uns durch den Zylinder, bis jeder Stift auf der Linie sitzt. Muss doch gebohrt werden, fragen wir vorher und nennen Ihnen den Preis für den neuen Zylinder.' },
      { titel: 'Offen – und belegt', text: 'Die Tür ist offen, Sie zeigen Ihren Nachweis und erhalten die Rechnung. Danach sagen wir Ihnen ehrlich, ob Ihr Zylinder noch etwas taugt oder ob sich ein Tausch lohnt.' },
    ],
  },
  nachweis: {
    titel: 'Wer öffnen lassen darf',
    einleitung: 'Wir öffnen nur für Menschen, die dazu berechtigt sind. Das schützt Sie genauso wie uns. Je nach Objekt reicht Folgendes:',
    eintraege: [
      { objekt: 'Wohnung oder Haus', text: 'Ausweis mit Meldeadresse, Mietvertrag oder die Bestätigung durch Nachbarn oder Hausverwaltung. Liegt der Ausweis drinnen, zeigen Sie ihn direkt nach dem Öffnen.' },
      { objekt: 'Auto', text: 'Fahrzeugschein und Ausweis. Liegen die Papiere im Wagen, sehen wir sie uns nach dem Öffnen an, bevor Sie losfahren.' },
      { objekt: 'Garage', text: 'Wie bei der Wohnung; bei Garagen in einer Gemeinschaftsanlage zusätzlich die Bestätigung der Verwaltung.' },
      { objekt: 'Tresor', text: 'Ein Beleg, dass der Tresor Ihnen gehört – etwa der Kaufbeleg oder sein Standort in Ihren eigenen Räumen. Im Betrieb die Vollmacht der Geschäftsführung.' },
      { objekt: 'Geschäftsräume', text: 'Auftrag oder Vollmacht der Inhaberin, des Inhabers oder der Geschäftsführung und ein Ausweis.' },
    ],
  },
  betriebe: {
    titel: 'Für Betriebe und Hausverwaltungen',
    absaetze: [
      'Hausverwaltungen, Vermieter und Betriebe können eine Öffnung für andere beauftragen – für Mieterinnen und Mieter, für Mitarbeitende oder für einen Leerstand.',
      'Sagen Sie uns vorab, wer vor Ort sein darf und an wen die Rechnung geht. Wir öffnen in Absprache mit Ihnen und halten auf der Rechnung fest, was wir getan haben.',
    ],
  },
  preis: {
    titel: 'Was eine Notöffnung kostet',
    text: 'Gesamtpreise mit Anfahrt im Kerngebiet. Wovon sie abhängen und was in den übrigen Zonen gilt, steht auf der [Preisseite](/preise/).',
    positionen: ['tuer-zugefallen', 'tuer-abgeschlossen', 'auto', 'garage', 'tresor'],
  },
  faq: [
    { frage: 'Öffnen Sie auch Büros und Geschäftsräume?', antwort: 'Ja. Dafür brauchen wir den Auftrag oder die Vollmacht der Inhaberin, des Inhabers oder der Geschäftsführung. Die Rechnung geht an den Betrieb.' },
    { frage: 'Was brauche ich, wenn die Wohnung nicht auf meinen Namen läuft?', antwort: 'Dann hilft jemand, der bestätigen kann, dass Sie dort wohnen – die Hausverwaltung, der Vermieter oder Nachbarn. Wir öffnen erst, wenn die Berechtigung klar ist.' },
    { frage: 'Kann eine Hausverwaltung eine Öffnung für Mieter beauftragen?', antwort: 'Ja. Die Verwaltung beauftragt, wir öffnen in Absprache mit ihr, und die Rechnung geht an die Verwaltung – sofern nichts anderes vereinbart ist.' },
    { frage: 'Was passiert, wenn ich mich vor Ort nicht ausweisen kann?', antwort: 'Liegt der Ausweis in der Wohnung, zeigen Sie ihn direkt nach dem Öffnen. Lässt sich die Berechtigung weder so noch über Nachbarn oder Verwaltung klären, öffnen wir nicht.' },
  ],
  weiter: [
    { pfad: '/ratgeber/ausgesperrt-was-tun/', titel: 'Ausgesperrt – was jetzt?', text: 'Die ersten Schritte in Ruhe, bevor jemand kommt.' },
    { pfad: '/ratgeber/tuer-zugefallen-oder-abgeschlossen/', titel: 'Zugefallen oder abgeschlossen?', text: 'Warum der Unterschied über Methode und Preis entscheidet.' },
    { pfad: '/ratgeber/schluesseldienst-abzocke-erkennen/', titel: 'Seriösen Schlüsseldienst erkennen', text: 'Woran Sie Lockpreise und Vermittler erkennen.' },
  ],
  schluss: {
    titel: 'Tür zu? Rufen Sie an.',
    text: 'Sagen Sie uns, wo Sie stehen. Ob wir zu Ihnen kommen und mit welcher Anfahrt, sehen Sie vorab auch selbst.',
    link: { text: 'Einsatzgebiet prüfen', pfad: '/einsatzgebiet/' },
  },
};
