drop function if exists "public"."search_users_by_username_prefix"(prefix text);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.search_users(prefix text)
 RETURNS TABLE(id uuid, username character varying, avatar_url text, rank double precision)
 LANGUAGE plpgsql
AS $function$begin
  return query
    select * from search_users_by_adjusted_rank(prefix, null, null);
end;$function$
;

CREATE OR REPLACE FUNCTION public.search_users(prefix text, excluded_watchlist_id bigint)
 RETURNS TABLE(id uuid, username character varying, avatar_url text, rank double precision)
 LANGUAGE plpgsql
AS $function$begin
  return query
    select * from search_users_by_adjusted_rank(prefix, excluded_watchlist_id, null);
end;$function$
;

CREATE OR REPLACE FUNCTION public.search_users(prefix text, excluded_watchlist_id bigint, querying_user_id uuid)
 RETURNS TABLE(id uuid, username character varying, avatar_url text, rank double precision)
 LANGUAGE plpgsql
AS $function$declare
  exists_prefix boolean := (prefix <> '') is true; -- prefix is not null or empty string
  ts_prefix_query tsquery := '';
begin
  if exists_prefix then
    ts_prefix_query := to_tsquery('simple', prefix || ':*');
  end if;

  return query
  with users_excluding_watchlist as (
    select * 
    from users
    where excluded_watchlist_id is null or users.id not in (
      select user_id 
      from watchlists_users
      where watchlist_id = excluded_watchlist_id
    )
  ), 
  full_user_relationships as (
    select
      user1 as user_id,
      shared_watchlist_count
    from user_relationships
    where user2 = querying_user_id
    union
    select
      user2 as user_id,
      shared_watchlist_count
    from user_relationships
    where user1 = querying_user_id
  )

  select
    u.id,
    u.username,
    u.avatar_url,
    (1 + ts_rank(to_tsvector('simple', u.username), ts_prefix_query)) * (1 + COALESCE(full_user_relationships.shared_watchlist_count, 0)) AS adjusted_rank
  from users_excluding_watchlist as u
  left join full_user_relationships on u.id = full_user_relationships.user_id
  where not exists_prefix or to_tsvector(u.username) @@ ts_prefix_query
  order by
    adjusted_rank desc,
    length(u.username),
    u.username
  limit 20;
end;$function$
;

CREATE OR REPLACE FUNCTION public.search_users(prefix text, querying_user_id uuid)
 RETURNS TABLE(id uuid, username character varying, avatar_url text, rank double precision)
 LANGUAGE plpgsql
AS $function$begin
  return query
    select * from search_users_by_adjusted_rank(prefix, null, querying_user_id);
end;$function$
;


