'use client'

import {
  Image,
  Table,
  Group,
  Text,
  TableScrollContainer,
  Pagination,
  LoadingOverlay,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  ActionIcon,
  Menu,
  MenuItem,
  MenuDropdown,
  MenuTarget,
  Alert,
} from '@mantine/core'
import { IconAlertCircle, IconDots, IconFileDescription, IconTrash } from '@tabler/icons-react'
import Link from 'next/link'
import { memo, useState } from 'react'

import { AnimeStatusDropdown } from '@/components/anime/AnimeStatusDropdown'
import { AnimeDescriptionPopover } from '@/components/anime/table/AnimeDescriptionPopover'
import { AnimeTableSkeleton } from '@/components/anime/table/AnimeTableSkeleton'
import { useTotalPages } from '@/components/anime/table/use-total-pages'
import { useCollaboratorsData } from '@/components/collaborators/CollaboratorsContext'
import { useCurrentUser } from '@/context/UserContext'
import { useRemoveWatchlistAnime } from '@/data/use-remove-watchlist-anime'
import { useWatchlistAnime } from '@/data/use-watchlist-anime'

import type { GetWatchlistAnimeResponse } from '@/api/watchlists/[watchlistId]/anime/types'
import type { AnimeByWatchlist } from '@/types/anime'

type Props = {
  initialData: Extract<GetWatchlistAnimeResponse, { ok: true }> | null
  watchlistId: number
  limit: number
}

type AnimeRowProps = {
  anime: AnimeByWatchlist
  canRemove: boolean
  onRemove: () => void
}

const AnimeRow = memo(
  ({ anime, canRemove, onRemove }: AnimeRowProps) => {
    const isLoggedIn = !!useCurrentUser()

    const href = `/anime/${anime.kitsu_id}`

    return (
      <TableTr>
        <TableTd>
          <Link
            href={href}
            prefetch={false}
            className="flex w-auto flex-row items-center gap-4 hover:underline"
          >
            {anime.poster_image?.small && (
              <AnimeDescriptionPopover
                position="bottom-start"
                // NOTE: the onclick event in the popover actually propagates to the link, clean it later
                href={href}
                title={anime.title}
                description={anime.synopsis}
                createdAt={anime.created_at}
                updatedAt={anime.review?.updated_at}
              >
                <Image
                  className="h-24 rounded-sm"
                  src={anime.poster_image?.small}
                  alt={`${anime.title} (opens in a new tab)`}
                />
              </AnimeDescriptionPopover>
            )}

            <AnimeDescriptionPopover
              position="bottom-start"
              // NOTE: the onclick event in the popover actually propagates to the link, clean it later
              href={href}
              title={anime.title}
              description={anime.synopsis}
              createdAt={anime.created_at}
              updatedAt={anime.review?.updated_at}
            >
              <Text fz="md" fw={500} className="line-clamp-2">
                {anime.title}
              </Text>
            </AnimeDescriptionPopover>
          </Link>
        </TableTd>

        {isLoggedIn && (
          <>
            <TableTd width={180} pr={20}>
              <AnimeStatusDropdown
                aria-label="Select a status"
                animeId={anime.kitsu_id}
                status={anime.review?.status}
                defaultText="Not watched"
              />
            </TableTd>
            <TableTd width={80}>
              {/* Honestly, there's not really a good way to do ratings here unless we do a straight up dropdown like MAL */}
              {anime.review?.rating ? `${anime.review.rating} / 10 ` : 'Not yet rated'}
            </TableTd>
            <TableTd width={40}>
              <Menu
                withArrow
                width={120}
                position="bottom-end"
                transitionProps={{ transition: 'pop' }}
                withinPortal
              >
                <MenuTarget>
                  <ActionIcon variant="default" aria-label="Menu">
                    <IconDots className="h-4 w-4" stroke={1.5} />
                  </ActionIcon>
                </MenuTarget>

                <MenuDropdown>
                  <MenuItem
                    component={Link}
                    prefetch={false}
                    href={href}
                    leftSection={<IconFileDescription className="h-4 w-4" stroke={1.5} />}
                  >
                    Details
                  </MenuItem>

                  {canRemove && (
                    <MenuItem
                      onClick={onRemove}
                      color="red"
                      leftSection={<IconTrash className="h-4 w-4" stroke={1.5} />}
                    >
                      Remove
                    </MenuItem>
                  )}
                </MenuDropdown>
              </Menu>
            </TableTd>
          </>
        )}
      </TableTr>
    )
  },
  (prevProps, nextProps) =>
    prevProps.anime.kitsu_id === nextProps.anime.kitsu_id &&
    prevProps.anime.review?.updated_at === nextProps.anime.review?.updated_at &&
    prevProps.anime.review?.status === nextProps.anime.review?.status &&
    prevProps.anime.review?.rating === nextProps.anime.review?.rating &&
    prevProps.anime.created_at === nextProps.anime.created_at
)

// TODO: reconsider mobile view for table

export function WatchlistAnimeDataTable({ initialData, watchlistId, limit }: Props) {
  const [activePage, setActivePage] = useState<number>(1)

  const isLoggedIn = !!useCurrentUser()

  // TODO: expand on error handling
  const {
    data,
    isLoading,
    isFetching,
    isPlaceholderData,
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

  if (initialData === null && isLoading) {
    return <AnimeTableSkeleton limit={limit} />
  }

  return (
    <>
      {isQueryError && (
        <Alert
          variant="light"
          color="red"
          title="Failed to retrieve watchlist anime"
          icon={<IconAlertCircle />}
        />
      )}
      {isDeleteError && (
        <Alert
          variant="light"
          color="red"
          title="Failed to remove anime from watchlist"
          icon={<IconAlertCircle />}
        />
      )}

      <TableScrollContainer minWidth={720}>
        <LoadingOverlay
          visible={
            // Check if we're actively fetching NEW data, or if delete is in progress
            (isFetching && isPlaceholderData) || isDeletePending
          }
        />

        <Table verticalSpacing="sm">
          <TableThead>
            <TableTr className="text-base">
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
            {data?.data?.map(item => (
              <AnimeRow
                key={item.kitsu_id}
                anime={item}
                canRemove={canEditAnime}
                onRemove={handleRemoveAnime(item.kitsu_id)}
              />
            ))}
          </TableTbody>
        </Table>
      </TableScrollContainer>
      <Group className="mt-2 justify-end">
        <Pagination
          total={totalPages}
          value={activePage}
          onChange={setActivePage}
          withEdges={totalPages > 3}
          getControlProps={control => {
            // Required because mantine doesn't add default accessibility labels
            if (control === 'first') return { 'aria-label': 'First page' }
            if (control === 'previous') return { 'aria-label': 'Previous page' }
            if (control === 'next') return { 'aria-label': 'Next page' }
            if (control === 'last') return { 'aria-label': 'Last page' }
            return {}
          }}
        />
      </Group>
    </>
  )
}
