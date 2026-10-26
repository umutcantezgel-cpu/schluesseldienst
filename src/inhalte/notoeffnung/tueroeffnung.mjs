// Leistungsseite Türöffnung (V03, Muster für alle Detailseiten) – eigene Texte nach Themenpass
// /notoeffnung/tueroeffnung/. Keine Zahlen ohne Faktenblatt, keine Zusagen außerhalb der Konfiguration (K-010).
export default {
  titel: 'Türöffnung in Weilburg: zugefallen oder abgeschlossen',
  beschreibung: 'Tür zugefallen oder abgeschlossen? Wie wir Wohnungs- und Haustüren in Weilburg und Umgebung öffnen, wann gebohrt werden muss und was danach kommt.',
  h1: 'Türöffnung in Weilburg und Umgebung',
  kurz: 'Eine nur zugefallene Tür öffnen wir in aller Regel, ohne Schloss oder Tür zu beschädigen. Ist abgeschlossen, kann es nötig sein, den Zylinder zu bohren – das besprechen wir vorher mit Ihnen, samt Preis.',
  figur: 'falle-riegel',
  figurText: 'Zugefallen hält nur die Falle, die sich zurückdrücken lässt. Abgeschlossen sitzt zusätzlich der Riegel in der Zarge.',
  blick: [
    { titel: 'Zugefallen', text: 'meist ohne Schaden über die Falle' },
    { titel: 'Abgeschlossen', text: 'über den Zylinder, Bohren nur nach Rückfrage' },
    { titel: 'Nachweis', text: 'Ausweis, Mietvertrag oder Bestätigung durch Nachbarn' },
    { titel: 'Preis', text: 'Gesamtpreis nach Uhrzeit und Zone – siehe unten' },
  ],
  abschnitte: [
    {
      titel: 'Zugefallen oder abgeschlossen',
      absaetze: [
        'Fällt eine Tür nur ins Schloss, hält sie allein die Falle – der abgeschrägte Riegel, der beim Zuziehen einrastet. Sie lässt sich in den meisten Fällen von außen zurückdrücken, ohne dass Zylinder oder Schloss etwas abbekommen.',
        'Wurde abgeschlossen, steckt zusätzlich der Riegel in der Zarge. Dann führt der Weg über den Zylinder. Das braucht mehr Zeit und Werkzeug und kostet deshalb mehr – so steht es auch in der Preisliste. Ausführlich erklärt: [Zugefallen oder abgeschlossen?](/ratgeber/tuer-zugefallen-oder-abgeschlossen/)',
      ],
    },
    {
      titel: 'Schonend zuerst, Bohren nur nach Rückfrage',
      hinweis: 'info',
      absaetze: [
        'Wir beginnen immer mit den Methoden, die nichts zerstören. Erst wenn sie nicht zum Ziel führen, kommt das Bohren infrage – und auch dann nur, wenn Sie zugestimmt haben und wissen, was ein neuer Zylinder kostet.',
        'Gebohrt wird der Zylinder, nicht die Tür. Das Schloss im Türblatt bleibt in aller Regel erhalten.',
      ],
    },
    {
      titel: 'Wenn sich eine Tür nicht schonend öffnen lässt',
      absaetze: [
        'Manche Türen sind so gut gesichert, dass sie sich nicht ohne Schaden öffnen lassen – etwa mit hochwertigen Zylindern, Schutzbeschlägen oder Zusatzschlössern. Dann zeigen wir Ihnen, welche Wege bleiben und was jeder kostet. Sie entscheiden, bevor etwas beschädigt wird.',
      ],
    },
    {
      titel: 'Haustür und Wohnungstür im Mehrfamilienhaus',
      absaetze: [
        'Im Mehrfamilienhaus sind es oft zwei Türen. Kommen Sie nicht ins Haus, klingeln Sie zuerst bei Nachbarn oder rufen Sie die Hausverwaltung an – das spart eine zweite Öffnung.',
        'Die Haustür gehört meist zur Schließanlage des Hauses. Dort öffnen wir nur in Absprache mit der Verwaltung oder den Eigentümern.',
      ],
    },
    {
      titel: 'Danach: Zylinder behalten oder tauschen',
      absaetze: [
        'Nach einer schonenden Öffnung bleibt Ihr Zylinder in aller Regel nutzbar. Musste gebohrt werden, braucht die Tür einen neuen – welche Bauarten es gibt, steht unter [Schließzylinder](/einbruchschutz/schliesszylinder/).',
        'Ist der Schlüssel verloren und mit Ihrer Adresse auffindbar, raten wir zum Tausch, auch wenn die Öffnung schonend war.',
      ],
    },
  ],
  preis: {
    text: 'Gesamtpreise mit Anfahrt im Kerngebiet. Was in Ihrer Zone gilt, steht auf der [Preisseite](/preise/).',
    positionen: ['tuer-zugefallen', 'tuer-abgeschlossen', 'zylinder'],
  },
  faq: [
    { frage: 'Was passiert, wenn sich die Tür nicht ohne Bohren öffnen lässt?', antwort: 'Dann sagen wir es Ihnen, bevor wir etwas beschädigen, und nennen den Preis für den neuen Zylinder. Gebohrt wird nur mit Ihrer Zustimmung.' },
    { frage: 'Öffnen Sie auch die Haustür eines Mehrfamilienhauses?', antwort: 'Ja, in Absprache mit der Hausverwaltung oder den Eigentümern, weil die Haustür meist zur Schließanlage des Hauses gehört. Oft hilft es schon, bei Nachbarn zu klingeln.' },
    { frage: 'Was gilt, wenn innen ein Schlüssel steckt?', antwort: 'Steckt innen ein Schlüssel im Zylinder, kann das manche Methoden blockieren. Sagen Sie es uns am Telefon; dann wissen wir, was wir mitbringen müssen.' },
    { frage: 'Bekomme ich nach dem Öffnen gleich einen neuen Zylinder?', antwort: 'Wenn einer nötig ist und Sie es möchten, besprechen wir Bauart und Preis vor Ort. Nach einer schonenden Öffnung ist ein Tausch meist nicht nötig.' },
  ],
  weiter: [
    { pfad: '/ratgeber/tuer-zugefallen-oder-abgeschlossen/', titel: 'Zugefallen oder abgeschlossen?', text: 'Falle und Riegel einfach erklärt.' },
    { pfad: '/einbruchschutz/schliesszylinder/', titel: 'Schließzylinder', text: 'Wenn nach der Öffnung ein neuer Zylinder nötig ist.' },
    { pfad: '/ratgeber/schadensbilder/', titel: 'Schadensbilder', text: 'Was Selbstversuche und Gewalt an Türen anrichten.' },
  ],
};
