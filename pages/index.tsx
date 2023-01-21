import {
  Container,
  Title,
  createStyles,
  Group,
  Autocomplete,
  Tabs,
  ActionIcon,
} from "@mantine/core";
import Image from "next/image";

import Logo from "../components/images/main-logo.svg";
import { HEADER_HEIGHT } from "../components/utils/constants";

const useStyles = createStyles((theme) => ({
  highlight: {
    position: "relative",
    color: theme.white,
    backgroundColor: theme.colors.green[7],
    borderRadius: theme.radius.md,
    padding: "4px 12px",
  },
}));

export default function Home() {
  const { classes } = useStyles();

  return (
    <Container py={0} px={10}>
      <Group
        spacing={0}
        position="center"
        style={{ height: HEADER_HEIGHT }}
        my="lg"
        noWrap
      >
        <Image src={Logo} height="50" width="100" alt="main-logo" />
        <Title order={2}>
          <span className={classes.highlight}>Plant</span> Watering Tracker
        </Title>
      </Group>
      <Group position="apart">
        <Tabs
          defaultValue="gallery"
          variant="pills"
          color="green.6"
          styles={(theme) => ({
            root: { width: "100%" },
            tab: {
              border: `1px solid ${theme.colors.green[7]}`,
              color: theme.colors.green[7],
            },
            tabLabel: { fontWeight: 600 },
          })}
        >
          <Tabs.List>
            <Group position="apart" style={{ width: "100%" }}>
              <Group>
                <Tabs.Tab
                  value="gallery"
                  icon={<i className="ri-plant-line ri-lg"></i>}
                >
                  Today
                </Tabs.Tab>
                <Tabs.Tab
                  value="messages"
                  icon={<i className="ri-calendar-line ri-lg"></i>}
                >
                  Upcoming
                </Tabs.Tab>
              </Group>
              <Group>
                <Autocomplete
                  placeholder="search"
                  data={[]}
                  styles={(theme) => ({
                    input: {
                      border: 0,
                      borderRadius: 0,
                      borderBottom: `1px solid ${theme.colors.green[7]}`,
                    },
                  })}
                  icon={<i className="ri-search-line ri-lg"></i>}
                />
                <ActionIcon
                  color="dark"
                  variant="filled"
                  style={{ height: 36, width: 36 }}
                >
                  <i className="ri-add-line ri-lg"></i>
                </ActionIcon>
              </Group>
            </Group>
          </Tabs.List>

          <Tabs.Panel value="gallery" pt="xs">
            Today plants
          </Tabs.Panel>

          <Tabs.Panel value="messages" pt="xs">
            Upcoming plants
          </Tabs.Panel>
        </Tabs>
      </Group>
    </Container>
  );
}
