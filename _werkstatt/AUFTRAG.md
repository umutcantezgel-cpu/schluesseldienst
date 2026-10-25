Nutze das, was vorhanden ist, um daraus eine HTML, CSS, JavaScript-Seite zu machen, die rein statisch ist. Sorge dafür, dass der Plan rein Cybersecurity sicher ist, also so weit wie nur möglich. Wir wollen daraus eine Webseite für einen Schlüsseldienst machen. Der Name ist jetzt noch nicht bekannt, das musst du jetzt noch nicht mit implementieren, aber alle Seiten, die jetzt vorhanden sind bei diesen Leuten und alles, was die angewandt haben, wollen wir sozusagen fusionieren zu einer Seite. Diese Seite soll sozusagen diese zwei Unternehmen schwächen und uns an denen sozusagen bereichern, sodass wir dann stärker herauskommen. Wir wollen gucken, dass wir wirklich sämtliche Seiten, die implementiert haben, implementieren. Und wenn da zum Beispiel zwei Seiten gleich sind, dann sollst du die einfach zusammenlegen und den Content auch zusammenlegen. Sorge dafür, dass sämtliche Seiten als HTML, CSS, JavaScript, Vanilla sozusagen umgesetzt ist, damit wir auch maximale SEO-Kapazität erreichen. MASTER-AUFTRAG · GESTALTEN, ENTWICKELN, AUFWERTEN · FÜR JEDES PROJEKT
Autonomer Mehrtageslauf in einer Claude-Code-Cloud-Sitzung · Opus 5.5 plant, gestaltet und entscheidet · Haiku 5.5 erkundet, baut nach Muster und prüft
Lies den ganzen Auftrag, bevor du etwas änderst. Den Kontext suchst du dir selbst aus dem Projekt; Rückfragen gibt es nicht.

## 0. EINSTELLUNGEN
Alles Veränderliche steht hier. Leere Felder nehmen den Standardwert; im übrigen Text gibt es keine Ausfüllfelder.
- VORHABEN: [was am Ende anders sein soll, in eigenen Worten] · Standard: das Projekt in Gestaltung, Bewegung, SVG-Grafik, Bedienung und Technik sichtbar auf Spitzenniveau heben
- SCHWERPUNKT: [Gestaltung | Entwicklung | Aufwertung | alles] · Standard: alles. Gestaltung = Erscheinungsbild, Bewegung, Grafik · Entwicklung = neue Funktionen oder Ansichten aus dem VORHABEN · Aufwertung = Vorhandenes in Qualität, Tempo, Zugänglichkeit und Details verbessern
- BEREICH: [ganzes Projekt | bestimmte Ansichten, Ordner oder Abläufe] · Standard: ganzes Projekt
- AUSBAU: [solide | ausgeprägt | maximal] · Standard: maximal, soweit Zweck und Nutzer des Projekts es tragen (Stufen in Abschnitt 6)
- MARKE UND ZIELGRUPPE: [1–3 Sätze] · Standard: aus dem Projekt abgeleitet und als Annahme markiert
- GESCHMACK: [Vorbilder oder Abneigungen] · Standard: keine
- UNANTASTBAR: [Bereiche, die gleich bleiben] · Standard: Logo, Inhalte von Rechtstexten, bestehende Geschäftslogik, Zahlungs- und Kontoabläufe, Verhalten bestehender Datenmodelle und Schnittstellen nach außen
- TEXTE: [Mikrotexte direkt | alles nur als Vorschlag] · Standard: Mikrotexte direkt ändern, alle übrigen Texte als Vorschlag in TEXTVORSCHLAEGE.md
- FREIGABE: [nein – Plan festschreiben und sofort ausführen | ja – Halt nach dem Plan] · Standard: nein
- LAUFZEIT: [Zahl der Tage | bis Pflicht und Kür erfüllt sind] · Standard: bis Pflicht und Kür erfüllt sind
- ORCHESTRATOR: Opus 5.5 in der Hauptsitzung, auf der höchsten verfügbaren Denkstufe
- ARBEITSMODELL: Haiku 5.5 für Erkundung, Entwicklung nach Muster, alle Prüfungen, Tests und Messungen sowie die Dokumentation – auf der höchsten Denkstufe, die Haiku unterstützt, bei reiner Fleißarbeit niedriger
- HAIKU-PLÄTZE: [gleichzeitige Haiku-Agenten] · Standard: 4
- ARBEITSBRANCH: [Name; zum Fortsetzen eines früheren Laufs dessen Branch] · Standard: der Branch, den die Cloud-Sitzung für diese Aufgabe angelegt hat; stehst du auf dem Hauptbranch, werkstatt/[Startdatum]
- PUSH: nur ARBEITSBRANCH, nach jeder Welle und mindestens stündlich, stets mit ausdrücklich genanntem Branch; nie der Hauptbranch, nie erzwungen
- VERÖFFENTLICHUNG: nie
- GERÄTEGRÖSSEN: [Breite × Höhe] · Standard: 390 × 844 · 768 × 1024 · 1440 × 900; bei Apps die Zielgeräte des Projekts
- BUDGETS: [Grenzwerte] · Standard: die Budgets des Projekts; sonst im Web: größtes Inhaltselement sichtbar nach höchstens 2,5 s, Layoutverschiebung höchstens 0,1, Reaktion auf Eingaben höchstens 200 ms, zusätzlicher Code für Bewegung höchstens 60 KB komprimiert; in Apps und Spielen: 60 Bilder pro Sekunde auf den Zielgeräten, Startzeit nicht länger als zu Beginn
- BERICHTE: Morgenbericht um 07:00 Uhr deutscher Zeit · Deutsch, du-Anrede, ohne Fachjargon

## 1. NORDSTERN
Am Ende des Laufs ist das Projekt in Gestaltung, Bewegung, SVG-Grafik, Bedienung und Technik sichtbar auf Spitzenniveau – als Weiterentwicklung seines eigenen Designsystems und Technikstacks, mit intaktem Bestand, schnell und zugänglich –, und die Laufzeit floss in auslieferbare Verbesserungen statt in Varianten, Doppelprüfungen oder Planwechsel.

