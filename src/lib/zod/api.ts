import type { NextRequest } from 'next/server'
import type { z } from 'zod'

export async function parseRequestBody<T>(
  request: NextRequest,
  schema: z.ZodType<T>
): Promise<z.infer<z.ZodType<T>> | null> {
  try {
    return schema.parse(await request.json())
  } catch {
    return null
  }
}

export async function safeParseRequestBody<T>(request: NextRequest, schema: z.ZodType<T>) {
  try {
    return schema.safeParse(await request.json())
  } catch {
    const parseError: {
      success: false
      message: string
      error?: never
      data?: never
    } = { success: false, message: 'Failed to parse the request body' }
    return parseError
  }
}
