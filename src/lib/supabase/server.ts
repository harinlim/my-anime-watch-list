import { createServerClient as createSupabaseClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

import { SERVER_AUTH_COOKIE_OPTIONS } from './cookies'

import type { Database } from '@/types/generated/supabase'

export function createServerClient() {
  const cookieStore = cookies()

  // Create a server's supabase client with newly configured cookie,
  // which could be used to maintain user's session
  return createSupabaseClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      suppressGetSessionWarning: true,
    },
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options })
        } catch {
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
    cookieOptions: SERVER_AUTH_COOKIE_OPTIONS,
  })
}
