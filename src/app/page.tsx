import { Anchor, Button, Text, Title } from '@mantine/core'
import Link from 'next/link'

import { ColorSchemeToggle } from '@/components/common/ColorSchemeToggle'

import styles from './page.module.css'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <Title className={styles.title} ta="center" mt={100}>
        Welcome to{' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'pink', to: 'yellow' }}>
          Mantine
        </Text>
      </Title>

      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        This starter Next.js project includes a minimal setup for server side rendering, if you want
        to learn more on Mantine + Next.js integration follow{' '}
        <Anchor href="https://mantine.dev/guides/next/" size="lg">
          this guide
        </Anchor>
        . To get started edit page.tsx file.
      </Text>

      <Button
        component={Link}
        href="/login"
        className="w-8/12 max-w-2xl"
        variant="gradient"
        mt="lg"
        justify="center"
        size="xl"
      >
        <Text component="h2" size="xl">
          Login
        </Text>
      </Button>

      <ColorSchemeToggle />
    </main>
  )
}
