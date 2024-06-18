import { Button } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { getUserFromSession } from '@/db/users'
import { fetchWithType } from '@/lib/api'
import { proxyRequestHeaders } from '@/lib/headers'
import { createServerClient } from '@/lib/supabase/server'
import { isSameOrigin, isSamePath, withBaseURL } from '@/lib/url'

import { EditWatchlistForm } from './EditWatchlistForm'

import type { Watchlist } from '@/types/watchlists'

export default async function EditWatchlistPage({ params }: { params: { watchlistId: number } }) {
  const { watchlistId } = params
  // TODO: parse watchlistId for validity and type safety

  const supabase = createServerClient()
  const { data: user } = await getUserFromSession(supabase)
  if (!user) {
    redirect('/login')
  }

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

  return (
    <div className="mx-2 my-5 md:mx-5 md:flex md:flex-col md:items-center lg:m-10">
      <div className="space-y-2 md:w-2/3 md:max-w-2xl">
        <Button
          component={Link}
          href={returnUrl}
          variant="transparent"
          size="md"
          leftSection={<IconArrowLeft size="20" />}
        >
          Back
        </Button>

        <EditWatchlistForm
          returnUrl={returnUrl}
          watchlist={{
            id: watchlistResponse.data.id,
            title: watchlistResponse.data.title,
            description: watchlistResponse.data.description,
            // TODO: eventually use Watchlist type with camelCase keys
            is_public: watchlistResponse.data.is_public,
          }}
        />
      </div>
    </div>
  )
}
