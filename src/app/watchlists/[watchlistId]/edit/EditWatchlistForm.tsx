'use client'

import { useRouter } from 'next/navigation'

import { WatchlistForm } from '@/components/watchlists/WatchlistForm'
import { useEditWatchlist } from '@/data/use-edit-watchlist'
import { revalidate } from '@/lib/next/revalidate'

import type { Watchlist } from '@/types/watchlists'

type Props = {
  returnUrl: string
  // TODO: eventually use Watchlist type with camelCase keys
  watchlist: Pick<Watchlist, 'id' | 'title' | 'description' | 'is_public'>
}

export function EditWatchlistForm({ returnUrl, watchlist }: Props) {
  const { mutate, isPending, isSuccess, error } = useEditWatchlist(watchlist.id)
  const router = useRouter()

  const onSuccess = () => {
    // TODO: check if this is necessary
    if (returnUrl) {
      revalidate(returnUrl)
    }

    router.push(returnUrl ?? `/watchlists/${watchlist.id}`)
  }

  const isSubmitting = isPending || isSuccess

  return (
    <WatchlistForm
      watchlist={watchlist}
      mutate={mutate}
      onSuccess={onSuccess}
      error={error}
      isSubmitting={isSubmitting}
    />
  )
}
