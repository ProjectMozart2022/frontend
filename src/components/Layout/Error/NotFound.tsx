import {
  Anchor,
  Button,
  Container,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core"
import { useStyles } from "./styles/notFoundStyle"

export const NotFound = () => {
  const { classes } = useStyles()
  return (
    <Container className={classes.root}>
      <SimpleGrid
        spacing={80}
        cols={2}
        breakpoints={[{ maxWidth: "sm", cols: 1, spacing: 40 }]}>
        <Image src="images/notFound.svg" className={classes.mobileImage} />
        <div>
          <Title className={classes.title}>Something is not right...</Title>
          <Text color="dimmed" size="lg">
            Page you are trying to open does not exist. You may have mistyped
            the address, or the page has been moved to another URL. If you think
            this is an error contact support.
          </Text>
          <Button
            variant="outline"
            size="md"
            mt="xl"
            className={classes.control}>
            Get back to home page
          </Button>
        </div>
        <Stack justify="center">
          <Image src="images/notFound.svg" className={classes.desktopImage} />
          <Group position="right">
            <Text size="xs">
              <Anchor href="https://www.freepik.com/free-vector/error-404-concept-illustration_7741849.htm#query=404&position=4&from_view=keyword">
                Image by storyset
              </Anchor>{" "}
              on Freepik
            </Text>
          </Group>
        </Stack>
      </SimpleGrid>
    </Container>
  )
}
