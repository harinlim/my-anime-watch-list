import { z } from 'zod'

import { oneOf } from '@/lib/zod/one-of'
import { WATCH_STATUS } from '@/types/enums'

export const ratingSchema = z.object({
  rating: z
    .number()
    .int('Rating must be an integer')
    .min(1, 'Rating must be greater than or equal to 1')
    .max(10, 'Rating must be less than or equal to 10'),
})

export const statusSchema = z.object({
  status: z.enum(WATCH_STATUS, {
    message:
      'Status must be one of the following: "watching", "completed", "on_hold", "dropped", "planned"',
  }),
})

export const patchAnimeRequestSchema = ratingSchema
  .merge(statusSchema)
  .partial()
  .superRefine(oneOf('rating', 'status'))
