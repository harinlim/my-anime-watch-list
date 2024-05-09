'use client'

import { Button } from '@mantine/core'

import { useAnimeSearch } from '@/data/use-anime-search'

export function AnimeList() {
  const { data, isFetching, isFetchingNextPage, error, fetchNextPage } = useAnimeSearch()

  return (
    <div>
      <div>
        {data?.pages.map(page => (
          // TODO: separate each item into component
          // TODO: handle API errors
          <div key={`${page.meta?.total}-${page.meta?.self}`}>
            {page.data?.map(anime => <div key={anime.id}>{anime.canonicalTitle}</div>)}
          </div>
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
    </div>
  )
}
