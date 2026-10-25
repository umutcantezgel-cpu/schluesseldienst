# E4-BAU-20 · Rolle Baumeister · Modell Haiku · Stufe 2 · Kern-Version 1
Schreibrechte (exakt): src/vorlagen/seiten/recht.mjs, src/inhalte/recht/{impressum,datenschutz,widerruf,barrierefreiheit,quellen-lizenzen}.mjs, src/assets/css/ansichten/recht/recht.css (alle neu)
Ausgaben (gitignored, frei): /home/user/schluesseldienst/.cache/E4-BAU-20/**
Umfang: 5 Rechtsseiten (V12) als ENTWURF zur menschlichen Prüfung, Vorschau-Port 4200

## Rollenbriefing Baumeister
Du baust nach Mustern und änderst die Muster nicht. Häufige Fehler: Rechtstexte aus dem Gedächtnis oder von fremden Seiten; Paragrafen ohne Faktenblatt; Angaben erfinden, die nur der Betrieb kennt.

## Aufgabe in einem Satz
Baue eine schlichte Vorlage für Rechtsseiten und fünf Entwürfe – Impressum, Datenschutz, Widerruf, Barrierefreiheit, Quellen & Lizenzen –, die jede Betriebsangabe aus `src/konfig/betrieb.mjs` beziehen und vor dem Release zwingend von einem Menschen freigegeben werden müssen.

## Pflicht für jede der fünf Seiten
- Oben ein Hinweis (Klasse `hinweis hinweis-platzhalter`) mit dem Platzhalter `platzhalter('recht.<id>.freigabe', '<Seite>: Entwurf – rechtliche Prüfung und Freigabe nötig')` aus `bau/lib/platzhalter.mjs`. Er macht die Seite in der Vorschau sichtbar als Entwurf und sperrt den Release, bis der Mensch ihn ersetzt.
- `Stand:` mit `<time datetime="2026-10-25">`.
- Arbeitsansicht: H1, kurze Einleitung, Abschnitte mit `<h2>`, rechts (ab 64em) ein Inhaltsverzeichnis wie im Ratgeber; `indexierbar` bleibt Standard (ja), `sitemap: 'seiten'`.
- Paragrafen, Artikel-Nummern, Fristen und Zahlen NUR als Fakt-Objekt aus dem Faktenblatt der Seite (Themenpass-Feld `fakten`). Fehlt der Fakt, nennst du das Gesetz beim Namen ohne Nummer („nach der Datenschutz-Grundverordnung“) und nimmst die Stelle in den Bericht auf. Die Blätter `recht-impressum` und `recht-datenschutz` sind derzeit leer (Server nicht erreichbar) – dort also ohne Nummern.
## Inhalte
- Impressum: alle Felder aus `betrieb` (Name, Rechtsform, Inhaber, Anschrift, Telefon, E-Mail) und `betrieb.impressum` (Register, USt-IdNr., Kammer, Berufsbezeichnung, Verantwortlich für Inhalte, Verbraucherstreitbeilegung). Werte direkt ausgeben; Felder mit `null` entfallen.
- Datenschutz: Verantwortlicher (aus `betrieb`), Hosting-Protokolle (Hoster als Platzhalter `recht.datenschutz.hoster`), Kontakt per Telefon und E-Mail, Rechte der betroffenen Personen, Beschwerde bei einer Aufsichtsbehörde; ausdrücklich: keine Cookies, kein Speicher im Endgerät, kein Tracking, keine Drittanbieter, Schriften lokal. Nichts davon erfinden, was die Website nicht tut (prüfe `src/konfig/sicherheit.mjs`).
- Widerruf: Belehrung für Verträge im Fernabsatz als Entwurf; Ausnahme dringender Reparaturen nur über die Fakten aus `recht-widerruf-notfall`; Muster-Widerrufsformular als Text (keine Formularfelder).
- Barrierefreiheit: freiwillige Erklärung – Ziel WCAG 2.2 AA, Prüfstand „automatisierte Prüfung mit axe-core und Lighthouse“ ohne Ergebnisprozente, bekannte Grenzen (Prüfung auf echten Geräten steht aus), Kontakt für Rückmeldungen; Rechtslage nur über `recht-bfsg`.
- Quellen & Lizenzen: Ortsdaten von GeoNames (Lizenz und Hinweis „verändert“ aus `lizenz-geonames`), Schrift Atkinson Hyperlegible (Lizenz aus `lizenz-schrift`), Hinweis, dass Ratgeber-Quellen am jeweiligen Artikel stehen. Externe Links nur über `src/konfig/quellen.mjs`, sonst als Text ohne Link.
## Gemeinsame Regeln
`_werkstatt/pakete/_seitenvorlage.md` vollständig lesen und einhalten. Bündelname `recht`. Kein Inhalt aus den Rechtsseiten der Wettbewerber.
