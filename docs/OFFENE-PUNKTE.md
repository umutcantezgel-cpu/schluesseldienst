# Offene Punkte

Diese Tabelle fasst die offenen Punkte aus `_werkstatt/MENSCHEN.md` (§1 bis §7), `_werkstatt/PLAN.md` (Abschnitt „Offene Punkte“) und den Berichten `_werkstatt/berichte/E4-KUND-03.md`, `E4-KUND-04.md` und `E4-KUND-05.md` zusammen. Die Begründungen stehen dort; hier steht nur, was fehlt und wer entscheidet.

**Blockiert Release „ja“** heißt: Der Build verweigert die Ausgabe, solange der Punkt offen ist, oder der Punkt ist in `MENSCHEN.md` mit **[RELEASE]** markiert. „nein“ heißt: Der Build verweigert nicht; die Website bleibt aber ohne diesen Punkt unvollständig.

**Stand des Builds, mit dem dieses Dokument geprüft wurde:** 5.556 Seiten im Vorschau-Modus; 58 Platzhalter in der Konfiguration; 65 Platzhalter auf den Seiten (Messbau `e719627`); 92 ungeprüfte Fakten; 72 Titel über 60 Zeichen. Diese Zahlen ändern sich mit jedem Build; `npm run bauen` und `npm run pruefen` zeigen sie aktuell.

**Wer entscheidet:** Betrieb (Inhaber oder Vertretungsberechtigte), Jurist, Fachmann (Fachangaben und Normen), Hoster, Projektleitung.

## Tabelle

