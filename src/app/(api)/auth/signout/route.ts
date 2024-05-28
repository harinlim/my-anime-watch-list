import { revalidatePath } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'

import { getUserFromSession } from '@/db/users'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = createServerClient()

  // Check if a user's logged in
  const { data: user } = await getUserFromSession(supabase)
  if (user) {
    // Logs out the user across all sessions and clears the cookies from the browser
    await supabase.auth.signOut()
  }

  revalidatePath('/', 'layout')
  return NextResponse.redirect(new URL('/', request.url), {
    status: 302,
  })
}
