import { gql } from "@apollo/client";

export const PlantsDefs = gql`
  scalar Date

  type Plant {
    _id: ID
    name: String
    description: String
    waterFrequency: Int
    lastWatered: Date
    waterQuantity: Int
    location: String
    icon: String
  }

  type Query {
    plants: [Plant]
    plant(plantId: ID): Plant
  }

  input PlantInput {
    _id: ID
    name: String
    description: String
    waterFrequency: Int
    lastWatered: Date
    waterQuantity: Int
    location: String
    icon: String
  }

  type Mutation {
    addPlant(newPlant: PlantInput): Plant
    waterPlant(plantId: ID): Plant
    removePlant(plantId: ID): Plant
  }
`;
