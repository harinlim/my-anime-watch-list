import { Text, Alert, Code, Group, Button, LoadingOverlay } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'

import { useDeleteWatchlist } from '@/data/use-delete-watchlist'

import type { HttpError } from '@/lib/api'

type Props = {
  watchlistId: number
  watchlistTitle: string
  close: () => void
}

const errorMessage = (error: HttpError) => {
  switch (error.response.status) {
    case 401: {
      return 'Please log in and try again'
    }
    case 403: {
      return 'Please check you have owner access to the watchlist and try again'
    }
    case 500: {
      return (
        error.response.statusText ??
        'We were unable to process your request. Please try again later'
      )
    }
    default: {
      return null
    }
  }
}

export function DeleteWatchlistModalContent({ watchlistId, watchlistTitle, close }: Props) {
  const { mutate, isPending, error } = useDeleteWatchlist(watchlistId)

  const router = useRouter()

  const handleDelete = () => {
    void mutate(undefined, {
      onSuccess: () => router.push('/watchlists'),
    })
  }

  return (
    <>
      {error && (
        <Alert
          variant="light"
          color="red"
          title="Failed to delete watchlist"
          icon={<IconAlertCircle />}
        >
          {errorMessage(error)}
        </Alert>
      )}
      <Text className="overflow-hidden text-ellipsis">
        Are you sure you want to delete watchlist <Code className="w-fit">{watchlistTitle}</Code> ?
      </Text>
      <Group>
        <Button
          variant="outline"
          onClick={close}
          color="gray"
          className="min-w-12 flex-grow basis-24"
        >
          Cancel
        </Button>
        <Button
          variant="filled"
          color="red"
          className="min-w-20 flex-grow basis-24"
          onClick={handleDelete}
        >
          <LoadingOverlay visible={isPending} loaderProps={{ size: 20 }} />
          Delete
        </Button>
      </Group>
    </>
  )
}
