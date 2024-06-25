import { Text, Popover, PopoverDropdown, PopoverTarget, Anchor } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Link from 'next/link'
import React, { memo } from 'react'

import type { PopoverProps } from '@mantine/core'
import type { ReactElement } from 'react'

type Props = {
  href: string
  title: string
  description: string | null
  createdAt?: string
  updatedAt?: string
  children: ReactElement
} & PopoverProps

export const AnimeDescriptionPopover = memo(
  ({ href, title, description, createdAt, updatedAt, children, ...rest }: Props) => {
    const [isOpen, { close, open }] = useDisclosure(false)

    if (!description) {
      return children
    }

    const childrenWithProps = React.cloneElement(children, {
      onMouseEnter: open,
      onMouseLeave: close,
    })

    const hasBottomSection = !!createdAt || !!updatedAt

    return (
      <Popover
        position="bottom"
        floatingStrategy="fixed"
        withArrow
        shadow="md"
        opened={isOpen}
        keepMounted
        offset={0} // Hack to keep focus
        {...rest}
      >
        <PopoverTarget>{childrenWithProps}</PopoverTarget>
        <PopoverDropdown
          // This is necessary for mouse events to work with popover interactions
          className="pointer-events-auto"
          onMouseEnter={open}
          onMouseLeave={close}
        >
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
        </PopoverDropdown>
      </Popover>
    )
  }
)
