import { fetchWithType } from '@/lib/api'
import { proxyRequestHeaders } from '@/lib/headers'
import { withBaseURL } from '@/lib/url'

import { WatchlistAnimeDataTable } from './WatchlistAnimeDataTable'

import type { GetWatchlistAnimeResponse } from '@/api/watchlists/[watchlistId]/anime/types'

type Props = {
  watchlistId: number
  limit: number
}

export async function WatchlistAnimeTable({ watchlistId, limit }: Props) {
  const animeResponse = await fetchWithType<GetWatchlistAnimeResponse>(
    withBaseURL(`/api/watchlists/${watchlistId}/anime?limit=${limit}`),
    {
      method: 'GET',
      credentials: 'include',
      headers: proxyRequestHeaders(),
    }
  )

  // TODO: elaborate on errors
  if (!animeResponse.ok || !animeResponse.data.ok) {
    return null
  }

  return (
    <WatchlistAnimeDataTable
      initialData={animeResponse.data}
      watchlistId={watchlistId}
      limit={limit}
    />
  )
}
