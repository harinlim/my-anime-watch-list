import { z } from 'zod'

import { MAX_WATCHLIST_ANIME_QUERY_LIMIT } from './constants'

export const getWatchlistAnimeQueryParamsSchema = z.object({
  page: z.coerce.number().int().nonnegative(),
  limit: z.coerce.number().int().nonnegative().max(MAX_WATCHLIST_ANIME_QUERY_LIMIT),
})

export const addWatchlistAnimeRequestBodySchema = z.object({
  animeId: z.number({ coerce: true }).int(),
})
