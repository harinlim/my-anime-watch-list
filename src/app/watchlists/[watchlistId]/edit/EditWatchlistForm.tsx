'use client'

import { useRouter } from 'next/navigation'

import WatchlistForm from '@/components/watchlists/WatchlistForm'
import { useEditWatchlist } from '@/data/use-edit-watchlist'
import revalidate from '@/utils/revalidate'

type Props = {
  returnUrl: string
  watchlistId: number
  title: string
  description: string | null
  isPublic: boolean
}

export default function EditWatchlistForm({
  returnUrl,
  watchlistId,
  title,
  description,
  isPublic,
}: Props) {
  const { mutate, isPending } = useEditWatchlist(watchlistId)
  const router = useRouter()

  const onSuccess = () => {
    revalidate(returnUrl)
    revalidate(`/watchlists/${watchlistId}`)

    if (returnUrl) {
      router.push(returnUrl)
    } else {
      router.push(`/watchlists/${watchlistId}`)
    }
  }

  return (
    <WatchlistForm
      nextUrl={returnUrl}
      watchlistId={watchlistId}
      title={title}
      description={description}
      isPublic={isPublic}
      mutate={mutate}
      onSuccess={onSuccess}
      isPending={isPending}
    />
  )
}
