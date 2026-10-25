// Ratgeber-Artikel: Schließzylinder wechseln. Eigene Texte nach Themenpass (Kern: Schritt für Schritt mit
// Messgrafik und den Fällen, in denen Selbermachen nicht reicht). Zahlen, Normen und Klassen nur über Fakten
// aus norm-zylinder; Messhinweise sind allgemeine Handgriffe ohne Faktenblatt (siehe Bericht).
import zyl from '../fakten/norm-zylinder.mjs';

export default {
  titel: 'Schließzylinder wechseln: Schritt für Schritt',
  beschreibung: 'Zylinder richtig messen, ausbauen und einbauen. Dazu die Fälle, in denen ein Fachbetrieb besser ist, und worauf Sie beim neuen Zylinder achten.',
  kategorie: 'technik',
  kurztitel: 'Zylinder wechseln',
  h1: 'Schließzylinder wechseln',
  kurz: 'Einen Schließzylinder können Sie oft selbst wechseln, wenn Sie beide Maße kennen. Ob der Wechsel zu Ihrer Tür passt, hängt auch von Beschlag, Schloss und Schließanlage ab.',
  stand: '2026-10-25',
  figur: 'zylinder',
  figurText: 'Schnitt durch einen Schließzylinder: Liegen alle Stifte auf der Scherlinie, lässt sich der Kern drehen.',
  wichtig: [
    'Messen Sie vor dem Kauf **Innen- und Außenmaß** des alten Zylinders.',
    'Bei einer **Schließanlage** oder einer Mehrfachverriegelung ist ein Fachbetrieb meist die bessere Wahl.',
    'Wählen Sie den neuen Zylinder nicht nur nach dem Preis, sondern achten Sie auf einen **Bohrschutz**.',
  ],
  abschnitte: [
    {
      titel: 'Messen: Außen- und Innenmaß',
      absaetze: [
        'Ein Profilzylinder wird an zwei Maßen gemessen: dem Innenmaß und dem Außenmaß. Beide brauchen Sie beim Kauf, damit der neue Zylinder in die Tür passt.',
        'Nehmen Sie den alten Zylinder, wenn möglich, mit zum Kauf. Schon kleine Abweichungen führen dazu, dass er nicht passt.',
      ],
      schritte: [
        'Messen Sie das Innenmaß vom Mittelpunkt des Schlüsselkanals bis zur Innenseite der Tür.',
        'Messen Sie das Außenmaß vom Mittelpunkt des Schlüsselkanals bis zur Außenseite der Tür.',
        'Prüfen Sie, ob ein Schutzbeschlag montiert ist, und nennen Sie das beim Kauf.',
      ],
      hinweis: { art: 'info', text: 'Messen Sie mit einem Maßband oder einem Lineal und notieren Sie die Werte in Millimetern.' },
    },
    {
      titel: 'Ausbauen und Einbauen',
      absaetze: [
        'Ziehen Sie den Schlüssel ab und sichern Sie die Tür, bevor Sie am Zylinder arbeiten. Lösen Sie dann die Befestigungsschrauben, die den Zylinder halten.',
        'Ist ein Schutzbeschlag mit Zylinderabdeckung montiert, nehmen Sie zuerst die Abdeckung ab. Erst danach liegt der Zylinder frei.',
        'Halten Sie Schrauben und Kleinteile zusammen, damit der Einbau einfacher wird. Ist das Schloss selbst in Ordnung, genügt in der Regel der Austausch des Zylinders.',
      ],
      schritte: [
        'Ziehen Sie den Zylinder vorsichtig heraus.',
        'Setzen Sie den neuen Zylinder so ein, dass der Mitnehmer ins Schloss greift.',
        'Prüfen Sie die Funktion mit dem Schlüssel, bevor Sie die Schrauben fest anziehen.',
      ],
      hinweis: { art: 'warnung', text: 'Gewalt hilft beim Ausbau nicht. Ein beschädigtes Schloss macht den Wechsel aufwendiger und teurer.' },
    },
    {
      titel: 'Wann Sie lieber uns rufen',
      absaetze: [
        'Ein einfacher Zylinder in einer Tür mit einem Schloss ist gut selbst zu wechseln. Bei einer Schließanlage, Mehrfachverriegelung oder einem Schutzbeschlag wird der Wechsel aufwendiger. Ein Fehler am Schloss kostet dann mehr.',
        'Klemmt der Zylinder oder steckt ein Teil fest, ist ein Fachbetrieb die bessere Wahl. Auf Wunsch beraten wir Sie zur Auswahl und bauen den Zylinder ein.',
        'Ist ein Schlüssel verloren, hängt die Reaktion von der Anlage ab. Mehr dazu unter [Schlüssel verloren](/ratgeber/schluessel-verloren/).',
      ],
      hinweis: { art: 'info', text: 'Unsere Preise stehen offen auf der [Preisseite](/preise/). Den Wechsel eines Schließzylinders finden Sie dort als eigene Position.' },
    },
    {
      titel: 'Neuer Zylinder: worauf achten',
      absaetze: [
        ['Fragen Sie beim Kauf nach der Norm, nach der der Zylinder geprüft ist. ', zyl.fakten.aktuell],
        ['Zylinder werden nach Klassen unterschieden. ', zyl.fakten.klassen, ' ', zyl.fakten.empfehlung],
        ['Achten Sie besonders auf den Schutz gegen Bohren. ', zyl.fakten.bohrschutz],
      ],
      liste: [
        ['Auf eine Sicherungskarte achten. ', zyl.fakten['sk-schutz']],
        ['Nachfertigung nur mit Karte. ', zyl.fakten['sk-nachfertigung']],
      ],
      hinweis: { art: 'info', text: ['Auf älteren Zylindern steht eine frühere Kennzeichnung. ', zyl.fakten['bs-bz']] },
    },
  ],
  faq: [
    { frage: 'Wie messe ich meinen Schließzylinder richtig?', antwort: 'Messen Sie Innen- und Außenmaß getrennt, jeweils vom Mittelpunkt des Schlüsselkanals bis zur Türfläche. Notieren Sie beide Werte, bevor Sie bestellen. Ein Foto des alten Zylinders hilft beim Vergleich.' },
    { frage: 'Kann ich den Zylinder ohne Schlüssel ausbauen?', antwort: 'Das hängt von Zylinder und Tür ab. Ist der Schlüssel verloren oder klemmt der Zylinder, lassen Sie ihn besser von einem Fachbetrieb ausbauen. So bleibt das Schloss unbeschädigt.' },
    { frage: 'Was ist bei einer Tür mit Schutzbeschlag anders?', antwort: ['Dann gehören Beschlag und Zylinder zusammen geplant. ', zyl.fakten.schutzbeschlag, ' Lassen Sie sich beim Kauf dazu beraten.'] },
  ],
  weiter: [
    { pfad: '/einbruchschutz/schliesszylinder/', titel: 'Schließzylinder', text: 'Sicherheitszylinder auswählen und einbauen.' },
    { pfad: '/einbruchschutz/schutzbeschlaege/', titel: 'Schutzbeschläge', text: 'Beschläge mit Zylinderabdeckung, die Abbrechen und Ziehen erschweren.' },
    { pfad: '/ratgeber/schluessel-verloren/', titel: 'Schlüssel verloren', text: 'Was nach einem Verlust zu klären ist.' },
  ],
};
