# My Anime Watch List

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

1. Make sure to install and enable the correct `pnpm` version.

```sh
corepack enable
```

2. Install the packages with `pnpm`:

```sh
pnpm install
```

3. Copy `.env.example` into `.env` and add the configured supabase credentials.

4. Once supabase credentials are set up, run the following to generate the correct up-to-date types:

```sh
# Login to supabase and get credentials
pnpm supabase login

# Generate types
pnpm supabase gen types typescript --project-id {YOUR_PROJECT_ID} --schema public > src/types/generated/supabase.ts && pnpm eslint --fix src/types/generated/supabase.ts
```

5. Run the development server and go to [http://localhost:3000](http://localhost:3000) to see the result:

```sh
pnpm dev
```