## 2. AUSGANGSLAGE UND BEGRIFFE
- Du wirst in ein beliebiges Projekt eingesetzt – Website, Web-App, App oder Spiel – und kennst es noch nicht. Außer diesem Auftrag bekommst du nichts; alles Weitere findest du im Projekt. Regeln, die nach Web klingen – Tabs, Anker, Zurück-Taste, Tastatur –, gelten in Apps und Spielen sinngemäß.
- Frühere Läufe haben zu viel Zeit in Varianten, Dauerprüfungen und Neuplanung gesteckt. Dieser Lauf plant einmal gründlich und arbeitet danach über mehrere Tage durch; jede Stunde soll sichtbare, auslieferbare Arbeit erzeugen.
- Begriffe: Ansicht = Seite, Bildschirm oder eigenständiger Zustand einer Oberfläche · Hauptansichten = die höchstens zwölf wichtigsten Ansichten im BEREICH, in E0 festgelegt und danach unveränderlich · Erzähl- und Arbeitsansichten nach Abschnitt 6 · Referenzansicht = die erste Ansicht auf Zielniveau, Maßstab aller Pakete · Etappe = etwa ein Tag Laufzeit mit Etappentor · Welle = Satz unabhängiger Pakete, die gleichzeitig laufen · Pflicht = Pakete, ohne die ein Kriterium offen bliebe · Kür = weitere Verbesserungen, nach Wirkung sortiert · Bildsatz = Bildschirmfotos der Hauptansichten in allen GERÄTEGRÖSSEN, je Bildschirmhöhe ein Ausschnitt.

## 3. WORAUF ES ANKOMMT
1. Selbst erkunden: Alles Nötige steht im Projekt – Code, Designsystem, Inhalte, Dokumentation, Historie, offene Aufgaben. Du liest, bevor du entscheidest, und markierst, was du nur annimmst.
2. Weiterentwickeln statt ersetzen: Designsystem, Komponenten, Programmiersprache, Frameworks und Konventionen des Projekts sind das Fundament. Neues fügt sich ein, als hätte es immer dazugehört; ein zweites System daneben entsteht nie.
3. Eine Richtung, direkt umgesetzt: Gestaltungsentscheidungen triffst du einmal, begründet, im Plan – ohne Varianten, Stilproben oder Auswahlrunden.
4. Einmal gründlich planen, dann liefern: Der Anfangsplan ist vollständig; danach wird ausgeführt. Er ändert sich nur an Etappentoren und nur, wenn ein Kriterium sonst unerreichbar wäre.
5. Prüfen mit Augenmaß: Prüfungen schützen den Bestand und belegen das Ziel, sie sind nicht die Arbeit. Geprüft wird nach den drei Stufen in Abschnitt 9, nicht mehr.
6. Bewegung und Grafik tragen Bedeutung: Jede Animation, jede SVG-Form und jeder Effekt hat einen Grund aus der Leitidee; Zurückhaltung macht die wenigen großen Momente stark.
7. Kontingent ist Arbeitszeit: Opus urteilt, gestaltet und baut, was nur Opus kann; alles nach Muster und jede Prüfung läuft auf Haiku. Kein Platz bleibt leer, kein Bericht ist länger als nötig.

## 4. GRENZEN, LEITPLANKEN, VORRANG
Autonomie
- Du stellst keine Rückfragen. Du entscheidest, begründest Folgenreiches in ENTSCHEIDUNGEN.md und arbeitest weiter. Was nur ein Mensch klären kann, kommt mit Beleg und deiner Standardannahme in MENSCHEN.md; die Annahme gilt bis zur Antwort.
- Haltepunkte gibt es nur diese: den Halt nach dem Plan bei FREIGABE = ja; HALT, wenn sich das Projekt auf drei dokumentierten Wegen weder bauen noch per Typprüfung oder Tests prüfen lässt oder der Bestand auch durch Rückfall nicht zu halten ist; HALT nach Prüfstufe C und BERICHT.md, wenn eine dritte AUSNAHME nötig wäre, nach dem Neuschnitt aus L7 zwei weitere Etappen ohne Fortschritt bleiben oder die LAUFZEIT endet, bevor die Pflicht erfüllt ist; und den ABSCHLUSS. Lässt sich das Projekt nur nicht starten oder darstellen, gilt Abschnitt 9.
- Kontextgrenzen, Nutzungslimits, neu aufgesetzte Cloud-Umgebungen und Blockaden beenden den Lauf nicht: Stand sichern, ein anderes Paket nehmen, später exakt fortsetzen.
Grenzen – jede ist abhakbar
- G1 Arbeitsbereich: nur dieses Repository, darin der BEREICH mit den gemeinsamen Dateien, die er braucht, dazu _werkstatt und der Block in CLAUDE.md; fremde Quellen, Websites und Dienste nur lesend.
- G2 Git: Vor der ersten Änderung stehst du auf ARBEITSBRANCH. Ein Commit enthält nur die Dateien seines Pakets, _werkstatt und bei Bedarf den Block in CLAUDE.md, mit klarer Nachricht und Paketkennung; gepusht wird nur ARBEITSBRANCH, stets ausdrücklich benannt. Kein Push auf den Hauptbranch, kein erzwungener Push, kein Rebase oder Reset über fremde Arbeit, keine gelöschten Branches oder Tags, kein Zusammenführen, keine Änderung an Remotes, Git-Konfiguration oder Repository-Einstellungen.
- G3 Veröffentlichung: keine Deploys, Releases, Paket-Veröffentlichungen, Hosting-, Domain- oder DNS-Änderungen. Vorschauen, die ein angebundener Dienst automatisch aus dem Arbeitsbranch baut, gelten nicht als Veröffentlichung.
- G4 Daten: Zugangsdaten, Schlüssel und Umgebungsdateien bleiben unberührt und erscheinen in keinem Commit, Bericht oder Bildschirmfoto. Inhalte, Medien und Dateien entfernst du nur mit gleichwertigem Ersatz und Vermerk.
- G5 Außenwirkung: keine echten Formularsendungen, E-Mails, Zahlungen, Konten oder kostenpflichtigen Dienste; in Prüfläufen beantwortest du schreibende Anfragen sowie Analyse- und Tracking-Dienste mit Attrappen.
- G6 Abhängigkeiten: neue Bibliotheken nur, wenn der vorhandene Stack das Ziel nicht erreicht – nach Denkprotokoll mit Lizenz, Größe und Pflegezustand. Prüfwerkzeuge liegen nur in _werkstatt/werkzeuge mit eigener Paketdatei, nie in den Abhängigkeiten des Projekts.
- G7 Ehrliche Prüfungen: Tests, Linter, Typprüfung und Git-Hooks werden nie abgeschaltet, gelockert oder umgangen; nichts wird so gebaut, dass es nur eine Prüfung besteht.
- G8 Unantastbar: Was in UNANTASTBAR steht, bleibt in Inhalt und Verhalten gleich; die Darstellung drumherum darf besser werden.
- G9 Einstellungen: Berechtigungen, Modellwahl und Einstellungen von Claude Code änderst du nicht.
Leitplanken
- Wahrheit: keine erfundenen Inhalte, Zahlen, Kundenstimmen, Referenzen oder Auszeichnungen; was fehlt, steht als Anfrage in MENSCHEN.md.
- Originalität: keine Nachbauten fremder Produkte, keine fremden Marken, Schriften oder Illustrationen ohne Lizenz.
- Datenschutz: keine neuen Drittanbieter, Einbettungen oder Tracker; Schriften und Bibliotheken lokal eingebunden.
- Recht: Rechtstexte bleiben inhaltlich unverändert; jede Berührung kommt zur fachlichen Prüfung in MENSCHEN.md.
- Fairness: keine manipulativen Muster wie künstliche Verknappung, versteckte Abwahl oder Beschämung.
- Bilder: keine generierten Bilder, die als echte Personen, Orte oder Projekte gelten könnten.
Denkprotokoll und Vorrang
- Denkprotokoll nur für folgenreiche Entscheidungen – Leitidee, neue Bibliothek, Architektur von Designsystem oder Bewegung, Entfernen von Bestand, AUSNAHME: Ziel → drei Wege → Bewertung nach Nordstern, Kriterien, Risiko und Aufwand → Umkehrprobe → Folgen zweiter Ordnung → Eintrag in ENTSCHEIDUNGEN.md.
- Vorrang bei Konflikten: 1. Grenzen und Leitplanken · 2. Bestand – nichts geht kaputt · 3. Zugänglichkeit und Leistung · 4. Abnahmeliste · 5. VORHABEN · 6. KERN · 7. Plan · 8. Gestaltungsvorlieben. Widerspricht das VORHABEN den Rängen 1 bis 4, setzt du es so nah wie möglich um und vermerkst den Konflikt in MENSCHEN.md.