| Nr. | Bereich | Was fehlt | Wer entscheidet | Blockiert Release | Quelle |
|---|---|---|---|---|---|
| 1 | Betrieb | Firmenname, Rechtsform, Inhaber oder Vertretung, Anschrift, Notruf-Telefon, E-Mail | Betrieb | ja | MENSCHEN §1 |
| 2 | Impressum | Registereintrag, USt-IdNr. oder W-IdNr., Kammer, Berufsbezeichnung, Verantwortlicher nach § 18 Abs. 2 MStV, Hinweis zur Streitbeilegung (§ 36 VSBG). Der OS-Link entfällt. | Betrieb, Jurist | ja | MENSCHEN §1 |
| 3 | Erreichbarkeit | Zeiten, Nachtdienst ja oder nein, Wochenende und Feiertage | Betrieb | ja | MENSCHEN §1 |
| 4 | Preise | Gesamtpreise je Zone, Zuschläge, Tagesband, USt-Modus, Zahlarten | Betrieb | ja | MENSCHEN §1, §7 |
| 5 | Medien und Nachweise | Eigene Fotos und Bewertungsprofil. Gründungsjahr, Qualifikationen und Mitgliedschaften nur mit Nachweis | Betrieb | nein | MENSCHEN §1 |
| 6 | Einsatzgebiet | Zonenradien A bis D und NL bestätigen | Betrieb | ja | MENSCHEN §2 |
| 7 | Leistungen je Zone | `leistungenBestaetigt` je Zone. Besonders: Notöffnung in den Zonen C, D und NL oder ein Partnernetz | Betrieb | ja | MENSCHEN §2, §7 |
| 8 | Indexierung | Zonen C, D und NL beobachten. Bleibt „Gecrawlt – nicht indexiert“ nach 8 Wochen über 60 %, `indexierung: false` setzen | Betrieb | nein | MENSCHEN §2 |
| 9 | NL-Seiten | Sprache (Annahme Deutsch) und Umsatzsteuer | Betrieb, Jurist | nein | MENSCHEN §2 |
| 10 | Orte | 314 ungeklärte Orte in `src/daten/orte-unklar.json`; sie werden nicht veröffentlicht. Manuelle Zuordnung möglich | Betrieb | nein | MENSCHEN §2 |
| 11 | Rechtsseiten | Impressum, Datenschutz, Widerruf, Barrierefreiheit, Quellen und Lizenzen sind Entwürfe. Rechtliche Prüfung und Freigabe (`recht.*.freigabe`) | Jurist | ja | MENSCHEN §3 |
| 12 | Fakten allgemein | Alle als „verifizieren“ markierten Fakten gegen die Primärquelle prüfen. Redaktionelle Verantwortung für KI-erstellte Texte (KI-VO Art. 50 Abs. 4) | Fachmann, Jurist, Betrieb | ja | MENSCHEN §3 |
| 13 | Datenbankrecht | Einschätzung zu § 87b UrhG bei Ortsauswahl und GeoNames-Daten. Die Ortsauswahl beruht auf Vergleichslisten, die Ortsfakten stammen aus GeoNames | Jurist | nein | MENSCHEN §3 |
| 14 | Wettbewerbsrecht | Restrisiko § 5 UWG bei Ortsseiten außerhalb des tatsächlichen Einsatzgebiets. Gegenmaßnahmen: `ENTSCHEIDUNGEN.md` D-004 | Jurist | nein | MENSCHEN §3 |
| 15 | Marken | Produktmarken nur mit belegter Partnerschaft in `src/konfig/marken.mjs`. Die Liste ist leer. | Betrieb | nein | MENSCHEN §3 |
| 16 | Leitidee Weilburg | Faktenblatt `weilburg-tunnel` (8 Fakten, Lage am Mühlberg). Bildmotiv bestätigen | Fachmann, Betrieb | ja, über die ungeprüften Fakten | MENSCHEN §3, §7; E4-KUND-05 |
| 17 | Normen | 12 Faktenblätter, 76 Fakten, nur Sekundärquellen; Normtexte sind kostenpflichtig. Offen: Zählung der RC-Klassen, Prüfwerte RC 2 bis 6, Notentriegelung, Gegenstand von EN 1047-1 und EN 15659, Status von EN 15685 | Fachmann; Betrieb für die Beschaffung der Normtexte | ja | MENSCHEN §7; E4-KUND-03 |
| 18 | Rechts-Fakten | 13 Faktenblätter, 64 Fakten. Meist nur Zusammenfassungen des Wortlauts; drei Blätter ohne belegten Fakt; Rauchwarnmelderpflicht in zwölf Ländern unbelegt; einzelne Gerichtsentscheidungen nur aus Sekundärquellen | Jurist | ja | E4-KUND-04 |
| 19 | Statistik, Förderung, Alarm, Nebel, Notruf, Lizenzen | 8 Faktenblätter, 50 Fakten. Offen: Berichtsjahr, Förderprogramme, Normen für Alarm und Nebel, Rechtsgrundlage des Notrufs, GeoNames-Lizenzversion, Schriftlizenz | Fachmann, Jurist | ja | E4-KUND-05 |
| 20 | Fachangaben ohne Faktenblatt | Torarten und Notentriegelung, Notschlüssel bei Keyless-Fahrzeugen, Ursachen bei Tresoren, Sicherungskarte, Begriffe Zentralschloss und Hauptschlüsselanlage, Mietrecht bei Zusatzschlössern | Fachmann | nein | MENSCHEN §7 |
| 21 | Ablauf-Formulierungen | Sätze ohne Zusage bestätigen oder streichen, etwa „Den Preis besprechen wir nach der Besichtigung.“ | Betrieb | nein | MENSCHEN §7 |
| 22 | Zusagen | `betrieb.zusagen`: Gesamtpreis vor Arbeitsbeginn, Rechnung mit allen Positionen, Kartenzahlung, Kosten bei erfolgloser Öffnung | Betrieb | ja | MENSCHEN §7 |
| 23 | Hub-Seiten | Die Daten ordnen „Eutergrund“ und „Stegskopf“ keinem Kreis zu; sie stehen unter „Weitere Orte“ | Betrieb | nein | MENSCHEN §7 |
| 24 | Repository | Das Repository ist öffentlich. Die Historie enthält Dateien mit fremden Inhalten und Personendaten; Einzelheiten stehen in MENSCHEN §4. Optionen: Repository privat stellen und oder die Historie bereinigen | Betrieb | nein | MENSCHEN §4 |
| 25 | Hosting | Hoster wählen: EU-Standort, Auftragsverarbeitung, IP-Kürzung, Logs höchstens 14 Tage, eigene Header. Hoster-Zusätze abschalten | Betrieb, Hoster | nein; Voraussetzung für den Livegang | MENSCHEN §5 |
| 26 | Domain und DNS | Schreibweise mit oder ohne `www`. HSTS-Preload erst nach stabiler HTTPS-Konfiguration. DNSSEC, CAA, Registrar-Sperre, Zwei-Faktor-Anmeldung. Die Basis-URL (`basisUrl` in `src/konfig/betrieb.mjs`, Form `https://host` ohne Pfad) ist Pflicht: ohne sie bricht der Release-Bau ab (`bau/bauen.mjs`) | Betrieb, Hoster | ja (Basis-URL), sonst nein | MENSCHEN §5 |
| 27 | E-Mail | SPF, DKIM und DMARC mit `p=reject`. Überwachtes Postfach für `security.txt` und Erinnerung vor deren Ablauf | Betrieb | nein | MENSCHEN §5 |
| 28 | Crawler | KI-Crawler sperren, ja oder nein (robots.txt). Annahme: nicht gesperrt | Betrieb | nein | MENSCHEN §5 |
| 29 | Prüfung außerhalb der Cloud | Echte Geräte (iPhone, Android), Firefox und Safari, GPU-Bildrate, Wirkung in der Search Console, Live-Header beim Hoster | Fachmann, Betrieb | nein | MENSCHEN §6 |
| 30 | Gestaltung | Geschmacksabnahme durch den Betrieb | Betrieb | nein | MENSCHEN §6 |
| 31 | Sichtabnahme Startseite | E2-Tor (V01): Die Sichtabnahme der Startseite wurde nach zwei Anläufen nicht erreicht (6,8 und 7,5). Die Kategorien unter 8 sind als Pakete der Etappe 3 eingeplant; der Nachweis soll über Prüfstufe C und den E5-Review laufen. Stand 2026-10-26: Der E5-Review ist abgeschlossen. Z-04 steht als AUSNAHME A-2 in ABNAHME.md, siehe Nr. 40. | Projektleitung, Betrieb | ungeklärt, PLAN.md nennt keine Wirkung auf den Release | PLAN.md |

