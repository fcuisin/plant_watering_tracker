import { Container, Title, Group, Header, SimpleGrid } from "@mantine/core";
import Image from "next/image";
import { useState } from "react";
import AddPlantModal from "../components/AddPlantModal";

import Logo from "../public/main-logo.svg";
import PlantCard from "../components/PlantCard";
import { HEADER_HEIGHT } from "../components/utils/constants";
import { IPlant } from "../models/plants";

export default function Home({ plants }: { plants?: IPlant[] }) {
  const [plantsList, setPlantsList] = useState<IPlant[]>(plants);

  const handleUpdatePlantsList = (value: IPlant[]) => setPlantsList(value);

  return (
    <Container fluid>
      <Header height={HEADER_HEIGHT}>
        <Group
          spacing={0}
          position="apart"
          style={{ height: HEADER_HEIGHT }}
          noWrap
        >
          <Group>
            <Image src={Logo} height="30" width="100" alt="main-logo" />
            <Title order={2}>My Garden</Title>
          </Group>
          <AddPlantModal onAddPlant={handleUpdatePlantsList} />
        </Group>
      </Header>
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
    </Container>
  );
}

export async function getServerSideProps() {
  const res = await fetch("http://localhost:3000/api/plants", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  const plants = await res.json();

  return { props: { plants } };
}
