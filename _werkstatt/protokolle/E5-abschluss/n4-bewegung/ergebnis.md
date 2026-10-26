# N4-Bewegung Ergebnis (Haiku-Prüfer, letzte Nachprüfung, Stand b5a1ebd, Build .cache/e5-final/dist, Basis 127.0.0.1:4251)

## Teilschritt 1: Interaktionen (reduce und no-preference), Läufe: bewegung.mjs interaktionen, 2 min 25 s, Exit 0
Quelle: /home/user/schluesseldienst/.cache/e5-final/n4-bewegung/interaktionen.json (Log: .../interaktionen.log, Auswertung: .../auswertung-schritt1.py)
Messzeiten je Schritt: 40/120/200/400 ms bei Öffnen und Schließen von Hauptnav und Menü-Blatt, sonst 40/400 ms. Die Zeiten sind Seitenuhr-Ist-Werte ab Klickende.

Menü-Blatt M-06 (mobil 390x844, Blatthöhe in Ruhe 717,39 px = 100 %):
- no-preference öffnen: Y 225,25 px (44 ms), 31,11 px (125 ms), 2,38 px (204 ms), 0 (405 ms). Übergang 300 ms (transform), Deckkraft des Hintergrunds 0,41 / 0,84 / 0,97 / 1. Erfüllt (300 ms).
- no-preference schließen: Y 17,46 px (44 ms), 140,22 px (126 ms), 388,39 px (204 ms); display noch block bei 204 ms, none bei 405 ms. Übergang 240 ms (display/overlay/transform). Blatt bleibt während des Ausgangs sichtbar. Erfüllt (240 ms). Der Frühbefund (kein Schließübergang) ist im neuen Build behoben.
- reduce öffnen: nur Deckkraft 0 / 0,73 (43 ms) / 0,98 (123 ms) / 1 (205 ms), transform bei allen Messungen none. Übergang 150 ms. Erfüllt.
- reduce schließen: nur Deckkraft 1 / 0,35 (42 ms) / 0,00 (122 ms), display none bei 203 ms; keine transform-Animation. Übergang 120 ms. Erfüllt.

Hauptnavigation (desktop 1440x900), Navigationspfeil M-05 und Panel:
- no-preference aufklappen: Pfeil 73,1° (49 ms), 142,5° (125 ms), 171,6° (204 ms), 180° (406 ms); Übergang 300 ms. Panel Y -8 px auf 0 (Übergang 300 ms). Erfüllt.
- no-preference zuklappen: Pfeil 124,2° (43 ms), 23,6° (125 ms), 3,9° (207 ms), 0° (405 ms); Übergang 240 ms (vorher 300 ms im Frühbefund; jetzt 240 ms). Panel Y 0 auf -8 px, Deckkraft 0,99 / 0,86 / 0,57 / 0 (405 ms), Übergang 240 ms. Erfüllt.
- reduce aufklappen: Pfeil sofort 180° (43 ms, kein Übergang); Panel nur Deckkraft 0,55 (43 ms) / 0,98 (123 ms) / 1 (203 ms), 150 ms, kein transform. Erfüllt.
- reduce zuklappen: Pfeil sofort 0° (43 ms, kein Übergang); Panel nur Deckkraft 0,35 / 0,00 (123 ms), 120 ms, kein transform. Erfüllt.

