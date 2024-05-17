import { WATCH_STATUS } from '@/types/enums'

import type { GetAnimeByUserAssociationQueryParams } from './types'
import type { WatchStatus } from '@/types/enums'

/** TEMPORARY SORTER UNTIL WE ESTABLISH VIEW/RPC FOR THE USER ANIMES */
export const SORT_ANIME_COMPARATORS = {
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
