import { z } from 'zod'

export const watchlistCollaboratorSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['editor', 'viewer']),
})

export const watchlistCollaboratorRequestBodySchema = z.array(watchlistCollaboratorSchema)
