'use client'

import {
  TextInput,
  Text,
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
import { usePathname, useRouter } from 'next/navigation'

import { watchlistRequestBodySchema } from '@/app/(api)/api/watchlists/schemas'
import revalidate from '@/utils/revalidate'

import type { WatchlistRequestBody } from '@/app/(api)/api/watchlists/types'
import type { UseMutateFunction } from '@tanstack/react-query'

type Props = {
  nextUrl: string
  watchlistId?: number
  title?: string
  description?: string | null
  isPublic?: boolean
  mutate: UseMutateFunction<undefined, Error, WatchlistRequestBody, unknown>
  isPending: boolean
}

export default function WatchlistForm({
  nextUrl,
  watchlistId,
  title,
  description,
  isPublic,
  mutate,
  isPending,
}: Props) {
  const isEdit = !!watchlistId
  const router = useRouter()
  const currentPath = usePathname()

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
    mutate(values, {
      onSuccess: () => {
        revalidate(`/watchlists/${watchlistId}`)
        revalidate(currentPath)
        router.push(nextUrl)
      },
    })
  })

  return (
    <Card padding="xl">
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
          <Group>
            <Switch
              color="blue"
              mb="lg"
              label={
                <Group className="items-center gap-2">
                  <Text>Public</Text>
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
              }
              key={form.key('isPublic')}
              {...form.getInputProps('isPublic', { type: 'checkbox' })}
            />
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
