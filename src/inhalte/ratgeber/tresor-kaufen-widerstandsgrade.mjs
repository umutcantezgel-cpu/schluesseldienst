// Ratgeber-Artikel: Tresor kaufen worauf achten. Eigene Texte nach Themenpass (Entscheidungsweg in vier Fragen).
// Zahlen, Normen und Ausgaben nur über Fakt-Objekte aus den Faktenblättern des Passes; Widerstandsklassen sind
// dort nicht belegt und stehen deshalb nicht im Text.
import wv from '../fakten/norm-wertschutz.mjs';
import ts from '../fakten/norm-tresorschloss.mjs';
import ds from '../fakten/norm-datensicherung.mjs';

export default {
  titel: 'Tresor kaufen: worauf achten? Grad, Schloss, Ort',
  beschreibung: 'Tresor kaufen, worauf achten: was hinein soll, welcher Widerstandsgrad passt, wo der Tresor steht und welches Schloss zu Ihnen gehört.',
  kategorie: 'technik',
  kurztitel: 'Tresor kaufen',
  h1: 'Tresor kaufen: worauf Sie achten sollten',
  kurz: 'Ein passender Tresor richtet sich nach dem Wert des Inhalts, den Vorgaben Ihrer Versicherung und dem Aufstellort. Fragen Sie die Versicherung schriftlich nach dem geforderten Widerstandsgrad. Danach passen Schloss, Gewicht und Einbau zu Ihrer Wahl.',
  stand: '2026-10-25',
  figur: 'stufen',
  figurText: 'Drei Stufen vom Möbeltresor über die Tür bis zum Wertschutzschrank, alle auf einem festen Untergrund.',
  wichtig: [
    'Fragen Sie Ihre Versicherung schriftlich nach dem **Widerstandsgrad**, den sie für Ihre Wertsachen verlangt.',
    'Der **Aufstellort** entscheidet, wie der Tresor verankert wird und ob der Untergrund sein Gewicht trägt.',
    'Das **Schloss** sollte zu Ihrem Schutzziel passen, und der Notzugang gehört schon vor dem Kauf geklärt.',
  ],
  abschnitte: [
    {
      titel: 'Was soll hinein?',
      absaetze: [
        'Am Anfang steht die Frage, was der Tresor schützen soll. Bargeld, Schmuck und Urkunden stellen andere Anforderungen als Waffen oder Datenträger.',
        'Schreiben Sie auf, was hineinkommt und was es insgesamt wert ist. Diese Liste brauchen Sie für das Gespräch mit der Versicherung und für die Wahl des Tresors.',
        'Denken Sie auch an Dinge, die sich schwer ersetzen lassen, etwa Familienfotos oder Erbstücke. Gerade sie verdienen einen sicheren Platz, auch wenn ihr Geldwert gering ist.',
        ['Für Datenträger gibt es eigene Schränke. ', ds.fakten['1047-1-teil1'], ' Ob ein Schrank für Ihre Datenträger passt, klären Sie mit dem Anbieter.'],
      ],
      liste: [
        'Bargeld, Schmuck, Uhren und Wertpapiere.',
        'Urkunden und wichtige Dokumente.',
        'Waffen: Dafür gelten eigene Vorschriften, siehe [Waffenschrank-Vorschriften](/ratgeber/waffenschrank-vorschriften/).',
      ],
    },
    {
      titel: 'Widerstandsgrad und Versicherung',
      absaetze: [
        [wv.fakten['1143-1-titel'], ' Achten Sie beim Angebot darauf, nach welcher Norm und welcher Klasse der Tresor geprüft ist.'],
        'Den verlangten Grad sollten Sie bei Ihrer Versicherung erfragen. Bitten Sie um eine schriftliche Antwort und bewahren Sie sie mit den Vertragsunterlagen auf.',
        ['Für Sicherheitsschränke gibt es eine eigene Norm. ', wv.fakten['14450-titel'], ' ', wv.fakten['14450-ausgabe'], ' Fragen Sie den Anbieter, auf welche Ausgabe sich sein Angebot bezieht.'],
      ],
    },
    {
      titel: 'Aufstellort und Verankerung',
      absaetze: [
        'Ein Tresor braucht einen festen Platz. Lassen Sie sich vor dem Kauf sagen, wie er verankert wird und welcher Untergrund dafür nötig ist.',
        'Schwere Geräte belasten Decke und Boden. Prüfen Sie vorher, ob der Untergrund das Gewicht trägt, und fragen Sie den Hersteller nach der Verankerung.',
        'Der Platz muss so gewählt sein, dass sich die Tür frei öffnen lässt und die Verankerung fachgerecht gesetzt werden kann.',
      ],
      liste: [
        'Gewicht: Fragen Sie den Hersteller, bevor Sie bestellen.',
        'Untergrund: Decke, Boden und Wand müssen zum Gewicht passen.',
        'Verankerung: Sie folgt der Herstellerangabe.',
        'Zugang: Vor der Tür muss genug Platz bleiben, um sie vollständig zu öffnen.',
      ],
      hinweis: { art: 'info', text: 'Das Liefern und Verankern von Tresoren gehört zu unserem Angebot, siehe [Einbau und Tresore](/einbau-tresore/).' },
    },
    {
      titel: 'Schlossart',
      absaetze: [
        'Das Schloss bestimmt, wie Sie den Tresor öffnen und was geschieht, wenn der Code fehlt oder der Schlüssel verloren geht.',
        [ts.fakten['ausgabe'], ' ', ts.fakten['titel'], ' Fragen Sie nach, ob das angebotene Schloss nach dieser Norm geprüft ist.'],
        'Ob mechanisch oder elektronisch: Entscheiden Sie nach Ihrem Schutzziel und dem Notzugang, nicht nach dem Preis allein.',
      ],
      liste: [
        'Nach welcher Norm und in welcher Ausgabe das Schloss geprüft ist.',
        'Wie der Notzugang funktioniert, wenn der Code vergessen wird oder der Schlüssel fehlt.',
        'Wer Code oder Schlüssel erhält und wie das schriftlich festgehalten wird.',
        'Wie eine Batterie gewechselt wird und was passiert, wenn sie leer ist.',
      ],
      hinweis: { art: 'warnung', text: 'Öffnen Sie einen Tresor nicht mit Gewalt. Lassen Sie den Notzugang oder einen Fachbetrieb arbeiten, sonst beschädigen Sie Schloss und Gehäuse.' },
    },
  ],
  faq: [
    { frage: 'Wie finde ich heraus, welchen Grad meine Versicherung verlangt?', antwort: 'Fragen Sie Ihre Versicherung schriftlich nach dem geforderten Widerstandsgrad und der Norm. Bewahren Sie die Antwort auf, bevor Sie einen Tresor kaufen.' },
    { frage: 'Elektronik- oder Schlüsselschloss – was ist besser?', antwort: 'Das hängt von Ihrem Schutzziel und davon ab, wer den Tresor öffnen soll. Fragen Sie nach Norm, Notzugang und Ersatz bei Verlust, bevor Sie sich entscheiden.' },
    { frage: 'Wie schwer darf ein Tresor in der Wohnung sein?', antwort: 'Das hängt vom Modell und vom Untergrund ab. Fragen Sie den Hersteller nach dem Gewicht und lassen Sie prüfen, ob Decke oder Boden es tragen.' },
  ],
  weiter: [
    { pfad: '/einbau-tresore/wertschutzschraenke/', titel: 'Wertschutzschränke', text: 'Auswahl, Lieferung und Verankerung nach Widerstandsgrad.' },
    { pfad: '/einbau-tresore/moebeltresore/', titel: 'Möbeltresore', text: 'Kleine Tresore für Schrank und Regal.' },
    { pfad: '/notoeffnung/tresoroeffnung/', titel: 'Tresoröffnung', text: 'Wenn der Code vergessen wurde oder das Schloss defekt ist.' },
  ],
};
