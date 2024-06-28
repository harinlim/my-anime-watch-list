import type { getUserWatchlistQueryParamsSchema } from './schemas'
import type { ResponseWithDataPaginated } from '@/types/api'
import type { WatchlistOverview } from '@/types/watchlists'
import type { z } from 'zod'

export type GetUserWatchlistsQueryParams = z.infer<typeof getUserWatchlistQueryParamsSchema>

export type GetUserWatchlistOverviewsResponse = ResponseWithDataPaginated<WatchlistOverview[]>
