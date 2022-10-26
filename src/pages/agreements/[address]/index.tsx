import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AgreementDetails from "../../../components/agreements/AgreementDetails";
import SidebarLayout from "../../../components/layouts/SidebarLayout";
import {
  AgreementWithSignatures,
  getAgreement,
} from "../../../services/solana";
import { PublicKey } from "@solana/web3.js";

const CreateAgreementPage: NextPage = () => {
  const router = useRouter();
  const [agreement, setAgreement] = useState<AgreementWithSignatures>();

  useEffect(() => {
    (async () => {
      setAgreement(
        await getAgreement(new PublicKey(router.query.address as string))
      );
    })();
  }, [router]);

  if (!agreement) return null;

  return (
    <SidebarLayout>
      <AgreementDetails agreement={agreement} />
    </SidebarLayout>
  );
};

export default CreateAgreementPage;
