import type { ZodError } from 'zod'

export function transformZodValidationErrorToResponse(error: ZodError) {
  return {
    errors: error.flatten().fieldErrors,
  }
}
