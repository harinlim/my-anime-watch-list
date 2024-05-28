import { createServerClient as createSupabaseClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

import { SERVER_COOKIE_OPTIONS } from './cookies'

import type { Database } from '@/types/generated/supabase'

export function createServerClient() {
  const cookieStore = cookies()

  // Create a server's supabase client with newly configured cookie,
  // which could be used to maintain user's session
  return createSupabaseClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        console.log('GETTING COOKIE FROM SERVER', name)
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        console.log('CALLING SET FROM SERVER', name, value)
        try {
          cookieStore.set({ name, value, ...options })
        } catch {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
      remove(name: string, options: CookieOptions) {
        console.log('CALLING REMOVE FROM SERVER', name)
        try {
          cookieStore.set({ name, value: '', ...options })
        } catch {
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
    cookieOptions: SERVER_COOKIE_OPTIONS,
  })
}
