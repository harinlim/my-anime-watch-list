import { Title, Group } from '@mantine/core'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

import { WatchlistPrivacyIndicator } from '@/components/watchlists/WatchlistPrivacyIndicator'
import { fetchWithType, withBaseURL } from '@/lib/api'
import { createServerClient } from '@/lib/supabase/server'

import { AddCollaboratorIcon } from './AddCollaboratorIcon'
import { EditWatchlistIcon } from './EditWatchlistIcon'
import { WatchlistAccordion } from './WatchlistAccordion'
import { WatchlistDetails } from './WatchlistDetails'
import { WatchlistSideBar } from './WatchlistSidebar'

import type { Watchlist, WatchlistUser } from '@/types/watchlists'

export default async function WatchlistPage({ params }: { params: { watchlistId: string } }) {
  const { watchlistId } = params
  const supabase = createServerClient()

  const [watchlistResponse, collaboratorsResponse, userResponse] = await Promise.all([
    fetchWithType<Watchlist>(withBaseURL(`/api/watchlists/${watchlistId}`), {
      method: 'GET',
      credentials: 'include',
      headers: new Headers(headers()),
    }),
    fetchWithType<WatchlistUser[]>(withBaseURL(`/api/watchlists/${watchlistId}/users`), {
      method: 'GET',
      credentials: 'include',
      headers: new Headers(headers()),
    }),
    supabase.auth.getUser(),
  ])

  if (watchlistResponse.status === 404) {
    return notFound()
  }

  if (!watchlistResponse.ok) {
    throw new Error('Failed to fetch watchlist')
  }

  if (!collaboratorsResponse.ok) {
    throw new Error('Failed to fetch collaborators')
  }

  if (userResponse.error && !userResponse.data) {
    throw new Error('Failed to fetch user')
  }

  const userId = userResponse.data?.user?.id ?? null
  const watchlist = watchlistResponse.data
  const collaborators = collaboratorsResponse.data

  // TODO: Add watchlist owner

  return (
    <div className="flex justify-center p-10">
      <div className="w-full items-center lg:max-w-5xl">
        <section className="flex flex-col justify-between lg:flex-row lg:items-center">
          <Group className="flex flex-row flex-nowrap items-start justify-between ">
            <Title order={1} className="text-4xl">
              {watchlist.title}
            </Title>

            <Group className="flex flex-nowrap gap-2 lg:hidden">
              {/* <EditWatchlistIcon />
              <AddUserIcon /> */}
              <WatchlistSideBar
                className="block lg:hidden"
                detailsComponent={
                  <WatchlistDetails collaborators={collaborators} watchlist={watchlist} />
                }
              />
            </Group>
          </Group>

          <div className="flex flex-col gap-4 pt-2 lg:flex-row lg:items-center lg:pt-0">
            <WatchlistPrivacyIndicator isPublicWatchlist={watchlist.is_public} />

            <Group className="gap-2">
              <EditWatchlistIcon />
              <AddCollaboratorIcon watchlistId={watchlistId} userId={userId} />
            </Group>
          </div>

          <WatchlistAccordion
            collaborators={collaborators}
            watchlist={watchlist}
            className="block sm:hidden"
          />
        </section>

        <div className="flex w-full flex-col flex-wrap items-center space-y-6 py-8 md:flex-row md:flex-nowrap md:items-start md:space-y-0">
          <section className="min-w-lg h-[80vh] w-full bg-slate-700">Table</section>

          <section className="w-xs hidden h-full max-w-xs md:pl-10 lg:block">
            <WatchlistDetails collaborators={collaborators} watchlist={watchlist} />
          </section>
        </div>
      </div>
    </div>
  )
}
