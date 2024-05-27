drop function if exists "public"."search_users"(prefix text, excluded_watchlist_id bigint);

drop function if exists "public"."search_users"(prefix text, excluded_watchlist_id bigint, querying_user_id uuid);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.search_users(prefix text, exclude_watchlist_id bigint)
 RETURNS TABLE(id uuid, username character varying, avatar_url text, rank double precision)
 LANGUAGE plpgsql
AS $function$
begin
  return query
    select * from search_users(prefix, exclude_watchlist_id, null);
end;
$function$
;

CREATE OR REPLACE FUNCTION public.search_users(prefix text, exclude_watchlist_id bigint, querying_user_id uuid)
 RETURNS TABLE(id uuid, username character varying, avatar_url text, rank double precision)
 LANGUAGE plpgsql
AS $function$
declare
  exists_prefix boolean := (prefix <> '') is true; -- prefix is not null or empty string
  ts_prefix_query tsquery := '';
  self_uid uuid := querying_user_id;
begin
  if exists_prefix then
    ts_prefix_query := to_tsquery('simple', prefix || ':*');
  end if;

  if querying_user_id is not null then
    -- Disallow access to privileged response via API / RPC
    if (select auth.role() in ('anon', 'authenticated')) then
      raise exception 'Attempted to access privileged function, uid (%)', (select auth.uid());
    end if;
    -- raise log 'search_users self_uid is null, using (%)' , (select auth.uid());
  else
    self_uid := (select auth.uid());
  end if;

  -- if non authenticated request, provide general result
  if self_uid is null then
    return query
    with users_excluding_watchlist as (
      select * 
      from users
      where exclude_watchlist_id is null or users.id not in (
        select user_id 
        from watchlists_users
        where watchlist_id = exclude_watchlist_id
      )
    )
    select
      u.id,
      u.username,
      u.avatar_url,
      (case when exists_prefix 
        then ts_rank(to_tsvector('simple', u.username), ts_prefix_query)
        else 1.0
      end) * 1.0 as adjusted_rank
    from users_excluding_watchlist as u
    where not exists_prefix or to_tsvector(u.username) @@ ts_prefix_query
    order by
      adjusted_rank desc,
      length(u.username),
      u.username
    limit 20;
  end if;

  -- otherwise, provide user-specific result including relationships
  return query
  with users_excluding_watchlist as (
    select * 
    from users
    where exclude_watchlist_id is null or users.id not in (
      select user_id 
      from watchlists_users
      where watchlist_id = exclude_watchlist_id
    )
  ), 
  full_user_relationships as (
    select
      user1 as user_id,
      shared_watchlist_count
    from user_relationships
    where user2 = self_uid
    union
    select
      user2 as user_id,
      shared_watchlist_count
    from user_relationships
    where user1 = self_uid
  )

  select
    u.id,
    u.username,
    u.avatar_url,
    (case when exists_prefix 
      then ts_rank(to_tsvector('simple', u.username), ts_prefix_query)
      else 1.0
     end) * (1 + COALESCE(full_user_relationships.shared_watchlist_count, 0)) AS adjusted_rank
  from users_excluding_watchlist as u
  left join full_user_relationships on u.id = full_user_relationships.user_id
  where not exists_prefix or to_tsvector(u.username) @@ ts_prefix_query
  order by
    adjusted_rank desc,
    length(u.username),
    u.username
  limit 20;
end;
$function$
;


