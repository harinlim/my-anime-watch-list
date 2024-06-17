'use client'

import WatchlistForm from '@/components/watchlists/WatchlistForm'
import { useCreateWatchlist } from '@/data/use-create-watchlist'

import type { WatchlistRequestBody } from '@/app/(api)/api/watchlists/types'
import type { UseMutateFunction } from '@tanstack/react-query'

export default function CreateWatchlistWrapper({ nextUrl }: { nextUrl: string }) {
  const {
    mutate,
    isPending,
  }: {
    mutate: UseMutateFunction<undefined, Error, WatchlistRequestBody, unknown>
    isPending: boolean
  } = useCreateWatchlist()

  return <WatchlistForm nextUrl={nextUrl} mutate={mutate} isPending={isPending} />
}
