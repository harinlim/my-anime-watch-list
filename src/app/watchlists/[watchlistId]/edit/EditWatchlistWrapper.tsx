'use client'

import WatchlistForm from '@/components/watchlists/WatchlistForm'
import { useEditWatchlist } from '@/data/use-edit-watchlist'

import type { WatchlistRequestBody } from '@/app/(api)/api/watchlists/types'
import type { UseMutateFunction } from '@tanstack/react-query'

type Props = {
  returnUrl: string
  watchlistId: number
  title: string
  description: string | null
  is_public: boolean
}

export default function EditWatchlistWrapper({
  returnUrl,
  watchlistId,
  title,
  description,
  is_public,
}: Props) {
  const {
    mutate,
    isPending,
  }: {
    mutate: UseMutateFunction<undefined, Error, WatchlistRequestBody, unknown>
    isPending: boolean
  } = useEditWatchlist(watchlistId)

  return (
    <WatchlistForm
      nextUrl={returnUrl}
      watchlistId={watchlistId}
      title={title}
      description={description}
      isPublic={is_public}
      mutate={mutate}
      isPending={isPending}
    />
  )
}
