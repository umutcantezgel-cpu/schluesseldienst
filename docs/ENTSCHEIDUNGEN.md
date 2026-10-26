# Entscheidungen

Diese Liste fasst die wichtigsten Entscheidungen zur Website zusammen, jeweils mit Problem, Entscheidung und Grund. Alle Einträge stammen vom 25. Oktober 2026. Die ausführliche Fassung mit Messwerten und Abwägungen steht in `_werkstatt/ENTSCHEIDUNGEN.md`, bis `_werkstatt/` entfernt wird.

## D-001 · Keine Übernahme fremder Inhalte; Themen und Ortsnamen ja

**Problem:** Die Website soll die Themen und Suchbegriffe zweier Wettbewerber abdecken, ohne deren Texte oder Bilder zu übernehmen. **Entscheidung:** Übernommen werden Themen, Suchbegriffe und Ortsnamen als Fakten; alle Texte sind neu geschrieben. **Grund:** Kopien und bloße Umformulierungen bergen Urheber- und Wettbewerbsrisiken, und Suchmaschinen bevorzugen bei doppeltem Inhalt das Original. Das Restrisiko beim Datenbankschutz für die Ortslisten ist offen ([OFFENE-PUNKTE.md](OFFENE-PUNKTE.md), Nr. 13).

## D-002 · Eigener Generator ohne Abhängigkeiten statt handgeschriebener Seiten

**Problem:** Tausende Seiten lassen sich von Hand nicht pflegen, und fertige Generatoren bringen viele Fremdpakete und oft Inline-Skripte mit. **Entscheidung:** Ein eigener Generator in Node 22 nutzt nur eingebaute Module und erzeugt reines HTML, CSS und JavaScript. **Grund:** Die Ausgabe bleibt vollständig kontrollierbar und mit der strengen Sicherheitsrichtlinie vereinbar, und es gibt keine Abhängigkeiten, die gepflegt werden müssen. Der Preis ist eine längere Bauzeit.

## D-003 · `dist/` wird nicht im Repository gespeichert

**Problem:** Der Ausgabeordner wäre zur Zeit der Entscheidung mit rund 6.400 Dateien und etwa 108 MB zu groß für das Repository, und jede Vorlagenänderung schreibt alle Dateien neu. **Entscheidung:** `dist/` steht in `.gitignore` und wird bei Bedarf neu gebaut. **Grund:** Das Repository würde sonst im Gigabyte-Bereich wachsen; der Build braucht nur Node 22 und etwa 11 Sekunden (laut README).

## D-004 · Alle Orte und der Umkreis Weilburg als Ortsseiten

**Problem:** Vorgesehen waren rund 5.800 Orte; der aktuelle Datenstand umfasst 5.252 Orte. Google kann viele gleichförmige Ortsseiten als „Doorway Pages“ oder „Scaled Content Abuse“ werten und die ganze Domain abwerten. **Entscheidung:** Der Auftraggeber hat entschieden, alle Orte zu veröffentlichen und dieses Risiko zu tragen. **Grund:** Gegenmaßnahmen sind kein Austausch von Textbausteinen, Fakten nur aus den Daten (PLZ, Kreis, Entfernung, Nachbarorte), ab Zone C Sitz und Entfernung im Titel, eine Notbremse je Zone (`indexierung`) und eine Ähnlichkeitsprüfung.

## D-005 · Keine 3D-Szene und keine Shader

**Problem:** Eine WebGL-Szene war als Gestaltungsmittel für den höchsten Ausbaugrad im Gespräch. **Entscheidung:** Die Marke tragen die SVG-Scherlinie, interaktive Grafiken und scrollgebundene Bewegung; auf 3D und Shader wird verzichtet. **Grund:** Eine 3D-Szene zeigt die ruhige, präzise Marke nicht besser, belastet Ladezeit und Bedienbarkeit auf schwachen Mobilgeräten in einer Notlage und erhöht die Komplexität.

## D-006 · Das Repository bleibt öffentlich

