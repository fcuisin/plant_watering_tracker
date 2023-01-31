import {
  ActionIcon,
  Button,
  Drawer,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
import { IPlant } from "../models/plants";

export default function AddPlantModal() {
  const [newPlant, setNewPlant] = useState<IPlant>();
  const [openedModal, setOpenedModal] = useState<boolean>();

  const matches = useMediaQuery("(min-width: 640px)");

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
      setOpenedModal(false);
    } catch (error) {
      console.log(error.toString());
    }
  };

  const handleUpdate = (field: string, value: string | number | number[]) => {
    setNewPlant((prevState) => {
      return {
        ...prevState,
        [field]: value,
      };
    });
  };

  return (
    <>
      {matches ? (
        <Button
          color="green.0"
          size="md"
          radius="xs"
          onClick={() => setOpenedModal(true)}
          sx={(theme) => ({
            color: theme.black,
            border: `1px solid ${theme.colors.green[1]}`,
            transition: "border-radius .15s",
            "&:hover": {
              backgroundColor: theme.colors.green[0],
              borderRadius: theme.radius.lg,
              transition: "border-radius .15s",
            },
          })}
        >
          Add a plant
        </Button>
      ) : (
        <ActionIcon
          color="green.1"
          variant="filled"
          onClick={() => setOpenedModal(true)}
        >
          <i className="ri-add-line ri-lg"></i>
        </ActionIcon>
      )}
      <Drawer
        opened={openedModal}
        onClose={() => setOpenedModal(false)}
        title="Add a new plant"
        padding="xl"
        size="xl"
      >
        <Stack spacing="md">
          <TextInput
            required
            label="Name"
            value={newPlant?.name ?? ""}
            onChange={(event) =>
              handleUpdate("name", event.currentTarget.value)
            }
          />
          <NumberInput
            required
            label="Frequency (per week)"
            value={newPlant?.waterFrequency ?? 1}
            onChange={(value) => handleUpdate("waterFrequency", value)}
          />
          <NumberInput
            label="Water quantity (ml)"
            value={newPlant?.waterQuantity ?? 0}
            onChange={(value) => handleUpdate("waterQuantity", value)}
          />
          <Select
            label="Location"
            value={newPlant?.location ?? ""}
            data={[
              { value: "kitchen", label: "Kitchen" },
              { value: "living-room", label: "Living-room" },
              { value: "dining-room", label: "Dining-room" },
              { value: "bathroom", label: "Bathroom" },
              { value: "bedroom", label: "Bedroom" },
            ]}
            onChange={(value) => handleUpdate("location", value)}
          />
          <Button
            mt="md"
            color="green.1"
            onClick={() => addPlantHandler(newPlant)}
            style={{ width: 200 }}
          >
            Create
          </Button>
        </Stack>
      </Drawer>
    </>
  );
}
