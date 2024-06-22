import { z } from 'zod'

import { MAX_WATCHLIST_QUERY_LIMIT } from './constants'
import { SEARCH_WATCHLISTS_SORT_TYPES } from './types'

export const searchWatchlistsQueryParamsSchema = z.object({
  search: z.string().nullish(),
  sort: z.enum(SEARCH_WATCHLISTS_SORT_TYPES),
  direction: z.enum(['asc', 'desc']),
  page: z.coerce.number().int().positive(),
  limit: z.coerce.number().int().nonnegative().max(MAX_WATCHLIST_QUERY_LIMIT),
})

export const watchlistRequestBodySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'Title is required' })
    .max(50, { message: 'Title can be at most 50 characters' }),
  description: z.string().trim().max(500, { message: 'Description can be at most 500 characters' }),
  isPublic: z.boolean(),
})
