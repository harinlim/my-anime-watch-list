import { Title, Text } from '@mantine/core'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

import { fetchWithType, withBaseURL } from '@/lib/api'

import type { Watchlist } from '@/types/watchlists'

export default async function WatchlistPage({ params }: { params: { watchlistId: string } }) {
  const { watchlistId } = params

  const {
    data: watchlist,
    status,
    ok,
  } = await fetchWithType<Watchlist>(withBaseURL(`/api/watchlists/${watchlistId}`), {
    method: 'GET',
    credentials: 'include',
    headers: new Headers(headers()),
  })

  if (status === 404) {
    return notFound()
  }

  if (!ok) {
    throw new Error('Failed to fetch watchlist')
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center space-y-6 p-8">
      <Title order={1}>
        <Text inherit variant="gradient" component="span" gradient={{ from: 'blue', to: 'red' }}>
          {watchlist.title}
        </Text>
      </Title>
      <pre className="text-wrap text-left">{JSON.stringify(watchlist, null, 2)}</pre>

      {/* TODO: Render anime list */}
    </div>
  )
}
