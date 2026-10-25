// Über uns (V09, Erzählansicht) – eigene Texte nach Themenpass /ueber-uns/.
// Belegbare Angaben über den Betrieb (Name, Sitz, Leistungsgruppen, Gründung, Qualifikationen, Team) kommen
// aus der Konfiguration und werden in der Vorlage ausgegeben; fehlende Angaben entfallen dort.
// Die Leitidee nutzt das Faktenblatt weilburg-tunnel (Status „verifizieren“, bis der Mensch prüft).
import tunnel from './fakten/weilburg-tunnel.mjs';

export default {
  titel: 'Schlüsseldienst Weilburg über uns: Wer wir sind',
  beschreibung: 'Wer hinter dem Schlüsseldienst in Weilburg steht: Sitz, Leistungsgruppen, unsere Arbeitsweise und der direkte Weg zu uns.',
  kicker: 'Über uns',
  h1: 'Über uns: der Schlüsseldienst in Weilburg',
  einleitung: 'Wer hinter dem Betrieb steht und welche Leistungen wir anbieten.',
  wer: {
    titel: 'Wer wir sind',
  },
  werte: {
    titel: 'Wofür wir stehen: ruhig, präzise, offen',
    eintraege: [
      { titel: 'Ruhig', text: 'Im Notfall klären wir am Telefon zuerst Lage und Ort. Danach wissen Sie, wie es weitergeht.' },
      { titel: 'Präzise', text: 'Tür, Schloss und Gerät verlangen jeweils eigene Lösungen. Unsere Leistungen sind deshalb in Gruppen geordnet, damit Sie schnell das Passende finden.' },
      { titel: 'Offen', text: 'Den Gesamtpreis finden Sie vorab auf der [Preisseite](/preise/), nach Zeitfenster und Zone.' },
    ],
  },
  weg: {
    titel: 'Der gerade Weg',
    fakt: tunnel.fakten.abkuerzung,
    text: 'Bei jedem Schloss halten wir es genauso: Wir suchen die eine Linie, auf der es ohne Gewalt aufgeht.',
  },
  ruf: {
    titel: 'Wie Sie uns erreichen',
    text: 'Geht eine Tür nicht mehr auf, rufen Sie an. Alles, was warten kann, schreiben Sie uns über die Kontaktseite.',
    link: { text: 'Zur Kontaktseite', pfad: '/kontakt/' },
  },
  weiter: [
    { pfad: '/kontakt/', titel: 'Kontakt', text: 'Anruf im Notfall, E-Mail für alles Planbare.' },
    { pfad: '/ratgeber/schluesseldienst-abzocke-erkennen/', titel: 'Abzocke erkennen', text: 'Woran Sie unseriöse Betriebe erkennen.' },
    { pfad: '/einsatzgebiet/', titel: 'Einsatzgebiet', text: 'Ob und mit welcher Anfahrt wir zu Ihnen kommen.' },
  ],
};
