import { Accordion, AccordionItem, AccordionControl, AccordionPanel } from '@mantine/core'
import clsx from 'clsx'

import type { Watchlist } from '@/types/watchlists'
import type { ReactNode } from 'react'

type Props = {
  watchlist: Watchlist
  className?: string
  children: ReactNode
}

export function WatchlistAccordion({ children, watchlist, className }: Props) {
  return (
    <Accordion className={clsx('pt-4', className)} chevronPosition="right">
      <AccordionItem value={`${watchlist.id}`}>
        <AccordionControl className="text-sm">Details</AccordionControl>
        <AccordionPanel>{children}</AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
