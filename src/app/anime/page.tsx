import { AnimeList } from '@/components/anime/AnimeList'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function AnimePage() {
  return (
    <div className="flex flex-col justify-center items-center space-y-6">
      <h1>Anime</h1>
      <AnimeList />
    </div>
  )
}
