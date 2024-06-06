import { z } from 'zod'

export const watchlistCollaboratorSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['editor', 'viewer']),
})

export const multipleWatchlistCollaboratorSchema = z.object({
  users: z
    .array(watchlistCollaboratorSchema)
    .min(1, 'At least one user must be provided')
    .max(10, 'Maximum of 10 users can be added at once')
    .superRefine((users, ctx) => {
      const userIds = users.map(user => user.userId)
      if (new Set(userIds).size !== userIds.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Duplicate user IDs are not allowed',
        })
        return false
      }
      return true
    }),
})

export const watchlistCollaboratorRequestBodySchema = z.union([
  watchlistCollaboratorSchema,
  multipleWatchlistCollaboratorSchema,
])
