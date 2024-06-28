import { Button, Text } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import Link from 'next/link'

export function CreateWatchlistButton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <Button
      component={Link}
      href="/watchlists/create"
      size={size}
      color="indigo"
      variant="filled"
      radius="md"
      className="flex items-center justify-center px-4 py-2"
      aria-label="Create a new watchlist"
    >
      <Text className="mr-2 hidden sm:block">Create</Text>
      <IconPlus size={20} />
    </Button>
  )
}
