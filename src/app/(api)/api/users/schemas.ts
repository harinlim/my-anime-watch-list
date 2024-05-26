import { z } from 'zod'

export const searchUsersParamsSchema = z.object({
  search: z.string().nullish(),
})
