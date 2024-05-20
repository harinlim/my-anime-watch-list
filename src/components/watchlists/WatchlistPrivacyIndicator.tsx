import { Group, Text } from '@mantine/core'
import { IconEye, IconLock } from '@tabler/icons-react'

export function WatchlistPrivacyIndicator({ isPublicWatchlist }: { isPublicWatchlist: boolean }) {
  return (
    <Group className="flex-nowrap items-center gap-1.5 ">
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
