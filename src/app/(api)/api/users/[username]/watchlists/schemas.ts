import { z } from 'zod'

import { MAX_WATCHLIST_QUERY_LIMIT } from './constants'

export const getUserWatchlistQueryParamsSchema = z.object({
  page: z.coerce.number().int().positive(),
  limit: z.coerce.number().int().nonnegative().max(MAX_WATCHLIST_QUERY_LIMIT),
})
