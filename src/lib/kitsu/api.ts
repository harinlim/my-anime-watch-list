import { deserialise } from 'kitsu-core'

import { fetchWithType } from '@/lib/api'
import { ANIME_ATTRIBUTES, CATEGORY_ATTRIBUTES } from '@/lib/kitsu/types'

import type {
  GetAnimeByIdDeserializedResponse,
  GetAnimeByIdResponse,
  PaginationMetadata as KitsuPaginationMetadata,
  PaginationLinks as KitsuPaginationLinks,
  SearchAnimeDeserializedResponse,
} from './types'
import type { ResponseWithData, ResponseWithDataPaginated, PaginationMetadata } from '@/types/api'

const KITSU_API_URL = 'https://kitsu.io/api/edge'

const ANIME_ATTRIBUTES_SERIALIZED = ANIME_ATTRIBUTES.join(',')
const CATEGORY_ATTRIBUTES_SERIALIZED = CATEGORY_ATTRIBUTES.join(',')

function getPaginationMetadata(
  meta: KitsuPaginationMetadata,
  links: KitsuPaginationLinks
): PaginationMetadata {
  const total = meta.count

  const limit = Number(new URL(links.first).searchParams.get('page[size]'))

  const prev = links.prev ? Number(new URL(links.prev).searchParams.get('page[number]')) : undefined
  const next = links.next ? Number(new URL(links.next).searchParams.get('page[number]')) : undefined

  return { total, limit, prev, next }
}

export async function searchAnime(
  params: unknown,
  init: Omit<RequestInit, 'method'> = {}
): Promise<ResponseWithDataPaginated<SearchAnimeDeserializedResponse['data']>> {
  const searchParams = {
    sort: '-userCount',
    'fields[anime]': ANIME_ATTRIBUTES_SERIALIZED,

    // TODO: Categories don't come in `relationships` when using `include` via search params. Explore this later.
    // 'fields[categories]': CATEGORY_ATTRIBUTES_SERIALIZED,
    // include: 'categories',
  }

  const url = `${KITSU_API_URL}/anime?${new URLSearchParams(searchParams).toString()}`

  const response = await fetchWithType<GetAnimeByIdResponse>(url, {
    ...init,
    headers: {
      ...init.headers,
      'Content-Type': 'application/vnd.api+json',
    },
  })
  if (!response.ok) {
    return response
  }

  const { data, meta, links } = deserialise(response.data) as SearchAnimeDeserializedResponse

  return {
    data,
    status: response.status,
    ok: response.ok,
    meta: getPaginationMetadata(meta, links),
  }
}

export async function getAnimeById(
  animeId: string,
  init: Omit<RequestInit, 'method'> = {}
): Promise<ResponseWithData<GetAnimeByIdDeserializedResponse['data']>> {
  const searchParams = {
    'fields[anime]': ANIME_ATTRIBUTES_SERIALIZED,
    'fields[categories]': CATEGORY_ATTRIBUTES_SERIALIZED,
    include: 'categories',
  }

  const url = `${KITSU_API_URL}/anime/${animeId}?${new URLSearchParams(searchParams).toString()}`

  const response = await fetchWithType<GetAnimeByIdResponse>(url, {
    ...init,
    headers: {
      ...init.headers,
      'Content-Type': 'application/vnd.api+json',
    },
  })
  if (!response.ok) {
    return response
  }

  const categories = response.data.included?.map(category => category.attributes.title) ?? null

  const { data } = deserialise(response.data) as GetAnimeByIdDeserializedResponse
  data.categories = categories

  return { data, status: response.status, ok: response.ok }
}
