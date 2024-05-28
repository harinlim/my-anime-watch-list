set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.has_watchlist_batch(_user_ids uuid[], _watchlist_id bigint)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
SELECT EXISTS (
  SELECT 1
  FROM (
      SELECT UNNEST(_user_ids) AS user_id
    ) AS user_array
    LEFT JOIN watchlists_users wu ON user_array.user_id = wu.user_id
    WHERE wu.watchlist_id = _watchlist_id
    HAVING COUNT(user_array.user_id) = ARRAY_LENGTH(_user_ids, 1)
  );
$function$
;


