#!/bin/bash
# Z-05/Z-08 Messreihe (nacheinander, Mess-Sperre liegt in jedem Werkzeug selbst). Nur lesen gegen den Messbuild.
cd /home/user/schluesseldienst || exit 2
OUT=.cache/e5-abschluss/haiku-z05-z08
L=$OUT/lauf.log
W=_werkstatt/werkzeuge
B=http://127.0.0.1:4251
echo "start $(date -Is)" >> "$L"
# Warten, bis der Reduce-Lauf (eigene Mess-Sperre) beendet ist
while ! grep -q '^EXIT=' "$OUT/reduce.log" 2>/dev/null; do sleep 5; done
echo "reduce fertig $(date -Is)" >> "$L"

# Z-05 Bildrate, mobil, 4x CPU-Drosselung, je Moment drei Läufe
for n in 1 2 3; do
  node $W/bildrate.mjs --url $B/ --ausloeser laden --aus $OUT/bildrate-m16-$n.json >> "$L" 2>&1; echo "M-16 Lauf $n exit=$?" >> "$L"
  node $W/bildrate.mjs --url $B/einbruchschutz/ --ausloeser scroll --dauer 4000 --aus $OUT/bildrate-m17-$n.json >> "$L" 2>&1; echo "M-17 Lauf $n exit=$?" >> "$L"
  node $W/bildrate.mjs --url $B/einsatzgebiet/ --ausloeser scroll --dauer 4000 --aus $OUT/bildrate-m18-$n.json >> "$L" 2>&1; echo "M-18 Lauf $n exit=$?" >> "$L"
  node $W/bildrate.mjs --url $B/ueber-uns/ --ausloeser laden --aus $OUT/bildrate-m20-$n.json >> "$L" 2>&1; echo "M-20 Lauf $n exit=$?" >> "$L"
  node $W/bildrate.mjs --url $B/gibt-es-nicht/ --ausloeser laden --aus $OUT/bildrate-m21-$n.json >> "$L" 2>&1; echo "M-21 Lauf $n exit=$?" >> "$L"
done

# Z-08 INP, alle Aktionsdateien, je zwei Läufe, Schwelle 200 ms
for n in 1 2; do
  node $W/inp.mjs --url $B/ --aktionen $W/aktionen/v01-inp.json --aus $OUT/inp-v01-$n.json --max 200 >> "$L" 2>&1; echo "INP v01 Lauf $n exit=$?" >> "$L"
  node $W/inp.mjs --url $B/einsatzgebiet/ --aktionen $W/aktionen/e3-einsatzgebiet.json --aus $OUT/inp-e3-einsatzgebiet-$n.json --max 200 >> "$L" 2>&1; echo "INP e3-einsatzgebiet Lauf $n exit=$?" >> "$L"
  node $W/inp.mjs --url $B/einsatzgebiet/bayern/miltenberg/ --aktionen $W/aktionen/e3-hub.json --aus $OUT/inp-e3-hub-$n.json --max 200 >> "$L" 2>&1; echo "INP e3-hub Lauf $n exit=$?" >> "$L"
  node $W/inp.mjs --url $B/kontakt/ --aktionen $W/aktionen/e4-kontakt.json --aus $OUT/inp-e4-kontakt-$n.json --max 200 >> "$L" 2>&1; echo "INP e4-kontakt Lauf $n exit=$?" >> "$L"
  node $W/inp.mjs --url $B/preise/ --aktionen $W/aktionen/e4-preise.json --aus $OUT/inp-e4-preise-$n.json --max 200 >> "$L" 2>&1; echo "INP e4-preise Lauf $n exit=$?" >> "$L"
  node $W/inp.mjs --url $B/suche/ --aktionen $W/aktionen/e4-suche.json --aus $OUT/inp-e4-suche-$n.json --max 200 >> "$L" 2>&1; echo "INP e4-suche Lauf $n exit=$?" >> "$L"
done

# Z-08 Lighthouse mobil, drei Läufe je Pfad, 12 Hauptansichten ohne 404 auf 4251
node $W/lighthouse.mjs --basis $B --pfade "/,/einbruchschutz/,/notoeffnung/tueroeffnung/,/preise/,/einsatzgebiet/,/einsatzgebiet/hessen/limburg-weilburg/,/schluesseldienst-loehnberg/,/ratgeber/rauchmelderpflicht/,/ueber-uns/,/kontakt/,/suche/,/impressum/" --laeufe 3 --formfaktor mobile --min-perf 95 --min-a11y 100 --min-bp 100 --min-seo 100 --max-lcp 2500 --max-cls 0.1 --aus $OUT/lighthouse-4251.json > $OUT/lighthouse-4251.log 2>&1; echo "LH 4251 exit=$?" >> "$L"
# Z-08 Startseite auf dem gzip-Server 4254
node $W/lighthouse.mjs --basis http://127.0.0.1:4254 --pfade "/" --laeufe 3 --formfaktor mobile --min-perf 95 --min-a11y 100 --min-bp 100 --min-seo 100 --max-lcp 2500 --max-cls 0.1 --aus $OUT/lighthouse-4254.json > $OUT/lighthouse-4254.log 2>&1; echo "LH 4254 exit=$?" >> "$L"
echo "ENDE $(date -Is)" >> "$L"
