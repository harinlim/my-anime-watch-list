import { fetchWithType } from '@/lib/api'
import { proxyRequestHeaders } from '@/lib/headers'
import { withBaseURL } from '@/lib/url'

import { UserWatchlistsTable } from './UserWatchlistsTable'

import type { GetUserWatchlistOverviewsResponse } from '@/api/users/[username]/watchlists/types'

type Props = {
  username: string
  limit: number
  minWidth?: number
}

export async function UserWatchlistsTableContainer({ minWidth, username, limit }: Props) {
  const watchlistsResponse = await fetchWithType<GetUserWatchlistOverviewsResponse>(
    withBaseURL(`/api/users/${username}/watchlists?overview=true&limit=${limit}`),
    {
      method: 'GET',
      credentials: 'include',
      headers: proxyRequestHeaders(),
    }
  )

  return (
    <UserWatchlistsTable
      initialData={watchlistsResponse.data?.ok ? watchlistsResponse.data : null}
      username={username}
      limit={limit}
      minWidth={minWidth}
    />
  )
}
