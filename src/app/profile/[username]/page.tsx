import { Title, Text } from '@mantine/core'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

import { ArticlesCardsGrid } from '@/components/watchlists/ArticleCardsGrid'
import { WatchlistCard } from '@/components/watchlists/WatchlistCard'
import { fetchWithType, withBaseURL } from '@/lib/api'

import type { WatchlistOverview } from '@/types/watchlists'

/** Public profile page */
export default async function ExternalProfilePage({ params }: { params: { username: string } }) {
  const { username } = params

  const {
    data: watchlists,
    status,
    ok,
  } = await fetchWithType<WatchlistOverview[]>(withBaseURL(`/api/users/${username}/watchlists`), {
    method: 'GET',
    credentials: 'include',
    headers: new Headers(headers()),
  })

  if (status === 404) {
    return notFound()
  }

  if (!ok) {
    throw new Error('Failed to fetch watchlists')
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center space-y-6 p-8">
      <Title order={1}>
        <Text inherit variant="gradient" component="span" gradient={{ from: 'blue', to: 'red' }}>
          @{username}
        </Text>
        &apos;s Watchlists
      </Title>
      <pre className="text-wrap text-left">{JSON.stringify(watchlists, null, 2)}</pre>
      <WatchlistCard />
      <ArticlesCardsGrid />
    </div>
  )
}
