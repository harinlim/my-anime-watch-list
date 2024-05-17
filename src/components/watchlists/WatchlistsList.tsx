'use client'

import { Button, Card, Loader, Text } from '@mantine/core'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Fragment } from 'react'

import { useWatchlistsSearch } from '@/data/use-watchlist-search'

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
      <div className="flex w-full flex-wrap justify-center gap-4">
        {data?.pages.map(page => (
          // TODO: separate each item into component
          // TODO: handle API errors
          <Fragment key={`${page.meta?.total}-${page.meta?.self}`}>
            {page.data?.map(watchlist => (
              <Link key={watchlist.id} href={`/watchlists/${watchlist.id}`}>
                <Card className="border-red-400">
                  <Text c="dimmed" size="xs" tt="uppercase" fw={700} mt="md">
                    {watchlist.title}
                  </Text>
                  <pre className="text-wrap text-left">{JSON.stringify(watchlist, null, 2)}</pre>
                </Card>
              </Link>
            ))}
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
