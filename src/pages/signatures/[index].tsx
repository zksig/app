import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SignatureDetails from "../../components/signatures/SignatureDetails";
import {
  Agreement,
  SignaturePacket,
  getAgreement,
  getSignature,
} from "../../services/digitalSignatures";

const AgreementDetailsPage: NextPage = () => {
  const router = useRouter();
  const [agreement, setAgreement] = useState<Agreement>();
  const [signature, setSignature] = useState<SignaturePacket>();

  useEffect(() => {
    (async () => {
      const signature = await getSignature(Number(router.query.index));
      const agreement = await getAgreement(
        signature.agreementIndex.toNumber(),
        signature.agreementOwner
      );

      setSignature(signature);
      setAgreement(agreement);
    })();
  }, [router]);

  if (!agreement || !signature) return null;

  return <SignatureDetails agreement={agreement} signature={signature} />;
};

export default AgreementDetailsPage;
