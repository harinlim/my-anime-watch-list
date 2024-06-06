import { createServerClient as createSupabaseClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

import { isProxyRequest } from '@/lib/headers'

import { AUTH_TOKEN_KEY, SERVER_AUTH_COOKIE_OPTIONS } from './cookies'

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
        suppressGetSessionWarning: true,
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

  // Skip auth check if the request is a proxy (i.e., auth and cookies have already been checked and refreshed)
  if (isProxyRequest(request)) {
    return response
  }

  // Refreshing the auth token if refresh token is available and valid.
  const {
    data: { user },
  } = await supabase.auth.getUser()
  // PATCHED VIA PACKAGE: when the session doesn't exist, revoke the cookie. However, we still want downstream
  // calls to routes to recieve the correct user for the session cookies when calling `getSession`. So, we need
  // to set the user to null in the request cookies WITHOUT having a `Set-Cookie` header in the response.
  if (!user) {
    request.cookies.set({
      name: AUTH_TOKEN_KEY,
      value: '',
    })
    response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }

  return response
}
