import { Text, Paper, Flex, Group, Box } from '@mantine/core'
import { IconEye, IconLock } from '@tabler/icons-react'
import clsx from 'clsx'
import Link from 'next/link'
import { memo } from 'react'

import { AvatarGroup } from './AvatarGroup'
import { WatchlistCoverPhoto } from './WatchlistCoverPhoto'
import styles from './WatchlistRow.module.css'

import type { WatchlistOverview } from '@/types/watchlists'

type Props = {
  watchlist: WatchlistOverview
}

export const WatchlistRow = memo(({ watchlist }: Props) => (
  <Paper shadow="lg" radius="md" p="lg" className={clsx(styles.row, 'h-58 w-full')}>
    <Flex className="h-full flex-col justify-between">
      <Flex>
        <Box className="size-32 shrink-0">
          <WatchlistCoverPhoto watchlist={watchlist} hasPlus={false} />
        </Box>
        <Flex direction="column" className="ml-4">
          <Link href={`/watchlists/${watchlist.id}`} className="hover:underline">
            <Text className="line-clamp-1 text-lg font-bold md:text-xl">{watchlist.title}</Text>
          </Link>
          <Text className="line-clamp-3 text-base">{watchlist.description}</Text>
        </Flex>
      </Flex>

      <Flex className="items-end justify-between">
        {watchlist.is_public ? (
          <Group className="items-center gap-1.5 opacity-80">
            <IconEye color="rgb(22 163 74)" stroke="1" size="20" />
            <Text className="text-sm text-green-600">Public</Text>
          </Group>
        ) : (
          <Group className="items-center gap-1.5 opacity-80">
            <IconLock stroke="1" size="18" />
            <Text className="text-sm">Private</Text>
          </Group>
        )}

        <AvatarGroup watchlist_users={watchlist.watchlists_users} />
      </Flex>
    </Flex>
  </Paper>
))
