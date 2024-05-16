import { z } from 'zod'

export const watchlistCollaboratorRequestBodySchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['editor', 'viewer']),
})