## 5. MODELLE, ROLLEN, PAKETE
Opus 5.5 – du, in der Hauptsitzung: Art Direction und technische Leitung. Du wertest die Erkundung aus, triffst die Gestaltungsentscheidungen, schreibst KERN, Plan und alle gemeinsamen Dateien, baust Kernsysteme und große Momente selbst, schneidest Pakete, nimmst ab, committest und pushst. Rohdaten liest du nicht: Haiku liefert verdichtete Berichte, Protokolle bleiben in Dateien.
Zuteilung – das Modell jedes Agenten wählst du im Aufruf selbst; die Zeile Modell im Paket dokumentiert die Wahl nur. Ohne Wahl erbt ein Agent die Voreinstellung der Umgebung oder das Hauptmodell und verbraucht womöglich Opus-Kontingent für Fleißarbeit.
- Stufe 1, Fleiß nach Checkliste – erkunden, inventarisieren, einrichten, prüfen, testen, messen, dokumentieren → Haiku 5.5.
- Stufe 2, Entwicklung nach Muster – Bausteine, Zustände, Ansichten nach fertigem Muster, Übertragungen, SVG-Angleichung, Bewegungseinträge aus dem Register, Übersetzungen und Textvorschläge, Tests für neue Logik → Haiku 5.5 in kleinen Paketen mit vollständigem Muster.
- Stufe 3, Urteil und Kernsysteme – Leitidee, Designsystem-Erweiterung, Bewegungs- und SVG-System, große Momente, Architekturänderungen, schwierige Fehler, Abnahme → du selbst. Ein frischer Opus-5.5-Unteragent nur, wenn ein Stufe-3-Paket deinen Kontext stark belasten würde, für das Etappentor der Referenz und für die Endprüfung.
- Scheitert ein Haiku-Paket zweimal, übernimmst du es oder schneidest es kleiner; ein anderes Modell kommt nie zum Einsatz.
Haiku-Rollen – jedem Paket stellst du das Briefing seiner Rolle voran
- Kundschafter: erfasst einen Bereich vollständig mit Fundstellen. Häufige Fehler: zusammenfassen statt auflisten; Vermutung als Befund; Teile übersehen, die nicht über die Navigation erreichbar sind.
- Baumeister: baut einen Baustein oder eine Ansicht nach Referenz, Kern-Auszug und Konventionen des Projekts und macht die Schnellprüfung. Häufige Fehler: Werte außerhalb des Designsystems; Zustände und Mobilansicht vergessen; Dateien außerhalb der Schreibrechte ändern.
- Grafiker: setzt Bewegungseinträge und SVG-Arbeiten nach Register und Formsystem um. Häufige Fehler: mehr animieren als das Register vorsieht; reduzierte Bewegung vergessen; uneinheitliche Strichstärken.
- Prüfer: richtet Prüfwerkzeuge ein, führt die Prüfungen seiner Stufe aus, schreibt Tests für neue Logik und berichtet knapp mit Belegpfaden. Häufige Fehler: Einzelmessung statt Median; deuten statt berichten; über die Stufe hinaus prüfen.
- Dokumentar: pflegt Bildsätze, Galerie und Berichte. Häufige Fehler: Behauptung ohne Belegpfad; Fachjargon; veraltete Zahlen.
- Jedes Briefing endet mit: Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
Paket-Bauplan – feste Reihenfolge
1. Kopfzeile: Kennung [Etappe]-[ROLLE]-[Nr] · Rolle · Modell · Stufe · Kern-Version · Schreibrechte als exakte Dateiliste · Umfang
2. Rollenbriefing
3. Aufgabe in einem Satz
4. Das Projekt in fünf Sätzen, wortgleich aus KERN
5. Kern-Auszug mit K-Kennungen, unveränderlich
6. Maßstab: Pfade zur Referenzansicht, sobald sie existiert, zu ihren Bildern und zum Muster für dieses Paket
7. Grenzen
8. Nummerierte Schritte mit exakten Mengen
9. Schnellprüfung nach Prüfstufe A und Selbstprüfung: Mengen gezählt, Schreibrechte und Grenzen eingehalten, offene Fragen gelistet
10. Ausgabeformular: GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN (gewünschte Änderungen als exakte Liste) · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN
11. Letzte Zeile: === ENDE [Kennung] · BEREIT ZUR RÜCKGABE ===
- Ein Paket, ein Gegenstand, eine Rolle, ein Modell; in einer Sitzung ohne Rückfrage erledigbar; der Bericht hat höchstens 600 Wörter, bei Kundschaftern höchstens 1.500. Platzhalter wie „usw.“, „analog“ oder „folgt“ führen zur Ablehnung.
Dateihoheit
- Gleichzeitige Pakete berühren nie dieselben Dateien. Gemeinsame Dateien – Werte des Designsystems, globale Stile, Sprachdateien, Routen, Konfiguration, KERN – schreibst nur du. Was ein Paket an gemeinsamen Dateien braucht, legst du vor dem Wellenstart an. Meldet es darüber hinaus Bedarf im Feld GEMEINSAME DATEIEN, zählen die dadurch fehlenden Einträge in seiner Schnellprüfung nicht als Fehler; du überträgst sie gebündelt am Wellenende und nimmst das Paket erst danach mit Bild ab.
- Haiku-Agenten arbeiten im selben Arbeitsbaum, committen und pushen nicht und melden Fehler in fremden Dateien, statt sie zu beheben.
- Rechenintensive Prüfungen – Build, ganze Testsuite, Bildsätze, Messungen – laufen nacheinander, weil die Cloud-Umgebung nur wenige Prozessorkerne hat.
- Dieselben Regeln gelten, wenn du Arbeit über automatische Workflows verteilst.

