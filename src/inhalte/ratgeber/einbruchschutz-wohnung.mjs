// Ratgeber-Artikel: Einbruchschutz in der Wohnung. Eigene Texte nach Themenpass (Kern: Wohnungstür und
// Erdgeschossfenster, mit dem, was Mieter selbst dürfen und was sie absprechen müssen). Zahlen nur aus
// statistik-einbruch, Normaussagen nur aus norm-nachruestung. Zur Rechtslage gibt es keinen belegten Fakt, deshalb Verweis.
import statistik from '../fakten/statistik-einbruch.mjs';
import nachruestung from '../fakten/norm-nachruestung.mjs';

export default {
  titel: 'Einbruchschutz Wohnung: Tür, Fenster und Alltag',
  beschreibung: 'Einbruchschutz für Mietwohnung und Eigentumswohnung: Wohnungstür, Fenster im Erdgeschoss, Abwesenheit nicht zeigen und Absprachen mit der Vermietung.',
  kategorie: 'vorbeugen',
  kurztitel: 'Einbruchschutz Wohnung',
  h1: 'Einbruchschutz in der Wohnung',
  kurz: 'Sichern Sie zuerst die Wohnungstür und die Fenster, die von außen erreichbar sind. Prüfen Sie Zylinder, Beschlag und Verriegelung und sprechen Sie Eingriffe in die Tür vorher mit der Vermietung ab.',
  stand: '2026-10-25',
  figur: 'tuer-schichten',
  figurText: 'Die Wohnungstür in Schichten: Zylinder, Beschlag, Verriegelung, Bandseite und Querriegel.',
  wichtig: [
    'Prüfen Sie zuerst **Zylinder und Beschlag** an Ihrer Wohnungstür.',
    'Prüfen Sie bei **Fenstern** die Verriegelung, nicht nur den Griff.',
    'Sprechen Sie Bohrungen in Tür oder Rahmen vorher mit der **Vermietung** ab.',
  ],
  abschnitte: [
    {
      titel: 'Wo Einbrecher in Wohnungen ansetzen',
      absaetze: [
        ['Auch bundesweit gibt es Zahlen dazu. ', statistik.fakten['bund-faelle'], ' ', statistik.fakten['bund-begriff']],
        ['Für Hessen gibt es eigene Zahlen. ', statistik.fakten['hessen-faelle'], ' ', statistik.fakten['hessen-versuche']],
        'Diese Zahlen reichen nicht, um die eigene Wohnung zu beurteilen. Schauen Sie deshalb nach, welche Tür und welche Fenster von außen erreichbar sind.',
      ],
    },
    {
      titel: 'Die Wohnungstür: Zylinder, Beschlag, Zusatzschloss',
      absaetze: [
        'Beginnen Sie an der Tür und notieren Sie vorab einige Angaben, bevor Sie einen Fachbetrieb anfragen.',
        ['Für die Wohnungstür kommen Nachrüstprodukte in Frage, etwa ein Zusatzschloss. ', nachruestung.fakten['teil1-zweck'], ' Ob ein bestimmtes Zusatzschloss darunter fällt, klären Sie mit dem Hersteller.'],
        'Ein Zusatzschloss ersetzt den Zylinder nicht. Prüfen Sie beides gemeinsam, denn jede lockere Stelle an der Tür zählt.',
      ],
      liste: [
        'Wie viele Schlösser hat die Tür?',
        'Wie ist der Zustand von Rahmen und Schließblech?',
        'Sitzt der Zylinder fest, und wackelt der Beschlag?',
      ],
      hinweis: { art: 'info', text: 'Ein Fachbetrieb prüft Zylinder und Beschlag. Unsere Preise stehen offen auf der [Preisseite](/preise/).' },
    },
    {
      titel: 'Fenster im Erdgeschoss',
      absaetze: [
        'Fenster im Erdgeschoss sind von außen gut erreichbar. Prüfen Sie Verriegelung, Beschläge und Glas an jedem Fenster, das von außen zugänglich ist.',
        ['Abschließbare Griffe sind ein Thema für sich. ', nachruestung.fakten.griffe],
        'Ein Fenster, das klemmt oder schief schließt, sollte ein Fachbetrieb einstellen, bevor Sie eine Nachrüstung planen. Eine Übersicht finden Sie unter [Fenstersicherung](/einbruchschutz/fenstersicherung/).',
      ],
      liste: [
        'Greift die Verriegelung sauber in den Rahmen?',
        'Lässt sich das Fenster ohne Kraft schließen?',
        'Sind Glas und Dichtung unbeschädigt?',
      ],
    },
    {
      titel: 'Mieter: was Sie ohne Erlaubnis tun dürfen',
      absaetze: [
        'Ob Sie ohne Zustimmung nachrüsten dürfen, hängt vom Mietvertrag und vom Eingriff ab. Dazu geben wir keinen Rechtsrat.',
        'Bohrungen in Tür oder Rahmen besprechen Sie vorher mit der Vermietung. Wenn Sie unsicher sind, fragen Sie bei der Verbraucherzentrale Ihres Bundeslandes nach.',
        'Haben Sie eine Zusage nur mündlich erhalten, bitten Sie um eine kurze schriftliche Bestätigung. Bewahren Sie diese zusammen mit dem Mietvertrag auf.',
      ],
      schritte: [
        'Fragen Sie die Vermietung, bevor Sie etwas bohren oder austauschen.',
        'Halten Sie die Zustimmung schriftlich fest.',
        'Fotografieren Sie den alten Zustand, bevor Sie etwas ändern.',
      ],
    },
    {
      titel: 'Verhalten: Abwesenheit nicht zeigen',
      absaetze: [
        'Hinweise auf Abwesenheit entstehen ohne Technik. Ein voller Briefkasten, Post an der Tür oder ein Rollladen, der tagelang unten bleibt, zeigen sie.',
        'Wer das Licht steuern möchte, kann eine Zeitschaltuhr für eine Lampe nutzen. Sie schaltet Licht zu festen Zeiten, auch wenn niemand zu Hause ist.',
        'Einen Nachsendeauftrag richten Sie bei Ihrem Postdienstleister ein, wenn Sie länger fort sind. So sammelt sich weniger im Briefkasten.',
      ],
      liste: [
        'Bitten Sie jemanden, den Briefkasten zu leeren.',
        'Bitten Sie Nachbarn, ein Auge auf die Wohnung zu haben.',
        'Veröffentlichen Sie Urlaubsfotos erst nach der Rückkehr.',
      ],
      hinweis: { art: 'warnung', text: 'Legen Sie keinen Schlüssel unter die Fußmatte oder in einen Blumentopf vor der Tür.' },
    },
  ],
  faq: [
    { frage: 'Was darf ich als Mieter ohne Zustimmung nachrüsten?', antwort: 'Das hängt vom Mietvertrag und vom Eingriff ab, und dazu geben wir keinen Rechtsrat. Fragen Sie die Vermietung vor dem Einbau und bei Unsicherheit die Verbraucherzentrale.' },
    { frage: 'Ist eine Wohnung im dritten Stock weniger gefährdet?', antwort: 'Dazu gibt es in unseren belegten Quellen keine Aussage. Prüfen Sie stattdessen, welche Fenster und Balkone von außen erreichbar sind, unabhängig von der Etage. Ein Baum oder ein Vordach in der Nähe kann einen Zugang erleichtern.' },
    { frage: 'Was kann ich bei Abwesenheit tun, ohne Technik zu kaufen?', antwort: 'Lassen Sie den Briefkasten leeren und bitten Sie Nachbarn um ein Auge auf die Wohnung. Zeigen Sie Ihre Abwesenheit nicht öffentlich, etwa mit Ortsangabe in sozialen Netzwerken.' },
  ],
  weiter: [
    { pfad: '/einbruchschutz/zusatzschloesser/', titel: 'Zusatzschlösser', text: 'Zusatzschlösser für die Wohnungstür und worauf Sie beim Einbau achten.' },
    { pfad: '/einbruchschutz/schutzbeschlaege/', titel: 'Schutzbeschläge', text: 'Beschläge mit Zylinderabdeckung und was sie für Ihre Tür bedeuten.' },
    { pfad: '/ratgeber/haustuer-sicherheitscheck/', titel: 'Haustür-Sicherheit prüfen', text: 'Die eigene Haustür selbst auf Schwachstellen prüfen.' },
  ],
};
