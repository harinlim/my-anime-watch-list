import { Text, Title } from '@mantine/core'
import clsx from 'clsx'

import { SearchBar } from '@/components/common/Header/SearchBar'

import styles from './page.module.css'

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-150px)] flex-col items-center justify-center pb-20">
      <Title className={clsx('text-5xl md:text-7xl', styles.title)} ta="center">
        Welcome to{' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'indigo', to: 'red' }}>
          MAWL
        </Text>
      </Title>

      <Text
        className="mt-1 text-2xl font-bold md:mt-2 md:text-3xl"
        inherit
        variant="gradient"
        component="span"
        gradient={{ from: 'red', to: 'indigo' }}
      >
        My Anime Watchlist
      </Text>

      <SearchBar
        overrideType="/anime"
        includeSearchParams
        includeSubmit
        size="md"
        className="my-10 w-4/5 md:w-3/5"
      />
    </div>
  )
}
