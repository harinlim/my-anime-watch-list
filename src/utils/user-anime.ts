import type { getAnimeByUserAssociation } from '@/db/anime'
import type { ImageMetadata } from '@/lib/kitsu/types'

export function transformAnimeByUserAssociation(
  data: NonNullable<Awaited<ReturnType<typeof getAnimeByUserAssociation>>['data']>
) {
  return data.map(({ user_reviews, watchlists, ...anime }) => {
    // There should only ever be 1 review at most
    const userReview = user_reviews.length > 0 ? user_reviews[0] : null

    const userWatchlists = watchlists.map(watchlist => {
      const { watchlists_users, ...rest } = watchlist
      // There should only ever be 1 watchlist user at most
      const { role } = watchlists_users[0]
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
