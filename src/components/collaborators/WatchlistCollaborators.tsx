'use client'

import { Text } from '@mantine/core'

import { Avatar, AvatarGroup } from '@/components/watchlists/AvatarGroup'

import { useCollaboratorsQuery } from './CollaboratorsContext'
import { useEditCollaboratorsModal } from './CollaboratorsModal/CollaboratorsModalContext'

type Props = {
  watchlistId: number | string
} & (
  | {
      isList: true
      maxAvatars?: never
    }
  | {
      isList?: false
      maxAvatars: number
    }
)

export function WatchlistCollaborators({ watchlistId, isList, maxAvatars }: Props) {
  const [, editCollaboratorsModal] = useEditCollaboratorsModal()

  const { data: collaborators } = useCollaboratorsQuery()

  return (
    <div>
      {isList ? (
        <ul className="flex flex-col gap-2 pt-4">
          {collaborators.map(collaborator => (
            <li key={collaborator.user_id} className="flex items-center gap-3">
              <Avatar asLink user={collaborator} />
              <Text size="md">@{collaborator.username}</Text>
            </li>
          ))}
        </ul>
      ) : (
        <div className="pt-2">
          <AvatarGroup
            watchlistId={watchlistId}
            watchlist_users={collaborators}
            onClickMore={editCollaboratorsModal.open}
            maxAvatars={maxAvatars}
          />
        </div>
      )}
    </div>
    // <pre className="whitespace-pre-wrap text-wrap break-words text-left">
    //   {JSON.stringify(collaboratorsResponse, null, 2)}
    // </pre>
  )
}
