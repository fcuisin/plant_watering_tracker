import { Container, Group, Header, Title } from "@mantine/core";
import Image from "next/image";
import { ReactNode } from "react";
import Logo from "../public/main-logo.svg";
import AddPlantModal from "./PlantModalEdition";
import { HEADER_HEIGHT } from "./utils/constants";

export default function Layout({
  children,
  title,
  callToAction,
}: {
  children: ReactNode;
  title: ReactNode;
  callToAction: ReactNode;
}) {
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
            {title}
          </Group>
          {callToAction}
        </Group>
      </Header>
      {children}
    </Container>
  );
}
