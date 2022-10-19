import { DefaultContext, GraphQLYogaError } from "@graphql-yoga/node";
import { PrismaClient, UserProfile } from "@prisma/client";

const prisma = new PrismaClient();

type Context = DefaultContext & { user: UserProfile };

const Query = {
  agreements: (_: null, { page = 1 }, context: Context) => {
    return prisma.agreement.findMany({
      take: 20,
      skip: (page - 1) * 20,
      where: {
        requesterId: context.user.id,
      },
    });
  },
  agreement: async (_: null, { id }: { id: string }, context: Context) => {
    const agreement = await prisma.agreement.findUnique({
      where: { id },
    });

    if (!agreement || agreement.requesterId !== context.user.id) {
      throw new GraphQLYogaError(
        `Agreement Not Found for id ${id} and user ${context.user.id}`
      );
    }

    return agreement;
  },

  me: (_: null, __: null, context: Context) => {
    return context.user;
  },
};

const Mutation = {};

const UserProfile = {
  agreements: async (parent: UserProfile, __: null, context: Context) => {
    return prisma.agreement.findMany({
      where: { requesterId: parent.id },
      take: 20,
    });
  },
};

export const resolvers = {
  Query,
  Mutation,

  UserProfile,
};
