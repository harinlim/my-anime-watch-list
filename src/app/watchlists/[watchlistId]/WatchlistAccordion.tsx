import { Accordion, AccordionItem, AccordionControl, AccordionPanel } from '@mantine/core'
import clsx from 'clsx'

import { WatchlistDetails } from './WatchlistDetails'

import type { Watchlist, WatchlistUser } from '@/types/watchlists'

type Props = {
  collaborators: WatchlistUser[]
  watchlist: Watchlist
  className?: string
}

export function WatchlistAccordion({ collaborators, watchlist, className }: Props) {
  return (
    <div className={clsx('pt-4', className)}>
      <Accordion chevronPosition="right">
        <AccordionItem key={watchlist.id} value={`${watchlist.id}`}>
          <AccordionControl className="text-sm">Details</AccordionControl>
          <AccordionPanel>
            <WatchlistDetails collaborators={collaborators} watchlist={watchlist} />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
