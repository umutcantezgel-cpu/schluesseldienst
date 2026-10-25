# E4-KUND-04 · Kurzbericht Recht-Faktenblätter

Stand: 2026-10-25 · Umfang: 13 Faktenblätter (Recht, Steuern, Versicherung) · Dateien: `src/inhalte/fakten/` (13 Dateien, Namen wie in `FAKTENBLAETTER`)

**Ergebnis:** 64 Fakten (alle Status „verifizieren“), 14 primäre und 3 sekundäre Quellen, 76 offene Punkte. Drei Blätter haben keinen belegten Fakt (recht-preisangabe, recht-impressum, recht-datenschutz). Grund: gesetze-im-internet.de lieferte während der Sitzung für die meisten Paragrafen HTTP 503. Abrufbar waren u. a. BGB § 138, StGB § 291, UStG § 14 und UStDV § 33, EStG § 35a und WaffG § 36 (jeweils als Zusammenfassung), BFSG § 1. Für Hessen wich ich auf die Druckschrift des Ministeriums aus (HBO, Stand Oktober 2025), weil das Landesrecht-Portal nicht erreichbar war.

| Blatt | Fakten | Quellen (primär / sekundär) | offene Punkte |
|---|---|---|---|
| recht-rauchmelder | 15 | 4 / 0 | 10 |
| recht-waffen | 5 | 1 / 0 | 5 |
| recht-video | 8 | 0 / 1 | 6 |
| recht-widerruf-notfall | 3 | 1 / 0 | 5 |
| recht-rechnung | 9 | 2 / 0 | 5 |
| recht-wucher | 9 | 3 / 1 | 6 |
| recht-preisangabe | 0 | 0 / 0 | 3 |
| recht-35a | 5 | 1 / 0 | 7 |
| recht-schluesselverlust-miete | 4 | 1 / 0 | 6 |
| versicherung-schluessel | 4 | 0 / 1 | 6 |
| recht-impressum | 0 | 0 / 0 | 5 |
| recht-datenschutz | 0 | 0 / 0 | 6 |
| recht-bfsg | 2 | 1 / 0 | 6 |
| **Summe** | **64** | **14 / 3** | **76** |

**Wichtigste Unsicherheiten**

1. **Wortlaut nur teilweise am Original geprüft.** Die hessische HBO (§ 14 Abs. 2, § 86 Abs. 1 Nr. 2, § 87) und die NRW-Bauordnung (§ 47 Abs. 2) habe ich als PDF lokal ausgelesen; das ist wörtlich. Alle übrigen Gesetzestexte (BGB, StGB, UStG, UStDV, EStG, WaffG, BFSG, Bayern, Sachsen) liegen nur als Zusammenfassung des Abrufwerkzeugs vor. Zahlen und Paragrafen stimmen mit der Zusammenfassung überein, sind aber nicht am Originaltext nachgeprüft.
2. **Nicht abgerufen:** WaffG-Verordnung AWaffV § 13 (Behältnisse), BGB § 312g Volltext, PAngV § 1, DDG § 5, VSBG § 36, TDDDG § 25, BDSG § 4, BFSG §§ 3 und 12, DSGVO-Wortlaut (EUR-Lex lieferte nur Stichpunkte), EStG-Anwendungsschreiben des BMF.
3. **Rechtsprechung.** BGH VIII ZR 205/13 (05.03.2014): belegt nur über die Pressemitteilung Nr. 42/14, nicht über das Urteil. BGH VIII ZR 37/24 (11.02.2026, Rn. 44) am Urteil geprüft, betrifft aber einen Kaufvertrag im Rahmen von § 138 Abs. 1 BGB. BGH 1 StR 113/19 (Wucher, Schlüssel-Notdienst laut Verbraucherzentrale): nur Listeneintrag bestätigt, Inhalt offen.
4. **Wucher-Schwelle.** Es gibt keine gesetzliche Preisgrenze. „Annähernd doppelt so hoch“ ist eine Regelvermutung des BGH aus dem Kaufrecht und keine Strafbarkeitsschwelle nach § 291 StGB.
5. **Fassungen und Fristen.** Hessen: Oktober-2025-Fassung, aber für Wohnungen im Bestand keine Frist im Text; Sekundärquellen nennen widersprüchliche Stichtage (31.12.2014 bzw. 01.01.2020). Bayern: Frist 31.12.2017 laut Portal, Fassung 14.08.2007, gültig ab 01.05.2026 (nicht am Wortlaut geprüft). Sachsen: Frist 31.12.2023, Stand 19.03.2024 laut Portal (nur Seite 1 von rund 213.000 Zeichen gelesen).
6. **Rauchwarnmelder in zwölf Ländern nicht belegt** (Berlin, Baden-Württemberg, Brandenburg, Bremen, Hamburg, Mecklenburg-Vorpommern, Niedersachsen, Rheinland-Pfalz, Saarland, Sachsen-Anhalt, Schleswig-Holstein, Thüringen). Die Suchtreffer waren veraltet oder widersprüchlich (z. B. Rheinland-Pfalz: Absatz 7 oder 8).
7. **Versicherung.** Nur die Musterbedingungen VHB 2022 (Quadratmetermodell, Stand Juni 2026) wurden gelesen. Ob Notöffnung oder Schlosserkosten versichert sind, steht darin nicht; einzelne Versicherer sind nicht geprüft.
8. **Test-Befehl.** Der Aufruf `node --test test/` aus dem Paketblatt schlägt unter Node 22 fehl, weil er das Verzeichnis als Datei behandelt. Der Projektbefehl `node --test "test/*.test.mjs"` läuft grün: 224 bestanden, 0 fehlgeschlagen, 1 offen (todo).

**Hinweis an den Menschen:** Alle Blätter brauchen juristische Durchsicht (MENSCHEN.md §3). Vorrangig: Wortlaut aller als Zusammenfassung gelesenen Paragrafen gegen die amtlichen Seiten prüfen, sobald gesetze-im-internet.de wieder antwortet; die drei leeren Blätter nachholen; Landesrecht für die zwölf offenen Länder ergänzen. Verwendete Abrufe und Auszüge liegen lokal in `.cache/E4-KUND-04/` (gitignored).
