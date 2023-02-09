import { Card, Container, Group, Paper, Stack, Text } from "@mantine/core";
import { GetStaticPaths, GetStaticProps } from "next";
import { ReactNode } from "react";
import AddPlantModal from "../../components/AddPlantModal";
import Layout from "../../components/Layout";
import PlantIcon from "../../components/PlantIcon";
import { fetchAPI } from "../../lib/fetchApi";
import { IPlant } from "../../models/plants";

const plantDetails: {
  [field: string]: { title: string; icon: ReactNode; unit: string };
} = {
  waterFrequency: {
    title: "Frequency",
    icon: <i className="ri-calendar-line ri-xl" />,
    unit: "",
  },
  waterQuantity: {
    title: "Water",
    icon: <i className="ri-contrast-drop-2-line ri-xl" />,
    unit: "ml",
  },
  location: {
    title: "Location",
    icon: <i className="ri-map-pin-5-line ri-xl" />,
    unit: "",
  },
};

export default function Plant(props: IPlant) {
  const { name, icon, waterQuantity, waterFrequency, location } = props;

  const renderPropCard = ({ title, icon, unit }, prop: string | number) => (
    <Paper
      p="sm"
      withBorder
      shadow="md"
      sx={(theme) => ({ backgroundColor: theme.colors.gray[3], minWidth: 150 })}
    >
      <Group>
        <Text size="sm">{icon}</Text>
        <Stack spacing={0}>
          <Text size="sm" weight={600}>
            {title}
          </Text>
          <Text size="sm" color="dimmed">
            {prop} {unit}
          </Text>
        </Stack>
      </Group>
    </Paper>
  );

  return (
    <Layout cta={<AddPlantModal />}>
      <Container fluid p="lg">
        <Group>
          <PlantIcon icon={icon} size={200} />
          <Stack>
            {renderPropCard(plantDetails.waterQuantity, waterQuantity)}
            {renderPropCard(plantDetails.waterFrequency, waterFrequency)}
            {renderPropCard(plantDetails.location, location)}
          </Stack>
        </Group>
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const data = await fetchAPI("http://localhost:3000/api/plants", {
    method: "GET",
  });

  const plantData = data.find(
    (plant: IPlant) => params.id === plant._id.toString()
  );

  return {
    props: plantData,
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allPlants = await fetchAPI("http://localhost:3000/api/plants", {
    method: "GET",
  });

  return {
    paths:
      allPlants.map(({ _id }) => {
        return {
          params: {
            id: _id.toString(),
          },
        };
      }) || [],
    fallback: false,
  };
};
