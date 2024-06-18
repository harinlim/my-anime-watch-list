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
  const { mutate, isPending } = useEditWatchlist(watchlist.id)
  const router = useRouter()

  const onSuccess = () => {
    revalidate(returnUrl)
    revalidate(`/watchlists/${watchlist.id}`)

    if (returnUrl) {
      router.push(returnUrl)
    } else {
      router.push(`/watchlists/${watchlist.id}`)
    }
  }

  return (
    <WatchlistForm
      watchlist={watchlist}
      mutate={mutate}
      onSuccess={onSuccess}
      isPending={isPending}
    />
  )
}
