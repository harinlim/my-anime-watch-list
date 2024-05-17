drop policy "Enable insert for watchlist editors" on "public"."watchlists_users";

alter table "public"."watchlists" add column "search_vector" tsvector generated always as (((setweight(to_tsvector('simple'::regconfig, COALESCE(title, ''::text)), 'A'::"char") || ''::tsvector) || setweight(to_tsvector('simple'::regconfig, COALESCE(description, ''::text)), 'B'::"char"))) stored;

CREATE INDEX idx_watchlist_search_vector ON public.watchlists USING gin (search_vector);

create policy "Enable insert for watchlist editors and owners"
on "public"."watchlists_users"
as permissive
for insert
to public
with check (has_edit_access_to_watchlist(( SELECT auth.uid() AS uid), watchlist_id));


create policy "Enable update access for watchlist editors and owners"
on "public"."watchlists_users"
as permissive
for update
to public
using (((role <> 'owner'::collaborator_access) AND has_edit_access_to_watchlist(( SELECT auth.uid() AS uid), watchlist_id)));



