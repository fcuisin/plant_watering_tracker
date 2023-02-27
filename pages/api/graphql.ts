import { ApolloServer } from "apollo-server-micro";
import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";
import { GraphQLScalarType, Kind } from "graphql";
import { makeExecutableSchema } from "graphql-tools";
import dbConnect from "../../lib/mongodb";
import { PlantsDefs } from "./plantsDefs";
import { PlantsMutations } from "./mutations";
import { PlantQueries } from "./queries";

const resolvers = {
  ...PlantQueries,
  ...PlantsMutations,
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
        return new Date(parseInt(ast.value, 10));
      }
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
