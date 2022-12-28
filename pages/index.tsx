import {
  Container,
  Stack,
  Title,
  createStyles,
  Group,
  Autocomplete,
} from "@mantine/core";
import Image from "next/image";
import AddPlantModal from "../components/AddPlantModal";

import Logo from "../components/images/main-logo.svg";

const useStyles = createStyles((theme) => ({
  highlight: {
    position: "relative",
    backgroundColor: theme.colors.green[5],
    borderRadius: theme.radius.sm,
    padding: "4px 12px",
  },
}));

export default function Home() {
  const { classes } = useStyles();

  return (
    <Container p={0}>
      <Stack
        align="center"
        p={80}
        sx={(theme) => ({
          position: "relative",
          borderRadius: 50,
          backgroundColor: theme.colors.green[3],
        })}
      >
        <Image src={Logo} height="50" width="100" alt="main-logo" />
        <Title weight="bold">
          <span className={classes.highlight}>Plant</span> Watering Tracker
        </Title>
        <Group style={{ position: "absolute", bottom: -18 }}>
          <Autocomplete
            size="md"
            radius="md"
            placeholder="Search..."
            data={[]}
          />
          <AddPlantModal />
        </Group>
      </Stack>
    </Container>
  );
}
