import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AgreementDetails from "../../../components/agreements/AgreementDetails";
import { Agreement, getAgreement } from "../../../services/filecoin";

const AgreementDetailsPage: NextPage = () => {
  const router = useRouter();
  const [agreement, setAgreement] = useState<Agreement>();

  useEffect(() => {
    (async () => {
      setAgreement(await getAgreement(Number(router.query.index)));
    })();
  }, [router]);

  return <>{agreement ? <AgreementDetails agreement={agreement} /> : null}</>;
};

export default AgreementDetailsPage;
