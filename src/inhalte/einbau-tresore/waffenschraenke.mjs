// Leistungsseite Waffenschränke (V03, Muster: notoeffnung/tueroeffnung.mjs) – eigene Texte nach Themenpass
// /einbau-tresore/waffenschraenke/. Praktischer Blickwinkel: Auswahl, Innenraum, Aufstellen, Unterlagen.
// Rechtsfragen verweisen auf die Waffenbehörde und den Ratgeber (Faktenblatt recht-waffen ungeprüft).
// Keine Zahlen, Normen, Paragrafen oder Preise; keine Zusagen außerhalb der Konfiguration (K-010).
export default {
  titel: 'Waffenschrank kaufen und aufstellen lassen in Weilburg',
  beschreibung: 'Waffenschrank kaufen und aufstellen lassen: Auswahl nach Waffenart, Innenraum und Verankerung. Rechtsfragen klärt die Waffenbehörde.',
  h1: 'Waffenschrank kaufen und fachgerecht aufstellen lassen',
  kurz: 'Welcher Waffenschrank passt, hängt von Ihren Waffen und den Vorgaben der Waffenbehörde ab. Wir helfen bei der Auswahl, liefern den Schrank und stellen ihn fachgerecht auf. Rechtsfragen klärt die zuständige Waffenbehörde, nicht wir.',
  figurText: 'Vom Möbeltresor bis zum Schrank; unten die Verankerung im Boden.',
  blick: [
    { titel: 'Auswahl', text: 'nach Waffenart, Anzahl und Aufstellort' },
    { titel: 'Innenraum', text: 'Halterungen, Ablagen, Munitionsfach je nach Modell' },
    { titel: 'Aufstellen', text: 'Transport, Standort und Verankerung vor Ort' },
    { titel: 'Behörde', text: 'Anforderungen klärt die zuständige Waffenbehörde' },
  ],
  abschnitte: [
    {
      titel: 'Auswahl nach Waffenart',
      absaetze: [
        'Die Auswahl richtet sich danach, was in den Schrank soll. Langwaffen brauchen im Innenraum mehr Länge als Kurzwaffen. Auch die Anzahl der Waffen bestimmt die nötigen Innenmaße.',
        'Welche Anforderungen an den Schrank gelten, klärt die zuständige Waffenbehörde. Was Begriffe wie Widerstandsgrad bedeuten, erklärt der [Ratgeber zu Widerstandsgraden](/ratgeber/tresor-kaufen-widerstandsgrade/). Ob ein Schrank passt, besprechen wir vor dem Kauf.',
      ],
    },
    {
      titel: 'Innenausstattung und Munitionsfach',
      absaetze: [
        'Im Innenraum finden sich Halterungen und Ablagen. Wie sie angeordnet sind, unterscheidet sich je nach Modell. Manche Schränke haben ein abgetrenntes Fach für Munition, andere nicht.',
        'Welche Vorgaben zur Munition gelten, klärt die Waffenbehörde. Welche Ausstattung ein Modell hat, steht in seiner Beschreibung.',
      ],
    },
    {
      titel: 'Aufstellen und Verankern',
      absaetze: [
        'Ein Waffenschrank ist schwer. Vor dem Termin klären wir, ob er durch Eingang, Flur und Treppenhaus passt und wo er stehen soll.',
        'Ob eine Verankerung vorgesehen ist, klärt die Waffenbehörde. Ist sie vorgesehen, richtet sich die Befestigung nach Untergrund und Wand. Wir setzen sie fachgerecht um.',
      ],
    },
    {
      titel: 'Unterlagen für die Waffenbehörde',
      absaetze: [
        'Welche Unterlagen die Waffenbehörde zum Schrank sehen will, entscheidet sie selbst. Fragen Sie dort vor dem Kauf nach, welche Angaben sie braucht.',
        'Was für den Aufstellungstermin nötig ist, besprechen wir vorher mit Ihnen. Eine Rechtsauskunft geben wir hier nicht. Den Überblick zu den Vorschriften finden Sie im [Ratgeber](/ratgeber/waffenschrank-vorschriften/).',
      ],
    },
  ],
  faq: [
    { frage: 'Welche Unterlagen zum Schrank will die Waffenbehörde sehen?', antwort: 'Das entscheidet die Waffenbehörde selbst. Fragen Sie dort vor dem Kauf nach, welche Angaben sie braucht. Was für den Aufstellungstermin nötig ist, besprechen wir mit Ihnen.' },
    { frage: 'Darf Munition im selben Schrank liegen?', antwort: 'Verbindlich antwortet darauf die Waffenbehörde. Schränke mit abgetrenntem Munitionsfach gibt es, nicht jedes Modell hat eins.' },
    { frage: 'Muss ein Waffenschrank verankert werden?', antwort: 'Das hängt vom Schrank und den Vorgaben ab, und die verbindliche Auskunft gibt die Waffenbehörde. Ist eine Verankerung vorgesehen, setzen wir sie fachgerecht um.' },
  ],
  weiter: [
    { pfad: '/ratgeber/waffenschrank-vorschriften/', titel: 'Waffenschrank und Vorschriften', text: 'Rechtslage im Überblick, ohne verbindliche Auskunft.' },
    { pfad: '/einbau-tresore/wertschutzschraenke/', titel: 'Wertschutzschränke', text: 'Für Wertsachen statt Waffen, mit eigener Auswahl.' },
    { pfad: '/einbau-tresore/', titel: 'Einbau und Tresore', text: 'Schränke und Türen dieser Gruppe im Überblick.' },
  ],
};
