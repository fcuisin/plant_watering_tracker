import { Plant } from "../../models/plants";

export const PlantsMutations = {
  Mutation: {
    addPlant: async (_, { newPlant }) => {
      try {
        return Plant.create(newPlant);
      } catch (error) {
        throw error;
      }
    },
    waterPlant: async (_, { plantId }) => {
      try {
        return await Plant.findOneAndUpdate(
          { _id: plantId },
          { lastWatered: new Date() }
        );
      } catch (error) {
        throw error;
      }
    },
    removePlant: async (_, { plantId }) => {
      try {
        return await Plant.deleteOne({ _id: plantId });
      } catch (error) {
        throw error;
      }
    },
  },
};
