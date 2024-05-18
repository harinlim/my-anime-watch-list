import type { Database } from '@/types/generated/supabase'
import type { Equal, Expect } from '@/types/utils'
import type { Watchlist } from '@/types/watchlists'
import type { SupabaseClient } from '@supabase/supabase-js'

export function getWatchlistExistsById(supabase: SupabaseClient<Database>, watchlistId: number) {
  return supabase
    .from('watchlists')
    .select(undefined, { count: 'exact', head: true })
    .eq('id', watchlistId)
}

export function getWatchlistById(supabase: SupabaseClient<Database>, watchlistId: number) {
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
      updated_at
    `,
      { count: 'exact' }
    )
    .eq('id', watchlistId)
    .maybeSingle()
}

type _TestGetWatchlistByIdReturn = Expect<
  Equal<NonNullable<Awaited<ReturnType<typeof getWatchlistById>>['data']>, Watchlist>
>

export function getWatchlistsForUser(
  supabase: SupabaseClient<Database>,
  { userId, onlyEditable = false }: { userId: string; onlyEditable?: boolean }
) {
  const query = supabase
    .from('watchlists_users')
    .select(
      `...watchlists(
        id, 
        user_id, 
        title, 
        is_public,
        description,
        created_at,
        updated_at
      )`
    )
    .eq('user_id', userId)

  return onlyEditable ? query.neq('role', 'viewer') : query
}

type _TestGetEditableWatchlistsReturn = Expect<
  Equal<NonNullable<Awaited<ReturnType<typeof getWatchlistsForUser>>['data']>, Watchlist[]>
>

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