## Beim Prüfen gefunden

Diese Punkte stehen nicht in den genannten Quellen. Sie entstanden bei der Dokumentation aus dem Build und aus dem Code.

| Nr. | Bereich | Was fehlt | Wer entscheidet | Blockiert Release | Quelle |
|---|---|---|---|---|---|
| 32 | Titellänge | 72 Ortsseiten haben einen Titel über 60 Zeichen (Namensdoppel mit Gemeinde oder Kreis, lange Namen in den Zonen C und D mit Entfernungsangabe). Laut genehmigtem Plan ist das bei Ortsseiten nur eine Warnung, auch im Release (Regel `seo/titel-laenge-ort`, ENTSCHEIDUNGEN D-SEO-04). Für alle anderen Seiten bleibt ein zu langer Titel im Release ein Fehler. Kürzere Formulierungen bleiben möglich. | Projektleitung (Formulierung) | nein | Build `--pruefen` |
| 33 | Ortszahl | `src/daten/orte.json` enthält 5.252 Orte, `orte-unklar.json` 314 Einträge. Die Projektvorgaben (KERN) nennen rund 6.000 Ortsseiten, die Entscheidung D-004 rund 5.800. | Projektleitung | nein | `src/daten/` |
| 34 | Lizenz | Im Repository liegt keine Lizenzdatei. Die Lizenz für Code und Texte ist nicht festgelegt. | Betrieb, Jurist | nein | Repository |
| 35 | Historie als Quelle | `npm test` (Plagiatstest), `npm run orte` und `pipeline/fingerabdruck.mjs` lesen Dateien aus einem festen Commit der Historie. Eine Bereinigung der Historie (Nr. 24) würde sie brechen. | Projektleitung (Anpassung der Tests), Betrieb | nein | Prüfung der Skripte |

