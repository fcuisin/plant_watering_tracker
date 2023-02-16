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
import { useContext } from "react";
import { fetchAPI } from "../lib/fetchApi";
import { IPlant } from "../models/plants";
import { PlantsContext } from "./contexts/PlantsContext";
import PlantIcon from "./PlantIcon";

export default function PlantCard({ plant }: { plant: IPlant }) {
  const { setPlantsList } = useContext(PlantsContext);

  const getDaysUntilNextWater = (({ waterFrequency, lastWatered }) => {
    const msSinceLastWater =
      new Date().getTime() - new Date(lastWatered).getTime();
    const daysSinceLastWater = msSinceLastWater / (1000 * 60 * 60 * 24);

    return Math.ceil(waterFrequency - daysSinceLastWater);
  })(plant);

  const updatePlantHandler = async (plantData: IPlant) => {
    try {
      const { updatedPlantsList } = await fetchAPI("/api/plants", {
        method: "PUT",
        body: JSON.stringify(plantData),
      });
      setPlantsList(updatedPlantsList);
    } catch (error) {
      console.log(error.toString());
    }
  };

  const getCardColor = (defaultColor: string): string => {
    if (getDaysUntilNextWater < 0) return "red";
    if (getDaysUntilNextWater === 0) return "orange";
    return defaultColor;
  };

  return (
    <Card
      shadow="sm"
      p="sm"
      radius="md"
      withBorder
      component={Link}
      href={`/plant/${plant?._id.toString()}`}
      sx={(theme) => ({
        borderColor: theme.colors[getCardColor("gray")][2],
      })}
    >
      <Card.Section
        style={{ display: "flex", justifyContent: "center", padding: 10 }}
      >
        <PlantIcon icon={plant?.icon} />
      </Card.Section>

      <Group position="apart" noWrap>
        <Stack spacing={0}>
          <Text weight={600} lineClamp={1}>
            {plant?.name}
          </Text>
          <Text mt={5} color="dimmed" size="sm" lineClamp={1}>
            <Group spacing="xs">
              <i className="ri-contrast-drop-2-line ri-md" />
              {plant?.waterQuantity} ml
            </Group>
          </Text>
          <Text mb={5} color="dimmed" size="sm" lineClamp={1}>
            <Group spacing="xs">
              <i className="ri-map-pin-line ri-md" />
              {!!plant?.location
                ? plant?.location?.at(0).toUpperCase() +
                  plant?.location?.slice(1)
                : "Somewhere"}
            </Group>
          </Text>

          <Badge
            size="sm"
            color={getCardColor("dimmed")}
            style={{ fontWeight: 600 }}
          >
            {getDaysUntilNextWater > 0
              ? `Water in ${getDaysUntilNextWater} day(s)`
              : getDaysUntilNextWater === 0
              ? "Water today"
              : `Needs water since ${Math.abs(getDaysUntilNextWater)} day(s)`}
          </Badge>
        </Stack>
        <Tooltip label="Water now">
          <ActionIcon
            variant="outline"
            color={getCardColor("blue")}
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
