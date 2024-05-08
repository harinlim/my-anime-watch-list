import { Container, Title, Text, Button, Group, Anchor } from '@mantine/core'

import { Illustration } from './Illustration'
import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <Container className="py-20">
      <div className="relative">
        <Illustration className={styles.image} />
        <div className={styles.content}>
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