**Problem:** Das Repository enthält Auswertungen von Wettbewerberdaten, und es war zu entscheiden, ob es öffentlich bleibt. **Entscheidung:** Es bleibt öffentlich; abgeleitete Rohwerte liegen im nicht versionierten Ordner `.cache/`, und nur Kennzahlen und Hashes werden committet. **Grund:** Die Entscheidung kam vom Auftraggeber; eine Begründung ist nicht festgehalten. Der Schutz gilt für neue Daten, denn die Exporte liegen bereits im Verlauf (siehe [ZUSAMMENFUEHREN.md](ZUSAMMENFUEHREN.md)).

## D-007 · Kein Inline-Skript und kein Inline-Style; Trusted Types gesperrt

**Problem:** Eine strikte Richtlinie verbietet Inline-Skripte und Inline-Styles; Startanimation und Grafikpositionen hätten sonst Ausnahmen gebraucht. **Entscheidung:** Die Startanimation läuft per CSS (`@keyframes`), Grafikpositionen sind SVG-Attribute, und Trusted Types steht auf `'none'`, also ohne eigene Policies. **Grund:** Ohne Ausnahmen bleibt die Richtlinie streng, und es werden keine Hash-Snippets gebraucht.

## D-008 · Orts-Abgleich mit Regeln, Schwelle und Quote

**Problem:** Die Ortsnamen der Wettbewerber sollten echten GeoNames-Orten zugeordnet werden, ohne zu raten; ein reiner Namensabgleich ordnete nur 39 % zu. **Entscheidung:** Ein Punktesystem mit Hinweisen zu Gemeinde, Kreis und Region sowie eine feste Schwelle; nicht eindeutige Fälle bleiben unklar. **Grund:** So ordnen sich 94,6 % zu. Das Ziel von höchstens 2 % unklar wurde mit 5,4 % verfehlt; die 314 unklaren Orte werden nicht veröffentlicht und halten die Pipeline nicht an ([ORTE-ABGLEICH.md](ORTE-ABGLEICH.md)).

## D-CSS-01 · Stile je Ansicht statt eines Gesamtbündels

**Problem:** Das gemeinsame CSS für alle Seiten lag mit 13,5 von 14 KB (gzip) fast an der Grenze, und für die übrigen Ansichten war kein Platz. **Entscheidung:** Ein gemeinsames Bündel plus Stile je Ansicht; jede Seite lädt nur ihre Stile und hat ein eigenes Größenbudget. **Grund:** Die Grenze anzuheben hätte die Prüfung gelockert, und Kürzen reichte für die übrigen Ansichten nicht. Eine Prüfung findet jetzt Klassen, deren Stil auf einer Seite nicht geladen wird.

## D-SEO-02 · Ortsseiten ohne FAQPage-Daten

**Problem:** Die FAQ stand auf den 5.252 Ortsseiten sichtbar und zusätzlich als strukturierte Daten, und die Ortsseiten lagen am Größenbudget. **Entscheidung:** Ortsseiten behalten die sichtbaren Fragen, aber keinen FAQPage-Block; Inhaltsseiten behalten ihn. **Grund:** Google zeigt FAQ-Ergebnisse nur noch für wenige Arten von Websites, der Block bringt hier also wenig und kostet rund 1 KB je Seite (etwa 5 MB insgesamt).

## D-SEO-03 · Suchseite und 404-Seite bleiben nicht indexierbar

**Problem:** Die SEO-Prüfung zeigte für `/suche/` den Wert 66 statt 100, weil die Seite `noindex` trägt. **Entscheidung:** Beide Seiten bleiben nicht indexierbar und fehlen in der Sitemap; die 404-Seite ist ohnehin nicht indexierbar. **Grund:** Die Suchseite hat keinen eigenen Inhalt, weil Treffer erst im Browser entstehen, und Google rät, interne Suchergebnisse nicht zu indexieren; deshalb gilt „SEO 100“ nur für indexierbare Seiten.

## D-PRUEF-01 · Bildsätze über der Zielgröße angenommen

