'use client'

import { usePathname, useRouter } from 'next/navigation'

import { WatchlistForm } from '@/components/watchlists/WatchlistForm'
import { useCreateWatchlist } from '@/data/use-create-watchlist'
import { revalidate } from '@/lib/next/revalidate'

import type { CreateWatchlistResponse } from '@/api/watchlists/types'

export function CreateWatchlistForm({ nextUrl }: { nextUrl: string | null }) {
  const { isPending, mutate, isSuccess } = useCreateWatchlist()
  const currentPath = usePathname()
  const router = useRouter()

  const onSuccess = (data?: CreateWatchlistResponse) => {
    revalidate(currentPath)
    if (nextUrl) {
      router.push(nextUrl)
    } else if (data) {
      router.push(`/watchlists/${data.watchlistId}`)
    }
  }

  const isSubmitting = isPending || isSuccess

  return <WatchlistForm mutate={mutate} onSuccess={onSuccess} isSubmitting={isSubmitting} />
}
