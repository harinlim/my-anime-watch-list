
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "moddatetime" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_jsonschema" WITH SCHEMA "public";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."collaborator_access" AS ENUM (
    'owner',
    'editor',
    'viewer'
);

ALTER TYPE "public"."collaborator_access" OWNER TO "postgres";

CREATE TYPE "public"."watch_status" AS ENUM (
    'planned',
    'watching',
    'completed',
    'dropped'
);

ALTER TYPE "public"."watch_status" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."add_default_owner"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into public.watchlists_users (watchlist_id, user_id, role)
  values (new.id, new.user_id, 'owner');
  return new;
end;
$$;

ALTER FUNCTION "public"."add_default_owner"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."emit_update_watchlist"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
  _id int;
begin
  case TG_OP
    when 'INSERT', 'UPDATE' then
        _id := NEW.watchlist_id;
    when 'DELETE' then
        _id := OLD.watchlist_id;
  end case;

  update watchlists 
  set updated_at = now()
  where id = _id;

  return null;
end;
$$;

ALTER FUNCTION "public"."emit_update_watchlist"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into public.users (id, email, username)
  values (new.id, new.email, new.raw_user_meta_data->>'username');

  return new;
end;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."has_edit_access_to_watchlist"("_user_id" "uuid", "_watchlist_id" bigint) RETURNS boolean
    LANGUAGE "sql" SECURITY DEFINER
    AS $$
SELECT EXISTS (
  SELECT 1
  FROM watchlists_users
  WHERE user_id = _user_id
  AND watchlist_id = _watchlist_id
  AND (role = 'owner'::collaborator_access OR role = 'editor'::collaborator_access)
);
$$;

