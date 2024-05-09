import { createBrowserClient as createSupabaseClient } from '@supabase/ssr'

import type { Database } from '@/types/generated/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient<Database> | undefined

export function getSupabaseBrowserClient() {
  if (client) return client

  // Create a supabase client on the browser with project's credentials
  client = createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return client
}
