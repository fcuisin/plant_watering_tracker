import { useMutation, gql } from "@apollo/client";
import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Group,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import Link from "next/link";

import { IPlant } from "../models/plants";
import { GET_PLANTS } from "../pages";
import PlantIcon from "./PlantIcon";

export const WATER_PLANT = gql`
  mutation Mutation($plantId: ID) {
    waterPlant(plantId: $plantId) {
      _id
      name
    }
  }
`;

export default function PlantCard({ plant }: { plant: IPlant }) {
  const getDaysUntilNextWater = (({ waterFrequency, lastWatered }) => {
    const msSinceLastWater =
      new Date().getTime() - new Date(lastWatered).getTime();
    const daysSinceLastWater = msSinceLastWater / (1000 * 60 * 60 * 24);

    return Math.ceil(waterFrequency - daysSinceLastWater);
  })(plant);

  const [waterPlant] = useMutation(WATER_PLANT, {
    refetchQueries: [{ query: GET_PLANTS }],
  });

  const plantUpdateHandler = async (plantId) => {
    try {
      await waterPlant({ variables: { plantId } });
    } catch (error) {
      console.log(error.toString());
    }
  };

  const getCardColor = (defaultColor: string): string => {
    if (getDaysUntilNextWater < 0) return "red";
    if (getDaysUntilNextWater === 0) return "orange";
    return defaultColor;
  };

  const getRandomInt = (max: number): number => {
    return Math.floor(Math.random() * max);
  };

  const generateRandomBackground = () => {
    const points = Array.from({ length: 8 }, () => getRandomInt(80));
    return (
      points
        .map((point) => `${point}%`)
        .slice(4)
        .join(" ") +
      " / " +
      points
        .map((point) => `${point}%`)
        .slice(4, 8)
        .join(" ")
    );
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
        <Box
          style={{
            padding: 20,
            borderRadius: generateRandomBackground(),
            backgroundColor: "#E1F1F2",
          }}
        >
          <PlantIcon icon={plant?.icon} />
        </Box>
      </Card.Section>

      <Text weight={600} lineClamp={1}>
        {plant?.name}
      </Text>
      <Group position="apart" noWrap>
        <Stack spacing={5}>
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
        </Stack>
        <Tooltip label="Water now">
          <ActionIcon
            variant="outline"
            color={getCardColor("blue")}
            size="lg"
            radius="xl"
            onClick={(e) => {
              plantUpdateHandler(plant?._id);
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <i className="ri-contrast-drop-2-line ri-lg" />
          </ActionIcon>
        </Tooltip>
      </Group>
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
    </Card>
  );
}
