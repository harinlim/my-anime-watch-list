import { Title, Text } from '@mantine/core'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

import { AnimeTable } from '@/app/watchlists/[watchlistId]/AnimeTable'
import { fetchWithType, withBaseURL } from '@/lib/api'

import { WatchlistCollaborators } from './WatchlistCollaborators'

import type { Watchlist } from '@/types/watchlists'

export default async function WatchlistPage({ params }: { params: { watchlistId: string } }) {
  const { watchlistId } = params

  const watchlistResponse = await fetchWithType<Watchlist>(
    withBaseURL(`/api/watchlists/${watchlistId}`),
    {
      method: 'GET',
      credentials: 'include',
      headers: new Headers(headers()),
    }
  )

  if (watchlistResponse.status === 404) {
    return notFound()
  }

  if (!watchlistResponse.ok) {
    throw new Error('Failed to fetch watchlist')
  }

  const watchlist = watchlistResponse.data

  return (
    <div className="flex min-h-full flex-col items-center justify-center space-y-6 p-8">
      <Title order={1}>
        <Text inherit variant="gradient" component="span" gradient={{ from: 'blue', to: 'red' }}>
          {watchlist.title}
        </Text>
      </Title>
      <pre className="text-wrap">{JSON.stringify(watchlist, null, 2)}</pre>

      <div className="flex w-full flex-col justify-around gap-12 md:flex-row-reverse">
        <div className="min-w-60 grow basis-1/4">
          <h2 className="text-lg font-semibold">Collaborators</h2>
          <WatchlistCollaborators watchlistId={watchlistId} />
        </div>

        <div className="shrink basis-2/3">
          <h2 className="text-lg font-semibold">Anime</h2>
          <AnimeTable watchlistId={watchlistId} />
        </div>
      </div>
    </div>
  )
}
