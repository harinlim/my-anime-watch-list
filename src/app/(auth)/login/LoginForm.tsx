'use client'

import { Text, TextInput, PasswordInput, Checkbox, Group, Button, Alert } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { IconAlertCircle } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { login } from '../actions'
import { loginSchema } from '../schemas'

export function LoginForm() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      identifier: '',
      password: '',
      remember: false,
    },
    validate: zodResolver(loginSchema),
    clearInputErrorOnChange: true,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()

  const handleSubmit = form.onSubmit(async values => {
    setIsSubmitting(true)
    const result = await login(values)

    if (result.success) {
      setError('')

      router.push('/profile')
      return
    }

    setIsSubmitting(false)

    if (result.fieldErrors) {
      setError('')
      form.setErrors({
        identifier: result.fieldErrors.identifier?.join('. '),
        password: result.fieldErrors.password?.join('. '),
      })
      return
    }

    if (result.error) {
      setError(result.error)
      return
    }

    setError('Failed to login. Please try again later.')
    console.error(result)
  })

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <Alert
          variant="light"
          color="red"
          mb="lg"
          title={error}
          withCloseButton
          closeButtonLabel="Dismiss error"
          onClose={() => setError('')}
          icon={<IconAlertCircle />}
        />
      )}
      <TextInput
        label="Username or email"
        placeholder="Username or email@example.com"
        key={form.key('identifier')}
        {...form.getInputProps('identifier')}
      />
      <PasswordInput
        label="Password"
        placeholder="Your password"
        mt="md"
        key={form.key('password')}
        {...form.getInputProps('password')}
      />
      <Group justify="space-between" mt="lg">
        <Checkbox
          label="Remember me"
          key={form.key('remember')}
          {...form.getInputProps('remember')}
        />
        {/* TODO: implement forgot password */}
        {/* <Anchor component={Link} size="sm">
      Forgot password?
    </Anchor> */}
      </Group>
      <Button type="submit" fullWidth mt="lg" size="md" disabled={isSubmitting}>
        <Text size="sm" fw={500}>
          Sign in
        </Text>
      </Button>
    </form>
  )
}
