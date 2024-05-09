import { Title, Text } from '@mantine/core'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

import { ArticlesCardsGrid } from '@/components/watchlists/ArticleCardsGrid'
import { WatchlistCard } from '@/components/watchlists/WatchlistCard'
import { fetchWithType, withBaseURL } from '@/lib/api'

import type { Watchlist } from '@/app/api/users/[username]/watchlists/types'

/** Public profile page */
export default async function ExternalProfilePage({ params }: { params: { username: string } }) {
  const { username } = params

  const { data: watchlists, status } = await fetchWithType<Watchlist[]>(
    withBaseURL(`/api/users/${username}/watchlists`),
    {
      method: 'GET',
      credentials: 'include',
      headers: new Headers(headers()),
    }
  )

  if (status === 404) {
    return notFound()
  }

  if (status !== 200) {
    throw new Error('Failed to fetch watchlists')
  }

  return (
    <div className="min-h-full flex flex-col justify-center items-center space-y-6 p-8">
      <Title order={1}>
        <Text inherit variant="gradient" component="span" gradient={{ from: 'blue', to: 'red' }}>
          @{username}
        </Text>
        &apos;s Watchlists
      </Title>
      <pre className="text-left text-wrap">{JSON.stringify(watchlists, null, 2)}</pre>
      <WatchlistCard />
      <ArticlesCardsGrid />
    </div>
  )
}
