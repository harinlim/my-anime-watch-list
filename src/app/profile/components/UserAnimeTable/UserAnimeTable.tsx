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

import { AnimeTableSkeleton } from '@/components/anime/table/AnimeTableSkeleton'
import { Pagination } from '@/components/common/Pagination'
import { useCurrentUser } from '@/context/UserContext'
import { useUsersAnime } from '@/data/use-users-anime'
import { useTotalPages } from '@/hooks/use-total-pages'

import { UserAnimeRow } from './UserAnimeRow'
import { UserAnimeTableEmptyState } from './UserAnimeTableEmptyState'
import { UserAnimeTableErrorState } from './UserAnimeTableErrorState'

import type { GetUserAnimeResponse } from '@/app/(api)/api/users/[username]/anime/types'

type Props = {
  initialData: Extract<GetUserAnimeResponse, { ok: true }> | null
  username: string
  limit: number
  minWidth?: number
}

// TODO: reconsider mobile view for table

export function UserAnimeTable({ initialData, username, limit, minWidth }: Props) {
  const [activePage, setActivePage] = useState<number>(1)

  const isLoggedIn = !!useCurrentUser()

  // TODO: expand on error handling
  // TODO: expand on sort/filter options
  const {
    data,
    isLoading,
    isFetching,
    refetch,
    isError: isQueryError,
  } = useUsersAnime(initialData, {
    username,
    page: activePage,
    limit,
  })

  const totalPages = useTotalPages(initialData, data)

  if ((initialData === null && isLoading) || isFetching) {
    return <AnimeTableSkeleton limit={limit} activePage={activePage} totalPages={totalPages} />
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

            {data?.data?.map(item => <UserAnimeRow key={item.kitsu_id} anime={item} />)}
          </TableTbody>
        </Table>
      </TableScrollContainer>

      {isQueryError && (
        <UserAnimeTableErrorState
          isLoading={isFetching}
          retry={refetch}
          className="h-[580.5px] pb-40"
        />
      )}
      {isEmpty && <UserAnimeTableEmptyState className="h-[580.5px] pb-40" />}

      <Group className="mt-2 justify-end">
        <Pagination total={totalPages} value={activePage} onChange={setActivePage} />
      </Group>
    </>
  )
}
