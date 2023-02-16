import {
  Badge,
  Box,
  Button,
  Col,
  Container,
  createStyles,
  Grid,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { GetStaticPaths, GetStaticProps } from "next";
import PlantModalEdition from "../../components/PlantModalEdition";
import Layout from "../../components/Layout";
import PlantIcon from "../../components/PlantIcon";
import { fetchAPI } from "../../lib/fetchApi";
import { IPlant } from "../../models/plants";
import { ReactNode, useContext } from "react";
import { HEADER_HEIGHT } from "../../components/utils/constants";
import { updatePlant } from "../../components/utils/updatePlant";
import { PlantsContext } from "../../components/contexts/PlantsContext";
import { useRouter } from "next/router";

interface PlantDetails {
  prop: keyof IPlant;
  icon: ReactNode;
  title: string;
}

const details: PlantDetails[] = [
  {
    prop: "waterQuantity",
    icon: <i className="ri-contrast-drop-line ri-xl"></i>,
    title: "Water Quantity",
  },
  {
    prop: "waterFrequency",
    icon: <i className="ri-restart-line ri-xl"></i>,
    title: "Water Frequency",
  },
  {
    prop: "lastWatered",
    icon: <i className="ri-24-hours-line ri-xl"></i>,
    title: "Last Watering",
  },
];

const useStyles = createStyles((theme) => ({
  feature: {
    position: "relative",
    paddingTop: theme.spacing.xl,
    paddingLeft: theme.spacing.xl,
  },

  overlay: {
    position: "absolute",
    height: 85,
    width: 140,
    top: 0,
    left: 0,
    backgroundColor: "#E1F1F2",
    zIndex: 1,
  },

  content: {
    position: "relative",
    zIndex: 2,
  },
}));

export default function Plant(plant: IPlant) {
  const { classes } = useStyles();
  const router = useRouter();
  const { setPlantsList } = useContext(PlantsContext);

  const { name, icon, description, location } = plant;

  const getTimeBetweenDates = (prop: Date): number => {
    return Math.floor(
      (new Date().getTime() - new Date(prop).getTime()) / (1000 * 3600 * 24)
    );
  };

  const updatePlantHandler = async (plantData: IPlant) => {
    const updatedPlants = await updatePlant(plantData);
    setPlantsList(updatedPlants);
    router.replace(router.asPath);
  };

  const items = details.map((feature) => (
    <div key={feature.prop} className={classes.feature}>
      <div className={classes.overlay} />

      <div className={classes.content}>
        {feature.icon}
        <Text weight={300} size="xl" mt={5} color="gray">
          {feature.title}
        </Text>
        <Text color="dark" size="md" weight={300}>
          {feature.prop === "waterFrequency" &&
            `Every ${plant[feature.prop]} day(s)`}
          {feature.prop === "lastWatered" &&
            `${getTimeBetweenDates(plant[feature.prop])} day(s) ago`}
          {feature.prop === "waterQuantity" && `${plant[feature.prop]} ml`}
        </Text>
      </div>
    </div>
  ));

  return (
    <Layout
      callToAction={<PlantModalEdition buttonText="Edit" plant={plant} />}
      title={<Title order={2}>{name}</Title>}
    >
      <Container fluid>
        <Grid style={{ minHeight: `calc(100vh - ${HEADER_HEIGHT}px)` }}>
          <Col
            span={12}
            md={5}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Stack align="center">
              <Box
                style={{
                  padding: 70,
                  borderRadius: "16% 84% 28% 72% / 55% 30% 70% 45%",
                  backgroundColor: "#FFEBD8",
                }}
              >
                <PlantIcon icon={icon} size={300} />
              </Box>
              <Button
                size="lg"
                mt="xl"
                color="green.0"
                sx={(theme) => ({
                  color: theme.white,
                  transition: "border-radius .15s",
                  "&:hover": {
                    borderRadius: theme.radius.lg,
                    transition: "border-radius .15s",
                  },
                })}
                rightIcon={<i className="ri-contrast-drop-2-line ri-lg" />}
                onClick={() =>
                  updatePlantHandler({ ...plant, lastWatered: new Date() })
                }
              >
                Water
              </Button>
            </Stack>
          </Col>
          <Col span={12} md={7}>
            <Stack spacing="lg" mt="lg">
              <Title order={3} weight={600} color="gray">
                <Group>
                  PLANT INFO
                  <Badge
                    size="lg"
                    variant="outline"
                    color="dark"
                    radius="sm"
                    style={{ fontWeight: 500 }}
                  >
                    {location}
                  </Badge>
                </Group>
              </Title>
              <Text color="gray">{description}</Text>
              <SimpleGrid
                cols={3}
                spacing={30}
                breakpoints={[{ maxWidth: "md", cols: 1 }]}
              >
                {items}
              </SimpleGrid>
              <Text weight={400} mt="lg" color="gray">
                (Coming soon) - Watering history
              </Text>
            </Stack>
          </Col>
        </Grid>
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
