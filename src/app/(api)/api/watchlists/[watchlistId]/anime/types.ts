import type { getWatchlistAnimeQueryParamsSchema } from './schemas'
import type { AnimeByWatchlist } from '@/types/anime'
import type { ResponseWithDataPaginated } from '@/types/api'
import type { z } from 'zod'

export type GetWatchlistAnimeQueryParams = z.infer<typeof getWatchlistAnimeQueryParamsSchema>

export type GetWatchlistAnimeResponse = ResponseWithDataPaginated<AnimeByWatchlist[]>
