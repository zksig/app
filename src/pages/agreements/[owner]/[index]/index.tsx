import type { NextPage } from "next";
import { useRouter } from "next/router";
import AgreementDetails from "../../../../components/agreements/AgreementDetails";
import { useAgreement } from "../../../../services/digitalSignatures";

const AgreementDetailsPage: NextPage = () => {
  const router = useRouter();
  const { agreement, isLoading } = useAgreement({
    index: Number(router.query.index),
  });

  console.log(agreement, isLoading);

  return <>{agreement ? <AgreementDetails agreement={agreement!} /> : null}</>;
};

export default AgreementDetailsPage;
