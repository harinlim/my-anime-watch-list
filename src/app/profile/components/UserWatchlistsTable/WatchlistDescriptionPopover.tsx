import { Text, Anchor, HoverCard, HoverCardDropdown, HoverCardTarget, Badge } from '@mantine/core'
import { useId } from '@mantine/hooks'
import Link from 'next/link'
import React, { memo } from 'react'

import type { WatchlistOverview } from '@/types/watchlists'
import type { HoverCardProps } from '@mantine/core'
import type { ReactElement } from 'react'

type Props = {
  username: string
  watchlist: WatchlistOverview
  children: ReactElement
} & HoverCardProps

export const WatchlistDescriptionPopover = memo(
  ({ watchlist, username, children, ...rest }: Props) => {
    const tooltipId = useId()

    const childrenWithProps = React.cloneElement(children, {
      'aria-describedby': tooltipId,
    })

    const role = watchlist.watchlists_users.find(u => u.username === username)?.role

    return (
      <HoverCard
        position="bottom"
        shadow="md"
        withArrow
        keepMounted
        offset={0}
        withRoles={false}
        {...rest}
      >
        <HoverCardTarget>{childrenWithProps}</HoverCardTarget>

        <HoverCardDropdown id={tooltipId} role="tooltip">
          <Text fz="md" className="line-clamp-2 max-w-72 break-words font-semibold sm:max-w-96">
            {watchlist.title}
          </Text>
          <Text size="sm" className="mt-1 line-clamp-6 max-w-72 sm:max-w-96">
            {watchlist.description}
          </Text>
          <Anchor size="sm" component={Link} href={`/watchlists/${watchlist.id}`} className="py-1">
            See more
          </Anchor>

          <hr className="my-2 border-gray-200" />

          {/* TODO: Make this pretty */}
          <Text size="sm" className="mt-1 line-clamp-6 max-w-72 sm:max-w-96">
            <Text component="span" className="font-semibold">
              Role:&nbsp;
            </Text>
            <Badge component="span" className="capitalize" color="indigo">
              {role}
            </Badge>
          </Text>

          <hr className="my-2 border-gray-200" />

          <Text size="sm" className="mt-1 line-clamp-6 max-w-72 sm:max-w-96">
            <Text component="span" fs="italic">
              Created:&nbsp;
            </Text>
            {new Date(watchlist.created_at).toLocaleDateString()}
          </Text>
          <Text size="sm" className="mt-1 line-clamp-6 max-w-72 sm:max-w-96">
            <Text component="span" fs="italic">
              Updated:&nbsp;
            </Text>
            {new Date(watchlist.updated_at).toLocaleDateString()}
          </Text>
        </HoverCardDropdown>
      </HoverCard>
    )
  }
)
