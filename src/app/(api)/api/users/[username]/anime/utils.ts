import { WATCH_STATUS } from '@/types/enums'

import type { GetAnimeByUserAssociationQueryParams } from './types'
import type { ImageMetadata } from '@/lib/kitsu/types'
import type { WatchStatus } from '@/types/enums'
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

/** TEMPORARY SORTER UNTIL WE ESTABLISH VIEW/RPC FOR THE USER ANIMES */
const SORT_ANIME_COMPARATORS = {
  rating: {
    asc: (a, b) => (a.review?.rating ?? 0) - (b.review?.rating ?? 0),
    desc: (a, b) => (b.review?.rating ?? 0) - (a.review?.rating ?? 0),
  },
  status: {
    asc: (a, b) =>
      (a.review?.status ? WATCH_STATUS.indexOf(a.review.status) + 1 : 0) -
      (b.review?.status ? WATCH_STATUS.indexOf(b.review.status) + 1 : 0),
    desc: (a, b) =>
      (b.review?.status ? WATCH_STATUS.indexOf(b.review.status) + 1 : 0) -
      (a.review?.status ? WATCH_STATUS.indexOf(a.review.status) + 1 : 0),
  },
} as const satisfies Record<
  GetAnimeByUserAssociationQueryParams['sort'],
  Record<
    GetAnimeByUserAssociationQueryParams['direction'],
    (
      a: { review: { rating?: number | null; status: WatchStatus | null } | null },
      b: { review: { rating?: number | null; status: WatchStatus | null } | null }
    ) => number
  >
>

export function transformAnimeByUserAssociation(
  data: NonNullable<Awaited<ReturnType<typeof getAnimeByUserAssociation>>['data']>,
  { sort, direction }: Pick<GetAnimeByUserAssociationQueryParams, 'sort' | 'direction'>
) {
  return (
    data
      .map(({ user_reviews, watchlists, ...anime }) => {
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
      // TEMPORARY SOLUTION UNTIL WE ESTABLISH A VIEW FOR THE USER ANIMES
      .toSorted(SORT_ANIME_COMPARATORS[sort][direction])
  )
}
