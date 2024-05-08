import { deserialise } from 'kitsu-core'

import { fetchWithType } from '@/lib/api'
import { ANIME_ATTRIBUTES, CATEGORY_ATTRIBUTES } from '@/lib/kitsu/types'

import type { GetAnimeByIdDeserialized, GetAnimeByIdResponse } from './types'
import type { ResponseWithData } from '@/types/api'

const KITSU_API_URL = 'https://kitsu.io/api/edge'

const ANIME_ATTRIBUTES_SERIALIZED = ANIME_ATTRIBUTES.join(',')
const CATEGORY_ATTRIBUTES_SERIALIZED = CATEGORY_ATTRIBUTES.join(',')

export async function getAnimeById(
  animeId: string,
  init: Omit<RequestInit, 'method'> = {}
): Promise<ResponseWithData<GetAnimeByIdDeserialized['data']>> {
  const searchParams = new URLSearchParams({
    'fields[anime]': ANIME_ATTRIBUTES_SERIALIZED,
    'fields[categories]': CATEGORY_ATTRIBUTES_SERIALIZED,
    include: 'categories',
  }).toString()

  const url = `${KITSU_API_URL}/anime/${animeId}?${searchParams}`

  const response = await fetchWithType<GetAnimeByIdResponse>(url, init)
  if (!response.ok) {
    return response
  }

  const categories = response.data.included?.map(category => category.attributes.title) ?? null

  const { data } = deserialise(response.data) as GetAnimeByIdDeserialized
  data.categories = categories

  return { data, status: response.status, ok: response.ok }
}
