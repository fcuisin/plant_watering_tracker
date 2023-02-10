import {
  ActionIcon,
  Button,
  Card,
  Drawer,
  Group,
  Input,
  NumberInput,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
import { fetchAPI } from "../lib/fetchApi";
import { IPlant } from "../models/plants";
import PlantIcon, { listOfIcons } from "./PlantIcon";

export default function AddPlantModal({
  onAddPlant,
}: {
  onAddPlant?: (value: IPlant[]) => void;
}) {
  const [newPlant, setNewPlant] = useState<IPlant>();
  const [openedModal, setOpenedModal] = useState<boolean>();

  const matches = useMediaQuery("(max-width: 640px)");

  const addPlantHandler = async (plantData: IPlant) => {
    try {
      const plants = await fetchAPI("/api/plants", {
        method: "POST",
        body: JSON.stringify(plantData),
      });
      if (onAddPlant) onAddPlant(plants);
      setOpenedModal(false);
      setNewPlant(null);
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
      {!matches ? (
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
        onClose={() => {
          setOpenedModal(false);
          setNewPlant(null);
        }}
        title="Add a new plant"
        padding="xl"
        size="xl"
      >
        <ScrollArea style={{ height: "80vh" }} offsetScrollbars>
          <Stack spacing="md">
            <TextInput
              required
              label="Name"
              value={newPlant?.name ?? ""}
              onChange={(event) =>
                handleUpdate("name", event.currentTarget.value)
              }
            />
            <Input.Wrapper label="Watering frequency" required>
              <Group mt="xs">
                <Text size="sm">Every</Text>
                <NumberInput
                  w={100}
                  value={newPlant?.waterFrequency ?? 0}
                  onChange={(value) => handleUpdate("waterFrequency", value)}
                />
                <Text size="sm">days</Text>
              </Group>
            </Input.Wrapper>
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
            <Input.Wrapper label="Choose a picture">
              <Card withBorder radius="md">
                <SimpleGrid cols={3} mt="md">
                  {Object.keys(listOfIcons).map((icon, index) => (
                    <UnstyledButton
                      key={index}
                      onClick={() => handleUpdate("icon", icon)}
                      sx={(theme) => ({
                        padding: 10,
                        boxShadow: theme.shadows.md,
                        borderRadius: theme.radius.sm,
                        border:
                          newPlant?.icon === icon &&
                          `1px solid ${theme.colors.gray[6]}`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        "&:hover": {
                          boxShadow: `${theme.shadows.md} !important`,
                          transform: "scale(1.05)",
                        },
                      })}
                    >
                      <PlantIcon key={index} icon={icon} size={90} />
                    </UnstyledButton>
                  ))}
                </SimpleGrid>
              </Card>
            </Input.Wrapper>
          </Stack>
        </ScrollArea>
        <Button
          mt="md"
          color="green.1"
          onClick={() =>
            addPlantHandler({ ...newPlant, lastWatered: new Date() })
          }
          style={{ width: 200 }}
        >
          Create
        </Button>
      </Drawer>
    </>
  );
}
