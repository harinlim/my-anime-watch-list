import { Group, Text } from '@mantine/core'
import { IconEye, IconLock } from '@tabler/icons-react'
import clsx from 'clsx'

type Props = {
  isPublicWatchlist: boolean
  className?: string
}

export function WatchlistPrivacyIndicator({ isPublicWatchlist, className }: Props) {
  return (
    <Group className={clsx('flex-nowrap items-center gap-1.5', className)}>
      {isPublicWatchlist ? (
        <>
          <IconEye className="text-green-700 dark:text-green-400" stroke="2" size="20" />
          <Text className="text-md text-green-700 dark:text-green-400">Public</Text>
        </>
      ) : (
        <>
          <IconLock stroke="2" size="18" />
          <Text className="text-md">Private</Text>
        </>
      )}
    </Group>
  )
}
