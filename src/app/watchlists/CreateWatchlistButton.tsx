import { Affix, Button, Text } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import Link from 'next/link'

export function CreateWatchlistButton() {
  return (
    <Affix position={{ bottom: 40, right: 40 }} className="flex justify-center">
      <Button
        component={Link}
        href="/watchlists/create"
        size="lg"
        color="indigo"
        variant="filled"
        radius="lg"
        className="flex items-center justify-center px-4 py-2"
      >
        <Text className="mr-2">Create</Text>
        <IconPlus size={20} />
      </Button>
    </Affix>
  )
}
