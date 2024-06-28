import {
  Table,
  TableScrollContainer,
  Skeleton,
  Stack,
  Box,
  Group,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
} from '@mantine/core'

import { Pagination } from '@/components/common/Pagination'

type Props = {
  limit: number
  minWidth?: number
  activePage?: number
  totalPages?: number
  /** ONLY USED IN CLIENT BOUNDARIES */
  onPageChange?: (page: number) => void
}

export function UserWatchlistsTableSkeleton({
  limit,
  minWidth,
  activePage = 1,
  totalPages = 1,
  onPageChange,
}: Props) {
  const rows = Array.from({ length: limit })?.map((_, i) => (
    // eslint-disable-next-line react/no-array-index-key
    <TableTr key={`anime-table-skeleton-row-${i}`} className="h-[135px]">
      <TableTd>
        <Box className="flex w-auto flex-grow flex-row items-center gap-4 hover:underline">
          <Skeleton className="size-24 rounded-sm" />
          <Stack gap="sm" className="w-64">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </Stack>
        </Box>
      </TableTd>

      <TableTd width={110}>
        <Skeleton className="h-6 w-full" />
      </TableTd>

      <TableTd width={150}>
        <Skeleton className="h-6 w-full" />
      </TableTd>

      <TableTd width={48} />
    </TableTr>
  ))

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
              <TableTh />
            </TableTr>
          </TableThead>
          <TableTbody>{rows} </TableTbody>
        </Table>
      </TableScrollContainer>
      <Group className="mt-2 justify-end">
        <Pagination value={activePage} total={totalPages} onChange={onPageChange} />
      </Group>
    </>
  )
}