Übrige Interaktionen (Kurzfassung, Zahlen aus interaktionen.json):
- a FAQ (/ und /preise/, mobil): reduce ohne transform (Chevron sofort 180°, Antwort ohne Animation). no-preference: Chevron 300 ms, Antwort m-feedback-ein 300 ms. Erfüllt.
- c, d, e, f: reduce ohne transform; Deckkraft-Übergänge 150 ms (Ergebnis d, Betreff e, Gruppe f); Betreff im Composer reduce sofort (op 1 bei 43 ms). no-preference: Gruppenfilter m05-einblenden 300 ms, Y -3,7 px bei 42 ms (Ziel -8 px); Composer-Hinweis m-feedback-ein 300 ms; Betreff betreff-neu-a 150 ms (Deckkraft 0,6 auf 1); Ergebnis Ortsprüfung 150 ms. Erfüllt.
- d Vorschlagsliste (Messlücke, wie im Frühbefund): Die Liste ist beim ersten Messpunkt schon am Ende ihrer Animation (m-feedback-ein, Dauer 150 ms laut Animationsobjekt, zeit 150). Der Startzeitpunkt liegt vor der Messung, daher nicht direkt gemessen.
- Drücken (g, mobil): Wahl-Option (/preise/) skaliert no-preference sofort auf 0,98 (kein transform-Übergang). Zeilen Listenlink (.rand-liste a, /notoeffnung/tueroeffnung/), Registerlink (.gruppe-register a, /einbruchschutz/) und Formelzeile (.formel-titel, /preise/): no-preference transform-Übergang 150 ms, Endwert 0,98 bei den Listenzeilen (403 bis 437 ms); bei der Formelzeile liegt der Übergang am ::after (nicht am Element, Messung am Element zeigt none). reduce: nur Deckkraft 150 ms, kein transform.
  Einordnung: Der Frühbefund „Listen- und Registerlink ohne Übergang verlangt“ widerspricht KERN M-03. Dort steht, dass Zeilen in Listen (Randspalte V03, Register V02, Formelzeilen V04) über einen Übergang in feedback laufen. Der Build entspricht M-03; der Frühbefund ist nicht als Abweichung zu werten.
- Kontrolle no-preference (Interaktionen): alle Interaktionen zeigen Bewegung, die Messung ist empfindlich.

Schritt-1-Ergebnis: Menü-Blatt M-06, Hauptnav-Pfeil M-05 und Übergänge (no-preference 300/240 ms, reduce sofort bzw. Deckkraft 150/120 ms) stimmen mit K-007 überein. Eine Messlücke bleibt bei der Vorschlagsliste (d).

