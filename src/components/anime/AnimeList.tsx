'use client'

import { Button, Loader } from '@mantine/core'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Fragment } from 'react'

import { useAnimeSearch } from '@/data/use-anime-search'

import { AnimeCard } from './AnimeCard'

import type { SearchAnimeSortType } from '@/api/anime/types'

type Props = {
  filter?: string
  sort?: SearchAnimeSortType
}

export function AnimeList({ filter, sort }: Props) {
  const searchParams = useSearchParams()

  const { data, isFetching, isFetchingNextPage, error, hasNextPage, fetchNextPage } =
    useAnimeSearch({
      filter: searchParams.get('search') ?? filter,
      sort: (searchParams.get('sort') as SearchAnimeSortType) ?? sort,
    })

  return (
    <>
      <div className="flex w-full flex-wrap justify-center gap-4">
        {data?.pages.map(page => (
          // TODO: separate each item into component
          // TODO: handle API errors
          <Fragment key={`${page.meta?.total}-${page.meta?.self}`}>
            {page.data?.map(anime => (
              <Link key={anime.id} href={`/anime/${anime.id}`}>
                <AnimeCard
                  title={anime.canonicalTitle}
                  poster={anime.posterImage?.small}
                  rating={anime.averageRating}
                />
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
