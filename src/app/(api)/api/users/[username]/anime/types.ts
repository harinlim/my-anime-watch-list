import type { getAnimeByUserQueryParamsSchema } from './schemas'
import type { TransformedAnimeByUserAssociation } from '@/types/anime'
import type { z } from 'zod'

export type GetAnimeByUserAssociationQueryParams = z.infer<typeof getAnimeByUserQueryParamsSchema>

export type GetAnimeByUserAssociationResponse = TransformedAnimeByUserAssociation