**Problem:** Ein Bildsatz wog 14,8 MB statt unter 12 MB, ein späterer 20,3 MB statt unter 15 MB. **Entscheidung:** Die Überschreitung wird angenommen. **Grund:** Die Bilder liegen bereits im Verlauf, und ein Neukomprimieren würde den Verlauf nur vergrößern.

## D-SEO-04 · Zu lange Titel bei Ortsseiten sind nur eine Warnung

**Problem:** Eine Release-Probe mit vollständig ausgefüllten Angaben scheiterte an 72 Titeln von Ortsseiten mit 61 bis 74 Zeichen, weil die strenge Regel für alle Seiten galt, und das ging über die festgelegte Vorgabe hinaus. **Entscheidung:** Bei Ortsseiten ist ein zu langer Titel nur eine Warnung (Regel `seo/titel-laenge-ort`); bei allen anderen Seiten bleibt er im Release ein Fehler. **Grund:** Die festgelegte Vorgabe sieht das so vor: Der Kreisname wird nie gekürzt, nur das Typwort „Landkreis“ oder „Kreis“ darf entfallen, und jeder Fall wird weiter gemeldet.

## D-CSS-02 · Druckstile in einer eigenen Datei

**Problem:** Mit den Druckstilen und den Kontrastregeln überschritt das gemeinsame CSS der Startseite die Grenze von 14.336 Byte (gzip) um 418 Byte (14.754 Byte). **Entscheidung:** Die Druckstile liegen in einer eigenen Datei mit `media="print"` und haben ein eigenes Budget von höchstens 3 KB (gzip). **Grund:** Diese Datei blockiert die Anzeige am Bildschirm nicht; die Grenze selbst anzuheben oder den Druck zu kürzen kam nicht in Frage.

## D-K05-01 · Vorkomprimierte Dateien für Apache und nginx

**Problem:** Vorab erzeugte Varianten (Brotli und gzip) brauchen passende Server-Regeln; ohne sie entstehen falsche Dateitypen, doppelte Kompression oder ein falsches Sprachkennzeichen. **Entscheidung:** Ein optionaler Schalter `--vorkomprimieren` erzeugt Varianten nur für Apache und nginx, und eine Prüfung verlangt zu jeder Variante die Quelldatei mit gleichem Inhalt. **Grund:** Zwei Prüfdurchgänge fanden Fehler, einer davon mit echtem Apache und nginx im Container; die Fehler sind behoben. Netlify und Cloudflare komprimieren selbst. Das Laufzeitziel von 60 Sekunden gilt für den Standardbau, der optionale Schritt ist ausgenommen.

## D-K07-01 · Gruppenfilter filtert beim Laden nicht

**Problem:** Ein Filter, der beim Laden per Skript eingefügt wurde, verschob das Layout über die Grenze von 0,1 (CLS bis 0,19 mobil, 0,46 am Desktop); Tiefenlinks blieben oben stehen. **Entscheidung:** Beim Laden wird nicht gefiltert; ein Anker springt wie ohne Skript zur Gruppe, und „Alle“ steht schon im HTML. **Grund:** Gemessen verschiebt sich das Layout beim Laden nicht mehr (CLS 0,0000 mobil, 0,0007 am Desktop). Diese Abweichung vom Entwurf, der den Zustand als Anker vorsah, ist damit begründet.

## D-BEW-01 · Bewegungsregister mit der Umsetzung abgeglichen

**Problem:** Das Bewegungsregister (eine Liste aller Animationen mit Dauer und Auslöser) stimmte nicht mit der Umsetzung überein: Drei Bewegungen fehlten, eine hatte kein Gegenstück, einige Werte wichen ab, und manche Animationen standen gar nicht im Register. **Entscheidung:** Die drei fehlenden Bewegungen wurden umgesetzt, das Register wurde an die geprüfte Gestaltung angepasst, und jede Animation hat jetzt eine Registerzeile. **Grund:** Das Register soll beschreiben, was tatsächlich läuft; Abweichungen vom Plan, etwa eine Erfolgsmeldung, die der Plan ausschließt, sind dort begründet.