## Aus Endprüfung und Abschluss-Nachprüfung (2026-10-26)

Diese Punkte stammen aus der Endprüfung (Anlauf 1 und 2, Runde 3) und aus der Abschluss-Nachprüfung. Die Quelle steht je Zeile.

| Nr. | Bereich | Was fehlt | Wer entscheidet | Blockiert Release | Quelle |
|---|---|---|---|---|---|
| 36 | Startseite (V01), Ortsprüfung und Zylinder | Das Ergebnis der Ortsprüfung liegt auf dem Desktop unter der Falz. Der Zylinder auf dem Tablet ist groß. Komposition und Details sind ausgeschöpft. | Projektleitung, Betrieb | nein | `_werkstatt/berichte/E5-endpruefung.md`, Runde 3 „Restpunkte“ |
| 37 | Leistungsgruppe (V02), Wissen-Block | Der Wissen-Block ist typografisch noch generisch. | Projektleitung, Betrieb | nein | `_werkstatt/berichte/E5-endpruefung.md`, Runde 3 „Restpunkte“ |
| 38 | Ortsseite (V07), Bewegung M-19 | Mobil läuft M-19 ab, bevor die Karte im Bild ist. Dafür ist eine Änderung am Register nötig. | Projektleitung, Betrieb | nein | `_werkstatt/berichte/E5-endpruefung.md`, Runde 3 „Restpunkte“ |
| 39 | Ortsseiten, Budget | Die größte Ortsseite hat 30.372 von 30.720 B (Endstand `72ed87c`: 30.390 B). Das Budget ist knapp. | Projektleitung | nein | `_werkstatt/berichte/E5-endpruefung.md`, Runde 3 „Restpunkte“ |
| 40 | Gestaltung, Z-04 (AUSNAHME A-2) | Der Ansichtswert ≥ 8 ist nach zwei Anläufen nicht erreicht. Anlauf 1: 6,50 bis 7,67. Anlauf 2: 6,33 bis 7,50. Der Blindvergleich ist in beiden Anläufen erfüllt (24 von 24 Paaren). Eine neue Gestaltungsrunde nur auf Auftrag des Menschen. Laut D-E5-02 hängt an der Website nichts von der Ausnahme ab. | Projektleitung, Betrieb | nein | ABNAHME.md (A-2); ENTSCHEIDUNGEN.md (D-E5-02) |
| 41 | Lagekarte, Kreislinien | Die Kreislinien bei ferneren Orten (z. B. Flonheim, Detmold-Berlebeck, Tilligte) sind am Kartenrahmen angeschnitten. Der gestrichelte Ring um Weilburg reicht über den Ausschnitt. Kein Text betroffen, kein Überlauf. Offen: Ausschnitt so wählen, dass der Ring ganz sichtbar bleibt, oder den Anschnitt bewusst gestalten. | Projektleitung, Betrieb | nein | `_werkstatt/berichte/E5-abschluss-pruefung.md`, Abschnitt 2 „Nicht geändert, mit Begründung“ |
| 42 | Rufleiste (mobil) | Die feste Rufleiste liegt mobil über den unteren Zeilen des ersten Bildschirms. Das ist gewollt (KERN K-003, Prinzip 5 „Daumen zuerst, Nacht mitgedacht“). Der Fokus bleibt über der Rufleiste (Scroll-Abstand; am Endstand mobil auf 5 Seiten gemessen: 0 ganz, 0 teilweise verdeckt), der Inhalt ist beim Scrollen frei. Hinweis für die Geschmacksabnahme (Nr. 30). | Projektleitung, Betrieb | nein | `_werkstatt/berichte/E5-abschluss-pruefung.md`, Abschnitt 2 „Nicht geändert, mit Begründung“ |
| 43 | Dokumentation, Funktion F03 | `_werkstatt/LAGEBILD.md` nennt die PLZ-Prüfung „Bedienen Sie meinen Ort?“. Die Seiten zeigen „Kommen Sie zu mir?“ (V01, `src/inhalte/start.mjs`) und „Ihren Ort prüfen“ (V05, `src/inhalte/einsatzgebiet.mjs`). Die Funktion ist erfüllt. Offen ist, welcher Wortlaut gilt; dazu gibt es keine Entscheidung in `_werkstatt/*.md` oder `docs/`. KERN K-010 nennt „Ort prüfen“ als Knopfwort, `src/inhalte/preise.mjs` nutzt ebenfalls „Ihren Ort prüfen“. | Projektleitung | nein | `_werkstatt/LAGEBILD.md` Zeile 30; Befund der Abschluss-Nachprüfung 1 (`_werkstatt/protokolle/E5-abschluss/nachpruefung-1-ergebnisse.txt` Zeile 142) |
| 44 | Startseite und Preise, LCP-Reserve | LCP-Median (Lighthouse, mobil): Startseite 2.404 ms, Preise 2.410 ms. Schwelle 2.500 ms. Der Abstand ist knapp. Vorschlag der Prüfung: bei der nächsten Messung fünf Läufe nehmen und die Einzelwerte beobachten. | Projektleitung | nein | `_werkstatt/berichte/E5-endpruefung.md`, Anlauf 2, Befund „LCP-Reserve“; ABNAHME.md (A-1) |
| 45 | Ladezeit gegen Lighthouse-Wert (Seitenwechsel, D-E5-03) | Gegen den Konsolenfehler beim Seitenwechsel gibt es zwei geprüfte Lösungen. Gewählt ist das Modul mit `blocking="render"`: Lighthouse-Grenzen gehalten, im echten Browser 20–90 ms später als ohne Fix. Ein kleines Kopf-Skript wäre im echten Browser rund 250 ms schneller (FCP / 1.107 statt 1.376 ms), verfehlt aber auf /preise/ die simulierte LCP-Grenze (2.557 statt ≤ 2.500 ms). Umstellen, wenn die echte Ladezeit wichtiger ist als der Lighthouse-Wert (Kopf-Skript aus Commit `5807770`). | Projektleitung | nein | `_werkstatt/ENTSCHEIDUNGEN.md` (D-E5-03); `_werkstatt/berichte/E5-abschluss-pruefung.md`, Abschnitt 4 |
| 46 | Gebietskarten der Hubs, Beschriftung an der Weilburg-Linie | In der Sichtung der Endstand-Stichprobe berührt die gestrichelte Strecke nach Weilburg in einigen Kreis- und Länderkarten die Beschriftungen „Weilburg“ und die km-Angabe (z. B. Soest, Worms, Bad Dürkheim, Südliche Weinstraße, Niedersachsen, Ammerland, Harz); auf einer Ortskarte streift der Zonenbogen einen Ortsnamen. Alles bleibt lesbar, nichts ist abgeschnitten. Offen: in der Platzierung (`src/vorlagen/teile/lagekarte.mjs`) einen Mindestabstand zur Strecke vorsehen. | Projektleitung | nein | `_werkstatt/protokolle/E5-abschluss/z09-stichprobe/sichtung.md` |
| 47 | Ortsseiten Zone C/D und NL, Umbruch im H1 | Im H1 „Schlüsseldienst für {Ort} – aus Weilburg (≈ {d} km)“ bricht auf dem Tablet die Zeile zwischen „≈“ und Zahl bzw. zwischen Zahl und „km“ um (z. B. Dinkelland-Noord Deurningen, Kirchlengern-Stift Quernheim). Nichts ist abgeschnitten. Offen: in `src/vorlagen/seiten/ort.mjs` (h1Text) geschützte Leerzeichen setzen: `(≈\u00A0${o.km}\u00A0km)`. | Projektleitung | nein | `_werkstatt/protokolle/E5-abschluss/z09-stichprobe/sichtung.md` |
