import { z } from 'zod'

export const watchlistCollaboratorParamSchema = z.object({
  userId: z.string().uuid(),
  watchlistId: z.coerce
    .number()
    .int('Watchlist ID must be an integer')
    .min(1, 'Watchlist ID must be greater than or equal to 1'),
})
