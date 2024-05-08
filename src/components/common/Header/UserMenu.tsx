'use client'

import {
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuLabel,
  MenuTarget,
  Text,
  UnstyledButton,
  rem,
  useMantineTheme,
} from '@mantine/core'
import {
  IconChevronDown,
  IconHeart,
  IconLogout,
  IconSettings,
  IconSwitchHorizontal,
} from '@tabler/icons-react'
import clsx from 'clsx'
import Link from 'next/link'
import { useState } from 'react'

import styles from './UserMenu.module.css'

import type { User } from '@/api/users/types'

type Props = {
  user: User | null
}

export function UserMenu({ user }: Props) {
  const [userMenuOpened, setUserMenuOpened] = useState(false)
  const theme = useMantineTheme()

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
        <UnstyledButton className={clsx(styles.user, { [styles.userActive]: userMenuOpened })}>
          <Group gap={7}>
            <Text fw={500} size="sm" lh={1} mr={3}>
              @{user?.username}
            </Text>
            <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
          </Group>
        </UnstyledButton>
      </MenuTarget>

      <MenuDropdown>
        <MenuItem
          component={Link}
          href="/profile"
          leftSection={
            <IconHeart
              style={{ width: rem(16), height: rem(16) }}
              color={theme.colors.red[6]}
              stroke={1.5}
            />
          }
        >
          My Watchlists
        </MenuItem>
        {/* <Menu.Item
                  leftSection={
                    <IconStar
                      style={{ width: rem(16), height: rem(16) }}
                      color={theme.colors.yellow[6]}
                      stroke={1.5}
                    />
                  }
                >
                  Saved posts
                </Menu.Item> */}
        {/* <Menu.Item
                  leftSection={
                    <IconMessage
                      style={{ width: rem(16), height: rem(16) }}
                      color={theme.colors.blue[6]}
                      stroke={1.5}
                    />
                  }
                >
                  Your comments
                </Menu.Item> */}

        <MenuLabel>Settings</MenuLabel>
        <MenuItem
          leftSection={<IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
        >
          Account settings
        </MenuItem>
        <MenuItem
          leftSection={
            <IconSwitchHorizontal style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          }
        >
          Change account
        </MenuItem>
        <form action="/auth/signout" method="POST">
          <MenuItem
            type="submit"
            leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
          >
            Log out
          </MenuItem>
        </form>

        {/* <Menu.Divider />

              <Menu.Label>Danger zone</Menu.Label> */}
        {/* To be enabled if deletion is implemented */}
        {/* <Menu.Item
                color="red"
                leftSection={<IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
              >
                Delete account
              </Menu.Item> */}
      </MenuDropdown>
    </Menu>
  )
}
