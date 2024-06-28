import { Title } from '@mantine/core'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { ProfileHeader } from '@/app/profile/components/ProfileHeader'
import { fetchWithType } from '@/lib/api'
import { proxyRequestHeaders } from '@/lib/headers'
import { withBaseURL } from '@/lib/url'

import {
  UserWatchlistsTableSkeleton,
  UserWatchlistsTableContainer,
} from '../components/UserWatchlistsTable'

import type { PublicUser } from '@/types/users'

const WATCHLISTS_PER_PAGE = 5

/** Public profile page */
export default async function ExternalProfilePage({ params }: { params: { username: string } }) {
  const { username } = params

  // TODO: put these into independent components
  const userResponse = await fetchWithType<PublicUser>(withBaseURL(`/api/users/${username}`), {
    method: 'GET',
    credentials: 'include',
    headers: proxyRequestHeaders(),
  })

  // These only return 404 when the user is not found
  if (userResponse.status === 404) {
    return notFound()
  }

  if (!userResponse.ok) {
    throw new Error('Failed to fetch user')
  }

  const user = userResponse.data

  return (
    <div className="m-auto flex min-h-full w-full flex-col justify-center space-y-6 px-6 py-8 sm:px-8 lg:max-w-5xl">
      <ProfileHeader user={user} />

      <section>
        <div className="flex items-center justify-between pb-5 pt-10">
          <Title order={2} className="text-3xl sm:text-4xl">
            Watchlists
          </Title>
        </div>

        <Suspense fallback={<UserWatchlistsTableSkeleton limit={WATCHLISTS_PER_PAGE} />}>
          <UserWatchlistsTableContainer username={user.username} limit={WATCHLISTS_PER_PAGE} />
        </Suspense>
      </section>
    </div>
  )
}
