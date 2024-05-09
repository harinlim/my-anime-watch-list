import { Button, Text, Title } from '@mantine/core'
import Link from 'next/link'

import { SearchBar } from '@/components/common/Header/SearchBar'

import styles from './page.module.css'

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-150px)] flex flex-col items-center justify-center">
      <Title className={styles.title} ta="center">
        Welcome to{' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'blue', to: 'red' }}>
          MAWL
        </Text>
      </Title>

      <Text
        className="font-bold md:text-4xl"
        inherit
        variant="gradient"
        component="span"
        gradient={{ from: 'blue', to: 'red' }}
      >
        My Anime Watchlist
      </Text>

      <SearchBar className="sm:w-[50%] w-[90%] my-10" />

      <Text className="pb-8" c="dimmed" ta="center" size="lg" maw={580} mx="auto">
        Never forget what you&apos;ve seen. Save what you want to watch next. Start tracking your
        anime watchlists today. <em>*Disclaimer: this app is not associated with MyAnimeList.</em>
      </Text>

      <Button
        component={Link}
        href="/login"
        className="w-8/12 max-w-2xl"
        variant="gradient"
        radius="lg"
        mt="lg"
        justify="center"
        maw={200}
        size="xl"
      >
        <Text component="h2" size="xl">
          Login
        </Text>
      </Button>
    </div>
  )
}
