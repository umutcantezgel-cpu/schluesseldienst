# E4-BAU-21 · Rolle Baumeister · Modell Haiku · Stufe 2 · Kern-Version 1
Schreibrechte (exakt): src/vorlagen/seiten/{leistungen,sitemap}.mjs, src/inhalte/{leistungen,sitemap}.mjs, src/assets/css/ansichten/verzeichnis/verzeichnis.css (alle neu)
Ausgaben (gitignored, frei): /home/user/schluesseldienst/.cache/E4-BAU-21/**
Umfang: 2 Seiten (V11) – `/leistungen/` und `/sitemap/`, Vorschau-Port 4202

## Rollenbriefing Baumeister
Du baust nach Mustern und änderst die Muster nicht. Häufige Fehler: Muster „verbessern“; eigene Texte in die Vorlage schreiben; Links auf Seiten, die es nicht gibt; Werte statt Tokens im CSS.

## Aufgabe in einem Satz
Baue die Gesamtübersicht aller Leistungen und die HTML-Sitemap als zwei schlanke Verzeichnisseiten, deren Inhalte vollständig aus Konfiguration, Routen- und Ortsdaten entstehen.

## /leistungen/ (Themenpass: Register aller Leistungen, ein Satz je Leistung, kein eigener Fließtext)
- Kopf: Kicker, H1, Einleitung (2 Sätze, Inhaltsmodul) und eine Sprungleiste zu den vier Gruppen (Anker-Links, kein JavaScript) – das ist der „Gruppenfilter“.
- Je Gruppe aus `src/konfig/leistungen.mjs` ein Abschnitt: Gruppennummer und -titel als Link auf die Gruppenseite, darunter alle Leistungen der Gruppe als Liste mit Icon, Titel (Link) und dem Feld `kurz`. Abwechselnd Fläche normal/`band`.
- Schlussband mit Link auf `/preise/` und `/kontakt/`.
- JSON-LD: `CollectionPage` mit `ItemList` (je Leistung `ListItem` mit `url`) und `BreadcrumbList`.
## /sitemap/ (Themenpass: vollständige HTML-Sitemap nach Bereichen; Orte über Länder- und Kreisverzeichnis)
- Bereiche: Start und Hauptseiten · Leistungen (Gruppen mit ihren Leistungen) · Ratgeber (nur gebaute Artikel: `artikelLaden(k.wurzel)` aus `src/vorlagen/seiten/artikel.mjs`) · Einsatzgebiet (alle Länder und darunter ihre Kreise – Daten aus `k.daten.orte`, Pfade wie in `src/vorlagen/seiten/hub.mjs`, Kreisanzeige über `kreisName` aus hub.mjs) · Rechtliches.
- Hauptseiten und Rechtliches aus `ROUTEN` in `src/konfig/routen.mjs`; nicht aufnehmen: Routen mit `indexierbar: false` (Suche, 404) und mit `bedingung` (Karriere).
- Mehrspaltige Listen (CSS-Spalten) für die Kreise; jeder Bereich ein Abschnitt mit `abschnittKopf`.
- JSON-LD: `BreadcrumbList` (Start › Sitemap) und `WebPage`.
## Gemeinsame Regeln
`_werkstatt/pakete/_seitenvorlage.md` vollständig lesen und einhalten. Bündelname `verzeichnis` für beide Seiten.
