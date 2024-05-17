import { useInfiniteQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

import { SEARCH_WATCHLISTS_SORT_TYPES } from '@/api/watchlists/types'

import type {
  SearchWatchlistsQueryParams,
  SearchWatchlistsResponse,
  SearchWatchlistsSortType,
} from '@/api/watchlists/types'

const PAGE_SIZE = 10

export function useWatchlistsSearch({
  search,
  sort,
  limit,
}: {
  search?: string
  sort?: SearchWatchlistsSortType
  limit?: number
} = {}) {
  const fetchWatchlists = useCallback(
    async ({ pageParam = 1, signal }: { pageParam?: number; signal: AbortSignal }) => {
      const searchParams: SearchWatchlistsQueryParams = {
        page: pageParam,
        limit: limit ?? PAGE_SIZE,
      }

      if (search) searchParams.search = search
      if (sort && SEARCH_WATCHLISTS_SORT_TYPES.includes(sort)) searchParams.sort = sort

      const response = await fetch(
        // @ts-expect-error -- we know what we're doing
        `/api/watchlists?${new URLSearchParams(searchParams).toString()}`,
        { signal }
      )
      return response.json() as Promise<SearchWatchlistsResponse>
    },
    [search, sort, limit]
  )

  return useInfiniteQuery({
    queryKey: [
      `animelist${search ? `-${search}` : ''}${sort ? `-${sort}` : ''}${limit ? `-${limit}` : ''}`,
    ],
    queryFn: fetchWatchlists,
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.meta?.next,
  })
}
