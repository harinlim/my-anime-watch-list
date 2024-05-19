'use client'

import { Checkbox } from '@mantine/core'
import { useCallback } from 'react'

import type { ChangeEventHandler } from 'react'

type Props = {
  id: string
  animeId: string
  watchlistId: number
  defaultChecked?: boolean
}

async function addToWatchlist(animeId: string, watchlistId: number) {
  return fetch(`/api/watchlists/${watchlistId}/anime`, {
    method: 'POST',
    body: JSON.stringify({ animeId }),
  })
}

async function removeFromWatchlist(animeId: string, watchlistId: number) {
  return fetch(`/api/watchlists/${watchlistId}/anime/${animeId}`, {
    method: 'DELETE',
  })
}

export function WatchlistCheckbox({ id, animeId, watchlistId, defaultChecked = false }: Props) {
  const handleToggle = useCallback<ChangeEventHandler<HTMLInputElement>>(
    event => {
      // TODO: handle debounce and internal state (useOptimistic?)
      if (event.currentTarget.checked) {
        void addToWatchlist(animeId, watchlistId)
      } else {
        void removeFromWatchlist(animeId, watchlistId)
      }
    },
    [animeId, watchlistId]
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
