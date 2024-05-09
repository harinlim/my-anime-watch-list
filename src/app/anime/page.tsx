import { Title } from '@mantine/core'

import { AnimeList } from '@/components/anime/AnimeList'
import { SearchBar } from '@/components/common/Header/SearchBar'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function AnimePage() {
  return (
    <div className="flex flex-col w-screen justify-center items-center space-y-6 mt-10">
      <div className="flex flex-col flex-nowrap justify-center items-center lg:max-w-[80%]">
        <Title order={1} className="mb-10 text-5xl font-extrabold">
          Anime Search
        </Title>
        <SearchBar className="sm:w-[50%] w-[90%] mb-10" />
        <AnimeList />
      </div>
    </div>
  )
}
