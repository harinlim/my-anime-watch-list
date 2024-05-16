import type { getAnimeByUserQueryParamSchema } from './schemas'
import type { transformAnimeByUserAssociation } from './utils'
import type { z } from 'zod'

export type GetAnimeByUserAssociationQueryParams = z.infer<typeof getAnimeByUserQueryParamSchema>

export type GetAnimeByUserAssociationResponse = ReturnType<typeof transformAnimeByUserAssociation>
