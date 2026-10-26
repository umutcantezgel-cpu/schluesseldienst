# Ergebnis n4-bestand

## Schritt 1: npm test
- Befehl: npm test (node --test "test/*.test.mjs"), Protokoll: /home/user/schluesseldienst/.cache/e5-final/n4-bestand/npm-test.log
- tests 331, suites 16, pass 330, fail 0, cancelled 0, skipped 0, todo 1, Exit 0

## Schritt 2: Release-Negativtest A (ohne eingetragene Basis-URL)
- Befehl: node bau/bauen.mjs --release --aus=<n4-bestand>/release-a, Protokoll: /home/user/schluesseldienst/.cache/e5-final/n4-bestand/release-a.log
- Ergebnis: EXIT=2. Meldung: „Error: Release: betrieb.basisUrl ist ein Platzhalter.“ (bau/bauen.mjs:106). Ausgabeordner release-a entstand nicht.

## Schritt 3: Release-Negativtest B (Kopie, Basis-URL eingetragen)
- Abweichung vom Auftrag, begründet: Die Textersetzung „https://Ihre-Domain.de“ -> „https://example.org“ allein reicht nicht. In src/konfig/betrieb.mjs ist der Wert p('betrieb.basis-url', '…') ein Platzhalter-Objekt (bau/lib/platzhalter.mjs); der Literalstring ist nur die Beschriftung. Deshalb griff die Basis-URL-Sperre (bauen.mjs:106), nicht die allgemeine Sperre. Die Kopie erhielt zusätzlich eine echte Zuweisung (basisUrl: 'https://example.org') und den Pflichtparameter --ziel=apache (bauen.mjs:108). Außerdem fehlte pipeline/fingerabdruck.mjs in der Kopie; ergänzt (nur diese Datei).
- Erster Versuch wörtlich nach Auftrag: /home/user/schluesseldienst/.cache/e5-final/n4-bestand/release-b-erster-versuch.log (EXIT=2, Basis-URL-Sperre).
- Zweiter Versuch (fehlendes Modul): /home/user/schluesseldienst/.cache/e5-final/n4-bestand/release-b-zweiter-versuch-fehler-pipeline.log (EXIT=2, ERR_MODULE_NOT_FOUND bei bau/pruefen/plagiat.mjs).
- Dritter Versuch (gewertet): /home/user/schluesseldienst/.cache/e5-final/n4-bestand/release-b.log
  - Build: 5556 Seiten, 5625 geändert, 19461 ms. Platzhalter: 65 in der Ausgabe, 57 in der Konfiguration, ungeprüfte Fakten: 92.
  - Meldung: „Release verweigert: 57 Platzhalter in der Konfiguration“ und „Release verweigert: 92 ungeprüfte Fakten: …“
  - Prüfstufen: budgets, ehrlichkeit, emoji, icons, links, plagiat, token ohne Fehler; fakten 20 Fehler; jsonld 16 Fehler; sicherheit 5556 Fehler (S10-platzhalter); seo 0 Fehler, 72 Warnungen.
  - „Build mit 5594 Fehler(n) beendet.“ EXIT=1. Ausgabe nach release-b.verweigert verschoben (dort gelöscht).
- Belege: release-b.bau-bericht.json und release-b.pruefbefunde.json im selben Ordner.
- Aufgeräumt: release-b.verweigert und release-probe gelöscht.

## Schritt 4: smoke.mjs, 13 Hauptansichten, mobil (390x844) und desktop (1440x900)
- Port 4251 (unkomprimiert): /home/user/schluesseldienst/.cache/e5-final/n4-bestand/smoke-4251.json, Protokoll smoke-4251.log, Exit 1 (nur durch die gewollte 404).
  - 26 Seiten, befundeGesamt 6 (alle bei /gibt-es-nicht/, je Viewport 3), fremde Anfragen 0, Unterressourcen (>=400) 2 (404 der Testseite), Konsolenfehler 2 (404 „Failed to load resource“), Konsolenwarnungen 0, CSP-Verstöße 0, h1 genau eins auf 26/26, Titel gesetzt 26/26.
- Port 4254 (gzip): /home/user/schluesseldienst/.cache/e5-final/n4-bestand/smoke-4254.json, Protokoll smoke-4254.log, Exit 1 (nur durch die gewollte 404).
  - Gleiche Zahlen wie 4251: 26 Seiten, befundeGesamt 6 (nur /gibt-es-nicht/), fremde Anfragen 0, Konsolenfehler 2 (404), CSP 0, h1 26/26, Titel 26/26.
- Alle übrigen 24 Seitenläufe: 0 Befunde.
- Hinweis: smoke.mjs wertet 404 der Testseite als Befund; das ist hier die gewollte 404, nicht ein Fehler der Website.

