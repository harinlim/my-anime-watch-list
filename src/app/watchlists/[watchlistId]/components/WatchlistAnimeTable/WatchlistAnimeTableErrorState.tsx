import { Button, Group, Stack, Text, Title } from '@mantine/core'
import { IconZoomExclamation } from '@tabler/icons-react'
import clsx from 'clsx'

type Props = {
  isLoading?: boolean
  retry: () => void
  className?: string
}

export function WatchlistAnimeTableErrorState({ isLoading, retry, className }: Props) {
  return (
    <Group className={clsx('justify-center p-6 sm:flex-nowrap sm:gap-20', className)}>
      <IconZoomExclamation className="h-32 w-32 flex-none text-gray-600" stroke={1.5} />

      <Stack className="w-96 items-start">
        <Title order={2} className="mb-4 text-lg font-black sm:text-2xl">
          Something went wrong :&#40;
        </Title>

        <Text className="text-neutral-600 dark:text-slate-400" size="md">
          We couldn&apos;t load the data for this watchlist. Please wait and try again later.
        </Text>

        <Button
          variant="outline"
          size="md"
          mt="xl"
          className="w-full sm:w-auto"
          color="indigo.7"
          disabled={isLoading}
          onClick={retry}
        >
          Retry
        </Button>
      </Stack>
    </Group>
  )
}
