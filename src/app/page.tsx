import { Button, Text, Title } from '@mantine/core'
import Link from 'next/link'

import styles from './page.module.css'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <Title className={styles.title} ta="center" mt={100}>
        Welcome to{' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'blue', to: 'red' }}>
          MAWL
        </Text>
      </Title>

      <Text className="p-8" c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        Never forget what you&apos;ve seen. Save what you want to watch next. Start tracking your
        anime watchlists today. *Disclaimer: this app is not associated with MyAnimeList.
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
    </main>
  )
}
