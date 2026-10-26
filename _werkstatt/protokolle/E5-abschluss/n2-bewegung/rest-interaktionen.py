# Auswertung interaktionen.json (Haiku-Prüfer, Nachprüfung N2). Nur lesen.
import json, re, math
D = '/home/user/schluesseldienst/.cache/e5-abschluss/n2-bewegung'
d = json.load(open(f'{D}/interaktionen.json', encoding='utf-8'))

def kurz(t):
    if t in (None,): return None
    if t == 'none': return 'none'
    m = re.match(r'matrix\(([^)]+)\)', t)
    if not m: return t
    v = [float(x) for x in m.group(1).split(',')]
    return {'winkel': round(math.degrees(math.atan2(v[1], v[0])), 1), 'skal': round(math.hypot(v[0], v[1]), 3), 'y': round(v[5], 2), 'x': round(v[4], 2)}

def transf_anim(a):
    return a.get('transformiert')

rows = []
def zeile(s):
    rows.append(s)

for l in d['laeufe']:
    if 'schritte' not in l or not l.get('schritte'):
        continue
    zeile(f"=== {l['id']} | {l['modus']} | {l['geraet']} | {l['pfad']}")
    for s in l['schritte']:
        zeile(f"-- {s['schritt']}")
        for name in s['nach_400ms']['elemente']:
            v = s['vorher']['elemente'].get(name) or {}
            a40 = s['nach_40ms']['elemente'].get(name) or {}
            a400 = s['nach_400ms']['elemente'].get(name) or {}
            zeile(f"   {name}: vorher={kurz(v.get('transform'))} op={v.get('opacity')} | 40={kurz(a40.get('transform'))} op={a40.get('opacity')} | 400={kurz(a400.get('transform'))} op={a400.get('opacity')}")
        an40 = s['nach_40ms']['animationen']
        tr40 = [a for a in an40 if a['transformiert']]
        zeile(f"   Animationen@40: {len(an40)} gesamt, transformierend {len(tr40)}")
        for a in an40:
            zeile(f"     {a['art']} {a.get('uebergang') or a.get('animation')} [{','.join(a['eigenschaften'])}] dauer={a['dauer_ms']} verz={a['verzoegerung_ms']} ziel={a['ziel']} transf={a['transformiert']}")
        an400 = s['nach_400ms']['animationen']
        zeile(f"   Animationen@400: {len(an400)} gesamt, transformierend {sum(1 for a in an400 if a['transformiert'])}")
print('\n'.join(rows))
