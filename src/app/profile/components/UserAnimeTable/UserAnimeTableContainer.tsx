import { fetchWithType } from '@/lib/api'
import { proxyRequestHeaders } from '@/lib/headers'
import { withBaseURL } from '@/lib/url'

import { UserAnimeTable } from './UserAnimeTable'

import type { GetUserAnimeResponse } from '@/app/(api)/api/users/[username]/anime/types'

type Props = {
  username: string
  limit: number
  minWidth?: number
}

export async function UserAnimeTableContainer({ minWidth, username, limit }: Props) {
  const animeResponse = await fetchWithType<GetUserAnimeResponse>(
    withBaseURL(`/api/users/${username}/anime?limit=${limit}`),
    {
      method: 'GET',
      credentials: 'include',
      headers: proxyRequestHeaders(),
    }
  )

  return (
    <UserAnimeTable
      initialData={animeResponse.data?.ok ? animeResponse.data : null}
      username={username}
      limit={limit}
      minWidth={minWidth}
    />
  )
}
