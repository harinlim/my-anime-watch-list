import type { getWatchlistCollaborators } from './queries'

/** Success response for /api/watchlists/:watchlistId/users */
export type GetWatchlistCollaboratorsResponse = Awaited<
  ReturnType<typeof getWatchlistCollaborators>
>['data']