## D-CSS-03 · Stile für erzwungene Farben in einer eigenen Datei

**Problem:** Eine Messung zeigte für die Startseite eine Performance von 96 statt 98 und einen größten Inhalt (LCP) von 2.413 statt 2.104 ms gegenüber der früheren Messung; Lighthouse nannte das gemeinsame CSS als größten Posten, und 7 KB Stile wirken nur in Windows-Kontrastdesigns. **Entscheidung:** Diese Stile liegen in einer eigenen Datei, die nur bei erzwungenen Farben geladen wird (`media="(forced-colors: active)"`), mit eigenem Budget von höchstens 3 KB (gzip). **Grund:** Für alle anderen Nutzer blockiert die Datei das Rendern nicht; in Kontrastdesigns gilt sie wie zuvor.

## D-JS-01 · JavaScript je Seite statt eines Gesamtbündels

**Problem:** Das gemeinsame JavaScript wuchs von 16,6 KB auf 42,4 KB (roh), weil jede Seite alle Module erhielt; Lighthouse rechnete es in den Pfad bis zur größten Darstellung (LCP) ein. **Entscheidung:** Nach dem Rendern lädt jede Seite nur die Module, die sie braucht; gleiche Modulsätze teilen sich ein Bündel, und jedes Bündel hat ein Budget von höchstens 16 KB (gzip). **Grund:** Weniger Skript auf dem Weg zur ersten Darstellung; eine Ortsseite lädt nur ihr kleines Bündel.

## D-E5-01 · Gemeinsame Befunde der Endprüfung

**Problem:** Die Sichtprüfung ergab in allen Ansichten 6,5 bis 7,7 statt mindestens 8 Punkte; die Nachprüfung fand einen Blocker: Auf dem Handy lag der Fokus unter der Rufleiste (WCAG 2.4.11). **Entscheidung:** Der Fokus wird nie verdeckt (Abstand für Rufleiste und Kopfzeile beim Bildlauf), jede Seite trägt genau eine Kopflinie als Leitelement, Überschriften werden nie automatisch getrennt, und Karten erhalten einheitliche Bewegungen. **Grund:** Ein sichtbarer, nie verdeckter Fokus ist eine Anforderung der Barrierefreiheit; die Kopflinie verbindet die Seiten optisch.

## D-E5-03 · Kleines Kopf-Skript für ruckfreie Seitenwechsel

**Problem:** Beim Wechsel zwischen Seiten meldete Chromium in etwa jedem sechsten bis achten Fall einen Fehler in der Konsole, weil der Browser die Überblendung (Seitenwechsel-Übergang) verwarf: Er legt beim Beginn des Seiteninhalts fest, ob eine Seite den Übergang wünscht, und die Stildateien waren in diesen Fällen noch nicht geladen. **Entscheidung:** Ein winziges Skript (rund 0,3 KB, eigene Datei mit Prüfsumme) steht im Kopf nach den Stildateien; der Browser liest die Seite erst weiter, wenn die Stile da sind. Es fängt zugleich ab, wenn der Browser einen Übergang überspringt. **Grund:** Messungen mit 0 Fehlern statt etwa 15 %; die Stildateien blockieren die Darstellung ohnehin, das Skript fügt nur eine kleine Datei hinzu. Ohne Inline-Skript, die Sicherheitsregeln (CSP) bleiben unverändert. Einzelheiten und Versuche: `_werkstatt/ENTSCHEIDUNGEN.md` (D-E5-03), `_werkstatt/berichte/E5-abschluss-pruefung.md`.

## Überholte Vorschläge

Frühere Einzelvorschläge zu Adressen, Zonenradien, Datenaufteilung, Prüfregeln, Formularen und Animationen sind durch die festgelegte Fassung ersetzt, deren Abweichungen ausführlich in `_werkstatt/ENTSCHEIDUNGEN.md` stehen.
