import { z } from 'zod'

import { MAX_USERS_LIMIT } from './constants'

export const searchUsersParamsSchema = z
  .object({
    search: z.string(),
    limit: z.number().int().min(1).max(MAX_USERS_LIMIT).nullable(),
  })
  .or(
    z.object({
      search: z.null(),
      limit: z.null(),
    })
  )
