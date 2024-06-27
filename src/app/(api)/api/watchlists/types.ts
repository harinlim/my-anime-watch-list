import type { searchWatchlistsQueryParamsSchema, watchlistRequestBodySchema } from './schemas'
import type { ResponseWithDataPaginated } from '@/types/api'
import type { Expand } from '@/types/utils'
import type { Watchlist, WatchlistOverview } from '@/types/watchlists'
import type { z } from 'zod'

export const SEARCH_WATCHLISTS_SORT_TYPES = ['updated_at', 'created_at'] as const
export const SEARCH_WATCHLISTS_DIRECTION_TYPES = ['asc', 'desc'] as const

export type SearchWatchlistsSortType = (typeof SEARCH_WATCHLISTS_SORT_TYPES)[number]

export type SearchWatchlistsDirectionType = (typeof SEARCH_WATCHLISTS_DIRECTION_TYPES)[number]

export type SearchWatchlistsQueryParams = Partial<z.infer<typeof searchWatchlistsQueryParamsSchema>>

export type SearchWatchlistsResponse = ResponseWithDataPaginated<WatchlistOverview[]>

export type WatchlistRequestBody = z.infer<typeof watchlistRequestBodySchema>

// TODO: update this to use delimiter casing type
export type CreateWatchlistResponse = Expand<
  Pick<Watchlist, 'title' | 'description'> & {
    isPublic: Watchlist['is_public']
    userId: Watchlist['user_id']
    watchlistId: Watchlist['id']
  }
>
