// Verzeichnis /leistungen/ (V11) – eigene Texte nach Themenpass /leistungen/ (src/konfig/themenpaesse.mjs).
// Die Liste selbst entsteht aus src/konfig/leistungen.mjs; hier stehen nur Kopf und Schlussband.
export default {
  titel: 'Schlüsseldienst Leistungen: alle Gruppen im Überblick',
  beschreibung: 'Alle Leistungen aus Weilburg auf einen Blick: Notöffnung, Einbruchschutz, Sicherheitstechnik, Einbau und Tresore – je Leistung ein Satz.',
  kicker: 'Leistungen',
  h1: 'Alle Leistungen auf einen Blick',
  einleitung: 'Hier stehen alle Leistungen des Betriebs, geordnet nach vier Gruppen. Ein Satz nennt jeweils, worum es geht; die Detailseite führt weiter.',
  sprungTitel: 'Gruppen im Register',
  // Mit JavaScript wird die Sprungleiste zum Filter (Modul gruppenfilter); „Alle“ springt ohne JavaScript zur ersten Gruppe
  filterTitel: 'Leistungen nach Gruppe filtern',
  sprungAlle: 'Alle',
  // Ohne JavaScript springt „Alle“ zur ersten Gruppe; der Name sagt das (enthält den sichtbaren Text, WCAG 2.5.3)
  sprungAlleName: 'Alle Gruppen, ab der ersten Gruppe',
  schluss: {
    titel: 'Welche Leistung passt zu Ihrem Fall?',
    text: 'Die Preise und die Anfahrt je Zone stehen auf der Preisseite. Sind Sie unsicher, welche Leistung gemeint ist, schreiben Sie uns über die Kontaktseite.',
    links: [{ text: 'Preise ansehen', pfad: '/preise/' }, { text: 'Kontakt aufnehmen', pfad: '/kontakt/' }],
  },
};
