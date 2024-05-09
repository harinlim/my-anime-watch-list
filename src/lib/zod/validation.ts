import type { ZodError } from 'zod'

// TODO: make this more api-consumer friendly
export function transformZodValidationErrorToResponse(error: ZodError) {
  return {
    errors: error.issues,
  }
}
