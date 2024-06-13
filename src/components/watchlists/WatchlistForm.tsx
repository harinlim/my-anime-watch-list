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
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { usePathname, useRouter } from 'next/navigation'

import { watchlistRequestBodySchema } from '@/app/(api)/api/watchlists/schemas'
import { useCreateWatchlist } from '@/data/use-create-watchlist'
import { useEditWatchlist } from '@/data/use-edit-watchlist'
import revalidate from '@/utils/revalidate'

type Props = {
  referer?: string
  watchlistId?: number
  title?: string
  description?: string | null
  isPublic?: boolean
}

export default function WatchlistForm({
  referer,
  watchlistId,
  title,
  description,
  isPublic,
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

  const {
    mutate: createWatchlist,
    // variables: updateVariables,
    isPending: isCreatePending,
  } = useCreateWatchlist()

  const {
    mutate: editWatchlist,
    // variables: updateVariables,
    isPending: isEditPending,
  } = useEditWatchlist()

  const onSubmit = form.onSubmit(values => {
    if (isEdit) {
      editWatchlist(
        { body: values, watchlistId },
        {
          onSuccess: () => {
            revalidate(`/watchlists/${watchlistId}`)
            revalidate(currentPath)
            if (referer) {
              if (referer.includes('localhost')) router.replace(referer)
            } else router.replace(`/watchlists/${watchlistId}`)
          },
        }
      )
    } else {
      createWatchlist(values, {
        onSettled: () => {
          if (referer) {
            if (referer.includes('localhost') && !referer.endsWith('watchlists/create')) {
              router.push(referer)
            }
          } else router.push('/watchlists')
        },
      })
    }
  })

  return (
    <Card padding="xl">
      <Title order={1} className="font-semibold">
        {isEdit ? 'Edit' : 'Create'} watchlist
      </Title>
      <form onSubmit={onSubmit} className="space-y-3">
        <TextInput
          withAsterisk
          label="Title"
          variant="filled"
          placeholder="My favorite watchlist..."
          key={form.key('title')}
          disabled={isCreatePending || isEditPending}
          {...form.getInputProps('title')}
          className="space-y-2"
        />

        <Textarea
          label="Description"
          variant="filled"
          placeholder="This is the description of my favorite watchlist..."
          autosize
          minRows={4}
          key={form.key('description')}
          disabled={isCreatePending || isEditPending}
          {...form.getInputProps('description')}
          className="space-y-2"
        />

        <Group mt="lg" className="items-center justify-between">
          <Switch
            color="green"
            mb="lg"
            label="Public"
            description="Make watchlist viewable to everyone"
            key={form.key('isPublic')}
            {...form.getInputProps('isPublic', { type: 'checkbox' })}
          />
          <Button type="submit" color="pink" size="md">
            <LoadingOverlay visible={isCreatePending || isEditPending} />
            {isEdit ? 'Save' : 'Create'}
          </Button>
        </Group>
      </form>
    </Card>
  )
}
