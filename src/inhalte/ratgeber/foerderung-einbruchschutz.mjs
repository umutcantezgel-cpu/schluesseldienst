// Ratgeber-Artikel: Förderung Einbruchschutz. Eigene Texte nach Themenpass (Kern: Stand mit Quelle, ausgelaufene
// Programme nur mit belegtem Status, Steuerweg als Alternative). Zahlen, Beträge und Gesetzesverweise stammen aus
// den Faktenblättern foerderung und recht-35a. Was dort als offen markiert ist, steht im Text als Hinweis zur
// Prüfung, nie als Behauptung.
import foerder from '../fakten/foerderung.mjs';
import steuer from '../fakten/recht-35a.mjs';

const f = foerder.fakten;
const s = steuer.fakten;

export default {
  titel: 'Förderung Einbruchschutz: Stand und Bedingungen',
  beschreibung: 'Welche Förderung für Einbruchschutz belegt ist, mit welchem Stand, welchen Bedingungen und warum der Antrag vor dem Auftrag kommt.',
  kategorie: 'recht',
  kurztitel: 'Förderung Einbruchschutz',
  h1: 'Förderung für Einbruchschutz: was der Stand belegt',
  kurz: [
    f['kredit-159'], ' ',
    f['kredit-159-antrag'], ' ',
    'Einen aktuellen Zuschuss belegt dieser Artikel nicht, und ob der Kredit heute offen ist, prüfen Sie beim Förderinstitut.',
  ],
  stand: '2026-10-25',
  figur: 'fenster-schichten',
  figurText: 'Ein Fenster, Schicht für Schicht: Verriegelung, Griff, Glas und Zusatzsicherung.',
  wichtig: [
    'Belegt ist in diesem Artikel nur ein zinsgünstiger **Kredit** der KfW.',
    'Stellen Sie den **Antrag** vor dem Auftrag, nicht danach.',
    'Für neue **Fenster** gilt ein anderer Förderweg als für den Kredit.',
  ],
  abschnitte: [
    {
      titel: 'Stand der Förderung (mit Datum)',
      absaetze: [
        [f['kredit-159-bund']],
        'Ob der Kredit heute beantragt werden kann, ist mit Datum nicht belegt. Den aktuellen Stand erfragen Sie bei der KfW und bei Ihrem Finanzierungsinstitut.',
        'Ein Förderstand gilt nur mit seinem Datum. Fehlt bei einer Angabe das Datum, behandeln Sie sie als ungeprüft. Vor dem Auftrag klären Sie diese Fragen:',
      ],
      liste: [
        'Ist der Förderstand mit Datum belegt?',
        'Ist der Antrag gestellt, bevor der Auftrag unterschrieben wird?',
        'Ist der ausführende Betrieb ein Fachunternehmen?',
      ],
    },
    {
      titel: 'Bedingungen und Antragsweg',
      absaetze: [
        [f['kredit-159-hoechstbetrag'], ' ', f['kredit-159-fachunternehmen']],
        [f['kredit-159-antrag'], ' ', f['kredit-159-vorhabensbeginn']],
        [f['kredit-159-fenster']],
      ],
      schritte: [
        'Holen Sie Angebote ein, ohne schon einen Auftrag zu erteilen.',
        'Stellen Sie den Antrag beim Finanzierungsinstitut.',
        'Erteilen Sie den Auftrag erst danach an einen Fachbetrieb.',
      ],
      hinweis: { art: 'info', text: 'Fragen Sie jeden Betrieb vor dem Auftrag nach dem Stand der Förderung, auch uns.' },
    },
    {
      titel: 'Was ausgelaufen ist',
      absaetze: [
        'Welche Förderprogramme für Einbruchschutz ausgelaufen sind, ist in diesem Artikel nicht belegt. Deshalb wird hier kein Programm als ausgelaufen genannt.',
        'Zu einzelnen Zuschüssen, die online genannt werden, fehlt ein belegter Stand. Fragen Sie beim Förderinstitut nach, bevor Sie darauf vertrauen.',
        'Ein Landesprogramm für Hessen ist in diesem Artikel ebenfalls nicht belegt. Fragen Sie dazu beim Land Hessen nach.',
      ],
      hinweis: { art: 'info', text: 'Ein Programm, das Ihnen jemand nennt, prüfen Sie mit Datum und Quelle, bevor Sie es in die Planung aufnehmen.' },
    },
    {
      titel: 'Steuerermäßigung als Alternative',
      absaetze: [
        ['Eine andere Möglichkeit ist die Steuerermäßigung für Handwerkerleistungen. Sie senkt die Steuer, ist aber keine Förderung. ', s.anteil, ' ', s.hoechstbetrag],
        [s.arbeitskosten, ' ', s['zahlung-konto']],
        [s['ausschluss-betrieb']],
      ],
      hinweis: { art: 'info', text: 'Klären Sie mit dem Finanzamt oder einer Steuerberatung, ob Einbau und Sicherungen darunter fallen. Fragen Sie dort auch, ob die Regel für Ihr Steuerjahr gilt.' },
    },
  ],
  faq: [
    { frage: 'Gibt es aktuell einen Zuschuss für Einbruchschutz?', antwort: 'In diesem Artikel ist nur ein zinsgünstiger Kredit belegt. Einen aktuellen Zuschuss kann dieser Artikel nicht bestätigen; fragen Sie beim Förderinstitut nach dem Stand.' },
    { frage: 'Muss ich die Förderung vor dem Auftrag beantragen?', antwort: [f['kredit-159-antrag'], ' ', f['kredit-159-vorhabensbeginn']] },
    { frage: 'Kann ich Einbruchschutz als Handwerkerleistung absetzen?', antwort: [s.anteil, ' Ob Ihr Einbau darunter fällt, klären Sie mit dem Finanzamt.'] },
  ],
  weiter: [
    { pfad: '/einbruchschutz/', titel: 'Einbruchschutz', text: 'Mechanische Sicherungen für Türen und Fenster, von Schlössern bis zu Zylindern.' },
    { pfad: '/einbau-tresore/sicherheitstueren/', titel: 'Sicherheitstüren', text: 'Einbruchhemmende Wohnungs- und Haustüren, eingebaut nach der gewünschten Klasse.' },
    { pfad: '/ratgeber/einbruchschutz-haus/', titel: 'Einbruchschutz fürs Haus', text: 'Welche Sicherungen für ein Haus sinnvoll sind, Schritt für Schritt.' },
  ],
};
