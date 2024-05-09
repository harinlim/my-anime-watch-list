import { useInfiniteQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

import type {
  SearchAnimeQueryParams,
  SearchAnimeResponse,
  SearchAnimeSortType,
} from '@/api/anime/types'

const PAGE_SIZE = 10

export function useAnimeSearch({
  filter,
  sort,
  limit,
}: {
  filter?: string
  sort?: SearchAnimeSortType
  limit?: number
} = {}) {
  const fetchAnime = useCallback(
    async ({ pageParam = 1, signal }: { pageParam?: number; signal: AbortSignal }) => {
      const searchParams: SearchAnimeQueryParams = {
        page: pageParam.toString(),
        limit: limit ?? PAGE_SIZE,
      }

      if (filter) searchParams.filter = filter
      if (sort) searchParams.sort = sort

      const response = await fetch(
        `/api/anime?${
          // @ts-expect-error -- we know what we're doing
          new URLSearchParams(searchParams).toString()
        }`,
        {
          signal,
        }
      )
      return response.json() as Promise<SearchAnimeResponse>
    },
    [filter, sort, limit]
  )

  return useInfiniteQuery({
    queryKey: ['animelist'],
    queryFn: fetchAnime,
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.meta?.next,
  })
}
