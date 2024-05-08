import { createBrowserClient as createSupabaseClient } from '@supabase/ssr'

import type { Database } from '@/types/generated/supabase'

export function createBrowserClient() {
  // Create a supabase client on the browser with project's credentials
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
