import { ApolloServer, gql } from "apollo-server-micro";
import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";
import { GraphQLScalarType, Kind } from "graphql";
import { makeExecutableSchema } from "graphql-tools";
import dbConnect from "../../lib/mongodb";
import { Plant } from "../../models/plants";

const PlantsDefs = gql`
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

const resolvers = {
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
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    serialize(value: Date) {
      return value.getTime();
    },
    parseValue(value: Date) {
      return new Date(value);
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        // Convert hard-coded AST string to integer and then to Date
        return new Date(parseInt(ast.value, 10));
      }
      // Invalid hard-coded value (not an integer)
      return null;
    },
  }),
};

export const schema = makeExecutableSchema({
  typeDefs: PlantsDefs,
  resolvers,
});

const apolloServer = new ApolloServer({ schema });

const cors = Cors({
  methods: ["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  origin: ["https://studio.apollographql.com", "http://localhost:3000"],
});

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

const startServer = apolloServer.start();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);
  await dbConnect();
  await startServer;
  await apolloServer.createHandler({ path: "/api/graphql" })(req, res);
}
