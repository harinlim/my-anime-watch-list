import { Text, Paper, Flex, Box, Group } from '@mantine/core'
import { IconEye, IconLock } from '@tabler/icons-react'
import clsx from 'clsx'
import Link from 'next/link'

import { AvatarGroup } from './AvatarGroup'
import { WatchlistCoverPhoto } from './WatchlistCoverPhoto'
import styles from './WatchlistRow.module.css'

import type { WatchlistOverview } from '@/types/watchlists'

type Props = {
  watchlist: WatchlistOverview
}

export function WatchlistRow({ watchlist }: Props) {
  return (
    <Paper shadow="lg" radius="md" p="lg" className={clsx(styles.row, 'h-58 w-full')}>
      <Box className="flex h-full flex-col justify-between">
        <Flex>
          <div className="size-32 shrink-0">
            <WatchlistCoverPhoto watchlist={watchlist} hasPlus={false} />
          </div>
          <Flex direction="column" className="ml-4">
            <Link href={`/watchlists/${watchlist.id}`} className="hover:underline">
              <Text className="line-clamp-1 text-lg font-bold md:text-xl">{watchlist.title}</Text>
            </Link>
            <Text className="line-clamp-3">{watchlist.description}</Text>
          </Flex>
        </Flex>
        <Flex className="items-end justify-between">
          {watchlist.is_public ? (
            <Group className="items-center gap-2 opacity-80">
              <IconEye color="rgb(22 163 74)" stroke="1" size="20" />
              <Text className="text-green-600">Public</Text>
            </Group>
          ) : (
            <Group className="items-center gap-1 opacity-80">
              <IconLock stroke="1" size="20" />
              <Text>Private</Text>
            </Group>
          )}
          <AvatarGroup watchlist_users={watchlist.watchlists_users} />
        </Flex>
      </Box>
    </Paper>
  )
}
