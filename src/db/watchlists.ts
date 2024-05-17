import type { Database } from '@/types/generated/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

export function getWatchlistExistsById(supabase: SupabaseClient<Database>, watchlistId: number) {
  return supabase
    .from('watchlists')
    .select('id', { count: 'exact', head: true })
    .eq('id', watchlistId)
    .single()
}
