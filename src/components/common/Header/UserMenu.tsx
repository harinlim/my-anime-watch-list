'use client'

import { Group, Menu, MenuTarget, Text, UnstyledButton, rem } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import clsx from 'clsx'
import { useState } from 'react'

import styles from './UserMenu.module.css'

import type { User } from '@/types/users'
import type { ReactNode } from 'react'

type Props = {
  user: User | null
  children?: ReactNode
}

export function UserMenu({ user, children }: Props) {
  const [userMenuOpened, setUserMenuOpened] = useState(false)

  return (
    <Menu
      width={260}
      position="bottom-end"
      transitionProps={{ transition: 'pop-top-right' }}
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
      withinPortal
    >
      <MenuTarget>
        <UnstyledButton
          type="button"
          className={clsx(styles.user, { [styles.userActive]: userMenuOpened })}
        >
          <Group gap={7} className="flex-nowrap">
            <Text fw={500} size="sm" lh={1} mr={3}>
              @{user?.username}
            </Text>
            <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
          </Group>
        </UnstyledButton>
      </MenuTarget>

      {children}
    </Menu>
  )
}
