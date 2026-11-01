-- Supabase-Projekt B „schluesseldienst“ (Frankfurt): Betriebswerte-Zentrale (D-DATEN-01).
-- Läuft als postgres (Supabase-MCP apply_migration oder SQL-Editor), idempotent: mehrfach ausführbar.
-- Danach pipeline/betriebswerte/startwerte.sql einspielen. Enthält keine Passwörter: Das Passwort der Rolle
-- sd_export setzt der Inhaber selbst (docs/BETRIEB.md, Abschnitt „Einrichtung“).
-- Bewusst nicht unter supabase/migrations/, damit keine Integration diese Datei von sich aus anwendet.

-- 1. Grundschutz: Die Rollen der Data API (anon, authenticated, service_role) bekommen in public nichts, auch nicht
--    für künftige Objekte. Die Data API ist im Projekt ohnehin abgeschaltet; das hier gilt zusätzlich.
do $$
declare
  r text;
begin
  foreach r in array array['anon', 'authenticated', 'service_role'] loop
    continue when not exists (select from pg_roles where rolname = r);
    execute format('alter default privileges for role postgres in schema public revoke all on tables from %I', r);
    execute format('alter default privileges for role postgres in schema public revoke all on sequences from %I', r);
    execute format('alter default privileges for role postgres in schema public revoke all on functions from %I', r);
    execute format('revoke all on all tables in schema public from %I', r);
    execute format('revoke all on all sequences in schema public from %I', r);
    execute format('revoke all on all functions in schema public from %I', r);
    if r <> 'service_role' then
      execute format('revoke all on schema public from %I', r);
    end if;
  end loop;
end $$;
alter default privileges for role postgres in schema public revoke execute on functions from public;

-- 2. Schemas: intern (Hilfsfunktionen, Lebenszeichen) und betrieb (Werte). Keines wird je über die Data API freigegeben.
create schema if not exists intern;
create schema if not exists betrieb;
revoke all on schema intern from public;
revoke all on schema betrieb from public;
do $$
declare
  r text;
begin
  foreach r in array array['anon', 'authenticated', 'service_role'] loop
    continue when not exists (select from pg_roles where rolname = r);
    execute format('revoke all on schema intern from %I', r);
    execute format('revoke all on schema betrieb from %I', r);
  end loop;
end $$;

-- 3. RLS automatisch für jede neue Tabelle in public, intern und betrieb. Fail-closed: Gelingt das Einschalten nicht,
--    bricht die anlegende Anweisung ab, statt eine Tabelle ohne RLS zu hinterlassen. Andere Schemas (Supabase-eigene)
--    werden nicht berührt.
create or replace function intern.rls_automatisch() returns event_trigger
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  o record;
begin
  for o in
    select object_identity
    from pg_event_trigger_ddl_commands()
    where schema_name in ('public', 'intern', 'betrieb')
      and command_tag in ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      and object_type in ('table', 'partitioned table')
  loop
    execute format('alter table %s enable row level security', o.object_identity);
  end loop;
end $$;
revoke all on function intern.rls_automatisch() from public;
-- Anlegen ohne vorheriges DROP, damit das Einspielen keine zerstörende Anweisung enthält; das abschließende ENABLE
-- schaltet auch einen von Hand abgeschalteten Trigger wieder ein.
do $$
begin
  if not exists (select from pg_event_trigger where evtname = 'sd_rls_automatik') then
    create event trigger sd_rls_automatik on ddl_command_end
      when tag in ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      execute function intern.rls_automatisch();
  end if;
end $$;
alter event trigger sd_rls_automatik enable;

-- 4. Lebenszeichen: Der Workflow betriebswerte (zweimal täglich) und die wöchentliche Aufsicht melden sich hier. Die
--    Abfragen halten das kostenlose Projekt zugleich aktiv (Supabase pausiert nach 7 Tagen ohne Aktivität).
create table if not exists intern.lebenszeichen (
  quelle text primary key check (quelle in ('betriebswerte', 'wache')),
  zuletzt timestamptz not null default now(),
  anzahl bigint not null default 1,
  details jsonb not null default '{}'::jsonb check (pg_column_size(details) < 2048)
);
alter table intern.lebenszeichen enable row level security;
revoke all on intern.lebenszeichen from public;

create or replace function intern.lebenszeichen_setzen(p_quelle text, p_details jsonb default '{}'::jsonb) returns void
language sql
security definer
set search_path = ''
as $$
  insert into intern.lebenszeichen as l (quelle, details)
  values (p_quelle, coalesce(p_details, '{}'::jsonb))
  on conflict (quelle) do update set zuletzt = now(), anzahl = l.anzahl + 1, details = excluded.details;
