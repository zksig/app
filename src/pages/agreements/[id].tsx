import type { GetServerSideProps, NextPage } from "next";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Agreement, prisma, PrismaClient } from "@prisma/client";
import SidebarLayout from "../../components/layouts/SidebarLayout";
import AgreementDetail from "../../components/agreements/Agreement";
import Link from "next/link";
import Button from "../../components/common/Button";
import { useWallet } from "@solana/wallet-adapter-react";

const AgreementPage: NextPage<{
  agreement: Agreement;
}> = ({ agreement }) => {
  return (
    <SidebarLayout>
      <h2 className="mb-2 text-2xl">Agreement {agreement?.id}</h2>
      <AgreementDetail agreement={agreement}></AgreementDetail>
    </SidebarLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res, params }) => {
  const session = await getSession(req, res);
  const client = new PrismaClient();

  console.log("params", params);

  if (!session) {
    return {
      props: {},
    };
  }
  if(!params?.id) {
    return {
      props: {}
    };
  }

  const agreement = await client.agreement.findFirst({
    where: { id: params.id as string },
    select: {
      id: true,
      network: true,
      cid: true,
      description_cid: true,
      description: true,
      originatorId: true
    }
  });
  if(!agreement) {
    return {props: {} };
  }

  if(session.user.id !== agreement?.originatorId) {
    // TODO redirect and throw error
    return {props: {} };
  }

  return {
    props: {
      agreement
    },
  };
};

export default withPageAuthRequired(AgreementPage);