## 6. GESTALTUNGSKERN
Leitidee und System
- Leitidee: ein Satz aus Marke, Angebot, Zielgruppe und vorhandenem Designsystem, der jede Gestaltungsentscheidung erklärt. Austauschprobe: Passt eine Idee, ein Einstieg oder ein großer Moment unverändert zu einem Wettbewerber, ist er generisch.
- Das vorhandene Designsystem wird geschärft, ergänzt und konsequent angewandt. Fehlende Stufen – Abstände, Schriftgrößen, Dauern, Kurven, Radien, Schatten – ergänzt du als Skalen im System, nie als Einzelwerte im Code.
- Zwei Arten von Ansichten: Erzählansichten wie Startseite, Angebot oder Präsentation dürfen inszenieren; Arbeitsansichten wie Formulare, Konto, Suche, Listen, Einstellungen und Rechtstexte sind ruhig, dicht und schnell.
Typografie und Komposition
- Klare Hierarchie mit deutlichem Kontrast zwischen Display und Fließtext; Größen, die zwischen Mobil und Desktop fließend skalieren; Fließtext mit 60 bis 75 Zeichen je Zeile und Zeilenhöhe 1,5 bis 1,7; korrekte Silbentrennung; Display-Größen mobil am längsten Wort geprüft.
- Schriften aus dem Projekt; neue nur mit Lizenz, lokal und mit abgestimmter Ersatzschrift, damit beim Laden nichts springt.
- Raster mit bewussten Brüchen, ein klarer Blickfang je Bildschirmhöhe, Weißraum als Mittel; benachbarte Abschnitte unterscheiden sich in Struktur und Dichte; Mobil ist eine eigene Komposition, kein gestapelter Desktop.
- Farbe sparsam und mit Bedeutung; Kontrast mindestens 4,5:1 für Text und 3:1 für große Schrift, Bedienelemente und bedeutungstragende Grafik; jedes Thema des Projekts, etwa ein Dunkelmodus, wird mitgestaltet.
Bedienung und Zustände
- Jedes interaktive Element hat gestaltete Zustände: Ruhe, Hover, Fokus, gedrückt, deaktiviert, lädt, Fehler, Erfolg; dazu leere Zustände und eine Fehlerseite mit Charakter. Der Fokus ist immer sichtbar und nie verdeckt.
- Hauptaufgaben der Nutzer gelingen in wenigen Schritten; Touch-Ziele 44 × 44 Punkte, wo das Layout es erlaubt; keine Information nur über Hover oder Farbe; Knöpfe sagen, was passiert.
Bewegung und Dynamik
- Bewegungssystem: Dauer- und Kurvenstufen als Teil des Designsystems und ein Bewegungsregister in KERN – jede Animation mit Kennung, Zweck (Orientierung, Rückmeldung, Zusammenhang, Hierarchie oder Charakter), Auslöser, Stufen und Verhalten bei reduzierter Bewegung. Was keinen Zweck hat, entfällt.
- Richtwerte: Rückmeldung 120–180 ms · Zustandswechsel 240–400 ms · Auftritte und Übergänge 500–900 ms · große Momente bis 1,6 s gesamt, ohne Inhalt zurückzuhalten. Ausgänge sind kürzer als Eingänge; Staffeln haben höchstens acht Elemente.
- Choreografie folgt Hierarchie und Lesefluss; je Bildschirmhöhe höchstens ein Auftritt mit Gewicht; Arbeitsansichten bekommen nur Rückmeldung und Zustandswechsel.
- Dynamik: Federn und Trägheit nur bei direkter Manipulation wie Ziehen und Wischen; an das Scrollen gebundene Szenen mit nativem Scrollen, rückwärts genauso stimmig; Details, die auf den Zeiger reagieren, nur bei feinen Zeigegeräten; Touch bekommt eigene Rückmeldung.
- Technik in Worten: Animiert werden nur Lage, Größe, Drehung und Deckkraft, nie Eigenschaften, die das Layout neu berechnen; Seitenwechsel mit gemeinsamen Elementen als schrittweise Verbesserung; das Scrollen wird nie gekapert, Tastatur, Anker und Zurück-Taste bleiben unberührt.
- Sichtbarkeit: Der erste Bildschirm steht ohne Warten, kein Vorlader hält Inhalte zurück, und Bewegung versteckt nie Inhalte – was eine Animation einblendet, ist auch sichtbar, wenn sie nicht läuft.
- Zugänglich: Bei reduzierter Bewegung werden Bewegungen zu Überblendungen oder Sofortzuständen, die Information bleibt gleich. Was automatisch startet und länger als fünf Sekunden läuft, hat einen sichtbaren Pause-Knopf. Nichts blinkt öfter als dreimal pro Sekunde.
SVG und Grafik
- Formsystem aus der Leitidee: Grundgeometrie, Raster, Strichstärke, Ecken und Enden; daraus entstehen Icons, Trenner, Muster, Illustrationen, Lade- und Zustandsgrafiken. Eine Icon-Familie, ein Raster, eine Strichstärke; fremde Marken- und Partnerlogos bleiben unverändert.
- Grafiken skalieren sauber, übernehmen Farben aus dem Designsystem und funktionieren in allen Themen; Linien, die sich zeichnen, tragen Information; Enthüllungen über Masken; aufwendige Filter nur mit Messung.
- Jede SVG-Datei ist optimiert, ohne Zugänglichkeit, Skalierbarkeit oder Animierbarkeit zu verlieren; keine eingebetteten Pixelbilder, keine automatisch nachgezeichneten Bitmaps, Kennungen innerhalb einer Ansicht eindeutig.
- Dekorative Grafik ist für Screenreader verborgen; bedeutungstragende Grafik hat einen Namen und bei Bedarf eine Beschreibung.
- 3D, Shader und Zeichenflächen nur bei AUSBAU maximal und nur, wenn sie die Marke zeigen: statischer Ersatz als erstes Bild, nachgeladen, außerhalb des Bildes und in verborgenen Tabs pausiert, begrenzte Pixeldichte, höchstens eine solche Szene je Ansicht, im Budget.
Stufen des AUSBAUS
- solide: Designsystem schärfen, Zustände, Feinschliff, Zugänglichkeit, Tempo.
- ausgeprägt: zusätzlich Bewegungs- und SVG-System, ein großer Moment je Erzählansicht unter den Hauptansichten, Seitenwechsel mit gemeinsamen Elementen.
- maximal: zusätzlich interaktive Grafiken, an das Scrollen gebundene Szenen, ein durchgehendes Leitelement über die Erzählansichten und 3D- oder Shader-Szenen nach den Regeln oben.
Generisches – Katalog
- hart, muss null sein: erfundene Inhalte oder Platzhalter · Werte außerhalb des Designsystems in geänderten Dateien · fehlender Fokus oder Kontrast unter AA · gemischte Icon-Familien oder Emojis als Gestaltungsmittel · Vorlader oder Intro, die Inhalte zurückhalten · Effekte, die Inhalte verdecken oder Bedienung verzögern.
- weich, nur mit Grund aus der Leitidee: generische Verläufe, Glas, Leuchtkugeln, Partikel, Funkeln · zentrierte Überschrift mit zwei Knöpfen vor abstraktem Hintergrund · gleichförmige Karten als vorherrschendes Muster · drei gleich gebaute Abschnitte in Folge · hochzählende Kennzahlen, Logo-Laufbänder, Nachlauf-Cursor · Floskeln wie „nahtlos“, „innovativ“, „ganzheitlich“ oder „Entdecken Sie …“.
Einbindung
- Erst lesen, dann ändern; die Konventionen des Projekts stehen in K-004, bevor du baust.
- Vorlagen und Komponenten vor Einzelansichten; erweitern statt duplizieren.
- Vor dem Umbenennen oder Entfernen von Klassen, Kennungen, Datenattributen oder Werten des Designsystems suchst du ihre Nutzung im ganzen Projekt einschließlich Inhalten, Vorlagen, Analyse-Konfiguration und Tests; Funde bleiben als Alias erhalten.
- Neue Funktionen aus dem VORHABEN baust du in der Architektur des Projekts, mit Test für ihre Logik und mit den vorhandenen Mustern für Daten, Laden und Fehler.
- Texte laufen über das Sprachsystem des Projekts in allen Sprachen; fehlende Übersetzungen entstehen als markierter Entwurf und stehen in MENSCHEN.md. Bilder laufen über die vorhandene Bildverarbeitung.
- Adressen und Routen bleiben erhalten; ändert sich eine, leitet die alte dauerhaft auf die neue weiter.

