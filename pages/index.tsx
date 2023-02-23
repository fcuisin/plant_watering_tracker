import { useContext } from "react";

import { SimpleGrid, Title } from "@mantine/core";
import { gql } from "apollo-server-micro";
import { useQuery } from "@apollo/client";

import PlantCard from "../components/PlantCard";
import { PlantsContext } from "../components/contexts/PlantsContext";
import Layout from "../components/Layout";
import PlantModalEdition from "../components/PlantModalEdition";
import { initializeApollo } from "../lib/apollo";

const GET_PLANTS = gql`
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
  const { plantsList } = useContext(PlantsContext);

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
        {plantsList?.map((plant) => (
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
