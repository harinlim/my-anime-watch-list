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
    .min(1, { message: 'Title must be at least one character' })
    .max(100, { message: 'Title must be at most 100 characters' }),
  description: z.string().max(4000, { message: 'Description must be at most 4000 characters' }),
  isPublic: z.boolean({ message: 'isPublic must be a boolean' }),
})