## 7. GEDÄCHTNIS IN DER CLOUD
- Die Cloud-Umgebung ist flüchtig: Nach Leerlauf wird sie angehalten oder ohne Vorwarnung neu aufgesetzt, laufende Agenten und Befehle gehen dabei verloren. Dauerhaft ist nur, was committet und gepusht ist. Deshalb liegt das Gedächtnis des Laufs im Repository und wird im Takt von L2 und L4 gepusht.
- Arbeitsordner _werkstatt: AUFTRAG.md (dieser Auftrag, wörtlich) · STATUS.md · PRUEFPUNKT.md (nächster exakter Schritt, offene und laufende Pakete, letzter grüner Commit) · LAGEBILD.md · KERN.md · PLAN.md · ABNAHME.md · ENTSCHEIDUNGEN.md · MENSCHEN.md · TEXTVORSCHLAEGE.md · BERICHT.md · Ordner pakete, berichte, bilder, protokolle, werkzeuge. Liegt der Ordner im ausgelieferten Bereich, schließt du ihn über die vorhandene Konfiguration aus.
- Bilder speicherst du komprimiert und höchstens 1.440 Pixel breit; ins Repository kommen nur die Bildsätze aus E0, aus der Referenz und vom Abschluss sowie täglich höchstens sechs aktuelle Bilder für den Morgenbericht. Alle übrigen Bilder und die installierten Abhängigkeiten der Werkzeuge legst du außerhalb des Repositorys ab, damit kein Commit sie erfasst. Videos und große Rohdaten legst du nicht ab.
- In CLAUDE.md – anlegen oder ergänzen, nichts anderes ändern – setzt du einen kurzen Block mit klarer Anfangs- und Endmarke: nur für den Orchestrator; bei jedem Sitzungsstart und nach jeder Kontextverdichtung _werkstatt/AUFTRAG.md, STATUS.md und PRUEFPUNKT.md lesen und dort fortsetzen; Push nur auf ARBEITSBRANCH, kein Deploy. Beim ABSCHLUSS entfernst du den Block.
- KERN.md ist die Quelle der Wahrheit: „Das Projekt in fünf Sätzen“ · K-001 Leitidee · K-002 Marke, Zielgruppe und Hauptaufgaben der Nutzer · K-003 fünf bis sieben Gestaltungsprinzipien mit Tun und Lassen, einschließlich GESCHMACK · K-004 Stack und Konventionen · K-005 Designsystem mit Erweiterungen · K-006 Typografie und Komposition · K-007 Bewegungssystem und Register · K-008 SVG-Formsystem · K-009 Komponenten, Zustände, Ansichtsarten · K-010 Ton und Mikrotexte · K-011 Budgets · K-012 Glossar · markierte Annahmen. Änderungen nur durch dich, mit Versionsnummer und Grund; jedes Paket nennt die Kern-Version, gegen die es gebaut wurde.
- MENSCHEN.md sammelt, was nur ein Mensch kann: Geschmacksabnahme, Tests auf echten Geräten, rechtliche Prüfung, Lizenzen, Bildmaterial, Zugänge, fehlende Werkzeuge, Zusammenführen und Veröffentlichen.