## Schritt 5: Seitenwechsel (vt-probe.mjs, Basis http://127.0.0.1:4251, Schwelle 0 Fehler)
Gesamt 156 Wechsel (30 + 48 + 30 + 48). Wechsel mit Erfolg: 156/156. Zählende Fehler: 0.
- skript/desktop: /home/user/schluesseldienst/.cache/e5-final/n4-bestand/vt-skript-desktop.json, Exit 0. wechsel 30, erfolgreich 30, zaehlend 0, viewTransitionMeldungen 0, pagerevealMitVt 30 (Modul schon gelaufen 23), pageswapMitVt 30, unhandledrejection 0, pageerror 0. Erwartete 404 von /gibt-es-nicht/ (je Lauf 1): 30, nicht erwartete Konsolenfehler 0.
- links/desktop: /home/user/schluesseldienst/.cache/e5-final/n4-bestand/vt-links-desktop.json, Exit 0. wechsel 48, erfolgreich 48, zaehlend 0, viewTransitionMeldungen 0, pagerevealMitVt 48 (Modul schon gelaufen 19), pageswapMitVt 48, unhandledrejection 0, pageerror 0. Konsolenfehler gesamt 0.
- skript/mobil: /home/user/schluesseldienst/.cache/e5-final/n4-bestand/vt-skript-mobil.json, Exit 0. wechsel 30, erfolgreich 30, zaehlend 0, viewTransitionMeldungen 0, pagerevealMitVt 30 (Modul schon gelaufen 16), pageswapMitVt 30, unhandledrejection 0, pageerror 0. Erwartete 404: 30, nicht erwartete 0.
- links/mobil: /home/user/schluesseldienst/.cache/e5-final/n4-bestand/vt-links-mobil.json, Exit 0. wechsel 48, erfolgreich 48, zaehlend 0, viewTransitionMeldungen 0, pagerevealMitVt 48 (Modul schon gelaufen 10), pageswapMitVt 48, unhandledrejection 0, pageerror 0. Konsolenfehler gesamt 0.
- Hinweis zur Diagnose: „Modul schon gelaufen“ ist das Feld diagnose.pagerevealMitVtModulSchonGelaufen (Klasse .js am Dokument zum Zeitpunkt pagereveal). Es liegt nicht bei allen Wechseln bei 100 Prozent (10 bis 23 von 30 bzw. 48). Das ist eine Beobachtung, keine Wertung; es ist kein zählender Fehler.
- Auswertung: vt-auszug.mjs in diesem Ordner (liest nur die JSON-Dateien).

## Schritt 6: Funktionsliste F01–F20 (Kopie von .cache/e5-abschluss/z-pruefer/funktionen.mjs, nur ORDNER umgestellt; BASIS http://127.0.0.1:4251)
- Ergebnisse: /home/user/schluesseldienst/.cache/e5-final/n4-bestand/funktionen.json, Protokoll funktionen.log, Skript: /home/user/schluesseldienst/.cache/e5-final/n4-bestand/funktionen.mjs
- Ergebnis je Funktion: erfüllt 18 (F02–F04, F06–F20 außer F05), teilweise 2 (F01, F05). Nicht erfüllt 0.
- Fremde Anfragen: 0 bei allen 20. Konsolenfehler: 0 bei allen 20. Gewollte 404-Konsolenmeldungen: F01 2, F02 1, F15 2, F16 2, F18 1, F19 1.
- Exit 1: wegen F01 und F05 (teilweise, nicht „erfüllt“). Erwartet laut Auftrag (U-6, Platzhalter im Vorschau-Build).
- Abgleich mit Referenz /home/user/schluesseldienst/.cache/e5-abschluss/z-pruefer/funktionen.json (Lauf vom 06:42): Gleich bei Ergebnis, fremden Anfragen und gewollten 404 bei allen 20 Funktionen. Abweichungen:
  - F02 Konsolenfehler: Referenz 1 („/gibt-es-nicht/: Seitenfehler: Transition was aborted because of invalid state. ViewTransition opt-in disabled“), dieser Lauf 0. Das ist der Konsolenfehler, den Schritt 5 ebenfalls nicht mehr zeigt (0 ViewTransition-Meldungen). Die Referenz ist älter als der aktuelle Build; die Ursache ist nicht isoliert belegt.
  - F20 unterscheidet sich nur im Pfad der erzeugten PDF-Dateien (neuer Prüfordner); Seitenzahl und Sichtbarkeitswerte gleich.
- PDF-Dateien in meinem Ordner: druck_preise.pdf (6 Seiten), druck_ratgeber_rauchmelderpflicht.pdf.

## Gesamt und Hinweise
- Keine Datei im Repo wurde von meinen Schritten geändert. Alle Ausgaben, Kopien und Protokolle liegen in /home/user/schluesseldienst/.cache/e5-final/n4-bestand. Im Repo sind nach 09:40 nur Dateien unter _werkstatt/ und docs/ geändert worden (nicht durch mich); src/ und bau/ stammen aus 10-25 bzw. 08:54.
- Die Diagnosezahl „Modul schon gelaufen“ (Schritt 5) beruht auf der Klasse .js, die src/assets/js/app.mjs:18 setzt (verzögertes Modul). kopf.js setzt sie nicht. Der Wert ist eine Beobachtung, kein Fehlerzähler.
- Mess-Sperre: Während und nach meinen Läufen existierte .cache/mess.lock nicht mehr (Stand 09:59). Die Vorschau-Server (PID 13356 Port 4251, PID 13358 Port 4254) laufen weiter; ich habe sie nicht beendet und nicht neu gebaut.
- Es wurden keine Hintergrundprozesse gestartet.
