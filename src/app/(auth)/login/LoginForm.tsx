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
          title={error}
          withCloseButton
          closeButtonLabel="Dismiss error"
          onClose={() => setError('')}
          icon={<IconAlertCircle />}
          className="bg-color mb-5"
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
        key={form.key('password')}
        {...form.getInputProps('password')}
        className="mt-4"
      />
      <Group className="mt-5 justify-between">
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
      <Button type="submit" disabled={isSubmitting} className="mt-5 h-11 w-full bg-blue-600">
        <Text className="text-sm font-medium">Sign in</Text>
      </Button>
    </form>
  )
}
