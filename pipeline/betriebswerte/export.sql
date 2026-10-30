-- Export der bestätigten Betriebswerte als eine JSON-Liste (eine Zeile). Läuft im Workflow betriebswerte als
-- sd_export (nur lesen); pipeline/betriebswerte/uebernehmen.mjs --roh liest die Ausgabe.
select coalesce(
  json_agg(json_build_object('schluessel', schluessel, 'typ', typ, 'wert', wert, 'geaendert_am', geaendert_am) order by schluessel),
  '[]'::json
)
from betrieb.freigegeben;
