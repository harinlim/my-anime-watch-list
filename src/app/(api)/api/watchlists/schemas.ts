import { z } from 'zod'

import { SEARCH_WATCHLISTS_SORT_TYPES } from './types'

export const searchWatchlistsQueryParamsSchema = z.object({
  search: z.string().nullish(),
  sort: z.enum(SEARCH_WATCHLISTS_SORT_TYPES),
  direction: z.enum(['asc', 'desc']),
  page: z.coerce.number().int('Page must be an integer'),
  limit: z.coerce.number().int('Limit must be an integer'),
})
