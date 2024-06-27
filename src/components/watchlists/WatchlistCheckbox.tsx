import { Checkbox } from '@mantine/core'
import { useCallback } from 'react'

import { useAddWatchlistAnime } from '@/data/use-add-watchlist-anime'
import { useRemoveWatchlistAnime } from '@/data/use-remove-watchlist-anime'

import type { ChangeEventHandler } from 'react'

type Props = {
  id: string
  animeId: string
  watchlistId: number
  defaultChecked?: boolean
}

export function WatchlistCheckbox({ id, animeId, watchlistId, defaultChecked = false }: Props) {
  const { mutate: addToWatchlist } = useAddWatchlistAnime()
  const { mutate: removeFromWatchlist } = useRemoveWatchlistAnime()

  const handleToggle = useCallback<ChangeEventHandler<HTMLInputElement>>(
    event => {
      // TODO: handle debounce and internal state (useOptimistic?)
      if (event.currentTarget.checked) {
        void addToWatchlist({ watchlistId, animeId })
      } else {
        void removeFromWatchlist({ watchlistId, animeId })
      }
    },
    [animeId, watchlistId, addToWatchlist, removeFromWatchlist]
  )

  return (
    <Checkbox
      id={id}
      defaultChecked={defaultChecked}
      variant="outline"
      size="md"
      onChange={handleToggle}
    />
  )
}
