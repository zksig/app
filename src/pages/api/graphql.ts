/* eslint-disable react-hooks/rules-of-hooks */
import {
  createServer,
  useExtendContext,
  GraphQLYogaError,
} from "@graphql-yoga/node";
import { typeDefs } from "../../graphql/schema";
import { resolvers } from "../../graphql/resolvers";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@auth0/nextjs-auth0";

const prisma = new PrismaClient();

const server = createServer({
  graphiql: process.env.NODE_ENV === "development",
  schema: {
    typeDefs,
    resolvers,
  },
  endpoint: "/api/graphql",
  plugins: [
    useExtendContext(async (context) => {
      const session = await getSession(context.req, context.res);
      if (!session) {
        throw new GraphQLYogaError("Unauthorized: Missing session");
      }

      let user = await prisma.userProfile.findUnique({
        where: { email: session.user.email },
      });

      if (!user) {
        user = await prisma.userProfile.create({
          data: {
            email: session.user.email,
          },
        });
      }

      return { user };
    }),
  ],
});

export default server;
