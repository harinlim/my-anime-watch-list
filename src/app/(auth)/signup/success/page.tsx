import { Title, Text, Button } from '@mantine/core'
import { IconArrowRight } from '@tabler/icons-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { getUserFromSession } from '@/db/users'
import { createServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function SignupSuccessPage() {
  const supabase = createServerClient()

  const { data: user } = await getUserFromSession(supabase)
  if (!user?.id) {
    return redirect('/login')
  }

  const welcomeText = user.username ? `Welcome, @${user.username} :)` : 'Welcome'

  return (
    <div className="flex min-h-[calc(100vh-150px)] flex-col items-center justify-center space-y-6 px-10">
      <Title className="text-center">{welcomeText}</Title>
      <Text className="text-center">
        You&apos;ve successfully created an account! Now you&apos;re ready to make your first
        watchlist.
      </Text>

      <Button
        component={Link}
        href="/profile"
        rightSection={<IconArrowRight className="size-3.5" />}
        className="h-12 rounded-md border border-blue-600 bg-transparent text-blue-600 dark:border-blue-400 dark:text-blue-400"
      >
        Go to your profile
      </Button>
    </div>
  )
}
