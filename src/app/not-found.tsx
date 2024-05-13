import { Container, Title, Text, Button, Group, Anchor } from '@mantine/core'

import { NotFoundImage } from '@/components/common/NotFoundImage'

import styles from './not-found.module.css'

export default function NotFoundPage() {
  return (
    <Container className="flex min-h-[calc(100vh-150px)] items-center justify-center py-20">
      <div className="block">
        <NotFoundImage />
        <div className="relative z-10">
          <Title className={styles.title}>We can&apos;t find that :(</Title>
          <Text c="dimmed" size="lg" ta="center" className={styles.description}>
            Unluckers. The page you are trying to open does not exist. You may have mistyped the
            address, or the page has been moved to another URL. If you think this is an error LOL gg
            L loser unlucky.
          </Text>
          <Group justify="center">
            <Anchor href="/">
              <Button size="md">Take me back to home page</Button>
            </Anchor>
          </Group>
        </div>
      </div>
    </Container>
  )
}
