'use server'

import { revalidatePath } from 'next/cache'

const revalidate = (path: string) => {
  try {
    if (path) {
      revalidatePath(path)
    }
  } catch (error) {
    console.error('revalidate=>', error)
  }
}

export default revalidate
