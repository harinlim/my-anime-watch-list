import { Button } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { getUserFromSession } from '@/db/users'
import { createServerClient } from '@/lib/supabase/server'
import { isSameOrigin, isSamePath } from '@/lib/url'

import { CreateWatchlistForm } from './CreateWatchlistForm'

export default async function CreateWatchlistPage() {
  const supabase = createServerClient()
  const { data: user } = await getUserFromSession(supabase)
  if (!user) {
    redirect('/login')
  }

  const headersInit = headers()
  const referer = headersInit.get('referer')
  // TODO: USE RETURNURL INSTEAD OF REFERER ON SUCCESSFUL CREATE
  const currentPath = `/watchlists/create` // Note: currently there is no good way for getting pathnames in RSCs
  const returnUrl =
    referer && isSameOrigin(referer, headersInit) && !isSamePath(referer, currentPath)
      ? referer
      : null

  return (
    <div className="mx-2 my-5 md:mx-5 md:flex md:flex-col md:items-center lg:m-10">
      <div className="space-y-2 md:w-2/3 md:max-w-2xl">
        <Button
          component={Link}
          href={returnUrl ?? '/watchlists'}
          variant="transparent"
          size="md"
          leftSection={<IconArrowLeft size="20" />}
        >
          Back
        </Button>
        <CreateWatchlistForm nextUrl={returnUrl} />
      </div>
    </div>
  )
}
