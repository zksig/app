import type { GetServerSideProps, NextPage } from "next";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Agreement, prisma, PrismaClient } from "@prisma/client";
import SidebarLayout from "../../components/layouts/SidebarLayout";
import AgreementList from "../../components/agreements/AgreementList";
import Link from "next/link";
import Button from "../../components/common/Button";

const AgreementsPage: NextPage<{
  agreements: Agreement[];
}> = ({ agreements }) => {
  console.log(agreements);
  return (
    <SidebarLayout>
      <h2 className="mb-2 text-2xl">Agreements</h2>
      <Link href="/agreements/create">
        <div className="flex justify-end">
          <Button
            className="bg-fuchsia-500 hover:bg-fuchsia-400"
            text="Create Agreement"
            iconName="add"
          />
        </div>
      </Link>
      <AgreementList agreements={agreements} />
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
      agreements: (
        await client.agreement.findMany({
          select: {
            id: true,
            network: true,
            cid: true,
            description_cid: true,
            description: true,
            createdAt: true,
          },
          where: { originatorId: session.user.id },
        })
      ).map((agreement) => ({
        ...agreement,
        createdAt: agreement.createdAt.toISOString(),
      })),
    },
  };
};

export default withPageAuthRequired(AgreementsPage);
