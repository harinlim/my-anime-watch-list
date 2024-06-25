import { Text, Anchor, HoverCard, HoverCardDropdown, HoverCardTarget } from '@mantine/core'
import { useId } from '@mantine/hooks'
import Link from 'next/link'
import React, { memo } from 'react'

import type { HoverCardProps } from '@mantine/core'
import type { ReactElement } from 'react'

type Props = {
  href: string
  title: string
  description: string | null
  createdAt?: string
  updatedAt?: string
  children: ReactElement
} & HoverCardProps

export const AnimeDescriptionPopover = memo(
  ({ href, title, description, createdAt, updatedAt, children, ...rest }: Props) => {
    const tooltipId = useId()

    if (!description) {
      return children
    }

    const childrenWithProps = React.cloneElement(children, {
      'aria-describedby': tooltipId,
    })

    const hasBottomSection = !!createdAt || !!updatedAt

    return (
      <HoverCard
        position="bottom"
        floatingStrategy="fixed"
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
            {title}
          </Text>
          <Text size="sm" className="mt-1 line-clamp-6 max-w-72 sm:max-w-96">
            {description}
          </Text>
          <Anchor size="sm" component={Link} href={href} className="py-1">
            Read more
          </Anchor>

          {hasBottomSection && <hr className="my-2 border-gray-200" />}

          {createdAt && (
            <Text size="sm" className="mt-1 line-clamp-6 max-w-72 sm:max-w-96">
              <Text component="span" fs="italic">
                Added:&nbsp;
              </Text>
              {new Date(createdAt).toLocaleDateString()}
            </Text>
          )}
          {updatedAt && (
            <Text size="sm" className="mt-1 line-clamp-6 max-w-72 sm:max-w-96">
              <Text component="span" fs="italic">
                Updated:&nbsp;
              </Text>
              {new Date(updatedAt).toLocaleDateString()}
            </Text>
          )}
        </HoverCardDropdown>
      </HoverCard>
    )
  }
)
