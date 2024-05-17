import type { GetAnimeByIdDeserializedResponse } from '@/lib/kitsu/types'
import type { TransformedAnimeByUserAssociation } from '@/types/anime'
import type { Nullable } from '@/types/utils'

export type GetAnimeByIdResponse = GetAnimeByIdDeserializedResponse['data'] &
  Nullable<Pick<TransformedAnimeByUserAssociation[number], 'review' | 'watchlists'>>
