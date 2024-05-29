import { updateSession } from '@/lib/supabase/middleware'

import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // update user's auth session
  return updateSession(request)
}

// TODO: Add request header to skip user refresh in the middleware if it's already been checked
// Right now, we have to call the supabase server on every route to validate user sessions,
// whcih is redundant when using API calls from a server component. We only need it at the first layer
// (client->server).

// TODO: Consider adding CORS protection with API routes to prevent direct calls we do not want to expose.

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
