import json, random, sys, os, platform
WURZEL = "/home/user/schluesseldienst/src/assets/css"
ORDNER = ["komponenten", "ansichten"]
SAAT = 20261026
dateien = []
for o in ORDNER:
    for dp, dn, fn in os.walk(os.path.join(WURZEL, o)):
        for f in fn:
            if f.endswith(".css"):
                dateien.append(os.path.relpath(os.path.join(dp, f), WURZEL).replace(os.sep, "/"))
dateien = sorted(dateien)
rnd = random.Random(SAAT)
gezogen = rnd.sample(dateien, 5)
protokoll = {
  "verfahren": "random.Random(20261026).sample(liste, 5); liste = alle *.css unter src/assets/css/komponenten/ und src/assets/css/ansichten/ (rekursiv), relative Pfade ab src/assets/css, lexikografisch sortiert",
  "python": platform.python_version(),
  "anzahl_grundgesamtheit": len(dateien),
  "saat": SAAT,
  "grundgesamtheit": dateien,
  "gezogen": gezogen,
}
with open("/home/user/schluesseldienst/.cache/endstand-nach/token/stichprobe-protokoll.json", "w", encoding="utf-8") as f:
    json.dump(protokoll, f, ensure_ascii=False, indent=1)
    f.write("\n")
print("Grundgesamtheit:", len(dateien))
print("Gezogen:")
for g in gezogen: print("  ", g, os.path.getsize(os.path.join(WURZEL, g)), "Bytes")