$$;
revoke all on function intern.lebenszeichen_setzen(text, jsonb) from public;

-- 5. Die Werte. Typisierte Spalten, damit der Table Editor passende Eingabefelder zeigt (Text, Zahl, Häkchen); JSON
--    nur für Zeiten und Tagesband. Beträge in Euro (der Export rechnet in Cent um).
create table if not exists betrieb.werte (
  schluessel text primary key check (schluessel ~ '^[a-z][a-z0-9.-]*$'),
  beschriftung text not null,
  typ text not null check (typ in ('text', 'text_oder_leer', 'plz', 'telefon_anzeige', 'telefon_e164', 'email',
    'https_basis', 'ust_modus', 'ja_nein', 'betrag', 'zeiten', 'tagesband')),
  wert_text text,
  wert_euro numeric(8, 2) check (wert_euro >= 0),
  wert_ja_nein boolean,
  wert_json jsonb,
  ohne_wert boolean not null default false,   -- betrag: nach Absprache · text_oder_leer: Angabe entfällt
  bestaetigt boolean not null default false,  -- bestätigt = darf veröffentlicht werden (öffentlicher Pull Request!)
  hinweis text,                                -- kommt aus startwerte.sql
  notiz text,                                  -- eigene Notiz, wird nie exportiert
  geaendert_am timestamptz not null default now()
);
alter table betrieb.werte enable row level security;
revoke all on betrieb.werte from public;
-- Beschreibungen erscheinen im Table Editor an Tabelle und Spalten.
comment on table betrieb.werte is 'Betriebswerte der Website (D-DATEN-01, docs/BETRIEB.md). Bestätigte Werte übernimmt der Workflow betriebswerte.yml per Pull Request in das öffentliche Repository: bestätigen heißt veröffentlichen.';
comment on column betrieb.werte.hinweis is 'Was einzutragen ist (aus startwerte.sql).';
comment on column betrieb.werte.wert_text is 'Texte, Telefon, E-Mail, PLZ, Adresse der Website, Umsatzsteuer (regel oder klein).';
comment on column betrieb.werte.wert_euro is 'Beträge in Euro, z. B. 129.90; der Export rechnet in Cent um.';
comment on column betrieb.werte.wert_ja_nein is 'ja oder nein: Nachtdienst, Zusagen, Leistungen je Zone.';
comment on column betrieb.werte.wert_json is 'Nur Erreichbarkeitszeiten und Tagesband, als JSON wie im Hinweis.';
comment on column betrieb.werte.ohne_wert is 'Beträge: nach Absprache. Impressumsangaben: Die Zeile entfällt.';
comment on column betrieb.werte.bestaetigt is 'Freigabe zur Veröffentlichung: Der Wert steht beim nächsten Lauf im öffentlichen Pull Request.';
comment on column betrieb.werte.notiz is 'Eigene Notiz; wird nie exportiert.';

-- Prüfung beim Speichern (Meldungen erscheinen im Table Editor). Die vollständigen Regeln stehen im Repository
-- (bau/lib/betriebswerte.mjs) und laufen bei jeder Übernahme; hier nur, was sich je Zeile prüfen lässt.
create or replace function betrieb.werte_pruefen() returns trigger
language plpgsql
set search_path = ''
as $$
declare
  hat_wert boolean;
  tag text;
  z jsonb;
