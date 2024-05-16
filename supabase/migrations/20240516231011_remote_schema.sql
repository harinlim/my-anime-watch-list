drop policy "Enable delete for watchlist owners and self" on "public"."watchlists_users";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.has_owner_access_to_watchlist(_user_id uuid, _watchlist_id bigint)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
SELECT EXISTS (
  SELECT 1
  FROM watchlists_users
  WHERE user_id = _user_id
  AND watchlist_id = _watchlist_id
  AND role = 'owner'::collaborator_access
);
$function$
;

create policy "Enable delete for watchlist owners and self"
on "public"."watchlists_users"
as permissive
for delete
to public
using ((has_owner_access_to_watchlist(( SELECT auth.uid() AS uid), watchlist_id) OR (user_id = ( SELECT auth.uid() AS uid))));



