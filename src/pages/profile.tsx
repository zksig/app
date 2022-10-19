import type { GetServerSideProps, NextPage } from "next";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { PrismaClient, UserProfile } from "@prisma/client";
import SidebarLayout from "../components/layouts/SidebarLayout";

const Profile: NextPage<{ me: UserProfile }> = ({ me }) => {
  return (
    <SidebarLayout>
      <h1>{me.email}</h1>
    </SidebarLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res);
  const client = new PrismaClient();

  if (!session) {
    return {
      props: {},
    };
  }

  return {
    props: {
      me: await client.userProfile.findUnique({
        select: { email: true, eth_address: true, sol_address: true },
        where: { email: session?.user.email },
      }),
    },
  };
};

export default withPageAuthRequired(Profile);
