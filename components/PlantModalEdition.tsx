import { useMutation, gql } from "@apollo/client";
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
import { IPlant } from "../models/plants";
import { GET_PLANTS } from "../pages";
import PlantIcon, { listOfIcons } from "./PlantIcon";

const ADD_PLANT = gql`
  mutation Mutation($newPlant: PlantInput) {
    addPlant(newPlant: $newPlant) {
      _id
      name
    }
  }
`;

export default function PlantModalEdition({
  plant,
  buttonText = "Add a plant",
  isAddMode = false,
}: {
  plant?: IPlant;
  buttonText?: string;
  isAddMode?: boolean;
}) {
  const matches = useMediaQuery("(max-width: 640px)");

  const [plantDetail, setPlantDetail] = useState<IPlant>(plant);
  const [openedModal, setOpenedModal] = useState<boolean>();

  const [addPlant] = useMutation(ADD_PLANT, {
    refetchQueries: [{ query: GET_PLANTS }],
  });

  const handler = async (plantData: IPlant) => {
    try {
      if (isAddMode) {
        await addPlant({ variables: { newPlant: plantData } });
        setPlantDetail(null);
      }
      setOpenedModal(false);
    } catch (error) {
      console.log(error.toString());
    }
  };

  const handleUpdatePlantDetails = (
    field: string,
    value: string | number | number[]
  ) => {
    setPlantDetail((prevState) => {
      return {
        ...prevState,
        [field]: value,
      };
    });
  };

  const canSaveNewPlant = (newPlant: IPlant): boolean => {
    const { name, waterFrequency, icon, location } = newPlant ?? {};
    return !!(name && waterFrequency && icon && location);
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
            color: theme.white,
            transition: "border-radius .15s",
            "&:hover": {
              borderRadius: theme.radius.lg,
              transition: "border-radius .15s",
            },
          })}
        >
          {buttonText}
        </Button>
      ) : (
        <ActionIcon
          color="green.0"
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
          isAddMode && setPlantDetail(null);
        }}
        title={isAddMode ? "Add a new plant" : `Edit ${plantDetail?.name}`}
        padding="xl"
        size="xl"
      >
        <ScrollArea style={{ height: "80vh" }} offsetScrollbars>
          <Stack spacing="md">
            <TextInput
              required
              label="Name"
              value={plantDetail?.name ?? ""}
              onChange={(event) =>
                handleUpdatePlantDetails("name", event.currentTarget.value)
              }
            />
            <TextInput
              label="Description"
              value={plantDetail?.description ?? ""}
              onChange={(event) =>
                handleUpdatePlantDetails(
                  "description",
                  event.currentTarget.value
                )
              }
            />
            <Input.Wrapper label="Watering frequency" required>
              <Group mt="xs">
                <Text size="sm">Every</Text>
                <NumberInput
                  w={100}
                  value={plantDetail?.waterFrequency ?? 0}
                  onChange={(value) =>
                    handleUpdatePlantDetails("waterFrequency", value)
                  }
                />
                <Text size="sm">days</Text>
              </Group>
            </Input.Wrapper>
            <NumberInput
              label="Water quantity (ml)"
              value={plantDetail?.waterQuantity ?? 0}
              onChange={(value) =>
                handleUpdatePlantDetails("waterQuantity", value)
              }
            />
            <Select
              required
              label="Location"
              value={plantDetail?.location ?? ""}
              data={[
                { value: "kitchen", label: "Kitchen" },
                { value: "living-room", label: "Living-room" },
                { value: "dining-room", label: "Dining-room" },
                { value: "bathroom", label: "Bathroom" },
                { value: "bedroom", label: "Bedroom" },
              ]}
              onChange={(value) => handleUpdatePlantDetails("location", value)}
            />
            <Input.Wrapper required label="Choose a picture">
              <Card withBorder radius="md">
                <SimpleGrid cols={3} mt="md">
                  {Object.keys(listOfIcons).map((icon, index) => (
                    <UnstyledButton
                      key={index}
                      onClick={() => handleUpdatePlantDetails("icon", icon)}
                      sx={(theme) => ({
                        padding: 10,
                        boxShadow: theme.shadows.md,
                        borderRadius: theme.radius.sm,
                        border:
                          plantDetail?.icon === icon &&
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
          onClick={() => {
            isAddMode
              ? handler({ ...plantDetail, lastWatered: new Date() })
              : handler(plantDetail);
          }}
          disabled={!canSaveNewPlant(plantDetail)}
          style={{ width: 200 }}
        >
          Save
        </Button>
      </Drawer>
    </>
  );
}
