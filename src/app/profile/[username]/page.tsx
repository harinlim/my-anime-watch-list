import { Title } from '@mantine/core'
import { notFound } from 'next/navigation'

import { ProfileContent } from '@/components/profile/ProfileContent'
import { CreateWatchlistButton } from '@/components/watchlists/CreateWatchlistButton'
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
    <div className="flex justify-center">
      <div className="flex min-h-full w-full flex-col space-y-6 p-8 lg:max-w-5xl">
        <ProfileContent user={userResponse.data}>
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
      </div>
    </div>
  )
}
