import { z } from 'zod'

import { MAX_USERS_LIMIT } from './constants'

export const searchUsersParamsSchema = z
  .object({
    search: z.string(),
    limit: z.coerce.number().int().min(1).max(MAX_USERS_LIMIT).nullable(),
    excludeWatchlistId: z.coerce.number().int().positive().nullable(),
  })
  .or(
    z.object({
      search: z.null(),
      limit: z.null(),
      excludeWatchlistId: z.null(),
    })
  )
