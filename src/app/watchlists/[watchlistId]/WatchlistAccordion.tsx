import { Accordion, AccordionItem, AccordionControl, AccordionPanel } from '@mantine/core'
import clsx from 'clsx'

import { WatchlistDetails } from './WatchlistDetails'

import type { Watchlist } from '@/types/watchlists'

type Props = {
  watchlist: Watchlist
  className?: string
}

export function WatchlistAccordion({ watchlist, className }: Props) {
  return (
    <div className={clsx('pt-4', className)}>
      {/* <WatchlistCollaborators watchlistId={watchlistId} /> */}
      <Accordion chevronPosition="right">
        <AccordionItem key={watchlist.id} value={`${watchlist.id}`}>
          <AccordionControl className="text-sm">Details</AccordionControl>
          <AccordionPanel>
            <WatchlistDetails watchlist={watchlist} />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
