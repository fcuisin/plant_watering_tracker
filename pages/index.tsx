import { Container, Stack, Title, Button, createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  highlight: {
    position: "relative",
    backgroundColor: theme.fn.variant({
      variant: "light",
      color: theme.colors.green[0],
    }).background,
    borderRadius: theme.radius.sm,
    padding: "4px 12px",
  },
}));

export default function Home() {
  const { classes } = useStyles();
  return (
    <Container p="lg">
      <Stack align="center">
        <Title weight="bold">
          <span className={classes.highlight}>Plant</span> Watering Tracker
        </Title>

        <Button radius="xl" mt={30} color="green.7" size="md">
          Add plant
        </Button>
      </Stack>
    </Container>
  );
}
