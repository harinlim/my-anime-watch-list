import {
  Image,
  Text,
  TableTd,
  TableTr,
  ActionIcon,
  Menu,
  MenuItem,
  MenuDropdown,
  MenuTarget,
} from '@mantine/core'
import { IconDots, IconFileDescription, IconTrash } from '@tabler/icons-react'
import Link from 'next/link'
import { memo } from 'react'

import { AnimeStatusDropdown } from '@/components/anime/AnimeStatusDropdown'
import { AnimeDescriptionPopover } from '@/components/anime/table/AnimeDescriptionPopover'
import { useCurrentUser } from '@/context/UserContext'

import type { AnimeByWatchlist } from '@/types/anime'

type Props = {
  anime: AnimeByWatchlist
  canRemove: boolean
  onRemove: () => void
}

function arePropsEqual(prevProps: Props, nextProps: Props) {
  return (
    prevProps.anime.kitsu_id === nextProps.anime.kitsu_id &&
    prevProps.anime.review?.updated_at === nextProps.anime.review?.updated_at &&
    prevProps.anime.review?.status === nextProps.anime.review?.status &&
    prevProps.anime.review?.rating === nextProps.anime.review?.rating &&
    prevProps.anime.created_at === nextProps.anime.created_at
  )
}

export const WatchlistAnimeRow = memo(({ anime, canRemove, onRemove }: Props) => {
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
          <TableTd width={48}>
            <Menu
              withArrow
              width={120}
              position="bottom-end"
              transitionProps={{ transition: 'pop' }}
              withinPortal
            >
              <MenuTarget>
                <ActionIcon variant="subtle" color="gray.8" aria-label="Menu">
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
}, arePropsEqual)
