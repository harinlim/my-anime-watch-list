import type { getAnimeByUserAssociation } from '@/db/anime'
import type { ImageMetadata } from '@/lib/kitsu/types'

export function transformAnimeByUserAssociation({
  user_reviews,
  watchlists,
  ...anime
}: NonNullable<Awaited<ReturnType<typeof getAnimeByUserAssociation>>['data']>[number]) {
  // There should only ever be 1 review at most
  const userReview = user_reviews.length > 0 ? user_reviews[0] : null

  // If watchlists is mappable, it will always have at least one watchlist_user
  const userWatchlists = watchlists.map(watchlist => {
    const { watchlists_users, ...rest } = watchlist
    // There should only ever be 1 watchlist user due to the inner join
    const { role } = watchlists_users[0] ?? { role: null }
    // For now, log this error instead of throwing
    if (!role) {
      console.error('transformAnimeByUserAssociation: watchlist user role not found')
    }
    return { ...rest, role }
  })

  return {
    ...anime,
    poster_image: anime.poster_image as ImageMetadata | null, // Need to assert this type because supabase returns JSON
    review: userReview,
    watchlists: userWatchlists,
  }
}
