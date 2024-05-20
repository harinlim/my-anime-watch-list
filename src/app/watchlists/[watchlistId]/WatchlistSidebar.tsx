'use client'

import { Drawer, UnstyledButton, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconInfoCircle } from '@tabler/icons-react'
import clsx from 'clsx'

type WatchlistSideBarProps = {
  detailsComponent?: React.ReactNode
  className?: string
}

export function WatchlistSideBar({ detailsComponent, className }: WatchlistSideBarProps) {
  const [opened, { open, close }] = useDisclosure(false)
  return (
    <>
      <Drawer
        position="right"
        size="sm"
        padding="lg"
        opened={opened}
        onClose={close}
        title={
          <Text size="xl" fs="italic" fw={600}>
            Details
          </Text>
        }
        closeButtonProps={{
          size: 'xl',
          iconSize: 24,
        }}
        className={className}
      >
        {detailsComponent}
      </Drawer>

      <UnstyledButton
        aria-label="watchlist details"
        onClick={open}
        className={clsx(
          'rounded-full border-2 border-solid border-[#c9c9c9] p-1 hover:border-[#a9a9a9] hover:bg-[#f5f5f5] dark:border-[#3a3a3a] dark:hover:border-[#4a4a4a] dark:hover:bg-[#2b2b2b]',
          className
        )}
      >
        <IconInfoCircle size={32} />
      </UnstyledButton>
    </>
  )
}