ALTER FUNCTION "public"."has_edit_access_to_watchlist"("_user_id" "uuid", "_watchlist_id" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."has_owner_access_to_watchlist"("_user_id" "uuid", "_watchlist_id" bigint) RETURNS boolean
    LANGUAGE "sql" SECURITY DEFINER
    AS $$
SELECT EXISTS (
  SELECT 1
  FROM watchlists_users
  WHERE user_id = _user_id
  AND watchlist_id = _watchlist_id
  AND role = 'owner'::collaborator_access
);
$$;

ALTER FUNCTION "public"."has_owner_access_to_watchlist"("_user_id" "uuid", "_watchlist_id" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."has_watchlist"("_user_id" "uuid", "_watchlist_id" bigint) RETURNS boolean
    LANGUAGE "sql" SECURITY DEFINER
    AS $$SELECT EXISTS (
  SELECT 1
  FROM watchlists_users
  WHERE user_id = _user_id
  AND watchlist_id = _watchlist_id
);$$;

ALTER FUNCTION "public"."has_watchlist"("_user_id" "uuid", "_watchlist_id" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."is_watchlist_viewer"("_user_id" "uuid", "_watchlist_id" bigint) RETURNS boolean
    LANGUAGE "sql" SECURITY DEFINER
    AS $$
SELECT EXISTS (
  SELECT 1
  FROM watchlists_users
  WHERE user_id = _user_id
  AND watchlist_id = _watchlist_id
  AND role = 'viewer'::collaborator_access
);
$$;

ALTER FUNCTION "public"."is_watchlist_viewer"("_user_id" "uuid", "_watchlist_id" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."search_users"("prefix" "text") RETURNS TABLE("id" "uuid", "username" character varying, "avatar_url" "text", "rank" double precision)
    LANGUAGE "plpgsql"
    AS $$
begin
  return query
    select * from search_users(prefix, null, null);
end;
$$;

ALTER FUNCTION "public"."search_users"("prefix" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."search_users"("prefix" "text", "exclude_watchlist_id" bigint) RETURNS TABLE("id" "uuid", "username" character varying, "avatar_url" "text", "rank" double precision)
    LANGUAGE "plpgsql"
    AS $$
begin
  return query
    select * from search_users(prefix, exclude_watchlist_id, null);
end;
$$;

ALTER FUNCTION "public"."search_users"("prefix" "text", "exclude_watchlist_id" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."search_users"("prefix" "text", "querying_user_id" "uuid") RETURNS TABLE("id" "uuid", "username" character varying, "avatar_url" "text", "rank" double precision)
    LANGUAGE "plpgsql"
    AS $$
begin
  return query
    select * from search_users(prefix, null, querying_user_id);
end;
$$;

ALTER FUNCTION "public"."search_users"("prefix" "text", "querying_user_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."search_users"("prefix" "text", "exclude_watchlist_id" bigint, "querying_user_id" "uuid") RETURNS TABLE("id" "uuid", "username" character varying, "avatar_url" "text", "rank" double precision)
    LANGUAGE "plpgsql"
    AS $$
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

  else
  
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

  end if;

end;
$$;

ALTER FUNCTION "public"."search_users"("prefix" "text", "exclude_watchlist_id" bigint, "querying_user_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."to_json2"("anyelement") RETURNS "json"
    LANGUAGE "sql"
    AS $_$
SELECT COALESCE(to_json($1), json 'null')
$_$;

ALTER FUNCTION "public"."to_json2"("anyelement") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."to_jsonb2"("anyelement") RETURNS "jsonb"
    LANGUAGE "sql"
    AS $_$
SELECT COALESCE(to_jsonb($1), jsonb 'null')
$_$;

ALTER FUNCTION "public"."to_jsonb2"("anyelement") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."to_jsonb2"("anyelement" "text") RETURNS "jsonb"
    LANGUAGE "sql"
    AS $$
SELECT COALESCE(to_jsonb(anyelement), jsonb 'null')
$$;

ALTER FUNCTION "public"."to_jsonb2"("anyelement" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_user_via_auth"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$

declare 
  fields_match boolean;
  user_exists boolean;
  new_email text := new.email;
  new_username text := new.raw_user_meta_data->>'username';
  new_avatar_url text;

begin
  if new.raw_user_meta_data->'avatar_url' = 'null'::jsonb then
    new_avatar_url := null;
  else
    new_avatar_url := new.raw_user_meta_data->>'avatar_url';
  end if;

  user_exists := (select exists (
    select 1 from public.users
    where id = new.id
  ));

  fields_match := (select exists (
    select 1 from public.users
    where id = new.id
      and email = new_email
      and username = new_username
      and avatar_url = new_avatar_url
  ));
  
  if user_exists and not fields_match then 
    update public.users
    set 
      email = new_email,
      username = new_username,
      avatar_url = new_avatar_url
    where id = new.id;
  end if;
  return new;
end;
$$;

ALTER FUNCTION "public"."update_user_via_auth"() OWNER TO "postgres";

CREATE TEXT SEARCH DICTIONARY "public"."english_stem_nostop" (
    TEMPLATE = "pg_catalog"."snowball",
    language = 'english' );

ALTER TEXT SEARCH DICTIONARY "public"."english_stem_nostop" OWNER TO "postgres";

CREATE TEXT SEARCH CONFIGURATION "public"."english_nostop" (
    PARSER = "pg_catalog"."default" );

ALTER TEXT SEARCH CONFIGURATION "public"."english_nostop"
    ADD MAPPING FOR "asciiword" WITH "public"."english_stem_nostop";

ALTER TEXT SEARCH CONFIGURATION "public"."english_nostop"
    ADD MAPPING FOR "word" WITH "public"."english_stem_nostop";

ALTER TEXT SEARCH CONFIGURATION "public"."english_nostop"
    ADD MAPPING FOR "numword" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."english_nostop"
    ADD MAPPING FOR "email" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."english_nostop"
    ADD MAPPING FOR "url" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."english_nostop"
    ADD MAPPING FOR "host" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."english_nostop"
    ADD MAPPING FOR "sfloat" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."english_nostop"
    ADD MAPPING FOR "version" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."english_nostop"
    ADD MAPPING FOR "hword_numpart" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."english_nostop"
    ADD MAPPING FOR "hword_part" WITH "public"."english_stem_nostop";

ALTER TEXT SEARCH CONFIGURATION "public"."english_nostop"
    ADD MAPPING FOR "hword_asciipart" WITH "public"."english_stem_nostop";

ALTER TEXT SEARCH CONFIGURATION "public"."english_nostop"
    ADD MAPPING FOR "numhword" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."english_nostop"
    ADD MAPPING FOR "asciihword" WITH "public"."english_stem_nostop";

ALTER TEXT SEARCH CONFIGURATION "public"."english_nostop"
    ADD MAPPING FOR "hword" WITH "public"."english_stem_nostop";

ALTER TEXT SEARCH CONFIGURATION "public"."english_nostop"
    ADD MAPPING FOR "url_path" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."english_nostop"
    ADD MAPPING FOR "file" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."english_nostop"
    ADD MAPPING FOR "float" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."english_nostop"
    ADD MAPPING FOR "int" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."english_nostop"
    ADD MAPPING FOR "uint" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."english_nostop" OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."anime" (
    "kitsu_id" "text" NOT NULL,
    "title" "text" NOT NULL,
    "synopsis" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "poster_image" "jsonb",
    CONSTRAINT "check_poster_image_json" CHECK ("public"."jsonb_matches_schema"("schema" => '{
      "type": "object",
      "properties": {
        "tiny": { "type": "string" },
        "small": { "type": "string" },
        "medium": { "type": "string" },
        "large": { "type": "string" },
        "original": { "type": "string" },
        "meta": {
          "type": "object",
          "properties": {
            "dimensions": {
              "type": "object",
              "properties": {
                "tiny": {
                  "type": "object",
                  "properties": {
                    "width": { "type": "number" },
                    "height": { "type": "number" }
                  },
                  "required": ["width", "height"]
                },
                "small": {
                  "type": "object",
                  "properties": {
                    "width": { "type": "number" },
                    "height": { "type": "number" }
                  },
                  "required": ["width", "height"]
                },
                "medium": {
                  "type": "object",
                  "properties": {
                    "width": { "type": "number" },
                    "height": { "type": "number" }
                  },
                  "required": ["width", "height"]
                },
                "large": {
                  "type": "object",
                  "properties": {
                    "width": { "type": "number" },
                    "height": { "type": "number" }
                  },
                  "required": ["width", "height"]
                }
              }
            }
          }
        }
      },
      "additionalProperties": false
    }'::"json", "instance" => "poster_image"))
);

ALTER TABLE "public"."anime" OWNER TO "postgres";

COMMENT ON TABLE "public"."anime" IS 'simplified kitsu proxy';

COMMENT ON COLUMN "public"."anime"."poster_image" IS 'kitsu poster images';

CREATE TABLE IF NOT EXISTS "public"."watchlists_users" (
    "watchlist_id" bigint NOT NULL,
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "role" "public"."collaborator_access" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."watchlists_users" OWNER TO "postgres";

COMMENT ON TABLE "public"."watchlists_users" IS 'collaborators on watchlists';

CREATE OR REPLACE VIEW "public"."user_relationships" WITH ("security_invoker"='on') AS
 SELECT "wu1"."user_id" AS "user1",
    "wu2"."user_id" AS "user2",
    "count"(*) AS "shared_watchlist_count"
   FROM ("public"."watchlists_users" "wu1"
     JOIN "public"."watchlists_users" "wu2" ON (("wu1"."watchlist_id" = "wu2"."watchlist_id")))
  WHERE ("wu1"."user_id" < "wu2"."user_id")
  GROUP BY "wu1"."user_id", "wu2"."user_id"
  ORDER BY ("count"(*)) DESC;

ALTER TABLE "public"."user_relationships" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."user_reviews" (
    "anime_id" character varying NOT NULL,
    "user_id" "uuid" NOT NULL,
    "rating" smallint,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "status" "public"."watch_status" DEFAULT 'planned'::"public"."watch_status",
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "review_text" "text",
    CONSTRAINT "user_reviews_rating_check" CHECK (("rating" <= 10)),
    CONSTRAINT "user_reviews_rating_min_check" CHECK (("rating" >= 0))
);

ALTER TABLE "public"."user_reviews" OWNER TO "postgres";

COMMENT ON TABLE "public"."user_reviews" IS 'user reviews of anime';

CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "username" character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "avatar_url" "text",
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "email" "text" NOT NULL,
    CONSTRAINT "users_username_check" CHECK (("length"(("username")::"text") >= 3)),
    CONSTRAINT "users_username_length" CHECK (("char_length"(("username")::"text") <= 50))
);

ALTER TABLE "public"."users" OWNER TO "postgres";

COMMENT ON TABLE "public"."users" IS 'public user profiles';

CREATE TABLE IF NOT EXISTS "public"."watchlists" (
    "id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "is_public" boolean DEFAULT false NOT NULL,
    "description" "text",
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "search_vector" "tsvector" GENERATED ALWAYS AS ((("setweight"("to_tsvector"('"simple"'::"regconfig", COALESCE("title", ''::"text")), 'A'::"char") || ''::"tsvector") || "setweight"("to_tsvector"('"simple"'::"regconfig", COALESCE("description", ''::"text")), 'B'::"char"))) STORED
);

ALTER TABLE "public"."watchlists" OWNER TO "postgres";

COMMENT ON TABLE "public"."watchlists" IS 'user anime watchlists';

CREATE TABLE IF NOT EXISTS "public"."watchlists_anime" (
    "watchlist_id" bigint NOT NULL,
    "anime_id" character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."watchlists_anime" OWNER TO "postgres";

COMMENT ON TABLE "public"."watchlists_anime" IS 'anime added to watchlists';

ALTER TABLE "public"."watchlists" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."watchlists_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE "public"."watchlists_users" ALTER COLUMN "watchlist_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."watchlists_users_watchlist_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY "public"."anime"
    ADD CONSTRAINT "anime_pkey" PRIMARY KEY ("kitsu_id");

ALTER TABLE ONLY "public"."user_reviews"
    ADD CONSTRAINT "user_reviews_pkey" PRIMARY KEY ("anime_id", "user_id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_username_key" UNIQUE ("username");

ALTER TABLE ONLY "public"."watchlists_anime"
    ADD CONSTRAINT "watchlists_anime_pkey" PRIMARY KEY ("watchlist_id", "anime_id");

ALTER TABLE ONLY "public"."watchlists"
    ADD CONSTRAINT "watchlists_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."watchlists_users"
    ADD CONSTRAINT "watchlists_users_pkey" PRIMARY KEY ("watchlist_id", "user_id");

CREATE INDEX "idx_watchlist_search_vector" ON "public"."watchlists" USING "gin" ("search_vector");

CREATE INDEX "user_reviews_user_id_idx" ON "public"."user_reviews" USING "btree" ("user_id");

CREATE INDEX "watchlists_anime_anime_id_idx" ON "public"."watchlists_anime" USING "btree" ("anime_id");

CREATE INDEX "watchlists_anime_watchlist_id_idx" ON "public"."watchlists_anime" USING "btree" ("watchlist_id");

CREATE INDEX "watchlists_user_id_idx" ON "public"."watchlists" USING "btree" ("user_id");

CREATE UNIQUE INDEX "watchlists_users_unique_owners_idx" ON "public"."watchlists_users" USING "btree" ("watchlist_id") WHERE ("role" = 'owner'::"public"."collaborator_access");

CREATE OR REPLACE TRIGGER "after_watchlist_anime_update" AFTER INSERT OR DELETE OR UPDATE ON "public"."watchlists_anime" FOR EACH ROW EXECUTE FUNCTION "public"."emit_update_watchlist"();

CREATE OR REPLACE TRIGGER "handle_add_default_owner" AFTER INSERT ON "public"."watchlists" FOR EACH ROW EXECUTE FUNCTION "public"."add_default_owner"();

CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."user_reviews" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."watchlists" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

CREATE OR REPLACE TRIGGER "on_public_user_update" AFTER UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "auth"."update_user_via_public"();

ALTER TABLE ONLY "public"."user_reviews"
    ADD CONSTRAINT "user_reviews_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "public"."anime"("kitsu_id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user_reviews"
    ADD CONSTRAINT "user_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL;

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."watchlists_anime"
    ADD CONSTRAINT "watchlists_anime_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "public"."anime"("kitsu_id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."watchlists_anime"
    ADD CONSTRAINT "watchlists_anime_watchlist_id_fkey" FOREIGN KEY ("watchlist_id") REFERENCES "public"."watchlists"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."watchlists"
    ADD CONSTRAINT "watchlists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");

ALTER TABLE ONLY "public"."watchlists_users"
    ADD CONSTRAINT "watchlists_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."watchlists_users"
    ADD CONSTRAINT "watchlists_users_watchlist_id_fkey" FOREIGN KEY ("watchlist_id") REFERENCES "public"."watchlists"("id") ON DELETE CASCADE;

CREATE POLICY "Enable delete for permitted users" ON "public"."watchlists_anime" FOR DELETE USING (("watchlist_id" IN ( SELECT "watchlists"."id"
   FROM "public"."watchlists",
    "public"."watchlists_users"
  WHERE (("watchlists"."user_id" = ( SELECT "auth"."uid"() AS "uid")) OR (("watchlists_users"."watchlist_id" = "watchlists"."id") AND ("watchlists_users"."user_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("watchlists_users"."role" = ANY (ARRAY['owner'::"public"."collaborator_access", 'editor'::"public"."collaborator_access"])))))));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."user_reviews" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."watchlists" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Enable delete for watchlist owners and self" ON "public"."watchlists_users" FOR DELETE USING (("public"."has_owner_access_to_watchlist"(( SELECT "auth"."uid"() AS "uid"), "watchlist_id") OR ("user_id" = ( SELECT "auth"."uid"() AS "uid"))));

CREATE POLICY "Enable insert access for all users" ON "public"."anime" FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert for permitted users only" ON "public"."watchlists_anime" FOR INSERT TO "authenticated" WITH CHECK (("watchlist_id" IN ( SELECT "watchlists"."id"
   FROM "public"."watchlists",
    "public"."watchlists_users"
  WHERE (("watchlists"."user_id" = ( SELECT "auth"."uid"() AS "uid")) OR (("watchlists_users"."watchlist_id" = "watchlists"."id") AND ("watchlists_users"."user_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("watchlists_users"."role" = ANY (ARRAY['owner'::"public"."collaborator_access", 'editor'::"public"."collaborator_access"])))))));

CREATE POLICY "Enable insert for users based on user_id" ON "public"."user_reviews" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Enable insert for users based on user_id" ON "public"."users" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));

CREATE POLICY "Enable insert for users based on user_id" ON "public"."watchlists" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Enable insert for watchlist editors and owners" ON "public"."watchlists_users" FOR INSERT WITH CHECK ("public"."has_edit_access_to_watchlist"(( SELECT "auth"."uid"() AS "uid"), "watchlist_id"));

CREATE POLICY "Enable read access for all users" ON "public"."anime" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."user_reviews" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."users" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."watchlists_anime" FOR SELECT USING (("watchlist_id" IN ( SELECT "watchlists_anime"."watchlist_id"
   FROM "public"."watchlists"
  WHERE ("watchlists"."is_public" OR (( SELECT "auth"."uid"() AS "uid") = "watchlists"."user_id") OR (( SELECT "auth"."uid"() AS "uid") IN ( SELECT "watchlists_users"."user_id"
           FROM "public"."watchlists_users"
          WHERE (("watchlists_users"."watchlist_id" = "watchlists"."id") AND ("watchlists_users"."user_id" = ( SELECT "auth"."uid"() AS "uid")))))))));

CREATE POLICY "Enable read access for public watchlists or permitted users" ON "public"."watchlists" FOR SELECT USING (("is_public" OR (( SELECT "auth"."uid"() AS "uid") = "user_id") OR "public"."has_watchlist"(( SELECT "auth"."uid"() AS "uid"), "id")));

CREATE POLICY "Enable read access for public watchlists or permitted users" ON "public"."watchlists_users" FOR SELECT USING ((("public"."has_watchlist"(( SELECT "auth"."uid"() AS "uid"), "watchlist_id") AND ("public"."has_edit_access_to_watchlist"(( SELECT "auth"."uid"() AS "uid"), "watchlist_id") OR ("role" <> 'viewer'::"public"."collaborator_access") OR ("user_id" = ( SELECT "auth"."uid"() AS "uid")))) OR (("watchlist_id" IN ( SELECT "watchlists"."id"
   FROM "public"."watchlists"
  WHERE ("watchlists"."is_public" = true))) AND ("role" <> 'viewer'::"public"."collaborator_access"))));

CREATE POLICY "Enable update access for watchlist editors and owners" ON "public"."watchlists_users" FOR UPDATE USING ((("role" <> 'owner'::"public"."collaborator_access") AND "public"."has_edit_access_to_watchlist"(( SELECT "auth"."uid"() AS "uid"), "watchlist_id")));

CREATE POLICY "Enable update for all users" ON "public"."anime" FOR UPDATE USING (true);

CREATE POLICY "Enable update for permitted users" ON "public"."watchlists" FOR UPDATE USING (((( SELECT "auth"."uid"() AS "uid") = "user_id") OR "public"."has_edit_access_to_watchlist"(( SELECT "auth"."uid"() AS "uid"), "id")));

CREATE POLICY "Enable update for users based on user_id" ON "public"."user_reviews" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

ALTER TABLE "public"."anime" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user_reviews" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."watchlists" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."watchlists_anime" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."watchlists_users" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."add_default_owner"() TO "anon";
GRANT ALL ON FUNCTION "public"."add_default_owner"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."add_default_owner"() TO "service_role";

GRANT ALL ON FUNCTION "public"."emit_update_watchlist"() TO "anon";
GRANT ALL ON FUNCTION "public"."emit_update_watchlist"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."emit_update_watchlist"() TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."has_edit_access_to_watchlist"("_user_id" "uuid", "_watchlist_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."has_edit_access_to_watchlist"("_user_id" "uuid", "_watchlist_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_edit_access_to_watchlist"("_user_id" "uuid", "_watchlist_id" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."has_owner_access_to_watchlist"("_user_id" "uuid", "_watchlist_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."has_owner_access_to_watchlist"("_user_id" "uuid", "_watchlist_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_owner_access_to_watchlist"("_user_id" "uuid", "_watchlist_id" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."has_watchlist"("_user_id" "uuid", "_watchlist_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."has_watchlist"("_user_id" "uuid", "_watchlist_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_watchlist"("_user_id" "uuid", "_watchlist_id" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."is_watchlist_viewer"("_user_id" "uuid", "_watchlist_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."is_watchlist_viewer"("_user_id" "uuid", "_watchlist_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_watchlist_viewer"("_user_id" "uuid", "_watchlist_id" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."json_matches_schema"("schema" "json", "instance" "json") TO "postgres";
GRANT ALL ON FUNCTION "public"."json_matches_schema"("schema" "json", "instance" "json") TO "anon";
GRANT ALL ON FUNCTION "public"."json_matches_schema"("schema" "json", "instance" "json") TO "authenticated";
GRANT ALL ON FUNCTION "public"."json_matches_schema"("schema" "json", "instance" "json") TO "service_role";

GRANT ALL ON FUNCTION "public"."jsonb_matches_schema"("schema" "json", "instance" "jsonb") TO "postgres";
GRANT ALL ON FUNCTION "public"."jsonb_matches_schema"("schema" "json", "instance" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."jsonb_matches_schema"("schema" "json", "instance" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."jsonb_matches_schema"("schema" "json", "instance" "jsonb") TO "service_role";

GRANT ALL ON FUNCTION "public"."jsonschema_is_valid"("schema" "json") TO "postgres";
GRANT ALL ON FUNCTION "public"."jsonschema_is_valid"("schema" "json") TO "anon";
GRANT ALL ON FUNCTION "public"."jsonschema_is_valid"("schema" "json") TO "authenticated";
GRANT ALL ON FUNCTION "public"."jsonschema_is_valid"("schema" "json") TO "service_role";

GRANT ALL ON FUNCTION "public"."jsonschema_validation_errors"("schema" "json", "instance" "json") TO "postgres";
GRANT ALL ON FUNCTION "public"."jsonschema_validation_errors"("schema" "json", "instance" "json") TO "anon";
GRANT ALL ON FUNCTION "public"."jsonschema_validation_errors"("schema" "json", "instance" "json") TO "authenticated";
GRANT ALL ON FUNCTION "public"."jsonschema_validation_errors"("schema" "json", "instance" "json") TO "service_role";

GRANT ALL ON FUNCTION "public"."search_users"("prefix" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."search_users"("prefix" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_users"("prefix" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."search_users"("prefix" "text", "exclude_watchlist_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."search_users"("prefix" "text", "exclude_watchlist_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_users"("prefix" "text", "exclude_watchlist_id" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."search_users"("prefix" "text", "querying_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."search_users"("prefix" "text", "querying_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_users"("prefix" "text", "querying_user_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."search_users"("prefix" "text", "exclude_watchlist_id" bigint, "querying_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."search_users"("prefix" "text", "exclude_watchlist_id" bigint, "querying_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_users"("prefix" "text", "exclude_watchlist_id" bigint, "querying_user_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."to_json2"("anyelement") TO "anon";
GRANT ALL ON FUNCTION "public"."to_json2"("anyelement") TO "authenticated";
GRANT ALL ON FUNCTION "public"."to_json2"("anyelement") TO "service_role";

GRANT ALL ON FUNCTION "public"."to_jsonb2"("anyelement") TO "anon";
GRANT ALL ON FUNCTION "public"."to_jsonb2"("anyelement") TO "authenticated";
GRANT ALL ON FUNCTION "public"."to_jsonb2"("anyelement") TO "service_role";

GRANT ALL ON FUNCTION "public"."to_jsonb2"("anyelement" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."to_jsonb2"("anyelement" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."to_jsonb2"("anyelement" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."update_user_via_auth"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_user_via_auth"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_user_via_auth"() TO "service_role";

GRANT ALL ON TABLE "public"."anime" TO "anon";
GRANT ALL ON TABLE "public"."anime" TO "authenticated";
GRANT ALL ON TABLE "public"."anime" TO "service_role";

GRANT ALL ON TABLE "public"."watchlists_users" TO "anon";
GRANT ALL ON TABLE "public"."watchlists_users" TO "authenticated";
GRANT ALL ON TABLE "public"."watchlists_users" TO "service_role";

GRANT ALL ON TABLE "public"."user_relationships" TO "anon";
GRANT ALL ON TABLE "public"."user_relationships" TO "authenticated";
GRANT ALL ON TABLE "public"."user_relationships" TO "service_role";

GRANT ALL ON TABLE "public"."user_reviews" TO "anon";
GRANT ALL ON TABLE "public"."user_reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."user_reviews" TO "service_role";

GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";

GRANT ALL ON TABLE "public"."watchlists" TO "anon";
GRANT ALL ON TABLE "public"."watchlists" TO "authenticated";
GRANT ALL ON TABLE "public"."watchlists" TO "service_role";

GRANT ALL ON TABLE "public"."watchlists_anime" TO "anon";
GRANT ALL ON TABLE "public"."watchlists_anime" TO "authenticated";
GRANT ALL ON TABLE "public"."watchlists_anime" TO "service_role";

GRANT ALL ON SEQUENCE "public"."watchlists_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."watchlists_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."watchlists_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."watchlists_users_watchlist_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."watchlists_users_watchlist_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."watchlists_users_watchlist_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
