import type { CookieOptionsWithName } from '@supabase/ssr'
import type { CookieSerializeOptions } from 'cookie'

/** Cookie name used for supabase auth token. Defaults to `sb-<project-id>-auth-token` */
export const AUTH_TOKEN_KEY = 'mawl-sb-auth' // prob should move this to an env variable

/** Options used for the supabase server client */
export const SERVER_AUTH_COOKIE_OPTIONS: Readonly<CookieOptionsWithName> = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax', // TODO: Eventually we should use 'strict' but for now we'll use 'lax'. See middleware comment.
  name: AUTH_TOKEN_KEY,
}

/** Options for removing cookies from response cookies */
export const RESPONSE_REMOVE_COOKIE_OPTIONS: Readonly<CookieSerializeOptions> = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax', // TODO: Eventually we should use 'strict' but for now we'll use 'lax'. See middleware comment.
  maxAge: 0,
  expires: new Date(0), // Use `expires` as a fallback for browsers that don't support `max-age`
}
