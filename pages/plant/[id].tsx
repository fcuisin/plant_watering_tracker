import { useMutation, gql } from "@apollo/client";
import {
  ActionIcon,
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
import { IPlant } from "../../models/plants";
import { ReactNode } from "react";
import { HEADER_HEIGHT } from "../../components/utils/constants";
import { useRouter } from "next/router";
import { WATER_PLANT } from "../../components/PlantCard";
import { GET_PLANTS } from "..";
import { initializeApollo } from "../../lib/apollo";

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

const REMOVE_PLANT = gql`
  mutation Mutation($plantId: ID) {
    removePlant(plantId: $plantId) {
      _id
      name
    }
  }
`;

const PLANT_BY_ID = gql`
  query ($plantId: ID) {
    plant(plantId: $plantId) {
      _id
      name
      waterFrequency
      lastWatered
      waterQuantity
      location
      icon
    }
  }
`;

export default function Plant(plant: IPlant) {
  const { classes } = useStyles();
  const router = useRouter();

  const { name, icon, description, location } = plant;

  const [waterPlant] = useMutation(WATER_PLANT);
  const [removePlant] = useMutation(REMOVE_PLANT, {
    refetchQueries: [{ query: GET_PLANTS }],
  });

  const plantUpdateHandler = async (plantId) => {
    try {
      await waterPlant({ variables: { plantId } });
      router.replace(router.asPath);
    } catch (error) {
      console.log(error.toString());
    }
  };

  const deletePlantHandler = async (plantId) => {
    try {
      await removePlant({ variables: { plantId } });
      router.push("/");
    } catch (error) {
      console.log(error.toString());
    }
  };

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
                onClick={() => plantUpdateHandler(plant?._id)}
              >
                Water
              </Button>
            </Stack>
          </Col>
          <Col span={12} md={7}>
            <Stack spacing="lg" mt="lg">
              <Title order={3} weight={600} color="gray">
                <Group position="apart">
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
                  <ActionIcon onClick={() => deletePlantHandler(plant?._id)}>
                    <i className="ri-delete-bin-line ri-lg"></i>
                  </ActionIcon>
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
  const apolloClient = initializeApollo();
  const { data } = await apolloClient.query({
    query: PLANT_BY_ID,
    variables: { plantId: params.id },
  });

  return {
    props: data.plant,
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const apolloClient = initializeApollo();
  const { data } = await apolloClient.query({ query: GET_PLANTS });

  return {
    paths:
      data?.plants?.map(({ _id }) => {
        return {
          params: {
            id: _id.toString(),
          },
        };
      }) || [],
    fallback: false,
  };
};
