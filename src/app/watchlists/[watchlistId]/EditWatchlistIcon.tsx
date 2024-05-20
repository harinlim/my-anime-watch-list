import { UnstyledButton } from '@mantine/core'
import { IconEdit } from '@tabler/icons-react'

export function EditWatchlistIcon() {
  return (
    <UnstyledButton
      aria-label="edit watchlist"
      className="rounded-full border-2 border-solid border-[#c9c9c9] p-1 hover:border-[#a9a9a9] hover:bg-[#f5f5f5] dark:border-[#3a3a3a] dark:hover:border-[#4a4a4a] dark:hover:bg-[#2b2b2b]"
    >
      <IconEdit size={32} />
    </UnstyledButton>
  )
}
