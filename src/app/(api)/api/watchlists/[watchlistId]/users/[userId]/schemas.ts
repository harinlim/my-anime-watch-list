import { z } from 'zod'

export const watchlistCollaboratorQueryParamsSchema = z.object({
  userId: z.string().uuid(),
  watchlistId: z.coerce
    .number()
    .int('Watchlist ID must be an integer')
    .min(1, 'Watchlist ID must be greater than or equal to 1'),
})

export const patchCollaboratorRoleRequestBodySchema = z.object({
  role: z.enum(['editor', 'viewer']),
})
