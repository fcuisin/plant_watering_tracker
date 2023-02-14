import { SimpleGrid } from "@mantine/core";
import { useContext, useState } from "react";

import PlantCard from "../components/PlantCard";
import { IPlant } from "../models/plants";
import { fetchAPI } from "../lib/fetchApi";
import { PlantsContext } from "../components/contexts/PlantsContext";

export default function Home() {
  const { plantsList } = useContext(PlantsContext);

  return (
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
  );
}

export async function getServerSideProps() {
  const plants = await fetchAPI("http://localhost:3000/api/plants", {
    method: "GET",
  });

  return { props: { initialData: plants } };
}
