import { Text } from '@mantine/core'

import { Avatar, AvatarGroup } from '@/components/watchlists/AvatarGroup'

import type { WatchlistUser } from '@/types/watchlists'

type Props = {
  collaborators: WatchlistUser[]
  watchlistId: number | string
  isList?: boolean
}

export function WatchlistCollaborators({ collaborators, watchlistId, isList }: Props) {
  return (
    <div>
      {isList ? (
        <ul className="flex flex-col gap-2 pt-4">
          {collaborators.map(collaborator => (
            <li key={collaborator.user_id} className="flex items-center gap-3">
              <Avatar user={collaborator} />
              <Text size="md">@{collaborator.username}</Text>
            </li>
          ))}
        </ul>
      ) : (
        <div className="pt-2">
          <AvatarGroup watchlistId={watchlistId} watchlist_users={collaborators} />
        </div>
      )}
    </div>
    // <pre className="whitespace-pre-wrap text-wrap break-words text-left">
    //   {JSON.stringify(collaboratorsResponse, null, 2)}
    // </pre>
  )
}
