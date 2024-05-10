
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

CREATE TYPE "public"."watch_status" AS ENUM (
    'planned',
    'watching',
    'completed',
    'dropped'
);

ALTER TYPE "public"."watch_status" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  insert into public.users (id, email, username, full_name, avatar_url)
  values (new.id, 
  new.email,
  new.raw_user_meta_data->>'username',
  new.raw_user_meta_data->>'full_name', 
  new.raw_user_meta_data->>'avatar_url');
  return new;
end;$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."validate_username_before_user_signup"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
IF EXISTS (
    SELECT 1
    FROM public.users
    WHERE username = new.raw_user_meta_data->>'username' 

) THEN
    RAISE EXCEPTION 'User with username % already exists!', new.raw_user_meta_data->>'username';
END IF;

  return new;
end;
$$;

ALTER FUNCTION "public"."validate_username_before_user_signup"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."anime" (
    "kitsu_id" character varying NOT NULL,
    "title" "text",
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

COMMENT ON TABLE "public"."anime" IS 'anime proxy for kitsu';

COMMENT ON COLUMN "public"."anime"."poster_image" IS 'kitsu poster images';

CREATE TABLE IF NOT EXISTS "public"."user_reviews" (
    "anime_id" character varying NOT NULL,
    "user_id" "uuid" NOT NULL,
    "rating" smallint,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "status" "public"."watch_status" DEFAULT 'planned'::"public"."watch_status",
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "user_reviews_rating_check" CHECK (("rating" <= 10)),
    CONSTRAINT "user_reviews_rating_min_check" CHECK (("rating" >= 0))
);

ALTER TABLE "public"."user_reviews" OWNER TO "postgres";

COMMENT ON TABLE "public"."user_reviews" IS 'user reviews of anime';

CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "username" character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "full_name" "text",
    "avatar_url" "text",
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "email" "text",
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
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
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

ALTER TABLE ONLY "public"."anime"
    ADD CONSTRAINT "anime_kitsu_id_key" UNIQUE ("kitsu_id");

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

CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."user_reviews" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."watchlists" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

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

CREATE POLICY "Enable delete for users based on user id" ON "public"."watchlists_anime" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") IN ( SELECT "watchlists"."user_id"
   FROM "public"."watchlists",
    "public"."watchlists_anime" "watchlists_anime_1"
  WHERE ("watchlists"."id" = "watchlists_anime_1"."watchlist_id"))));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."user_reviews" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."watchlists" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Enable insert for authenticated users only" ON "public"."anime" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."watchlists_anime" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for users based on user_id" ON "public"."user_reviews" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Enable insert for users based on user_id" ON "public"."users" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));

CREATE POLICY "Enable insert for users based on user_id" ON "public"."watchlists" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Enable read access for all users" ON "public"."anime" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."user_reviews" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."users" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."watchlists" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."watchlists_anime" FOR SELECT USING (true);

CREATE POLICY "Enable update for authenticated users only" ON "public"."anime" FOR UPDATE TO "authenticated" USING (true);

CREATE POLICY "Enable update for users based on user_id" ON "public"."user_reviews" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Enable update for users based on user_id" ON "public"."watchlists" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

ALTER TABLE "public"."anime" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user_reviews" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."watchlists" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."watchlists_anime" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

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

GRANT ALL ON FUNCTION "public"."validate_username_before_user_signup"() TO "anon";
GRANT ALL ON FUNCTION "public"."validate_username_before_user_signup"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_username_before_user_signup"() TO "service_role";

GRANT ALL ON TABLE "public"."anime" TO "anon";
GRANT ALL ON TABLE "public"."anime" TO "authenticated";
GRANT ALL ON TABLE "public"."anime" TO "service_role";

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
