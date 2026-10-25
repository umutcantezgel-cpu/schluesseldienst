// Ratgeber-Artikel: Alarmanlage planen. Eigene Texte nach Themenpass (Kern: Planung in fünf Schritten mit
// Grundriss-Grafik). Grade, Normen und Ausgaben nur über das Faktenblatt norm-alarm. Keine Produktnamen, keine
// Planungsnorm als Behauptung: welche Planungsnorm in Deutschland gilt, ist nicht belegt.
import alarm from '../fakten/norm-alarm.mjs';

const a = alarm.fakten;

export default {
  titel: 'Alarmanlage planen in fünf Schritten',
  beschreibung: 'Schutzziel, Zonen, Melder, Alarmierung und Bedienung: So planen Sie eine Alarmanlage für Wohnung oder Haus, Schritt für Schritt.',
  kategorie: 'technik',
  kurztitel: 'Alarmanlage planen',
  h1: 'Alarmanlage planen: fünf Schritte',
  kurz: [
    'Planen Sie eine Alarmanlage vom Schutzziel her, nicht vom Gerät. ',
    a['grade-empfehlung'], ' ',
    'Welche Melder und welcher Ablauf zu Ihrem Grundriss passen, klärt ein Fachbetrieb.',
  ],
  stand: '2026-10-25',
  figur: 'grundriss',
  figurText: 'Eine schematische Wohnung mit Melderzonen: Kontakte an der Außenhaut und Bewegungsmelder je Bereich.',
  wichtig: [
    'Legen Sie zuerst das **Schutzziel** fest, bevor Sie Geräte auswählen.',
    'Teilen Sie den Grundriss in **Zonen** ein, damit Sie jeden Bereich gezielt absichern.',
    'Lassen Sie den **Grad** im Angebot nennen und prüfen Sie ihn am Grundriss.',
  ],
  abschnitte: [
    {
      titel: 'Schutzziel festlegen',
      absaetze: [
        'Überlegen Sie zuerst, was geschützt werden soll: die Wohnung, das Haus oder ein Betriebsgebäude. Daraus folgt, welche Zugänge und Räume überwacht werden müssen.',
        'Notieren Sie auch, wann das Gebäude leer steht und welche Werte besonders wichtig sind.',
        'Ein Haus mit Garten braucht einen anderen Blick als eine Wohnung im Obergeschoss. Fragen Sie sich außerdem, ob Keller oder Nebengebäude dazugehören.',
      ],
      liste: [
        'Welche Türen und Fenster liegen offen oder sind schwer einsehbar?',
        'Welche Räume enthalten Werte, die Sie besonders schützen wollen?',
      ],
    },
    {
      titel: 'Zonen im Grundriss',
      absaetze: [
        'Zeichnen Sie den Grundriss und markieren Sie die Außenhaut mit allen Türen und Fenstern. Die Innenräume bilden weitere Zonen.',
        'Fragen Sie den Fachbetrieb, ob sich einzelne Zonen getrennt scharf schalten lassen, wenn sich Personen im Haus bewegen. Notieren Sie dazu, welche Räume nachts betreten werden.',
        'Ein einfacher Plan reicht für die erste Abstimmung. Der Fachbetrieb prüft danach vor Ort, welche Melder wohin gehören.',
      ],
      hinweis: { art: 'info', text: 'Der Grundriss ist eine Skizze für die Planung. Der Fachbetrieb prüft sie vor Ort, bevor Melder gesetzt werden.' },
    },
    {
      titel: 'Melderarten',
      absaetze: [
        [a.titel],
        [a['grade-anzahl'], ' ', a['grade-1']],
        [a['grade-normenreihen']],
      ],
      liste: [
        'Öffnungsmelder an Türen und Fenstern',
        'Bewegungsmelder in Räumen und Fluren',
        'Glasbruchmelder an großen Scheiben',
      ],
      hinweis: { art: 'info', text: 'Die Auswahl der Melder ist eine Planungsfrage und keine Frage des Preises allein.' },
    },
    {
      titel: 'Alarmierung und Reaktion',
      absaetze: [
        'Legen Sie fest, wer im Alarmfall benachrichtigt wird und in welcher Reihenfolge. Eine schriftliche Liste mit Namen und Telefonnummern hilft, wenn es nachts passiert.',
        'Klären Sie, ob die Anlage nur einen Alarm auslöst oder auch eine Meldung weitergibt.',
        'Planen Sie auch, wie Nachbarn oder Schlüsselberechtigte reagieren, wenn die Anlage auslöst.',
      ],
      hinweis: { art: 'warnung', text: 'Eine Alarmanlage ersetzt nicht den Notruf. Wer eine Tat bemerkt, ruft die Polizei an.' },
    },
    {
      titel: 'Bedienung im Alltag',
      absaetze: [
        'Eine Anlage hilft nur, wenn alle im Haus sie bedienen können. Üben Sie das Scharf- und Unscharfschalten gemeinsam, bevor Sie sich darauf verlassen.',
        'Klären Sie vorab, wer welche Zugänge zur Anlage hat. Lassen Sie sich nach dem Einbau die Bedienung zeigen und den Fachbetrieb die Anlage prüfen.',
        'Schreiben Sie die wichtigsten Schritte auf einen Zettel, den alle im Haus finden.',
      ],
      liste: [
        'Wer hat Code oder Schlüssel?',
        'Wer prüft die Wartung und die Batterien?',
        'Wer schaltet die Anlage zuletzt scharf, wenn alle gehen?',
      ],
      hinweis: { art: 'info', text: 'Planen Sie die Bedienung früh mit ein, nicht erst nach dem Einbau.' },
    },
  ],
  faq: [
    { frage: 'Wie viele Melder braucht eine Wohnung?', antwort: 'Eine feste Zahl wird hier nicht genannt, weil dafür kein belegter Fakt vorliegt. Sie hängt vom Grundriss, den Zonen und dem Schutzziel ab. Für ein Haus mit Keller oder Nebengebäuden kann die Zahl anders ausfallen.' },
    { frage: 'Was ist eine Scharfschaltung?', antwort: 'Scharfschalten heißt, dass die Anlage auf Meldungen der Melder reagiert. Unscharfschalten hebt diesen Zustand wieder auf. Wie Ihre Anlage das konkret umsetzt, erklärt der Fachbetrieb.' },
    { frage: 'Wer sollte im Alarmfall benachrichtigt werden?', antwort: 'Nennen Sie Personen, die erreichbar sind und Zugang zum Gebäude haben. Legen Sie die Reihenfolge vorab fest, damit nachts niemand suchen muss. Informieren Sie alle Beteiligten vorab über diese Liste.' },
  ],
  weiter: [
    { pfad: '/sicherheitstechnik/alarmanlagen/', titel: 'Alarmanlagen', text: 'Alarmanlagen mit Meldern und Sirenen, von der Planung bis zum Einbau.' },
    { pfad: '/sicherheitstechnik/nebelsysteme/', titel: 'Nebelsysteme', text: 'Sicherheitsnebel als Ergänzung, wenn die Planung das vorsieht.' },
    { pfad: '/sicherheitstechnik/videoueberwachung/', titel: 'Videoüberwachung', text: 'Kameras für Eingang und Grundstück, mit Blick auf den Datenschutz.' },
  ],
};
