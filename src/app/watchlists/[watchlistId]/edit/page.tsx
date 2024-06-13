import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

import WatchlistForm from '@/components/watchlists/WatchlistForm'
import { fetchWithType } from '@/lib/api'
import { proxyRequestHeaders } from '@/lib/headers'
import { withBaseURL } from '@/lib/url'

import type { Watchlist } from '@/types/watchlists'

export default async function EditWatchlistPage({ params }: { params: { watchlistId: number } }) {
  const headersInit = proxyRequestHeaders()
  const { watchlistId } = params
  const headersList = headers()
  const referer = headersList.get('referer')

  const watchlistResponse = await fetchWithType<Watchlist>(
    withBaseURL(`/api/watchlists/${watchlistId}`),
    {
      method: 'GET',
      credentials: 'include',
      headers: headersInit,
    }
  )

  if (watchlistResponse.status === 404) {
    return notFound()
  }

  if (!watchlistResponse.ok) {
    throw new Error('Failed to fetch watchlist')
  }

  const { title, description, is_public } = watchlistResponse.data

  return (
    <div className="lg: px-1/4 m-10 lg:flex lg:flex-col lg:items-center">
      <div className="space-y-6 lg:w-1/2">
        referer: {referer}
        <WatchlistForm
          referer={referer ?? undefined}
          watchlistId={watchlistId}
          title={title}
          description={description}
          isPublic={is_public}
        />
      </div>
    </div>
  )
}
