import { createServerClient as createSupabaseClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

import { SERVER_COOKIE_OPTIONS, AUTH_TOKEN_KEY } from './cookies'

import type { Database } from '@/types/generated/supabase'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createSupabaseClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      auth: {
        // debug: true,
        autoRefreshToken: true,
      },
      cookies: {
        get(name: string) {
          console.log('GETTING COOKIE FROM MIDDLEWARE')
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          console.log('CALLING SET', name, value)
          request.cookies.set({
            name,
            value,
            ...options,
          })

          console.log('BEFORE:')
          console.log(response.headers.get('x-middleware-request-cookie'))

          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
          console.log('AFTER:')
          console.log(response.headers.get('x-middleware-request-cookie'))
        },
        remove(name: string, options: CookieOptions) {
          console.log('CALLING REMOVE', name)
          console.log('BEFORE:')
          console.log(response.headers.get('x-middleware-request-cookie'))

          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })

          console.log('AFTER:')
          console.log(response.headers.get('x-middleware-request-cookie'))
        },
      },
      cookieOptions: SERVER_COOKIE_OPTIONS,
    }
  )

  // refreshing the auth token
  console.log('MIDDLEWARE')
  // console.log(request.cookies.get(process.env.SUPABASE_AUTH_TOKEN_KEY!))

  const result = await supabase.auth.getUser()
  // console.log(await supabase.auth.(result.data.user.))
  // console.log(result.data.user)
  console.log('USER EXISTS:', result.data.user !== null)
  // console.log(request.cookies.get(process.env.SUPABASE_AUTH_TOKEN_KEY!))

  if (result.data.user === null) {
    console.log('DELETING COOKIE...')
    // console.log('DELETING COOKIE')
    request.cookies.set({ name: AUTH_TOKEN_KEY, value: '' })
    // console.log(request.cookies.getAll())
    response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    response.cookies.set({ name: AUTH_TOKEN_KEY, value: '', maxAge: 0 })

    // console.log(response.headers)

    // const middlewareCookie = response.headers.get('x-middleware-request-cookie')
    // if (middlewareCookie) {
    //   const withDeletedCookie = setCookieFromString(middlewareCookie, process.env.SUPABASE_AUTH_TOKEN_KEY!, '')
    //   response.headers.set('x-middleware-request-cookie', withDeletedCookie)
    // }
  }

  return response
}

/*

[
  [ 'hello', '' ],
  [
  'sb-dcbgebhdaoaccfraxvlw-auth-token',
  '{
    "access_token":"eyJhbGciOiJIUzI1NiIsImtpZCI6ImNIZDA2cHN4bDFKQWpiUG8iLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzE2OTM3OTgyLCJpYXQiOjE3MTY5MTYzODIsImlzcyI6Imh0dHBzOi8vZGNiZ2ViaGRhb2FjY2ZyYXh2bHcuc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6IjM0NWM2MjA0LTYxY2UtNDM0OC1iN2I2LTdkNmRmMTRkNDU4MCIsImVtYWlsIjoibGltMDNoKzUwQGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiYXZhdGFyX3VybCI6bnVsbCwiZW1haWwiOiJsaW0wM2grNTBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6IjM0NWM2MjA0LTYxY2UtNDM0OC1iN2I2LTdkNmRmMTRkNDU4MCIsInVzZXJuYW1lIjoiaGFyaW41MCJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzE2OTE2MzgyfV0sInNlc3Npb25faWQiOiI5MjQ2NTRjMC1lZTU4LTQzNWYtYTI5Yy01NzFlYmYzNDI2NmYiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.0gE9LNRBzSsN3aNnZXpesBdAc2c2KhEQzjoMlgnIz5E",
    "token_type":"bearer",
    "expires_in":21600,
    "expires_at":1716937982,
    "refresh_token":"4PlzZIpQRyLRBML3yb8E7A",
    "user":{
      "id":"345c6204-61ce-4348-b7b6-7d6df14d4580",
      "aud":"authenticated",
      "role":"authenticated",
      "email":"lim03h+50@gmail.com",
      "email_confirmed_at":"2024-05-08T10:55:51.827522Z",
      "phone":"","confirmed_at":"2024-05-08T10:55:51.827522Z",
      "last_sign_in_at":"2024-05-28T17:13:02.138726039Z",
      "app_metadata":{"provider":"email","providers":["email"]},
      "user_metadata":{"avatar_url":null,"email":"lim03h+50@gmail.com",
      "email_verified":false,"phone_verified":false,"sub":"345c6204-61ce-4348-b7b6-7d6df14d4580",
      "username":"harin50"
    },
    "identities":[{"identity_id":"2737cbf2-555b-4e7e-988c-84d71ec0406f","id":"345c6204-61ce-4348-b7b6-7d6df14d4580","user_id":"345c6204-61ce-4348-b7b6-7d6df14d4580","identity_data":{"email":"lim03h+50@gmail.com","email_verified":false,"phone_verified":false,"sub":"345c6204-61ce-4348-b7b6-7d6df14d4580","username":"harin50"},"provider":"email","last_sign_in_at":"2024-05-08T10:55:51.82391Z","created_at":"2024-05-08T10:55:51.823962Z","updated_at":"2024-05-08T10:55:51.823962Z","email":"lim03h+50@gmail.com"}],"created_at":"2024-05-08T10:55:51.81896Z","updated_at":"2024-05-28T17:13:02.141466Z","is_anonymous":false}}'
]
]

*/
