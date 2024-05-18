import type { Database } from '@/types/generated/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

export function getWatchlistExistsById(supabase: SupabaseClient<Database>, watchlistId: number) {
  return supabase
    .from('watchlists')
    .select(undefined, { count: 'exact', head: true })
    .eq('id', watchlistId)
}

export function getFullWatchlistById(supabase: SupabaseClient<Database>, watchlistId: number) {
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
      anime(title, synopsis, kitsu_id, poster_image),
      watchlists_users(user_id, role, ...users(username, avatar_url))
    `,
      { count: 'exact' }
    )
    .eq('id', watchlistId)
    .maybeSingle()
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
      watchlists_users(user_id, role, ...users(username, avatar_url))
    `,
      { count: 'exact' }
    )
    .limit(4, { referencedTable: 'anime' })
}
