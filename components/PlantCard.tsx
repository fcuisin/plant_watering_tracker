import {
  ActionIcon,
  Badge,
  Card,
  Group,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import Link from "next/link";
import { fetchAPI } from "../lib/fetchApi";
import { IPlant } from "../models/plants";
import PlantIcon from "./PlantIcon";

export default function PlantCard({ plant }: { plant: IPlant }) {
  const getDaysUntilNextWater = (({ waterFrequency, lastWatered }) => {
    const msSinceLastWater =
      new Date().getTime() - new Date(lastWatered).getTime();
    const daysSinceLastWater = msSinceLastWater / (1000 * 60 * 60 * 24);

    return Math.ceil(waterFrequency - daysSinceLastWater);
  })(plant);

  const updatePlantHandler = async (plantData: IPlant) => {
    try {
      await fetchAPI("/api/plants", {
        method: "PUT",
        body: JSON.stringify(plantData),
      });
    } catch (error) {
      console.log(error.toString());
    }
  };

  return (
    <Card
      shadow="sm"
      p="sm"
      radius="md"
      withBorder
      component={Link}
      href={`/plant/${plant?._id.toString()}`}
    >
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
          {getDaysUntilNextWater >= 0 ? (
            <Text size="sm" color="dimmed">
              Water in {getDaysUntilNextWater} days
            </Text>
          ) : (
            <Text size="sm" color="red">
              Needs water since {Math.abs(getDaysUntilNextWater)} days
            </Text>
          )}
        </Stack>
        <Tooltip label="Water now">
          <ActionIcon
            variant="outline"
            color="blue"
            size="lg"
            radius="xl"
            onClick={(e) => {
              updatePlantHandler({ ...plant, lastWatered: new Date() });
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <i className="ri-contrast-drop-2-line ri-lg" />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Card>
  );
}
