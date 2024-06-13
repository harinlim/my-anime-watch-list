import { Flex, Group, Text, Title } from '@mantine/core'
import { IconArmchair2 } from '@tabler/icons-react'
import clsx from 'clsx'
import Link from 'next/link'

import { ColorSchemeToggle } from './ColorSchemeToggle'
import styles from './Header.module.css'
import { SearchBar } from './SearchBar'
import { UserMenu } from './UserMenu'
import { UserMenuDropdown } from './UserMenuDropdown'

import type { User } from '@/types/users'

type Props = {
  user: User | null
}

const links = [
  { link: '/anime', label: 'Anime' },
  { link: '/watchlists', label: 'Watchlists' },
]

export function Header({ user }: Props) {
  return (
    <header className={clsx(styles.header, 'h-14')}>
      <Flex className="h-14 items-center justify-between">
        <Link className="flex flex-nowrap items-center gap-2" href="/">
          <IconArmchair2 />
          <Text inherit variant="gradient" component="span" gradient={{ from: 'blue', to: 'red' }}>
            <Title order={3}>MAWL</Title>
          </Text>
        </Link>

        <Group ml={30} className="flex-nowrap">
          <Group visibleFrom="sm" gap="5" className="flex-nowrap">
            {links.map(link => (
              <Link
                key={link.label}
                href={link.link}
                className={clsx(styles.link, 'min-w-20 px-2 py-3 text-center font-medium')}
              >
                {link.label}
              </Link>
            ))}
          </Group>

          <Group gap={20} className="flex-nowrap">
            <SearchBar defaultType="/anime" includeSearchType className={styles.search} />
            <ColorSchemeToggle />
          </Group>

          {user?.id ? (
            <UserMenu user={user}>
              <UserMenuDropdown />
            </UserMenu>
          ) : (
            <Link
              href="/login"
              className={clsx(styles.link, 'min-w-20 shrink-0 px-3 py-3 text-center font-medium')}
            >
              Sign in
            </Link>
          )}
        </Group>
      </Flex>
    </header>
  )
}
