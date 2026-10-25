// Ratgeber-Artikel: Ausgesperrt, was tun. Eigene Texte nach Themenpass (Kern: Checkliste für die ersten Schritte,
// mit Warnung vor Selbstversuchen). Notrufnummern nur als Fakt aus dem Faktenblatt notrufnummern.
import nr from '../fakten/notrufnummern.mjs';

export default {
  titel: 'Ausgesperrt – was tun? Die ersten Schritte in Ruhe',
  beschreibung: 'Ausgesperrt – was tun? Zweitschlüssel prüfen, Hausverwaltung fragen, Selbstversuche vermeiden und einen seriösen Betrieb mit Gesamtpreis finden.',
  kategorie: 'notfall',
  kurztitel: 'Ausgesperrt: was tun',
  h1: 'Ausgesperrt: was Sie jetzt tun können',
  kurz: 'Aus der Wohnung ausgesperrt? Prüfen Sie zuerst, wer einen Zweitschlüssel hat: Mitbewohner, Familie, Nachbarn oder die Hausverwaltung. Erst wenn das nicht hilft, rufen Sie einen seriösen Betrieb an, und verzichten Sie auf Selbstversuche am Schloss.',
  stand: '2026-10-25',
  wichtig: [
    'Fragen Sie zuerst nach einem **Zweitschlüssel** bei Mitbewohnern, Familie, Nachbarn und der Hausverwaltung.',
    'Verzichten Sie auf **Selbstversuche** am Schloss, sie können Tür und Schloss beschädigen.',
    'Bei einem **Brand** oder einer verletzten Person geht der Notruf allem anderen vor.',
  ],
  abschnitte: [
    {
      titel: 'Erst prüfen: Zweitschlüssel, Mitbewohner, Hausverwaltung',
      absaetze: [
        'Oft liegt die Lösung schon bei Menschen, die Sie kennen. Gehen Sie in dieser Reihenfolge vor, bevor Sie einen Betrieb rufen.',
        'In Mehrfamilienhäusern und Mietwohnungen führt der Weg oft über die Hausverwaltung oder den Vermieter. Dort kann ein Schlüssel hinterlegt sein, auch wenn Sie davon nichts wissen.',
        'Notieren Sie, wen Sie gefragt haben und wann. So behalten Sie den Überblick, wenn Sie später einen Betrieb rufen. Wenn Sie niemanden erreichen, halten Sie auch das fest.',
      ],
      schritte: [
        'Mitbewohner, Partner oder Familie fragen, ob sie einen Schlüssel haben.',
        'Nachbarn fragen, die einen Zweitschlüssel haben könnten.',
        'Hausverwaltung oder Vermieter erreichen, falls dort ein Schlüssel liegt.',
      ],
    },
    {
      titel: 'Warum Selbstversuche teuer werden',
      absaetze: [
        'Wer am Schloss selbst probiert, riskiert Schäden an Schloss, Tür und Zarge, dem festen Rahmen, in den die Tür schließt. Dann kann aus einer Öffnung ein Austausch werden, der mehr kostet als die Öffnung selbst.',
        'Auch Sicherheitsschlösser sind nicht dafür gebaut, dass Laien sie öffnen. Dafür gibt es Fachbetriebe.',
        'Fragen Sie vorab, wie der Betrieb vorgeht und ob er zuerst prüft, ob die Tür ohne Bohren zu öffnen ist.',
        'Eine beschädigte Tür sichert die Wohnung schlechter, bis sie repariert ist.',
      ],
      hinweis: { art: 'warnung', text: 'Probieren Sie es nicht selbst aus, auch wenn es einfach aussieht.' },
    },
    {
      titel: 'Seriösen Betrieb anrufen und Preis erfragen',
      absaetze: [
        'Rufen Sie einen Betrieb an, der eine vollständige Anschrift nennt. Schildern Sie die Lage: Ist die Tür nur zugefallen oder abgeschlossen? Sagen Sie auch, ob es um eine Wohnung oder ein Haus geht.',
        'Fragen Sie nach dem Gesamtpreis, mit Anfahrt, etwaigen Zuschlägen und Mehrwertsteuer. Achten Sie darauf, dass am Telefon klar wird, wer kommt und was der Einsatz kostet.',
        'Bis der Betrieb kommt, haben Sie Zeit für die Vorbereitung. Laden Sie Ihr Telefon, nehmen Sie eine Jacke mit und halten Sie Ihre Angaben bereit.',
        'Wie Sie unseriöse Anbieter erkennen, erklärt der Ratgeber zu [Abzocke erkennen](/ratgeber/schluesseldienst-abzocke-erkennen/).',
      ],
      hinweis: { art: 'info', text: 'Unsere Preise stehen offen auf der [Preisseite](/preise/).' },
    },
    {
      titel: 'Herd an, Kind drinnen: wann der Notruf vorgeht',
      absaetze: [
        [nr.fakten.vorwahl],
        'Ein eingeschalteter Herd ist allein noch kein Notfall. Riecht es aber nach Rauch oder Verbranntem, wählen Sie sofort den Notruf.',
        [nr.fakten['feuerwehr-112']],
        ['Ist eine Person verletzt oder bewusstlos, hat die Hilfe Vorrang vor der Tür. ', nr.fakten['rettungsdienst-112']],
        ['Ist die Lage unklar, etwa ein Kind allein in der Wohnung, schildern Sie am Notruf, was Sie sehen. ', nr.fakten.leitstelle],
        'Verlassen Sie sich nicht darauf, dass ein anderer den Notruf wählt. Wählen Sie ihn selbst, sobald Sie eine Gefahr sehen.',
        'Am Notruf nennen Sie vor allem diese Angaben:',
      ],
      liste: [
        'Wo Sie sind: Adresse, Stockwerk oder Hauseingang.',
        'Was passiert: Brand, Rauch oder eine verletzte Person.',
        'Wer betroffen ist: ein Kind, ein Tier oder ein Erwachsener.',
      ],
      hinweis: { art: 'warnung', text: 'Verlassen Sie bei Rauch die Wohnung, wenn Sie das können, und warten Sie vor dem Haus auf die Einsatzkräfte.' },
    },
  ],
  faq: [
    { frage: 'Wen rufe ich zuerst an, wenn ich ausgesperrt bin?', antwort: 'Zuerst Mitbewohner, Familie oder Nachbarn, die einen Zweitschlüssel haben könnten. Danach die Hausverwaltung oder den Vermieter, falls dort ein Schlüssel liegt. Erst dann lohnt ein Anruf bei einem seriösen Betrieb.' },
    { frage: 'Darf die Hausverwaltung meine Wohnung aufschließen?', antwort: 'Das hängt von Ihrem Mietvertrag und vom Einzelfall ab, eine pauschale Antwort gibt es nicht. Fragen Sie die Verwaltung, ob für Ihre Wohnung ein Schlüssel hinterlegt ist. Offene Rechtsfragen klären Sie bei einer Verbraucherzentrale.' },
    { frage: 'Wann ist ausgesperrt ein Fall für die Feuerwehr?', antwort: 'Bei einem Brand ist die Feuerwehr zuständig, bei einer verletzten Person der Rettungsdienst. Ohne diese Lage hilft der Weg über Verwaltung und Fachbetrieb.' },
  ],
  weiter: [
    { pfad: '/notoeffnung/tueroeffnung/', titel: 'Türöffnung', text: 'Zugefallene und abgeschlossene Wohnungs- und Haustüren.' },
    { pfad: '/ratgeber/tuer-zugefallen-oder-abgeschlossen/', titel: 'Tür zugefallen oder abgeschlossen', text: 'Woran Sie erkennen, was bei Ihrer Tür vorliegt.' },
    { pfad: '/ratgeber/schluesseldienst-abzocke-erkennen/', titel: 'Schlüsseldienst-Abzocke erkennen', text: 'Woran Sie unseriöse Anbieter erkennen, bevor Sie einen Auftrag geben.' },
  ],
};
