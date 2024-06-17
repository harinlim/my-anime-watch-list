import { Button } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import { headers } from 'next/headers'
import Link from 'next/link'

import { isSameOrigin, isSamePath } from '@/lib/url'

import CreateWatchlistWrapper from './CreateWatchlistWrapper'

export default function CreateWatchlistPage() {
  const headersInit = headers()
  const referer = headersInit.get('referer')
  // TODO: USE RETURNURL INSTEAD OF REFERER ON SUCCESSFUL CREATE
  const currentPath = `/watchlists/create` // Note: currently there is no good way for getting pathnames in RSCs
  const returnUrl =
    referer && isSameOrigin(referer, headersInit) && isSamePath(referer, currentPath)
      ? referer
      : `/profile`

  return (
    <div className="lg: px-1/4 m-10 lg:flex lg:flex-col lg:items-center">
      <div className="space-y-6 lg:w-1/2">
        <Button
          component={Link}
          href={returnUrl}
          variant="transparent"
          size="md"
          leftSection={<IconArrowLeft size="20" />}
        >
          Back
        </Button>
        <CreateWatchlistWrapper nextUrl={returnUrl} />
      </div>
    </div>
  )
}
