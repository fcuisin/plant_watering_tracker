import { Container, Title, Group, Header, SimpleGrid } from "@mantine/core";
import Image from "next/image";
import { useState } from "react";
import AddPlantModal from "../components/AddPlantModal";

import Logo from "../public/main-logo.svg";
import PlantCard from "../components/PlantCard";
import { HEADER_HEIGHT } from "../components/utils/constants";
import { IPlant } from "../models/plants";
import { fetchAPI } from "../lib/fetchApi";
import Layout from "../components/Layout";

export default function Home({ plants }: { plants?: IPlant[] }) {
  const [plantsList, setPlantsList] = useState<IPlant[]>(plants);

  const handleUpdatePlantsList = (value: IPlant[]) => setPlantsList(value);

  return (
    <Layout cta={<AddPlantModal onAddPlant={handleUpdatePlantsList} />}>
      <SimpleGrid
        cols={5}
        mt="lg"
        breakpoints={[
          { maxWidth: 980, cols: 4, spacing: "md" },
          { maxWidth: 755, cols: 2, spacing: "sm" },
          { maxWidth: 300, cols: 1, spacing: "sm" },
        ]}
      >
        {plantsList.map((plant) => (
          <PlantCard key={plant._id.toString()} plant={plant} />
        ))}
      </SimpleGrid>
    </Layout>
  );
}

export async function getServerSideProps() {
  const plants = await fetchAPI("http://localhost:3000/api/plants", {
    method: "GET",
  });

  return { props: { plants } };
}
