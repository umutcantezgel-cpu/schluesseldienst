// Leistungsseite Rauchmelder (V03, Muster: notoeffnung/tueroeffnung.mjs) – eigene Texte nach Themenpass
// /sicherheitstechnik/rauchmelder/. Keine Zahlen, Normen oder Preise ohne Faktenblatt; keine Zusagen außerhalb der Konfiguration (K-010).
export default {
  titel: 'Rauchmelder montieren lassen in Weilburg und Umgebung',
  beschreibung: 'Rauchmelder auswählen, richtig platzieren und vernetzen lassen. Wo der Melder hängt, wann ein Wärmemelder passt und wie die Wartung aussieht.',
  h1: 'Rauchmelder montieren lassen',
  kurz: 'Rauchmelder gehören an die Decke, dorthin, wo sich Rauch früh sammelt. Wir wählen mit Ihnen das passende Gerät aus, montieren es und klären, ob sich mehrere Melder vernetzen lassen. Welche Räume betroffen sind, steht im [Ratgeber zur Rauchwarnmelderpflicht](/ratgeber/rauchmelderpflicht/).',
  figurText: 'Grundriss einer Wohnung: Rauchwarnmelder sind in mehreren Räumen markiert.',
  blick: [
    { titel: 'Platz', text: 'an der Decke, abseits von Dampf und Zugluft' },
    { titel: 'Küche', text: 'oft ein Wärmemelder statt Rauchmelder' },
    { titel: 'Vernetzung', text: 'Funk, damit ein Alarm alle Melder erreicht' },
    { titel: 'Wartung', text: 'Prüftaste, Batterie und Reinigung nach Anleitung' },
  ],
  abschnitte: [
    {
      titel: 'Wohin gehört ein Melder?',
      absaetze: [
        'Ein Rauchmelder hängt an der Decke, möglichst mittig im Raum. Dampf aus dem Bad, Zugluft am Fenster oder Dunst vom Herd können ihn sonst unnötig auslösen.',
        'Welche Räume ausgestattet sein müssen, richtet sich nach den Vorgaben des jeweiligen Landes. Die Einzelheiten stehen im [Ratgeber zur Rauchwarnmelderpflicht](/ratgeber/rauchmelderpflicht/).',
      ],
    },
    {
      titel: 'Rauch- oder Wärmemelder',
      absaetze: [
        'Ein Rauchmelder reagiert auf Rauchpartikel in der Luft, ein Wärmemelder auf steigende Temperatur. In Wohn- und Schlafräumen kommt meist ein Rauchmelder zum Einsatz.',
        'In der Küche löst Kochdampf einen Rauchmelder leichter aus. Dort passt oft ein Wärmemelder besser, weil er auf Temperatur und nicht auf Schwebeteilchen anspricht.',
      ],
    },
    {
      titel: 'Funkvernetzung',
      absaetze: [
        'Wer Rauchmelder vernetzen möchte, sorgt dafür, dass alle Geräte gemeinsam anschlagen. Löst einer aus, folgen die anderen, auch in Räumen, in denen noch kein Rauch liegt.',
        'Funkrauchmelder brauchen keine Leitungen und passen gut in bestehende Wohnungen. Ob sich Ihre Geräte verbinden lassen, hängt vom Gerätetyp ab und lässt sich vorher prüfen.',
      ],
    },
    {
      titel: 'Prüfen und Batteriewechsel',
      absaetze: [
        'Die Prüftaste am Melder zeigt, ob das Gerät arbeitet. Halten Sie sich bei Prüfung und Reinigung an die Anleitung des Herstellers.',
        'Ein Piepen oder Blinken zeigt meist an, dass die Batterie schwächelt. Tauschen Sie sie dann zeitnah, nach Anleitung des Geräts.',
      ],
    },
  ],
  faq: [
    { frage: 'Gehört in die Küche ein Rauchmelder?', antwort: 'Ob die Küche zu den Pflichträumen zählt, zeigt der [Ratgeber](/ratgeber/rauchmelderpflicht/). Unabhängig davon löst Kochdampf einen Rauchmelder leicht aus; oft passt dort ein Wärmemelder besser.' },
    { frage: 'Was bringt es, Rauchmelder zu vernetzen?', antwort: 'Bei vernetzten Meldern schlagen alle an, sobald einer auslöst. So hört man den Alarm auch dort, wo der Rauch noch nicht liegt.' },
    { frage: 'Wie oft muss ich einen Rauchmelder prüfen?', antwort: 'Drücken Sie die Prüftaste in regelmäßigen Abständen. Die Anleitung des Herstellers nennt, was darüber hinaus zu tun ist, etwa Reinigung oder Batteriewechsel.' },
  ],
  weiter: [
    { pfad: '/ratgeber/rauchmelderpflicht/', titel: 'Rauchmelderpflicht', text: 'Räume, Verpflichtete und Fristen im Überblick.' },
    { pfad: '/sicherheitstechnik/', titel: 'Sicherheitstechnik', text: 'Alarm, Video, Nebel – und wie sie zur Mechanik passen.' },
    { pfad: '/sicherheitstechnik/alarmanlagen/', titel: 'Alarmanlagen', text: 'Melder und Sirenen planen und einbauen.' },
  ],
};