begin
  if tg_op = 'UPDATE' then
    if new.schluessel <> old.schluessel then
      raise exception 'Der Schlüssel „%“ lässt sich nicht ändern.', old.schluessel;
    end if;
    if new.typ <> old.typ and (old.wert_text is not null or old.wert_euro is not null or old.wert_ja_nein is not null
        or old.wert_json is not null or old.ohne_wert) then
      raise exception '%: Der Typ lässt sich nur ändern, solange kein Wert eingetragen ist.', new.schluessel;
    end if;
  end if;

  new.wert_text := nullif(btrim(new.wert_text), '');

  -- Genau die Spalte, die zum Typ gehört
  if new.typ = 'betrag' then
    if new.wert_text is not null or new.wert_ja_nein is not null or new.wert_json is not null then
      raise exception '%: Bitte nur wert_euro ausfüllen (Betrag in Euro).', new.schluessel;
    end if;
  elsif new.typ = 'ja_nein' then
    if new.wert_text is not null or new.wert_euro is not null or new.wert_json is not null then
      raise exception '%: Bitte nur wert_ja_nein setzen.', new.schluessel;
    end if;
  elsif new.typ in ('zeiten', 'tagesband') then
    if new.wert_text is not null or new.wert_euro is not null or new.wert_ja_nein is not null then
      raise exception '%: Bitte nur wert_json ausfüllen.', new.schluessel;
    end if;
  else
    if new.wert_euro is not null or new.wert_ja_nein is not null or new.wert_json is not null then
      raise exception '%: Bitte nur wert_text ausfüllen.', new.schluessel;
    end if;
  end if;

  hat_wert := new.wert_text is not null or new.wert_euro is not null or new.wert_ja_nein is not null or new.wert_json is not null;
  if new.ohne_wert and new.typ not in ('text_oder_leer', 'betrag') then
    raise exception '%: ohne_wert gibt es nur bei Beträgen (nach Absprache) und bei Angaben, die entfallen dürfen.', new.schluessel;
  end if;
  if new.ohne_wert and hat_wert then
    raise exception '%: Entweder einen Wert eintragen oder ohne_wert setzen, nicht beides.', new.schluessel;
  end if;
  if new.bestaetigt and not hat_wert and not new.ohne_wert then
    raise exception '%: Bestätigen geht erst, wenn ein Wert eingetragen oder ohne_wert gesetzt ist.', new.schluessel;
  end if;

  if new.wert_text is not null then
    if new.wert_text ~ '[\r\n]' then
      raise exception '%: Bitte ohne Zeilenumbruch.', new.schluessel;
    end if;
    if translate(new.wert_text, '[]<>{}§⟦⟧', '') <> new.wert_text then
      raise exception '%: Die Zeichen [ ] < > { } § ⟦ ⟧ sind nicht erlaubt.', new.schluessel;
    end if;
  end if;

  case new.typ
    when 'plz' then
      if new.wert_text is not null and new.wert_text !~ '^[0-9]{5}$' then
        raise exception '%: Postleitzahl mit fünf Ziffern.', new.schluessel;
      end if;
    when 'telefon_anzeige' then
      if new.wert_text is not null and new.wert_text !~ '^(0|\+49)[0-9 /()+-]+$' then
        raise exception '%: Nummer mit 0 oder +49 am Anfang; erlaubt sind Ziffern, Leerzeichen und / - ( ) +.', new.schluessel;
      end if;
    when 'telefon_e164' then
      if new.wert_text is not null and new.wert_text !~ '^\+49[1-9][0-9]{5,12}$' then
        raise exception '%: Format +49 und 6–13 Ziffern ohne Leerzeichen, z. B. +496471123456.', new.schluessel;
      end if;
    when 'email' then
      if new.wert_text is not null and new.wert_text !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' then
        raise exception '%: Bitte eine E-Mail-Adresse eintragen.', new.schluessel;
      end if;
    when 'https_basis' then
      if new.wert_text is not null and new.wert_text !~ '^https://([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$' then
        raise exception '%: https:// und die Domain in Kleinbuchstaben, ohne Pfad und ohne Schrägstrich am Ende.', new.schluessel;
      end if;
    when 'ust_modus' then
      if new.wert_text is not null and new.wert_text not in ('regel', 'klein') then
        raise exception '%: „regel“ oder „klein“.', new.schluessel;
      end if;
    when 'betrag' then
      if new.wert_euro is not null then
        if new.schluessel like 'preise.anfahrt-%' then
          if new.wert_euro <> 0 and (new.wert_euro < 1 or new.wert_euro > 500) then
            raise exception '%: Anfahrt 0 € oder 1–500 €.', new.schluessel;
          end if;
        elsif new.wert_euro < 10 or new.wert_euro > 3000 then
          raise exception '%: Gesamtpreis 10–3000 €.', new.schluessel;
        end if;
      end if;
    when 'zeiten' then
      if new.wert_json is not null then
        if coalesce(jsonb_typeof(new.wert_json), '') <> 'object'
            or not (new.wert_json ?& array['mo', 'di', 'mi', 'do', 'fr', 'sa', 'so'])
            or (select count(*) from jsonb_object_keys(new.wert_json)) <> 7 then
          raise exception '%: Objekt mit genau den Tagen mo, di, mi, do, fr, sa, so, z. B. {"mo": [["08:00", "18:00"]], …, "so": []}.', new.schluessel;
        end if;
        for tag in select jsonb_object_keys(new.wert_json) loop
          if coalesce(jsonb_typeof(new.wert_json -> tag), '') <> 'array' or jsonb_array_length(new.wert_json -> tag) > 3 then
            raise exception '%: Tag „%“ braucht eine Liste mit höchstens drei Zeiträumen.', new.schluessel, tag;
          end if;
          for z in select jsonb_array_elements(new.wert_json -> tag) loop
            if coalesce(jsonb_typeof(z), '') <> 'array' or jsonb_array_length(z) <> 2
                or coalesce(z ->> 0, '') !~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'
                or coalesce(z ->> 1, '') !~ '^(([01][0-9]|2[0-3]):[0-5][0-9]|24:00)$'
                or (z ->> 0) >= (z ->> 1) then
              raise exception '%: Tag „%“: Zeitraum % ist kein [„HH:MM“, „HH:MM“] mit Ende nach Beginn.', new.schluessel, tag, z;
            end if;
          end loop;
        end loop;
      end if;
    when 'tagesband' then
      if new.wert_json is not null and (coalesce(jsonb_typeof(new.wert_json), '') <> 'object'
          or coalesce(jsonb_typeof(new.wert_json -> 'werktags'), '') <> 'array'
          or coalesce(jsonb_typeof(new.wert_json -> 'wochenende'), '') <> 'array') then
        raise exception '%: Objekt mit den Listen werktags und wochenende, z. B. {"werktags": [["nacht", "00:00", "07:00"], …], "wochenende": [["wochenende", "00:00", "24:00"]]}.', new.schluessel;
      end if;
    else
      null;
  end case;

  if tg_op = 'INSERT' then
    new.geaendert_am := now();
  elsif (new.wert_text, new.wert_euro, new.wert_ja_nein, new.wert_json, new.ohne_wert, new.bestaetigt)
      is distinct from (old.wert_text, old.wert_euro, old.wert_ja_nein, old.wert_json, old.ohne_wert, old.bestaetigt) then
    new.geaendert_am := now();
  end if;
  return new;
