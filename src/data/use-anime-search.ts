import { useInfiniteQuery } from '@tanstack/react-query'

import { SEARCH_ANIME_SORT_TYPES } from '@/lib/kitsu/types'

import type {
  SearchAnimeQueryParams,
  SearchAnimeResponse,
  SearchAnimeSortType,
} from '@/api/anime/types'

type UseAnimeSearchParams = {
  search?: string
  sort?: SearchAnimeSortType
  limit?: number
}

const DEFAULT_PAGE_SIZE = 10

const fetchAnime = async ({
  search,
  sort,
  limit,
  pageParam = 1,
  signal,
}: { pageParam?: number; signal: AbortSignal } & UseAnimeSearchParams) => {
  const searchParams: SearchAnimeQueryParams = {
    page: pageParam.toString(),
    limit: limit ?? DEFAULT_PAGE_SIZE,
  }

  if (search) searchParams.search = search
  if (sort && SEARCH_ANIME_SORT_TYPES.includes(sort)) searchParams.sort = sort

  const response = await fetch(
    // @ts-expect-error -- we know what we're doing
    `/api/anime?${new URLSearchParams(searchParams).toString()}`,
    { method: 'GET', signal }
  )

  if (!response.ok) {
    console.error('Failed to fetch anime', await response.json())
    throw new Error('Failed to fetch anime')
  }

  return response.json() as Promise<SearchAnimeResponse>
}

export function useAnimeInfiniteSearch(params: UseAnimeSearchParams = {}) {
  return useInfiniteQuery({
    queryKey: [`anime`, { ...params }],
    queryFn: async args => fetchAnime({ ...params, ...args }),
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.meta?.next,
  })
}
