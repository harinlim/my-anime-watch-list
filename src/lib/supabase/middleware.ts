import { createServerClient as createSupabaseClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

import {
  SERVER_AUTH_COOKIE_OPTIONS,
  AUTH_TOKEN_KEY,
  RESPONSE_REMOVE_COOKIE_OPTIONS,
} from './cookies'

import type { Database } from '@/types/generated/supabase'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createSupabaseClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
      cookieOptions: SERVER_AUTH_COOKIE_OPTIONS,
    }
  )

  // Refreshing the auth token if refresh token is available and valid.
  const result = await supabase.auth.getUser()

  // NOTE: `supabase.auth.getUser()` currently does NOT reset the auth cookie if invalid.
  // We need to do this manually.
  if (result.data.user === null) {
    request.cookies.set({ name: AUTH_TOKEN_KEY, value: '' })

    // Note: this can also be set via the 'x-middleware-request-cookie' response header, which returns a string cookie
    response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    response.cookies.set({ name: AUTH_TOKEN_KEY, value: '', ...RESPONSE_REMOVE_COOKIE_OPTIONS })
  }

  return response
}
