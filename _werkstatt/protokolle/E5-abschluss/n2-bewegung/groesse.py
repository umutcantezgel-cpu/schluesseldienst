# N2 Bewegungscode-Größen (gzip -9): Quelle, Build-Bewegungsanteil (dedupliziert), Bündel je Hauptansicht.
# Nur lesen. Ausgabe als JSON unter .cache/e5-abschluss/n2-bewegung/groesse.json.
import gzip, json, os, re

ROOT = '/home/user/schluesseldienst'
DIST = f'{ROOT}/.cache/e5-abschluss/dist'
ASSETS = f'{DIST}/assets'
SRC = f'{ROOT}/src/assets'
OUT = f'{ROOT}/.cache/e5-abschluss/n2-bewegung/groesse.json'

def gz(b):
    return len(gzip.compress(b, compresslevel=9, mtime=0))

def bloecke(text, kopf):
    """Alle Blöcke, die mit kopf beginnen (z. B. '@layer bewegung'), mit ausgeglichenen Klammern."""
    out, i = [], 0
    while True:
        j = text.find(kopf, i)
        if j < 0:
            break
        k = text.find('{', j)
        if k < 0:
            break
        tiefe = 0
        for m in range(k, len(text)):
            c = text[m]
            if c == '{':
                tiefe += 1
            elif c == '}':
                tiefe -= 1
                if tiefe == 0:
                    out.append(text[j:m + 1])
                    i = m + 1
                    break
        else:
            break
    return out

res = {'werkzeug': 'n2-groesse', 'methode': 'gzip -9 (python gzip.compress, compresslevel=9, mtime=0; entspricht gzip -9 -n bis auf Kopfzeilen-Metadaten)'}

# 1) Quelle: die drei Module allein
mod = {}
for name in ['abspielen', 'szene', 'tagesband']:
    p = f'{SRC}/js/module/{name}.mjs'
    raw = open(p, 'rb').read()
    txt = raw.decode('utf-8')
    mod[name] = {
        'datei': p.replace(ROOT + '/', ''), 'roh_bytes': len(raw), 'gz9_bytes': gz(raw), 'zeilen': txt.count('\n') + 1,
    }
res['module_quelle'] = mod
res['module_quelle_summe_einzel_gz9'] = sum(v['gz9_bytes'] for v in mod.values())
res['module_quelle_verkettet_gz9'] = gz(b''.join(open(f'{SRC}/js/module/{n}.mjs', 'rb').read() for n in ['abspielen', 'szene', 'tagesband']))

# 2) Build-CSS: Bewegungsanteil = @layer bewegung + @keyframes, dedupliziert nach Blocktext
css_dateien = sorted(f for f in os.listdir(ASSETS) if f.endswith('.css'))
layer_blocke, kf_blocke = [], []
je_datei = {}
for f in css_dateien:
    t = open(f'{ASSETS}/{f}', encoding='utf-8').read()
    lb = bloecke(t, '@layer bewegung')
    kb = bloecke(t, '@keyframes')
    if lb or kb:
        je_datei[f] = {'layer_bewegung_roh': sum(len(x) for x in lb), 'keyframes_roh': sum(len(x) for x in kb), 'bloecke_layer': len(lb), 'bloecke_keyframes': len(kb)}
    layer_blocke += lb
    kf_blocke += kb
layer_dedup = sorted(set(layer_blocke))
kf_dedup = sorted(set(kf_blocke))
anteil_dedup = layer_dedup + kf_dedup
anteil_text = '\n'.join(anteil_dedup).encode('utf-8')
res['build_css_bewegungsanteil'] = {
    'je_datei_mit_bewegung': je_datei,
    'layer_bewegung_bloecke_gesamt': len(layer_blocke), 'layer_bewegung_bloecke_dedupliziert': len(layer_dedup),
    'keyframes_bloecke_gesamt': len(kf_blocke), 'keyframes_bloecke_dedupliziert': len(kf_dedup),
    'roh_bytes_dedupliziert': len(anteil_text), 'gz9_bytes_dedupliziert': gz(anteil_text),
    'gz9_bytes_nur_layer': gz('\n'.join(layer_dedup).encode('utf-8')),
    'gz9_bytes_nur_keyframes': gz('\n'.join(kf_dedup).encode('utf-8')),
}

# 3) Quelle-CSS: @layer bewegung-Blöcke (Quelle) plus @keyframes in Quelle, zum Vergleich (kein Build)
quell_css = []
for dp, dn, fn in os.walk(f'{SRC}/css'):
    for f in fn:
        if f.endswith('.css'):
            quell_css.append(os.path.join(dp, f))
