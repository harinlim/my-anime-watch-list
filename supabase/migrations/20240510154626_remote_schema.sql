CREATE TRIGGER check_username_before_insert_to_auth_users BEFORE INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION validate_username_before_user_signup();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();


