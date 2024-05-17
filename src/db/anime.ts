import type { Database } from '@/types/generated/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

export function getAnimeExistsById(supabase: SupabaseClient<Database>, animeId: string) {
  return supabase
    .from('anime')
    .select(undefined, { count: 'exact', head: true })
    .eq('kitsu_id', animeId)
    .single()
}

export function getAnimeByUserAssociation(
  supabase: SupabaseClient<Database>,
  params:
    | { userId: string; associatedAnimeIds: string[]; animeId?: never }
    | { userId: string; animeId: string; associatedAnimeIds?: never }
) {
  const query = supabase
    .from('anime')
    .select(
      `*,
      user_reviews(rating, status, updated_at),
      watchlists(
        id,
        user_id,
        title,
        is_public,
        watchlists_users(user_id, role, ...users(username))
      )`,
      {
        count: 'exact',
      }
    )
    .eq('user_reviews.user_id', params.userId)
    .eq('watchlists.watchlists_users.user_id', params.userId)

  return params.associatedAnimeIds
    ? query.in('kitsu_id', params.associatedAnimeIds)
    : query.eq('kitsu_id', params.animeId)
}
