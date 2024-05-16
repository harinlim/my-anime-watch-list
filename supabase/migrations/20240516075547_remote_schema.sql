drop policy "Enable read access for all users" on "public"."watchlists_users";

alter table "public"."users" alter column "email" set not null;

create policy "Enable update for all users"
on "public"."anime"
as permissive
for update
to public
using (true);


create policy "Enable read access for all users"
on "public"."watchlists_users"
as permissive
for select
to public
using ((has_watchlist(( SELECT auth.uid() AS uid), watchlist_id) OR (watchlist_id IN ( SELECT watchlists.id
   FROM watchlists
  WHERE (watchlists.is_public = true)))));



