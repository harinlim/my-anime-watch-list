import { Title } from '@mantine/core'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { ProfileContent } from '@/components/profile/ProfileContent'
import { ArticlesCardsGrid } from '@/components/watchlists/ArticleCardsGrid'
import { CreateWatchlistButton } from '@/components/watchlists/CreateWatchlistButton'
import { WatchlistCard } from '@/components/watchlists/WatchlistCard'
import { getUserFromAuth } from '@/db/users'
import { fetchWithType } from '@/lib/api'
import { proxyRequestHeaders } from '@/lib/headers'
import { createServerClient } from '@/lib/supabase/server'
import { withBaseURL } from '@/lib/url'

import type { WatchlistOverview } from '@/types/watchlists'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/** Private profile page, accessible only to the user with cookies */
export default async function SelfProfilePage() {
  const supabase = createServerClient()

  // We use the latest profile information from the auth table
  const { data: user } = await getUserFromAuth(supabase)

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
      headers: proxyRequestHeaders(),
    }
  )

  return (
    <div className="flex justify-center">
      <div className="flex min-h-full w-full flex-col space-y-6 p-8 lg:max-w-5xl">
        <ProfileContent user={user}>
          <div className="flex items-center justify-between pb-5 pt-10">
            <Title order={2} className="text-4xl">
              Watchlists
            </Title>
            <CreateWatchlistButton />
          </div>

          <div className="flex h-96 flex-col justify-center gap-5 bg-black md:w-full" />
          <Title order={2} className="pb-5 pt-10 text-4xl">
            Anime
          </Title>
          <div className="flex h-96 flex-col justify-center gap-5 bg-black md:w-full" />
        </ProfileContent>
        {/* <pre className="text-wrap text-left">{JSON.stringify(watchlists, null, 2)}</pre> */}
        <WatchlistCard />
        <ArticlesCardsGrid />
      </div>
    </div>
  )
}
