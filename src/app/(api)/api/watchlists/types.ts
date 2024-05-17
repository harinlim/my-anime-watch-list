import type { searchWatchlistsQueryParamsSchema } from './schemas'
import type { ResponseWithDataPaginated } from '@/types/api'
import type { WatchlistOverview } from '@/types/watchlists'
import type { z } from 'zod'

export const SEARCH_WATCHLISTS_SORT_TYPES = ['updated_at', 'created_at'] as const
export type SearchWatchlistsSortType = (typeof SEARCH_WATCHLISTS_SORT_TYPES)[number]

export type SearchWatchlistsQueryParams = Partial<z.infer<typeof searchWatchlistsQueryParamsSchema>>

export type SearchWatchlistsResponse = ResponseWithDataPaginated<WatchlistOverview[]>
