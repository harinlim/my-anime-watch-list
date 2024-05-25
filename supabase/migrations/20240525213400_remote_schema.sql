drop policy "Enable update for permitted users" on "public"."watchlists";

create policy "Enable update for permitted users"
on "public"."watchlists"
as permissive
for update
to public
using (((( SELECT auth.uid() AS uid) = user_id) OR has_edit_access_to_watchlist(( SELECT auth.uid() AS uid), id)));



