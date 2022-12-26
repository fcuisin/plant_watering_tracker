import { useState } from "react";

import {
  Container,
  Stack,
  Title,
  Button,
  createStyles,
  Modal,
  TextInput,
  NumberInput,
} from "@mantine/core";
import { IPlant } from "../models/plants";

const useStyles = createStyles((theme) => ({
  highlight: {
    position: "relative",
    backgroundColor: theme.fn.variant({
      variant: "light",
      color: theme.colors.green[0],
    }).background,
    borderRadius: theme.radius.sm,
    padding: "4px 12px",
  },
}));

export default function Home() {
  const { classes } = useStyles();
  const [openedModal, setOpenedModal] = useState<boolean>(false);
  const [newPlant, setNewPlant] = useState<IPlant>();

  const handleUpdate = (field: string, value: string | number) => {
    setNewPlant((prevState) => {
      return {
        ...prevState,
        [field]: value,
      };
    });
  };

  const addPlantHandler = async (plantData: IPlant) => {
    try {
      await fetch("/api/plants", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plantData),
      });
      console.log("Plant successfully created!");
    } catch (error) {
      console.log(error.toString());
    }
  };

  return (
    <>
      <Container p="lg">
        <Stack align="center">
          <Title weight="bold">
            <span className={classes.highlight}>Plant</span> Watering Tracker
          </Title>

          <Button
            radius="xl"
            mt={30}
            color="green.7"
            size="md"
            onClick={() => setOpenedModal(true)}
          >
            Add plant
          </Button>
        </Stack>
      </Container>
      <Modal
        opened={openedModal}
        onClose={() => setOpenedModal(false)}
        title="Add a new plant"
      >
        <Stack spacing="md">
          <TextInput
            label="Name"
            value={newPlant?.name ?? ""}
            onChange={(event) =>
              handleUpdate("name", event.currentTarget.value)
            }
          />
          <NumberInput
            label="Frequency"
            value={newPlant?.waterFrequency ?? 1}
            onChange={(value) => handleUpdate("waterFrequency", value)}
          />
          <Button onClick={() => addPlantHandler(newPlant)}>Create</Button>
        </Stack>
      </Modal>
    </>
  );
}
