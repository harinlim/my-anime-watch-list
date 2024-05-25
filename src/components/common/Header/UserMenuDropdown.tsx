import { MenuDropdown, MenuItem, MenuLabel, rem } from '@mantine/core'
import { IconHeart, IconUser, IconBooks, IconLogout, IconSettings } from '@tabler/icons-react'
import Link from 'next/link'

export function UserMenuDropdown() {
  return (
    <MenuDropdown>
      <MenuItem
        component={Link}
        href="/profile"
        leftSection={<IconUser style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
      >
        My Profile
      </MenuItem>

      <MenuItem
        component={Link}
        href="/profile"
        leftSection={
          <IconBooks
            style={{ width: rem(16), height: rem(16) }}
            className="text-[--mantine-color-blue-6]"
            stroke={1.5}
          />
        }
      >
        My Watchlists
      </MenuItem>

      <MenuItem
        component={Link}
        href="/profile"
        leftSection={
          <IconHeart
            style={{ width: rem(16), height: rem(16) }}
            className="text-[--mantine-color-red-6]"
            stroke={1.5}
          />
        }
      >
        My Anime
      </MenuItem>

      <MenuLabel>Settings</MenuLabel>

      <MenuItem
        leftSection={<IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
      >
        Account Settings
      </MenuItem>

      <form action="/auth/signout" method="POST">
        <MenuItem
          type="submit"
          leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
        >
          Log out
        </MenuItem>
      </form>
    </MenuDropdown>
  )
}
