import { WATCH_STATUS } from '@/types/enums'

import type { GetUserAnimeQueryParams } from './types'
import type { AnimeByUser } from '@/types/anime'

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
  updated_at: {
    asc: (a, b) =>
      new Date(a.review?.updated_at ?? 0).valueOf() - new Date(b.review?.updated_at ?? 0).valueOf(),
    desc: (a, b) =>
      new Date(b.review?.updated_at ?? 0).valueOf() - new Date(a.review?.updated_at ?? 0).valueOf(),
  },
} as const satisfies Record<
  GetUserAnimeQueryParams['sort'],
  Record<
    GetUserAnimeQueryParams['direction'],
    (a: { review: AnimeByUser['review'] }, b: { review: AnimeByUser['review'] }) => number
  >
>
