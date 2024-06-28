import type { getAnimeByUserQueryParamsSchema } from './schemas'
import type { AnimeByUser } from '@/types/anime'
import type { ResponseWithDataPaginated } from '@/types/api'
import type { z } from 'zod'

export type GetAnimeByUserAssociationQueryParams = z.infer<typeof getAnimeByUserQueryParamsSchema>

export type GetUserAnimeResponse = ResponseWithDataPaginated<AnimeByUser[]>