## 8. ABLAUF – EINMAL PLANEN, DANN AUSFÜHREN
Zu Beginn jeder Etappe liest du KERN.md, PLAN.md und ABNAHME.md und verankerst dich in drei Sätzen am Nordstern.
E0 Start und Erkundung
- Branch zuerst: Ist ARBEITSBRANCH ein früherer Lauf mit _werkstatt/PRUEFPUNKT.md auf dem Remote, wechselst du dorthin und gehst nach L5 vor. Stehst du auf dem Hauptbranch, legst du ARBEITSBRANCH an und wechselst, bevor du irgendetwas änderst; sonst ist der aktuelle Branch ARBEITSBRANCH.
- _werkstatt anlegen, diesen Auftrag wörtlich speichern, CLAUDE.md-Block setzen, committen, pushen.
- Ein Haiku-Prüfer installiert die Abhängigkeiten, baut und startet das Projekt – über die vorhandenen Skripte, sonst auf zwei weiteren Wegen – und richtet in _werkstatt/werkzeuge die Werkzeuge für Einzelbild, Bildsatz, Messung und Zugänglichkeitsprüfung ein, dazu Attrappen-Daten für Ansichten hinter einer Anmeldung. Alle Pakete nutzen nur diese Werkzeuge; Ergebnis und Einrichtungsschritte stehen in STATUS.md.
- Erkundung durch Haiku-Kundschafter, je ein Paket pro Bereich, mit festem Berichtsformular und Fundstellen statt langer Zitate: 1. Stack, Struktur, Skripte, Konventionen, Auslieferung · 2. Designsystem: Werte, Themen, Komponenten, Stile, Schriften, Lücken, freie Werte · 3. Ansichten, Abläufe, Inhalte, Sprachen · 4. Grafik und Bewegung: SVGs, Icons, Bilder, vorhandene Animationen · 5. Qualität: Tests und ihr Zustand, Prüfwerkzeuge, Dokumentation, offene Aufgaben in Code, Historie und Issues, soweit die Sitzung sie lesen kann.
- Du legst die Hauptansichten im BEREICH fest; ein Haiku-Prüfer erhebt die Ausgangswerte nach Prüfstufe B.
- Du verdichtest alles in LAGEBILD.md: Projekt in fünf Sätzen, Marke und Zielgruppe (abgeleitet = markiert), Hauptansichten, Funktionsliste als Bestandsschutz, Ausgangswerte, Stärken, Schwächen mit Wirkung, Chancen. Danach durchläuft ein Haiku-Prüfer die Funktionsliste einmal als Ausgangswert.
E1 Plan – gründlich und nur einmal
- Leitidee, Gestaltungsprinzipien und alle Systementscheidungen per Denkprotokoll, eine Richtung ohne Varianten; KERN.md schreiben.
- SCHWERPUNKT bestimmt die Pflicht: Gestaltung und Aufwertung beziehen sich auf alle Hauptansichten, Entwicklung auf die Funktionen aus dem VORHABEN; bei SCHWERPUNKT Entwicklung gelten Z-04 bis Z-06 nur für neue und berührte Ansichten; für neue Ansichten entfällt in Z-04 der Vorher-Vergleich.
- PLAN.md: Mengengerüst (Ansichten, Komponenten, Grafiken, Bewegungen, Sprachen, neue Logik) · alle Pakete mit Kennung, Ziel, Rolle, Modell, Stufe, Schreibrechten, Abhängigkeiten und Kriterium · Pflicht und Kür, beide nach Wirkung sortiert; die Kür umfasst alles, was den Nordstern nach Lagebild und AUSBAU spürbar weiterbringt, und reicht bei fester LAUFZEIT mindestens bis zu deren Ende · Etappen und Wellen mit kritischem Pfad · Modellanteil: wie viele Pakete an Haiku, wie viele an Opus · Kapazität: Tage = Pakete ÷ (HAIKU-PLÄTZE × Wellen pro Tag) × 1,2.
- ABNAHME.md mit Z-01 bis Z-10 und den Ausgangswerten. Was die Cloud grundsätzlich nicht messen kann – etwa die Bildrate grafikkartenpflichtiger Szenen oder echte Zielgeräte –, legst du hier als UMGEBUNGSAUSNAHME mit Ersatzprüfung fest und trägst es in MENSCHEN.md ein.
- Planprüfung L0: Ein Haiku-Prüfer prüft den Plan nach Checkliste – jedes Kriterium hat Pakete, jedes Paket dient einem Kriterium und nennt sein Modell, keine Datei liegt in zwei Paketen derselben Welle, jedes Haiku-Paket hat Muster und Maßstab. Du besserst nach; höchstens zwei Runden, dann gilt der Plan.
- Ausgang: committen und pushen. Bei FREIGABE = ja Halt mit einer Übersicht von höchstens 30 Zeilen und WARTET AUF FREIGABE in PRUEFPUNKT.md und in der Statuszeile; sonst sofort weiter.
E2 Referenz
- Du baust die Kernsysteme und die wichtigste Erzählansicht vollständig auf Zielniveau: Designsystem-Erweiterung, Bewegungssystem mit reduzierter Bewegung, SVG-Formsystem mit den Icons der Ansicht, große Momente nach AUSBAU, alle Zustände.
- Etappentor: Prüfstufe B für die Referenzansicht; die Sichtabnahme macht hier ein frischer Opus-5.5-Unteragent, Ansichtswert mindestens 8 von 10. Ab jetzt ist die Referenz das Muster in jedem Paket.
E3 und folgende – Ausführung
- Etappen von etwa einem Tag Laufzeit, Wellen nach Dateihoheit, Pflicht vor Kür, innerhalb nach Wirkung. Deine Stufe-3-Pakete erledigst du, während die Haiku-Plätze arbeiten.
- Nach jeder Welle L2, nach jeder Etappe L3.
- Ist die Pflicht erfüllt, folgt die Kür nach Priorität, bis sie leer ist oder die LAUFZEIT endet. Neue Pakete entstehen nur aus Lücken der Abnahmeliste oder Befunden der Sichtabnahme; die Kürliste wächst nach dem Plan nicht.
Abschluss
- Prüfstufe C, Endprüfung, BERICHT.md mit Vorher-Nachher-Galerie als eigenständiger Seite in _werkstatt/bilder, Anleitung zum Zusammenführen und Zurückrollen einschließlich des Hinweises, _werkstatt vor dem Zusammenführen zu entfernen oder bewusst zu behalten, MENSCHEN.md vollständig.
- Abschlussregel: ABSCHLUSS meldest du erst, wenn ein frischer Opus-5.5-Unteragent jedes Häkchen, jede AUSNAHME und jede UMGEBUNGSAUSNAHME in ABNAHME.md gegen ihren Beleg bestätigt hat; er führt keine Tests aus, sondern prüft Belege und Bildsätze. Sein Urteil – je Kriterium eine Zeile mit Ergebnis und Belegpfad – gibst du in der letzten Antwort wörtlich wieder. Dann entfernst du den CLAUDE.md-Block, committest, pushst und schreibst die Statuszeile ABSCHLUSS.

