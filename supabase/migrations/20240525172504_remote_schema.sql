set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_default_owner()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.watchlists_users (watchlist_id, user_id, role)
  values (new.id, new.user_id, 'owner');
  return new;
end;
$function$
;


