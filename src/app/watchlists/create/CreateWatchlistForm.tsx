'use client'

import { useRouter } from 'next/navigation'

import { WatchlistForm } from '@/components/watchlists/WatchlistForm'
import { useCreateWatchlist } from '@/data/use-create-watchlist'

import type { CreateWatchlistResponse } from '@/api/watchlists/types'

export function CreateWatchlistForm({ nextUrl }: { nextUrl: string | null }) {
  const { isPending, mutate, isSuccess } = useCreateWatchlist()
  const router = useRouter()

  const onSuccess = (data?: CreateWatchlistResponse) => {
    if (nextUrl) {
      router.push(nextUrl)
    } else if (data) {
      router.push(`/watchlists/${data.watchlistId}`)
    }
  }

  const isSubmitting = isPending || isSuccess

  return <WatchlistForm mutate={mutate} onSuccess={onSuccess} isSubmitting={isSubmitting} />
}
