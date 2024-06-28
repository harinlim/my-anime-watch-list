import { z } from 'zod'

import { MAX_WATCHLIST_QUERY_LIMIT } from './constants'

const trueOrNothing = z.union([
  z.literal('true').transform(arg => arg === 'true'),
  z
    .any()
    .optional()
    .transform(() => false)
    .optional(),
])

export const getUserWatchlistQueryParamsSchema = z.object({
  overview: trueOrNothing,
  editable: trueOrNothing,
  page: z.coerce.number().int().positive(),
  limit: z.coerce.number().int().nonnegative().max(MAX_WATCHLIST_QUERY_LIMIT),
})
