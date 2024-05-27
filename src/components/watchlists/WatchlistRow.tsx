import { Text, Paper, Flex, Box } from '@mantine/core'
import clsx from 'clsx'
import Link from 'next/link'
import { memo } from 'react'

import { AvatarGroup } from './AvatarGroup'
import { WatchlistCoverPhoto } from './WatchlistCoverPhoto'
import { WatchlistPrivacyIndicator } from './WatchlistPrivacyIndicator'
import styles from './WatchlistRow.module.css'

import type { WatchlistOverview } from '@/types/watchlists'

type Props = {
  watchlist: WatchlistOverview
}

function arePropsEqual(prevProps: Props, nextProps: Props) {
  return (
    prevProps.watchlist === nextProps.watchlist ||
    (prevProps.watchlist.id === nextProps.watchlist.id &&
      prevProps.watchlist.updated_at === nextProps.watchlist.updated_at &&
      JSON.stringify(prevProps.watchlist.watchlists_users) ===
        JSON.stringify(nextProps.watchlist.watchlists_users))
  )
}

export const WatchlistRow = memo(
  ({ watchlist }: Props) => (
    <Paper shadow="lg" radius="md" p="lg" className={clsx(styles.row, 'h-58 w-full')}>
      <Flex className="h-full flex-col justify-between">
        <Flex>
          <Box className="size-32 shrink-0">
            <WatchlistCoverPhoto watchlist={watchlist} />
          </Box>
          <Flex direction="column" className="ml-4">
            <Link href={`/watchlists/${watchlist.id}`} className="hover:underline">
              <Text className="line-clamp-2 text-lg font-bold md:text-xl">{watchlist.title}</Text>
            </Link>
            <Text className="line-clamp-3 text-base">{watchlist.description}</Text>
          </Flex>
        </Flex>

        <Flex className="items-end justify-between pt-4">
          <WatchlistPrivacyIndicator isPublicWatchlist={watchlist.is_public} />

          <AvatarGroup watchlistId={watchlist.id} watchlist_users={watchlist.watchlists_users} />
        </Flex>
      </Flex>
    </Paper>
  ),
  arePropsEqual
)
