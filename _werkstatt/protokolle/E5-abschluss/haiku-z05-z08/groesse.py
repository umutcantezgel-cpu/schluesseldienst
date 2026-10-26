# Z-08 Bewegungscode: gz-Größen (gzip -9) aus Build und Quelle. Nur lesen.
import gzip, json, os, re, sys
ROOT = '/home/user/schluesseldienst'
DIST = f'{ROOT}/.cache/e5-abschluss/dist/assets'
SRC = f'{ROOT}/src/assets/css'
OUT = f'{ROOT}/.cache/e5-abschluss/haiku-z05-z08/groesse.json'

def gz(b): return len(gzip.compress(b, compresslevel=9))

def bloecke(text, kopf):
    """Liefert alle Blöcke, die mit kopf beginnen (z. B. '@layer bewegung'), mit ausgeglichenen Klammern."""
    out = []
    i = 0
    while True:
        j = text.find(kopf, i)
        if j < 0: break
        k = text.find('{', j)
        if k < 0: break
        tiefe = 0
        for m in range(k, len(text)):
            c = text[m]
            if c == '{': tiefe += 1
            elif c == '}':
                tiefe -= 1
                if tiefe == 0:
                    out.append(text[j:m+1]); i = m + 1; break
        else:
            break
    return out

def keyframes(text):
    return bloecke(text, '@keyframes')

res = {}
# 1) Build: CSS-Bundles mit Bewegungsbezug
css_dist = {}
for f in sorted(os.listdir(DIST)):
    if not f.endswith('.css'): continue
    t = open(f'{DIST}/{f}', encoding='utf-8').read()
    if '@keyframes' in t or '@layer bewegung' in t:
        css_dist[f] = t
res['build_css_mit_bewegung'] = {f: {'roh': len(t.encode()), 'gz': gz(t.encode()), 'layer_bewegung_gz': gz(''.join(bloecke(t, '@layer bewegung')).encode()), 'keyframes_gz': gz(''.join(keyframes(t)).encode())} for f, t in css_dist.items()}
# Obergrenze: Summe der Bundles mit Bewegungsbezug (Dateien sind je Seite geladen, Gesamtsumme nur als Schranke)
res['build_css_summe_gz_obergrenze'] = sum(v['gz'] for v in res['build_css_mit_bewegung'].values())
# Bewegungs-Anteil: nur die Regeln aus @layer bewegung und @keyframes (aus allen Bundles mit Bewegungsbezug, dedupliziert nach Text)
anteil = []
for f, t in css_dist.items():
    anteil += bloecke(t, '@layer bewegung')
    anteil += keyframes(t)
anteil_text = '\n'.join(sorted(set(anteil)))
res['build_bewegungsanteil_dedupliziert'] = {'roh': len(anteil_text.encode()), 'gz': gz(anteil_text.encode()), 'bloecke': len(set(anteil))}

# 2) Quelle: bewegung.css + alle @layer bewegung-Blöcke der Ansichten (ohne Dedup, Rohtext)
quellen = [f'{SRC}/bewegung.css']
for dp, dn, fn in os.walk(f'{SRC}/ansichten'):
    for f in fn:
        if f.endswith('.css'):
            p = os.path.join(dp, f)
            if '@layer bewegung' in open(p, encoding='utf-8').read(): quellen.append(p)
q = {}
for p in quellen:
    t = open(p, encoding='utf-8').read()
    q[os.path.relpath(p, ROOT)] = {'roh': len(t.encode()), 'gz': gz(t.encode()), 'layer_bewegung_gz': gz(''.join(bloecke(t, '@layer bewegung')).encode())}
res['quelle_bewegung_css'] = q
res['quelle_summe_gz_layer_bewegung_plus_bewegung_css'] = sum(v['layer_bewegung_gz'] for v in q.values())

# 3) Module (Bundles, die den Modulcode enthalten; Obergrenze je Modul)
module = {'abspielen': 'Ablauf noch einmal ansehen', 'szene': 'data-szene', 'tagesband': 'tagesband'}
js = {}
for f in sorted(os.listdir(DIST)):
    if not f.endswith('.js'): continue
    raw = open(f'{DIST}/{f}', 'rb').read()
    js[f] = {'roh': len(raw), 'gz': gz(raw)}
mod = {}
for name, marker in [('abspielen', 'abspielen'), ('szene', 'data-szene'), ('tagesband', 'tagesband')]:
    treffer = [f for f in js if marker in open(f'{DIST}/{f}', encoding='utf-8', errors='ignore').read()]
    mod[name] = {'bundles': {f: js[f] for f in treffer}, 'obergrenze_gz': max((js[f]['gz'] for f in treffer), default=None)}
res['module'] = mod
json.dump(res, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print(json.dumps({k: res[k] for k in ['build_css_summe_gz_obergrenze', 'build_bewegungsanteil_dedupliziert', 'quelle_summe_gz_layer_bewegung_plus_bewegung_css']}, ensure_ascii=False, indent=1))
print('module:', json.dumps({k: {'obergrenze_gz': v['obergrenze_gz'], 'bundles': list(v['bundles'].keys())} for k, v in mod.items()}, ensure_ascii=False))
print('build_css_mit_bewegung:', json.dumps(res['build_css_mit_bewegung'], ensure_ascii=False, indent=1))
