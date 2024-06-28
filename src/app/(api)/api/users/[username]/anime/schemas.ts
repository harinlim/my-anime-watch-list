import { z } from 'zod'

import { WATCH_STATUS } from '@/types/enums'

import { MAX_USER_ANIME_QUERY_LIMIT } from './constants'

export const getAnimeByUserQueryParamsSchema = z.object({
  status: z
    .enum(WATCH_STATUS, {
      message:
        'Status must be one of the following: "watching", "completed", "on_hold", "dropped", "planned"',
    })
    .nullish(),
  rating: z.coerce
    .number()
    .int('Rating must be an integer')
    .min(1, 'Rating must be greater than or equal to 1')
    .max(10, 'Rating must be less than or equal to 10')
    .nullish(),
  sort: z.enum(['rating', 'status']),
  direction: z.enum(['asc', 'desc']),
  page: z.coerce.number().int().positive(),
  limit: z.coerce.number().int().nonnegative().max(MAX_USER_ANIME_QUERY_LIMIT),
})
