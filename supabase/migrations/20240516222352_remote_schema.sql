drop policy "Enable read access for all users" on "public"."watchlists_users";

CREATE UNIQUE INDEX watchlists_users_unique_owners_idx ON public.watchlists_users USING btree (watchlist_id) WHERE (role = 'owner'::collaborator_access);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.has_edit_access_to_watchlist(_user_id uuid, _watchlist_id bigint)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
SELECT EXISTS (
  SELECT 1
  FROM watchlists_users
  WHERE user_id = _user_id
  AND watchlist_id = _watchlist_id
  AND (role = 'owner'::collaborator_access OR role = 'editor'::collaborator_access)
);
$function$
;

CREATE OR REPLACE FUNCTION public.is_watchlist_viewer(_user_id uuid, _watchlist_id bigint)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
SELECT EXISTS (
  SELECT 1
  FROM watchlists_users
  WHERE user_id = _user_id
  AND watchlist_id = _watchlist_id
  AND role = 'viewer'::collaborator_access
);
$function$
;

CREATE OR REPLACE FUNCTION public.has_watchlist(_user_id uuid, _watchlist_id bigint)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
AS $function$SELECT EXISTS (
  SELECT 1
  FROM watchlists_users
  WHERE user_id = _user_id
  AND watchlist_id = _watchlist_id
);$function$
;

create policy "Enable delete for watchlist owners and self"
on "public"."watchlists_users"
as permissive
for delete
to public
using (((watchlist_id IN ( SELECT watchlists_users_1.watchlist_id
   FROM watchlists_users watchlists_users_1
  WHERE ((watchlists_users_1.user_id = ( SELECT auth.uid() AS uid)) AND (watchlists_users_1.role = 'owner'::collaborator_access)))) OR (user_id = ( SELECT auth.uid() AS uid))));


create policy "Enable insert for watchlist editors"
on "public"."watchlists_users"
as permissive
for insert
to public
with check (has_edit_access_to_watchlist(( SELECT auth.uid() AS uid), watchlist_id));


create policy "Enable read access for public watchlists or permitted users"
on "public"."watchlists_users"
as permissive
for select
to public
using (((has_watchlist(( SELECT auth.uid() AS uid), watchlist_id) AND (has_edit_access_to_watchlist(( SELECT auth.uid() AS uid), watchlist_id) OR (role <> 'viewer'::collaborator_access) OR (user_id = ( SELECT auth.uid() AS uid)))) OR ((watchlist_id IN ( SELECT watchlists.id
   FROM watchlists
  WHERE (watchlists.is_public = true))) AND (role <> 'viewer'::collaborator_access))));



