'use client'

import {
  Table,
  TableScrollContainer,
  Skeleton,
  Stack,
  Box,
  Group,
  Pagination,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
} from '@mantine/core'

import { useCurrentUser } from '@/context/UserContext'

type Props = {
  limit: number
  minWidth?: number
}

export function AnimeTableSkeleton({ limit, minWidth }: Props) {
  const isLoggedIn = !!useCurrentUser()

  const rows = Array.from({ length: limit })?.map((_, i) => (
    // eslint-disable-next-line react/no-array-index-key
    <TableTr key={`anime-table-skeleton-row-${i}`}>
      <TableTd>
        <Box className="flex w-auto flex-grow flex-row items-center gap-4 hover:underline">
          <Skeleton className="h-24 w-[70px] rounded-sm" />
          <Stack gap="sm" className="w-64 md:w-80">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </Stack>
        </Box>
      </TableTd>

      {isLoggedIn && (
        <>
          <TableTd width={180} pr={20}>
            <Skeleton className="h-8 w-full" />
          </TableTd>
          <TableTd width={80}>
            <Skeleton className="h-6 w-full" />
          </TableTd>
          <TableTd width={40} />
        </>
      )}
    </TableTr>
  ))

  return (
    <>
      <TableScrollContainer minWidth={minWidth ?? 640}>
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
          <TableTbody>{rows}</TableTbody>
        </Table>
      </TableScrollContainer>
      <Group className="mt-2 justify-end">
        <Pagination total={1} />
      </Group>
    </>
  )
}
