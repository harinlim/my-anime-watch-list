import type { WatchlistUser } from '@/types/watchlists'

/** Success response for /api/watchlists/:watchlistId/users */
export type GetWatchlistCollaboratorsResponse = Pick<
  WatchlistUser,
  'role' | 'user_id' | 'username' | 'avatar_url'
>[]
