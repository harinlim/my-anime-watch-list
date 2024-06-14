import type { AnimeByWatchlist } from '@/types/anime'
import type { ResponseWithDataPaginated } from '@/types/api'

export type GetWatchlistAnimeResponse = ResponseWithDataPaginated<AnimeByWatchlist[]>
