import { Title, Text } from '@mantine/core'
import { notFound } from 'next/navigation'

import { ArticlesCardsGrid } from '@/components/watchlists/ArticleCardsGrid'
import { WatchlistCard } from '@/components/watchlists/WatchlistCard'
import { fetchWithType } from '@/lib/api'
import { proxyRequestHeaders } from '@/lib/headers'
import { withBaseURL } from '@/lib/url'

import type { PublicUser } from '@/types/users'
import type { WatchlistOverview } from '@/types/watchlists'

async function fetchWatchlistOverviews(username: string, init?: Omit<RequestInit, 'method'>) {
  return fetchWithType<WatchlistOverview[]>(
    withBaseURL(`/api/users/${username}/watchlists?overview=true&editable=true`),
    {
      method: 'GET',
      credentials: 'include',
      ...init,
    }
  )
}

async function fetchUserByUsername(username: string, init?: Omit<RequestInit, 'method'>) {
  return fetchWithType<PublicUser>(withBaseURL(`/api/users/${username}`), {
    method: 'GET',
    credentials: 'include',
    ...init,
  })
}

/** Public profile page */
export default async function ExternalProfilePage({ params }: { params: { username: string } }) {
  const { username } = params

  const headersInit = proxyRequestHeaders()

  // TODO: put these into independent components
  const userResponse = await fetchUserByUsername(username, { headers: headersInit })

  const watchlistsResponse = await fetchWatchlistOverviews(username, { headers: headersInit })

  // These only return 404 when the user is not found
  if (userResponse.status === 404 || watchlistsResponse.status === 404) {
    return notFound()
  }

  if (!userResponse.ok) {
    throw new Error('Failed to fetch user')
  }

  if (!watchlistsResponse.ok) {
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
      <pre className="text-wrap text-left">{JSON.stringify(userResponse.data, null, 2)}</pre>
      <pre className="text-wrap text-left">{JSON.stringify(watchlistsResponse.data, null, 2)}</pre>
      <WatchlistCard />
      <ArticlesCardsGrid />
    </div>
  )
}
