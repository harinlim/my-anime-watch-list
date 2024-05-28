import type { CookieOptionsWithName } from "@supabase/ssr";

/** Cookie name used for supabase auth token. Defaults to `sb-<project-id>-auth-token` */
export const AUTH_TOKEN_KEY = 'mawl-sb-auth'

/** Options used for the supabase esrver client */
export const SERVER_COOKIE_OPTIONS: Readonly<CookieOptionsWithName> = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  name: AUTH_TOKEN_KEY
}