## Teilschritt 2: Menü-Blatt per Tastatur (mobil 390x844, no-preference, Start /), Skript: tastatur.mjs, Ausgabe: /home/user/schluesseldienst/.cache/e5-final/n4-bewegung/tastatur.json (Log: .../tastatur.log)
- Tab bis zum Menü-Knopf (a.rufleiste-menue, aria-controls=menue-blatt): 4 Tabulatoren (Sprunglink, Wortmarke, Suche, Menü). Knopf im Sichtbereich (oben 777, unten 836).
- Enter öffnet: 40 ms nach Enter dialog.open = true, display block, aria-expanded true; Fokus wandert in den Blatt-Schließknopf (button.menue-blatt-zu). Nach 500 ms unverändert. Hash bleibt leer (kein Sprung auf #seitennavigation).
- Escape schließt: 40 ms nach Escape dialog.open = false, aria-expanded false, display noch block (Ausgang läuft), Fokus bereits auf a.rufleiste-menue. 600 ms nach Escape display none.
- Fokus nach Escape: a.rufleiste-menue, aria-controls=menue-blatt, im Sichtbereich. Ergebnis: erfüllt.
- Zweiter Lauf (Enter, Escape): identisch; Fokus wieder am Menü-Knopf. Erfüllt.
- Externe Anfragen blockiert: 0. Ergebnis Schritt 2: erfüllt (Tab 4 bis Knopf, Enter öffnet, Escape schließt, Fokus zurück auf Menü-Knopf).

## Teilschritt 3: Laden und Scrollen unter reduce (13 Hauptansichten × 390x844 und 1440x900 = 26 Läufe)
Skript: bewegung.mjs laden-mobil (2 min 59 s... 3 min 0 s) und laden-desktop (2 min 48 s), Exit 0 je Aufruf.
Quellen: /home/user/schluesseldienst/.cache/e5-final/n4-bewegung/laden-mobil.json und laden-desktop.json (Logs: laden-mobil.log, laden-desktop.log)
- reduce_aktiv (matchMedia reduce) in allen 26 Läufen: true.
- Animationen mit transform nach dem Laden: 0 (Summe über 26 Läufe). Nach dem Scrollen: 0. Animationen insgesamt nach dem Scrollen: 0.
- Sichtbare Textelemente mit Deckkraft unter 1 oder unsichtbar: 0 nach Laden, 0 nach Scrollen (4 386 Textelemente geprüft, 66 bis 470 je Lauf).
- Status: 200 in 24 Läufen, 404 in 2 Läufen (/gibt-es-nicht/, mobil und desktop; gewollte 404). Externe Anfragen blockiert: 0.
- Ergebnis Schritt 3: erfüllt.
Kontrolle (no-preference, mobil, Skript: bewegung.mjs kontrolle, Datei: /home/user/schluesseldienst/.cache/e5-final/n4-bewegung/kontrolle.json): / hat 28 transformierende Animationen nach dem Laden (28 nach Scrollen); /ueber-uns/ hat 2 nach dem Laden und 2 nach dem Scrollen, insgesamt 5 Animationen nach dem Scrollen. Die Messung erkennt also Bewegung.

## Teilschritt 4: axe.mjs, hell und dunkel, 13 Hauptansichten (WCAG 2.0/2.1/2.2 A und AA, 1440x900)
Quellen: /home/user/schluesseldienst/.cache/e5-final/n4-bewegung/axe-hell.json und axe-dunkel.json (Logs: axe-hell.log, axe-dunkel.log)
- Hell (colorScheme light): 13 von 13 Seiten, 0 Befunde in allen Kategorien (minor 0, moderate 0, serious 0, critical 0). Befunde serious/critical gesamt: 0. Status 200 bei 12 Seiten, 404 bei /gibt-es-nicht/ (erwartet).
- Dunkel (colorScheme dark): 13 von 13 Seiten, 0 Befunde in allen Kategorien. Befunde serious/critical gesamt: 0.
- Kontrolle (Werkzeug wirkt): eigene Testseite mit img ohne alt, Kontrast 1,6:1 und Knopf ohne Namen auf 127.0.0.1:4299 (Skript: /home/user/schluesseldienst/.cache/e5-final/n4-bewegung/kontrolle-axe/kontrolle-start.mjs, Ergebnis: .../kontrolle-axe/axe-kontrolle.json): 3 Befunde (image-alt critical, button-name critical, color-contrast serious), Exit 1. Die 0 oben ist also belastbar.
- Ergebnis Schritt 4: erfüllt (0 serious/critical in hell und dunkel).

## Teilschritt 5: Fokus nie ganz verdeckt, mobil vorwärts auf / und /kontakt/ (verdeckt.mjs, Basis 127.0.0.1:4251)
Quelle: /home/user/schluesseldienst/.cache/e5-final/n4-bewegung/verdeckt-mobil-vorwaerts.json (Log: verdeckt-mobil-vorwaerts.log)
- /: 66 Tab-Schritte, 65 Fokusziele außerhalb der Rufleiste (+1 in der Rufleiste). Ganz verdeckt (Rufleiste): 0. Ganz verdeckt (Punktprobe 7×7): 0. Teilweise verdeckt: 0. Außerhalb des Sichtbereichs: 0.
- /kontakt/: 53 Tab-Schritte, 52 Fokusziele (+1 in der Rufleiste). Ganz verdeckt: 0, teilweise: 0, außerhalb: 0.
- Gesamt ganz verdeckt: 0. Ergebnis Schritt 5: erfüllt.
- Einordnung: Klebende Elemente sind nur die feste Rufleiste unten (768 bis 844 px, 76 px hoch) und die im Menü-Blatt. scroll-padding-bottom ist 88 px, daher verdeckt die Rufleiste keine Fokusziele. Das Werkzeug zählt das als Messung, nicht als Kontrolle eines Fehlerfalls.

## Teilschritt 6: ueberlauf.mjs über alle 13 Hauptansichten, alle 11 Varianten (320, 390, 768, 1440, 1920 px; mit erzwungenen Farben; 200 % Zoom = 640 px)
Quelle: /home/user/schluesseldienst/.cache/e5-final/n4-bewegung/ueberlauf.json (Log: ueberlauf.log)
- 143 Messungen (13 Seiten × 11 Varianten), Befunde mit Dokumentüberlauf (scrollWidth > clientWidth): 0. Größte Differenz scrollWidth minus clientWidth: 0 px.
- Status 404 nur bei /gibt-es-nicht/ (erwartet, 11 Messungen).
- Elemente, die über den Viewport ragen, ohne Dokumentüberlauf: 18 Messungen, nur /preise/ bei 200 % Zoom (640 px): table#preisliste bis 649 px (Breite 625 px) mit Caption, thead und Zeilen. Dokumentüberlauf 0. Ob die Tabelle in einem Scrollbehälter liegt, wird in der Nachprüfung unten geprüft.
- Ergebnis Schritt 6: erfüllt (0 Dokumentüberlauf).

## Teilschritt 7: bildrate.mjs, mobil 390x844, 4× Drosselung, je 1 Lauf (Dauer 2000 ms, Schwelle 5 % verworfen)
Quellen: /home/user/schluesseldienst/.cache/e5-final/n4-bewegung/bildrate-M16-start.json, bildrate-M17-scroll.json, bildrate-M18-scroll.json, bildrate-M20-laden.json, bildrate-M21-laden.json (Logs: bildrate-M16.log bis bildrate-M21.log)
- M-16 / (Auslöser Laden): 124 Bilder, verworfen 3,2 %, Median-Intervall 16,66 ms. ok.
- M-17 /einbruchschutz/ (Auslöser Scrollen): 144 Bilder, verworfen 0,7 %, Median 16,66 ms. ok.
- M-18 /einsatzgebiet/ (Auslöser Scrollen; M-18 ist scrollgebunden, der Auslöser Laden hätte die Karte nicht erreicht): 138 Bilder, verworfen 1,4 %, Median 16,66 ms. ok.
- M-20 /ueber-uns/ (Auslöser Laden): 122 Bilder, verworfen 3,3 %, Median 16,66 ms. ok.
- M-21 /gibt-es-nicht/ (Auslöser Laden): 122 Bilder, verworfen 0,8 %, Median 16,66 ms. ok.
- Alle fünf Läufe unter der Schwelle 5 %. Umgebungsausnahme: headless ohne GPU, Ersatzmessung über CPU-Drosselung (keine GPU-Bildrate; die GPU-Bildrate steht in _werkstatt/MENSCHEN.md).
- Ergebnis Schritt 7: erfüllt (Ersatzmessung).
- Nachprüfung der 18 Überlauf-Messungen (tabelle-kontrolle.mjs, Ergebnis: /home/user/schluesseldienst/.cache/e5-final/n4-bewegung/tabelle-kontrolle.json): table#preisliste (625 px breit) liegt im Behälter div.preis-tabelle-huelle mit overflow-x auto (scrollBreite 625, klientBreite 592). Der Überlauf bleibt im eigenen horizontalen Scrollbehälter; Dokument scrollBreite = klientBreite = 640. Kein Dokumentüberlauf, Befund nicht zu werten.

## Zusammenfassung der Nachprüfung (alle Teilschritte aus eigenen Läufen)
- Schritt 1 (Interaktionen): Menü-Blatt M-06 und Hauptnav-Pfeil M-05 entsprechen K-007 (no-preference 300 ms öffnen, 240 ms schließen; reduce nur Deckkraft 150/120 ms bzw. sofort). Der Frühbefund vom Menü-Blatt (kein Schließübergang) und die Pfeil-Dauer (300 statt 240 ms) sind im neuen Build behoben. Der Frühbefund zu Listen- und Registerlinks ist nach KERN M-03 keine Abweichung (dort ausdrücklich feedback-Übergang); er ist zurückzunehmen. Messlücke bei der Vorschlagsliste (d) bleibt.
- Schritt 2 (Tastatur): erfüllt.
- Schritt 3 (Laden, Scrollen reduce, 26 Läufe): erfüllt, 0 transform-Animationen, 0 sichtbare Probleme.
- Schritt 4 (axe, hell und dunkel, 13 Seiten): erfüllt, 0 serious/critical (Kontrolle erkennt 3).
- Schritt 5 (Fokus nie ganz verdeckt, mobil vorwärts, / und /kontakt/): erfüllt, 0 ganz verdeckt.
- Schritt 6 (Überlauf, 143 Messungen): erfüllt, 0 Dokumentüberlauf.
- Schritt 7 (Bildrate 4×, mobil, M-16/17/18/20/21): erfüllt, alle unter 5 % (3,3 % höchster Wert). Ersatzmessung (headless, keine GPU).
