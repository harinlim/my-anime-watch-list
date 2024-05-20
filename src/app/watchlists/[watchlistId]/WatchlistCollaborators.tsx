import { Text } from '@mantine/core'
import { headers } from 'next/headers'

import { Avatar, AvatarGroup } from '@/components/watchlists/AvatarGroup'
import { fetchWithType, withBaseURL } from '@/lib/api'

import type { WatchlistUser } from '@/types/watchlists'

type Props = {
  watchlistId: number
  isList?: boolean
}

export async function WatchlistCollaborators({ watchlistId, isList }: Props) {
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
    <div>
      {isList ? (
        <ul className="flex flex-col gap-2 pt-4">
          {collaboratorsResponse.data.map(collaborator => (
            <li key={collaborator.user_id} className="flex items-center gap-3">
              <Avatar user={collaborator} />
              <Text size="md">@{collaborator.username}</Text>
            </li>
          ))}
        </ul>
      ) : (
        <div className="pt-2">
          <AvatarGroup watchlistId={watchlistId} watchlist_users={collaboratorsResponse.data} />
        </div>
      )}
    </div>
    // <pre className="whitespace-pre-wrap text-wrap break-words text-left">
    //   {JSON.stringify(collaboratorsResponse, null, 2)}
    // </pre>
  )
}
