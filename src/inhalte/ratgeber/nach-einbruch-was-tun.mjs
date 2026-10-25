// Ratgeber-Artikel: Nach einem Einbruch. Eigene Texte nach Themenpass (Kern: Reihenfolge Sicherheit, Polizei,
// Spuren, Versicherung, Notverschluss, Sperrungen, Nachsorge). Notrufnummern nur aus notrufnummern, Versicherungs-
// aussagen nur aus versicherung-schluessel (Musterbedingungen). Maßgeblich bleibt der eigene Vertrag.
import notruf from '../fakten/notrufnummern.mjs';
import versicherung from '../fakten/versicherung-schluessel.mjs';

export default {
  titel: 'Nach Einbruch was tun: Schritt für Schritt',
  beschreibung: 'Nach einem Einbruch in der richtigen Reihenfolge handeln: eigene Sicherheit, Polizei, Stehlgutliste, Versicherung, Karten sperren und Notverschluss.',
  kategorie: 'notfall',
  kurztitel: 'Nach dem Einbruch',
  h1: 'Was nach einem Einbruch zu tun ist',
  kurz: 'Nach einem Einbruch zählt die Reihenfolge. Erst sichern Sie sich selbst, dann rufen Sie die Polizei und lassen die Spuren unberührt. Danach folgen Stehlgut, Versicherung, Karten und der Notverschluss der Tür.',
  stand: '2026-10-25',
  figur: 'tuer-schichten',
  figurText: 'Die Tür in Schichten: Zylinder, Beschlag und Verriegelung prüfen Sie nach einem Einbruch einzeln.',
  wichtig: [
    'Bringen Sie sich zuerst in **Sicherheit** und rufen Sie dann von außen die Polizei an.',
    'Halten Sie in einer **Stehlgutliste** fest, was fehlt, bevor Sie aufräumen.',
    'Maßgeblich ist Ihr eigener **Vertrag**, deshalb fragen Sie Ihre Versicherung nach den Nachweisen.',
  ],
  abschnitte: [
    {
      titel: 'Erst die eigene Sicherheit',
      absaetze: [
        'Haben Sie Hinweise, dass noch jemand in der Wohnung sein könnte, gehen Sie nicht weiter hinein. Warten Sie außerhalb des Gebäudes. Nehmen Sie, wenn möglich, Telefon und Schlüssel mit.',
        ['Rufen Sie von außen die Polizei an. ', notruf.fakten['polizei-110'], ' ', notruf.fakten.vorwahl],
        [notruf.fakten.leitstelle, ' Sagen Sie am Telefon, wo Sie sind und was passiert ist.'],
      ],
      hinweis: { art: 'warnung', text: 'Betreten Sie die Wohnung erst wieder, wenn Sie sicher sind, dass niemand mehr darin ist.' },
    },
    {
      titel: 'Polizei und Spuren',
      absaetze: [
        'Erstatten Sie Anzeige bei der Polizei. Liefern Sie die Angaben, die Sie haben.',
        'Fassen Sie möglichst wenig an, vor allem Fenstergriffe, Türklinken und Schlösser. So bleiben Spuren erhalten, die die Polizei auswerten kann.',
        'Warten Sie mit dem Aufräumen, bis die Polizei die Lage gesehen hat. Ob Sie vorher etwas wegräumen dürfen, sagt Ihnen die Polizei vor Ort.',
      ],
      liste: [
        'Wann haben Sie das Haus oder die Wohnung zuletzt verlassen?',
        'Was haben Sie zuerst gesehen: Tür, Fenster, Schrank?',
        'Haben Sie Geräusche gehört oder Personen gesehen?',
        'Fallen Ihnen Spuren an Fenster oder Tür auf?',
      ],
    },
    {
      titel: 'Versicherung und Stehlgutliste',
      absaetze: [
        'Schreiben Sie auf, was fehlt: Gegenstand, Anzahl, Kaufdatum und Wert. Belege, Fotos und Seriennummern sind hilfreich, wenn Sie etwas nachweisen müssen.',
        ['Zu Schlossänderungen nach einem Einbruch sagen die Musterbedingungen Folgendes. ', versicherung.fakten['vhb-schluessel']],
        'Die Musterbedingungen sind Empfehlungen des Verbands. Maßgeblich ist die Fassung in Ihrem Vertrag. Fotografieren Sie die Schäden, bevor etwas repariert wird.',
      ],
    },
    {
      titel: 'Karten und Konten sperren',
      absaetze: [
        'Wurden Bankkarten oder Kreditkarten gestohlen, sperren Sie sie sofort bei der ausgebenden Stelle. Die Sperrnummer finden Sie in der Regel auf der Karte oder bei der Bank.',
        'Bei Ausweisen fragen Sie die zuständige Behörde, welche Schritte gelten. Denken Sie auch an Schlüssel für Auto, Garage und Briefkasten.',
        'Ändern Sie Passwörter, wenn Geräte oder Zugangsdaten gestohlen wurden. Achten Sie in den nächsten Wochen auf Kontoauszüge und ungewöhnliche Buchungen.',
      ],
    },
    {
      titel: 'Notverschluss und Nachrüstung',
      absaetze: [
        'Sichern Sie die Tür sofort, damit die Wohnung nicht offen bleibt. Ein Fachbetrieb richtet einen Notverschluss ein und kann die Schäden beheben.',
        [versicherung.fakten['vhb-keine-notoeffnung'], ' Fragen Sie Ihre Versicherung, ob sie solche Kosten übernimmt.'],
        'Planen Sie Nachrüstungen erst, wenn die Tür wieder sicher verschlossen ist. Eine Prüfung der Schwachstellen hilft bei der Auswahl.',
      ],
      liste: [
        'Schäden fotografieren und notieren.',
        'Einen Kostenvoranschlag vom Fachbetrieb anfordern.',
        'Den Notverschluss schriftlich bestätigen lassen.',
      ],
      hinweis: { art: 'info', text: 'Wenn Sie Hilfe beim Notverschluss brauchen, finden Sie unsere Leistung unter [Einbruchschaden](/notoeffnung/einbruchschaden/).' },
    },
    {
      titel: 'Wenn das Sicherheitsgefühl fehlt',
      absaetze: [
        'Ein Einbruch kann das Gefühl von Sicherheit stark erschüttern. Das ist eine verständliche Reaktion, und Sie müssen sie nicht allein tragen.',
        'Sprechen Sie mit Menschen, denen Sie vertrauen, und lassen Sie sich Zeit. Wenn das Gefühl nicht nachlässt, wenden Sie sich an Ihre Hausarztpraxis.',
        'Praktische Schritte helfen: das Schloss prüfen lassen, Fenster sichern und den Alltag anpassen, eins nach dem anderen.',
      ],
    },
  ],
  faq: [
    { frage: 'Darf ich nach einem Einbruch aufräumen, bevor die Polizei kommt?', antwort: 'Warten Sie möglichst, bis die Polizei die Lage gesehen hat. Ob Sie vorher etwas wegräumen dürfen, sagt Ihnen die Polizei vor Ort. Fragen Sie dort gezielt nach, was Sie anfassen dürfen.' },
    { frage: 'Was gehört in die Stehlgutliste?', antwort: 'Jeder fehlende Gegenstand mit Beschreibung, Anzahl, Kaufdatum und Wert. Belege, Fotos und Seriennummern sind hilfreich, wenn Sie etwas nachweisen müssen. Erstellen Sie die Liste am Tag nach dem Einbruch, solange Sie sich gut erinnern.' },
    { frage: 'Wo bekomme ich Hilfe, wenn ich mich in der Wohnung nicht mehr sicher fühle?', antwort: 'Sprechen Sie mit Vertrauten und mit Ihrer Hausarztpraxis. Opferberatungsstellen helfen ebenfalls, und auch die Polizei kann Sie an eine Stelle verweisen.' },
  ],
  weiter: [
    { pfad: '/notoeffnung/einbruchschaden/', titel: 'Einbruchschaden', text: 'Türen und Fenster nach einem Einbruch sichern und Schäden instand setzen.' },
    { pfad: '/einbruchschutz/', titel: 'Einbruchschutz', text: 'Mechanischer Einbruchschutz im Überblick, Schritt für Schritt.' },
    { pfad: '/ratgeber/einbruchschutz-haus/', titel: 'Einbruchschutz Haus', text: 'Den Rundgang ums Haus Schritt für Schritt durchgehen.' },
  ],
};
