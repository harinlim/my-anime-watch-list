import { useState } from 'react'

import type { UseFormReturnType } from '@mantine/form'

export const useWatchFormState = <TState, TFormValues extends Record<string, unknown>>(
  form: UseFormReturnType<TFormValues>,
  { initialValue, setState }: { initialValue: TState; setState: (prevState: TState) => TState }
) => {
  const [watchState, setWatchState] = useState(initialValue)

  // eslint-disable-next-line unicorn/no-array-for-each
  Object.keys(form.values).forEach(key =>
    form.watch(key, () => {
      setWatchState(prevState => setState(prevState))
    })
  )

  return watchState
}
