import { fetchAPI } from "../../lib/fetchApi";
import { IPlant } from "../../models/plants";

/**
 * Update a plant
 *
 * @param plantData
 * @returns the updated plants list
 */

export const updatePlant = async (plantData: IPlant) => {
  try {
    const { updatedPlantsList } = await fetchAPI("/api/plants", {
      method: "PUT",
      body: JSON.stringify(plantData),
    });
    return updatedPlantsList;
  } catch (error) {
    console.log(error.toString());
  }
};