end $$;
revoke all on function betrieb.werte_pruefen() from public;
create or replace trigger werte_pruefen before insert or update on betrieb.werte
  for each row execute function betrieb.werte_pruefen();

-- 6. Export nur bestätigter Werte als JSON (Beträge in Cent, ohne_wert = null). security_invoker: Die Sicht prüft die
--    Rechte und RLS-Regeln der abfragenden Rolle.
create or replace view betrieb.freigegeben with (security_invoker = true) as
select
  schluessel,
  typ,
  geaendert_am,
  case
    when ohne_wert then 'null'::jsonb
    when typ = 'ja_nein' then to_jsonb(wert_ja_nein)
    when typ = 'betrag' then to_jsonb((wert_euro * 100)::integer)
    when typ in ('zeiten', 'tagesband') then wert_json
    else to_jsonb(wert_text)
  end as wert
from betrieb.werte
where bestaetigt;
revoke all on betrieb.freigegeben from public;

-- 7. Rolle sd_export für den Workflow: nur lesen (bestätigte Werte), nur das Lebenszeichen schreiben (über die
--    Funktion, mit BEGIN READ WRITE). Kein Passwort hier – siehe docs/BETRIEB.md.
do $$
begin
  if not exists (select from pg_roles where rolname = 'sd_export') then
    create role sd_export login noinherit;
  end if;
end $$;
alter role sd_export connection limit 3;
alter role sd_export set default_transaction_read_only = on;
alter role sd_export set statement_timeout = '15s';
alter role sd_export set idle_in_transaction_session_timeout = '30s';
grant usage on schema betrieb to sd_export;
grant select (schluessel, typ, wert_text, wert_euro, wert_ja_nein, wert_json, ohne_wert, bestaetigt, geaendert_am)
  on betrieb.werte to sd_export;
grant select on betrieb.freigegeben to sd_export;
do $$
begin
  if exists (select from pg_policies where schemaname = 'betrieb' and tablename = 'werte' and policyname = 'nur_bestaetigte') then
    alter policy nur_bestaetigte on betrieb.werte to sd_export using (bestaetigt);
  else
    create policy nur_bestaetigte on betrieb.werte for select to sd_export using (bestaetigt);
  end if;
end $$;
grant usage on schema intern to sd_export;
grant execute on function intern.lebenszeichen_setzen(text, jsonb) to sd_export;

-- 8. Vorhandene Tabellen in public, intern und betrieb ohne RLS nachziehen (für Tabellen vor dem Event-Trigger).
do $$
declare
  t record;
begin
  for t in
    select n.nspname, c.relname
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where c.relkind in ('r', 'p') and n.nspname in ('public', 'intern', 'betrieb') and not c.relrowsecurity
  loop
    execute format('alter table %I.%I enable row level security', t.nspname, t.relname);
  end loop;
end $$;
