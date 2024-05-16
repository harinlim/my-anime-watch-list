import type { ImageMetadata } from '@/lib/kitsu/types'
import type { Database } from '@/types/generated/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

export function getAnimeByUserAssociation(
  supabase: SupabaseClient<Database>,
  { userId, associatedAnimeIds }: { userId: string; associatedAnimeIds: string[] }
) {
  return supabase
    .from('anime')
    .select(
      `*, 
      user_reviews(rating, status, updated_at), 
      watchlists(*, 
        watchlists_users(role, user_id, watchlist_id)
      )`,
      {
        count: 'exact',
      }
    )
    .in('kitsu_id', associatedAnimeIds)
    .eq('user_reviews.user_id', userId)
    .eq('watchlists.watchlists_users.user_id', userId)
}

export function transformAnimeByUserAssociation(
  data: NonNullable<Awaited<ReturnType<typeof getAnimeByUserAssociation>>['data']>
) {
  return data.map(({ user_reviews, watchlists, ...anime }) => {
    // There should only ever be 1 review at most
    const userReview = user_reviews.length > 0 ? user_reviews[0] : null

    const userWatchlists = watchlists.map(watchlist => {
      const { watchlists_users, ...rest } = watchlist
      // There should only ever be 1 watchlist user at most
      const role = watchlists_users.length > 0 ? watchlists_users[0].role : null
      return { ...rest, role }
    })

    return {
      ...anime,
      poster_image: anime.poster_image as ImageMetadata | null, // Need to assert this type because supabase returns JSON
      review: userReview,
      watchlists: userWatchlists,
    }
  })
}
