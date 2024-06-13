import { headers } from 'next/headers'

import WatchlistForm from '@/components/watchlists/WatchlistForm'

export default function CreateWatchlistPage() {
  const headersList = headers()
  const referer = headersList.get('referer')

  return (
    <div className="lg: px-1/4 m-10 lg:flex lg:flex-col lg:items-center">
      <div className="space-y-6 lg:w-1/2">
        <WatchlistForm referer={referer ?? undefined} />
      </div>
    </div>
  )
}
