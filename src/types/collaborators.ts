import type { Database } from './generated/supabase'
import type { WatchlistUser } from './watchlists'

export type Role = Database['public']['Enums']['collaborator_access']

export type ChangableRole = Exclude<Role, 'owner'>

export type ChangableRoleUser = Omit<WatchlistUser, 'role'> & { role: ChangableRole }
