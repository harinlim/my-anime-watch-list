import { Title, Text } from '@mantine/core'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { ArticlesCardsGrid } from '@/components/watchlists/ArticleCardsGrid'
import { WatchlistCard } from '@/components/watchlists/WatchlistCard'
import { fetchWithType, withBaseURL } from '@/lib/api'

import type { User } from '@/types/users'
import type { WatchlistOverview } from '@/types/watchlists'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/** Private profile page, accessible only to the user with cookies */
export default async function SelfProfilePage() {
  const { data: user } = await fetchWithType<User>(withBaseURL('/api/users'), {
    method: 'GET',
    credentials: 'include',
    headers: new Headers(headers()),
  })

  // Use this to get user auth cookies needed for API testing
  if (process.env.NODE_ENV === 'development') {
    console.info(headers().get('cookie'))
  }

  if (!user?.id) {
    return redirect('/login')
  }

  const { data: watchlists } = await fetchWithType<WatchlistOverview[]>(
    withBaseURL(`/api/users/${user.username}/watchlists?overview=true`),
    {
      method: 'GET',
      credentials: 'include',
      headers: new Headers(headers()),
    }
  )

  return (
    <div className="flex min-h-full flex-col items-center justify-center space-y-6 p-8">
      <Title order={1}>
        <Text inherit variant="gradient" component="span" gradient={{ from: 'blue', to: 'red' }}>
          @{user.username}
        </Text>
        &apos;s Watchlists
      </Title>
      <pre className="text-wrap text-left">{JSON.stringify(watchlists, null, 2)}</pre>
      <WatchlistCard />
      <ArticlesCardsGrid />
    </div>
  )
}
