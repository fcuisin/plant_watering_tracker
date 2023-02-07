import {
  ActionIcon,
  Badge,
  Card,
  Group,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { IPlant } from "../models/plants";
import PlantIcon from "./PlantIcon";

export default function PlantCard({ plant }: { plant: IPlant }) {
  const getDaysUntilNextWater = (({ waterFrequency, lastWatered }) => {
    const msSinceLastWater =
      new Date().getTime() - new Date(lastWatered).getTime();
    const daysSinceLastWater = msSinceLastWater / (1000 * 60 * 60 * 24);

    return Math.ceil(waterFrequency - daysSinceLastWater);
  })(plant);

  return (
    <Card shadow="sm" p="sm" radius="md" withBorder>
      <Card.Section
        style={{ display: "flex", justifyContent: "center", padding: 10 }}
      >
        <PlantIcon icon={plant?.icon} />
      </Card.Section>

      <Group position="apart" noWrap>
        <Stack spacing={0}>
          <Text weight={600} lineClamp={1}>
            {plant.name}
          </Text>
          <Text mt={5} color="dimmed" size="sm" lineClamp={1}>
            <Group spacing="xs">
              <i className="ri-contrast-drop-2-line ri-md" />
              {plant.waterQuantity} ml
            </Group>
          </Text>
          <Text size="sm" color="dimmed">
            Water in {getDaysUntilNextWater} days
          </Text>
        </Stack>
        <Tooltip label="Water now">
          <ActionIcon variant="outline" color="blue" size="lg" radius="xl">
            <i className="ri-contrast-drop-2-line ri-lg" />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Card>
  );
}
