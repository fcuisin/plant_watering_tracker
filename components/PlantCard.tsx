import { ActionIcon, Badge, Card, Group, Text } from "@mantine/core";
import { IPlant } from "../models/plants";

export default function PlantCard({ plant }: { plant: IPlant }) {
  const getDaysUntilNextWater = (({ waterFrequency, lastWatered }) => {
    const msSinceLastWater =
      new Date().getTime() - new Date(lastWatered).getTime();
    const daysSinceLastWater = msSinceLastWater / (1000 * 60 * 60 * 24);

    return Math.ceil(waterFrequency - daysSinceLastWater);
  })(plant);

  console.log(getDaysUntilNextWater);

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Card.Section></Card.Section>

      <Group position="apart" my="sm" noWrap>
        <Text weight={600} lineClamp={1}>
          {plant.name}
        </Text>
        {plant.location && (
          <Badge
            color="green.1"
            variant="outline"
            size="sm"
            radius="sm"
            style={{ textTransform: "capitalize" }}
          >
            {plant.location}
          </Badge>
        )}
      </Group>

      <Group position="apart">
        <Text size="sm" color="dimmed">
          Water in {getDaysUntilNextWater} days
        </Text>
        <ActionIcon variant="light" color="blue" radius="md" title="Water now!">
          <i className="ri-contrast-drop-2-line" />
        </ActionIcon>
      </Group>
    </Card>
  );
}
