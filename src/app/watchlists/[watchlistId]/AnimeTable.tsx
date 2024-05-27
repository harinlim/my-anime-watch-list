import { headers } from 'next/headers'

import { fetchWithType } from '@/lib/api'
import { withBaseURL } from '@/lib/url'

import type { AnimeByWatchlist } from '@/types/anime'

export async function AnimeTable({ watchlistId }: { watchlistId: string }) {
  // TODO: make this client-side query? unless we actually do a table

  const animeResponse = await fetchWithType<AnimeByWatchlist>(
    withBaseURL(`/api/watchlists/${watchlistId}/anime`),
    {
      method: 'GET',
      credentials: 'include',
      headers: new Headers(headers()),
    }
  )

  return (
    <pre className="whitespace-pre-wrap text-wrap break-words text-left">
      {JSON.stringify(animeResponse, null, 2)}
    </pre>
  )
}
