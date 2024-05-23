set check_function_bodies = off;

CREATE OR REPLACE FUNCTION auth.update_user_via_public()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare 
  fields_match boolean;
  user_exists boolean;
  new_email jsonb := to_jsonb2(new.email);
  new_username jsonb := to_jsonb2(new.username);
  new_avatar_url_jsonb jsonb := to_jsonb2(new.avatar_url);
begin
  user_exists := (select exists (
    select 1 from auth.users
    where id = new.id
  ));

  fields_match := (select exists (
    select 1 from auth.users
    where id = new.id
      and raw_user_meta_data->'email' = new_email
      and raw_user_meta_data->'username' = new_username
      and raw_user_meta_data->'avatar_url' = new_avatar_url_jsonb
  ));

  if user_exists and not fields_match then 
    update auth.users
    set 
      email = new.email, -- Keep this as text, but rest must be set as jsonb
      raw_user_meta_data = jsonb_set( 
        jsonb_set( 
          jsonb_set( 
            raw_user_meta_data, 
            '{email}' , new_email , true 
          ), 
          '{username}' , new_username , true 
        ), 
        '{avatar_url}' , new_avatar_url_jsonb , true 
      )
    WHERE id = new.id;
  end if;
  
  return new;
end;
$function$
;


set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.to_json2(anyelement)
 RETURNS json
 LANGUAGE sql
AS $function$
SELECT COALESCE(to_json($1), json 'null')
$function$
;

CREATE OR REPLACE FUNCTION public.to_jsonb2(anyelement)
 RETURNS jsonb
 LANGUAGE sql
AS $function$
SELECT COALESCE(to_jsonb($1), jsonb 'null')
$function$
;

CREATE OR REPLACE FUNCTION public.update_user_via_auth()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$

declare 
  fields_match boolean;
  user_exists boolean;
  new_email text := new.raw_user_meta_data->>'email';
  new_username text := new.raw_user_meta_data->>'username';
  new_avatar_url text;

begin
  if new.raw_user_meta_data->'avatar_url' = 'null'::jsonb then
    new_avatar_url := null;
  else
    new_avatar_url := new.raw_user_meta_data->>'avatar_url';
  end if;

  user_exists := (select exists (
    select 1 from public.users
    where id = new.id
  ));

  fields_match := (select exists (
    select 1 from public.users
    where id = new.id
      and email = new_email
      and username = new_username
      and avatar_url = new_avatar_url
  ));
  
  if user_exists and not fields_match then 
    update public.users
    set 
      email = new_email,
      username = new_username,
      avatar_url = new_avatar_url
    where id = new.id;
  end if;
  return new;
end;
$function$
;

CREATE TRIGGER on_public_user_update AFTER UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION auth.update_user_via_public();


