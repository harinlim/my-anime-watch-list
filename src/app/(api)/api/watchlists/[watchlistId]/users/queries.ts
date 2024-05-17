import type { Database } from '@/types/generated/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

export function getWatchlistCollaborators(supabase: SupabaseClient<Database>, watchlistId: number) {
  // Note authorization checks will be done via RLS, though it will be returning a 404
  // RLS on watchlists_users will ensure that only collaborators to private watchlists OR
  // public watchlists will be returned

  // RLS allows reads on rows where user has access to watchlist, or if the watchlist is public.
  // If the user is a non-contributor, disallow reads on viewer rows.
  // When read as a viewer, should not be able to see other viewers but themself.
  return supabase
    .from('watchlists_users')
    .select('user_id, role, ...users(username, avatar_url)', { count: 'exact' })
    .eq('watchlist_id', watchlistId)
}

export function getWatchlistRoleForUser(
  supabase: SupabaseClient<Database>,
  { watchlistId, userId }: { watchlistId: number; userId: string }
) {
  return supabase
    .from('watchlists_users')
    .select('role')
    .eq('watchlist_id', watchlistId)
    .eq('user_id', userId)
    .single()
}
