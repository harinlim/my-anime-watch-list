import type { getAnimeByUserQueryParamsSchema } from './schemas'
import type { transformAnimeByUserAssociation } from './utils'
import type { z } from 'zod'

export type GetAnimeByUserAssociationQueryParams = z.infer<typeof getAnimeByUserQueryParamsSchema>

export type GetAnimeByUserAssociationResponse = ReturnType<typeof transformAnimeByUserAssociation>
