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

const errorMessage = (error: HttpError) => {
  switch (error.response.status) {
    case 401: {
      return 'Please log in and try again'
    }
    case 403: {
      return 'Please check you have access to the watchlist and try again'
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

  const { isDirty, isValid } = useWatchFormState(form, {
    initialValue: { isDirty: false, isValid: false },
    setState: () => ({ isDirty: form.isDirty(), isValid: form.isValid() }),
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
          title={`${isEdit ? 'Failed to update' : 'Failed to create'} watchlist`}
          icon={<IconAlertCircle />}
        >
          {errorMessage(error)}
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
            disabled={!isDirty || !isValid || isSubmitting}
          >
            {isEdit ? 'Save' : 'Create'}
          </Button>
        </Group>
      </form>
    </Card>
  )
}
