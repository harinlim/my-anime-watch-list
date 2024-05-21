drop trigger if exists "check_username_before_insert_to_auth_users" on "auth"."users";

drop function if exists "public"."validate_username_before_user_signup"();

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_user_via_auth()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare fields_match boolean;
declare user_exists boolean;
begin
  user_exists := (select exists (
    select 1 from public.users
    where id = new.id
  ));

  fields_match := (select exists (
    select 1 from public.users
    where id = new.id
      and email = new.raw_user_meta_data->>'email'
      and username = new.raw_user_meta_data->>'username'
      and full_name = new.raw_user_meta_data->>'full_name'
      and avatar_url = new.raw_user_meta_data->>'avatar_url'
  ));

  if user_exists and not fields_match then
    update public.users
    set
      email = new.raw_user_meta_data->>'email',
      username = new.raw_user_meta_data->>'username',
      full_name = new.raw_user_meta_data->>'full_name',
      avatar_url = new.raw_user_meta_data->>'avatar_url'
    where id = new.id;
  end if;
  return new;
end;
$function$
;

CREATE TRIGGER on_auth_user_update AFTER UPDATE ON auth.users FOR EACH ROW EXECUTE FUNCTION update_user_via_auth();
