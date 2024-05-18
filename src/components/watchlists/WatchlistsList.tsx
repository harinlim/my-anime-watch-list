'use client'

import { Button, Loader } from '@mantine/core'
import { useSearchParams } from 'next/navigation'
import { Fragment } from 'react'

import { useWatchlistsSearch } from '@/data/use-watchlist-search'

import { WatchlistRow } from './WatchlistRow'

import type { SearchWatchlistsSortType } from '@/app/(api)/api/watchlists/types'

type Props = {
  filter?: string
  sort?: SearchWatchlistsSortType
}

export function WatchlistsList({ filter, sort }: Props) {
  const searchParams = useSearchParams()

  const { data, isFetching, isFetchingNextPage, error, hasNextPage, fetchNextPage } =
    useWatchlistsSearch({
      search: searchParams.get('search') ?? filter,
      sort: (searchParams.get('sort') as SearchWatchlistsSortType) ?? sort,
    })

  return (
    <>
      <div className="flex w-5/6 flex-col flex-wrap justify-center gap-5 md:w-2/3">
        {data?.pages?.map(page => (
          // TODO: separate each item into component
          // TODO: handle API errors
          <Fragment key={`${page.meta?.total}-${page.meta?.self}`}>
            {page.data?.map(watchlist => <WatchlistRow key={watchlist.id} watchlist={watchlist} />)}
          </Fragment>
        ))}
      </div>
      {isFetching && <Loader color="cyan" type="bars" />}
      {error && <div>Error: {error.message}</div>}

      {!isFetching && hasNextPage && (
        <Button
          type="button"
          className="mt-10"
          disabled={isFetchingNextPage}
          onClick={async () => fetchNextPage()}
        >
          Load More
        </Button>
      )}
    </>
  )
}
