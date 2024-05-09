'use client'

import { Anchor, Group, Text, Title } from '@mantine/core'
import { IconArmchair2 } from '@tabler/icons-react'
import clsx from 'clsx'
import Link from 'next/link'

import { ColorSchemeToggle } from './ColorSchemeToggle'
import styles from './Header.module.css'
import { SearchBar } from './SearchBar'
import { UserMenu } from './UserMenu'

import type { User } from '@/api/users/types'

type Props = {
  user: User | null
}

const links = [
  { link: '/anime', label: 'Anime' },
  { link: '/watchlists', label: 'Watchlists' },
]

export function Header({ user }: Props) {
  // const [opened, { toggle }] = useDisclosure(false

  const items = links.map(link => (
    <Link key={link.label} href={link.link} className={styles.link}>
      {link.label}
    </Link>
  ))

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Group className="flex-nowrap">
          <Link className="flex flex-nowrap items-center gap-2" href="/">
            <IconArmchair2 />
            <Text
              inherit
              variant="gradient"
              component="span"
              gradient={{ from: 'blue', to: 'red' }}
            >
              <Title order={3}>MAWL</Title>
            </Text>
          </Link>
        </Group>

        <Group ml={30} className={clsx(styles.links, 'flex-nowrap')}>
          <Group visibleFrom="md" gap="5">
            {items}
          </Group>

          <Group gap={20} className="sm flex-nowrap">
            <SearchBar defaultType="/anime" includeSearchType className={styles.search} />
            <ColorSchemeToggle />
          </Group>

          {user?.id ? (
            <UserMenu user={user} />
          ) : (
            <Anchor component={Link} href="/login" className={styles.link}>
              Sign in
            </Anchor>
          )}
        </Group>
      </div>
    </header>
  )
}