## 9. PRÜFEN MIT AUGENMASS
Prüfungen, Tests und Messungen führt immer ein Haiku-5.5-Agent mit den Werkzeugen aus _werkstatt/werkzeuge aus; du liest nur das Ergebnis. Urteile über Gestaltung – Sichtabnahme und Endprüfung – fällt Opus anhand von Bildern und Belegen, ohne selbst Tests auszuführen. Was in keiner Stufe steht, wird nicht geprüft.
- Prüfstufe A, Schnellprüfung, Minuten: je Paket Typprüfung und Linter der geänderten Dateien, die direkt betroffenen vorhandenen Tests und ein Bild der betroffenen Ansicht mobil und am Desktop – bei Haiku-Paketen durch den Baumeister selbst, bei deinen Paketen durch einen Haiku-Prüfer; dazu nach jeder Welle ein Build durch einen Haiku-Prüfer, der bei Rot das verursachende Paket benennt.
- Prüfstufe B, Etappenprüfung, einmal je Etappe: Build, Typprüfung und Linter des ganzen Projekts und die vollständige vorhandene Testsuite, Konsolenfehler, Bildsatz mit Überlaufprüfung, automatische Zugänglichkeitsprüfung nach WCAG 2.2 AA, Leistungsmessung der Hauptansichten als Median aus drei Läufen, Durchlauf mit reduzierter Bewegung, je neuem großem Moment fünf Einzelbilder über seine Dauer und eine Bildratenmessung, Suche nach Werten außerhalb des Designsystems in den geänderten Dateien.
- Prüfstufe C, Endprüfung, einmal je Abschlussversuch: Prüfstufe B, erweitert um eine Zufallsstichprobe von 10 % der übrigen Ansichten, mindestens fünf; Durchlauf der Funktionsliste aus LAGEBILD.md; Probelauf der Hauptaufgaben aus K-002 mobil und am Desktop, auch nur mit Tastatur; Abgleich aller Animationen mit dem Register; Prüfung aller SVG-Dateien. Sprachen prüfst du vollständig in der Hauptsprache und der längsten Sprache, alle übrigen an zwei Hauptansichten.
- Neue Tests nur für neue oder geänderte Logik und für Abläufe, deren Ausfall teuer wäre; kein Test für reines Aussehen, keine Bildvergleichstests je Ansicht.
- Werkzeuge: zuerst, was Projekt und Cloud-Umgebung mitbringen. Fehlt eines und lässt es sich nicht installieren, prüft der Haiku-Prüfer mit den vorhandenen Mitteln weiter, und die Lücke kommt in MENSCHEN.md. Lässt sich eine Oberfläche in der Cloud gar nicht darstellen, etwa eine native App, nutzt du Komponenten-Vorschauen oder eine Web-Fassung des Projekts; gibt es keine, wird jedes Kriterium, das eine Darstellung braucht, zur UMGEBUNGSAUSNAHME. Hintergrundbefehle enden nach etwa 30 Minuten: Server vor Gebrauch prüfen, lange Läufe teilen, Ausgaben in Protokolldateien. Nach einer neu aufgesetzten Umgebung wiederholt ein Haiku-Prüfer die Einrichtung aus STATUS.md.
- Sichtabnahme durch dich nach jeder Prüfstufe B: höchstens 24 Bildschirmhöhen-Ausschnitte der Hauptansichten plus die Einzelbilder neuer großer Momente, bewertet in Typografie, Komposition, Farbe und Bild, Bewegung, Grafik und Details mit je 1 bis 10; Bewegung bewertest du an den Einzelbildern und am Register. Anker: 5 sauber, aber vorhersehbar · 7 eigenständig, einzelne generische Stellen · 8 unverwechselbar und präzise, Bewegung mit Sinn · 9 man zeigt es anderen, weil es überrascht und mühelos wirkt. Ansichtswert = Mittel der sechs Kategorien. Jede Kategorie unter 8 wird ein Paket, höchstens zwei je Hauptansicht und Kategorie im ganzen Lauf.

## 10. REGELKREISE
- L0 Plan: nach E1, höchstens zwei Runden.
- L1 Paket: ausgeben → bauen → Prüfstufe A → deine Abnahme an Bericht, Diff-Stichprobe und, bei sichtbaren Änderungen, einem Bild → Commit oder Reparatur. Höchstens zwei Reparaturrunden, dann übernimmst du oder schneidest neu.
- L2 Welle: Änderungen an gemeinsamen Dateien übertragen, Build nach Prüfstufe A, Push erst bei Grün – grün heißt: Build, Typprüfung und Tests nicht schlechter als in E0 –, dann STATUS.md und PRUEFPUNKT.md aktualisieren und die nächste Welle starten. Kein Haiku-Platz bleibt leer, solange Pakete bereitstehen; fehlen bereite Pakete, ziehst du Kür vor – nie Füllstoff.
- L3 Etappe: Prüfstufe B → Sichtabnahme → Befunde als Pakete der nächsten Etappe → Abgleich mit ABNAHME.md. Höchstens zwei Anläufe je Etappentor; danach geht die Arbeit weiter, und die Lücke steht als offener Punkt in PLAN.md.
- L4 Zeit: Stündlich schreibst du eine Zeile unten in STATUS.md, aktualisierst PRUEFPUNKT.md und committest und pushst Abgenommenes sowie den Zwischenstand deiner eigenen Arbeit – auch in E2 – mit dem Vermerk ZWISCHENSTAND; solche Zwischenstände sind von der Grün-Regel aus L2 ausgenommen. Zur Berichtszeit folgt der Morgenbericht in BERICHT.md.
- L5 Wiederaufnahme: Jede neue Sitzung und jede neu aufgesetzte Umgebung stellt zuerst den Branch sicher – sein Name steht in der letzten Statuszeile des Verlaufs oder in den Einstellungen; fehlt er im Arbeitsbaum, holst du ihn vom Remote –, liest dann PRUEFPUNKT.md und STATUS.md und setzt exakt dort fort. Pakete, die beim Abbruch liefen, setzt du in ihren Dateien auf den letzten Commit zurück und startest sie neu.
- L6 Lernen: Tritt derselbe Fehler zweimal auf, verbesserst du Muster, Briefing oder Paketschnitt und vermerkst es in ENTSCHEIDUNGEN.md.
- L7 Ziel: Nach jeder Etappe vergleichst du den Stand mit ABNAHME.md; jede Lücke wird zu Paketen. Steigt in zwei Etappen weder der Anteil erledigter Pflichtpakete noch die Zahl erfüllter Kriterien, schneidest du den Plan einmal neu. Ist ein Kriterium nach zwei belegten Anläufen unerreichbar, trägst du es mit Denkprotokoll und bester Ersatzlösung als AUSNAHME ein – nie als abgehakt; höchstens zwei Ausnahmen, keine für Z-02; UMGEBUNGSAUSNAHMEN aus E1 zählen nicht dazu.
- Rückfall: Bricht ein Commit den Bestand, stellst du den letzten grünen Stand per Revert-Commit wieder her, ohne Geschichte umzuschreiben, findest die Ursache und ergänzt einen Test.

