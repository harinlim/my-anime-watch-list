import { Title } from '@mantine/core'
import { headers } from 'next/headers'

import { fetchWithType, withBaseURL } from '@/lib/api'

import { WatchlistModal } from '../../../components/watchlists/WatchlistModal'

import type { Watchlist } from '@/types/watchlists'

type Props = {
  username?: string
  animeId: string
  addedWatchlists: Set<number>
}

// TODO: Allow adding to watchlist
export async function WatchlistSelect({ username, animeId, addedWatchlists }: Props) {
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
      <Title order={2}>Actions</Title>
      <div className="my-4 flex">
        <WatchlistModal
          animeId={animeId}
          editableWatchlists={watchlistsResponse.data}
          initialAddedWatchlists={addedWatchlists}
        />
      </div>
    </>
  )
}
