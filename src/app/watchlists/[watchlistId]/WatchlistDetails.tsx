import { WatchlistCollaborators } from './WatchlistCollaborators'

import type { Watchlist } from '@/types/watchlists'

type WatchlistDescriptionProps = {
  watchlist: Watchlist
  isList?: boolean
}

export function WatchlistDetails({ watchlist, isList }: WatchlistDescriptionProps) {
  return (
    <dl>
      <dt className="pb-2 text-sm font-bold sm:text-lg">Description</dt>
      <dd className="pb-4 text-sm">{watchlist.description}</dd>

      <dt className="text-sm font-bold sm:text-lg lg:pb-0">Collaborators</dt>
      <dd className="pb-4 lg:pb-6">
        <WatchlistCollaborators watchlistId={watchlist.id} isList={isList} />
      </dd>
      <dd className="text-sm">Last updated: {watchlist.updated_at.slice(0, 10)}</dd>
      <dd className="text-sm">Created: {watchlist.created_at.slice(0, 10)}</dd>
    </dl>
  )
}
