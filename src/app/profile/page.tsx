import { Title } from '@mantine/core'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import { CreateWatchlistButton } from '@/components/watchlists/CreateWatchlistButton'
import { getUserFromAuth } from '@/db/users'
import { createServerClient } from '@/lib/supabase/server'

import { ProfileHeader } from './components/ProfileHeader'
import { AnimeTableSkeleton, UserAnimeTableContainer } from './components/UserAnimeTable'
import {
  UserWatchlistsTableSkeleton,
  UserWatchlistsTableContainer,
} from './components/UserWatchlistsTable'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const ANIME_PER_PAGE = 5
const WATCHLISTS_PER_PAGE = 5

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

  return (
    <div className="m-auto flex min-h-full w-full flex-col justify-center space-y-6 px-6 pb-32 pt-16 sm:px-8 lg:max-w-5xl">
      <ProfileHeader user={user} />
      <section id="watchlists">
        <div className="flex items-center justify-between pb-5 pt-10">
          <Title order={2} className="text-3xl sm:text-4xl">
            Watchlists
          </Title>
          <CreateWatchlistButton />
        </div>

        <Suspense fallback={<UserWatchlistsTableSkeleton limit={WATCHLISTS_PER_PAGE} />}>
          <UserWatchlistsTableContainer username={user.username} limit={WATCHLISTS_PER_PAGE} />
        </Suspense>
      </section>
      <section id="anime">
        <div className="flex items-center justify-start pb-5 pt-10">
          <Title order={2} className="text-3xl sm:text-4xl">
            Anime
          </Title>
        </div>
        <Suspense fallback={<AnimeTableSkeleton limit={ANIME_PER_PAGE} />}>
          <UserAnimeTableContainer username={user.username} limit={ANIME_PER_PAGE} />
        </Suspense>
      </section>
    </div>
  )
}
