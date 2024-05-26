set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.search_users_by_username_prefix(prefix character varying)
 RETURNS SETOF users
 LANGUAGE plpgsql
AS $function$
begin
  RETURN QUERY 
  select * from users where to_tsvector(username) @@ to_tsquery(prefix || ':*');
end;
$function$
;