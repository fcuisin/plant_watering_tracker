import { Plant } from "../../models/plants";

export const PlantQueries = {
  Query: {
    plants: async () => {
      try {
        const plants = await Plant.find({});
        return plants;
      } catch (error) {
        throw error;
      }
    },
    plant: async (_, { plantId }) => {
      try {
        return await Plant.findById({ _id: plantId });
      } catch (error) {
        throw error;
      }
    },
  },
};
