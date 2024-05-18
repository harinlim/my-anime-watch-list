import type { getAnimeByWatchlist } from '@/db/anime'
import type { ImageMetadata } from '@/lib/kitsu/types'

export function transformAnimeByWatchlist({
  user_reviews,
  ...anime
}: NonNullable<Awaited<ReturnType<typeof getAnimeByWatchlist>>['data']>[number]) {
  // There should only ever be 1 review at most
  const userReview = user_reviews.length > 0 ? user_reviews[0] : null

  return {
    ...anime,
    poster_image: anime.poster_image as ImageMetadata | null, // Need to assert this type because supabase returns JSON
    review: userReview,
  }
}
