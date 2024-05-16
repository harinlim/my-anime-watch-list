import type { Database } from '@/types/generated/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

export function getWatchlistCollaborators(supabase: SupabaseClient<Database>, watchlistId: number) {
  // Note authorization checks will be done via RLS, though it will be returning a 404
  // RLS on watchlists_users will ensure that only collaborators to private watchlists OR
  // public watchlists will be returned
  return supabase
    .from('watchlists_users')
    .select('user_id, role, ...users(username)', { count: 'exact' })
    .eq('watchlist_id', watchlistId)
}

export function getWatchlistById(supabase: SupabaseClient<Database>, watchlistId: number) {
  return supabase
    .from('watchlists')
    .select('id', { count: 'exact', head: true })
    .eq('id', watchlistId)
    .single()
}
