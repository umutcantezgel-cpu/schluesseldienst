# Ergebnis der Bewegungs-Nachprüfung (Haiku-Prüfer, Lauf rest-)

## Teilschritt 1: Interaktionen (Quelle: /home/user/schluesseldienst/.cache/e5-abschluss/n2-bewegung/interaktionen.json, Auswertung: /home/user/schluesseldienst/.cache/e5-abschluss/n2-bewegung/rest-interaktionen.py)

Reduce: in keiner der Interaktionen a bis f und g gibt es einen transformierenden Übergang oder eine transformierende Animation (Messpunkte 40 ms und 400 ms). Es bleiben Deckkraft-Übergänge und sofortige Pfeil- und Chevron-Wechsel ohne Übergang.

- a FAQ öffnen (mobil, / und /preise/): reduce erfüllt (Chevron sofort, Antwort ohne Animation, M-07). no-preference zeigt Bewegung (Chevron 300 ms, Antwort m-feedback-ein 300 ms, Y −4 px); Dauer = zustand. Ergebnis: erfüllt.
- b Hauptnav Leistungen (Desktop): reduce öffnen Deckkraft 150 ms, schließen 120 ms, ohne Transform; erfüllt (M-05 reduziert). no-preference: Panel Y −8 px, 300 ms öffnen, 240 ms schließen (zustand / zustand-aus). Abweichung klein: der Aufklapper-Pfeil schließt in no-preference mit 300 ms statt zustand-aus 240 ms (hauptnav.css Zeile 19, eine Übergangsregel für beide Richtungen).
- c Menü-Blatt (mobil): reduce öffnen Deckkraft 150 ms, ohne Transform, erfüllt. no-preference öffnen Y 100 % auf 0, 300 ms, erfüllt. SCHLIESSEN ohne jeden Übergang: 40 ms nach dem Klick display none, Transform none, keine Animation (beide Modi). Register M-06 nennt 240 ms aus (no-preference) und Deckkraft 150 ms (reduziert). Ursache im Quelltext: menue-blatt.css Zeilen 25 bis 35 setzen die Übergänge nur auf `.menue-blatt[open]`; Schließen hat keine Übergangsregel. Ergebnis: teilweise, Befund mittel.
- d Ortsprüfung (mobil, /einsatzgebiet/): reduce Eingabe, Liste und Ergebnis sofort, ohne Animation (M-08, M-12 reduziert erfüllt). no-preference: Ergebnis-Deckkraft 150 ms (feedback, erfüllt). Die Vorschlagsliste zeigt in Schritt 1 keine Animation, weil die Abtastung nach dem Auftauchen der Liste erfolgte (Messlücke). Die dedizierte Abtastung probe-m08.json stützt M-08: no-preference m-feedback-ein 150 ms, Y −4 px; reduziert ohne Animation. Die Karten-Animationen m18-* im no-preference-Lauf sind scrollgebunden (view()) und keine Antwort auf die Eingabe. Ergebnis: erfüllt (mit Messlücke, gestützt durch probe-m08.json).
- e Composer (mobil, /kontakt/): reduce Anliegen-Wahl ohne Lageänderung; die Überlagerung ::before blendet 150 ms (M-02); der Betreff steht sofort (M-12 reduziert). no-preference: Hinweisblock m-feedback-ein 300 ms, Y −4 px (zustand); Betreff betreff-neu-a 150 ms von .6 auf 1 (feedback). Ergebnis: erfüllt. Schritt 1 (Notfall) misst den Betreff nicht, weil er nicht gerendert ist (oben=0).
- f Gruppenfilter (mobil, /leistungen/): reduce erscheinen 150 ms, nur Deckkraft (M-05 reduziert, erfüllt). no-preference m05-einblenden 300 ms, Y −8 px auf 0 (zustand, erfüllt). Die erste Gruppe (Einbruchschutz) ohne Animation: keine Wechsel-Einblendung, erwartet.
- g Drücken (zusätzlich, M-03, mobil): reduce keine Transform-Übergänge bei Rechner-Option, Listenlink und Registerlink (erfüllt). no-preference Rechner-Option (.wahl-option) skaliert sofort auf 0,98 (erfüllt). ABWEICHUNG: Listenlink (/notoeffnung/tueroeffnung/, .rand-liste a) und Registerlink (/einbruchschutz/, .gruppe-register a) skalieren mit einem 150-ms-Übergang (transform, Dauer feedback), obwohl das Register „sofort ohne Übergang“ verlangt. Quelltext: leistung.css Zeile 92, gruppe.css Zeile 92 (jeweils no-preference). Befund klein bis mittel.

