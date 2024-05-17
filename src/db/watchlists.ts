import type { Database } from '@/types/generated/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

export function getWatchlistExistsById(supabase: SupabaseClient<Database>, watchlistId: number) {
  return supabase
    .from('watchlists')
    .select('id', { count: 'exact', head: true })
    .eq('id', watchlistId)
    .single()
}

/**
 * Returns array of WatchlistOverview on success (cannot type directly here)
 */
export function queryWatchlistOverviews(supabase: SupabaseClient<Database>) {
  return supabase
    .from('watchlists')
    .select(
      `
      id,
      user_id,
      title,
      is_public,
      description,
      created_at,
      updated_at,
      anime(title, kitsu_id, poster_image),
      watchlists_users(user_id, role, ...users(username, avatar_url)))
    `,
      { count: 'exact' }
    )
    .limit(4, { referencedTable: 'anime' })
}
