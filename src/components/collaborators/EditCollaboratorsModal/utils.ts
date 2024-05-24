import type { WatchlistUser } from '@/types/watchlists'

export function sortCollaboratorsByRole(collaborators: WatchlistUser[]) {
  const result = Object.groupBy(collaborators, ({ role }) => role)

  const owner = result.owner ?? []
  const editor = result.editor ?? []
  const viewer = result.viewer ?? []

  return [...owner, ...editor, ...viewer]
}
