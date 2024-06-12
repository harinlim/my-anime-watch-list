'use client'

import { Button, Group, Switch, TextInput, Textarea, Title } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'

import { watchlistRequestBodySchema } from '@/app/(api)/api/watchlists/schemas'
import { useCreateWatchlist } from '@/data/use-create-watchlist'

export default function WatchlistsPage() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
      description: '',
      isPublic: false,
    },

    validate: zodResolver(watchlistRequestBodySchema),
  })

  const {
    mutate: createWatchlist,
    // variables: updateVariables,
    // isPending: isUpdatePending,
  } = useCreateWatchlist()

  return (
    <div className="lg: px-1/4 m-10 lg:flex lg:flex-col lg:items-center">
      <div className="space-y-6 lg:w-1/2">
        <Title order={1} className="font-semibold">
          Create watchlist
        </Title>
        <form onSubmit={form.onSubmit(values => createWatchlist(values))} className="space-y-3">
          <TextInput
            withAsterisk
            label="Title"
            variant="filled"
            placeholder="My favorite watchlist..."
            key={form.key('title')}
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
              Create
            </Button>
          </Group>
        </form>
      </div>
    </div>
  )
}
