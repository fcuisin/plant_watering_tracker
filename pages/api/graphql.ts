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
  }
`;

const resolvers = {
  Query: {
    plants: async () => {
      try {
        const plants = await Plant.find({});
        return plants;
      } catch (e) {
        console.error(e);
      }
    },
  },
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    serialize(value) {
      if (value instanceof Date) {
        return value.getTime(); // Convert outgoing Date to integer for JSON
      }
      throw Error("GraphQL Date Scalar serializer expected a `Date` object");
    },
    parseValue(value) {
      if (typeof value === "number") {
        return new Date(value); // Convert incoming integer to Date
      }
      throw new Error("GraphQL Date Scalar parser expected a `number`");
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
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  origin: ["http://localhost:3000"],
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
