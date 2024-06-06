import { Title, Text, Button } from '@mantine/core'
import { IconArrowRight } from '@tabler/icons-react'
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
      <Title order={1} className="sm:text-center">
        {welcomeText}
      </Title>
      <Text className="sm:text-center">
        You&apos;ve successfully created an account! Now you&apos;re ready to make your first
        watchlist.
      </Text>
      <a href="/profile">
        <Button
          variant="filled"
          color="teal"
          size="lg"
          radius="md"
          rightSection={<IconArrowRight size={14} />}
        >
          Go to your profile
        </Button>
      </a>
    </div>
  )
}
