import { Title, Group } from '@mantine/core'
import { notFound } from 'next/navigation'

import { CollaboratorsProvider } from '@/components/collaborators/CollaboratorsContext'
import { CollaboratorsModal } from '@/components/collaborators/CollaboratorsModal/CollaboratorsModal'
import { EditCollaboratorsModalProvider } from '@/components/collaborators/CollaboratorsModal/CollaboratorsModalContext'
import { DeleteWatchlistModal } from '@/components/watchlists/DeleteWatchlistModal'
import { WatchlistPrivacyIndicator } from '@/components/watchlists/WatchlistPrivacyIndicator'
import { fetchWithType } from '@/lib/api'
import { proxyRequestHeaders } from '@/lib/headers'
import { withBaseURL } from '@/lib/url'

import { DeleteWatchlistButton } from './DeleteWatchlistButton'
import { DeleteWatchlistModalProvider } from './DeleteWatchlistModalContext'
import { EditCollaboratorsButton } from './EditCollaboratorsButton'
import { EditWatchlistButton } from './EditWatchlistButton'
import { WatchlistAccordion } from './WatchlistAccordion'
import { WatchlistDetails } from './WatchlistDetails'
import { WatchlistSidebar, WatchlistSidebarButton } from './WatchlistSidebar'
import { WatchlistSidebarProvider } from './WatchlistSidebarContext'

import type { Watchlist, WatchlistUser } from '@/types/watchlists'
import type { ReactNode } from 'react'

function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <EditCollaboratorsModalProvider>
      <DeleteWatchlistModalProvider>
        <WatchlistSidebarProvider>{children}</WatchlistSidebarProvider>
      </DeleteWatchlistModalProvider>
    </EditCollaboratorsModalProvider>
  )
}

export default async function WatchlistPage({ params }: { params: { watchlistId: string } }) {
  const { watchlistId } = params

  const headersInit = proxyRequestHeaders()

  const [watchlistResponse, collaboratorsResponse] = await Promise.all([
    fetchWithType<Watchlist>(withBaseURL(`/api/watchlists/${watchlistId}`), {
      method: 'GET',
      credentials: 'include',
      headers: headersInit,
    }),
    fetchWithType<WatchlistUser[]>(withBaseURL(`/api/watchlists/${watchlistId}/users`), {
      method: 'GET',
      credentials: 'include',
      headers: headersInit,
    }),
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

  const watchlist = watchlistResponse.data
  const collaborators = collaboratorsResponse.data

  // TODO: Add watchlist owner

  return (
    <CollaboratorsProvider initialData={collaborators} watchlistId={watchlist.id}>
      <ClientProviders>
        <CollaboratorsModal watchlistId={watchlist.id} isPublicWatchlist={watchlist.is_public} />
        <DeleteWatchlistModal watchlistId={watchlist.id} watchlistTitle={watchlist.title} />

        <div className="flex justify-center p-7 sm:p-10">
          <div className="w-full items-center lg:max-w-5xl">
            <section className="flex flex-col justify-between lg:flex-row lg:items-center">
              <Group className="flex flex-row flex-nowrap items-start justify-between">
                <Title order={1} className="overflow-hidden text-ellipsis text-4xl">
                  {watchlist.title}
                </Title>

                <Group className="flex flex-nowrap gap-2 lg:hidden">
                  <WatchlistSidebarButton className="lg:hidden" />

                  <WatchlistSidebar className="block lg:hidden">
                    <WatchlistDetails watchlist={watchlist} />
                  </WatchlistSidebar>
                </Group>
              </Group>

              <div className="flex flex-col gap-4 pt-2 lg:flex-row lg:items-center lg:pt-0">
                <WatchlistPrivacyIndicator isPublicWatchlist={watchlist.is_public} />

                <Group className="gap-2">
                  <EditWatchlistButton watchlistId={watchlist.id} />
                  <EditCollaboratorsButton />
                  <DeleteWatchlistButton />
                </Group>
              </div>

              <WatchlistAccordion watchlist={watchlist} className="block sm:hidden">
                <WatchlistDetails watchlist={watchlist} />
              </WatchlistAccordion>
            </section>

            <div className="flex w-full flex-col flex-wrap items-center space-y-6 py-8 md:flex-row md:flex-nowrap md:items-start md:space-y-0">
              <section className="min-w-lg h-[80vh] w-full bg-slate-700">Table</section>

              <section className="w-xs hidden h-full max-w-xs md:pl-10 lg:block">
                <WatchlistDetails watchlist={watchlist} />
              </section>
            </div>
          </div>
        </div>
      </ClientProviders>
    </CollaboratorsProvider>
  )
}
