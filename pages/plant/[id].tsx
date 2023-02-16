import {
  Button,
  Col,
  Container,
  createStyles,
  Grid,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { GetStaticPaths, GetStaticProps } from "next";
import PlantModalEdition from "../../components/PlantModalEdition";
import Layout from "../../components/Layout";
import PlantIcon from "../../components/PlantIcon";
import { fetchAPI } from "../../lib/fetchApi";
import { IPlant } from "../../models/plants";
import { ReactNode } from "react";
import { HEADER_HEIGHT } from "../../components/utils/constants";

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
    title: "Last Watering Date",
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
    width: 150,
    top: 0,
    left: 0,
    backgroundColor: "#FEE1C3",
    zIndex: 1,
  },

  content: {
    position: "relative",
    zIndex: 2,
  },
}));

export default function Plant(plant: IPlant) {
  console.log(plant.name);
  const { classes } = useStyles();

  const { name, icon, description } = plant;

  const getTimeBetweenDates = (prop: Date): number => {
    return Math.floor(
      (new Date().getTime() - new Date(prop).getTime()) / (1000 * 3600 * 24)
    );
  };

  const items = details.map((feature) => (
    <div key={feature.prop} className={classes.feature}>
      <div className={classes.overlay} />

      <div className={classes.content}>
        {feature.icon}
        <Text weight={300} size="xl" mt={5} color="gray">
          {feature.title}
        </Text>
        <Text color="dark" size="md">
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
              <PlantIcon icon={icon} size={300} />
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
              >
                Water
              </Button>
            </Stack>
          </Col>
          <Col span={12} md={7}>
            <Stack spacing="lg" mt="lg">
              <Title order={3} weight={600} color="gray">
                PLANT INFO
              </Title>
              <Text color="dimmed">{description}</Text>
              <SimpleGrid
                cols={3}
                spacing={30}
                breakpoints={[{ maxWidth: "md", cols: 1 }]}
              >
                {items}
              </SimpleGrid>
              <Title order={3} weight={600} mt="lg" color="gray">
                WATERING HISTORY
              </Title>
              <Text color="dimmed">Coming soon!</Text>
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
