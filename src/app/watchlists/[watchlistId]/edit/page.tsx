import { Button } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { fetchWithType } from '@/lib/api'
import { proxyRequestHeaders } from '@/lib/headers'
import { isSameOrigin, isSamePath, withBaseURL } from '@/lib/url'

import EditWatchlistWrapper from './EditWatchlistWrapper'

import type { Watchlist } from '@/types/watchlists'

export default async function EditWatchlistPage({ params }: { params: { watchlistId: number } }) {
  const { watchlistId } = params
  // TODO: parse watchlistId for validity and type safety

  const headersInit = proxyRequestHeaders()
  const referer = headersInit.get('referer')
  const currentPath = `/watchlists/${watchlistId}/edit` // Note: currently there is no good way for getting pathnames in RSCs
  const returnUrl =
    referer && isSameOrigin(referer, headersInit) && !isSamePath(referer, currentPath)
      ? referer
      : `/watchlists/${watchlistId}`

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
    <div className="px-1/4 m-10 md:flex md:flex-col md:items-center">
      <div className="space-y-6 md:w-2/3 md:max-w-2xl">
        <Button
          component={Link}
          href={returnUrl}
          variant="transparent"
          size="md"
          leftSection={<IconArrowLeft size="20" />}
        >
          Back
        </Button>
        <EditWatchlistWrapper
          returnUrl={returnUrl}
          watchlistId={watchlistId}
          title={title}
          description={description}
          is_public={is_public}
        />
      </div>
    </div>
  )
}
