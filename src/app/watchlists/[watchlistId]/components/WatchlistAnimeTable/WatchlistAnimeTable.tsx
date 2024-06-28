'use client'

import {
  Table,
  Group,
  TableScrollContainer,
  LoadingOverlay,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Alert,
} from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { useState } from 'react'

import { AnimeTableSkeleton } from '@/components/anime/table/AnimeTableSkeleton'
import { useCollaboratorsData } from '@/components/collaborators/CollaboratorsContext'
import { Pagination } from '@/components/common/Pagination'
import { useCurrentUser } from '@/context/UserContext'
import { useRemoveWatchlistAnime } from '@/data/use-remove-watchlist-anime'
import { useWatchlistAnime } from '@/data/use-watchlist-anime'
import { useTotalPages } from '@/hooks/use-total-pages'

import { WatchlistAnimeRow } from './WatchlistAnimeRow'
import { WatchlistAnimeTableEmptyState } from './WatchlistAnimeTableEmptyState'
import { WatchlistAnimeTableErrorState } from './WatchlistAnimeTableErrorState'

import type { GetWatchlistAnimeResponse } from '@/api/watchlists/[watchlistId]/anime/types'

type Props = {
  initialData: Extract<GetWatchlistAnimeResponse, { ok: true }> | null
  watchlistId: number
  limit: number
  minWidth?: number
}

// TODO: reconsider mobile view for table

export function WatchlistAnimeTable({ initialData, watchlistId, limit, minWidth }: Props) {
  const [activePage, setActivePage] = useState<number>(1)

  const isLoggedIn = !!useCurrentUser()

  // TODO: expand on error handling
  const {
    data,
    isLoading,
    isFetching,
    refetch,
    isError: isQueryError,
  } = useWatchlistAnime(initialData, {
    watchlistId,
    page: activePage,
    limit,
  })

  const {
    mutate: removeFromWatchlist,
    isPending: isDeletePending,
    isError: isDeleteError,
  } = useRemoveWatchlistAnime()

  const totalPages = useTotalPages(initialData, data)

  const handleRemoveAnime = (animeId: string) => () =>
    removeFromWatchlist({ watchlistId, animeId }, { onSettled: refetch })

  const currentUserRole = useCollaboratorsData().currentUserCollaborator?.role
  const canEditAnime = currentUserRole === 'owner' || currentUserRole === 'editor'

  if ((initialData === null && isLoading) || isFetching) {
    return (
      <AnimeTableSkeleton
        limit={limit}
        activePage={activePage}
        totalPages={totalPages}
        onPageChange={setActivePage}
      />
    )
  }

  const isEmpty = data?.data?.length === 0

  return (
    <>
      {isDeleteError && (
        <Alert
          variant="light"
          color="red"
          title="Failed to remove anime from watchlist"
          icon={<IconAlertCircle />}
        />
      )}

      <TableScrollContainer minWidth={minWidth ?? 640}>
        <LoadingOverlay visible={isDeletePending} />

        <Table verticalSpacing="sm">
          <TableThead>
            <TableTr className="text-lg">
              <TableTh>Title</TableTh>

              {isLoggedIn && (
                <>
                  <TableTh>Status</TableTh>
                  <Table.Th>Rating</Table.Th>
                  <Table.Th />
                </>
              )}
            </TableTr>
          </TableThead>
          <TableTbody>
            {(isEmpty || isQueryError) && (
              // This is to keep spacing in headers consistent
              <TableTr>
                <TableTd />
                {isLoggedIn && (
                  <>
                    <TableTd width={180} pr={20} />
                    <TableTd width={80} />
                    <TableTd width={48} />
                  </>
                )}
              </TableTr>
            )}

            {data?.data?.map(item => (
              <WatchlistAnimeRow
                key={item.kitsu_id}
                anime={item}
                canRemove={canEditAnime}
                onRemove={handleRemoveAnime(item.kitsu_id)}
              />
            ))}
          </TableTbody>
        </Table>
      </TableScrollContainer>

      {isQueryError && (
        <WatchlistAnimeTableErrorState
          isLoading={isFetching}
          retry={refetch}
          className="h-[580.5px] pb-40"
        />
      )}
      {isEmpty && (
        <WatchlistAnimeTableEmptyState canEditAnime={canEditAnime} className="h-[580.5px] pb-40" />
      )}

      <Group className="mt-2 justify-end">
        <Pagination total={totalPages} value={activePage} onChange={setActivePage} />
      </Group>
    </>
  )
}
