import { z } from 'zod'

export const watchlistAnimeRequestBodySchema = z.object({
  animeId: z.number({ coerce: true }).int(),
})
