import { Title } from '@mantine/core'

import { AnimeList } from '@/components/anime/AnimeList'
import { SearchBar } from '@/components/common/Header/SearchBar'

export default function AnimePage() {
  return (
    <div className="min-w-screen mt-10 flex flex-col items-center justify-center space-y-6">
      <div className="mb-10 flex w-full flex-col flex-nowrap items-center justify-center lg:w-4/5">
        <Title order={1} className="mb-10 text-5xl font-extrabold">
          Anime Search
        </Title>
        <SearchBar
          overrideType="/anime"
          includeSearchParams
          includeSubmit
          className="mb-10 w-4/5 md:w-3/5"
        />
        <AnimeList />
      </div>
    </div>
  )
}
