import { headers } from 'next/headers'

import { fetchWithType, withBaseURL } from '@/lib/api'

import type { WatchlistUser } from '@/types/watchlists'

export async function WatchlistCollaborators({ watchlistId }: { watchlistId: string }) {
  const collaboratorsResponse = await fetchWithType<WatchlistUser[]>(
    withBaseURL(`/api/watchlists/${watchlistId}/users`),
    {
      method: 'GET',
      credentials: 'include',
      headers: new Headers(headers()),
    }
  )

  // TODO: handle error boundaries here
  if (!collaboratorsResponse.ok) {
    throw new Error('Failed to fetch collaborators')
  }

  return (
    <pre className="whitespace-pre-wrap text-wrap break-words text-left">
      {JSON.stringify(collaboratorsResponse, null, 2)}
    </pre>
  )
}
