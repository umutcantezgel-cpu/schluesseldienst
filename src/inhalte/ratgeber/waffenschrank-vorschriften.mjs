// Ratgeber-Artikel: Waffenschrank Vorschriften. Eigene Texte nach Themenpass (Kern: Pflicht zur Aufbewahrung,
// Kontrolle durch die Behörde, typische Fragen). Rechtslage nur über das Faktenblatt recht-waffen; Normen nur über
// norm-wertschutz. Welches Behältnis zu welcher Waffe passt, ist nicht belegt und steht deshalb nicht im Text.
// Keine Rechtsberatung: Maßgeblich ist die Auskunft der zuständigen Waffenbehörde.
import waffen from '../fakten/recht-waffen.mjs';
import wert from '../fakten/norm-wertschutz.mjs';

const w = waffen.fakten;
const n = wert.fakten;

export default {
  titel: 'Waffenschrank Vorschriften einfach erklärt',
  beschreibung: 'Was das Waffenrecht zur Aufbewahrung von Waffen und Munition sagt, was die Behörde kontrollieren darf und wann Sie die Waffenbehörde fragen sollten.',
  kategorie: 'recht',
  kurztitel: 'Waffenschrank Vorschriften',
  h1: 'Waffenschrank: Vorschriften zur Aufbewahrung',
  kurz: [
    w['pflicht-vorkehrungen'], ' ',
    'Welches Behältnis zu welcher Waffe passt, ist hier nicht belegt; fragen Sie die zuständige Waffenbehörde. ',
    'Dieser Artikel erklärt die belegte Rechtslage und nennt ausdrücklich, was offen ist.',
  ],
  stand: '2026-10-25',
  figur: 'stufen',
  figurText: 'Drei Stufen mit Beispielen für Schutzbehältnisse; die Figur nennt keine Vorschrift für Ihren Schrank.',
  wichtig: [
    'Waffen und Munition müssen Sie so **aufbewahren**, dass sie nicht abhandenkommen und Unbefugte nicht an sie kommen.',
    'Bei der Wahl des **Behältnisses** hilft die zuständige Waffenbehörde, bevor Sie einen Schrank kaufen.',
    'Die Behörde kann die **Aufbewahrung** kontrollieren und dafür die Räume betreten, in denen Waffen liegen.',
  ],
  abschnitte: [
    {
      titel: 'Grundsatz der sicheren Aufbewahrung',
      absaetze: [
        [w['pflicht-vorkehrungen']],
        [w.verordnung],
        'Schreiben Sie vorab auf, welche Waffen und welche Munition Sie besitzen. Diese Liste hilft bei jedem Gespräch mit der Waffenbehörde.',
      ],
      hinweis: { art: 'info', text: 'Wenn Sie unsicher sind, fragen Sie die zuständige Waffenbehörde, bevor Sie ein Behältnis kaufen. Das gilt auch dann, wenn ein Angebot eilig erscheint.' },
    },
    {
      titel: 'Waffenart und Behältnis',
      absaetze: [
        'Welches Behältnis zu welcher Waffenart passt, ist in diesem Artikel nicht belegt. Deshalb wird hier keine Schutzklasse für einzelne Waffen genannt. Eine Schutzklasse ersetzt außerdem nicht die Auskunft der Behörde.',
        [n['1143-1-titel'], ' Ob diese Norm für Ihren Waffenschrank gilt, ist hier nicht belegt.'],
        [w['hoeherer-standard']],
      ],
      schritte: [
        'Schreiben Sie auf, welche Waffen und wie viel Munition Sie besitzen.',
        'Fragen Sie die zuständige Waffenbehörde, welche Anforderungen sie in Ihrem Fall stellt.',
        'Kaufen Sie erst danach ein Behältnis und klären Sie vorher, wo es stehen soll.',
      ],
      hinweis: { art: 'info', text: 'Lassen Sie sich Anforderungen der Behörde möglichst schriftlich geben.' },
    },
    {
      titel: 'Munition',
      absaetze: [
        ['Die Pflicht zur Vorsorge betrifft Waffen und Munition gleichermaßen. ', w['nachweis-behoerde']],
        'Ob Munition in einem eigenen Behältnis liegen muss, ist hier nicht belegt. Fragen Sie dazu die zuständige Waffenbehörde.',
        'Sprechen Sie die Aufbewahrung von Munition deshalb früh mit der Behörde ab, nicht erst bei einer Kontrolle. Dazu gehört auch die Frage, wo die Munition gelagert wird.',
      ],
      hinweis: { art: 'info', text: 'Ein Behältnis allein ersetzt nicht die Auskunft der zuständigen Waffenbehörde über Ihre Pflichten.' },
    },
    {
      titel: 'Kontrollen durch die Behörde',
      absaetze: [
        [w['kontrolle-behoerde']],
        'Halten Sie den Nachweis zur Aufbewahrung und Ihre Liste der Waffen bereit, falls die Behörde danach fragt.',
        'Klären Sie vorab, wer Zugang zum Schrank und zu den Schlüsseln hat.',
      ],
      hinweis: { art: 'info', text: 'Keine Rechtsberatung: Maßgeblich ist die Auskunft der zuständigen Waffenbehörde.' },
    },
  ],
  faq: [
    { frage: 'Welche Waffen dürfen in welchem Behältnis liegen?', antwort: 'Diese Zuordnung ist in diesem Artikel nicht belegt. Fragen Sie vor dem Kauf die zuständige Waffenbehörde. Im Einzelfall kann sie zusätzliche Anforderungen stellen.' },
    { frage: 'Darf die Behörde meine Aufbewahrung zu Hause kontrollieren?', antwort: [w['kontrolle-behoerde'], ' Ob das bei Ihnen im Einzelfall so ist, klärt die Behörde. Halten Sie Ihre Unterlagen deshalb griffbereit.'] },
    { frage: 'Was gilt bei einem Umzug mit Waffenschrank?', antwort: 'Dazu gibt es in diesem Artikel keinen belegten Fakt. Fragen Sie vor dem Umzug die zuständige Waffenbehörde, auch ob der Schrank am neuen Ort anders zu sichern ist.' },
  ],
  weiter: [
    { pfad: '/einbau-tresore/waffenschraenke/', titel: 'Waffenschränke', text: 'Schränke zur Aufbewahrung, geliefert und fachgerecht aufgestellt.' },
    { pfad: '/einbau-tresore/wertschutzschraenke/', titel: 'Wertschutzschränke', text: 'Wertbehältnisse für Wertsachen, mit Blick auf Widerstandsgrad und Versicherung.' },
    { pfad: '/ratgeber/tresor-kaufen-widerstandsgrade/', titel: 'Tresor kaufen', text: 'Worauf Sie beim Tresor achten, von Wert bis Aufstellort.' },
  ],
};
