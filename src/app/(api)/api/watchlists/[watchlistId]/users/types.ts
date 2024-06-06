import type { watchlistCollaboratorRequestBodySchema } from './schemas'
import type { Exactify, Expand } from '@/types/utils'
import type { WatchlistUser } from '@/types/watchlists'
import type { z } from 'zod'

/** Success response for /api/watchlists/:watchlistId/users */
export type GetWatchlistCollaboratorsResponse = Pick<
  WatchlistUser,
  'role' | 'user_id' | 'username' | 'avatar_url'
>[]

export type GetWatchlistCollaboratorsRequestBody = Expand<
  Exactify<z.infer<typeof watchlistCollaboratorRequestBodySchema>>
>
