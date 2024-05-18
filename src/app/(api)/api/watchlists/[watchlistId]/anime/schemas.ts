import { z } from 'zod'

export const addWatchlistAnimeRequestBodySchema = z.object({
  animeId: z.number({ coerce: true }).int(),
})
