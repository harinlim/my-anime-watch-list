import type { WatchlistUser } from './watchlists'

export enum ROLE {
  Owner = 'owner',
  Editor = 'editor',
  Viewer = 'viewer',
}

export type GroupedCollaborators = Record<string, WatchlistUser[]>

export type ChangableRoleUser = Omit<WatchlistUser, 'role'> & { role: ChangableRole }
export type ChangableRole = ROLE.Editor | ROLE.Viewer
export type Role = ROLE.Owner | ChangableRole
