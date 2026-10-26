# Auswertung der Messreihe Z-05/Z-08 (nur lesen). Gibt Zusammenfassung auf stdout aus.
import glob, json, os, statistics
OUT = '/home/user/schluesseldienst/.cache/e5-abschluss/haiku-z05-z08'

def lade(p):
    with open(p, encoding='utf-8') as f:
        return json.load(f)

print('=== Z-05 Bildrate (mobil, 4x Drosselung, Schwelle <= 5 % verworfen) ===')
for m in ['m16', 'm17', 'm18', 'm20', 'm21']:
    werte = []
    for p in sorted(glob.glob(f'{OUT}/bildrate-{m}-*.json')):
        d = lade(p)
        werte.append(d['verworfen_prozent'])
        print(f"{m} {os.path.basename(p)} url={d['url']} ausloeser={d['ausloeser']} bilder={d['bilder']} verworfen={d['verworfen']} ({d['verworfen_prozent']} %) median={d['median_intervall_ms']} ms ergebnis={d['ergebnis']} umgebung={d['umgebungsausnahme'][:20]}")
    if werte:
        print(f'  -> max {max(werte)} %, Läufe {len(werte)}')

print('\n=== Z-08 INP (Schwelle max <= 200 ms) ===')
for p in sorted(glob.glob(f'{OUT}/inp-*.json')):
    d = lade(p)
    print(f"{os.path.basename(p):36s} max={d['max_ms']} ms p98={d['p98_ms']} gemeldet={d['interaktionen_gemeldet']}/{d['aktionen']} ergebnis={d['ergebnis']}")

print('\n=== Z-08 Lighthouse (Median; Spanne je Kennzahl) ===')
for p in sorted(glob.glob(f'{OUT}/lighthouse-*.json')):
    d = lade(p)
    print(f"{os.path.basename(p)} basis={d['basis']} laeufe={d['laeufe']} ergebnis={d['ergebnis']}")
    for s in d['seiten']:
        m = s['median']; sp = s['spanne']
        print(f"  {s['pfad']:42s} Perf {m['perf']:.0f} A11y {m['a11y']:.0f} BP {m['bp']:.0f} SEO {m['seo']:.0f} | LCP {m['lcp']:.0f} ms (Sp {sp['lcp']:.0f}) | CLS {m['cls']:.3f} (Sp {sp['cls']:.3f}) | TBT {m['tbt']:.0f} | FCP {m['fcp']:.0f}")
        print(f"     einzel LCP {[round(e['lcp']) for e in s['einzel']]} Perf {[e['perf'] for e in s['einzel']]} A11y {[e['a11y'] for e in s['einzel']]} BP {[e['bp'] for e in s['einzel']]} SEO {[e['seo'] for e in s['einzel']]} CLS {[round(e['cls'],3) for e in s['einzel']]}")
    if d.get('verfehlt'):
        print('  verfehlt:', [(v['pfad'], v['kennzahl'], v['wert']) for v in d['verfehlt']])
