// Wortliste der weichen Trennstellen für Überschriften (KERN K-006). Überschriften trennen nie automatisch
// (basis.css: hyphens: manual); lange Komposita brechen nur an den hier markierten Fugen (| = &shy;).
// Ein Eintrag passt auf jedes Wort, das ihn enthält, unabhängig von Groß- und Kleinschreibung und Endung:
// „schlüssel|dienst“ trennt auch „Schlüsseldienstes“ und „Schlüsseldienst-Kosten“. Einträge sind Wortteile ab
// 7 Buchstaben, damit sie nicht zufällig in fremden Wörtern stecken. Ortsnamen stehen hier nicht: Eigennamen trennen nie.
export const TRENNSTELLEN = [
  // Betrieb und Seitenarten
  'schlüssel|dienst', 'einsatz|gebiet', 'einsatz|orte', 'pannen|dienst', 'erreich|barkeit',
  'preis|rechner', 'preis|liste', 'quellen|liste', 'stehlgut|liste', 'rechts|seiten', 'haupt|seiten',
  'barriere|freiheit', 'daten|schutz', 'widerrufs|recht', 'berufs|recht', 'verbraucher|streit|beilegung',
  'haus|verwaltung', 'eigentums|nachweis', 'entscheidungs|hilfe', 'steuer|ermäßigung', 'instand|setzung',
  // Notöffnung
  'not|öffnung', 'tür|öffnung', 'auto|öffnung', 'garagen|öffnung', 'tresor|öffnung', 'einbruch|schaden',
  'not|schlüssel', 'zweit|schlüssel', 'haupt|schlüssel', 'nach|schlüssel', 'funk|schlüssel', 'schlüssel|anhänger',
  'schlüssel|schloss', 'not|entriegelung', 'not|verschluss', 'fern|bedienung', 'zerstörungs|frei',
  // Einbruchschutz
  'einbruch|schutz', 'einbruch|hemmend', 'schließ|zylinder', 'sicherheits|zylinder', 'schließ|anlage', 'schließ|blech',
  'schließ|seite', 'schließ|plan', 'schließ|kraft', 'gleich|schließend', 'tür|schl', 'tür|sicherung', 'zusatz|schl',
  'kasten|zusatz', 'zusatz|sicherung', 'schutz|beschl', 'schutz|funktion', 'einsteck|schloss', 'zentral|schloss',
  'schloss|arten', 'fenster|sicherung', 'keller|fenster', 'terrassen|tür', 'wohnungs|tür', 'mehr|fach|verriegelung',
  'pilz|kopf|verriegelung', 'sicherheits|check', 'zylinder|abdeckung', 'kern|zieh|schutz', 'gleit|schiene', 'schwach|stelle',
  'familien|haus', 'reihen|folge', 'sicherungs|karte',
  // Sicherheitstechnik
  'sicherheits|technik', 'sicherheits|gefühl', 'alarm|anlage', 'anlagen|arten', 'video|überwachung', 'nebel|system',
  'rauch|melder', 'melder|pflicht', 'melder|arten', 'wärme|melder', 'rauch|schutz', 'brand|schutz', 'innen|raum',
  'raum|schutz', 'funk|vernetzung', 'batterie|wechsel', 'grundstücks|grenze', 'hinweis|schild',
  // Einbau und Tresore
  'sicherheits|tür', 'sicherheits|fenster', 'möbel|tresor', 'wert|schutz|schr', 'daten|sicherungs|schr', 'daten|träger',
  'waffen|schr', 'waffen|behörde', 'munitions|fach', 'widerstands|klasse', 'widerstands|grad', 'innen|ausstattung',
  'aufstell|ort', 'versicherungs|summe',
];