Kontrolle: no-preference zeigt in allen Interaktionen Bewegung, die Messung ist also empfindlich.

## Teilschritt 2: Laden und Scrollen (Quelle: /home/user/schluesseldienst/.cache/e5-abschluss/n2-bewegung/laden.json)

Reduce, 26 Läufe (13 Hauptansichten × 390×844 und 1440×900; enthält /gibt-es-nicht/ mit Status 404, dort erwartet): transformierende Animationen nach Laden 0, nach Scrollen 0, Animationen nach Scrollen 0, sichtbare Textelemente nach Laden und nach Scrollen ohne Probleme (0 Fälle), reduced-motion-Emulation aktiv in allen 26 Läufen, keine externen Anfragen. Ergebnis: erfüllt.
Kontrolle no-preference: „/“ mobil 28 transformierende Animationen; „/ueber-uns/“ mobil 2 (nach Scrollen 5 Animationen). Die Kontrolle zeigt also, dass die Messung Bewegung erkennt.

## Teilschritt 4: Bewegungscode-Größe (gzip -9; Skript /home/user/schluesseldienst/.cache/e5-abschluss/n2-bewegung/rest-groesse.py, Ausgabe rest-groesse.json)

Verfahren: python gzip (Stufe 9, mtime 0) und CLI `gzip -9 -n` stimmen je Datei überein.
- CSS-Anteil (Build app.b4d5c9c199.css; @layer bewegung 1 Block, 6 431 B roh, 1 290 B gz; @keyframes gesamt 15, davon 14 innerhalb des Layers, 1 außerhalb (drehen, ortssuche.css), dedupliziert): 6 505 B roh, 1 313 B gz. Datei: /home/user/schluesseldienst/.cache/e5-abschluss/n2-bewegung/rest-css-bewegungsanteil.css
- abspielen.mjs: 780 B roh, 465 B gz
- szene.mjs: 1 171 B roh, 571 B gz
- tagesband.mjs: 2 834 B roh, 1 310 B gz, KEIN Bewegungscode (siehe unten)
- Summe reiner Bewegungscode (CSS-Anteil + abspielen + szene, einzeln gz): 2 349 B gz (≈ 2,3 KB). Verkettet gemessen sind die drei Module 2 033 B gz; der Wert der drei Module einzeln (2 346 B gz) ist eine Obergrenze.
- Obergrenze mit tagesband: 3 659 B gz.
- Vergleich: weiches Budget 12 KB gz (12 288 B) wird mit 2 349 B zu 19 % ausgeschöpft; hartes Limit 60 KB gz (ABNAHME Z-08, KERN K-007) wird zu 3,8 % ausgeschöpft.
- Näherung (zeilenweise, nicht Teil der Vorgabe): Übergänge und Animationen außerhalb @layer bewegung (komponenten und ansichten, z. B. Hauptnav, FAQ, Menü-Blatt, Druckregeln): rund 782 B gz zusätzlich, also grob 3,1 KB gz insgesamt. Auch damit bleibt der Abstand zum weichen Budget groß.
- Zum Vergleich: gesamtes Build-CSS app.b4d5c9c199.css 10 637 B gz (Budget je Seite 14 KB gz laut KERN).

tagesband.mjs: Anzeige- und Rechenlogik (Zeitfenster, Uhrzeit, Marke auf dem Zeitband über Attribute, Takt je Minute per setTimeout) ohne jede Animation oder Übergang; das Setzen von `transform` ist Positionierung, keine Bewegung.

Ergebnis: Bewegungscode 2,3 KB gz (rein) gegenüber dem weichen Budget 12 KB und dem harten Limit 60 KB; erfüllt.
