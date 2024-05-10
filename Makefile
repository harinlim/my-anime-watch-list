include .env

gen-types:
	@echo "Generating types from supabase...\n"
	@pnpm supabase gen types typescript --project-id ${SUPABASE_PROJECT_ID} --schema public > src/types/generated/supabase.ts && pnpm eslint --fix src/types/generated/supabase.ts
	@echo "Types generated! 🚀\n"