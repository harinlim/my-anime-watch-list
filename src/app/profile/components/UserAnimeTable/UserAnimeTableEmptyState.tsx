import { Button, Group, Stack, Text, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconDatabaseOff } from '@tabler/icons-react'
import clsx from 'clsx'
import Link from 'next/link'

type Props = {
  className?: string
}

export function UserAnimeTableEmptyState({ className }: Props) {
  const [isLoading, { toggle }] = useDisclosure()

  return (
    <Group className={clsx('justify-center p-6 sm:flex-nowrap sm:gap-20', className)}>
      <IconDatabaseOff className="h-32 w-32 flex-none text-gray-600" stroke={1.5} />

      <Stack className="w-96 items-start">
        <Title order={2} className="mb-4 text-lg font-black sm:text-2xl">
          No anime found
        </Title>

        <Text className="text-neutral-600 dark:text-slate-400" size="md">
          Start by rating an anime, marking your status, or adding it to your watchlist!
        </Text>

        <Button
          component={Link}
          href="/anime"
          variant="outline"
          size="md"
          mt="xl"
          className="w-full sm:w-auto"
          color="indigo.7"
          disabled={isLoading}
          onClick={toggle}
        >
          Find anime
        </Button>
      </Stack>
    </Group>
  )
}
