import type { NextPage } from "next";
import { useRouter } from "next/router";
import SignatureDetails from "../../components/signatures/SignatureDetails";
import { useAgreement, useSignature } from "../../services/digitalSignatures";

const AgreementDetailsPage: NextPage = () => {
  const router = useRouter();
  const { signature } = useSignature({ index: Number(router.query.index) });
  const { agreement } = useAgreement({
    address: signature?.agreementOwner,
    index: signature?.agreementIndex.toNumber() || 0,
  });

  if (!agreement || !signature) return null;

  return <SignatureDetails agreement={agreement} signature={signature} />;
};

export default AgreementDetailsPage;
