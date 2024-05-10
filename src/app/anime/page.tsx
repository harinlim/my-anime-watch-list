import { Title } from '@mantine/core'

import { AnimeList } from '@/components/anime/AnimeList'
import { SearchBar } from '@/components/common/Header/SearchBar'

export default function AnimePage() {
  return (
    <div className="flex flex-col min-w-screen justify-center items-center space-y-6 mt-10">
      <div className="w-full flex flex-col flex-nowrap justify-center items-center lg:max-w-4/5 mb-10">
        <Title order={1} className="mb-10 text-5xl font-extrabold">
          Anime Search
        </Title>
        <SearchBar
          overrideType="/anime"
          includeSearchParams
          includeSubmit
          className="w-4/5 md:w-3/5 mb-10"
        />
        <AnimeList />
      </div>
    </div>
  )
}
