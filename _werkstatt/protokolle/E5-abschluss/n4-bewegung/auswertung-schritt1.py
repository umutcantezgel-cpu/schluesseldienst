import json, sys
d = json.load(open('/home/user/schluesseldienst/.cache/e5-final/n4-bewegung/interaktionen.json', encoding='utf-8'))
import re
def kurz(t):
    if t in (None,): return None
    if t == 'none': return 0.0
    m = re.search(r'matrix\(([^)]+)\)', t)
    if not m: return t
    v = [float(x) for x in m.group(1).split(',')]
    return {'y': round(v[5], 2), 'x': round(v[4], 2), 'winkel': round(__import__('math').degrees(__import__('math').atan2(v[1], v[0])), 1), 's': round((v[0]**2+v[1]**2)**0.5, 3)}
for l in d['laeufe']:
    if l['id'] not in ('b-hauptnav', 'c-menue-blatt', 'a-faq', 'd-ortspruefung', 'e-composer', 'f-gruppenfilter'):
        continue
    for s in l['schritte']:
        if l['id'] in ('b-hauptnav','c-menue-blatt'):
            print(f"{l['modus']:15} {l['id']:13} {s['schritt']}")
            for name in s['vorher']['elemente']:
                v = s['vorher']['elemente'][name]
                if name not in ('blatt','panel','pfeil'): continue
                vals = [f"{m['ist_ms']}ms:op={m['elemente'][name]['opacity'][:5]} disp={m['elemente'][name]['display']} t={kurz(m['elemente'][name]['transform'])} rueck={str(m['elemente'][name].get('backdrop_deckkraft'))[:5]} h={m['elemente'][name].get('hoehe')}" for m in s['messungen']]
                print('   ', name, '| vorher op=%s disp=%s t=%s h=%s' % (v['opacity'], v['display'], kurz(v['transform']), v.get('hoehe')))
                for x in vals: print('       ', x)