quell_layer, quell_kf = [], []
quell_je = {}
for p in sorted(quell_css):
    t = open(p, encoding='utf-8').read()
    lb = bloecke(t, '@layer bewegung')
    kb = bloecke(t, '@keyframes')
    if lb or kb:
        quell_je[p.replace(ROOT + '/', '')] = {'layer_bewegung': len(lb), 'keyframes': len(kb)}
    quell_layer += lb
    quell_kf += kb
res['quelle_css_bewegungsanteil'] = {
    'je_datei_mit_bewegung': quell_je,
    'gz9_verkettet_layer_plus_keyframes': gz(('\n'.join(quell_layer) + '\n' + '\n'.join(quell_kf)).encode('utf-8')),
    'roh_bytes': len(('\n'.join(quell_layer) + '\n' + '\n'.join(quell_kf)).encode('utf-8')),
}

# 4) Bündel je Hauptansicht: Stylesheets (ohne media-Sonderstile) und Modulskripte, gz-9
hauptansichten = ['/', '/einbruchschutz/', '/notoeffnung/tueroeffnung/', '/preise/', '/einsatzgebiet/',
                  '/einsatzgebiet/hessen/limburg-weilburg/', '/schluesseldienst-loehnberg/', '/ratgeber/rauchmelderpflicht/',
                  '/ueber-uns/', '/kontakt/', '/suche/', '/impressum/', '/gibt-es-nicht/', '/leistungen/']
def seite_pfad(u):
    p = u.rstrip('/') + '/index.html' if u != '/' else '/index.html'
    if u == '/gibt-es-nicht/':
        return f'{DIST}/404.html'
    return DIST + p

bundles = {}
for u in hauptansichten:
    pfad = seite_pfad(u)
    if not os.path.exists(pfad):
        bundles[u] = {'fehler': f'nicht gefunden: {pfad}'}
        continue
    html = open(pfad, encoding='utf-8').read()
    css = []
    for m in re.finditer(r'<link[^>]*rel="stylesheet"[^>]*>', html):
        tag = m.group(0)
        if 'media=' in tag:  # Druck- und Kontrastsonderstile zählen nicht in die Seitensumme (K-011)
            continue
        h = re.search(r'href="/assets/([^"]+)"', tag)
        if h:
            css.append(h.group(1))
    js = [re.search(r'src="/assets/([^"]+)"', m.group(0)).group(1) for m in re.finditer(r'<script type="module"[^>]*>', html) if re.search(r'src="/assets/', m.group(0))]
    def g(name):
        return gz(open(f'{ASSETS}/{name}', 'rb').read())
    css_gz = {c: g(c) for c in css}
    js_gz = {j: g(j) for j in js}
    bundles[u] = {'css': css_gz, 'css_summe_gz9': sum(css_gz.values()), 'js': js_gz, 'js_summe_gz9': sum(js_gz.values())}
res['bundles_hauptansichten'] = bundles

# 5) Modul-Bündel: welche Bündel tragen welches Modul (Abgleich über Markerzeichenketten im Bündel)
marker = {'abspielen': 'Ablauf noch einmal', 'szene': 'data-szene', 'tagesband': 'tb-jetzt-zeit', 'bewegung_css_layer': '@layer bewegung'}
mod_bund = {}
for f in sorted(os.listdir(ASSETS)):
    if not f.endswith('.js'):
        continue
    t = open(f'{ASSETS}/{f}', encoding='utf-8', errors='ignore').read()
    mod_bund[f] = {'roh': os.path.getsize(f'{ASSETS}/{f}'), 'gz9': gz(open(f'{ASSETS}/{f}', 'rb').read()), 'marker': [k for k, v in marker.items() if v in t and k != 'bewegung_css_layer']}
res['js_buendel_marker'] = mod_bund

json.dump(res, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print(json.dumps({'module_quelle': res['module_quelle'], 'summe_einzel': res['module_quelle_summe_einzel_gz9'], 'verkettet': res['module_quelle_verkettet_gz9']}, ensure_ascii=False, indent=1))
print(json.dumps(res['build_css_bewegungsanteil'], ensure_ascii=False, indent=1)[:2500])
print(json.dumps(res['quelle_css_bewegungsanteil']['gz9_verkettet_layer_plus_keyframes']))
print(json.dumps({u: {k: v for k, v in b.items() if k in ('css_summe_gz9', 'js_summe_gz9')} for u, b in bundles.items()}, ensure_ascii=False))
print(json.dumps(mod_bund, ensure_ascii=False, indent=1)[:3000])
