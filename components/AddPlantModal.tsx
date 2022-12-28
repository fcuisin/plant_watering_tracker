import { Button, Modal, NumberInput, Stack, TextInput } from "@mantine/core";
import { useState } from "react";
import { IPlant } from "../models/plants";

export default function AddPlantModal() {
  const [newPlant, setNewPlant] = useState<IPlant>();
  const [openedModal, setOpenedModal] = useState<boolean>();

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

  const handleUpdate = (field: string, value: string | number) => {
    setNewPlant((prevState) => {
      return {
        ...prevState,
        [field]: value,
      };
    });
  };

  return (
    <>
      <Button
        radius="md"
        color="dark"
        size="md"
        onClick={() => setOpenedModal(true)}
      >
        Add a plant
      </Button>
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
