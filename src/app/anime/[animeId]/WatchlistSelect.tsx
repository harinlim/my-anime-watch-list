import { headers } from 'next/headers'

import { fetchWithType, withBaseURL } from '@/lib/api'

import type { Watchlist } from '@/types/watchlists'

type Props = {
  username?: string
}

// TODO: Allow adding to watchlist
export async function WatchlistSelect({ username }: Props) {
  const watchlistsResponse = await fetchWithType<Watchlist[]>(
    // Get only editable watchlists that anime can be added to
    withBaseURL(`/api/users/${username}/watchlists?editable=true`),
    {
      method: 'GET',
      credentials: 'include',
      headers: new Headers(headers()),
    }
  )

  // TODO: handle error boundaries here
  if (!watchlistsResponse.ok) {
    throw new Error('Failed to fetch watchlists')
  }

  // TODO: make a client-side component for selecting and adding to watchlist?
  // -- Fetch should be server-side tho, via this server component
  return (
    <>
      <h3 className="text-lg font-bold">My Watchlists</h3>
      <pre className="whitespace-pre-wrap text-wrap break-words text-left">
        {JSON.stringify(watchlistsResponse, null, 2)}
      </pre>
    </>
  )
}
