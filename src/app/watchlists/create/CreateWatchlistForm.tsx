'use client'

import { usePathname, useRouter } from 'next/navigation'

import WatchlistForm from '@/components/watchlists/WatchlistForm'
import { useCreateWatchlist } from '@/data/use-create-watchlist'
import revalidate from '@/utils/revalidate'

import type { CreateWatchlistResponse } from '@/types/watchlists'

export default function CreateWatchlistForm({ nextUrl }: { nextUrl: string | null }) {
  const { mutate, isPending } = useCreateWatchlist()
  const currentPath = usePathname()
  const router = useRouter()

  const onSuccess = (data: CreateWatchlistResponse | undefined) => {
    revalidate(currentPath)
    if (nextUrl) {
      router.push(nextUrl)
    } else if (data) {
      router.push(`/watchlists/${data.watchlistId}`)
    }
  }

  return (
    <WatchlistForm nextUrl={nextUrl} mutate={mutate} onSuccess={onSuccess} isPending={isPending} />
  )
}
