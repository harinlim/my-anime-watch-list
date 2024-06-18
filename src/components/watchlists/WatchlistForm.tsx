'use client'

import {
  TextInput,
  Textarea,
  Group,
  Switch,
  Button,
  Title,
  Card,
  LoadingOverlay,
  ActionIcon,
  Tooltip,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { IconQuestionMark } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'

import { watchlistRequestBodySchema } from '@/api/watchlists/schemas'

import type { CreateWatchlistResponse } from '@/types/watchlists'
import type { WatchlistRequestBody } from '@/api/watchlists/types'
import type { UseMutateFunction } from '@tanstack/react-query'

type Props = {
  nextUrl: string | null
  watchlistId?: number
  title?: string
  description?: string | null
  isPublic?: boolean
  mutate: UseMutateFunction<
    CreateWatchlistResponse | undefined,
    Error,
    WatchlistRequestBody,
    unknown
  >
  onSuccess: (data?: CreateWatchlistResponse) => void
  isPending: boolean
}

export default function WatchlistForm({
  nextUrl,
  watchlistId,
  title,
  description,
  isPublic,
  mutate,
  onSuccess,
  isPending,
}: Props) {
  const isEdit = !!watchlistId
  const router = useRouter()

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      title: title ?? '',
      description: description ?? '',
      isPublic: isPublic ?? false,
    },

    validate: zodResolver(watchlistRequestBodySchema),
  })

  const onSubmit = form.onSubmit(values => {
    if (form.isDirty()) {
      mutate(values, {
        onSuccess,
      })
    } else {
      router.push(nextUrl ?? isEdit ? `/watchlists/${watchlistId}` : '/watchlists')
    }
  })

  return (
    <Card className="p-6 lg:p-8">
      <Title order={1} className="font-semibold">
        {isEdit ? 'Edit' : 'Create'} watchlist
      </Title>
      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <TextInput
          withAsterisk
          label="Title"
          variant="filled"
          placeholder="My favorite watchlist..."
          key={form.key('title')}
          disabled={isPending}
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
          disabled={isPending}
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

          <Button type="submit" color="pink" size="md">
            <LoadingOverlay visible={isPending} />
            {isEdit ? 'Save' : 'Create'}
          </Button>
        </Group>
      </form>
    </Card>
  )
}
