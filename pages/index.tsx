import { Container, Title, Group, Header, Text } from "@mantine/core";
import Image from "next/image";
import AddPlantModal from "../components/AddPlantModal";

import Logo from "../components/images/main-logo.svg";
import { HEADER_HEIGHT } from "../components/utils/constants";
import { IPlant } from "../models/plants";

export default function Home({ plants }: { plants?: IPlant[] }) {
  console.log(plants);
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
          <AddPlantModal />
        </Group>
      </Header>
      {plants.map((plant) => (
        <Text key={plant._id.toString()}>{plant.name}</Text>
      ))}
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
