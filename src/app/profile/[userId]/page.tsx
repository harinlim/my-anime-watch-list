import { Title, Text } from '@mantine/core'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'

import { ArticlesCardsGrid } from '@/components/watchlists/ArticleCardsGrid'
import { WatchlistCard } from '@/components/watchlists/WatchlistCard'
import { fetchWithType, withBaseURL } from '@/lib/api'

import type { User } from '@/api/users/types'

/** Public profile page */
export default async function ExternalProfilePage() {
  const { data: user } = await fetchWithType<User>(withBaseURL('/api/users'), {
    method: 'GET',
    credentials: 'include',
    headers: headers(),
  })

  if (!user?.id) {
    return notFound()
  }

  return (
    <div className="min-h-full flex flex-col justify-center items-center space-y-6 p-8">
      <Title order={1}>
        <Text inherit variant="gradient" component="span" gradient={{ from: 'blue', to: 'red' }}>
          @{user.username}
        </Text>
        &apos;s Watchlists
      </Title>
      <WatchlistCard />
      <ArticlesCardsGrid />
    </div>
  )
}
