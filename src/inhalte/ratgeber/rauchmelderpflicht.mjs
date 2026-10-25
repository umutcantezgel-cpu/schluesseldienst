// Ratgeber-Artikel: Rauchmelderpflicht. Eigene Texte nach Themenpass (Kern: Hessen ausführlich; andere Länder nur,
// wo der Wortlaut geprüft ist; Mieter und Eigentümer getrennt). Fakten aus recht-rauchmelder (Hessen, NRW) und
// norm-rauchmelder. Bayern und Sachsen sind im Faktenblatt, aber nur als Zusammenfassung gelesen, deshalb nicht im Text.
import rr from '../fakten/recht-rauchmelder.mjs';
import nm from '../fakten/norm-rauchmelder.mjs';

export default {
  titel: 'Rauchmelderpflicht: wer, wo und was in Hessen gilt',
  beschreibung: 'Wo in Hessen Rauchwarnmelder vorgeschrieben sind, wer sie betriebsbereit halten muss und was Mieter und Eigentümer dazu klären sollten.',
  kategorie: 'recht',
  kurztitel: 'Rauchmelderpflicht',
  h1: 'Rauchmelderpflicht: Wer, wo und was gilt',
  // Zwei Sätze ohne Paragrafen: Den Gesetzeswortlaut mit Beleg bringt der Abschnitt „Welche Räume“.
  kurz: 'In Hessen braucht jeder Schlafraum, jedes Kinderzimmer und jeder Flur auf dem Rettungsweg mindestens einen Rauchwarnmelder. Betriebsbereit halten ihn die unmittelbaren Besitzer, sofern der Eigentümer das nicht übernommen hat.',
  stand: '2026-10-25',
  figur: 'rauchmelder',
  figurText: 'Schema einer Wohnung: Melder im Schlafzimmer, im Kinderzimmer und im Flur, über den der Rettungsweg führt. Das Wohnzimmer nennt die hessische Aufzählung nicht.',
  wichtig: [
    'In Hessen gehören **Rauchwarnmelder** in Schlafräume, Kinderzimmer und Flure auf dem Rettungsweg.',
    'Ein Melder muss so betrieben werden, dass er **Brandrauch früh meldet**.',
    'Im **Mietverhältnis** klären Sie schriftlich, wer die Betriebsbereitschaft übernimmt.',
  ],
  abschnitte: [
    {
      titel: 'Pflicht in Hessen',
      absaetze: [
        [rr.fakten['hessen-funktion'], ' Es kommt also auf die Funktion an, nicht nur auf das Gerät.'],
        [rr.fakten['hessen-bussgeld'], ' Die Pflicht ist also mehr als eine Empfehlung.'],
      ],
      hinweis: { art: 'info', text: 'Gesetze ändern sich. Prüfen Sie die aktuelle Fassung im Landesrecht, bevor Sie sich darauf verlassen.' },
    },
    {
      titel: 'Wer einbaut, wer wartet',
      absaetze: [
        'Wer den Melder einbauen muss, nennt der geprüfte Gesetzestext nicht ausdrücklich. Klären Sie das mit Ihrer Vermieterin, Ihrem Vermieter oder der Bauaufsicht.',
        [rr.fakten['hessen-betrieb']],
        [nm.fakten['14676-1-zweck'], ' ', nm.fakten['14676-1-ausgabe'], ' Ob diese Norm in Hessen verbindlich gilt, ist hier nicht belegt.'],
      ],
    },
    {
      titel: 'Welche Räume',
      absaetze: [
        [rr.fakten['hessen-wohnungen']],
        'Wohnzimmer und Küche nennt diese Aufzählung nicht. Ob dort Melder sinnvoll sind, ist eine andere Frage.',
      ],
      hinweis: { art: 'info', text: 'Die Aufzählung gilt für Wohnungen. Andere Nutzungen haben eigene Regeln, die dieser Artikel nicht behandelt.' },
    },
    {
      titel: 'Andere Länder im Überblick',
      absaetze: [
        'Die Bauordnungen unterscheiden sich von Land zu Land. Hier stehen die Regeln nur für Nordrhein-Westfalen.',
        [rr.fakten['nrw-wohnungen'], ' ', rr.fakten['nrw-betrieb']],
        'Für Ihr Land gibt die zuständige Bauaufsicht Auskunft.',
      ],
      hinweis: { art: 'info', text: 'Zu Fristen für ältere Wohnungen nennen wir hier keine Angaben. Fragen Sie dazu die Bauaufsicht Ihres Landes.' },
    },
  ],
  faq: [
    { frage: 'Wer muss in einer Mietwohnung die Rauchmelder warten?', antwort: [rr.fakten['hessen-betrieb'], ' Was dazu im Einzelnen gehört, klären Sie mit Ihrer Vermieterin oder Ihrem Vermieter.'] },
    { frage: 'In welchen Räumen sind Rauchmelder vorgeschrieben?', antwort: [rr.fakten['hessen-wohnungen'], ' Das gilt für Hessen; andere Länder können anders regeln.'] },
    { frage: 'Gilt die Pflicht auch für Bestandsbauten?', antwort: 'Zu Fristen für ältere Wohnungen nennen wir hier keine Angaben. Fragen Sie die Bauaufsicht, ob Ihre Wohnung betroffen ist.' },
  ],
  weiter: [
    { pfad: '/sicherheitstechnik/rauchmelder/', titel: 'Rauchmelder', text: 'Welcher Melder wofür passt, Schritt für Schritt.' },
    { pfad: '/sicherheitstechnik/', titel: 'Sicherheitstechnik', text: 'Alarmanlagen, Kameras und Rauchmelder im Überblick.' },
    { pfad: '/ratgeber/', titel: 'Alle Ratgeber', text: 'Artikel rund um Schloss, Einbruchschutz und Tresor.' },
  ],
};
