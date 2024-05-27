drop function if exists "public"."search_users_by_username_prefix"(prefix character varying);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.search_users_by_username_prefix(prefix text)
 RETURNS SETOF users
 LANGUAGE plpgsql
AS $function$
begin
  return query
  select * from users 
  where to_tsvector(username) @@ to_tsquery(prefix || ':*')
  limit 20;
end;
$function$
;


