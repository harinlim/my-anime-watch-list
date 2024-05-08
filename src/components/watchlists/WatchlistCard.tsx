import { Box, Text, Title, Button, BackgroundImage, Group } from '@mantine/core'

import styles from './WatchlistCard.module.css'

export function WatchlistCard() {
  const url =
    'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80'
  return (
    <Box className={styles.card} maw={300} mih={300} background-image={url}>
      <BackgroundImage src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-6.png">
        <Group className="p-5 min-w-100 min-h-70">
          <div>
            <Text className={styles.category} size="xs">
              nature
            </Text>
            <Title order={3} className={styles.title}>
              Best forests to visit in North America
            </Title>
          </div>
          <Button variant="white" color="dark">
            Read article
          </Button>
        </Group>
      </BackgroundImage>
    </Box>
  )
}
