import type { Database } from '@/types/generated/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

export function getUserExistsById(supabase: SupabaseClient<Database>, userId: string) {
  return supabase
    .from('users')
    .select(undefined, { count: 'exact', head: true })
    .eq('id', userId)
    .single()
}
