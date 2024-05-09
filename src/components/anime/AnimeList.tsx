'use client'

import { Button } from '@mantine/core'
import Link from 'next/link'
import { Fragment } from 'react'

import { useAnimeSearch } from '@/data/use-anime-search'

import { AnimeCard } from './AnimeCard'

import type { SearchAnimeSortType } from '@/api/anime/types'

type Props = {
  filter?: string
  sort?: SearchAnimeSortType
  limit?: number
}

export function AnimeList({ filter, sort, limit }: Props) {
  const { data, isFetching, isFetchingNextPage, error, fetchNextPage } = useAnimeSearch({
    filter,
    sort,
    limit,
  })

  return (
    <>
      <div className="flex flex-wrap justify-center">
        {data?.pages.map(page => (
          // TODO: separate each item into component
          // TODO: handle API errors
          <Fragment key={`${page.meta?.total}-${page.meta?.self}`}>
            {page.data?.map(anime => (
              <Link href={`/anime/${anime.id}`}>
                <AnimeCard
                  key={anime.id}
                  title={anime.canonicalTitle}
                  poster={anime.posterImage?.small}
                  rating={anime.averageRating}
                />
              </Link>
            ))}
          </Fragment>
        ))}
      </div>
      {isFetching && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}

      <Button
        type="button"
        className="mt-10"
        disabled={isFetchingNextPage}
        onClick={async () => fetchNextPage()}
      >
        Load More
      </Button>
    </>
  )
}