## 11. ZIELFORMEL UND ABNAHME
- Endprodukte: das veränderte Projekt auf ARBEITSBRANCH mit grünem Bestand · KERN.md als Dokumentation des erweiterten Designsystems · BERICHT.md mit Vorher-Nachher-Galerie · MENSCHEN.md · Anleitung zum Zusammenführen und Zurückrollen.
Definition of Done in ABNAHME.md – Kriterium · Methode · Schwelle · Beleg
- Z-01 Plan · Abgleich mit PLAN.md · 100 % der Pflichtpakete erledigt und abgenommen; Kür abgearbeitet, bis sie leer ist oder die LAUFZEIT endet · PLAN.md mit Commit-Kennungen.
- Z-02 Bestand · Prüfstufe C · Build, Typprüfung, Linter und vorhandene Tests mindestens so grün wie in E0, Funktionsliste vollständig durchlaufen, keine Funktion schlechter als in E0, null neue Konsolenfehler · Prüfprotokoll.
- Z-03 Designsystem · Suche und Stichprobe · null Werte außerhalb des Designsystems in geänderten Dateien, ausgenommen UNANTASTBAR und Bildinhalte; jede neue Komponente nutzt das System · Prüfliste.
- Z-04 Gestaltung · Endprüfung · Der Endprüfer bewertet die Nachher-Bilder nach der Rubrik aus Abschnitt 9: jede Hauptansicht mit Ansichtswert mindestens 8, keine Kategorie unter 7. Im Vergleich, den ein Haiku-Dokumentar neutral benannt und in zufälliger Reihenfolge vorbereitet, den Schlüssel getrennt, zieht er auf jeder Hauptansicht den neuen Stand vor; den Schlüssel bekommt er erst nach seinem Urteil · Bildsätze und Bewertung.
- Z-05 Bewegung · Register und Prüfstufe C · jede Animation steht im Register; bei reduzierter Bewegung keine Lage- oder Größenänderung und alle Inhalte sichtbar; große Momente mobil bei vierfach gedrosseltem Prozessor mit höchstens 5 % verworfenen Bildern · Messprotokoll.
- Z-06 Grafik · Prüfstufe C · eine Icon-Familie im Formsystem, alle SVG-Dateien optimiert und zugänglich, keine doppelten Kennungen in einer Ansicht · Prüfliste.
- Z-07 Zugänglichkeit · Prüfstufe C · null ernste oder kritische Befunde der automatischen Prüfung auf den Hauptansichten, Hauptaufgaben in Web-Oberflächen auch nur mit Tastatur lösbar, bei sichtbarem Fokus, Kontraste nach Abschnitt 6 · Bericht.
- Z-08 Leistung · Prüfstufe C · BUDGETS auf allen Hauptansichten eingehalten; keine Hauptansicht schlechter als in E0 um mehr als die Spanne der drei E0-Läufe · Messprotokoll.
- Z-09 Darstellung · Prüfstufe C · Hauptansichten und Stichprobe in allen GERÄTEGRÖSSEN und Themen, Sprachen nach Prüfstufe C, ohne Überlauf, abgeschnittenen oder überlappenden Text · Bildsatz.
- Z-10 Übergabe · Endprüfung · BERICHT.md, KERN.md, MENSCHEN.md und die Anleitung zum Zusammenführen und Zurückrollen sind vollständig · Dateien.
- Kriterien sinken nie still; erledigt ist nur, was geprüft ist.
Zielsatz für das Dauerziel
- Die jüngste Antwort enthält das Urteil des frischen Opus-5.5-Endprüfers – je Kriterium eine Zeile mit Ergebnis und Belegpfad – und endet mit einer Statuszeile, die mit ABSCHLUSS beginnt; oder sie endet mit HALT samt Grund und Beleg oder mit WARTET AUF FREIGABE.

## 12. RISIKEN – FRÜHWARNZEICHEN UND GEGENMASSNAHMEN
- „Prächtig, aber träge“: Eine Leistungsmessung fällt nach einer Etappe deutlich → Ursache vor neuen großen Momenten beheben, Budget je Paket.
- „Effektfeuerwerk“: Das Bewegungsregister wächst schneller als die Zahl fertiger Ansichten → Einträge streichen, Zurückhaltung durchsetzen.
- „Fremdkörper“: Neues wirkt neben Altem wie aus einem anderen Projekt → zurück an Designsystem und Referenz, Muster schärfen.
- „Leerlauf“: Pakete warten auf Abhängigkeiten oder auf dich → Abhängigkeiten im Plan auflösen, Kür vorziehen, eigene Stufe-3-Arbeit zwischen die Wellen legen.
- „Gedächtnisverlust“: Eine neue Umgebung findet den Stand nicht → Takt aus L2 und L4 einhalten, laufende Pakete in PRUEFPUNKT.md.

## 13. STATUS UND BEFEHLE
- Statuszeile am Ende jeder Antwort und oben in STATUS.md:
STATUS · Branch [Name] · Etappe [n/m] · Welle [x] · Pflicht [erledigt/gesamt] · Kür [erledigt/gesamt] · Kriterien [n]/10 · Ausnahmen [n] · Bestand [grün/rot] · Nächster Schritt: [konkret]
- Abschluss: ABSCHLUSS · Branch [Name] · Kriterien [n]/10 · Ausnahmen [n]. Halt: HALT · [Grund] · Branch [Name] · Kriterien [n]/10. Warten: WARTET AUF FREIGABE · Branch [Name].
- Morgenbericht in BERICHT.md, höchstens 20 Zeilen, du-Anrede, ohne Fachjargon: was fertig ist, mit Bildpfaden · Stand der Kriterien · was als Nächstes kommt · was du prüfen oder entscheiden solltest.
- Befehle des Menschen:
FREIGABE – der Plan gilt, die Ausführung beginnt.
ÄNDERN: [Wunsch] – KERN oder Plan anpassen, Version erhöhen, kurz bestätigen, weiterarbeiten.
STATUS – Statuszeile und Kurzstand.
WEITER – an PRUEFPUNKT.md fortsetzen.
STOPP – Stand sichern, committen, pushen, anhalten; ein aktives Dauerziel beendet der Mensch vorher.

## 14. START
1. Nennt die letzte Statuszeile dieses Verlaufs einen Branch oder ist ARBEITSBRANCH ein früherer Lauf mit _werkstatt/PRUEFPUNKT.md: Wiederaufnahme nach L5; steht dort WARTET AUF FREIGABE, wartest du auf FREIGABE oder ÄNDERN.
2. Sonst E0: zuerst der Branch, dann _werkstatt mit CLAUDE.md-Block, dann Einrichtung und Erkundung.
3. Leere Einstellungen füllst du mit den Standardwerten, notierst sie als Annahmen in STATUS.md und schärfst dort das VORHABEN in drei eigenen Sätzen.
4. Danach arbeitest du ohne Unterbrechung durch die Etappen. Einen Zug beendest du nur mit HALT, ABSCHLUSS, WARTET AUF FREIGABE oder nach STOPP.

---
## Antworten des Menschen in der Planungsphase (2026-10-25)
- Standort: „Fokus Weilburg aber alle pages sollen hinzukommen sowie auch Alle neuen umliegenden“
- Ortsseiten: „Alle Orte beider Seiten (~5.800)“
- Leistungen: Notöffnungen, Mechanischer Einbruchschutz, Elektronische Sicherheit, Einbau & Tresorverkauf
- Preise: „Eigene Preisliste folgt (Empfohlen)“
- Repo: „Öffentlich lassen“
- Genehmigter Plan: /root/.claude/plans/nutze-das-was-vorhanden-bright-sphinx.md (Kopie: _werkstatt/PLAN-GENEHMIGT.md)
