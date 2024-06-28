'use client'

import {
  Table,
  Group,
  TableScrollContainer,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
} from '@mantine/core'
import { useState } from 'react'

import { Pagination } from '@/components/common/Pagination'
import { useUsersWatchlistOverviews } from '@/data/use-users-watchlist-overviews'
import { useTotalPages } from '@/hooks/use-total-pages'

import { UserWatchlistRow } from './UserWatchlistRow'
import { UserWatchlistsTableEmptyState } from './UserWatchlistsTableEmptyState'
import { UserWatchlistsTableErrorState } from './UserWatchlistsTableErrorState'
import { UserWatchlistsTableSkeleton } from './UserWatchlistsTableSkeleton'

import type { GetUserWatchlistOverviewsResponse } from '@/api/users/[username]/watchlists/types'

type Props = {
  initialData: Extract<GetUserWatchlistOverviewsResponse, { ok: true }> | null
  username: string
  limit: number
  minWidth?: number
}

// TODO: reconsider mobile view for table

export function UserWatchlistsTable({ initialData, username, limit, minWidth }: Props) {
  const [activePage, setActivePage] = useState<number>(1)

  // TODO: expand on error handling
  // TODO: expand on sort/filter options
  const {
    data,
    isLoading,
    isFetching,
    refetch,
    isError: isQueryError,
  } = useUsersWatchlistOverviews(initialData, {
    username,
    page: activePage,
    limit,
  })

  const totalPages = useTotalPages(initialData, data)

  if ((initialData === null && isLoading) || isFetching) {
    return (
      <UserWatchlistsTableSkeleton
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
      <TableScrollContainer minWidth={minWidth ?? 640}>
        {/* <LoadingOverlay visible={isDeletePending} /> */}

        <Table verticalSpacing="sm">
          <TableThead>
            <TableTr className="text-lg">
              <TableTh>Title</TableTh>
              <TableTh>Shared</TableTh>
              <TableTh>Collaborators</TableTh>

              <Table.Th />
            </TableTr>
          </TableThead>
          <TableTbody>
            {(isEmpty || isQueryError) && (
              // This is to keep spacing in headers consistent
              <TableTr>
                <TableTd />
                <TableTd width={110} />
                <TableTd width={150} />
                <TableTd width={48} />
              </TableTr>
            )}

            {data?.data?.map(watchlist => (
              <UserWatchlistRow
                key={watchlist.id}
                username={username}
                watchlist={watchlist}
                className="h-[135px]"
              />
            ))}
          </TableTbody>
        </Table>
      </TableScrollContainer>

      {isQueryError && (
        <UserWatchlistsTableErrorState
          isLoading={isFetching}
          retry={refetch}
          className="h-[650px] pb-40"
        />
      )}
      {isEmpty && <UserWatchlistsTableEmptyState className="h-[650px] pb-40" />}

      <Group className="mt-2 justify-end">
        <Pagination total={totalPages} value={activePage} onChange={setActivePage} />
      </Group>
    </>
  )
}
