import {
  TableTd,
  TableTr,
  Text,
  ActionIcon,
  Menu,
  MenuItem,
  MenuDropdown,
  MenuTarget,
  Stack,
  Badge,
} from '@mantine/core'
import { IconDots, IconFileDescription, IconPlaylistX } from '@tabler/icons-react'
import Link from 'next/link'
import { memo } from 'react'

import { AvatarGroup } from '@/components/watchlists/AvatarGroup'
import { WatchlistCoverPhoto } from '@/components/watchlists/WatchlistCoverPhoto'
import { WatchlistPrivacyIndicator } from '@/components/watchlists/WatchlistPrivacyIndicator'
import { useCurrentUser } from '@/context/UserContext'

import { WatchlistDescriptionPopover } from './WatchlistDescriptionPopover'

import type { WatchlistOverview } from '@/types/watchlists'

type Props = {
  username: string
  watchlist: WatchlistOverview
  className?: string
}

function arePropsEqual(prevProps: Props, nextProps: Props) {
  return (
    prevProps.username === nextProps.username &&
    prevProps.watchlist.id === nextProps.watchlist.id &&
    prevProps.watchlist.updated_at === nextProps.watchlist?.updated_at &&
    prevProps.watchlist.created_at === nextProps.watchlist.created_at
  )
}

export const UserWatchlistRow = memo(({ username, watchlist, className }: Props) => {
  const href = `/watchlists/${watchlist.id}`

  const currentUser = useCurrentUser()
  const canRemove =
    currentUser?.username === username &&
    watchlist.watchlists_users.some(u => u.user_id === currentUser.id && u.role !== 'owner')

  // TODO: atm we don't return the "self" user as a viewer in this, so we need to default to viewer
  // as they wouldn't have access the watchlist otherwise. Supabase is a little annoying with complex filters
  const role = watchlist.watchlists_users.find(u => u.username === username)?.role ?? 'viewer'

  return (
    <TableTr className={className}>
      <TableTd className="flex w-auto flex-row items-center gap-4">
        <WatchlistDescriptionPopover
          position="bottom-start"
          username={username}
          watchlist={watchlist}
        >
          <Link href={href} prefetch={false} aria-label="Go to watchlist">
            <WatchlistCoverPhoto watchlist={watchlist} className="size-24 shrink-0" />
          </Link>
        </WatchlistDescriptionPopover>

        <Stack>
          <WatchlistDescriptionPopover
            position="bottom-start"
            username={username}
            watchlist={watchlist}
          >
            <Link href={href} prefetch={false}>
              <Text fz="md" className="line-clamp-2 font-semibold hover:underline">
                {watchlist.title}
              </Text>
            </Link>
          </WatchlistDescriptionPopover>

          <Text size="sm" className="mt-1 line-clamp-6 max-w-72 sm:max-w-96">
            <Text component="span" className="font-medium">
              Role:&nbsp;
            </Text>
            <Badge component="span" className="capitalize" color="indigo">
              {role}
            </Badge>
          </Text>
        </Stack>
      </TableTd>

      <TableTd width={110}>
        <WatchlistPrivacyIndicator isPublicWatchlist={watchlist.is_public} />
      </TableTd>

      <TableTd width={150}>
        <AvatarGroup
          watchlistId={watchlist.id}
          watchlist_users={watchlist.watchlists_users}
          maxAvatars={5}
        />
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
              // TODO: Add tooltip on disabled to explain why it's disabled
              <MenuItem
                disabled
                color="red"
                leftSection={<IconPlaylistX className="h-4 w-4" stroke={1.5} />}
              >
                Remove
              </MenuItem>
            )}
          </MenuDropdown>
        </Menu>
      </TableTd>
    </TableTr>
  )
}, arePropsEqual)
