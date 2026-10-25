// Ratgeber-Artikel: Schlüssel verloren. Eigene Texte nach Themenpass (Kern: Entscheidungsweg nach Risiko statt
// pauschalem Tausch). Rechtslage nur über recht-schluesselverlust-miete (Pressemitteilung des BGH, Volltext nicht
// abrufbar) und versicherung-schluessel (Musterbedingungen VHB 2022). Was dort offen ist, steht nicht im Text.
import sv from '../fakten/recht-schluesselverlust-miete.mjs';
import vs from '../fakten/versicherung-schluessel.mjs';

export default {
  titel: 'Schlüssel verloren: was tun, und muss das Schloss raus?',
  beschreibung: 'Schlüssel verloren? Wie Sie prüfen, ob das Schloss getauscht werden sollte, und was bei Miete, Schließanlage und Versicherung gilt.',
  kategorie: 'notfall',
  kurztitel: 'Schlüssel verloren',
  h1: 'Schlüssel verloren: Was jetzt zu tun ist',
  kurz: 'Ob das Schloss getauscht werden sollte, hängt vor allem davon ab, wer den Schlüssel finden könnte. Prüfen Sie zuerst, ob sich der Schlüssel einer Adresse zuordnen lässt und ob er zu einer Schließanlage gehört.',
  stand: '2026-10-25',
  figur: 'zylinder',
  figurText: 'Nur der passende Schlüssel bringt alle Stifte auf die Scherlinie; ein gefundener Schlüssel kann das ebenso.',
  wichtig: [
    'Prüfen Sie zuerst, ob sich der Schlüssel einer **Adresse** zuordnen lässt.',
    'In einer **Mietwohnung** klären Sie den Verlust zuerst mit der Vermieterin oder dem Vermieter.',
    'Maßgeblich ist der **eigene Versicherungsvertrag**, nicht eine allgemeine Musterfassung.',
  ],
  abschnitte: [
    {
      titel: 'Ist der Schlüssel Ihrer Adresse zuzuordnen?',
      absaetze: [
        'Ein Schlüssel mit Adresse oder einem Hinweis auf Ihr Haus birgt ein höheres Risiko. Ein Schlüssel ohne jede Angabe lässt sich schwerer zuordnen.',
        'Überlegen Sie auch, wo der Schlüssel verloren gegangen sein kann und wer ihn finden könnte. Ein Schlüssel, der in der Nähe Ihrer Wohnung liegt, hat ein anderes Risiko als einer, der unterwegs verloren ging. Typische Fragen sind:',
      ],
      liste: [
        'Trägt der Schlüssel eine Adresse oder einen Hinweis auf Ihr Haus?',
        'Hängt ein Anhänger mit Name oder Telefonnummer daran?',
        'Gibt es Zweitschlüssel, die Sie noch kontrollieren können?',
      ],
    },
    {
      titel: 'Eigentum, Miete, Schließanlage – wer entscheidet',
      absaetze: [
        'Im eigenen Haus entscheiden Sie selbst. Ein Fachbetrieb kann den Zustand des Schlosses beurteilen und sagen, ob ein Austausch sinnvoll ist.',
        'In einer Mietwohnung sprechen Sie den Verlust mit der Vermieterin oder dem Vermieter ab. Bei einer Schließanlage öffnet ein Schlüssel mehrere Türen, etwa im Mehrfamilienhaus. Dann kann der Verlust größere Folgen haben.',
        [sv.fakten['bgh-austausch'], ' ', sv.fakten['bgh-schadenseintritt']],
      ],
      hinweis: { art: 'info', text: 'Ob sich das Urteil auf andere Konstellationen übertragen lässt, ist hier nicht belegt. Bei Streit über Kosten kann eine Verbraucherzentrale einen ersten Überblick geben.' },
    },
    {
      titel: 'Fundbüro und Versicherung',
      absaetze: [
        'Eine Meldung beim Fundbüro ist einfach und kann helfen. Verlassen Sie sich aber nicht darauf, dass der Schlüssel zurückkommt.',
        [vs.fakten['vhb-folgekosten'], ' Die Musterbedingungen sind eine Empfehlung des Verbands; maßgeblich ist die Fassung in Ihrem Vertrag.'],
        [vs.fakten['vhb-schluessel'], ' Ob ein bloß verlorener Schlüssel versichert ist, klärt Ihre Versicherung.'],
      ],
      hinweis: { art: 'info', text: [vs.fakten['vhb-keine-notoeffnung'], ' Ob Ihr Vertrag solche Kosten einschließt, steht in Ihren Bedingungen.'] },
    },
    {
      titel: 'Vorbeugen: Schlüsselanhänger ohne Adresse',
      absaetze: [
        'Schreiben Sie keine vollständige Anschrift auf den Schlüssel oder den Anhänger. Ein Schlüssel ohne Anschrift verrät einem Finder deutlich weniger.',
        'Bewahren Sie Zweitschlüssel an einem sicheren Ort auf, nicht in derselben Tasche wie den Hausschlüssel. Welche Zylinder welchen Schutz bieten, erklärt die Seite [Schließzylinder](/einbruchschutz/schliesszylinder/).',
      ],
      hinweis: { art: 'info', text: 'Melden Sie den Verlust bei einer Schließanlage zeitnah der Vermieterin oder dem Vermieter. So sind alle Beteiligten informiert.' },
    },
  ],
  faq: [
    { frage: 'Muss ich nach einem Schlüsselverlust das Schloss tauschen?', antwort: 'Ob ein Tausch nötig ist, hängt vor allem davon ab, wer den Schlüssel finden könnte. Eine feste Frist oder Pflicht dazu können wir hier nicht belegen; klären Sie den Fall mit der Vermieterin oder dem Vermieter oder mit Ihrer Versicherung.' },
    { frage: 'Wer zahlt, wenn ich den Schlüssel einer Schließanlage verliere?', antwort: ['In einer Mietwohnung kommt Schadensersatz in Betracht. ', sv.fakten['bgh-schadensersatz'], ' Welche Kosten im Einzelfall anfallen, klären Sie mit der Vermieterin oder dem Vermieter.'] },
    { frage: 'Lohnt sich die Meldung beim Fundbüro?', antwort: 'Die Meldung ist einfach und kann helfen. Sie ersetzt aber nicht die Prüfung, ob das Schloss betroffen ist.' },
  ],
  weiter: [
    { pfad: '/einbruchschutz/schliesszylinder/', titel: 'Schließzylinder', text: 'Schutz gegen Bohren, Ziehen und Aufsperren im Überblick.' },
    { pfad: '/einbruchschutz/schliessanlagen/', titel: 'Schließanlagen', text: 'Ein Schlüssel für mehrere Türen, erklärt.' },
    { pfad: '/ratgeber/schliesszylinder-wechseln/', titel: 'Schließzylinder wechseln', text: 'Messen, ausbauen und einbauen, Schritt für Schritt.' },
  ],
};
