import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PublicKey } from "@solana/web3.js";
import SignatureDetails from "../../components/signatures/SignatureDetails";
import {
  AgreementWithSignatures,
  getAgreement,
  getSignature,
  SignaturePacket,
} from "../../services/solana";

const AgreementDetailsPage: NextPage = () => {
  const router = useRouter();
  const [agreement, setAgreement] = useState<AgreementWithSignatures>();
  const [signature, setSignature] = useState<SignaturePacket>();

  useEffect(() => {
    (async () => {
      const signature = await getSignature(
        new PublicKey(router.query.address as string)
      );
      const agreement = await getAgreement(signature.agreement);

      setSignature(signature);
      setAgreement(agreement);
    })();
  }, [router]);

  if (!agreement || !signature) return null;

  return <SignatureDetails agreement={agreement} signature={signature} />;
};

export default AgreementDetailsPage;
