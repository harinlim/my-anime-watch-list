import { Affix } from '@mantine/core'

import { CreateWatchlistButton } from '@/components/watchlists/CreateWatchlistButton'

export function CreateWatchlistButtonFixed() {
  return (
    <Affix position={{ bottom: 40, right: 40 }} className="flex justify-center">
      <CreateWatchlistButton size="lg" />
    </Affix>
  )
}
