# Haiku-Prüfer N2, Teilschritt 4: Bewegungscode-Größe (gzip -9). Nur lesen; Ausgaben mit Präfix rest-.
# Zuordnung über Byte-Bereiche: @keyframes innerhalb von @layer bewegung werden nur einmal gezählt.
import gzip, json, re, subprocess, os
ROOT = '/home/user/schluesseldienst'
OUT = f'{ROOT}/.cache/e5-abschluss/n2-bewegung'
DIST = f'{ROOT}/.cache/e5-abschluss/dist/assets'
SRC = f'{ROOT}/src/assets/js/module'

def gz9(b):
    return len(gzip.compress(b, compresslevel=9, mtime=0))

def cli_gz9(pfad):
    return int(subprocess.run(['gzip', '-9', '-n', '-c', pfad], capture_output=True, check=True).stdout.__len__())

def block_at(text, m):
    """Ab dem Treffer m (die öffnende Klammer ist Teil des Treffers) den Block bis zur passenden schließenden Klammer."""
    start = m.start()
    k = text.find('{', m.end() - 1)
    tiefe = 0
    for i in range(k, len(text)):
        c = text[i]
        if c == '{': tiefe += 1
        elif c == '}':
            tiefe -= 1
            if tiefe == 0:
                return start, i + 1
    raise ValueError('unausgeglichen')

res = {'werkzeug': 'n2-groesse-rest', 'methode': 'gzip -9: python gzip.compress(level 9, mtime 0) und CLI gzip -9 -n (Kreuzprüfung)'}

# 1) Module
mod = {}
for name in ['abspielen', 'szene', 'tagesband']:
    p = f'{SRC}/{name}.mjs'
    raw = open(p, 'rb').read()
    mod[name] = {'datei': p.replace(ROOT + '/', ''), 'roh_bytes': len(raw), 'gz9_py': gz9(raw), 'gz9_cli': cli_gz9(p)}
res['module_quelle'] = mod
res['module_summe_alle_drei_einzeln_gz9'] = sum(v['gz9_py'] for v in mod.values())
res['module_summe_bewegung_abspielen_szene_einzeln_gz9'] = mod['abspielen']['gz9_py'] + mod['szene']['gz9_py']
res['module_verkettet_alle_drei_gz9'] = gz9(b''.join(open(f'{SRC}/{n}.mjs', 'rb').read() for n in ['abspielen', 'szene', 'tagesband']))

# 2) Build-CSS: Bewegungsanteil
css_dateien = sorted(f for f in os.listdir(DIST) if re.fullmatch(r'app\.[0-9a-f]+\.css', f))
assert len(css_dateien) == 1, css_dateien
pfad = f'{DIST}/{css_dateien[0]}'
t = open(pfad, encoding='utf-8').read()
res['build_css'] = {'datei': pfad.replace(ROOT + '/', ''), 'roh_bytes': len(t.encode('utf-8')), 'gz9_gesamt': gz9(t.encode('utf-8')), 'kommentare_im_build': t.count('/*')}

layer = [block_at(t, m) for m in re.finditer(r'@layer bewegung\s*\{', t)]
kf = [block_at(t, m) for m in re.finditer(r'@keyframes\s+[\w-]+\s*\{', t)]
def in_layer(a, b):
    return any(ls <= a and b <= le for ls, le in layer)
kf_innen = [(a, b) for a, b in kf if in_layer(a, b)]
kf_aussen = [(a, b) for a, b in kf if not in_layer(a, b)]
layer_txt = '\n'.join(t[a:b] for a, b in layer)
kf_aussen_txt = '\n'.join(t[a:b] for a, b in kf_aussen)
anteil = (layer_txt + '\n' + kf_aussen_txt).strip() + '\n'
open(f'{OUT}/rest-css-bewegungsanteil.css', 'w', encoding='utf-8').write(anteil)
res['build_css_bewegungsanteil'] = {
    'layer_bewegung_bloecke': len(layer), 'layer_bewegung_roh': len(layer_txt.encode()), 'layer_bewegung_gz9': gz9(layer_txt.encode()),
    'keyframes_gesamt': len(kf), 'keyframes_innerhalb_layer': len(kf_innen), 'keyframes_ausserhalb_layer': len(kf_aussen),
    'keyframes_ausserhalb_roh': len(kf_aussen_txt.encode()),
    'anteil_roh': len(anteil.encode()), 'anteil_gz9_py': gz9(anteil.encode('utf-8')),
    'anteil_gz9_cli': cli_gz9(f'{OUT}/rest-css-bewegungsanteil.css'),
    'anteil_datei': f'{OUT}/rest-css-bewegungsanteil.css',
}
# Zusatz (Näherung): Übergänge/Animationen außerhalb @layer bewegung (Zeilenweise, Build ist zeilenweise umbrochen)
ausserhalb = []
bereich = layer
for zeile in t.split('\n'):
    if re.search(r'transition|animation|starting-style|view-transition', zeile) and not any(zeile in t[a:b] for a, b in []):
        ausserhalb.append(zeile)
zusatz_txt = '\n'.join(z for z in ausserhalb if z not in layer_txt)
res['zusatz_uebergaenge_ausserhalb_layer_naeherung'] = {'zeilen': len(ausserhalb), 'roh': len(zusatz_txt.encode()), 'gz9_py': gz9(zusatz_txt.encode()), 'hinweis': 'Näherung: Zeilen mit transition/animation/starting-style/view-transition außerhalb der Layer-Blöcke (Build ist zeilenweise)'}

# 3) Summen
css_anteil = res['build_css_bewegungsanteil']['anteil_gz9_py']
res['summe'] = {
    'css_anteil_gz9': css_anteil,
    'bewegung_rein_css_plus_abspielen_plus_szene_einzeln_gz9': css_anteil + res['module_summe_bewegung_abspielen_szene_einzeln_gz9'],
    'bewegung_plus_tagesband_einzeln_gz9_obergrenze': css_anteil + res['module_summe_alle_drei_einzeln_gz9'],
    'bewegung_rein_css_plus_abspielen_plus_szene_verkettet_naeherung': None,
    'budget_weich_gz': 12 * 1024,
    'budget_hart_gz': 60 * 1024,
}
res['summe']['abstand_zu_weich_bewegung_rein'] = res['summe']['budget_weich_gz'] - res['summe']['bewegung_rein_css_plus_abspielen_plus_szene_einzeln_gz9']
res['summe']['anteil_an_hart_prozent'] = round(100 * res['summe']['bewegung_rein_css_plus_abspielen_plus_szene_einzeln_gz9'] / res['summe']['budget_hart_gz'], 1)
res['summe']['anteil_an_weich_prozent'] = round(100 * res['summe']['bewegung_rein_css_plus_abspielen_plus_szene_einzeln_gz9'] / res['summe']['budget_weich_gz'], 1)
json.dump(res, open(f'{OUT}/rest-groesse.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print(json.dumps(res, ensure_ascii=False, indent=1))
