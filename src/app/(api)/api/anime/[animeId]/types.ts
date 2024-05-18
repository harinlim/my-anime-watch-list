import type { GetAnimeByIdDeserializedResponse } from '@/lib/kitsu/types'
import type { AnimeByUser } from '@/types/anime'
import type { Nullable } from '@/types/utils'

export type GetAnimeByIdResponse = GetAnimeByIdDeserializedResponse['data'] &
  Nullable<Pick<AnimeByUser, 'review' | 'watchlists'>>
