import type { GetServerSideProps, NextPage } from "next";
import { getCookie } from "cookies-next";
import { Agreement, prisma, PrismaClient } from "@prisma/client";
import SidebarLayout from "../../components/layouts/SidebarLayout";
import AgreementList from "../../components/agreements/AgreementList";
import Link from "next/link";
import Button from "../../components/common/Button";
import { verifySession } from "../../utils/session";

const AgreementsPage: NextPage<{
  agreements: Agreement[];
}> = ({ agreements }) => {
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
  const { publicKey } = verifySession(req, res);
  const client = new PrismaClient();

  if (!publicKey) {
    return {
      props: {
        agreements: [],
      },
    };
  }

  return {
    props: {
      agreements: (
        await client.agreement.findMany({
          select: {
            id: true,
            network: true,
            identifier: true,
            cid: true,
            description_cid: true,
            description: true,
            createdAt: true,
          },
          where: { ownerAddress: publicKey },
        })
      ).map((agreement) => ({
        ...agreement,
        createdAt: agreement.createdAt.toISOString(),
      })),
    },
  };
};

export default AgreementsPage;
