'use client'

import {
  ActionIcon as ActionIconButton,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core'
import { IconMoon, IconSun } from '@tabler/icons-react'

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('dark', { getInitialValueInEffect: true })

  return (
    <ActionIconButton
      type="button"
      onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
      variant="default"
      size="lg"
      aria-label="Toggle color scheme"
    >
      <IconSun className="hidden dark:block" stroke={1.5} />
      <IconMoon className="dark:hidden" stroke={1.5} />
    </ActionIconButton>
  )
}
