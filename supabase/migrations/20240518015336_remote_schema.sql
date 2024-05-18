set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.emit_update_watchlist()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  _id int;
begin
  case TG_OP
    when 'INSERT', 'UPDATE' then
        _id := NEW.watchlist_id;
    when 'DELETE' then
        _id := OLD.watchlist_id;
  end case;

  update watchlists 
  set updated_at = now()
  where id = _id;

  return null;
end;
$function$
;

CREATE TRIGGER after_watchlist_anime_update AFTER INSERT OR DELETE OR UPDATE ON public.watchlists_anime FOR EACH ROW EXECUTE FUNCTION emit_update_watchlist();


