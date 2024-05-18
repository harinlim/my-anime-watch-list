import type { getAnimeByUserQueryParamsSchema } from './schemas'
import type { z } from 'zod'

export type GetAnimeByUserAssociationQueryParams = z.infer<typeof getAnimeByUserQueryParamsSchema>
