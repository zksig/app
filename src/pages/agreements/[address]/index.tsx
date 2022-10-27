import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AgreementDetails from "../../../components/agreements/AgreementDetails";
import {
  AgreementWithSignatures,
  getAgreement,
} from "../../../services/solana";
import { PublicKey } from "@solana/web3.js";

const AgreementDetailsPage: NextPage = () => {
  const router = useRouter();
  const [agreement, setAgreement] = useState<AgreementWithSignatures>();

  useEffect(() => {
    (async () => {
      setAgreement(
        await getAgreement(new PublicKey(router.query.address as string))
      );
    })();
  }, [router]);

  return (
    <>
      {agreement ? <AgreementDetails agreement={agreement} /> : null}
    </>
  );
};

export default AgreementDetailsPage;
