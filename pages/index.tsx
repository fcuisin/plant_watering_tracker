import { useQuery, gql } from "@apollo/client";
import { SimpleGrid, Text, Title } from "@mantine/core";

import PlantCard from "../components/PlantCard";
import Layout from "../components/Layout";
import PlantModalEdition from "../components/PlantModalEdition";
import { initializeApollo } from "../lib/apollo";
import { IPlant } from "../models/plants";

export const GET_PLANTS = gql`
  query {
    plants {
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

export default function Home() {
  const { loading, error, data } = useQuery(GET_PLANTS);
  if (loading) return <></>;
  if (error) return <Text size="sm">Unable to retrieve plants</Text>;
  return (
    <Layout
      callToAction={<PlantModalEdition isAddMode />}
      title={<Title order={2}>My Garden</Title>}
    >
      <SimpleGrid
        cols={5}
        mt="lg"
        breakpoints={[
          { maxWidth: 980, cols: 4, spacing: "md" },
          { maxWidth: 755, cols: 2, spacing: "sm" },
          { maxWidth: 300, cols: 1, spacing: "sm" },
        ]}
      >
        {data?.plants?.map((plant: IPlant) => (
          <PlantCard key={plant._id.toString()} plant={plant} />
        ))}
      </SimpleGrid>
    </Layout>
  );
}

export async function getStaticProps() {
  const apolloClient = initializeApollo();
  const { data } = await apolloClient.query({ query: GET_PLANTS });
  return { props: { initialData: data.plants } };
}
