import {
  TextInput,
  Textarea,
  Group,
  Switch,
  Button,
  Title,
  Card,
  ActionIcon,
  Tooltip,
  Alert,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { IconAlertCircle, IconQuestionMark } from '@tabler/icons-react'

import { watchlistRequestBodySchema } from '@/app/(api)/api/watchlists/schemas'
import { useWatchFormState } from '@/lib/mantine-form/use-watch-form-state'

import type { WatchlistRequestBody } from '@/api/watchlists/types'
import type { HttpError } from '@/lib/api'
import type { Watchlist } from '@/types/watchlists'
import type { UseMutateFunction } from '@tanstack/react-query'

type Props<TData> = {
  // TODO: eventually use Watchlist type with camelCase keys
  watchlist?: Pick<Watchlist, 'title' | 'description' | 'is_public'>
  mutate: UseMutateFunction<TData, Error, WatchlistRequestBody, unknown>
  onSuccess: (data?: TData) => void
  error: HttpError | null
  isSubmitting: boolean
}

const errorMessage = (error: HttpError, isEdit: boolean) => {
  switch (error.response.status) {
    case 400: {
      return 'Invalid request. Please try again'
    }
    case 401: {
      return 'Unauthorized. Please log in and try again'
    }
    case 403: {
      return 'Forbidden. Please check you have access to the watchlist and try again'
    }
    case 404: {
      return 'Watchlist not found.'
    }
    case 422: {
      return 'Invalid input. Please check your input and try again'
    }
    case 500: {
      return error.response.statusText ?? 'Failed to process request. Please try again later'
    }
    default: {
      return `${isEdit ? 'Failed to update' : 'Failed to create'} watchlist`
    }
  }
}

export function WatchlistForm<TData>({
  watchlist,
  mutate,
  onSuccess,
  error,
  isSubmitting,
}: Props<TData>) {
  const isEdit = !!watchlist

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      title: watchlist?.title ?? '',
      description: watchlist?.description ?? '',
      isPublic: watchlist?.is_public ?? false,
    } satisfies WatchlistRequestBody,

    validate: zodResolver(watchlistRequestBodySchema),
  })

  const handleSubmit = form.onSubmit(values => {
    mutate(values, {
      onSuccess,
    })
  })

  const isDirty = useWatchFormState(form, {
    initialValue: false,
    setState: () => form.isDirty(),
  })

  return (
    <Card className="p-6 lg:p-8">
      <Title order={1} className="font-semibold">
        {isEdit ? 'Edit' : 'Create'} watchlist
      </Title>
      {error && (
        <Alert
          variant="light"
          color="red"
          mt="lg"
          title={`Error ${JSON.stringify(error.response.status)}`}
          icon={<IconAlertCircle />}
        >
          {errorMessage(error, isEdit)}
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <TextInput
          withAsterisk
          label="Title"
          variant="filled"
          placeholder="My favorite watchlist..."
          key={form.key('title')}
          disabled={isSubmitting}
          {...form.getInputProps('title')}
          className="space-y-2"
        />

        <Textarea
          label="Description"
          variant="filled"
          placeholder="This is the description of my favorite watchlist..."
          autosize
          minRows={3}
          maxRows={8}
          resize="vertical"
          key={form.key('description')}
          disabled={isSubmitting}
          {...form.getInputProps('description')}
          className="space-y-2"
          classNames={{
            input: 'min-h-20',
          }}
        />

        <Group mt="xl" className="items-center justify-between">
          <Group className="items-center gap-2">
            <Switch
              color="blue"
              label="Public"
              key={form.key('isPublic')}
              {...form.getInputProps('isPublic', { type: 'checkbox' })}
            />
            <Tooltip
              label="Make watchlist viewable to everyone"
              id="public-description"
              events={{ hover: true, focus: true, touch: true }}
              withArrow
            >
              <ActionIcon
                size="xs"
                variant="outline"
                radius="xl"
                aria-describedby="public-description"
              >
                <IconQuestionMark size="sm" />
              </ActionIcon>
            </Tooltip>
          </Group>

          <Button
            type="submit"
            color="pink"
            variant="outline"
            size="md"
            disabled={!isDirty || isSubmitting}
          >
            {isEdit ? 'Save' : 'Create'}
          </Button>
        </Group>
      </form>
    </Card>
  )
}
